import { useLocation, useNavigate } from 'react-router-dom';
import { ME } from '../../data/user';
import { useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { BRLogo } from '../primitives/BRLogo';
import { Icon } from '../primitives/icons';

export function DesktopSidebar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const balance = useStore((s) => s.balance);
  const tier = useStore((s) => s.tier);
  const items: Array<[string, string, string]> = [
    ['/', 'Feed', '🎲'],
    ['/', 'Markets', '📊'],
    ['/profile', 'Profile', '👤'],
  ];

  return (
    <aside style={{
      width: 220, padding: 24, borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column', gap: 6,
      background: 'var(--bg)', height: '100dvh', position: 'sticky', top: 0, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 20px', borderBottom: '1px dashed var(--line)', marginBottom: 14 }}>
        <BRLogo size={34} spin />
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>Betsroll</div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: 0.4, textTransform: 'uppercase' }}>Roll the future</div>
        </div>
      </div>
      {items.map(([path, label, ic], i) => {
        const active = pathname === path && (i === 0 ? label === 'Feed' : true);
        return (
          <button key={label} onClick={() => nav(path)} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            borderRadius: 10,
            background: active ? 'var(--bg-2)' : 'transparent',
            color: active ? 'var(--ink)' : 'var(--ink-2)',
            fontSize: 13.5, fontWeight: 600, textAlign: 'left',
          }}>
            <span style={{ fontSize: 16 }}>{ic}</span>{label}
          </button>
        );
      })}
      <div style={{ marginTop: 10 }}>
        <button style={{
          width: '100%', padding: '12px', borderRadius: 12,
          background: 'linear-gradient(135deg, #7c5cff, #4cc9ff)', color: '#fff',
          fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>{Icon.plus(16, '#fff')}Roll a market</button>
      </div>
      <div style={{ marginTop: 'auto', padding: 14, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Avatar name="MV" size={32} ring="var(--gold)" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{ME.handle}</div>
            <div style={{ fontSize: 9.5, color: 'var(--gold)' }}>● {tier.toUpperCase()} · LVL 14</div>
          </div>
        </div>
        <div className="mono" style={{ fontSize: 14, fontWeight: 700 }}>${balance.toFixed(2)}</div>
        <div style={{ fontSize: 9.5, color: 'var(--ink-3)' }}>USDC balance</div>
      </div>
    </aside>
  );
}
