import { useSyncExternalStore } from 'react';
import { MARKETS, type Market, type TierName } from '../data/markets';
import { SETTINGS_DATA, type TransactionKind } from '../data/system';
import { ME, SEED_POSITIONS, SEED_HISTORY } from '../data/user';
import type { DepositTrigger, HistoryEntry, OverlayKind, Position, Settings, Side, Store, TxModal, Vote } from './types';

export type { HistoryEntry, Position, Side, Store, Vote };

const STORAGE_KEY = 'betsroll_v1';

const DEFAULT_SETTINGS: Settings = {
  notifs: { ...SETTINGS_DATA.notifications },
  twoFA: false,
  hideBalance: false,
  language: 'English',
  theme: 'Dark',
};

const INITIAL: Store = {
  balance: 4820.56,
  freebet: 5.0,
  votes: {},
  validationBoost: {},
  positions: SEED_POSITIONS,
  history: SEED_HISTORY,
  vipPts: 4820,
  tier: 'Gold',
  userMarkets: [],
  notifSeen: false,
  follows: {},
  settings: DEFAULT_SETTINGS,
  walletStatus: 'idle',
  txModal: null,
  isOffline: false,
  isGeoBlocked: false,
  searchQuery: '',
  overlay: null,
  overlayCtx: null,
  onboarded: false,
  authProvider: null,
  isGuest: false,
  depositTrigger: null,
  showEmailSheet: false,
  guestEmail: '',
  skelDemo: false,
  userHandle: null,
};

function normalizeStore(parsed: Partial<Store>): Store {
  return {
    ...INITIAL,
    ...parsed,
    settings: {
      ...DEFAULT_SETTINGS,
      ...(parsed.settings ?? {}),
      notifs: {
        ...DEFAULT_SETTINGS.notifs,
        ...(parsed.settings?.notifs ?? {}),
      },
    },
    follows: parsed.follows ?? {},
  };
}

function loadInitial(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw);
    return normalizeStore(parsed);
  } catch {
    return INITIAL;
  }
}

