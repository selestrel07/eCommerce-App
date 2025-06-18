import { describe, expect, it } from 'vitest';
import { keyToNameFormatter } from './product-key-formatter.ts';

describe('Test product key formatter function', () => {
  it('Should return the formatted product key', () => {
    expect(keyToNameFormatter()).toBe('');
    expect(keyToNameFormatter('one')).toBe('One');
    expect(keyToNameFormatter('one-two')).toBe('One Two');
  });
});
