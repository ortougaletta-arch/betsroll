import { pointsToNextTier, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { TierBadge } from '../primitives/TierBadge';

export function DesktopRightRail() {
  const vipPts = useStore((s) => s.vipPts);
  const tier = useStore((s) => s.tier);
  const info = pointsToNextTier(vipPts);

  return (
    <aside style={{ width: 280, padding: 24, borderLeft: '1px solid var(--line)', overflow: 'auto', height: '100dvh', position: 'sticky', top: 0, flexShrink: 0 }} className="noscroll">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>🔥 Rolling now</div>
        {[
          ['Strait of Hormuz traffic normal?', '23%', '↓', 46],
          ['Trump posts 200+ tweets by April 21?', '76%', '↑', 59],
          ['ETH flips BTC market cap in 2026?', '8%', '↓', 12],
        ].map(([q, p, d, c], i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px dashed var(--line)' : 'none', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', width: 16 }}>{i + 1}</div>
            <div style={{ flex: 1, fontSize: 12, lineHeight: 1.3 }}>{q}</div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{p}</div>
              <div className="mono" style={{ fontSize: 9.5, color: d === '↑' ? 'var(--yes)' : 'var(--no)' }}>{d}{c}%</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: 14, borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(255,216,107,0.08), rgba(124,92,255,0.08))',
        border: '1px solid rgba(255,216,107,0.25)',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Your tier</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
          <TierBadge tier={tier} size="lg" />
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 8 }}>
          {info.remaining.toLocaleString()} pts to <b style={{ color: '#b8e6ff' }}>{info.next}</b>
        </div>
        <div style={{ marginTop: 8, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ width: `${info.progress * 100}%`, height: '100%', background: 'linear-gradient(90deg, #ffd86b, #b8e6ff)' }} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>Top Betsrollers · 7d</div>
        {[
          ['@circuit', 'King', '+$12.4k'],
          ['@macro_vlad', 'Gold', '+$4.8k'],
          ['@euroHawk', 'Plat', '+$3.1k'],
        ].map(([n, _t, p], i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0' }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', width: 16 }}>{i + 1}</div>
            <Avatar name={n.slice(1, 3).toUpperCase()} size={28} />
            <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{n}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--yes)', fontWeight: 600 }}>{p}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
