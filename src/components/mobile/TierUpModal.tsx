import type { TierName } from '../../data/markets';
import { Icon } from '../primitives/icons';
import { TierBadge } from '../primitives/TierBadge';

export function TierUpModal({ tier, onClose }: { tier: TierName; onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ textAlign: 'center', padding: '20px 8px 8px' }}>
          <div className="glow-pulse" style={{ width: 76, height: 76, borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,194,76,0.12)', border: '2px solid var(--gold)', color: 'var(--gold)' }}>{Icon.crown(34)}</div>
          <div style={{ fontWeight: 800, fontSize: 24, marginTop: 18 }}>Tier up</div>
          <div style={{ marginTop: 10 }}><TierBadge tier={tier} size="lg" /></div>
          <div style={{ color: 'var(--ink-2)', fontSize: 13, lineHeight: 1.5, margin: '12px auto 18px', maxWidth: 280 }}>Your VIP benefits have been upgraded for future rolls.</div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>Continue</button>
        </div>
      </div>
    </div>
  );
}
