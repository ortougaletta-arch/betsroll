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

export type MarketStatus = 'live' | 'validating' | 'resolved';

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
  resolution?: 'YES' | 'NO';
  resolvedAt?: string;
  finalYes?: number;
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
  {
    id: 'm6',
    q: 'Will OpenAI ship GPT-5 to the public by August 2026?',
    cat: 'Tech',
    creator: { name: 'quantjoy', handle: '@quantjoy', tier: 'Gold', av: 'QA', rep: 87, markets: 22, vol: '910K' },
    time: '8h',
    yes: 0.43, no: 0.57,
    vol24: 92000, liq: 260000,
    status: 'validating', progress: 58,
    comments: 138, spark: [36, 38, 41, 40, 42, 43, 44, 43, 42, 44, 43, 43],
    bull: 47,
  },
  {
    id: 'm7',
    q: 'Will the Fed cut rates by 50bps at the May 2026 meeting?',
    cat: 'Finance',
    creator: { name: 'ratesguy', handle: '@ratesguy', tier: 'Platinum', av: 'RG', rep: 91, markets: 54, vol: '3.1M' },
    time: '1d',
    yes: 0.19, no: 0.81,
    vol24: 176000, liq: 510000,
    status: 'validating', progress: 64,
    comments: 73, spark: [24, 22, 21, 20, 19, 18, 20, 19, 18, 19, 19, 19],
    bull: 24,
  },
  {
    id: 'm8',
    q: 'Will Solana flip Ethereum by market cap in 2026?',
    cat: 'Crypto',
    creator: { name: 'oracle_eth', handle: '@oracle_eth', tier: 'Silver', av: 'OE', rep: 82, markets: 31, vol: '740K' },
    time: '3h',
    yes: 0.07, no: 0.93,
    vol24: 56000, liq: 180000,
    status: 'validating', progress: 22,
    comments: 211, spark: [11, 10, 9, 8, 7, 8, 6, 7, 7, 6, 7, 7],
    bull: 15,
  },
  {
    id: 'm9',
    q: 'Will Bitcoin hit $200,000 in 2026?',
    cat: 'Crypto',
    creator: { name: 'macro_vlad', handle: '@macro_vlad', tier: 'Gold', av: 'MV', rep: 94, markets: 63, vol: '2.5M' },
    time: '5h',
    yes: 0.31, no: 0.69,
    vol24: 824000, liq: 1680000,
    status: 'live',
    resolvesIn: '247d',
    comments: 622, spark: [24, 26, 29, 28, 30, 32, 33, 31, 30, 32, 31, 31],
    bull: 38,
  },
  {
    id: 'm10',
    q: 'Will Manchester City win the Premier League 2026?',
    cat: 'Sports',
    creator: { name: 'touchline', handle: '@touchline', tier: 'Gold', av: 'TL', rep: 89, markets: 47, vol: '1.2M' },
    time: '11h',
    yes: 0.62, no: 0.38,
    vol24: 460000, liq: 900000,
    status: 'live',
    resolvesIn: '32d',
    comments: 354, spark: [52, 54, 57, 58, 60, 61, 63, 62, 61, 62, 63, 62],
    bull: 66,
  },
  {
    id: 'm11',
    q: 'Will Tesla deliver 600k Cybertrucks in 2026?',
    cat: 'Tech',
    creator: { name: 'circuit.eth', handle: '@circuit', tier: 'King', av: 'CE', rep: 99, markets: 129, vol: '8.2M' },
    time: '2d',
    yes: 0.18, no: 0.82,
    vol24: 238000, liq: 620000,
    status: 'live',
    resolvesIn: '247d',
    comments: 418, spark: [25, 24, 22, 21, 20, 19, 18, 17, 18, 19, 18, 18],
    bull: 22,
  },
  {
    id: 'm12',
    q: 'Will gold close above $3,000/oz by July 2026?',
    cat: 'Finance',
    creator: { name: 'volMancer', handle: '@volMancer', tier: 'Platinum', av: 'VM', rep: 93, markets: 77, vol: '4.6M' },
    time: '7h',
    yes: 0.47, no: 0.53,
    vol24: 690000, liq: 1410000,
    status: 'live',
    resolvesIn: '64d',
    comments: 198, spark: [43, 45, 44, 46, 47, 49, 48, 47, 46, 48, 47, 47],
    bull: 51,
  },
  {
    id: 'm13',
    q: 'Will Nvidia beat Q1 earnings in February 2026?',
    cat: 'Tech',
    creator: { name: 'quantjoy', handle: '@quantjoy', tier: 'Gold', av: 'QA', rep: 87, markets: 23, vol: '940K' },
    time: '2mo',
    yes: 0.84, no: 0.16,
    vol24: 0, liq: 0,
    status: 'resolved',
    resolution: 'YES', resolvedAt: 'Feb 22', finalYes: 0.84,
    comments: 742, spark: [52, 56, 61, 65, 70, 74, 78, 81, 83, 85, 84, 84],
    bull: 84,
  },
  {
    id: 'm14',
    q: 'Will SpaceX launch Starship in Q1 2026?',
    cat: 'Tech',
    creator: { name: 'circuit.eth', handle: '@circuit', tier: 'King', av: 'CE', rep: 99, markets: 130, vol: '8.3M' },
    time: '1mo',
    yes: 0.76, no: 0.24,
    vol24: 0, liq: 0,
    status: 'resolved',
    resolution: 'YES', resolvedAt: 'Mar 14', finalYes: 0.76,
    comments: 918, spark: [44, 48, 52, 55, 61, 64, 69, 72, 75, 77, 76, 76],
    bull: 76,
  },
  {
    id: 'm15',
    q: 'Will US Q4 2025 GDP exceed 3.2%?',
    cat: 'Finance',
    creator: { name: 'ratesguy', handle: '@ratesguy', tier: 'Platinum', av: 'RG', rep: 91, markets: 55, vol: '3.2M' },
    time: '3mo',
    yes: 0.41, no: 0.59,
    vol24: 0, liq: 0,
    status: 'resolved',
    resolution: 'NO', resolvedAt: 'Jan 30', finalYes: 0.41,
    comments: 236, spark: [57, 55, 53, 50, 48, 45, 43, 42, 40, 41, 41, 41],
    bull: 41,
  },
  {
    id: 'm16',
    q: 'Will Verstappen win the 2025 F1 Championship?',
    cat: 'Sports',
    creator: { name: 'apexline', handle: '@apexline', tier: 'Gold', av: 'AL', rep: 86, markets: 29, vol: '860K' },
    time: '5mo',
    yes: 0.92, no: 0.08,
    vol24: 0, liq: 0,
    status: 'resolved',
    resolution: 'YES', resolvedAt: 'Dec 8', finalYes: 0.92,
    comments: 501, spark: [68, 72, 75, 80, 82, 85, 87, 90, 91, 92, 92, 92],
    bull: 92,
  },
  {
    id: 'm17',
    q: 'Will Avatar 3 cross $2B box office?',
    cat: 'Entertainment',
    creator: { name: 'boxoffice', handle: '@boxoffice', tier: 'Silver', av: 'BO', rep: 79, markets: 16, vol: '380K' },
    time: '2mo',
    yes: 0.38, no: 0.62,
    vol24: 0, liq: 0,
    status: 'resolved',
    resolution: 'NO', resolvedAt: 'Mar 1', finalYes: 0.38,
    comments: 164, spark: [49, 47, 45, 44, 42, 41, 40, 39, 37, 38, 38, 38],
    bull: 38,
  },
  {
    id: 'm18',
    q: 'Will Bitcoin close above $100k on 2025-12-31?',
    cat: 'Crypto',
    creator: { name: 'oracle_eth', handle: '@oracle_eth', tier: 'Silver', av: 'OE', rep: 82, markets: 32, vol: '780K' },
    time: '4mo',
    yes: 0.81, no: 0.19,
    vol24: 0, liq: 0,
    status: 'resolved',
    resolution: 'YES', resolvedAt: 'Jan 1', finalYes: 0.81,
    comments: 1008, spark: [54, 58, 62, 65, 69, 72, 76, 78, 80, 82, 81, 81],
    bull: 81,
  },
];

export const COMMENTS: Comment[] = [
  { id: 'c1', av: 'QA', name: '@quantjoy', time: '12m', text: "CME futures repricing hard after the CPI print. 67c feels rich — I still like YES to $120k but only above 70c you're overpaying.", up: 42, tier: 'Gold' },
  { id: 'c2', av: 'DK', name: '@dexking', time: '34m', text: 'Whale wallet just moved 4k BTC off Coinbase. Hmm.', up: 18, tier: 'Silver' },
  { id: 'c3', av: 'SW', name: '@softwire', time: '1h', text: 'Resolving via Chainlink oracle — so no resolution drama. Rolling 2k YES.', up: 11, tier: 'Platinum' },
];
