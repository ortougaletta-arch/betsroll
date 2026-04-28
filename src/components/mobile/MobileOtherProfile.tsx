import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MARKETS } from '../../data/markets';
import { OTHER_USERS, USER_ACTIVITY } from '../../data/system';
import { actions, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { Chip } from '../primitives/Chip';
import { Icon } from '../primitives/icons';
import { PricePill } from '../primitives/PricePill';
import { TierBadge } from '../primitives/TierBadge';
import { EmptyState, SkelProfile, TopBar } from '../primitives/system';

export function MobileOtherProfile() {
  const nav = useNavigate();
  const { handle = 'circuit' } = useParams();
  const fullHandle = handle.startsWith('@') ? handle : `@${handle}`;
  const u = OTHER_USERS[fullHandle] ?? OTHER_USERS['@circuit'];
  const follows = useStore((s) => s.follows);
  const skel = useStore((s) => s.skelDemo);
  const [tab, setTab] = useState<'Markets' | 'Activity' | 'Stats'>('Markets');
  const isFollowing = follows[u.handle] ?? u.isFollowing;
  const userMarkets = MARKETS.filter((m) => m.creator.handle === u.handle || m.creator.av === u.av);
  const activity = USER_ACTIVITY[u.handle] ?? [];

  if (skel) return <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}><TopBar title="" onBack={() => nav(-1)} /><SkelProfile /></div>;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', overflow: 'auto', paddingBottom: 100 }}>
      <TopBar title={u.handle} onBack={() => nav(-1)} right={<button style={{ padding: 8, color: 'var(--ink-2)' }}>{Icon.share(18)}</button>} />
      <div style={{ height: 84, background: `radial-gradient(circle at 30% 50%, ${u.tier === 'King' ? '#ff6bff66' : 'rgba(255,194,76,0.35)'}, transparent 60%), linear-gradient(135deg, #1a1140, #0a0a15)` }} />
      <div style={{ padding: '0 16px', marginTop: -40, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 12 }}>
          <Avatar name={u.av} size={76} ring={u.tier === 'King' ? '#ff6bff' : 'var(--gold)'} />
          <div style={{ flex: 1, paddingBottom: 4, display: 'flex', gap: 6 }}>
            <button onClick={() => actions.toggleFollow(u.handle)} style={{ height: 34, padding: '0 16px', borderRadius: 10, background: isFollowing ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #7c5cff, #4cc9ff)', color: isFollowing ? 'var(--ink)' : '#fff', border: isFollowing ? '1px solid var(--line)' : 'none', fontWeight: 700, fontSize: 12.5, flex: 1 }}>{isFollowing ? 'Following' : 'Follow'}</button>
            <button style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', color: 'var(--ink-2)' }}>{Icon.chat(15)}</button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}><span style={{ fontWeight: 800, fontSize: 20 }}>{u.name}</span><TierBadge tier={u.tier} size="sm" />{u.streak >= 5 && <Chip label={`${u.streak}d streak`} tone="brand" />}</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginBottom: 10 }}>{u.handle} - joined {u.joined}</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.45, marginBottom: 14 }}>{u.bio}</div>
        <div style={{ display: 'flex', gap: 18, fontSize: 12.5, color: 'var(--ink-3)', marginBottom: 16 }}><span><span className="mono" style={{ color: 'var(--ink)', fontWeight: 700 }}>{u.followers.toLocaleString()}</span> followers</span><span><span className="mono" style={{ color: 'var(--ink)', fontWeight: 700 }}>{u.following}</span> following</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '12px 0', background: 'var(--bg-1)', borderRadius: 14, border: '1px solid var(--line)', marginBottom: 14 }}>
          <Stat k="Reputation" v={String(u.rep)} /><Stat k="Win rate" v={`${Math.round(u.winRate * 100)}%`} tone="yes" /><Stat k="Markets" v={String(u.marketsCreated)} /><Stat k="Volume" v={u.vol} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>{u.badges.map((b) => <Chip key={b} label={b} tone="brand" />)}</div>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', padding: '0 16px', position: 'sticky', top: 52, background: 'rgba(12,12,22,0.88)', backdropFilter: 'blur(12px)', zIndex: 5 }}>
        {(['Markets', 'Activity', 'Stats'] as const).map((t) => <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '12px 0', color: tab === t ? 'var(--ink)' : 'var(--ink-3)', fontWeight: 700, fontSize: 12.5 }}>{t}</button>)}
      </div>
      {tab === 'Markets' && <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>{userMarkets.length === 0 ? <EmptyState icon={Icon.spark(28)} title="No markets yet" sub={`${u.name} has not rolled a market yet.`} /> : userMarkets.map((m) => <button key={m.id} onClick={() => nav(`/market/${m.id}`)} style={{ textAlign: 'left', padding: 14, background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 14 }}><div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, marginBottom: 10 }}>{m.q}</div><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><PricePill side="yes" price={m.yes} compact /><PricePill side="no" price={m.no} compact /><div style={{ flex: 1 }} /><span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>${(m.vol24 / 1000).toFixed(0)}k</span></div></button>)}</div>}
      {tab === 'Activity' && <div style={{ padding: 14 }}>{activity.map((a, i) => <div key={`${a.time}-${i}`} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--line)' }}><div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(124,92,255,0.10)', color: '#a794ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.kind === 'won' ? Icon.check(14) : Icon.trend(14)}</div><div><div style={{ fontSize: 13, lineHeight: 1.4 }}>{a.text}</div><div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 3 }}>{a.time}</div></div></div>)}</div>}
      {tab === 'Stats' && <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}><Tile label="Resolved markets" v={String(u.resolved)} /><Tile label="Win rate" v={`${Math.round(u.winRate * 100)}%`} tone="yes" /><Tile label="Reputation" v={String(u.rep)} /><Tile label="Lifetime volume" v={`$${u.vol}`} /></div>}
    </div>
  );
}

function Stat({ k, v, tone }: { k: string; v: string; tone?: 'yes' }) {
  return <div style={{ textAlign: 'center', padding: '0 4px' }}><div className="mono" style={{ fontSize: 16, fontWeight: 700, color: tone === 'yes' ? 'var(--yes)' : 'var(--ink)' }}>{v}</div><div style={{ fontSize: 9.5, color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 600 }}>{k}</div></div>;
}

function Tile({ label, v, tone }: { label: string; v: string; tone?: 'yes' }) {
  return <div style={{ padding: 12, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)' }}><div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase' }}>{label}</div><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: tone === 'yes' ? 'var(--yes)' : 'var(--ink)', marginTop: 4 }}>{v}</div></div>;
}
