import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { actions, useStore } from '../../state/useStore';
import type { DepositTrigger } from '../../state/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HEADLINES: Record<DepositTrigger, { eyebrow: string; title: string }> = {
  trade: { eyebrow: 'One step to roll', title: 'Save your account to place this trade.' },
  create: { eyebrow: 'One step to publish', title: 'Save your account to roll a market.' },
  manual: { eyebrow: 'Welcome to Betsroll', title: 'Save your account to fund your wallet.' },
};

export function EmailCaptureSheet() {
  const nav = useNavigate();
  const showEmailSheet = useStore((s) => s.showEmailSheet);
  const trigger = useStore((s) => s.depositTrigger ?? 'manual');
  const savedEmail = useStore((s) => s.guestEmail);
  const [email, setEmail] = useState(savedEmail);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const valid = EMAIL_RE.test(email.trim());
  const copy = HEADLINES[trigger];

  useEffect(() => {
    if (!showEmailSheet) return;
    setEmail(savedEmail);
    const id = window.setTimeout(() => inputRef.current?.focus(), 150);
    return () => window.clearTimeout(id);
  }, [savedEmail, showEmailSheet]);

  if (!showEmailSheet) return null;

  const submit = () => {
    if (!valid || busy) return;
    setBusy(true);
    window.setTimeout(() => {
      actions.captureEmail(email.trim());
      setBusy(false);
      nav('/wallet/deposit');
    }, 600);
  };

  return (
    <div className="sheet-backdrop" onClick={() => actions.dismissEmailSheet()}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px 12px', borderBottom: '1px solid var(--line)', marginBottom: 16 }}>
          <button onClick={() => actions.dismissEmailSheet()} style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 600, padding: 4 }}>Cancel</button>
          <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>Save account</div>
          <div style={{ width: 50 }} />
        </div>

        <div style={{ padding: '0 4px', marginBottom: 16 }}>
          <div style={{ fontSize: 10.5, color: '#a794ff', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>{copy.eyebrow}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>{copy.title}</div>
          <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.45 }}>
            We'll create a non-custodial wallet and email your magic link. No password, no seed phrase.
          </div>
        </div>

        <div style={{ padding: '0 4px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6 }}>Email</div>
          <input
            ref={inputRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            placeholder="you@email.com"
            type="email"
            autoComplete="email"
            className="input-xl"
            style={{ fontSize: 16 }}
          />
          {email && !valid && <div style={{ fontSize: 11, color: 'var(--no)', marginTop: 6 }}>Enter a valid email.</div>}
        </div>

        <div style={{ padding: '0 4px', marginBottom: 16, display: 'flex', gap: 6 }}>
          {['Non-custodial', 'Magic link', 'Skip seed phrase'].map((label, i) => (
            <div key={label} style={{ flex: 1, padding: '7px 4px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 10.5, color: 'var(--ink-2)', fontWeight: 600 }}>
              <span>{['🔒', '✉️', '⚡'][i]}</span>{label}
            </div>
          ))}
        </div>

        <div style={{ padding: '0 4px' }}>
          <button
            onClick={submit}
            disabled={!valid || busy}
            style={{
              width: '100%',
              height: 54,
              borderRadius: 14,
              background: valid && !busy ? 'linear-gradient(135deg, #7c5cff, #4cc9ff)' : 'rgba(255,255,255,0.06)',
              color: valid && !busy ? '#fff' : 'var(--ink-3)',
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: 0.3,
              boxShadow: valid && !busy ? '0 10px 28px rgba(124,92,255,0.35)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {busy ? <><div className="ring-spin" style={{ width: 16, height: 16, borderWidth: 2 }} />Sending magic link...</> : 'Continue -> Deposit'}
          </button>
        </div>
      </div>
    </div>
  );
}
