// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { actions, tierFromPts, pointsToNextTier } from './useStore';

beforeEach(() => {
  localStorage.clear();
  actions.reset();
});

describe('tierFromPts', () => {
  it('returns Bronze below 1000', () => {
    expect(tierFromPts(0)).toBe('Bronze');
    expect(tierFromPts(999)).toBe('Bronze');
  });
  it('returns Silver between 1000 and 2999', () => {
    expect(tierFromPts(1000)).toBe('Silver');
    expect(tierFromPts(2999)).toBe('Silver');
  });
  it('returns Platinum between 6000 and 14999', () => {
    expect(tierFromPts(6000)).toBe('Platinum');
    expect(tierFromPts(14999)).toBe('Platinum');
  });
  it('returns King at or above 15000', () => {
    expect(tierFromPts(15000)).toBe('King');
  });
});

describe('pointsToNextTier', () => {
  it('gives remaining and progress within tier', () => {
    const info = pointsToNextTier(2000);
    expect(info.next).toBe('Gold');
    expect(info.remaining).toBe(1000);
    expect(info.progress).toBeCloseTo(0.5, 2);
  });
  it('caps at King', () => {
    const info = pointsToNextTier(20000);
    expect(info.next).toBe('King');
    expect(info.remaining).toBe(0);
    expect(info.progress).toBe(1);
  });
});

describe('actions.rollBet', () => {
  it('consumes freebet first then balance', () => {
    const res = actions.rollBet({ marketId: 'x', q: 'Q', side: 'YES', amount: 10, price: 0.5, eta: '1d' });
    expect(res.ok).toBe(true);
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.freebet).toBe(0);
    expect(raw.balance).toBeCloseTo(4815.56, 2);
    expect(raw.positions[0].size).toBe(10);
    expect(raw.positions[0].side).toBe('YES');
  });

  it('rejects when amount exceeds freebet + balance', () => {
    const res = actions.rollBet({ marketId: 'x', q: 'Q', side: 'YES', amount: 999999, price: 0.5, eta: '1d' });
    expect(res.ok).toBe(false);
  });

  it('rejects zero or negative amount', () => {
    expect(actions.rollBet({ marketId: 'x', q: 'Q', side: 'YES', amount: 0, price: 0.5, eta: '1d' }).ok).toBe(false);
    expect(actions.rollBet({ marketId: 'x', q: 'Q', side: 'YES', amount: -10, price: 0.5, eta: '1d' }).ok).toBe(false);
  });

  it('adds history entry and increments VIP pts', () => {
    actions.rollBet({ marketId: 'x', q: 'Q', side: 'YES', amount: 25, price: 0.5, eta: '1d' });
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.history[0].kind).toBe('trade');
    expect(raw.vipPts).toBeGreaterThan(4820);
  });
});

describe('actions.rollBet merge-on-same-side', () => {
  it('merges two buys on same market+side into one position with weighted-avg entry', () => {
    actions.rollBet({ marketId: 'mX', q: 'Q', side: 'YES', amount: 100, price: 0.50, eta: '1d' });
    actions.rollBet({ marketId: 'mX', q: 'Q', side: 'YES', amount: 100, price: 0.70, eta: '1d' });
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    const mxPositions = raw.positions.filter((p: { marketId: string; side: string }) => p.marketId === 'mX' && p.side === 'YES');
    expect(mxPositions.length).toBe(1);
    expect(mxPositions[0].size).toBe(200);
    expect(mxPositions[0].entry).toBeCloseTo(0.60, 2); // (100*0.5 + 100*0.7) / 200
  });

  it('keeps different-side positions separate', () => {
    actions.rollBet({ marketId: 'mX', q: 'Q', side: 'YES', amount: 50, price: 0.60, eta: '1d' });
    actions.rollBet({ marketId: 'mX', q: 'Q', side: 'NO',  amount: 50, price: 0.40, eta: '1d' });
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    const mx = raw.positions.filter((p: { marketId: string }) => p.marketId === 'mX');
    expect(mx.length).toBe(2);
    expect(mx.map((p: { side: string }) => p.side).sort()).toEqual(['NO', 'YES']);
  });
});

describe('actions.sellPosition', () => {
  it('returns cash at current price, computes realized PnL, closes position when fully sold', () => {
    actions.rollBet({ marketId: 'mY', q: 'Q', side: 'YES', amount: 100, price: 0.50, eta: '1d' });
    const beforeBalance = JSON.parse(localStorage.getItem('betsroll_v1')!).balance;
    const res = actions.sellPosition({ marketId: 'mY', side: 'YES', amount: 100, curPrice: 0.75 });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.cashOut).toBeCloseTo(150, 2); // 200 shares × 0.75
    expect(res.realizedPnl).toBeCloseTo(50, 2);
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.balance).toBeCloseTo(beforeBalance + 150, 2);
    expect(raw.positions.find((p: { marketId: string }) => p.marketId === 'mY')).toBeUndefined();
  });

  it('supports partial sell — keeps remainder with updated size and PnL', () => {
    actions.rollBet({ marketId: 'mZ', q: 'Q', side: 'YES', amount: 200, price: 0.50, eta: '1d' });
    const res = actions.sellPosition({ marketId: 'mZ', side: 'YES', amount: 100, curPrice: 0.60 });
    expect(res.ok).toBe(true);
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    const pos = raw.positions.find((p: { marketId: string }) => p.marketId === 'mZ');
    expect(pos.size).toBeCloseTo(100, 2);
    expect(pos.entry).toBeCloseTo(0.50, 2); // entry unchanged by sell
    expect(pos.cur).toBeCloseTo(0.60, 2);
  });

  it('rejects sell with no position', () => {
    const res = actions.sellPosition({ marketId: 'no-such', side: 'YES', amount: 10, curPrice: 0.50 });
    expect(res.ok).toBe(false);
  });

  it('rejects oversell', () => {
    actions.rollBet({ marketId: 'mQ', q: 'Q', side: 'YES', amount: 50, price: 0.50, eta: '1d' });
    const res = actions.sellPosition({ marketId: 'mQ', side: 'YES', amount: 999, curPrice: 0.50 });
    expect(res.ok).toBe(false);
  });

  it('realizes loss when selling at lower price', () => {
    actions.rollBet({ marketId: 'mL', q: 'Q', side: 'YES', amount: 100, price: 0.80, eta: '1d' });
    const res = actions.sellPosition({ marketId: 'mL', side: 'YES', amount: 100, curPrice: 0.40 });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.cashOut).toBeCloseTo(50, 2);     // 125 shares × 0.40
    expect(res.realizedPnl).toBeCloseTo(-50, 2);
  });
});

