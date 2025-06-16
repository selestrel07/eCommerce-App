import { describe, expect, it } from 'vitest';
import { formatPrice } from './price-formatter.ts';

describe('Test price formatter function', () => {
  it('Should return formatted price', () => {
    const priceCents = 1500;
    const price = 15;
    expect(formatPrice(priceCents, 2)).toBe('15.00');
    expect(formatPrice()).toBe('');
    expect(formatPrice(price)).toBe('15.00');
  });
});
