import type { Market, TierName } from '../data/markets';
import type { SETTINGS_DATA, TransactionKind, TxState } from '../data/system';

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

export type Settings = {
  notifs: Record<keyof typeof SETTINGS_DATA.notifications, boolean>;
  twoFA: boolean;
  hideBalance: boolean;
  language: string;
  theme: 'Dark' | 'Light';
};

export type WalletStatus = 'idle' | 'depositing' | 'withdrawing';
export type OverlayKind = 'comment' | 'txStatus' | 'resolvedClaim' | 'tierUp';
export type DepositTrigger = 'trade' | 'create' | 'manual';

export type TxModal = {
  state: TxState;
  kind: TransactionKind;
  amount: number;
  hash?: string;
  label?: string;
} | null;

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
  notifSeen: boolean;
  follows: Record<string, boolean>;
  settings: Settings;
  walletStatus: WalletStatus;
  txModal: TxModal;
  isOffline: boolean;
  isGeoBlocked: boolean;
  searchQuery: string;
  overlay: OverlayKind | null;
  overlayCtx: TxModal | Record<string, unknown> | null;
  onboarded: boolean;
  authProvider: string | null;
  isGuest: boolean;
  depositTrigger: DepositTrigger | null;
  showEmailSheet: boolean;
  guestEmail: string;
  skelDemo: boolean;
  userHandle: string | null;
};