let state: Store = loadInitial();
const listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.warn('betsroll: persist failed', e); }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T = Store>(selector: (s: Store) => T = (s) => s as unknown as T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

export function tierFromPts(pts: number): TierName {
  if (pts >= 15000) return 'King';
  if (pts >= 6000) return 'Platinum';
  if (pts >= 3000) return 'Gold';
  if (pts >= 1000) return 'Silver';
  return 'Bronze';
}

export function pointsToNextTier(pts: number): { next: TierName; remaining: number; progress: number } {
  const tiers: [TierName, number][] = [
    ['Bronze', 0], ['Silver', 1000], ['Gold', 3000], ['Platinum', 6000], ['King', 15000],
  ];
  const cur = tierFromPts(pts);
  const curIdx = tiers.findIndex(([t]) => t === cur);
  if (curIdx === tiers.length - 1) return { next: 'King', remaining: 0, progress: 1 };
  const [, curThresh] = tiers[curIdx];
  const [nextTier, nextThresh] = tiers[curIdx + 1];
  const span = nextThresh - curThresh;
  const done = pts - curThresh;
  return { next: nextTier, remaining: Math.max(0, nextThresh - pts), progress: Math.min(1, done / span) };
}

export const actions = {
  voteMarket(marketId: string, vote: Vote) {
    if (state.votes[marketId]) return;
    const votes = { ...state.votes, [marketId]: vote };
    let { validationBoost, vipPts, tier, history } = state;
    if (vote === 'yes') {
      validationBoost = { ...validationBoost, [marketId]: (validationBoost[marketId] ?? 0) + 4 };
      vipPts = vipPts + 4;
      const prevTier = tier;
      tier = tierFromPts(vipPts);
      if (tier !== prevTier) {
        history = [{ id: `h-${Date.now()}`, kind: 'tier', icon: '⬆', txt: `Reached VIP tier: ${tier}`, v: '+tier', time: 'now' }, ...history];
      }
    }
    state = { ...state, votes, validationBoost, vipPts, tier, history };
    emit();
  },

  rollBet(args: { marketId: string; q: string; side: Side; amount: number; price: number; eta: string }) {
    const { marketId, q, side, amount, price, eta } = args;
    if (amount <= 0) return { ok: false, reason: 'amount' as const };
    if (amount > state.balance + state.freebet) return { ok: false, reason: 'balance' as const };

    let freebet = state.freebet;
    let balance = state.balance;
    if (freebet > 0) {
      const used = Math.min(freebet, amount);
      freebet -= used;
      balance -= Math.max(0, amount - used);
    } else {
      balance -= amount;
    }

    // Merge with existing position on same market+side: weighted-average entry
    const existing = state.positions.find((p) => p.marketId === marketId && p.side === side);
    let positions: Position[];
    if (existing) {
      const newSize = existing.size + amount;
      const newEntry = (existing.entry * existing.size + price * amount) / newSize;
      const newPnl = newSize * (price - newEntry) / newEntry; // 0 on pure buy, re-anchors on current
      const merged: Position = {
        ...existing, size: newSize, entry: newEntry, cur: price, pnl: newPnl, eta,
      };
      positions = state.positions.map((p) => (p.id === existing.id ? merged : p));
    } else {
      const position: Position = {
        id: `p-${Date.now()}`,
        marketId, q, side, size: amount,
        entry: price, cur: price, pnl: 0,
        eta, createdAt: Date.now(),
      };
      positions = [position, ...state.positions];
    }

    const history: HistoryEntry = {
      id: `h-${Date.now()}`,
      kind: 'trade',
      icon: side === 'YES' ? '↗' : '↘',
      txt: `Bought $${amount.toFixed(0)} ${side} on "${q.slice(0, 40)}${q.length > 40 ? '…' : ''}"`,
      v: `-$${amount.toFixed(2)}`,
      time: 'now',
    };

    const addedPts = Math.round(10 * (amount / 25));
    const prevTier = state.tier;
    const vipPts = state.vipPts + addedPts;
    const tier = tierFromPts(vipPts);

    let hist = [history, ...state.history];
    let overlay: Store['overlay'] = state.overlay;
    let overlayCtx: Store['overlayCtx'] = state.overlayCtx;
    if (tier !== prevTier) {
      hist = [{ id: `h-${Date.now() + 1}`, kind: 'tier', icon: '⬆', txt: `Reached VIP tier: ${tier}`, v: '+tier', time: 'now' }, ...hist];
      overlay = 'tierUp';
      overlayCtx = { tier };
    }

    state = {
      ...state,
      balance, freebet,
      positions,
      history: hist,
      vipPts, tier,
      overlay, overlayCtx,
    };
    emit();
    return { ok: true as const };
  },

  sellPosition(args: { marketId: string; side: Side; amount: number; curPrice: number }):
    | { ok: true; cashOut: number; realizedPnl: number }
    | { ok: false; reason: 'no-position' | 'amount' | 'oversell' } {
    const { marketId, side, amount, curPrice } = args;
    const pos = state.positions.find((p) => p.marketId === marketId && p.side === side);
    if (!pos) return { ok: false, reason: 'no-position' };
    if (amount <= 0) return { ok: false, reason: 'amount' };
    if (amount > pos.size + 0.001) return { ok: false, reason: 'oversell' };

    // shares held against sold-dollars portion: (amount / entry) shares -> cash at curPrice
    const shares = amount / pos.entry;
    const cashOut = shares * curPrice;
    const realizedPnl = cashOut - amount;

    const remainingSize = pos.size - amount;
    let positions: Position[];
    if (remainingSize < 0.01) {
      positions = state.positions.filter((p) => p.id !== pos.id);
    } else {
      const remainingShares = remainingSize / pos.entry;
      const remainingPnl = remainingShares * (curPrice - pos.entry);
      positions = state.positions.map((p) =>
        p.id === pos.id ? { ...p, size: remainingSize, cur: curPrice, pnl: remainingPnl } : p
      );
    }

    const sign = realizedPnl >= 0 ? '+' : '';
    const history: HistoryEntry = {
      id: `h-${Date.now()}`,
      kind: 'trade',
      icon: '↩',
      txt: `Sold $${amount.toFixed(0)} ${side} on "${pos.q.slice(0, 40)}${pos.q.length > 40 ? '…' : ''}" (${sign}$${realizedPnl.toFixed(2)})`,
      v: `+$${cashOut.toFixed(2)}`,
      time: 'now',
    };

    state = {
      ...state,
      balance: state.balance + cashOut,
      positions,
      history: [history, ...state.history],
    };
    emit();
    return { ok: true, cashOut, realizedPnl };
  },

  createMarket(args: { q: string; cat: string; resolvesIn: string; yesPrice: number }) {
    const { q, cat, resolvesIn, yesPrice } = args;
    if (!q.trim() || q.length < 10) return { ok: false as const, reason: 'short-question' as const };
    if (yesPrice <= 0 || yesPrice >= 1) return { ok: false as const, reason: 'bad-price' as const };

    const id = `um-${Date.now()}`;
    const newMarket: Market = {
      id,
      q: q.trim(),
      cat,
      creator: {
        name: ME.handle.replace('@', ''),
        handle: ME.handle,
        tier: state.tier,
        av: 'MV',
        rep: 94,
        markets: ME.marketsCreated + state.userMarkets.length + 1,
        vol: '2.4M',
      },
      time: 'now',
      yes: yesPrice,
      no: 1 - yesPrice,
      vol24: 0,
      liq: 0,
      status: 'validating',
      progress: 0,
      comments: 0,
      spark: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      bull: 50,
      resolvesIn,
    };

    const history: HistoryEntry = {
      id: `h-${Date.now()}`,
      kind: 'market',
      icon: '＋',
      txt: `Created market: "${q.slice(0, 40)}${q.length > 40 ? '…' : ''}"`,
      time: 'now',
    };

    state = {
      ...state,
      userMarkets: [newMarket, ...state.userMarkets],
      history: [history, ...state.history],
    };
    emit();
    return { ok: true as const, id };
  },

  openUser(handle: string) {
    state = { ...state, userHandle: handle };
    emit();
  },

  openNotifications() {
    state = { ...state, notifSeen: true };
    emit();
  },

  openSettings() {
    emit();
  },

  openWallet() {
    state = { ...state, walletStatus: 'idle' };
    emit();
  },

  openDeposit() {
    if (state.isGuest) {
      state = { ...state, depositTrigger: 'manual', showEmailSheet: true };
      emit();
      return;
    }
    state = { ...state, walletStatus: 'depositing' };
    emit();
  },

  openWithdraw() {
    state = { ...state, walletStatus: 'withdrawing' };
    emit();
  },

  openSearch(q = '') {
    state = { ...state, searchQuery: q };
    emit();
  },

  toggleFollow(handle: string) {
    state = { ...state, follows: { ...state.follows, [handle]: !state.follows[handle] } };
    emit();
  },

  setSetting(group: 'notifs' | null, key: string, value: boolean | string) {
    if (group === 'notifs') {
      state = {
        ...state,
        settings: {
          ...state.settings,
          notifs: { ...state.settings.notifs, [key]: Boolean(value) },
        },
      };
    } else {
      state = { ...state, settings: { ...state.settings, [key]: value } };
    }
    emit();
  },

  simulateTx(args: {
    kind: TransactionKind;
    amount: number;
    hash?: string;
    label?: string;
    autoConfirmMs?: number;
    willFail?: boolean;
  }) {
    const { kind, amount, hash, label, autoConfirmMs = 1800, willFail = false } = args;
    const pending: NonNullable<TxModal> = { state: 'pending', kind, amount, hash, label };
    state = { ...state, overlay: 'txStatus', overlayCtx: pending, txModal: pending };
    emit();

    const confirm = () => {
      const nextCtx: NonNullable<TxModal> = { ...pending, state: willFail ? 'failed' : 'confirmed' };
      let balance = state.balance;
      if (!willFail && kind === 'deposit') balance += amount;
      if (!willFail && kind === 'withdraw') balance = Math.max(0, balance - amount);
      state = { ...state, balance, overlayCtx: nextCtx, txModal: nextCtx };
      emit();
    };

    if (autoConfirmMs <= 0) confirm();
    else window.setTimeout(confirm, autoConfirmMs);
  },

  setOffline(isOffline: boolean) {
    state = { ...state, isOffline };
    emit();
  },

  setGeoBlocked(isGeoBlocked: boolean) {
    state = { ...state, isGeoBlocked };
    emit();
  },

  setOnboarded(onboarded: boolean) {
    state = { ...state, onboarded };
    emit();
  },

  completeOnboarding() {
    state = { ...state, onboarded: true, authProvider: null, isGeoBlocked: false };
    emit();
  },

  setAuthProvider(authProvider: string | null) {
    state = { ...state, authProvider };
    emit();
  },

  enterAsGuest() {
    state = {
      ...state,
      isGuest: true,
      onboarded: true,
      balance: 0,
      freebet: 0,
      positions: [],
      authProvider: null,
      depositTrigger: null,
      showEmailSheet: false,
      guestEmail: '',
    };
    emit();
  },

  triggerDeposit(reason: DepositTrigger) {
    if (state.isGuest) {
      state = { ...state, depositTrigger: reason, showEmailSheet: true };
      emit();
      return { guest: true as const };
    }
    state = { ...state, depositTrigger: reason };
    emit();
    return { guest: false as const };
  },

  captureEmail(email: string) {
    state = { ...state, guestEmail: email, showEmailSheet: false };
    emit();
  },

  dismissEmailSheet() {
    state = { ...state, showEmailSheet: false, depositTrigger: null };
    emit();
  },

  showOverlay(overlay: OverlayKind, overlayCtx: Store['overlayCtx'] = null) {
    state = { ...state, overlay, overlayCtx };
    emit();
  },

  closeOverlay() {
    state = { ...state, overlay: null, overlayCtx: null, txModal: null };
    emit();
  },

  reset() {
    state = { ...INITIAL, positions: SEED_POSITIONS, history: SEED_HISTORY };
    emit();
  },
};

export function useAllMarkets(): Market[] {
  const userMarkets = useStore((s) => s.userMarkets);
  return [...userMarkets, ...MARKETS];
}

export function findMarketById(id: string | undefined, userMarkets: Market[]): Market | undefined {
  if (!id) return undefined;
  return [...userMarkets, ...MARKETS].find((m) => m.id === id);
}
