import { useState } from 'react';
import { actions, useStore } from '../../state/useStore';
import { TopBar } from '../primitives/system';

export function NetworkErrorScreen() {
  const [retrying, setRetrying] = useState(false);
  const positions = useStore((s) => s.positions);
  const retry = () => {
    setRetrying(true);
    window.setTimeout(() => {
      setRetrying(false);
      actions.setOffline(false);
    }, 1100);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <TopBar title="" onBack={() => actions.setOffline(false)} />
      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,194,76,0.06)', border: '1px solid rgba(255,194,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 24 }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="M2 8c5-5 15-5 20 0M5 11.5c3.5-3.5 10.5-3.5 14 0M8.5 15c1.5-1.5 5.5-1.5 7 0M12 19h0" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" /></svg>
          <div style={{ position: 'absolute', width: 70, height: 3, background: 'var(--no)', transform: 'rotate(-30deg)', boxShadow: '0 0 12px var(--no)', borderRadius: 2 }} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 24, marginBottom: 8 }}>You are offline.</div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5, maxWidth: 300, marginBottom: 22 }}>Betsroll needs a live connection to roll. Check your signal; positions and balances stay cached.</div>
        <button onClick={retry} disabled={retrying} className="btn-primary" style={{ width: 220 }}>{retrying ? <><div className="ring-spin" style={{ width: 16, height: 16, borderWidth: 2 }} /> Retrying...</> : 'Try again'}</button>
        <div style={{ marginTop: 22, padding: 14, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)', width: '100%', maxWidth: 320, textAlign: 'left' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>While you wait</div>
          <Row label="Open positions cached" value={String(positions.length)} ok />
          <Row label="Last sync" value="23s ago" ok />
          <Row label="Trades blocked until reconnect" value="-" />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: ok ? 'var(--yes)' : 'var(--gold)' }} /><span style={{ flex: 1, fontSize: 12, color: 'var(--ink-2)' }}>{label}</span><span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>{value}</span></div>;
}
