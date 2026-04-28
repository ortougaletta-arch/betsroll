import { useNavigate } from 'react-router-dom';
import { actions } from '../../../state/useStore';
import { BRLogo } from '../../primitives/BRLogo';

const COLORS = ['var(--yes)', 'var(--brand)', 'var(--gold)', 'var(--brand-2)', 'var(--no)'];

export function WalletReadyScreen() {
  const nav = useNavigate();
  const finish = () => {
    actions.completeOnboarding();
    nav('/');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden' }}>
      <div className="onboard-bg" />
      {Array.from({ length: 28 }, (_, i) => (
        <div key={i} className="confetti-piece" style={{ left: `${(i * 37) % 100}%`, background: COLORS[i % COLORS.length], animationDelay: `${(i % 8) * 0.05}s`, animationDuration: `${1.4 + (i % 5) * 0.12}s` }} />
      ))}
      <div style={{ position: 'relative', zIndex: 2, minHeight: '100dvh', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="scale-in" style={{ width: '100%', maxWidth: 320, padding: 22, borderRadius: 22, background: 'linear-gradient(135deg, #1a1140 0%, #0a0a15 60%)', border: '1px solid rgba(124,92,255,0.4)', position: 'relative', overflow: 'hidden', marginBottom: 28 }}>
          <div className="glow-pulse" style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,92,255,0.45), transparent 70%)' }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div><div style={{ fontSize: 10.5, color: '#a794ff', letterSpacing: 0.6, fontWeight: 700, textTransform: 'uppercase' }}>Your wallet</div><div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>0x9b2a...71fd</div></div>
            <BRLogo size={32} />
          </div>
          <div style={{ position: 'relative' }}><div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: 0.5, fontWeight: 600, textTransform: 'uppercase' }}>Welcome bonus</div><div className="mono" style={{ fontSize: 38, fontWeight: 700, color: '#fff', lineHeight: 1.1, marginTop: 4 }}>$5.00</div><div style={{ fontSize: 12, color: 'var(--yes)', fontWeight: 600, marginTop: 4 }}>Freebet - use within 24h</div></div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 6 }}><div style={{ fontWeight: 800, fontSize: 26 }}>You are in.</div><div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5, marginTop: 8, maxWidth: 280 }}>We made you a non-custodial wallet. No seed phrase. Backed by your sign-in.</div></div>
        <div style={{ flex: 1 }} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-primary" onClick={finish}>Show me how it works</button>
          <button onClick={finish} style={{ height: 38, color: 'var(--ink-3)', fontSize: 12, fontWeight: 600 }}>Skip - take me to the feed</button>
        </div>
      </div>
    </div>
  );
}