describe('actions.voteMarket', () => {
  it('yes vote increments validationBoost and vipPts', () => {
    actions.voteMarket('m1', 'yes');
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.validationBoost.m1).toBe(4);
    expect(raw.vipPts).toBe(4824);
  });

  it('no vote records but does not boost', () => {
    actions.voteMarket('m1', 'no');
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.votes.m1).toBe('no');
    expect(raw.validationBoost.m1).toBeUndefined();
    expect(raw.vipPts).toBe(4820);
  });

  it('ignores double-vote on same market', () => {
    actions.voteMarket('m1', 'yes');
    actions.voteMarket('m1', 'yes');
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.validationBoost.m1).toBe(4); // not 8
  });
});

describe('system layer actions', () => {
  it('marks notifications as seen when opening inbox', () => {
    actions.openNotifications();
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.notifSeen).toBe(true);
  });

  it('toggles follows by handle', () => {
    actions.toggleFollow('@circuit');
    let raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.follows['@circuit']).toBe(true);

    actions.toggleFollow('@circuit');
    raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.follows['@circuit']).toBe(false);
  });

  it('updates nested notification settings and top-level settings', () => {
    actions.setSetting('notifs', 'New followers', false);
    actions.setSetting(null, 'hideBalance', true);
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.settings.notifs['New followers']).toBe(false);
    expect(raw.settings.hideBalance).toBe(true);
  });

  it('opens a tx overlay and applies confirmed deposit immediately when requested', () => {
    actions.simulateTx({ kind: 'deposit', amount: 100, hash: '0xabc', label: 'Deposit test', autoConfirmMs: 0 });
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.overlay).toBe('txStatus');
    expect(raw.overlayCtx.state).toBe('confirmed');
    expect(raw.balance).toBeCloseTo(4920.56, 2);
  });

  it('completeOnboarding sets onboarded true and clears auth state', () => {
    actions.completeOnboarding();
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.onboarded).toBe(true);
    expect(raw.authProvider).toBeNull();
  });

  it('setOnboardStep persists tutorial progress', () => {
    actions.setOnboardStep(2);
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.onboardStep).toBe(2);
  });

  it('setOffline toggles offline state', () => {
    actions.setOffline(true);
    let raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.isOffline).toBe(true);

    actions.setOffline(false);
    raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.isOffline).toBe(false);
  });

  it('simulateTx with willFail sets failed overlay state without moving funds', () => {
    actions.simulateTx({ kind: 'withdraw', amount: 100, hash: '0xfail', willFail: true, autoConfirmMs: 0 });
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.overlay).toBe('txStatus');
    expect(raw.overlayCtx.state).toBe('failed');
    expect(raw.balance).toBeCloseTo(4820.56, 2);
  });

  it('enterAsGuest sets guest mode and zeroes funded state', () => {
    actions.enterAsGuest();
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.isGuest).toBe(true);
    expect(raw.onboarded).toBe(true);
    expect(raw.balance).toBe(0);
    expect(raw.freebet).toBe(0);
    expect(raw.positions).toEqual([]);
  });

  it('triggerDeposit for guest opens email sheet without routing state', () => {
    actions.enterAsGuest();
    const result = actions.triggerDeposit('trade');
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(result).toEqual({ guest: true });
    expect(raw.depositTrigger).toBe('trade');
    expect(raw.showEmailSheet).toBe(true);
  });

  it('triggerDeposit for non-guest stores reason without showing email sheet', () => {
    const result = actions.triggerDeposit('manual');
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(result).toEqual({ guest: false });
    expect(raw.depositTrigger).toBe('manual');
    expect(raw.showEmailSheet).toBe(false);
  });

  it('captureEmail saves email and closes sheet', () => {
    actions.enterAsGuest();
    actions.triggerDeposit('manual');
    actions.captureEmail('roller@example.com');
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.guestEmail).toBe('roller@example.com');
    expect(raw.showEmailSheet).toBe(false);
    expect(raw.isGuest).toBe(true);
  });

  it('dismissEmailSheet clears sheet and trigger', () => {
    actions.enterAsGuest();
    actions.triggerDeposit('create');
    actions.dismissEmailSheet();
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.showEmailSheet).toBe(false);
    expect(raw.depositTrigger).toBeNull();
  });
});
