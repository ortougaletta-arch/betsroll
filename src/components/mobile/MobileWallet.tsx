import { useNavigate } from 'react-router-dom';
import { TRANSACTIONS, type Transaction } from '../../data/system';
import { ME } from '../../data/user';
import { actions, useStore } from '../../state/useStore';
import { Icon } from '../primitives/icons';
import { EmptyState, SkelWalletRow, TopBar, TxStatusBadge } from '../primitives/system';
import { TxStatusOverlay } from './TxStatusOverlay';

export function MobileWallet() {
  const nav = useNavigate();
  const state = useStore();
  const positionsValue = state.positions.reduce((sum, p) => sum + p.size * (p.cur / p.entry), 0);
  const equity = state.balance + positionsValue;
  const startDeposit = () => {
    const result = actions.triggerDeposit('manual');
    if (!result.guest) nav('/wallet/deposit');
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', overflow: 'auto', paddingBottom: 100 }}>
      <TopBar title="Wallet" onBack={() => nav(-1)} />
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{ padding: 18, borderRadius: 20, background: 'linear-gradient(135deg, #1a1140 0%, #0c0a26 50%, #0a0a15 100%)', border: '1px solid rgba(124,92,255,0.3)', position: 'relative', overflow: 'hidden' }}>
          <div className="roll" style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', border: '1px dashed rgba(124,92,255,0.25)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, color: '#a794ff', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700 }}>Total equity - USDC</div>
            <div className="mono" style={{ fontSize: 38, fontWeight: 700, color: '#fff', lineHeight: 1, marginTop: 14 }}>{state.settings.hideBalance ? '******' : `$${equity.toFixed(2)}`}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}><span className="mono" style={{ fontSize: 11.5, color: 'var(--yes)', fontWeight: 700 }}>+ $24.18 (+0.51%)</span><span style={{ fontSize: 11, color: 'var(--ink-3)' }}>last 24h</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 18 }}>
              <Quick label="Deposit" icon={Icon.wallet(16)} onClick={startDeposit} />
              <Quick label="Withdraw" icon={Icon.share(16)} onClick={() => { actions.openWithdraw(); nav('/wallet/withdraw'); }} />
              <Quick label="Send" icon={Icon.share(16)} />
              <Quick label="Earn" icon={Icon.spark(16)} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Sub label="USDC available" v={`$${state.balance.toFixed(2)}`} sub="ready to roll" />
        <Sub label="Freebets" v={`$${state.freebet.toFixed(2)}`} sub="active rewards" tone="brand" />
        <Sub label="In positions" v={`$${positionsValue.toFixed(2)}`} sub={`${state.positions.length} open`} />
        <Sub label="Creator earnings" v={`$${ME.creatorEarnings.toFixed(2)}`} sub="lifetime" tone="gold" />
      </div>
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Activity</div>
        <button style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600 }}>Filter</button>
      </div>
      {state.skelDemo ? [1, 2, 3].map((i) => <SkelWalletRow key={i} />) : TRANSACTIONS.length === 0 ? (
        <EmptyState icon={Icon.wallet(28)} title="No activity yet" sub="Your deposits, trades and creator fees will show up here." />
      ) : TRANSACTIONS.map((tx) => <TxRow key={tx.id} tx={tx} />)}
      <TxStatusOverlay />
    </div>
  );
}

function Quick({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '8px 0', color: '#fff', fontWeight: 600, fontSize: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}><span style={{ color: '#a794ff' }}>{icon}</span>{label}</button>;
}

function Sub({ label, v, sub, tone }: { label: string; v: string; sub: string; tone?: 'brand' | 'gold' }) {
  const color = tone === 'brand' ? '#a794ff' : tone === 'gold' ? 'var(--gold)' : 'var(--ink-2)';
  return <div style={{ padding: 12, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)' }}><div style={{ color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{label}</div><div className="mono" style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{v}</div><div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div></div>;
}

function TxRow({ tx }: { tx: Transaction }) {
  const isIn = tx.amount > 0;
  return (
    <button onClick={() => actions.showOverlay('txStatus', { state: tx.status, kind: tx.kind, amount: Math.abs(tx.amount), hash: tx.hash, label: tx.label })} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: isIn ? 'rgba(158,240,26,0.10)' : 'rgba(255,255,255,0.05)', color: isIn ? 'var(--yes)' : 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{tx.kind === 'deposit' ? Icon.wallet(14) : Icon.trend(14)}</div>
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{tx.kind}<TxStatusBadge status={tx.status} /></div><div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.label || (tx.net ? `${tx.net} - ${tx.hash}` : tx.asset)} - {tx.time}</div></div>
      <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: isIn ? 'var(--yes)' : 'var(--ink)' }}>{isIn ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}</div>
    </button>
  );
}
