import type { TierName } from '../../data/markets';

type Props = { tier?: TierName; progress?: number };

const COLOR: Record<TierName, string> = {
  Bronze: '#cd7f32',
  Silver: '#d7d9e0',
  Gold: '#ffd86b',
  Platinum: '#b8e6ff',
  King: '#ff6bff',
};

export function VIPRing({ tier = 'Gold', progress = 0.5 }: Props) {
  const color = COLOR[tier];
  const r = 44, c = 2 * Math.PI * r, off = c * (1 - progress);
  return (
    <svg width="104" height="104" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="52" cy="52" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none" />
      <circle cx="52" cy="52" r={r} stroke={color} strokeWidth="3" fill="none"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
    </svg>
  );
}
