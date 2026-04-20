import type { TierName } from './markets';
import type { HistoryEntry, Position } from '../state/types';

export type MeProfile = {
  handle: string;
  bio: string;
  tier: TierName;
  winRate: number;
  marketsCreated: number;
  resolved: number;
  creatorEarnings: number;
  pnlLife: number;
  nextTier: TierName;
};

export const ME: MeProfile = {
  handle: '@macro_vlad',
  bio: 'Macro degen · 62 markets created · based in EU',
  tier: 'Gold',
  winRate: 0.634,
  marketsCreated: 62,
  resolved: 41,
  creatorEarnings: 614.80,
  pnlLife: 9840.22,
  nextTier: 'Platinum',
};

export const CREATED = [
  { q: 'Will BTC close above $120k by end of April?', status: 'Live', vol: 312400, fees: 156.20 },
  { q: 'Does the ECB cut rates 50bps?', status: 'Validating', vol: 128000, fees: 0 },
  { q: 'Nvidia beats Q2 earnings by >10%?', status: 'Resolved', vol: 640000, fees: 320.00, result: 'YES' },
  { q: 'Is there a government shutdown before June?', status: 'Draft', vol: 0, fees: 0 },
];

// Seed positions live on live markets only (validating markets aren't tradable in the prototype).
export const SEED_POSITIONS: Position[] = [
  { id: 'p1', marketId: 'm1', q: 'Will Bitcoin close above $120,000 by end of April?', side: 'YES', size: 820, entry: 0.58, cur: 0.67, pnl: 73.8, eta: '3d 4h', createdAt: Date.now() - 86400000 },
  { id: 'p2', marketId: 'm4', q: 'Does Apple ship a foldable iPhone before December 2026?', side: 'YES', size: 600, entry: 0.64, cur: 0.41, pnl: -215.6, eta: '243d', createdAt: Date.now() - 172800000 },
];

export const SEED_HISTORY: HistoryEntry[] = [
  { id: 'h1', kind: 'tier', icon: '⬆', txt: 'Reached VIP tier: Gold', v: '+240pts', time: '6h' },
  { id: 'h2', kind: 'market', icon: '✓', txt: 'Market resolved: "Nvidia earnings" → YES', v: '+$320.00 fees', time: '2d' },
];
