import { describe, expect, it } from 'vitest';
import { calcResolvedPosition } from './MobileResolved';

describe('calcResolvedPosition', () => {
  it('pays out winning positions at one over entry and computes P/L', () => {
    const result = calcResolvedPosition({
      id: 'p-resolved-win',
      marketId: 'm13',
      side: 'YES',
      size: 50,
      entry: 0.25,
      cur: 0.84,
      pnl: 0,
      q: 'Q',
      eta: 'resolved',
      createdAt: 0,
    }, 'YES');

    expect(result.won).toBe(true);
    expect(result.payout).toBeCloseTo(200, 2);
    expect(result.pnl).toBeCloseTo(150, 2);
  });

  it('returns zero payout and negative P/L for losing positions', () => {
    const result = calcResolvedPosition({
      id: 'p-resolved-loss',
      marketId: 'm15',
      side: 'YES',
      size: 80,
      entry: 0.4,
      cur: 0.41,
      pnl: 0,
      q: 'Q',
      eta: 'resolved',
      createdAt: 0,
    }, 'NO');

    expect(result.won).toBe(false);
    expect(result.payout).toBe(0);
    expect(result.pnl).toBe(-80);
  });
});
