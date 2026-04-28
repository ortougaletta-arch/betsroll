import { useNavigate } from 'react-router-dom';
import { MARKETS } from '../../data/markets';
import { Icon } from '../primitives/icons';
import { PricePill } from '../primitives/PricePill';
import { TopBar } from '../primitives/system';

export function NotFoundScreen() {
  const nav = useNavigate();
  return (
    <div style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden' }}>
      <div className="onboard-bg" style={{ opacity: 0.6 }} />
      <div style={{ position: 'relative', zIndex: 2, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <TopBar onBack={() => nav('/')} title="" />
        <div style={{ flex: 1, padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative', marginBottom: 28 }}>
            <div className="roll" style={{ width: 120, height: 120, borderRadius: 28, background: 'linear-gradient(135deg, #1a1140, #0a0a15)', border: '1px solid rgba(124,92,255,0.4)', boxShadow: '0 30px 60px rgba(124,92,255,0.3), inset 0 0 30px rgba(124,92,255,0.2)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: 18 }}>
              {[1, 0, 1, 0, 1, 0, 1, 0, 1].map((on, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{on ? <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 0 10px rgba(255,255,255,0.6)' }} /> : null}</div>)}
            </div>
            <div className="mono" style={{ position: 'absolute', top: -16, right: -28, padding: '4px 10px', borderRadius: 999, background: 'var(--no)', color: '#fff', fontSize: 12, fontWeight: 800, transform: 'rotate(12deg)', boxShadow: '0 6px 20px rgba(255,46,132,0.5)' }}>404</div>
          </div>
          <div style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>That roll did not land.</div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5, maxWidth: 280, marginBottom: 24 }}>We could not find that market, profile, or page.</div>
          <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn-primary" onClick={() => nav('/')}>Back to feed</button>
            <button onClick={() => nav('/markets')} className="btn-ghost">{Icon.search(14)} Search markets</button>
          </div>
          <div style={{ marginTop: 28, padding: 16, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)', width: '100%', maxWidth: 300 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, textAlign: 'left' }}>Maybe try</div>
            {MARKETS.slice(0, 2).map((m) => <button key={m.id} onClick={() => nav(`/market/${m.id}`)} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid var(--line)' }}><span style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>{m.q}</span><PricePill side="yes" price={m.yes} compact /></button>)}
          </div>
        </div>
      </div>
    </div>
  );
}
