import type { TierName } from './markets';

export const PLACEHOLDER_WALLET_ADDRESS = '0x9b2a5c4d7e8f1a3b6c4d7e8f1a3b6c4d71fd';

export function truncateAddress(addr: string, head = 6, tail = 4): string {
  if (addr.length <= head + tail + 3) return addr;
  return `${addr.slice(0, head)}...${addr.slice(-tail)}`;
}

export type NotificationKind = 'social' | 'market' | 'account';
export type NotificationIcon =
  | 'follow'
  | 'resolved'
  | 'comment'
  | 'tier'
  | 'liquidity'
  | 'mention'
  | 'wallet'
  | 'validation'
  | 'freebet';
export type NotificationTone = 'win' | 'tier' | 'info';

export type Notification = {
  id: string;
  kind: NotificationKind;
  icon: NotificationIcon;
  av?: string;
  from?: string;
  text: string;
  sub?: string;
  time: string;
  read: boolean;
  tone?: NotificationTone;
  deeplink?: { kind: 'user'; handle: string } | { kind: 'market'; id: string };
};

export type TransactionKind = 'deposit' | 'trade' | 'fee' | 'withdraw' | 'reward';
export type TxState = 'pending' | 'confirmed' | 'failed';

export type Transaction = {
  id: string;
  kind: TransactionKind;
  status: TxState;
  amount: number;
  asset: 'USDC';
  net?: string;
  hash?: string;
  label?: string;
  time: string;
};

export type OtherUser = {
  handle: string;
  name: string;
  av: string;
  bio: string;
  tier: TierName;
  joined: string;
  followers: number;
  following: number;
  rep: number;
  winRate: number;
  marketsCreated: number;
  resolved: number;
  vol: string;
  isFollowing: boolean;
  badges: string[];
  pinned?: string;
  streak: number;
};

export type UserActivity = {
  kind: 'created' | 'won' | 'commented' | 'traded';
  text: string;
  time: string;
};

export type ResolvedMarket = {
  id: string;
  q: string;
  cat: string;
  creator: { handle: string; av: string; tier: TierName };
  result: 'YES' | 'NO';
  resolvedAt: string;
  finalYes: number;
  yourSide: 'YES' | 'NO';
  yourSize: number;
  yourPayout: number;
  yourPnl: number;
  totalVol: number;
  traders: number;
  spark: number[];
  source: string;
  proof: string;
};

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', kind: 'social', icon: 'follow', av: 'CE', from: '@circuit', text: 'started following you', time: '12m', read: false, deeplink: { kind: 'user', handle: '@circuit' } },
  { id: 'n2', kind: 'market', icon: 'resolved', text: 'Market resolved YES - "Nvidia beats Q2 earnings"', sub: 'You won $640.00', time: '1h', read: false, tone: 'win', deeplink: { kind: 'market', id: 'm4' } },
  { id: 'n3', kind: 'social', icon: 'comment', av: 'QA', from: '@quantjoy', text: 'commented on your market "BTC > $120k"', sub: '"CME futures repricing hard after the CPI print..."', time: '2h', read: false, deeplink: { kind: 'market', id: 'm1' } },
  { id: 'n4', kind: 'account', icon: 'tier', text: 'You hit Gold tier', sub: 'Trading fees reduced to 0.6% - feed priority 1.5x', time: '6h', read: true, tone: 'tier' },
  { id: 'n5', kind: 'market', icon: 'liquidity', text: 'Your position on "ECB rate cut" gained ground', sub: 'NO 71c -> 76c - +$60 unrealized', time: '9h', read: true, tone: 'win', deeplink: { kind: 'market', id: 'm2' } },
  { id: 'n6', kind: 'social', icon: 'mention', av: 'DK', from: '@dexking', text: 'mentioned you in a comment', sub: '"...@macro_vlad called this one weeks ago"', time: '1d', read: true, deeplink: { kind: 'market', id: 'm1' } },
  { id: 'n7', kind: 'account', icon: 'wallet', text: 'Deposit confirmed', sub: '+$2,000.00 USDC - onchain in 14s', time: '1d', read: true, tone: 'win' },
  { id: 'n8', kind: 'market', icon: 'validation', text: 'Your market "Will Apple ship a foldable iPhone..." passed validation', sub: 'Live in feed - 142 approvals - 8 skips', time: '2d', read: true, tone: 'win', deeplink: { kind: 'market', id: 'm4' } },
  { id: 'n9', kind: 'social', icon: 'follow', av: 'EH', from: '@euroHawk', text: 'started following you', time: '2d', read: true },
  { id: 'n10', kind: 'account', icon: 'freebet', text: 'Daily freebet ready', sub: '$5 freebet to use within 24h', time: '2d', read: true, tone: 'tier' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', kind: 'deposit', status: 'confirmed', amount: 2000, asset: 'USDC', net: 'Polygon', hash: '0x4a3f...91c2', time: '1d' },
  { id: 't2', kind: 'trade', status: 'confirmed', amount: -820, asset: 'USDC', label: 'Bought 820 YES on "BTC > $120k"', time: '12m' },
  { id: 't3', kind: 'fee', status: 'confirmed', amount: 156.2, asset: 'USDC', label: 'Creator fees - "BTC > $120k"', time: '2d' },
  { id: 't4', kind: 'withdraw', status: 'pending', amount: -500, asset: 'USDC', net: 'Base', hash: 'pending...', time: '3m' },
  { id: 't5', kind: 'trade', status: 'confirmed', amount: -1200, asset: 'USDC', label: 'Bought 1,200 NO on "ECB rate cut"', time: '4d' },
  { id: 't6', kind: 'reward', status: 'confirmed', amount: 5, asset: 'USDC', label: 'Daily freebet - welcome', time: '5d' },
];

