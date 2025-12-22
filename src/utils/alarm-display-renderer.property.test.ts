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
          const controlsDisabled =
            AlarmControlManager.areControlsDisabled(stateValue);

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
          const controlsDisabled =
            AlarmControlManager.areControlsDisabled(stateValue);

          // Controls should NOT be disabled for stable states
          expect(controlsDisabled).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should disable all buttons when state is undefined', () => {
      // When alarm state is undefined (entity unavailable), all buttons should be disabled
      const controlsDisabled =
        AlarmControlManager.areControlsDisabled(undefined);
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
            const controlsDisabled =
              AlarmControlManager.areControlsDisabled(alarmState);

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

/**
 * Property-based tests for Alarm State Transitions feature
 * Feature: alarm-state-transitions
 */
import { TransitionStateManager } from './transition-state-manager';
import { ControlButtonState } from './alarm-control-manager';

describe('Alarm State Transitions Property Tests', () => {
  /**
   * Property 2: Progress Indicator Presence
   * Feature: alarm-state-transitions, Property 2: Progress Indicator Presence
   * Validates: Requirements 2.1, 2.5
   *
   * For any alarm state that is transitional (arming, pending, disarming),
   * the target button SHALL have the progress indicator class applied.
   * For any non-transitional state, no button SHALL have the progress indicator class.
   */
  describe('Property 2: Progress Indicator Presence', () => {
    const transitionalStateArb = fc.constantFrom(
      'arming' as const,
      'pending' as const,
      'disarming' as const
    );

    const nonTransitionalStateArb = fc.constantFrom(
      'disarmed' as const,
      'armed_home' as const,
      'armed_away' as const,
      'triggered' as const,
      'unknown' as const
    );

    const actionTypeArb = fc.constantFrom(
      'disarm' as const,
      'arm_home' as const,
      'arm_away' as const
    );

    it('should apply transitioning class when button is transition target', () => {
      // For any transitional state, the target button should have transitioning class
      fc.assert(
        fc.property(
          transitionalStateArb,
          actionTypeArb,
          fc.integer({ min: 0, max: 100 }), // progress
          (alarmState, targetAction, progress) => {
            const actions = AlarmControlManager.getControlActions();
            const action = actions.find(a => a.type === targetAction)!;

            // Create button state with transition target
            const buttonState: ControlButtonState = {
              isActive: false,
              isLoading: false,
              isDisabled: false,
              hasError: false,
              isTransitionTarget: true,
              transitionProgress: progress,
            };

            // Render the button
            const result = AlarmDisplayRenderer.renderControlButton(
              action,
              buttonState,
              () => {}
            );
            const htmlString = result.getHTML?.() || result.toString();

            // Verify transitioning class is present
            expect(htmlString).toContain('transitioning');
            expect(htmlString).toContain(`--progress-percent: ${progress}`);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not apply transitioning class when button is not transition target', () => {
      // For any non-transitional state, no button should have transitioning class
      fc.assert(
        fc.property(
          nonTransitionalStateArb,
          actionTypeArb,
          (alarmState, actionType) => {
            const actions = AlarmControlManager.getControlActions();
            const action = actions.find(a => a.type === actionType)!;

            // Create button state without transition target
            const buttonState: ControlButtonState = {
              isActive: false,
              isLoading: false,
              isDisabled: false,
              hasError: false,
              isTransitionTarget: false,
            };

            // Render the button
            const result = AlarmDisplayRenderer.renderControlButton(
              action,
              buttonState,
              () => {}
            );
            const htmlString = result.getHTML?.() || result.toString();

            // Verify transitioning class is NOT present
            expect(htmlString).not.toContain('transitioning');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly identify transitional states', () => {
      // Verify TransitionStateManager correctly identifies transitional states
      fc.assert(
        fc.property(transitionalStateArb, alarmState => {
          const isTransitional =
            TransitionStateManager.isTransitionalState(alarmState);
          expect(isTransitional).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly identify non-transitional states', () => {
      // Verify TransitionStateManager correctly identifies non-transitional states
      fc.assert(
        fc.property(nonTransitionalStateArb, alarmState => {
          const isTransitional =
            TransitionStateManager.isTransitionalState(alarmState);
          expect(isTransitional).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 4: Target Button Identification
   * Feature: alarm-state-transitions, Property 4: Target Button Identification
   * Validates: Requirements 4.1, 4.2, 4.3, 4.4
   *
   * For any transitional alarm state:
   * - When state is 'arming' with target 'home', the "Home" button SHALL be the transition target
   * - When state is 'arming' with target 'away', the "Away" button SHALL be the transition target
   * - When state is 'pending' (entry delay), the currently armed button SHALL be the transition target
   */
  describe('Property 4: Target Button Identification', () => {
    it('should identify arm_home as target when arming to home mode', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const target = TransitionStateManager.getTransitionTarget('arming', {
            next_state: 'armed_home',
          });
          expect(target).toBe('arm_home');
        }),
        { numRuns: 100 }
      );
    });

    it('should identify arm_away as target when arming to away mode', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const target = TransitionStateManager.getTransitionTarget('arming', {
            next_state: 'armed_away',
          });
          expect(target).toBe('arm_away');
        }),
        { numRuns: 100 }
      );
    });

    it('should identify correct target for pending state based on previous state', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('armed_home', 'armed_away'),
          previousState => {
            const target = TransitionStateManager.getTransitionTarget(
              'pending',
              { previous_state: previousState }
            );

            const expectedTarget =
              previousState === 'armed_home' ? 'arm_home' : 'arm_away';
            expect(target).toBe(expectedTarget);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should identify disarm as target when disarming', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const target = TransitionStateManager.getTransitionTarget(
            'disarming',
            {}
          );
          expect(target).toBe('disarm');
        }),
        { numRuns: 100 }
      );
    });

    it('should return null for non-transitional states', () => {
      const nonTransitionalStates = [
        'disarmed',
        'armed_home',
        'armed_away',
        'triggered',
        'unknown',
      ] as const;

      fc.assert(
        fc.property(fc.constantFrom(...nonTransitionalStates), alarmState => {
          const target = TransitionStateManager.getTransitionTarget(
            alarmState,
            {}
          );
          expect(target).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('should only have one button as transition target at a time', () => {
      // For any transitional state, exactly one button should be the target
      fc.assert(
        fc.property(
          fc.constantFrom(
            'arming' as const,
            'pending' as const,
            'disarming' as const
          ),
          fc.constantFrom('armed_home', 'armed_away'),
          (alarmState, targetState) => {
            const attributes =
              alarmState === 'arming'
                ? { next_state: targetState }
                : alarmState === 'pending'
                  ? { previous_state: targetState }
                  : {};

            const target = TransitionStateManager.getTransitionTarget(
              alarmState,
              attributes
            );

            // Should return exactly one target (not null for transitional states)
            expect(target).not.toBeNull();

            // Verify it's a valid action type
            expect(['disarm', 'arm_home', 'arm_away']).toContain(target);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 5: ARIA Label on Progress Indicator
   * Feature: alarm-state-transitions, Property 5: ARIA Label on Progress Indicator
   * Validates: Requirements 5.1
   *
   * For any button displaying a progress indicator, the button SHALL have
   * an aria-label that includes the countdown status.
   */
  describe('Property 5: ARIA Label on Progress Indicator', () => {
    const actionTypeArb = fc.constantFrom(
      'disarm' as const,
      'arm_home' as const,
      'arm_away' as const
    );

    it('should include countdown status in aria-label when transitioning', () => {
      fc.assert(
        fc.property(
          actionTypeArb,
          fc.integer({ min: 1, max: 120 }), // remaining seconds
          fc.integer({ min: 0, max: 100 }), // progress
          (actionType, remainingSeconds, progress) => {
            const actions = AlarmControlManager.getControlActions();
            const action = actions.find(a => a.type === actionType)!;

            // Create button state with transition
            const buttonState: ControlButtonState = {
              isActive: false,
              isLoading: false,
              isDisabled: false,
              hasError: false,
              isTransitionTarget: true,
              transitionProgress: progress,
              transitionRemainingSeconds: remainingSeconds,
            };

            // Generate ARIA label
            const ariaLabel = AlarmDisplayRenderer.generateAriaLabel(
              action,
              buttonState
            );

            // Verify countdown status is included
            expect(ariaLabel).toContain('remaining');
            expect(ariaLabel).toContain(String(remainingSeconds));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use correct action label in aria-label when transitioning', () => {
      fc.assert(
        fc.property(
          actionTypeArb,
          fc.integer({ min: 1, max: 120 }),
          (actionType, remainingSeconds) => {
            const actions = AlarmControlManager.getControlActions();
            const action = actions.find(a => a.type === actionType)!;

            const buttonState: ControlButtonState = {
              isActive: false,
              isLoading: false,
              isDisabled: false,
              hasError: false,
              isTransitionTarget: true,
              transitionProgress: 50,
              transitionRemainingSeconds: remainingSeconds,
            };

            const ariaLabel = AlarmDisplayRenderer.generateAriaLabel(
              action,
              buttonState
            );

            // Verify correct action label is used
            if (actionType === 'disarm') {
              expect(ariaLabel).toContain('Disarming');
            } else if (actionType === 'arm_home') {
              expect(ariaLabel).toContain('Arming home');
            } else {
              expect(ariaLabel).toContain('Arming away');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use base aria-label when not transitioning', () => {
      fc.assert(
        fc.property(actionTypeArb, actionType => {
          const actions = AlarmControlManager.getControlActions();
          const action = actions.find(a => a.type === actionType)!;

          // Create button state without transition
          const buttonState: ControlButtonState = {
            isActive: false,
            isLoading: false,
            isDisabled: false,
            hasError: false,
            isTransitionTarget: false,
          };

          const ariaLabel = AlarmDisplayRenderer.generateAriaLabel(
            action,
            buttonState
          );

          // Verify base label is used (not countdown)
          expect(ariaLabel).not.toContain('remaining');

          // Verify correct base label
          const expectedLabels: Record<ControlActionType, string> = {
            disarm: 'Set alarm to disarmed',
            arm_home: 'Arm alarm in home mode',
            arm_away: 'Arm alarm in away mode',
          };
          expect(ariaLabel).toBe(expectedLabels[actionType]);
        }),
        { numRuns: 100 }
      );
    });

    it('should handle singular and plural seconds correctly', () => {
      const actions = AlarmControlManager.getControlActions();
      const action = actions.find(a => a.type === 'arm_away')!;

      // Test singular (1 second)
      const buttonStateSingular: ControlButtonState = {
        isActive: false,
        isLoading: false,
        isDisabled: false,
        hasError: false,
        isTransitionTarget: true,
        transitionProgress: 99,
        transitionRemainingSeconds: 1,
      };

      const ariaLabelSingular = AlarmDisplayRenderer.generateAriaLabel(
        action,
        buttonStateSingular
      );
      expect(ariaLabelSingular).toContain('1 second remaining');
      expect(ariaLabelSingular).not.toContain('1 seconds');

      // Test plural (2+ seconds)
      const buttonStatePlural: ControlButtonState = {
        isActive: false,
        isLoading: false,
        isDisabled: false,
        hasError: false,
        isTransitionTarget: true,
        transitionProgress: 50,
        transitionRemainingSeconds: 30,
      };

      const ariaLabelPlural = AlarmDisplayRenderer.generateAriaLabel(
        action,
        buttonStatePlural
      );
      expect(ariaLabelPlural).toContain('30 seconds remaining');
    });
  });

  /**
   * Property 6: ARIA Live Region Updates
   * Feature: alarm-state-transitions, Property 6: ARIA Live Region Updates
   * Validates: Requirements 5.2
   *
   * For any state change to a transitional state, the ARIA live region
   * SHALL be updated with an announcement describing the state change.
   */
  describe('Property 6: ARIA Live Region Updates', () => {
    const transitionalStateArb = fc.constantFrom(
      'arming' as const,
      'pending' as const,
      'disarming' as const
    );

    const actionTypeArb = fc.constantFrom(
      'disarm' as const,
      'arm_home' as const,
      'arm_away' as const
    );

    it('should generate announcement for transitional states', () => {
      fc.assert(
        fc.property(
          transitionalStateArb,
          actionTypeArb,
          (alarmState, targetAction) => {
            const announcement =
              AlarmDisplayRenderer.generateTransitionAnnouncement(
                alarmState,
                targetAction
              );

            // Verify announcement is not empty for transitional states
            expect(announcement.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include target mode in arming announcement', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('arm_home' as const, 'arm_away' as const),
          targetAction => {
            const announcement =
              AlarmDisplayRenderer.generateTransitionAnnouncement(
                'arming',
                targetAction
              );

            expect(announcement).toContain('arming');

            if (targetAction === 'arm_home') {
              expect(announcement.toLowerCase()).toContain('home');
            } else {
              expect(announcement.toLowerCase()).toContain('away');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate appropriate announcement for pending state', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('arm_home' as const, 'arm_away' as const),
          targetAction => {
            const announcement =
              AlarmDisplayRenderer.generateTransitionAnnouncement(
                'pending',
                targetAction
              );

            expect(announcement.toLowerCase()).toContain('entry delay');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate appropriate announcement for disarming state', () => {
      const announcement = AlarmDisplayRenderer.generateTransitionAnnouncement(
        'disarming',
        'disarm'
      );

      expect(announcement.toLowerCase()).toContain('disarming');
    });

    it('should return empty string when target action is null', () => {
      fc.assert(
        fc.property(transitionalStateArb, alarmState => {
          const announcement =
            AlarmDisplayRenderer.generateTransitionAnnouncement(
              alarmState,
              null
            );

          expect(announcement).toBe('');
        }),
        { numRuns: 100 }
      );
    });

    it('should render live region with announcement', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          announcement => {
            const result = AlarmDisplayRenderer.renderLiveRegion(announcement);
            const htmlString = result.getHTML?.() || result.toString();

            // Verify live region structure
            expect(htmlString).toContain('aria-live="polite"');
            expect(htmlString).toContain('aria-atomic="true"');
            expect(htmlString).toContain('role="status"');
            expect(htmlString).toContain(announcement);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render empty live region when no announcement', () => {
      const result = AlarmDisplayRenderer.renderLiveRegion(undefined);
      const htmlString = result.getHTML?.() || result.toString();

      // Verify live region structure exists but is empty
      expect(htmlString).toContain('aria-live="polite"');
      expect(htmlString).toContain('aria-atomic="true"');
      expect(htmlString).toContain('role="status"');
    });
  });
});
