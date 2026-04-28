import { useNavigate } from 'react-router-dom';
import { actions } from '../../../state/useStore';
import { BRLogo } from '../../primitives/BRLogo';
import { FloatingChips } from './FloatingChips';

export function WelcomeScreen() {
  const nav = useNavigate();
  return (
    <div style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="onboard-bg" />
      <FloatingChips />
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', padding: '64px 24px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 20 }}>
          <div style={{ position: 'relative' }}>
            <BRLogo size={84} spin />
            <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '1.5px dashed rgba(124,92,255,0.4)', animation: 'roll 24s linear infinite reverse' }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 44, color: '#fff', letterSpacing: 0 }}>Betsroll</div>
          <div style={{ fontSize: 12, color: '#a794ff', letterSpacing: 4, fontWeight: 600, textTransform: 'uppercase' }}>Roll the future</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center', marginBottom: 24, padding: '14px 32px', background: 'linear-gradient(180deg, rgba(8,8,16,0) 0%, rgba(8,8,16,0.85) 20%, rgba(8,8,16,0.85) 80%, rgba(8,8,16,0) 100%)', marginLeft: -24, marginRight: -24 }}>
          <div style={{ fontWeight: 700, fontSize: 26, color: 'var(--ink)', lineHeight: 1.15, marginBottom: 10 }}>The social market on what happens next.</div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5, maxWidth: 320, margin: '0 auto' }}>Discover markets in a feed. Validate with a swipe. Trade YES or NO with friends.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '12px 0', marginBottom: 18, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--line)', borderRadius: 14, backdropFilter: 'blur(8px)' }}>
          {([['41k', 'rollers'], ['$184M', 'volume'], ['12.4k', 'markets']] as const).map(([n, label], i) => (
            <div key={label} style={{ textAlign: 'center', padding: '4px 0', borderRight: i < 2 ? '1px solid var(--line)' : 'none' }}>
              <div className="mono" style={{ fontWeight: 700, fontSize: 15 }}>{n}</div>
              <div style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-primary" onClick={() => nav('/welcome/signin')}>Get started</button>
          <button className="btn-ghost" onClick={() => { actions.enterAsGuest(); nav('/'); }} style={{ background: 'transparent', border: 'none', color: 'var(--ink-3)', height: 38 }}>Browse as guest</button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 10.5, color: 'var(--ink-3)', lineHeight: 1.5 }}>By continuing you agree to our Terms & Privacy.<br />Trading involves risk. 18+ where permitted.</div>
      </div>
    </div>
  );
}
