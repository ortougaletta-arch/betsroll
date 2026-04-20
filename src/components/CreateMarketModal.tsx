import { useState } from 'react';
import { actions } from '../state/useStore';
import { BRLogo } from './primitives/BRLogo';
import { Chip } from './primitives/Chip';
import { Icon } from './primitives/icons';

type Props = { onClose: () => void; onCreated: (id: string) => void };

const CATS = ['Crypto', 'Finance', 'Sports', 'Tech', 'Meme', 'Politics', 'Culture'] as const;

export function CreateMarketModal({ onClose, onCreated }: Props) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<(typeof CATS)[number]>('Crypto');
  const [resolvesIn, setResolvesIn] = useState('7d');
  const [yesCents, setYesCents] = useState(50);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = () => {
    setErr(null);
    setSubmitting(true);
    const res = actions.createMarket({
      q, cat, resolvesIn,
      yesPrice: yesCents / 100,
    });
    setSubmitting(false);
    if (!res.ok) {
      setErr(res.reason === 'short-question' ? 'Question must be at least 10 characters.' : 'YES price must be between 1¢ and 99¢.');
      return;
    }
    onCreated(res.id);
  };

  const questionValid = q.trim().length >= 10;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          background: 'linear-gradient(180deg, var(--bg-1), var(--bg))',
          border: '1px solid var(--line-2)',
          borderRadius: 24,
          padding: 20,
          position: 'relative',
          maxHeight: '90dvh', overflowY: 'auto',
        }}
        className="noscroll"
      >
        <div style={{ position: 'absolute', top: -80, right: -80, width: 220, height: 220, borderRadius: '50%', border: '1px dashed rgba(124,92,255,0.18)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <BRLogo size={36} spin />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>New market</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>Roll your own</div>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--bg-2)', color: 'var(--ink-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.close(18)}</button>
        </div>

        <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
          Yes / No question
        </div>
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. Will SpaceX launch Starship to orbit before June 2026?"
          rows={3}
          style={{
            width: '100%', padding: 12, borderRadius: 12,
            background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line)',
            color: 'var(--ink)', fontSize: 15, lineHeight: 1.35, fontFamily: 'var(--display)',
            outline: 'none', resize: 'vertical',
          }}
        />
        <div style={{ marginTop: 6, fontSize: 10.5, color: questionValid ? 'var(--yes)' : 'var(--ink-3)' }}>
          {q.length}/10 min · must resolve to YES or NO
        </div>

        <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600, marginTop: 16, marginBottom: 8 }}>
          Category
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                background: cat === c ? 'var(--bg-3)' : 'transparent',
                border: `1px solid ${cat === c ? 'transparent' : 'var(--line)'}`,
                color: cat === c ? 'var(--ink)' : 'var(--ink-2)',
              }}
            >{c}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
              Resolves in
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['1d', '7d', '30d', '90d'].map((r) => (
                <button
                  key={r}
                  onClick={() => setResolvesIn(r)}
                  style={{
                    flex: 1, height: 32, borderRadius: 8,
                    background: resolvesIn === r ? 'var(--bg-3)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--line)',
                    color: resolvesIn === r ? 'var(--ink)' : 'var(--ink-2)',
                    fontSize: 11, fontWeight: 600,
                  }}
                >{r}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
              Initial YES price
            </div>
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '0 12px', height: 32, borderRadius: 8,
              background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line)',
            }}>
              <input
                type="number" min={1} max={99}
                value={yesCents}
                onChange={(e) => setYesCents(Math.max(1, Math.min(99, Number(e.target.value) || 50)))}
                className="mono"
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--ink)', fontSize: 14, fontWeight: 700, width: '100%',
                  fontFamily: 'var(--mono)',
                }}
              />
              <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 12 }}>¢</span>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 18, padding: 14, borderRadius: 14,
          background: 'rgba(255,216,107,0.06)', border: '1px solid rgba(255,216,107,0.25)',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <Chip label="Betsroller" tone="gold" />
          <div style={{ flex: 1, fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
            You earn <b style={{ color: 'var(--gold)' }}>1%</b> of every trade on this market as creator fees.
            Goes live after <b style={{ color: 'var(--ink)' }}>100</b> community approvals.
          </div>
        </div>

        {err && (
          <div style={{
            marginTop: 12, padding: '10px 14px', borderRadius: 10,
            background: 'rgba(255,46,132,0.1)', border: '1px solid rgba(255,46,132,0.3)',
            color: 'var(--no)', fontSize: 12, fontWeight: 600,
          }}>{err}</div>
        )}

        <button
          onClick={submit}
          disabled={!questionValid || submitting}
          style={{
            width: '100%', height: 50, borderRadius: 14, marginTop: 16,
            background: questionValid
              ? 'linear-gradient(135deg, #7c5cff, #4cc9ff)'
              : 'rgba(255,255,255,0.05)',
            color: questionValid ? '#fff' : 'var(--ink-3)',
            fontWeight: 700, fontSize: 15, letterSpacing: 0.3,
            boxShadow: questionValid ? '0 10px 30px rgba(124,92,255,0.35)' : 'none',
            cursor: questionValid ? 'pointer' : 'not-allowed',
          }}
        >🎲 Roll this market into validation</button>
      </div>
    </div>
  );
}
