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

    const position: Position = {
      id: `p-${Date.now()}`,
      marketId, q, side, size: amount,
      entry: price, cur: price, pnl: 0,
      eta, createdAt: Date.now(),
    };

    const history: HistoryEntry = {
      id: `h-${Date.now()}`,
      kind: 'trade',
      icon: side === 'YES' ? '↗' : '↘',
      txt: `Bought ${amount} ${side} on "${q.slice(0, 40)}${q.length > 40 ? '…' : ''}"`,
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
      positions: [position, ...state.positions],
      history: hist,
      vipPts, tier,
    };
    emit();
    return { ok: true as const };
  },

  reset() {
    state = { ...INITIAL, positions: SEED_POSITIONS, history: SEED_HISTORY };
    emit();
  },
};
