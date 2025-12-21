/**
 * Example test file demonstrating the testing setup for Ring Alarm Card
 * This file shows how to write both unit tests and property-based tests
 */

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';

describe('Example Test Suite', () => {
  describe('Unit Tests', () => {
    it('should demonstrate basic Jest functionality', () => {
      const result = 2 + 2;
      expect(result).toBe(4);
    });

    it('should test string manipulation', () => {
      const input = 'hello world';
      const result = input.toUpperCase();
      expect(result).toBe('HELLO WORLD');
    });

    it('should test array operations', () => {
      const numbers = [1, 2, 3, 4, 5];
      const doubled = numbers.map(n => n * 2);
      expect(doubled).toEqual([2, 4, 6, 8, 10]);
    });
  });

  describe('Property-Based Tests', () => {
    it('Property: String length is preserved during case conversion', () => {
      fc.assert(
        fc.property(fc.string(), str => {
          const upper = str.toUpperCase();
          const lower = str.toLowerCase();

          expect(upper.length).toBe(str.length);
          expect(lower.length).toBe(str.length);
        }),
        { numRuns: 100 }
      );
    });

    it('Property: Array map preserves length', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), arr => {
          const doubled = arr.map(x => x * 2);
          expect(doubled.length).toBe(arr.length);
        }),
        { numRuns: 100 }
      );
    });

    it('Property: Addition is commutative', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          expect(a + b).toBe(b + a);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Home Assistant Environment Tests', () => {
    it('should have customElements available', () => {
      expect(window.customElements).toBeDefined();
    });

    it('should have loadCardHelpers mocked', () => {
      expect(window.loadCardHelpers).toBeDefined();
      expect(typeof window.loadCardHelpers).toBe('function');
    });

    it('should have customCards array available', () => {
      expect(window.customCards).toBeDefined();
      expect(Array.isArray(window.customCards)).toBe(true);
    });
  });
});
