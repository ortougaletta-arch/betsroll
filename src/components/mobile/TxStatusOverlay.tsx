import { actions, useStore } from '../../state/useStore';
import type { TxModal } from '../../state/types';
import { Icon } from '../primitives/icons';
import { TxStatusBadge } from '../primitives/system';

export function TxStatusOverlay() {
  const ctx = useStore((s) => s.overlay === 'txStatus' ? s.overlayCtx as TxModal : null);
  if (!ctx) return null;

  const config = {
    pending: { title: 'Submitting onchain...', sub: 'Watching the chain. This usually takes a few seconds.', icon: <div className="ring-spin" /> },
    confirmed: { title: ctx.kind === 'deposit' ? 'Funds landed' : 'Withdrawal confirmed', sub: ctx.kind === 'deposit' ? 'Your balance is updated and ready to roll.' : 'Onchain and on the way.', icon: <div className="scale-in" style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(158,240,26,0.12)', border: '2px solid var(--yes)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.check(34, 'var(--yes)')}</div> },
    failed: { title: 'Transaction failed', sub: 'The chain rejected this transfer. No funds moved.', icon: <div className="scale-in" style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,46,132,0.12)', border: '2px solid var(--no)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.close(34, 'var(--no)')}</div> },
  }[ctx.state];

  return (
    <div className="sheet-backdrop" onClick={ctx.state !== 'pending' ? () => actions.closeOverlay() : undefined}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 8px 0' }}>
          {config.icon}
          <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)', marginTop: 18 }}>{config.title}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.5, maxWidth: 300 }}>{config.sub}</div>
          <div style={{ width: '100%', marginTop: 18, padding: 14, borderRadius: 14, background: 'var(--bg-2)', border: '1px solid var(--line)', textAlign: 'left' }}>
            <Row k="Type" v={ctx.kind} />
            <Row k="Amount" v={`$${ctx.amount.toFixed(2)} USDC`} bold />
            {ctx.hash && <Row k="Hash" v={ctx.hash} mono />}
            <Row k="Status" v={<TxStatusBadge status={ctx.state} />} />
          </div>
          {ctx.state !== 'pending' && <button className="btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => actions.closeOverlay()}>Close</button>}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, bold, mono }: { k: string; v: React.ReactNode; bold?: boolean; mono?: boolean }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '8px 0' }}><span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{k}</span><span className={mono ? 'mono' : ''} style={{ fontSize: bold ? 14 : 12.5, color: bold ? 'var(--ink)' : 'var(--ink-2)', fontWeight: bold ? 700 : 500 }}>{v}</span></div>;
}
