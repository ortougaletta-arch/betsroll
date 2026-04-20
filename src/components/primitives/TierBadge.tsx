import { Icon } from './icons';
import type { TierName } from '../../data/markets';

type Props = { tier?: TierName; size?: 'sm' | 'lg' };

const MAP: Record<TierName, [string, string]> = {
  Bronze: ['#cd7f32', '#8b5722'],
  Silver: ['#d7d9e0', '#8a8c95'],
  Gold:   ['#ffd86b', '#b8891a'],
  Platinum: ['#b8e6ff', '#4c7a94'],
  King:   ['#ff6bff', '#6b2a9b'],
};

export function TierBadge({ tier = 'Gold', size = 'sm' }: Props) {
  const [a, b] = MAP[tier];
  const h = size === 'sm' ? 22 : 32;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'sm' ? '0 8px' : '0 12px',
      height: h, borderRadius: h / 2,
      background: `linear-gradient(135deg, ${a}, ${b})`,
      color: '#0a0a15', fontWeight: 700, fontSize: size === 'sm' ? 10 : 13,
      letterSpacing: 0.4, textTransform: 'uppercase',
      boxShadow: `0 2px 12px ${a}40`,
      fontFamily: 'var(--display)',
    }}>
      {Icon.crown(size === 'sm' ? 10 : 12, '#0a0a15')}{tier}
    </span>
  );
}
