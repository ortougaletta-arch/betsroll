import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PLACEHOLDER_WALLET_ADDRESS } from '../../data/system';
import { actions } from '../../state/useStore';
import { Icon } from '../primitives/icons';
import { Banner, TopBar } from '../primitives/system';
import { TxStatusOverlay } from './TxStatusOverlay';

const ADDR = PLACEHOLDER_WALLET_ADDRESS;

export function MobileDeposit() {
  const nav = useNavigate();
  const [network, setNetwork] = useState('Polygon');
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard?.writeText(ADDR);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', overflow: 'auto', paddingBottom: 100 }}>
      <TopBar title="Deposit" onBack={() => nav(-1)} sub="Funds arrive in ~30s onchain" />
      <div style={{ padding: 16 }}>
        <Label>Network</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 14 }}>
          {['Polygon', 'Base', 'Arbitrum'].map((n) => <button key={n} onClick={() => setNetwork(n)} style={{ padding: '10px 6px', borderRadius: 12, background: network === n ? 'rgba(124,92,255,0.10)' : 'var(--bg-1)', border: `1px solid ${network === n ? 'rgba(124,92,255,0.5)' : 'var(--line)'}`, color: 'var(--ink)', fontWeight: 700, fontSize: 12 }}>{n}</button>)}
        </div>
        <div style={{ padding: 18, borderRadius: 18, background: 'var(--bg-1)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
          <FakeQR />
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 12, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>Send USDC to this address</div>
        </div>
        <div style={{ padding: 12, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.4, fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>Your wallet - {network}</div><div className="mono" style={{ fontSize: 12.5, wordBreak: 'break-all' }}>{ADDR}</div></div>
          <button onClick={copy} style={{ padding: '8px 12px', borderRadius: 10, background: copied ? 'rgba(158,240,26,0.12)' : 'rgba(124,92,255,0.12)', color: copied ? 'var(--yes)' : '#a794ff', border: `1px solid ${copied ? 'rgba(158,240,26,0.3)' : 'rgba(124,92,255,0.3)'}`, fontWeight: 700, fontSize: 11.5 }}>{copied ? 'Copied' : 'Copy'}</button>
        </div>
        <button className="btn-primary" style={{ width: '100%', height: 44, marginBottom: 12 }} onClick={() => actions.simulateTx({ kind: 'deposit', amount: 100, hash: '0x4a3f...91c2', label: `Deposit - ${network}` })}>Simulate $100 deposit</button>
        <Banner tone="warn" icon={Icon.check(16)} title="USDC only on this network" sub={`Send only USDC on ${network}. Other tokens or networks may be lost.`} />
      </div>
      <TxStatusOverlay />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6 }}>{children}</div>;
}

function FakeQR() {
  return <div style={{ width: 168, height: 168, padding: 8, borderRadius: 12, background: '#fff', display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: 2 }}>{Array.from({ length: 169 }, (_, i) => <span key={i} style={{ background: (i * 17 + i % 7) % 5 < 2 ? '#0a0a15' : '#fff' }} />)}</div>;
}
