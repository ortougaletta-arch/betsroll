import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { actions, useStore } from '../../state/useStore';
import { Banner, TopBar } from '../primitives/system';
import { TxStatusOverlay } from './TxStatusOverlay';

export function MobileWithdraw() {
  const nav = useNavigate();
  const balance = useStore((s) => s.balance);
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState('');
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('Polygon');
  const numAmount = Number.parseFloat(amount) || 0;
  const fee = network === 'Polygon' ? 0.05 : network === 'Base' ? 0.1 : 0.2;
  const willReceive = Math.max(0, numAmount - fee);
  const isValidAddr = /^0x[a-fA-F0-9]{6,}$/.test(addr.trim()) || addr.endsWith('.eth');
  const canContinue = numAmount > 0 && numAmount <= balance && isValidAddr;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', overflow: 'auto', paddingBottom: 100 }}>
      <TopBar title="Withdraw" onBack={() => step === 2 ? setStep(1) : nav(-1)} sub={step === 1 ? 'Step 1 of 2 - destination' : 'Step 2 of 2 - review'} />
      {step === 1 ? (
        <div style={{ padding: 16 }}>
          <Label>Send to</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 12 }}>{['Polygon', 'Base', 'Arbitrum'].map((n) => <button key={n} onClick={() => setNetwork(n)} style={{ padding: '10px 6px', borderRadius: 12, background: network === n ? 'rgba(124,92,255,0.10)' : 'var(--bg-1)', border: `1px solid ${network === n ? 'rgba(124,92,255,0.5)' : 'var(--line)'}`, color: 'var(--ink)', fontWeight: 700, fontSize: 12.5 }}>{n}</button>)}</div>
          <Label>Address</Label>
          <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="0x... or name.eth" className="input-xl mono" />
          {addr && !isValidAddr && <div style={{ fontSize: 11, color: 'var(--no)', marginTop: 6 }}>That does not look like a valid address.</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0 6px' }}><Label>Amount</Label><button onClick={() => setAmount(balance.toFixed(2))} style={{ fontSize: 11, color: '#a794ff', fontWeight: 700 }}>Max - ${balance.toFixed(2)}</button></div>
          <input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="input-xl mono" style={{ fontSize: 22, height: 56 }} />
          {numAmount > balance && <div style={{ fontSize: 11, color: 'var(--no)', marginTop: 6 }}>Insufficient balance.</div>}
          <Summary network={network} fee={fee} willReceive={willReceive} />
          <button disabled={!canContinue} onClick={() => setStep(2)} className="btn-primary" style={{ width: '100%', opacity: canContinue ? 1 : 0.4 }}>Review withdrawal</button>
        </div>
      ) : (
        <div style={{ padding: 16 }}>
          <div style={{ padding: 18, borderRadius: 18, background: 'linear-gradient(135deg, #1a1140 0%, #0a0a15 100%)', border: '1px solid rgba(124,92,255,0.3)', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#a794ff', textTransform: 'uppercase', fontWeight: 700 }}>You will send</div>
            <div className="mono" style={{ fontSize: 38, fontWeight: 700, color: '#fff', marginTop: 6 }}>${numAmount.toFixed(2)}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>USDC on {network}</div>
          </div>
          <Summary network={network} fee={fee} willReceive={willReceive} to={addr} />
          <Banner tone="warn" title="Double-check the address" sub="Onchain transfers cannot be reversed." />
          <button onClick={() => { actions.simulateTx({ kind: 'withdraw', amount: numAmount, hash: `0x${Math.random().toString(16).slice(2, 10)}...`, label: `Withdraw to ${addr.slice(0, 8)}...` }); window.setTimeout(() => nav('/wallet'), 100); }} className="btn-primary" style={{ width: '100%', marginTop: 14 }}>Confirm withdrawal</button>
        </div>
      )}
      <TxStatusOverlay />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6 }}>{children}</div>;
}

function Summary({ network, fee, willReceive, to }: { network: string; fee: number; willReceive: number; to?: string }) {
  return <div style={{ padding: 14, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)', margin: '14px 0', fontSize: 12.5 }}>{to && <Row k="To" v={to.length > 18 ? `${to.slice(0, 8)}...${to.slice(-6)}` : to} />}<Row k="Network" v={network} /><Row k="Estimated fee" v={`$${fee.toFixed(2)}`} /><Row k="You will receive" v={`$${willReceive.toFixed(2)} USDC`} bold /></div>;
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><span style={{ color: 'var(--ink-3)' }}>{k}</span><span className="mono" style={{ color: bold ? 'var(--ink)' : 'var(--ink-2)', fontWeight: bold ? 700 : 500 }}>{v}</span></div>;
}
