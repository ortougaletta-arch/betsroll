import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NOTIFICATIONS, type NotificationKind } from '../../data/system';
import { actions, useStore } from '../../state/useStore';
import { Icon } from '../primitives/icons';
import { EmptyState, NotifRow, SkelRow, TopBar } from '../primitives/system';
import { BottomNav } from './BottomNav';

const TABS = ['All', 'Social', 'Markets', 'Account'] as const;
type Tab = typeof TABS[number];

export function MobileNotifications() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>('All');
  const skel = useStore((s) => s.skelDemo);
  const filtered = NOTIFICATIONS.filter((n) => tab === 'All' || n.kind === tab.toLowerCase().replace('s', '') as NotificationKind);

  const onNotifClick = (n: typeof NOTIFICATIONS[number]) => {
    if (!n.deeplink) return;
    if (n.deeplink.kind === 'market') nav(`/market/${n.deeplink.id}`);
    if (n.deeplink.kind === 'user') {
      actions.openUser(n.deeplink.handle);
      nav(`/u/${n.deeplink.handle.replace('@', '')}`);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Inbox" onBack={() => nav(-1)} right={<button onClick={() => nav('/settings')} style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600, padding: 8 }}>Settings</button>} />
      <div style={{ display: 'flex', gap: 6, padding: '12px 14px', borderBottom: '1px solid var(--line)', overflowX: 'auto' }} className="noscroll">
        {TABS.map((t) => {
          const count = NOTIFICATIONS.filter((n) => !n.read && (t === 'All' || n.kind === t.toLowerCase().replace('s', ''))).length;
          return (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 14px', borderRadius: 999, background: tab === t ? 'rgba(124,92,255,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${tab === t ? 'rgba(124,92,255,0.4)' : 'var(--line)'}`, color: tab === t ? '#a794ff' : 'var(--ink-2)', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
              {t}{count > 0 && <span style={{ minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8, background: '#a794ff', color: '#0a0a15', fontSize: 9.5, fontWeight: 800 }}>{count}</span>}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        {skel ? [1, 2, 3, 4, 5].map((i) => <SkelRow key={i} />) : filtered.length === 0 ? (
          <EmptyState icon={Icon.bell(28)} title="All caught up" sub="When you follow creators or trade, the activity shows up here." />
        ) : (
          <>
            <Section label="Today" />
            {filtered.slice(0, 3).map((n) => <NotifRow key={n.id} n={n} onClick={() => onNotifClick(n)} />)}
            {filtered.length > 3 && <Section label="Earlier" />}
            {filtered.slice(3).map((n) => <NotifRow key={n.id} n={n} onClick={() => onNotifClick(n)} />)}
          </>
        )}
      </div>
      <BottomNav active="inbox" />
    </div>
  );
}

function Section({ label }: { label: string }) {
  return <div style={{ padding: '14px 16px 6px', fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>;
}
