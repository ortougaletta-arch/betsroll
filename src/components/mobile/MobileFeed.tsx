import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MARKETS } from '../../data/markets';
import { actions, useStore } from '../../state/useStore';
import { BRLogo } from '../primitives/BRLogo';
import { Icon } from '../primitives/icons';
import { SwipeableCard } from './SwipeableCard';

export function MobileFeed() {
  const nav = useNavigate();
  const [idx, setIdx] = useState(0);
  const [flash, setFlash] = useState<null | 'yes' | 'no'>(null);
  const [tab, setTab] = useState<'Top' | 'New' | 'Following'>('Top');
  const boosts = useStore((s) => s.validationBoost);

  const visible = MARKETS.slice(idx, idx + 3);

  const doSwipe = (dir: 'yes' | 'no') => {
    const m = MARKETS[idx];
    if (!m) return;
    actions.voteMarket(m.id, dir);
    setFlash(dir);
    setTimeout(() => setFlash(null), 600);
    setIdx((i) => Math.min(i + 1, MARKETS.length));
  };

  const liveProgress = (m: (typeof MARKETS)[number]) =>
    Math.min(100, (m.progress ?? 100) + (boosts[m.id] ?? 0));

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', display: 'flex', flexDirection: 'column', paddingBottom: 100 }}>
      <div style={{
        padding: '12px 16px 10px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--line)',
        background: 'rgba(12,12,22,0.92)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 5,
      }}>
        <BRLogo size={32} spin />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Betsroll</div>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600, marginTop: -1 }}>Roll the future</div>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.search(16)}</button>
        <button style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {Icon.bell(16)}
          <span style={{ position: 'absolute', top: 8, right: 9, width: 6, height: 6, borderRadius: '50%', background: 'var(--no)' }} />
        </button>
      </div>

      <div style={{ padding: '10px 16px 4px', display: 'flex', gap: 6 }}>
        {(['Top', 'New', 'Following'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, height: 34, borderRadius: 10,
            background: tab === t ? 'var(--bg-2)' : 'transparent',
            border: tab === t ? '1px solid var(--line)' : '1px solid transparent',
            color: tab === t ? 'var(--ink)' : 'var(--ink-3)',
            fontSize: 12.5, fontWeight: 600, letterSpacing: 0.2,
          }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, position: 'relative', padding: '12px 14px 0' }}>
        <div style={{ position: 'relative', width: '100%', height: 520 }}>
          {idx >= MARKETS.length ? (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 24,
              background: 'var(--bg-1)', border: '1px dashed var(--line)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, textAlign: 'center',
            }}>
              <BRLogo size={56} />
              <div style={{ fontSize: 18, fontWeight: 600 }}>All caught up</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', maxWidth: 240 }}>Fresh rolls drop every hour.</div>
              <button onClick={() => setIdx(0)} style={{
                marginTop: 8, padding: '10px 18px', borderRadius: 12,
                background: 'linear-gradient(135deg, #7c5cff, #4cc9ff)',
                color: '#fff', fontWeight: 600, fontSize: 13,
              }}>Roll again</button>
            </div>
          ) : visible.map((m, i) => (
            <SwipeableCard
              key={m.id}
              m={m}
              liveProgress={liveProgress(m)}
              onOpen={() => nav(`/market/${m.id}`)}
              onSwipe={doSwipe}
              z={10 - i}
              offset={i * 8}
            />
          ))}
        </div>

        {idx < MARKETS.length && (
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', padding: '16px 0 14px' }}>
            <button onClick={() => doSwipe('no')} style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,46,132,0.2), rgba(255,46,132,0.05))',
              border: '1.5px solid rgba(255,46,132,0.5)',
              color: 'var(--no)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{Icon.close(22)}</button>
            <button onClick={() => nav(`/market/${MARKETS[idx].id}`)} style={{
              width: 44, height: 44, borderRadius: '50%', alignSelf: 'center',
              background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--ink-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{Icon.die(18)}</button>
            <button onClick={() => doSwipe('yes')} style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(158,240,26,0.25), rgba(158,240,26,0.05))',
              border: '1.5px solid rgba(158,240,26,0.5)',
              color: 'var(--yes)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{Icon.check(24)}</button>
          </div>
        )}
      </div>

      {flash && (
        <div style={{
          position: 'fixed', top: '45%', left: '50%', transform: 'translate(-50%,-50%)',
          padding: '10px 22px', borderRadius: 14,
          background: flash === 'yes' ? 'rgba(158,240,26,0.15)' : 'rgba(255,46,132,0.15)',
          border: `1px solid ${flash === 'yes' ? 'rgba(158,240,26,0.5)' : 'rgba(255,46,132,0.5)'}`,
          color: flash === 'yes' ? 'var(--yes)' : 'var(--no)',
          fontWeight: 700, letterSpacing: 0.6,
          fontSize: 12, pointerEvents: 'none', zIndex: 100,
        }}>
          {flash === 'yes' ? '✓ APPROVED · +4pts' : '✕ SKIPPED'}
        </div>
      )}
    </div>
  );
}
