/**
 * Property-based tests for AlarmControlManager
 * Tests control action mappings and button state logic
 */

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import {
  AlarmControlManager,
  ControlActionType,
} from './alarm-control-manager';

// Type-safe arbitraries
const stableStateArb = fc.constantFrom(
  'disarmed' as const,
  'armed_home' as const,
  'armed_away' as const
);

const transitionalStateArb = fc.constantFrom(
  'arming' as const,
  'disarming' as const,
  'pending' as const,
  'triggered' as const
);

const nonMappedStateArb = fc.constantFrom(
  'armed_night' as const,
  'armed_vacation' as const,
  'armed_custom_bypass' as const,
  'arming' as const,
  'disarming' as const,
  'pending' as const,
  'triggered' as const,
  'unknown' as const
);

const actionTypeArb = fc.constantFrom(
  'disarm' as const,
  'arm_home' as const,
  'arm_away' as const
);

describe('Property-Based Tests for AlarmControlManager', () => {
  /**
   * Property 1: State-to-Active-Button Mapping
   * Feature: alarm-control-buttons, Property 1: State-to-Active-Button Mapping
   * Validates: Requirements 2.1, 2.2, 2.3, 6.2
   */
  describe('Property 1: State-to-Active-Button Mapping', () => {
    it('should map alarm states to correct active button', () => {
      // For any alarm state that corresponds to a control action,
      // the button matching that state SHALL be marked as active
      fc.assert(
        fc.property(stableStateArb, alarmState => {
          const activeAction = AlarmControlManager.getActiveAction(alarmState);
          const actions = AlarmControlManager.getControlActions();

          // Verify correct mapping
          const expectedMapping: Record<string, ControlActionType> = {
            disarmed: 'disarm',
            armed_home: 'arm_home',
            armed_away: 'arm_away',
          };

          expect(activeAction).toBe(expectedMapping[alarmState]);

          // Verify only one button is active
          const activeButtons = actions.filter(a => a.type === activeAction);
          expect(activeButtons.length).toBe(1);

          // Verify the active button has appropriate color
          const activeButton = activeButtons[0];
          expect(activeButton.activeColor).toMatch(/^--[\w-]+-color$/);

          // Verify specific color mappings per requirement 6.2
          if (alarmState === 'disarmed') {
            expect(activeButton.activeColor).toBe('--success-color');
          } else if (alarmState === 'armed_home') {
            expect(activeButton.activeColor).toBe('--warning-color');
          } else if (alarmState === 'armed_away') {
            expect(activeButton.activeColor).toBe('--error-color');
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should return null for states that do not map to buttons', () => {
      // States that don't correspond to a button should return null
      fc.assert(
        fc.property(nonMappedStateArb, alarmState => {
          const activeAction = AlarmControlManager.getActiveAction(alarmState);
          expect(activeAction).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('should return null for undefined state', () => {
      const activeAction = AlarmControlManager.getActiveAction(undefined);
      expect(activeAction).toBeNull();
    });
  });

  /**
   * Property 2: Transitional States Disable Controls
   * Feature: alarm-control-buttons, Property 2: Transitional States Disable Controls
   * Validates: Requirements 2.5
   */
  describe('Property 2: Transitional States Disable Controls', () => {
    it('should disable controls for all transitional states', () => {
      // For any transitional alarm state, ALL control buttons SHALL be disabled
      fc.assert(
        fc.property(transitionalStateArb, transitionalState => {
          const isDisabled =
            AlarmControlManager.areControlsDisabled(transitionalState);
          expect(isDisabled).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should not disable controls for stable states', () => {
      // Stable states should allow control actions
      fc.assert(
        fc.property(stableStateArb, stableState => {
          const isDisabled = AlarmControlManager.areControlsDisabled(stableState);
          expect(isDisabled).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should disable controls for undefined state', () => {
      const isDisabled = AlarmControlManager.areControlsDisabled(undefined);
      expect(isDisabled).toBe(true);
    });
  });

  /**
   * Property 3: Button-to-Service Mapping
   * Feature: alarm-control-buttons, Property 3: Button-to-Service Mapping
   * Validates: Requirements 3.1, 3.2, 3.3, 3.4
   */
  describe('Property 3: Button-to-Service Mapping', () => {
    it('should map buttons to correct Home Assistant services', () => {
      // For any control button click action, the correct HA service SHALL be called
      fc.assert(
        fc.property(actionTypeArb, actionType => {
          const service = AlarmControlManager.getServiceForAction(actionType);

          // Verify correct service mapping
          const expectedServices: Record<ControlActionType, string> = {
            disarm: 'alarm_disarm',
            arm_home: 'alarm_arm_home',
            arm_away: 'alarm_arm_away',
          };

          expect(service).toBe(expectedServices[actionType]);

          // Verify service name format (should be alarm_* pattern)
          expect(service).toMatch(/^alarm_/);
        }),
        { numRuns: 100 }
      );
    });

    it('should have consistent service definitions in getControlActions', () => {
      // The service in getControlActions should match getServiceForAction
      fc.assert(
        fc.property(actionTypeArb, actionType => {
          const actions = AlarmControlManager.getControlActions();
          const action = actions.find(a => a.type === actionType);

          expect(action).toBeDefined();
          expect(action!.service).toBe(
            AlarmControlManager.getServiceForAction(actionType)
          );
        }),
        { numRuns: 100 }
      );
    });

    it('should always return exactly three control actions', () => {
      const actions = AlarmControlManager.getControlActions();
      expect(actions.length).toBe(3);

      // Verify all required action types are present
      const actionTypes = actions.map(a => a.type);
      expect(actionTypes).toContain('disarm');
      expect(actionTypes).toContain('arm_home');
      expect(actionTypes).toContain('arm_away');
    });
  });
});
