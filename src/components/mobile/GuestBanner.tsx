import { actions, useStore } from '../../state/useStore';

export function GuestBanner() {
  const isGuest = useStore((s) => s.isGuest);
  if (!isGuest) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 14px',
      background: 'linear-gradient(90deg, rgba(124,92,255,0.14), rgba(76,201,255,0.10))',
      borderBottom: '1px solid rgba(124,92,255,0.25)',
      backdropFilter: 'blur(12px)',
      fontSize: 12,
      color: 'var(--ink-2)',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', boxShadow: '0 0 8px var(--brand)', flexShrink: 0 }} />
      <span style={{ flex: 1, fontWeight: 500 }}>
        <span style={{ color: 'var(--ink)', fontWeight: 700 }}>Demo mode.</span> Browse freely - save to trade.
      </span>
      <button onClick={() => actions.triggerDeposit('manual')} style={{
        padding: '5px 11px',
        borderRadius: 999,
        background: 'linear-gradient(135deg, #7c5cff, #4cc9ff)',
        color: '#fff',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.3,
      }}>Save account</button>
    </div>
  );
}
