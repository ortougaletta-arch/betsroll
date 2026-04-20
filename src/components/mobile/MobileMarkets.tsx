import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllMarkets, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { Chip } from '../primitives/Chip';
import { Icon } from '../primitives/icons';
import { Sparkline } from '../primitives/Sparkline';
import { TierBadge } from '../primitives/TierBadge';
import { ValidationBar } from '../primitives/ValidationBar';

const CATS = ['All', 'Crypto', 'Finance', 'Sports', 'Tech', 'Meme'];

export function MobileMarkets() {
  const nav = useNavigate();
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState<'Top' | 'New' | 'Closing'>('Top');
  const boosts = useStore((s) => s.validationBoost);
  const MARKETS = useAllMarkets();

  const liveProgress = (m: (typeof MARKETS)[number]) =>
    Math.min(100, (m.progress ?? 100) + (boosts[m.id] ?? 0));

  const filtered = cat === 'All' ? MARKETS : MARKETS.filter((m) => m.cat === cat);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', paddingBottom: 100 }}>
      <div style={{
        padding: '12px 16px 10px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '1px solid var(--line)',
        background: 'rgba(12,12,22,0.92)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 5,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>All markets</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: -0.4 }}>Markets <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 14, fontWeight: 600 }}>· {filtered.length}</span></div>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.search(16)}</button>
      </div>

      <div style={{ padding: '10px 14px 6px', display: 'flex', gap: 4, background: 'var(--bg)' }}>
        {(['Top', 'New', 'Closing'] as const).map((s) => (
          <button key={s} onClick={() => setSort(s)} style={{
            flex: 1, height: 32, borderRadius: 10,
            background: sort === s ? 'var(--bg-2)' : 'transparent',
            border: sort === s ? '1px solid var(--line)' : '1px solid transparent',
            color: sort === s ? 'var(--ink)' : 'var(--ink-3)',
            fontSize: 12, fontWeight: 600,
          }}>{s}</button>
        ))}
      </div>

      <div style={{ padding: '8px 14px 0', display: 'flex', gap: 6, overflowX: 'auto' }} className="noscroll">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{
            flexShrink: 0,
            padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
            background: cat === c ? 'var(--bg-3)' : 'transparent',
            border: `1px solid ${cat === c ? 'transparent' : 'var(--line)'}`,
            color: cat === c ? 'var(--ink)' : 'var(--ink-2)',
          }}>{c}</button>
        ))}
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => nav(`/market/${m.id}`)}
            style={{
              textAlign: 'left', width: '100%',
              padding: 14, borderRadius: 16,
              background: 'linear-gradient(180deg, var(--bg-1), var(--bg))',
              border: '1px solid var(--line)',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name={m.creator.av} size={24} ring={m.creator.tier === 'King' ? '#ff6bff' : m.creator.tier === 'Gold' ? 'var(--gold)' : null} />
              <span style={{ fontSize: 11.5, fontWeight: 700 }}>{m.creator.handle}</span>
              <TierBadge tier={m.creator.tier} size="sm" />
              <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>· {m.time}</span>
              <div style={{ flex: 1 }} />
              <Chip label={m.cat} tone="brand" />
            </div>

            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.25 }}>{m.q}</div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'center',
              padding: '8px 10px', background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--line)', borderRadius: 10,
            }}>
              <div>
                <div style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>YES</div>
                <div className="mono" style={{ color: 'var(--yes)', fontWeight: 700, fontSize: 18, lineHeight: 1 }}>{Math.round(m.yes * 100)}¢</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>NO</div>
                <div className="mono" style={{ color: 'var(--no)', fontWeight: 700, fontSize: 18, lineHeight: 1 }}>{Math.round(m.no * 100)}¢</div>
              </div>
              <Sparkline data={m.spark} color={m.bull > 50 ? 'var(--yes)' : 'var(--no)'} width={64} height={28} />
            </div>

            {m.status === 'live' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, color: 'var(--ink-3)' }}>
                <span className="pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--yes)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--yes)', boxShadow: '0 0 6px var(--yes)' }} />LIVE
                </span>
                <span>· resolves in</span>
                <span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>{m.resolvesIn}</span>
                <div style={{ flex: 1 }} />
                <span className="mono">${(m.vol24 / 1000).toFixed(0)}k / 24h</span>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 9.5, color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4, letterSpacing: 0.3 }}>
                  Validating · {liveProgress(m)}% to go live
                </div>
                <ValidationBar pct={liveProgress(m)} />
              </div>
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
            No markets in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
