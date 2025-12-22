/**
 * Property-based tests for VacationButtonManager
 * Tests vacation state mapping and toggle service selection
 */

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { VacationButtonManager } from './vacation-button-manager';

// Arbitraries for entity states
const onStateArb = fc.constant('on' as const);
const offStateArb = fc.constant('off' as const);

// All possible input_boolean states
const validEntityStateArb = fc.constantFrom('on', 'off');
const invalidEntityStateArb = fc.constantFrom(
  'unavailable',
  'unknown',
  undefined
);

// Valid input_boolean entity ID generator
const validEntityNameArb = fc
  .tuple(
    fc.constantFrom('a', 'b', 'c', '_'),
    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789_'.split('')), {
      minLength: 0,
      maxLength: 20,
    })
  )
  .map(([first, rest]) => `input_boolean.${first}${rest}`);

// Invalid entity ID generators
const invalidDomainEntityArb = fc.constantFrom(
  'switch.vacation_mode',
  'light.vacation',
  'sensor.vacation',
  'binary_sensor.vacation',
  'automation.vacation'
);

const invalidFormatEntityArb = fc.constantFrom(
  'input_boolean.',
  'input_boolean',
  '',
  'input_boolean.123invalid',
  'input_boolean.-invalid',
  'input_boolean.has space'
);

describe('Property-Based Tests for VacationButtonManager', () => {
  /**
   * Property 3: Vacation State to Active Mapping
   * Feature: vacation-button, Property 3: Vacation State to Active Mapping
   * Validates: Requirements 3.1, 3.2, 3.3
   */
  describe('Property 3: Vacation State to Active Mapping', () => {
    it('should return true only when entity state is "on"', () => {
      // For any input_boolean entity state, isActive SHALL be true if and only if state equals "on"
      fc.assert(
        fc.property(onStateArb, state => {
          const isActive = VacationButtonManager.isVacationActive(state);
          expect(isActive).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should return false when entity state is "off"', () => {
      fc.assert(
        fc.property(offStateArb, state => {
          const isActive = VacationButtonManager.isVacationActive(state);
          expect(isActive).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should return false for unavailable or unknown states', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('unavailable', 'unknown', undefined),
          state => {
            const isActive = VacationButtonManager.isVacationActive(state);
            expect(isActive).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return false for any arbitrary non-"on" string', () => {
      // For any string that is not exactly "on", isActive should be false
      fc.assert(
        fc.property(
          fc.string().filter(s => s !== 'on'),
          state => {
            const isActive = VacationButtonManager.isVacationActive(state);
            expect(isActive).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly map state to VacationButtonState.isActive', () => {
      // createStateFromEntity should have isActive matching isVacationActive
      fc.assert(
        fc.property(validEntityStateArb, state => {
          const buttonState = VacationButtonManager.createStateFromEntity(state);
          const expectedActive = VacationButtonManager.isVacationActive(state);
          expect(buttonState.isActive).toBe(expectedActive);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 4: Toggle Service Selection
   * Feature: vacation-button, Property 4: Toggle Service Selection
   * Validates: Requirements 4.2, 4.3
   */
  describe('Property 4: Toggle Service Selection', () => {
    it('should return "turn_off" when current state is "on"', () => {
      // When input_boolean is "on", clicking SHALL call turn_off
      fc.assert(
        fc.property(onStateArb, state => {
          const service = VacationButtonManager.getToggleService(state);
          expect(service).toBe('turn_off');
        }),
        { numRuns: 100 }
      );
    });

    it('should return "turn_on" when current state is "off"', () => {
      // When input_boolean is "off", clicking SHALL call turn_on
      fc.assert(
        fc.property(offStateArb, state => {
          const service = VacationButtonManager.getToggleService(state);
          expect(service).toBe('turn_on');
        }),
        { numRuns: 100 }
      );
    });

    it('should return "turn_on" for undefined or unavailable states', () => {
      // Default to turn_on for unknown states (safe default)
      fc.assert(
        fc.property(invalidEntityStateArb, state => {
          const service = VacationButtonManager.getToggleService(state);
          expect(service).toBe('turn_on');
        }),
        { numRuns: 100 }
      );
    });

    it('should always return a valid input_boolean service name', () => {
      // For any state, the returned service should be a valid input_boolean service
      fc.assert(
        fc.property(
          fc.oneof(validEntityStateArb, invalidEntityStateArb),
          state => {
            const service = VacationButtonManager.getToggleService(state);
            expect(['turn_on', 'turn_off']).toContain(service);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should toggle correctly: on->turn_off, off->turn_on', () => {
      // The toggle service should be the opposite of the current state
      fc.assert(
        fc.property(validEntityStateArb, state => {
          const service = VacationButtonManager.getToggleService(state);
          if (state === 'on') {
            expect(service).toBe('turn_off');
          } else {
            expect(service).toBe('turn_on');
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Additional property tests for entity validation
   */
  describe('Entity Validation Properties', () => {
    it('should accept valid input_boolean entity IDs', () => {
      fc.assert(
        fc.property(validEntityNameArb, entityId => {
          const isValid = VacationButtonManager.isValidVacationEntity(entityId);
          expect(isValid).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject entities with wrong domain', () => {
      fc.assert(
        fc.property(invalidDomainEntityArb, entityId => {
          const isValid = VacationButtonManager.isValidVacationEntity(entityId);
          expect(isValid).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject entities with invalid format', () => {
      fc.assert(
        fc.property(invalidFormatEntityArb, entityId => {
          const isValid = VacationButtonManager.isValidVacationEntity(entityId);
          expect(isValid).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Display properties consistency
   */
  describe('Display Properties', () => {
    it('should always return consistent display properties', () => {
      // Multiple calls should return the same values
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100 }), () => {
          const props1 = VacationButtonManager.getDisplayProperties();
          const props2 = VacationButtonManager.getDisplayProperties();

          expect(props1.label).toBe(props2.label);
          expect(props1.icon).toBe(props2.icon);
          expect(props1.activeColor).toBe(props2.activeColor);

          // Verify expected values per requirements
          expect(props1.label).toBe('Vacation');
          expect(props1.icon).toBe('mdi:beach');
          expect(props1.activeColor).toBe('--info-color');
        }),
        { numRuns: 100 }
      );
    });
  });
});
