/**
 * Property-based tests for TransitionStateManager
 * Tests transitional state detection and progress calculation
 *
 * Feature: alarm-state-transitions
 */

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { TransitionStateManager } from './transition-state-manager';
import { AlarmState } from '@/types';

describe('Property-Based Tests for TransitionStateManager', () => {
  /**
   * Property 1: Transitional State Detection
   * For any alarm state, isTransitionalState() SHALL return true if and only if
   * the state is one of: 'arming', 'pending', or 'disarming'.
   * For all other states, it SHALL return false.
   *
   * **Feature: alarm-state-transitions, Property 1: Transitional State Detection**
   * **Validates: Requirements 2.1, 2.5**
   */
  describe('Property 1: Transitional State Detection', () => {
    const transitionalStates: AlarmState['state'][] = [
      'arming',
      'pending',
      'disarming',
    ];

    const nonTransitionalStates: AlarmState['state'][] = [
      'disarmed',
      'armed_home',
      'armed_away',
      'armed_night',
      'armed_vacation',
      'armed_custom_bypass',
      'triggered',
      'unknown',
    ];

    it('should return true for all transitional states', () => {
      // Feature: alarm-state-transitions, Property 1: Transitional State Detection
      // Validates: Requirements 2.1, 2.5
      fc.assert(
        fc.property(fc.constantFrom(...transitionalStates), state => {
          const result = TransitionStateManager.isTransitionalState(state);
          expect(result).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should return false for all non-transitional states', () => {
      // Feature: alarm-state-transitions, Property 1: Transitional State Detection
      // Validates: Requirements 2.1, 2.5
      fc.assert(
        fc.property(fc.constantFrom(...nonTransitionalStates), state => {
          const result = TransitionStateManager.isTransitionalState(state);
          expect(result).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should partition all valid alarm states correctly', () => {
      // Feature: alarm-state-transitions, Property 1: Transitional State Detection
      // Validates: Requirements 2.1, 2.5
      const allStates: AlarmState['state'][] = [
        ...transitionalStates,
        ...nonTransitionalStates,
      ];

      fc.assert(
        fc.property(fc.constantFrom(...allStates), state => {
          const isTransitional =
            TransitionStateManager.isTransitionalState(state);
          const expectedTransitional = transitionalStates.includes(state);
          expect(isTransitional).toBe(expectedTransitional);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 3: Progress Calculation Accuracy
   * For any valid exitSecondsLeft value and totalDuration, the calculated progress
   * SHALL equal ((totalDuration - exitSecondsLeft) / totalDuration) * 100,
   * clamped to the range [0, 100].
   *
   * **Feature: alarm-state-transitions, Property 3: Progress Calculation Accuracy**
   * **Validates: Requirements 3.1, 3.2, 3.3**
   */
  describe('Property 3: Progress Calculation Accuracy', () => {
    it('should calculate progress correctly for valid inputs', () => {
      // Feature: alarm-state-transitions, Property 3: Progress Calculation Accuracy
      // Validates: Requirements 3.1, 3.2, 3.3
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 300 }), // totalDuration (1-300 seconds)
          fc.integer({ min: 0, max: 300 }), // exitSecondsLeft (0-300 seconds)
          (totalDuration, exitSecondsLeft) => {
            const progress = TransitionStateManager.calculateProgress(
              exitSecondsLeft,
              totalDuration
            );

            // Progress should always be in [0, 100] range
            expect(progress).toBeGreaterThanOrEqual(0);
            expect(progress).toBeLessThanOrEqual(100);

            // Calculate expected progress
            if (exitSecondsLeft >= totalDuration) {
              expect(progress).toBe(0);
            } else if (exitSecondsLeft <= 0) {
              expect(progress).toBe(100);
            } else {
              const expected =
                ((totalDuration - exitSecondsLeft) / totalDuration) * 100;
              expect(progress).toBeCloseTo(expected, 10);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return 0 when exitSecondsLeft equals totalDuration', () => {
      // Feature: alarm-state-transitions, Property 3: Progress Calculation Accuracy
      // Validates: Requirements 3.1, 3.2, 3.3
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 300 }), duration => {
          const progress = TransitionStateManager.calculateProgress(
            duration,
            duration
          );
          expect(progress).toBe(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should return 100 when exitSecondsLeft equals 0', () => {
      // Feature: alarm-state-transitions, Property 3: Progress Calculation Accuracy
      // Validates: Requirements 3.1, 3.2, 3.3
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 300 }), totalDuration => {
          const progress = TransitionStateManager.calculateProgress(
            0,
            totalDuration
          );
          expect(progress).toBe(100);
        }),
        { numRuns: 100 }
      );
    });

    it('should handle edge cases gracefully', () => {
      // Feature: alarm-state-transitions, Property 3: Progress Calculation Accuracy
      // Validates: Requirements 3.1, 3.2, 3.3
      fc.assert(
        fc.property(
          fc.integer({ min: -100, max: 0 }), // zero or negative duration
          fc.integer({ min: 0, max: 100 }), // any exitSecondsLeft
          (totalDuration, exitSecondsLeft) => {
            const progress = TransitionStateManager.calculateProgress(
              exitSecondsLeft,
              totalDuration
            );

            // Should return 100 for zero or negative duration
            expect(progress).toBe(100);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should clamp negative exitSecondsLeft to 100%', () => {
      // Feature: alarm-state-transitions, Property 3: Progress Calculation Accuracy
      // Validates: Requirements 3.1, 3.2, 3.3
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 300 }), // valid totalDuration
          fc.integer({ min: -100, max: -1 }), // negative exitSecondsLeft
          (totalDuration, exitSecondsLeft) => {
            const progress = TransitionStateManager.calculateProgress(
              exitSecondsLeft,
              totalDuration
            );
            expect(progress).toBe(100);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should be monotonically increasing as exitSecondsLeft decreases', () => {
      // Feature: alarm-state-transitions, Property 3: Progress Calculation Accuracy
      // Validates: Requirements 3.1, 3.2, 3.3
      fc.assert(
        fc.property(
          fc.integer({ min: 10, max: 300 }), // totalDuration
          fc.integer({ min: 1, max: 299 }), // exitSecondsLeft1
          (totalDuration, exitSecondsLeft1) => {
            // Ensure exitSecondsLeft2 < exitSecondsLeft1
            const exitSecondsLeft2 = Math.max(0, exitSecondsLeft1 - 1);

            const progress1 = TransitionStateManager.calculateProgress(
              exitSecondsLeft1,
              totalDuration
            );
            const progress2 = TransitionStateManager.calculateProgress(
              exitSecondsLeft2,
              totalDuration
            );

            // Progress should increase as exitSecondsLeft decreases
            expect(progress2).toBeGreaterThanOrEqual(progress1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