export const OTHER_USERS: Record<string, OtherUser> = {
  '@circuit': {
    handle: '@circuit', name: 'circuit.eth', av: 'CE',
    bio: 'Tech markets - ex-AAPL - 8.1M lifetime volume',
    tier: 'King', joined: 'Mar 2025', followers: 18420, following: 142,
    rep: 99, winRate: 0.681, marketsCreated: 128, resolved: 94, vol: '8.1M',
    isFollowing: false, badges: ['Top creator', 'Verified human', 'King roller'], pinned: 'm4', streak: 14,
  },
  '@macro_vlad': {
    handle: '@macro_vlad', name: 'macro_vlad', av: 'MV',
    bio: 'Macro degen - EU - BTC, FX, rates',
    tier: 'Gold', joined: 'Sep 2025', followers: 4120, following: 86,
    rep: 94, winRate: 0.634, marketsCreated: 62, resolved: 41, vol: '2.4M',
    isFollowing: true, badges: ['Crypto specialist', 'Gold roller'], pinned: 'm1', streak: 6,
  },
  '@quantjoy': {
    handle: '@quantjoy', name: 'quantjoy', av: 'QA',
    bio: 'Quant - 14yr equities - CFA',
    tier: 'Gold', joined: 'Jul 2025', followers: 1892, following: 51,
    rep: 87, winRate: 0.598, marketsCreated: 22, resolved: 18, vol: '910K',
    isFollowing: false, badges: ['Top commenter'], streak: 3,
  },
};

export const USER_ACTIVITY: Record<string, UserActivity[]> = {
  '@circuit': [
    { kind: 'created', text: 'Created "Apple foldable iPhone 2026"', time: '1d' },
    { kind: 'won', text: 'Won $1,840 on "Nvidia Q2 earnings"', time: '2d' },
    { kind: 'commented', text: '"Foundry margins matter more than units shipped."', time: '3d' },
  ],
  '@macro_vlad': [
    { kind: 'created', text: 'Created "BTC > $120k by April"', time: '2h' },
    { kind: 'won', text: 'Won $612 on "Fed pause Q1"', time: '4d' },
  ],
  '@quantjoy': [
    { kind: 'commented', text: '"CME futures repricing hard after the CPI print."', time: '12m' },
    { kind: 'traded', text: 'Bought 400 YES on "BTC > $120k"', time: '2h' },
  ],
};

export const RESOLVED_MARKETS: ResolvedMarket[] = [
  {
    id: 'rm1',
    q: 'Nvidia beats Q2 earnings by >10%?',
    cat: 'Finance',
    creator: { handle: '@macro_vlad', av: 'MV', tier: 'Gold' },
    result: 'YES',
    resolvedAt: 'Apr 24',
    finalYes: 0.84,
    yourSide: 'YES',
    yourSize: 800,
    yourPayout: 952.38,
    yourPnl: 152.38,
    totalVol: 640000,
    traders: 1842,
    spark: [55, 58, 62, 68, 72, 75, 79, 82, 84, 85, 84, 84],
    source: 'Chainlink',
    proof: truncateAddress(PLACEHOLDER_WALLET_ADDRESS),
  },
];

export const SETTINGS_DATA = {
  notifications: {
    'New followers': true,
    'Mentions and replies': true,
    'Market resolutions': true,
    'Position price alerts': true,
    'Daily freebet ready': true,
    'Marketing & product news': false,
  },
} as const;

export const GEO_BLOCKED_REGIONS = ['United States', 'United Kingdom', 'France', 'Singapore', 'Australia'] as const;
