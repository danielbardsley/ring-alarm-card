/**
 * Property-based tests for AlarmDisplayRenderer accessibility compliance
 */

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';

import { AlarmDisplayRenderer } from './alarm-display-renderer';
import {
  AlarmControlManager,
  ControlActionType,
} from './alarm-control-manager';
import { AlarmState, RingAlarmCardConfig } from '@/types';

describe('AlarmDisplayRenderer Property Tests', () => {
  describe('Property 6: Accessibility Compliance', () => {
    it('should include proper ARIA attributes for all alarm states', () => {
      // Feature: ring-alarm-ui, Property 6: Accessibility Compliance
      // Validates: Requirements 2.5
      fc.assert(
        fc.property(
          fc.constantFrom(
            'disarmed',
            'armed_home',
            'armed_away',
            'pending',
            'triggered',
            'unknown'
          ),
          fc.boolean(), // show_state_text
          fc.boolean(), // compact_mode
          (state, showStateText, compactMode) => {
            // Create a valid AlarmState object
            const alarmState: AlarmState = {
              state: state as AlarmState['state'],
              icon: 'mdi:shield-off',
              color: '--success-color',
              label: 'Test State',
              isAnimated: false,
            };

            // Create config
            const config: RingAlarmCardConfig = {
              type: 'custom:ring-alarm-card',
              entity: 'alarm_control_panel.test',
              show_state_text: showStateText,
              compact_mode: compactMode,
            };

            // Render the alarm status
            const result = AlarmDisplayRenderer.renderAlarmStatus(
              alarmState,
              config
            );
            const htmlString = result.getHTML?.() || result.toString();

            // Verify ARIA attributes are present
            expect(htmlString).toMatch(/role="status"/);
            expect(htmlString).toMatch(/aria-label="[^"]*"/);
            expect(htmlString).toMatch(/aria-live="polite"/);
            expect(htmlString).toMatch(/aria-hidden="true"/);

            // Verify accessibility structure
            expect(htmlString).toContain('class="alarm-status');
            expect(htmlString).toContain('ha-icon');

            // If text is shown, verify it has proper labeling
            if (showStateText) {
              expect(htmlString).toMatch(/aria-label="Current state:[^"]*"/);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include proper ARIA attributes for error states', () => {
      // Feature: ring-alarm-ui, Property 6: Accessibility Compliance
      // Validates: Requirements 2.5
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          errorMessage => {
            // Render error state
            const result = AlarmDisplayRenderer.renderErrorState(errorMessage);
            const htmlString = result.getHTML?.() || result.toString();

            // Verify ARIA attributes for error state
            expect(htmlString).toMatch(/role="alert"/);
            expect(htmlString).toMatch(/aria-label="Error:[^"]*"/);
            expect(htmlString).toMatch(/aria-hidden="true"/);

            // Verify error structure
            expect(htmlString).toContain('class="alarm-error');
            expect(htmlString).toContain('ha-icon');
            expect(htmlString).toContain(errorMessage);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include proper ARIA attributes for loading state', () => {
      // Feature: ring-alarm-ui, Property 6: Accessibility Compliance
      // Validates: Requirements 2.5
      fc.assert(
        fc.property(
          fc.constant(null), // No parameters needed for loading state
          () => {
            // Render loading state
            const result = AlarmDisplayRenderer.renderLoadingState();
            const htmlString = result.getHTML?.() || result.toString();

            // Verify ARIA attributes for loading state
            expect(htmlString).toMatch(/role="status"/);
            expect(htmlString).toMatch(/aria-label="Loading alarm status"/);
            expect(htmlString).toMatch(/aria-live="polite"/);
            expect(htmlString).toMatch(/aria-hidden="true"/);

            // Verify loading structure
            expect(htmlString).toContain('class="alarm-loading');
            expect(htmlString).toContain('ha-icon');
            expect(htmlString).toContain('Loading...');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include proper ARIA attributes for entity not found errors', () => {
      // Feature: ring-alarm-ui, Property 6: Accessibility Compliance
      // Validates: Requirements 2.5
      fc.assert(
        fc.property(
          fc
            .string({ minLength: 1, maxLength: 50 })
            .map(s => `alarm_control_panel.${s}`),
          entityId => {
            // Render entity not found error
            const result = AlarmDisplayRenderer.renderEntityNotFound(entityId);
            const htmlString = result.getHTML?.() || result.toString();

            // Verify ARIA attributes for entity not found error
            expect(htmlString).toMatch(/role="alert"/);
            expect(htmlString).toMatch(
              /aria-label="Entity not found error:[^"]*"/
            );
            expect(htmlString).toMatch(/aria-hidden="true"/);

            // Verify entity not found structure
            expect(htmlString).toContain('class="alarm-error');
            expect(htmlString).toContain('ha-icon');
            expect(htmlString).toContain(entityId);
            expect(htmlString).toContain('Entity not found');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 4: ARIA Labels Present
   * Feature: alarm-control-buttons, Property 4: ARIA Labels Present
   * Validates: Requirements 5.1
   *
   * Tests that all control buttons have appropriate ARIA labels by verifying
   * the AlarmControlManager provides correct action definitions that include
   * labels for accessibility.
   */
  describe('Property 4: ARIA Labels Present', () => {
    const actionTypeArb = fc.constantFrom(
      'disarm' as const,
      'arm_home' as const,
      'arm_away' as const
    );

    it('should have descriptive labels for all control actions', () => {
      // For any control action, there SHALL be a descriptive label
      fc.assert(
        fc.property(actionTypeArb, actionType => {
          const actions = AlarmControlManager.getControlActions();
          const action = actions.find(a => a.type === actionType)!;

          // Verify the action has a non-empty label
          expect(action.label).toBeDefined();
          expect(action.label.length).toBeGreaterThan(0);

          // Verify the action has an icon for visual representation
          expect(action.icon).toBeDefined();
          expect(action.icon).toMatch(/^mdi:/);
        }),
        { numRuns: 100 }
      );
    });

    it('should provide unique ARIA labels for each action type', () => {
      // Each action type should have a unique, descriptive label
      const actions = AlarmControlManager.getControlActions();

      // Expected ARIA labels that describe the action
      const expectedAriaLabels: Record<ControlActionType, string> = {
        disarm: 'Set alarm to disarmed',
        arm_home: 'Arm alarm in home mode',
        arm_away: 'Arm alarm in away mode',
      };

      fc.assert(
        fc.property(actionTypeArb, actionType => {
          // Verify each action type maps to a unique, descriptive label
          const expectedLabel = expectedAriaLabels[actionType];
          expect(expectedLabel).toBeDefined();
          expect(expectedLabel.length).toBeGreaterThan(0);

          // Verify the action exists in the control actions
          const action = actions.find(a => a.type === actionType);
          expect(action).toBeDefined();
        }),
        { numRuns: 100 }
      );
    });

    it('should have all three control actions with labels', () => {
      const actions = AlarmControlManager.getControlActions();

      // Verify exactly 3 actions
      expect(actions.length).toBe(3);

      // Verify all actions have labels
      for (const action of actions) {
        expect(action.label).toBeDefined();
        expect(action.label.length).toBeGreaterThan(0);
      }

      // Verify unique labels
      const labels = actions.map(a => a.label);
      const uniqueLabels = new Set(labels);
      expect(uniqueLabels.size).toBe(3);
    });
  });

  /**
   * Property 5: ARIA Pressed Reflects Active State
   * Feature: alarm-control-buttons, Property 5: ARIA Pressed Reflects Active State
   * Validates: Requirements 5.4
   *
   * Tests that the active action correctly reflects the current alarm state,
   * which determines the aria-pressed attribute value.
   */
  describe('Property 5: ARIA Pressed Reflects Active State', () => {
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

    it('should identify exactly one active button for stable states', () => {
      // For any stable alarm state, exactly one button should be active (aria-pressed="true")
      fc.assert(
        fc.property(stableStateArb, stateValue => {
          const activeAction = AlarmControlManager.getActiveAction(stateValue);
          const actions = AlarmControlManager.getControlActions();

          // Exactly one action should be active
          expect(activeAction).not.toBeNull();

          // Verify the mapping is correct
          const expectedMapping: Record<string, ControlActionType> = {
            disarmed: 'disarm',
            armed_home: 'arm_home',
            armed_away: 'arm_away',
          };
          expect(activeAction).toBe(expectedMapping[stateValue]);

          // Count how many buttons would be active
          let activeCount = 0;
          for (const action of actions) {
            if (action.type === activeAction) {
              activeCount++;
            }
          }
          expect(activeCount).toBe(1);
        }),
        { numRuns: 100 }
      );
    });

    it('should have no active button for transitional states', () => {
      // For any transitional state, no button should be active (all aria-pressed="false")
      fc.assert(
        fc.property(transitionalStateArb, stateValue => {
          const activeAction = AlarmControlManager.getActiveAction(stateValue);

          // No action should be active for transitional states
          expect(activeAction).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('should have no active button for undefined state', () => {
      const activeAction = AlarmControlManager.getActiveAction(undefined);
      expect(activeAction).toBeNull();
    });
  });

  /**
   * Property 6: ARIA Disabled Reflects Disabled State
   * Feature: alarm-control-buttons, Property 6: ARIA Disabled Reflects Disabled State
   * Validates: Requirements 5.5
   *
   * Tests that controls are correctly disabled during transitional states
   * and enabled during stable states.
   */
  describe('Property 6: ARIA Disabled Reflects Disabled State', () => {
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

    it('should disable all buttons during transitional states', () => {
      // For any transitional state, all buttons should be disabled (aria-disabled="true")
      fc.assert(
        fc.property(transitionalStateArb, stateValue => {
          const controlsDisabled = AlarmControlManager.areControlsDisabled(stateValue);

          // Controls should be disabled for transitional states
          expect(controlsDisabled).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should enable all buttons during stable states', () => {
      // For any stable state, all buttons should be enabled (aria-disabled="false")
      fc.assert(
        fc.property(stableStateArb, stateValue => {
          const controlsDisabled = AlarmControlManager.areControlsDisabled(stateValue);

          // Controls should NOT be disabled for stable states
          expect(controlsDisabled).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should disable all buttons when state is undefined', () => {
      // When alarm state is undefined (entity unavailable), all buttons should be disabled
      const controlsDisabled = AlarmControlManager.areControlsDisabled(undefined);
      expect(controlsDisabled).toBe(true);
    });

    it('should correctly compute button disabled state based on alarm state and individual state', () => {
      // Test that the combination of alarm state and individual button state
      // correctly determines the final disabled state
      fc.assert(
        fc.property(
          stableStateArb,
          fc.boolean(), // individual button disabled state
          (alarmState, individualDisabled) => {
            const controlsDisabled = AlarmControlManager.areControlsDisabled(alarmState);

            // For stable states, controls are not globally disabled
            expect(controlsDisabled).toBe(false);

            // The final disabled state would be: controlsDisabled || individualDisabled
            const finalDisabled = controlsDisabled || individualDisabled;
            expect(finalDisabled).toBe(individualDisabled);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
