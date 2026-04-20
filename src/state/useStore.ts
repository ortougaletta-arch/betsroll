import { useSyncExternalStore } from 'react';
import type { TierName } from '../data/markets';
import { SEED_POSITIONS, SEED_HISTORY } from '../data/user';
import type { HistoryEntry, Position, Side, Store, Vote } from './types';

export type { HistoryEntry, Position, Side, Store, Vote };

const STORAGE_KEY = 'betsroll_v1';

const INITIAL: Store = {
  balance: 4820.56,
  freebet: 5.0,
  votes: {},
  validationBoost: {},
  positions: SEED_POSITIONS,
  history: SEED_HISTORY,
  vipPts: 4820,
  tier: 'Gold',
};

function loadInitial(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw);
    return { ...INITIAL, ...parsed };
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
    if (tier !== prevTier) {
      hist = [{ id: `h-${Date.now() + 1}`, kind: 'tier', icon: '⬆', txt: `Reached VIP tier: ${tier}`, v: '+tier', time: 'now' }, ...hist];
    }

    state = {
      ...state,
      balance, freebet,
      positions,
      history: hist,
      vipPts, tier,
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

  reset() {
    state = { ...INITIAL, positions: SEED_POSITIONS, history: SEED_HISTORY };
    emit();
  },
};
