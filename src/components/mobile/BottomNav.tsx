import { useNavigate } from 'react-router-dom';
import type { JSX } from 'react';
import { Icon } from '../primitives/icons';

type Active = 'feed' | 'markets' | 'trade' | 'profile';
type Props = { active: Active };

export function BottomNav({ active }: Props) {
  const nav = useNavigate();
  const tabs: Array<{ id: Active; label: string; path: string; icon: JSX.Element }> = [
    { id: 'feed', label: 'Feed', path: '/', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12l9-9 9 9v9H3z" stroke="currentColor" strokeWidth="1.8" /><path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.8" /></svg>
    )},
    { id: 'markets', label: 'Markets', path: '/markets', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 17l5-5 4 4 8-8M21 8v-3h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    )},
    { id: 'trade', label: 'Trade', path: '/trade', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 8h16M4 8l4-4M4 8l4 4M20 16H4M20 16l-4-4M20 16l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
    )},
    { id: 'profile', label: 'Profile', path: '/profile', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    )},
  ];
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 84, paddingBottom: 24, paddingTop: 6,
      background: 'linear-gradient(180deg, rgba(12,12,22,0) 0%, rgba(12,12,22,0.98) 30%)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around', zIndex: 30,
      backdropFilter: 'blur(8px)',
    }}>
      {tabs.slice(0, 2).map((t) => (
        <button key={t.id} onClick={() => nav(t.path)} style={{
          flex: 1, paddingTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          color: active === t.id ? 'var(--ink)' : 'var(--ink-3)',
        }}>
          {t.icon}
          <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
        </button>
      ))}
      <button style={{
        position: 'relative', top: -20, width: 56, height: 56, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #9d7dff, #4a2ed1)',
        boxShadow: '0 0 0 4px rgba(12,12,22,1), 0 10px 30px rgba(124,92,255,0.5)',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{Icon.plus(22, '#fff')}</button>
      {tabs.slice(2).map((t) => (
        <button key={t.id} onClick={() => nav(t.path)} style={{
          flex: 1, paddingTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          color: active === t.id ? 'var(--ink)' : 'var(--ink-3)',
        }}>
          {t.icon}
          <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
