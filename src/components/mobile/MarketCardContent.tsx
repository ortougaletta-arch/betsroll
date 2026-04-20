import type { Market } from '../../data/markets';
import { Avatar } from '../primitives/Avatar';
import { Chip } from '../primitives/Chip';
import { Icon } from '../primitives/icons';
import { Sparkline } from '../primitives/Sparkline';
import { ValidationBar } from '../primitives/ValidationBar';

type Props = { m: Market; onOpen: () => void; liveProgress: number };

export function MarketCardContent({ m, onOpen, liveProgress }: Props) {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={m.creator.av} size={34} ring={m.creator.tier === 'King' ? '#ff6bff' : m.creator.tier === 'Gold' ? 'var(--gold)' : null} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{m.creator.handle}</span>
            <span style={{ color: 'var(--gold)' }}>{Icon.crown(10, 'var(--gold)')}</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>· {m.time}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
            <span className="mono">{m.creator.rep}</span> rep · {m.creator.markets} markets
          </div>
        </div>
        <Chip label={m.cat} tone="brand" />
      </div>

      <div onClick={onOpen} style={{
        fontFamily: 'var(--display)', fontWeight: 600,
        fontSize: 22, lineHeight: 1.15, color: 'var(--ink)',
        letterSpacing: -0.5, cursor: 'pointer',
      }}>{m.q}</div>

      {m.status === 'live' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, color: 'var(--yes)', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--yes)', boxShadow: '0 0 8px var(--yes)' }} />LIVE
          </span>
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>· resolves in</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink)', fontWeight: 600 }}>{m.resolvesIn}</span>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginBottom: 4, letterSpacing: 0.3, textTransform: 'uppercase', fontWeight: 600 }}>
            Validating · <span style={{ color: 'var(--ink-2)' }}>{liveProgress}% to go live</span>
          </div>
          <ValidationBar pct={liveProgress} />
        </div>
      )}

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'center',
        padding: '10px 12px', background: 'rgba(255,255,255,0.025)',
        border: '1px solid var(--line)', borderRadius: 12,
      }}>
        <div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>YES</div>
          <div className="mono" style={{ color: 'var(--yes)', fontWeight: 700, fontSize: 20, lineHeight: 1 }}>{Math.round(m.yes * 100)}¢</div>
        </div>
        <div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>NO</div>
          <div className="mono" style={{ color: 'var(--no)', fontWeight: 700, fontSize: 20, lineHeight: 1 }}>{Math.round(m.no * 100)}¢</div>
        </div>
        <Sparkline data={m.spark} color={m.bull > 50 ? 'var(--yes)' : 'var(--no)'} width={72} height={32} />
      </div>

      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--ink-3)' }}>
        <div><span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>${(m.vol24 / 1000).toFixed(0)}k</span> 24h vol</div>
        <div><span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>${(m.liq / 1000).toFixed(0)}k</span> liq</div>
      </div>

      <div style={{ flex: 1 }} />

      {m.status === 'live' ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onOpen} style={{
            flex: 1, height: 44, borderRadius: 12,
            background: 'linear-gradient(180deg, rgba(158,240,26,0.2), rgba(158,240,26,0.08))',
            border: '1px solid rgba(158,240,26,0.4)',
            color: 'var(--yes)', fontWeight: 700, fontSize: 14, letterSpacing: 0.3,
            fontFamily: 'var(--display)',
          }}>
            <span style={{ fontSize: 11, opacity: 0.7, marginRight: 6 }}>BUY</span>YES · {Math.round(m.yes * 100)}¢
          </button>
          <button onClick={onOpen} style={{
            flex: 1, height: 44, borderRadius: 12,
            background: 'linear-gradient(180deg, rgba(255,46,132,0.2), rgba(255,46,132,0.08))',
            border: '1px solid rgba(255,46,132,0.4)',
            color: 'var(--no)', fontWeight: 700, fontSize: 14, letterSpacing: 0.3,
            fontFamily: 'var(--display)',
          }}>
            <span style={{ fontSize: 11, opacity: 0.7, marginRight: 6 }}>BUY</span>NO · {Math.round(m.no * 100)}¢
          </button>
        </div>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          height: 44, borderRadius: 12,
          background: 'rgba(124,92,255,0.1)',
          border: '1px dashed rgba(124,92,255,0.35)',
          color: '#a794ff',
          fontWeight: 700, fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase',
        }}>
          🔒 Trading opens at 100% approval
        </div>
      )}

      <div style={{ display: 'flex', gap: 18, justifyContent: 'space-between', alignItems: 'center', color: 'var(--ink-3)', paddingTop: 2 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-3)', fontSize: 12 }}>
          {Icon.chat(15)}<span className="mono" style={{ fontWeight: 600 }}>{m.comments}</span>
        </button>
        <button style={{ color: 'var(--ink-3)' }}>{Icon.share(15)}</button>
        <button style={{ color: 'var(--ink-3)' }}>{Icon.bookmark(15)}</button>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--ink-3)' }}>
          <span>swipe to vote</span>
          <span style={{ color: 'var(--no)', fontSize: 12 }}>←</span>
          <span style={{ color: 'var(--yes)', fontSize: 12 }}>→</span>
        </div>
      </div>
    </div>
  );
}
