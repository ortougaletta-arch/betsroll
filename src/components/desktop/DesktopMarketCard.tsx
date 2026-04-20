import { useState } from 'react';
import type { Market } from '../../data/markets';
import { actions, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { Chip } from '../primitives/Chip';
import { Icon } from '../primitives/icons';
import { Sparkline } from '../primitives/Sparkline';
import { TierBadge } from '../primitives/TierBadge';
import { ValidationBar } from '../primitives/ValidationBar';

type Props = { m: Market; liveProgress: number; onOpen: () => void };

export function DesktopMarketCard({ m, liveProgress, onOpen }: Props) {
  const [hover, setHover] = useState(false);
  const [voteFlash, setVoteFlash] = useState<null | 'yes' | 'no'>(null);
  const myVote = useStore((s) => s.votes[m.id]);

  const castVote = (v: 'yes' | 'no') => (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.voteMarket(m.id, v);
    setVoteFlash(v);
    setTimeout(() => setVoteFlash(null), 900);
  };
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 20, borderRadius: 20,
        background: 'linear-gradient(180deg, var(--bg-1), var(--bg))',
        border: `1px solid ${hover ? 'rgba(124,92,255,0.3)' : 'var(--line)'}`,
        display: 'flex', flexDirection: 'column', gap: 14,
        position: 'relative', overflow: 'hidden',
        transition: 'transform .2s, border-color .2s',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', border: '1px dashed rgba(124,92,255,0.1)', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={m.creator.av} size={30} ring={m.creator.tier === 'King' ? '#ff6bff' : m.creator.tier === 'Gold' ? 'var(--gold)' : null} />
        <span style={{ fontSize: 13, fontWeight: 700 }}>{m.creator.handle}</span>
        <TierBadge tier={m.creator.tier} size="sm" />
        <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>· {m.time}</span>
        <div style={{ flex: 1 }} />
        <Chip label={m.cat} tone="brand" />
      </div>
      <div onClick={onOpen} style={{ cursor: 'pointer', fontSize: 18, fontWeight: 600, lineHeight: 1.2, color: 'var(--ink)', letterSpacing: -0.4 }}>{m.q}</div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'center',
        padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--line)', borderRadius: 12,
      }}>
        <div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>YES</div>
          <div className="mono" style={{ color: 'var(--yes)', fontWeight: 700, fontSize: 22, lineHeight: 1 }}>{Math.round(m.yes * 100)}¢</div>
        </div>
        <div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>NO</div>
          <div className="mono" style={{ color: 'var(--no)', fontWeight: 700, fontSize: 22, lineHeight: 1 }}>{Math.round(m.no * 100)}¢</div>
        </div>
        <Sparkline data={m.spark} color={m.bull > 50 ? 'var(--yes)' : 'var(--no)'} width={88} height={36} />
      </div>
      {m.status === 'live' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: 'var(--yes)', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--yes)' }} />LIVE · {m.resolvesIn}
          </span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 'auto' }}>${(m.vol24 / 1000).toFixed(0)}k / 24h</span>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            Validating · {liveProgress}% to go live
          </div>
          <ValidationBar pct={liveProgress} />
        </div>
      )}

      {/* Voting row for validating markets (desktop equivalent of mobile swipe) */}
      {m.status !== 'live' && (
        <div style={{ display: 'flex', gap: 8, padding: '6px 0 2px', borderTop: '1px dashed var(--line)' }}>
          {myVote ? (
            <div style={{
              flex: 1, height: 34, borderRadius: 9,
              background: myVote === 'yes' ? 'rgba(158,240,26,0.1)' : 'rgba(255,46,132,0.1)',
              border: `1px solid ${myVote === 'yes' ? 'rgba(158,240,26,0.3)' : 'rgba(255,46,132,0.3)'}`,
              color: myVote === 'yes' ? 'var(--yes)' : 'var(--no)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 11.5, letterSpacing: 0.3, textTransform: 'uppercase',
            }}>
              {myVote === 'yes' ? '✓ Voted to approve' : '✕ Voted to skip'}
            </div>
          ) : (
            <>
              <button onClick={castVote('yes')} style={{
                flex: 1, height: 34, borderRadius: 9,
                background: voteFlash === 'yes' ? 'rgba(158,240,26,0.25)' : 'linear-gradient(135deg, #7c5cff, #4cc9ff)',
                color: '#fff', fontWeight: 700, fontSize: 11.5, letterSpacing: 0.3,
              }}>✓ Approve to go live</button>
              <button onClick={castVote('no')} style={{
                padding: '0 16px', height: 34, borderRadius: 9,
                background: 'transparent', border: '1px solid var(--line)',
                color: 'var(--ink-2)', fontWeight: 600, fontSize: 11.5,
              }}>Skip</button>
            </>
          )}
        </div>
      )}

      {m.status === 'live' ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onOpen} style={{
            flex: 1, height: 40, borderRadius: 10,
            background: 'rgba(158,240,26,0.15)', border: '1px solid rgba(158,240,26,0.4)',
            color: 'var(--yes)', fontWeight: 700, fontSize: 12.5, letterSpacing: 0.2,
          }}>BUY YES · {Math.round(m.yes * 100)}¢</button>
          <button onClick={onOpen} style={{
            flex: 1, height: 40, borderRadius: 10,
            background: 'rgba(255,46,132,0.12)', border: '1px solid rgba(255,46,132,0.35)',
            color: 'var(--no)', fontWeight: 700, fontSize: 12.5, letterSpacing: 0.2,
          }}>BUY NO · {Math.round(m.no * 100)}¢</button>
        </div>
      ) : (
        <button onClick={onOpen} style={{
          width: '100%', height: 40, borderRadius: 10,
          background: 'rgba(124,92,255,0.1)', border: '1px dashed rgba(124,92,255,0.35)',
          color: '#a794ff', fontWeight: 700, fontSize: 11.5, letterSpacing: 0.4, textTransform: 'uppercase',
        }}>🔒 Trading opens at 100% approval</button>
      )}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', color: 'var(--ink-3)', fontSize: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>{Icon.chat(14)}<span className="mono">{m.comments}</span></span>
        <span>{Icon.share(14)}</span>
        <span>{Icon.bookmark(14)}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10.5 }}>liq <span className="mono" style={{ color: 'var(--ink-2)' }}>${(m.liq / 1000).toFixed(0)}k</span></span>
      </div>
    </div>
  );
}
