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
