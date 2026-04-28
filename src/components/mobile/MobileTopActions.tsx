import { useNavigate } from 'react-router-dom';
import { NOTIFICATIONS } from '../../data/system';
import { actions, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { Icon } from '../primitives/icons';

export function MobileTopActions() {
  const nav = useNavigate();
  const balance = useStore((s) => s.balance);
  const notifSeen = useStore((s) => s.notifSeen);
  const unread = NOTIFICATIONS.some((n) => !n.read) && !notifSeen;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={() => { actions.openWallet(); nav('/wallet'); }} style={{ height: 34, padding: '0 10px', borderRadius: 12, background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
        {Icon.wallet(14, 'var(--brand-2)')}
        <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>${balance.toFixed(0)}</span>
      </button>
      <button onClick={() => { actions.openNotifications(); nav('/notifications'); }} style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {Icon.bell(16)}
        {unread && <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: '50%', background: 'var(--no)', boxShadow: '0 0 8px var(--no)' }} />}
      </button>
      <button onClick={() => nav('/profile')} aria-label="Open profile">
        <Avatar name="MV" size={34} ring="var(--gold)" />
      </button>
    </div>
  );
}
