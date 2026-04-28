import { useNavigate } from 'react-router-dom';
import { GEO_BLOCKED_REGIONS } from '../../../data/system';
import { actions } from '../../../state/useStore';
import { BRLogo } from '../../primitives/BRLogo';
import { Chip } from '../../primitives/Chip';

export function GeoBlockScreen() {
  const nav = useNavigate();
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ flex: 1, padding: '40px 22px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}><BRLogo size={32} /><div style={{ fontWeight: 700, fontSize: 16 }}>Betsroll</div></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
            <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle at 30% 25%, #2a2148 0%, #0a0a15 75%)', border: '1px solid rgba(255,46,132,0.4)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="roll" style={{ position: 'absolute', inset: 6, borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.2)' }} />
              <svg width="80" height="80" viewBox="0 0 80 80" style={{ opacity: 0.5 }}><ellipse cx="40" cy="40" rx="34" ry="34" fill="none" stroke="#a794ff" strokeWidth="0.5" /><ellipse cx="40" cy="40" rx="34" ry="14" fill="none" stroke="#a794ff" strokeWidth="0.5" /><ellipse cx="40" cy="40" rx="14" ry="34" fill="none" stroke="#a794ff" strokeWidth="0.5" /></svg>
              <div style={{ position: 'absolute', width: 90, height: 4, background: 'var(--no)', transform: 'rotate(-35deg)', boxShadow: '0 0 16px var(--no)', borderRadius: 2 }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <Chip label="Detected region" tone="default" />
            <div style={{ fontWeight: 700, fontSize: 24, lineHeight: 1.2, marginTop: 14 }}>Betsroll is not available where you are yet.</div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5, margin: '8px auto 0', maxWidth: 320 }}>We are working with regulators to launch in your region. We will email you the second it goes live.</div>
          </div>
          <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 16, padding: 14 }}>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', letterSpacing: 0.4, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Get notified</div>
            <div style={{ display: 'flex', gap: 8 }}><input placeholder="you@email.com" className="input-xl" style={{ flex: 1, fontSize: 13 }} /><button className="btn-primary" style={{ height: 44, padding: '0 16px' }}>Notify me</button></div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 10, lineHeight: 1.4 }}>Currently restricted: {GEO_BLOCKED_REGIONS.join(' - ')}</div>
          </div>
        </div>
        <button onClick={() => { actions.setGeoBlocked(false); nav('/welcome'); }} className="btn-ghost" style={{ height: 44, marginTop: 16 }}>I am somewhere else - try again</button>
      </div>
    </div>
  );
}
