export type TierName = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'King';

export type Creator = {
  name: string;
  handle: string;
  tier: TierName;
  av: string;
  rep: number;
  markets: number;
  vol: string;
};

export type MarketStatus = 'live' | 'validating';

export type Market = {
  id: string;
  q: string;
  cat: string;
  creator: Creator;
  time: string;
  yes: number;
  no: number;
  vol24: number;
  liq: number;
  status: MarketStatus;
  resolvesIn?: string;
  progress?: number;
  comments: number;
  spark: number[];
  bull: number;
};

export type Comment = {
  id: string;
  av: string;
  name: string;
  time: string;
  text: string;
  up: number;
  tier: TierName;
};

export const MARKETS: Market[] = [
  {
    id: 'm1',
    q: 'Will Bitcoin close above $120,000 by end of April?',
    cat: 'Crypto',
    creator: { name: 'macro_vlad', handle: '@macro_vlad', tier: 'Gold', av: 'MV', rep: 94, markets: 62, vol: '2.4M' },
    time: '2h',
    yes: 0.67, no: 0.33,
    vol24: 312400, liq: 840000,
    status: 'live',
    resolvesIn: '3d 4h',
    comments: 284, spark: [40, 42, 45, 44, 48, 52, 55, 58, 61, 60, 64, 67],
    bull: 71,
  },
  {
    id: 'm2',
    q: 'Does the ECB cut rates by 50bps at its next meeting?',
    cat: 'Finance',
    creator: { name: 'euroHawk', handle: '@euroHawk', tier: 'Platinum', av: 'EH', rep: 88, markets: 41, vol: '1.8M' },
    time: '6h',
    yes: 0.24, no: 0.76,
    vol24: 128000, liq: 420000,
    status: 'validating', progress: 72,
    comments: 96, spark: [30, 28, 32, 27, 25, 24, 22, 24, 26, 25, 24, 24],
    bull: 28,
  },
  {
    id: 'm3',
    q: 'Will Lakers win the NBA Championship this season?',
    cat: 'Sports',
    creator: { name: 'courtSide', handle: '@courtSide', tier: 'Silver', av: 'CS', rep: 76, markets: 18, vol: '420K' },
    time: '18m',
    yes: 0.12, no: 0.88,
    vol24: 84000, liq: 210000,
    status: 'validating', progress: 34,
    comments: 412, spark: [18, 16, 15, 13, 14, 13, 12, 11, 13, 12, 11, 12],
    bull: 19,
  },
  {
    id: 'm4',
    q: 'Does Apple ship a foldable iPhone before December 2026?',
    cat: 'Tech',
    creator: { name: 'circuit.eth', handle: '@circuit', tier: 'King', av: 'CE', rep: 99, markets: 128, vol: '8.1M' },
    time: '1d',
    yes: 0.41, no: 0.59,
    vol24: 540000, liq: 1240000,
    status: 'live',
    resolvesIn: '243d',
    comments: 1204, spark: [38, 40, 43, 41, 39, 42, 44, 42, 40, 41, 42, 41],
    bull: 44,
  },
  {
    id: 'm5',
    q: '$PEPE hits a new ATH this month?',
    cat: 'Meme',
    creator: { name: 'ribbit', handle: '@ribbit', tier: 'Bronze', av: 'RB', rep: 61, markets: 9, vol: '92K' },
    time: '4h',
    yes: 0.58, no: 0.42,
    vol24: 48000, liq: 110000,
    status: 'validating', progress: 88,
    comments: 67, spark: [52, 54, 51, 56, 58, 55, 60, 61, 58, 57, 58, 58],
    bull: 62,
  },
];

export const COMMENTS: Comment[] = [
  { id: 'c1', av: 'QA', name: '@quantjoy', time: '12m', text: "CME futures repricing hard after the CPI print. 67c feels rich — I still like YES to $120k but only above 70c you're overpaying.", up: 42, tier: 'Gold' },
  { id: 'c2', av: 'DK', name: '@dexking', time: '34m', text: 'Whale wallet just moved 4k BTC off Coinbase. Hmm.', up: 18, tier: 'Silver' },
  { id: 'c3', av: 'SW', name: '@softwire', time: '1h', text: 'Resolving via Chainlink oracle — so no resolution drama. Rolling 2k YES.', up: 11, tier: 'Platinum' },
];
