import type { ReactNode } from 'react';
import type { Notification, TxState } from '../../data/system';
import { Avatar } from './Avatar';
import { Icon } from './icons';

const iconMap: Record<Notification['icon'], ReactNode> = {
  follow: <IconUserPlus />,
  resolved: Icon.check(14),
  comment: Icon.chat(14),
  tier: Icon.crown(14),
  liquidity: Icon.trend(14),
  mention: <span className="mono" style={{ fontSize: 13 }}>@</span>,
  wallet: Icon.wallet(14),
  validation: Icon.check(14),
  freebet: Icon.spark(14),
};

export function TopBar({ title, onBack, right, sub, large = false }: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  sub?: string;
  large?: boolean;
}) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(12,12,22,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 52, padding: '0 14px' }}>
        {onBack && (
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 18, marginLeft: -8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}>
            {Icon.back(20)}
          </button>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: large ? 22 : 16, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          {sub && <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
        </div>
        {right}
      </div>
    </div>
  );
}

export function Skel({ w = '100%', h = 12, r = 6, style }: { w?: number | string; h?: number | string; r?: number | string; style?: React.CSSProperties }) {
  return <div className="skel" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

export function SkelAvatar({ size = 36 }: { size?: number }) {
  return <div className="skel" style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }} />;
}

export function SkelMarketCard() {
  return (
    <div style={{ padding: 14, borderRadius: 16, background: 'var(--bg-1)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <SkelAvatar size={32} /><div style={{ flex: 1 }}><Skel w="40%" h={11} /><Skel w="55%" h={9} style={{ marginTop: 6 }} /></div><Skel w={56} h={20} r={10} />
      </div>
      <Skel w="92%" h={18} /><Skel w="68%" h={18} /><Skel h={52} r={12} /><Skel w="40%" h={10} />
    </div>
  );
}

export function SkelRow({ avatar = true }: { avatar?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
      {avatar && <SkelAvatar size={36} />}
      <div style={{ flex: 1 }}><Skel w="60%" h={11} /><Skel w="80%" h={10} style={{ marginTop: 6 }} /></div>
      <Skel w={48} h={11} />
    </div>
  );
}

export function SkelProfile() {
  return <div style={{ padding: 16 }}><SkelRow /><Skel h={64} r={14} style={{ marginTop: 12 }} /><SkelRow /><SkelRow /></div>;
}

export function SkelWalletRow() {
  return <SkelRow avatar />;
}

export function Banner({ tone = 'info', icon, title, sub, action }: {
  tone?: 'info' | 'warn' | 'error' | 'success' | 'brand';
  icon?: ReactNode;
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  const tones = {
    info: ['rgba(76,201,255,0.08)', 'rgba(76,201,255,0.3)', '#7adcff'],
    warn: ['rgba(255,194,76,0.08)', 'rgba(255,194,76,0.3)', 'var(--gold)'],
    error: ['rgba(255,46,132,0.08)', 'rgba(255,46,132,0.3)', 'var(--no)'],
    success: ['rgba(158,240,26,0.08)', 'rgba(158,240,26,0.3)', 'var(--yes)'],
    brand: ['rgba(124,92,255,0.10)', 'rgba(124,92,255,0.3)', '#a794ff'],
  }[tone];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: tones[0], border: `1px solid ${tones[1]}`, borderRadius: 12 }}>
      {icon && <div style={{ color: tones[2], flexShrink: 0 }}>{icon}</div>}
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 700, color: tones[2] }}>{title}</div>{sub && <div style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 1 }}>{sub}</div>}</div>
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, sub, action }: { icon?: ReactNode; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {icon && <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(124,92,255,0.08)', border: '1px solid rgba(124,92,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a794ff', marginBottom: 6 }}>{icon}</div>}
      <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>{title}</div>
      {sub && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.5, maxWidth: 280 }}>{sub}</div>}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  );
}

