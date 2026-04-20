import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllMarkets, useStore } from '../../state/useStore';
import { Icon } from '../primitives/icons';
import { DesktopMarketCard } from './DesktopMarketCard';
import { DesktopRightRail } from './DesktopRightRail';
import { DesktopSidebar } from './DesktopSidebar';

export function DesktopFeed() {
  const nav = useNavigate();
  const [tab, setTab] = useState<'Top' | 'New' | 'Following'>('Top');
  const [cat, setCat] = useState('All');
  const cats = ['All', 'Politics', 'Crypto', 'Sports', 'Tech', 'Finance', 'Meme', 'Culture'];
  const boosts = useStore((s) => s.validationBoost);
  const MARKETS = useAllMarkets();

  const liveProgress = (m: (typeof MARKETS)[number]) =>
    Math.min(100, (m.progress ?? 100) + (boosts[m.id] ?? 0));

  const filtered = cat === 'All' ? MARKETS : MARKETS.filter((m) => m.cat === cat);

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <DesktopSidebar />
      <main style={{ flex: 1, overflow: 'auto', padding: '24px 32px', minWidth: 0 }} className="noscroll">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            flex: 1, height: 42, borderRadius: 12, background: 'var(--bg-1)',
            border: '1px solid var(--line)', padding: '0 14px',
            display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-3)', fontSize: 13,
          }}>
            {Icon.search(16)} Search markets, Betsrollers, categories…
            <span style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 6px', border: '1px solid var(--line)', borderRadius: 5 }}>⌘K</span>
          </div>
          <button style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--bg-1)', border: '1px solid var(--line)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {Icon.bell(16)}
            <span style={{ position: 'absolute', top: 9, right: 10, width: 6, height: 6, borderRadius: '50%', background: 'var(--no)' }} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>Feed</h1>
          <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-1)', borderRadius: 10 }}>
            {(['Top', 'New', 'Following'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '5px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                background: tab === t ? 'var(--bg-3)' : 'transparent',
                color: tab === t ? 'var(--ink)' : 'var(--ink-3)',
              }}>{t}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-3)' }}>
            <span style={{ color: 'var(--yes)' }}>●</span> 2,184 betsrollers online
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '6px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
              background: cat === c ? 'var(--bg-3)' : 'transparent',
              border: `1px solid ${cat === c ? 'transparent' : 'var(--line)'}`,
              color: cat === c ? 'var(--ink)' : 'var(--ink-2)',
            }}>{c}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {filtered.map((m) => (
            <DesktopMarketCard key={m.id} m={m} liveProgress={liveProgress(m)} onOpen={() => nav(`/market/${m.id}`)} />
          ))}
        </div>
      </main>
      <DesktopRightRail />
    </div>
  );
}
