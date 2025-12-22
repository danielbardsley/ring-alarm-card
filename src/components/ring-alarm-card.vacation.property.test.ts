/**
 * Property-based tests for RingAlarmCard vacation button integration
 * Feature: vacation-button
 *
 * Property 5: Alarm State Independence
 * Validates: Requirements 5.1, 5.3
 *
 * Property 6: State Isolation
 * Validates: Requirements 5.2, 5.4
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fc from 'fast-check';
import { RingAlarmCard } from './ring-alarm-card';
import { HomeAssistant, RingAlarmCardConfig, HassEntity } from '../types';

// Register the custom element
import '../index';

/**
 * All valid alarm states for testing
 */
const ALL_ALARM_STATES = [
  'disarmed',
  'armed_home',
  'armed_away',
  'armed_night',
  'armed_vacation',
  'armed_custom_bypass',
  'arming',
  'disarming',
  'pending',
  'triggered',
] as const;

/**
 * Create a mock HASS object with alarm and vacation entities
 */
function createMockHass(
  alarmState: string,
  vacationState: string,
  alarmAttributes: Record<string, unknown> = {}
): HomeAssistant {
  return {
    states: {
      'alarm_control_panel.ring_alarm': {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: alarmState,
        attributes: alarmAttributes,
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      } as HassEntity,
      'input_boolean.vacation_mode': {
        entity_id: 'input_boolean.vacation_mode',
        state: vacationState,
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      } as HassEntity,
    },
    callService: jest.fn().mockResolvedValue({}),
    language: 'en',
    themes: {},
    selectedTheme: null,
    panels: {},
    panelUrl: '',
  };
}