export function TxStatusBadge({ status = 'pending' }: { status?: TxState }) {
  const map = {
    pending: { fg: 'var(--gold)', bg: 'rgba(255,194,76,0.12)', bd: 'rgba(255,194,76,0.3)', label: 'Pending' },
    confirmed: { fg: 'var(--yes)', bg: 'rgba(158,240,26,0.12)', bd: 'rgba(158,240,26,0.3)', label: 'Confirmed' },
    failed: { fg: 'var(--no)', bg: 'rgba(255,46,132,0.12)', bd: 'rgba(255,46,132,0.3)', label: 'Failed' },
  }[status];
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 999, background: map.bg, border: `1px solid ${map.bd}`, color: map.fg, fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{status === 'pending' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: map.fg, animation: 'pulse-dot 1.2s infinite' }} />}{status === 'confirmed' && Icon.check(10)}{status === 'failed' && Icon.close(10)}{map.label}</span>;
}

export function NotifRow({ n, onClick }: { n: Notification; onClick?: () => void }) {
  const toneColor = n.tone === 'win' ? 'var(--yes)' : n.tone === 'tier' ? 'var(--gold)' : '#a794ff';
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', background: n.read ? 'transparent' : 'rgba(124,92,255,0.04)', borderBottom: '1px solid var(--line)', position: 'relative' }}>
      {!n.read && <span style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', boxShadow: '0 0 8px var(--brand)' }} />}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {n.av ? <Avatar name={n.av} size={36} /> : <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(124,92,255,0.12)', border: '1px solid rgba(124,92,255,0.3)', color: toneColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{iconMap[n.icon]}</div>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.35 }}>{n.from && <span style={{ fontWeight: 700 }}>{n.from} </span>}<span style={{ color: n.from ? 'var(--ink-2)' : 'var(--ink)', fontWeight: n.from ? 500 : 600 }}>{n.text}</span></div>
        {n.sub && <div style={{ fontSize: 12, color: n.tone === 'win' ? 'var(--yes)' : 'var(--ink-3)', marginTop: 3, lineHeight: 1.4 }}>{n.sub}</div>}
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 5 }}>{n.time}</div>
      </div>
    </button>
  );
}

export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return <div style={{ marginBottom: 22 }}>{title && <div style={{ fontSize: 10.5, color: 'var(--ink-3)', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', padding: '0 16px 8px' }}>{title}</div>}<div style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>{children}</div></div>;
}

export function SettingsRow({ icon, label, sub, value, onClick, toggle, danger, last }: {
  icon?: ReactNode;
  label: string;
  sub?: string;
  value?: ReactNode;
  onClick?: () => void;
  toggle?: { value: boolean; onChange: (value: boolean) => void };
  danger?: boolean;
  last?: boolean;
}) {
  const style: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '13px 16px',
    textAlign: 'left',
    borderBottom: last ? 'none' : '1px solid var(--line)',
    color: danger ? 'var(--no)' : 'var(--ink)',
    cursor: 'pointer',
  };
  const content = (
    <>
      {icon && <div style={{ width: 30, height: 30, borderRadius: 9, background: danger ? 'rgba(255,46,132,0.10)' : 'rgba(255,255,255,0.05)', color: danger ? 'var(--no)' : 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>}
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>{sub && <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>}</div>
      {toggle ? <Switch on={toggle.value} onChange={toggle.onChange} /> : <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ink-3)' }}>{value && <span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{value}</span>}{Icon.back(14)}</div>}
    </>
  );
  if (toggle) {
    const toggleRow = () => {
      if (onClick) onClick();
      else toggle.onChange(!toggle.value);
    };
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={toggleRow}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleRow();
          }
        }}
        style={style}
      >
        {content}
      </div>
    );
  }
  return (
    <button onClick={onClick} style={style}>
      {content}
    </button>
  );
}

export function Switch({ on, onChange }: { on: boolean; onChange: (value: boolean) => void }) {
  return <button onClick={(e) => { e.stopPropagation(); onChange(!on); }} style={{ width: 44, height: 26, borderRadius: 13, padding: 2, background: on ? 'linear-gradient(135deg, #7c5cff, #4cc9ff)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}><div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', transform: `translateX(${on ? 18 : 0}px)`, transition: 'transform 0.2s cubic-bezier(.3,.8,.5,1.2)' }} /></button>;
}

function IconUserPlus() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="4" stroke="currentColor" strokeWidth="2" /><path d="M2 21c1-4 4-6 7-6s6 2 7 6M19 8v6M16 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
