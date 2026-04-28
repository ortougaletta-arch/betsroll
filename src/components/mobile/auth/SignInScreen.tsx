import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { actions } from '../../../state/useStore';
import { BRLogo } from '../../primitives/BRLogo';
import { TopBar } from '../../primitives/system';

export function SignInScreen() {
  const nav = useNavigate();
  const [busy, setBusy] = useState<string | null>(null);

  const start = (provider: string) => {
    if (provider === 'guest') {
      actions.enterAsGuest();
      nav('/onboarding');
      return;
    }
    setBusy(provider);
    window.setTimeout(() => {
      actions.setAuthProvider(provider);
      setBusy(null);
      nav('/welcome/ready');
    }, 900);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="onboard-bg" style={{ opacity: 0.6 }} />
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar onBack={() => nav('/welcome')} title="" right={<button onClick={() => nav('/welcome')} style={{ color: 'var(--ink-3)', fontSize: 12, fontWeight: 600 }}>Cancel</button>} />
        <div style={{ flex: 1, padding: '24px 22px', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <BRLogo size={42} />
            <div><div style={{ fontWeight: 700, fontSize: 22 }}>Welcome to Betsroll</div><div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>One tap. No seed phrase. Wallet on us.</div></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
            <ProviderBtn id="apple" label="Continue with Apple" bg="#fff" fg="#000" busy={busy} onClick={start} primary icon={<AppleIcon />} />
            <ProviderBtn id="google" label="Continue with Google" bg="rgba(255,255,255,0.06)" busy={busy} onClick={start} icon={<GoogleIcon />} />
            <ProviderBtn id="email" label="Continue with email" bg="rgba(255,255,255,0.06)" busy={busy} onClick={start} icon={<MailIcon />} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0 18px' }}><div style={{ flex: 1, height: 1, background: 'var(--line)' }} /><div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: 0.6, fontWeight: 600 }}>OR</div><div style={{ flex: 1, height: 1, background: 'var(--line)' }} /></div>
          <button onClick={() => start('guest')} disabled={!!busy} style={{ width: '100%', height: 46, borderRadius: 14, background: 'transparent', border: '1px dashed var(--line)', color: 'var(--ink-2)', fontWeight: 600, fontSize: 13 }}>Browse as guest</button>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.5, textAlign: 'center' }}>Guests can read and swipe. Trading and creating markets unlock once you save an account.</div>
        </div>
      </div>
    </div>
  );
}

function ProviderBtn({ id, label, icon, bg, fg = '#fff', primary = false, busy, onClick }: { id: string; label: string; icon: React.ReactNode; bg: string; fg?: string; primary?: boolean; busy: string | null; onClick: (id: string) => void }) {
  return (
    <button onClick={() => onClick(id)} disabled={!!busy} style={{ width: '100%', height: 50, borderRadius: 14, background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontWeight: 700, fontSize: 14, border: primary ? 'none' : '1px solid var(--line)', opacity: busy && busy !== id ? 0.4 : 1 }}>
      {busy === id ? <div className="ring-spin" style={{ width: 18, height: 18, borderWidth: 2 }} /> : icon}
      {busy === id ? 'Connecting...' : label}
    </button>
  );
}

function AppleIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M16.4 12.7c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-2-3.6-2-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.3-.9-1.7 0-3.2 1-4.1 2.5-1.7 3-.4 7.4 1.3 9.8.8 1.2 1.7 2.5 3 2.4 1.2-.1 1.7-.8 3.1-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.4-2.8-.1 0-2.6-1-2.4-3.7zM14 5.4c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.2 1.8-1 2.9 1 0 2.1-.5 2.7-1.3z" /></svg>;
}
function GoogleIcon() {
  return <span style={{ fontWeight: 800, color: '#4285f4' }}>G</span>;
}
function MailIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" /></svg>;
}
