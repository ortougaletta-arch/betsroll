import type { Market, TierName } from '../data/markets';

export type Vote = 'yes' | 'no';
export type Side = 'YES' | 'NO';

export type Position = {
  id: string;
  marketId: string;
  q: string;
  side: Side;
  size: number;
  entry: number;
  cur: number;
  pnl: number;
  eta: string;
  createdAt: number;
};

export type HistoryEntry = {
  id: string;
  kind: 'trade' | 'market' | 'tier';
  icon: string;
  txt: string;
  v?: string;
  time: string;
};

export type Store = {
  balance: number;
  freebet: number;
  votes: Record<string, Vote>;
  validationBoost: Record<string, number>;
  positions: Position[];
  history: HistoryEntry[];
  vipPts: number;
  tier: TierName;
  userMarkets: Market[];
};