describe('Property-Based Tests for Vacation Button Integration', () => {
  let element: RingAlarmCard;

  beforeEach(() => {
    element = document.createElement('ring-alarm-card') as RingAlarmCard;
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  describe('Property 5: Alarm State Independence', () => {
    /**
     * Property 5: Alarm State Independence
     * *For any* alarm state (disarmed, armed_home, armed_away, arming, disarming, pending, triggered),
     * the vacation button SHALL remain enabled and clickable.
     * **Validates: Requirements 5.1, 5.3**
     */
    it('should keep vacation button enabled regardless of alarm state', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate any valid alarm state
          fc.constantFrom(...ALL_ALARM_STATES),
          // Generate vacation state (on or off)
          fc.constantFrom('on', 'off'),
          // Generate optional exit_seconds_left for transitional states
          fc.option(fc.integer({ min: 0, max: 60 })),

          async (alarmState, vacationState, exitSecondsLeft) => {
            // Create fresh element for this test
            const testElement = document.createElement(
              'ring-alarm-card'
            ) as RingAlarmCard;
            document.body.appendChild(testElement);

            try {
              // Create configuration with vacation entity
              const config: RingAlarmCardConfig = {
                type: 'custom:ring-alarm-card',
                entity: 'alarm_control_panel.ring_alarm',
                vacation_entity: 'input_boolean.vacation_mode',
              };

              // Create attributes for transitional states
              const attributes: Record<string, unknown> = {};
              if (
                ['arming', 'pending', 'disarming'].includes(alarmState) &&
                exitSecondsLeft !== null
              ) {
                attributes.exit_seconds_left = exitSecondsLeft;
                if (alarmState === 'arming') {
                  attributes.next_state = 'armed_away';
                }
              }

              // Create mock HASS with the generated states
              const mockHass = createMockHass(
                alarmState,
                vacationState,
                attributes
              );

              // Set configuration and HASS
              testElement.setConfig(config);
              testElement.hass = mockHass;

              // Manually trigger validation since Lit lifecycle isn't working in tests
              (testElement as any)._validateAndInitializeEntity();
              (testElement as any)._validateAndInitializeVacationEntity();

              await testElement.updateComplete;

              // Get the vacation state from the component
              const componentVacationState = (testElement as any).vacationState;

              // Property assertion: vacation button should NOT be disabled
              // regardless of the alarm state
              expect(componentVacationState).not.toBeNull();
              expect(componentVacationState.isDisabled).toBe(false);

              // Verify vacation state reflects the entity state correctly
              expect(componentVacationState.isActive).toBe(
                vacationState === 'on'
              );
            } finally {
              if (testElement.parentNode) {
                testElement.parentNode.removeChild(testElement);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should allow vacation button clicks during transitional alarm states', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate transitional alarm states
          fc.constantFrom('arming', 'disarming', 'pending'),
          // Generate vacation state
          fc.constantFrom('on', 'off'),
          // Generate exit seconds
          fc.integer({ min: 1, max: 60 }),

          async (alarmState, vacationState, exitSecondsLeft) => {
            const testElement = document.createElement(
              'ring-alarm-card'
            ) as RingAlarmCard;
            document.body.appendChild(testElement);

            try {
              const config: RingAlarmCardConfig = {
                type: 'custom:ring-alarm-card',
                entity: 'alarm_control_panel.ring_alarm',
                vacation_entity: 'input_boolean.vacation_mode',
              };

              const attributes: Record<string, unknown> = {
                exit_seconds_left: exitSecondsLeft,
              };
              if (alarmState === 'arming') {
                attributes.next_state = 'armed_away';
              }

              const mockHass = createMockHass(
                alarmState,
                vacationState,
                attributes
              );

              testElement.setConfig(config);
              testElement.hass = mockHass;
              (testElement as any)._validateAndInitializeEntity();
              (testElement as any)._validateAndInitializeVacationEntity();

              await testElement.updateComplete;

              const componentVacationState = (testElement as any).vacationState;

              // Property: vacation button should be clickable (not disabled, not loading)
              expect(componentVacationState).not.toBeNull();
              expect(componentVacationState.isDisabled).toBe(false);
              expect(componentVacationState.isLoading).toBe(false);

              // Verify the click handler can be called without error
              expect(() => {
                (testElement as any)._handleVacationButtonClick();
              }).not.toThrow();
            } finally {
              if (testElement.parentNode) {
                testElement.parentNode.removeChild(testElement);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 6: State Isolation', () => {
    /**
     * Property 6: State Isolation
     * *For any* sequence of alarm state transitions, the vacation button state
     * (isActive, isLoading, hasError) SHALL remain unchanged unless explicitly
     * modified by vacation button interactions.
     * **Validates: Requirements 5.2, 5.4**
     */
    it('should preserve vacation state during alarm state transitions', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate a sequence of alarm state transitions
          fc.array(fc.constantFrom(...ALL_ALARM_STATES), {
            minLength: 2,
            maxLength: 5,
          }),
          // Generate initial vacation state
          fc.constantFrom('on', 'off'),

          async (alarmStateSequence, vacationState) => {
            const testElement = document.createElement(
              'ring-alarm-card'
            ) as RingAlarmCard;
            document.body.appendChild(testElement);

            try {
              const config: RingAlarmCardConfig = {
                type: 'custom:ring-alarm-card',
                entity: 'alarm_control_panel.ring_alarm',
                vacation_entity: 'input_boolean.vacation_mode',
              };

              // Start with first alarm state
              const initialAlarmState = alarmStateSequence[0];
              let mockHass = createMockHass(initialAlarmState, vacationState);

              testElement.setConfig(config);
              testElement.hass = mockHass;
              (testElement as any)._validateAndInitializeEntity();
              (testElement as any)._validateAndInitializeVacationEntity();

              await testElement.updateComplete;

              // Capture initial vacation state
              const initialVacationState = (testElement as any).vacationState;
              expect(initialVacationState).not.toBeNull();

              const expectedIsActive = vacationState === 'on';

              // Transition through all alarm states
              for (let i = 1; i < alarmStateSequence.length; i++) {
                const newAlarmState = alarmStateSequence[i];

                // Create new HASS with updated alarm state but same vacation state
                const newHass = createMockHass(newAlarmState, vacationState);

                testElement.hass = newHass;
                (testElement as any)._handleEntityStateChange();

                await testElement.updateComplete;

                // Property: vacation state should remain unchanged
                const currentVacationState = (testElement as any).vacationState;
                expect(currentVacationState).not.toBeNull();
                expect(currentVacationState.isActive).toBe(expectedIsActive);
                // isLoading and hasError should remain false since we didn't interact with vacation button
                expect(currentVacationState.isLoading).toBe(false);
                expect(currentVacationState.hasError).toBe(false);
              }
            } finally {
              if (testElement.parentNode) {
                testElement.parentNode.removeChild(testElement);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not affect vacation state when alarm buttons are clicked', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate alarm state
          fc.constantFrom('disarmed', 'armed_home', 'armed_away'),
          // Generate vacation state
          fc.constantFrom('on', 'off'),
          // Generate alarm button action
          fc.constantFrom('disarm', 'arm_home', 'arm_away'),

          async (alarmState, vacationState, buttonAction) => {
            const testElement = document.createElement(
              'ring-alarm-card'
            ) as RingAlarmCard;
            document.body.appendChild(testElement);

            try {
              const config: RingAlarmCardConfig = {
                type: 'custom:ring-alarm-card',
                entity: 'alarm_control_panel.ring_alarm',
                vacation_entity: 'input_boolean.vacation_mode',
              };

              const mockHass = createMockHass(alarmState, vacationState);

              testElement.setConfig(config);
              testElement.hass = mockHass;
              (testElement as any)._validateAndInitializeEntity();
              (testElement as any)._validateAndInitializeVacationEntity();

              await testElement.updateComplete;

              // Capture vacation state before alarm button click
              const vacationStateBefore = {
                ...(testElement as any).vacationState,
              };

              // Click an alarm button
              await (testElement as any)._handleControlButtonClick(
                buttonAction
              );

              await testElement.updateComplete;

              // Property: vacation state should be unchanged
              const vacationStateAfter = (testElement as any).vacationState;
              expect(vacationStateAfter.isActive).toBe(
                vacationStateBefore.isActive
              );
              // Note: isLoading and hasError might change due to async nature,
              // but isActive should definitely remain unchanged
            } finally {
              if (testElement.parentNode) {
                testElement.parentNode.removeChild(testElement);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not affect alarm state when vacation button is clicked', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate alarm state
          fc.constantFrom('disarmed', 'armed_home', 'armed_away'),
          // Generate vacation state
          fc.constantFrom('on', 'off'),

          async (alarmState, vacationState) => {
            const testElement = document.createElement(
              'ring-alarm-card'
            ) as RingAlarmCard;
            document.body.appendChild(testElement);

            try {
              const config: RingAlarmCardConfig = {
                type: 'custom:ring-alarm-card',
                entity: 'alarm_control_panel.ring_alarm',
                vacation_entity: 'input_boolean.vacation_mode',
              };

              const mockHass = createMockHass(alarmState, vacationState);

              testElement.setConfig(config);
              testElement.hass = mockHass;
              (testElement as any)._validateAndInitializeEntity();
              (testElement as any)._validateAndInitializeVacationEntity();

              await testElement.updateComplete;

              // Capture alarm state before vacation button click
              const alarmStateBefore = (testElement as any).alarmState?.state;

              // Click vacation button
              await (testElement as any)._handleVacationButtonClick();

              await testElement.updateComplete;

              // Property: alarm state should be unchanged
              const alarmStateAfter = (testElement as any).alarmState?.state;
              expect(alarmStateAfter).toBe(alarmStateBefore);

              // Verify the service call was for input_boolean, not alarm_control_panel
              expect(mockHass.callService).toHaveBeenCalledWith(
                'input_boolean',
                expect.any(String),
                expect.objectContaining({
                  entity_id: 'input_boolean.vacation_mode',
                })
              );
            } finally {
              if (testElement.parentNode) {
                testElement.parentNode.removeChild(testElement);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
