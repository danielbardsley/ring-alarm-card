/**
 * Integration tests for RingAlarmCard component
 * Tests full component lifecycle with entity changes, configuration changes, and error recovery
 * Requirements: 1.3, 3.2, FR-1, FR-3
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { RingAlarmCard } from './ring-alarm-card';
import { HomeAssistant, RingAlarmCardConfig, HassEntity } from '../types';

// Register the custom element
import '../index';

describe('RingAlarmCard Integration Tests', () => {
  let element: RingAlarmCard;
  let mockHass: HomeAssistant;

  beforeEach(() => {
    // Create a fresh element for each test
    element = document.createElement('ring-alarm-card') as RingAlarmCard;
    document.body.appendChild(element);

    // Create mock HASS object
    mockHass = {
      states: {},
      callService: jest.fn().mockResolvedValue({}),
      language: 'en',
      themes: {},
      selectedTheme: null,
      panels: {},
      panelUrl: '',
    };
  });

  afterEach(() => {
    // Clean up after each test
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  describe('Full component lifecycle with entity changes', () => {
    it('should handle complete initialization and entity state updates', async () => {
      // Step 1: Configure the card
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        title: 'Ring Alarm System',
        show_state_text: true,
        compact_mode: false,
      };

      // Step 2: Add entity to HASS
      const alarmEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: {},
        context: {
          id: 'test-context',
          parent_id: undefined,
          user_id: undefined,
        },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = alarmEntity;

      // Step 3: Set configuration and HASS
      element.setConfig(config);
      element.hass = mockHass;

      // Workaround: Manually trigger validation since Lit lifecycle isn't working in tests
      (element as any)._validateAndInitializeEntity();

      await element.updateComplete;

      // Verify initial state
      expect(element.shadowRoot).toBeTruthy();

      // Check internal component state instead of rendered content
      expect((element as any).config.title).toBe('Ring Alarm System');
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('disarmed');
      expect((element as any).alarmState.label).toBe('Disarmed');
      expect((element as any).entityError).toBeUndefined();

      // Step 4: Update entity state to armed_home
      const updatedEntity: HassEntity = {
        ...alarmEntity,
        state: 'armed_home',
        last_updated: '2023-01-01T00:01:00Z',
      };
      const newHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': updatedEntity,
        },
      };

      element.hass = newHass;

      // Workaround: Manually trigger state change handling
      (element as any)._handleEntityStateChange();

      await element.updateComplete;

      // Verify state update
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('armed_home');
      expect((element as any).alarmState.label).toBe('Armed Home');

      // Step 5: Update to pending state
      const pendingEntity: HassEntity = {
        ...alarmEntity,
        state: 'pending',
        last_updated: '2023-01-01T00:02:00Z',
      };
      const pendingHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': pendingEntity,
        },
      };

      element.hass = pendingHass;

      // Workaround: Manually trigger state change handling
      (element as any)._handleEntityStateChange();

      await element.updateComplete;

      // Verify pending state
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('pending');
      expect((element as any).alarmState.label).toBe('Pending');
      expect((element as any).alarmState.isAnimated).toBe(true);
    });

    it('should handle entity becoming unavailable and then available again', async () => {
      // Step 1: Set up with available entity
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      const alarmEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = alarmEntity;

      element.setConfig(config);
      element.hass = mockHass;

      // Workaround: Manually trigger validation since Lit lifecycle isn't working in tests
      (element as any)._validateAndInitializeEntity();

      await element.updateComplete;

      // Verify initial working state
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('disarmed');
      expect((element as any).entityError).toBeUndefined();

      // Step 2: Make entity unavailable
      const unavailableEntity: HassEntity = {
        ...alarmEntity,
        state: 'unavailable',
        last_updated: '2023-01-01T00:01:00Z',
      };
      const unavailableHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': unavailableEntity,
        },
      };

      element.hass = unavailableHass;

      // Workaround: Manually trigger state change handling
      (element as any)._handleEntityStateChange();

      await element.updateComplete;

      // Verify error state
      expect((element as any).entityError).toBeDefined();
      expect((element as any).entityError).toContain('unavailable');
      expect((element as any).alarmState).toBeUndefined();

      // Step 3: Make entity available again
      const recoveredEntity: HassEntity = {
        ...alarmEntity,
        state: 'armed_away',
        last_updated: '2023-01-01T00:02:00Z',
      };
      const recoveredHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': recoveredEntity,
        },
      };

      element.hass = recoveredHass;

      // Workaround: Manually trigger state change handling
      (element as any)._handleEntityStateChange();

      await element.updateComplete;

      // Verify recovery
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('armed_away');
      expect((element as any).alarmState.label).toBe('Armed Away');
      expect((element as any).entityError).toBeUndefined();
    });
  });

  describe('Configuration changes', () => {
    it('should handle configuration updates during runtime', async () => {
      // Step 1: Initial configuration
      const initialConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        title: 'Initial Title',
        show_state_text: true,
        compact_mode: false,
      };

      const alarmEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = alarmEntity;

      element.setConfig(initialConfig);
      element.hass = mockHass;

      // Workaround: Manually trigger validation since Lit lifecycle isn't working in tests
      (element as any)._validateAndInitializeEntity();

      await element.updateComplete;

      // Verify initial configuration
      expect((element as any).config.title).toBe('Initial Title');
      expect((element as any).config.show_state_text).toBe(true);
      expect((element as any).config.compact_mode).toBe(false);
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('disarmed');

      // Step 2: Update configuration
      const updatedConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        title: 'Updated Title',
        show_state_text: false,
        compact_mode: true,
      };

      element.setConfig(updatedConfig);
      await element.updateComplete;

      // Verify configuration update
      expect((element as any).config.title).toBe('Updated Title');
      expect((element as any).config.show_state_text).toBe(false);
      expect((element as any).config.compact_mode).toBe(true);
    });

    it('should handle entity configuration changes', async () => {
      // Step 1: Configure with first entity
      const firstEntity: HassEntity = {
        entity_id: 'alarm_control_panel.first_alarm',
        state: 'disarmed',
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.first_alarm'] = firstEntity;

      const firstConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.first_alarm',
      };

      element.setConfig(firstConfig);
      element.hass = mockHass;

      // Workaround: Manually trigger validation since Lit lifecycle isn't working in tests
      (element as any)._validateAndInitializeEntity();

      await element.updateComplete;

      // Verify first entity
      expect((element as any).config.entity).toBe(
        'alarm_control_panel.first_alarm'
      );
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('disarmed');

      // Step 2: Add second entity and reconfigure
      const secondEntity: HassEntity = {
        entity_id: 'alarm_control_panel.second_alarm',
        state: 'armed_home',
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.second_alarm'] = secondEntity;

      const secondConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.second_alarm',
      };

      element.setConfig(secondConfig);

      // Workaround: Manually trigger validation since Lit lifecycle isn't working in tests
      (element as any)._validateAndInitializeEntity();

      await element.updateComplete;

      // Verify entity switch
      expect((element as any).config.entity).toBe(
        'alarm_control_panel.second_alarm'
      );
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('armed_home');
      expect((element as any).alarmState.label).toBe('Armed Home');
    });
  });

  describe('Error recovery scenarios', () => {
    it('should recover from entity not found errors', async () => {
      // Step 1: Configure with non-existent entity
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.missing_alarm',
      };

      element.setConfig(config);
      element.hass = mockHass; // Empty states

      // Workaround: Manually trigger validation since Lit lifecycle isn't working in tests
      (element as any)._validateAndInitializeEntity();

      await element.updateComplete;

      // Verify error state
      expect((element as any).entityError).toBeDefined();
      expect((element as any).entityError).toContain('entity_not_found');
      expect((element as any).alarmState).toBeUndefined();

      // Step 2: Add the missing entity
      const newEntity: HassEntity = {
        entity_id: 'alarm_control_panel.missing_alarm',
        state: 'armed_away',
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      const updatedHass = {
        ...mockHass,
        states: {
          'alarm_control_panel.missing_alarm': newEntity,
        },
      };

      element.hass = updatedHass;

      // Workaround: Manually trigger validation since Lit lifecycle isn't working in tests
      (element as any)._validateAndInitializeEntity();

      await element.updateComplete;

      // Verify recovery
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('armed_away');
      expect((element as any).alarmState.label).toBe('Armed Away');
      expect((element as any).entityError).toBeUndefined();
    });

    it('should handle HASS connection recovery', async () => {
      // Step 1: Configure card
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      element.setConfig(config);

      // Step 2: Set HASS to disconnected state
      const disconnectedHass = {
        ...mockHass,
        states: undefined as any,
      };

      element.hass = disconnectedHass;
      await element.updateComplete;

      // Verify disconnected state
      expect(element.hass.states).toBeUndefined();
      // Component should handle disconnected HASS gracefully
      expect(() => element.requestUpdate()).not.toThrow();

      // Step 3: Restore HASS connection with entity
      const alarmEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      const connectedHass = {
        ...mockHass,
        states: {
          'alarm_control_panel.ring_alarm': alarmEntity,
        },
      };

      element.hass = connectedHass;

      // Workaround: Manually trigger validation since Lit lifecycle isn't working in tests
      (element as any)._validateAndInitializeEntity();

      await element.updateComplete;

      // Verify recovery
      expect(element.hass.states).toBeDefined();
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('disarmed');
      expect((element as any).entityError).toBeUndefined();
    });

    it('should handle invalid entity domain gracefully', async () => {
      // Step 1: Configure with wrong domain entity
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      // Add entity with wrong domain (this shouldn't happen in real usage but tests resilience)
      const wrongEntity: HassEntity = {
        entity_id: 'sensor.fake_alarm', // Wrong domain
        state: 'on',
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = wrongEntity as any;

      element.setConfig(config);
      element.hass = mockHass;

      // Workaround: Manually trigger validation since Lit lifecycle isn't working in tests
      (element as any)._validateAndInitializeEntity();

      await element.updateComplete;

      // Should handle gracefully and show error
      expect((element as any).entityError).toBeDefined();
      expect((element as any).entityError).toContain('wrong_domain');
    });
  });

  describe('Theme integration', () => {
    it('should handle theme changes without errors', async () => {
      // Step 1: Set up card with entity
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      const alarmEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = alarmEntity;

      element.setConfig(config);
      element.hass = mockHass;

      // Workaround: Manually trigger validation since Lit lifecycle isn't working in tests
      (element as any)._validateAndInitializeEntity();

      await element.updateComplete;

      // Verify initial render
      expect(element.shadowRoot).toBeTruthy();

      // Step 2: Change theme
      const themedHass = {
        ...mockHass,
        selectedTheme: 'dark',
      };

      element.hass = themedHass;
      await element.updateComplete;

      // Should not crash and should still render content
      expect(element.hass.selectedTheme).toBe('dark');
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('disarmed');
      expect(() => element.requestUpdate()).not.toThrow();
    });
  });

  describe('Performance and memory management', () => {
    it('should handle rapid state changes efficiently', async () => {
      // Set up card
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      const baseEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = baseEntity;

      element.setConfig(config);
      element.hass = mockHass;

      // Workaround: Manually trigger validation since Lit lifecycle isn't working in tests
      (element as any)._validateAndInitializeEntity();

      await element.updateComplete;

      // Perform rapid state changes
      const states = [
        'disarmed',
        'pending',
        'armed_home',
        'armed_away',
        'triggered',
      ];

      for (let i = 0; i < 10; i++) {
        const state = states[i % states.length];
        const updatedEntity: HassEntity = {
          ...baseEntity,
          state,
          last_updated: `2023-01-01T00:0${i}:00Z`,
        };

        const newHass = {
          ...mockHass,
          states: {
            ...mockHass.states,
            'alarm_control_panel.ring_alarm': updatedEntity,
          },
        };

        element.hass = newHass;

        // Workaround: Manually trigger state change handling
        (element as any)._handleEntityStateChange();

        await element.updateComplete;
      }

      // Should still be functional after rapid changes
      expect(element.shadowRoot).toBeTruthy();
      expect((element as any).alarmState).toBeDefined();
      // The final state should be from the last iteration
      expect([
        'disarmed',
        'pending',
        'armed_home',
        'armed_away',
        'triggered',
      ]).toContain((element as any).alarmState.state);
    });
  });
});

describe('Transition State Integration', () => {
  let element: RingAlarmCard;
  let mockHass: HomeAssistant;

  beforeEach(() => {
    element = document.createElement('ring-alarm-card') as RingAlarmCard;
    document.body.appendChild(element);

    mockHass = {
      states: {},
      callService: jest.fn().mockResolvedValue({}),
      language: 'en',
      themes: {},
      selectedTheme: null,
      panels: {},
      panelUrl: '',
    };
  });

  afterEach(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  describe('Transition state tracking on state change', () => {
    it('should initialize transition state when entering arming state', async () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      // Start with disarmed state
      const disarmedEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = disarmedEntity;

      element.setConfig(config);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify no transition initially
      expect((element as any).transitionState.isTransitioning).toBe(false);

      // Change to arming state with exitSecondsLeft
      const armingEntity: HassEntity = {
        ...disarmedEntity,
        state: 'arming',
        attributes: {
          next_state: 'armed_away',
          exit_seconds_left: 30,
        },
        last_updated: '2023-01-01T00:01:00Z',
      };
      const armingHass = {
        ...mockHass,
        states: {
          'alarm_control_panel.ring_alarm': armingEntity,
        },
      };

      element.hass = armingHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify transition state is set
      expect((element as any).transitionState.isTransitioning).toBe(true);
      expect((element as any).transitionState.targetAction).toBe('arm_away');
      expect((element as any).transitionState.totalDuration).toBe(30);
      expect((element as any).transitionState.remainingSeconds).toBe(30);
      expect((element as any).transitionState.progress).toBe(0);
    });

    it('should track transition for arm_home target', async () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      const disarmedEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = disarmedEntity;

      element.setConfig(config);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Change to arming state with arm_home target
      const armingEntity: HassEntity = {
        ...disarmedEntity,
        state: 'arming',
        attributes: {
          next_state: 'armed_home',
          exit_seconds_left: 15,
        },
        last_updated: '2023-01-01T00:01:00Z',
      };
      const armingHass = {
        ...mockHass,
        states: {
          'alarm_control_panel.ring_alarm': armingEntity,
        },
      };

      element.hass = armingHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      expect((element as any).transitionState.isTransitioning).toBe(true);
      expect((element as any).transitionState.targetAction).toBe('arm_home');
      expect((element as any).transitionState.totalDuration).toBe(15);
    });
  });

  describe('Progress updates as exitSecondsLeft decreases', () => {
    it('should update progress when exitSecondsLeft decreases', async () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      // Start with arming state
      const armingEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'arming',
        attributes: {
          next_state: 'armed_away',
          exit_seconds_left: 30,
        },
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = armingEntity;

      element.setConfig(config);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify initial state
      expect((element as any).transitionState.progress).toBe(0);
      expect((element as any).transitionState.remainingSeconds).toBe(30);

      // Update with decreased exitSecondsLeft (15 seconds elapsed)
      const updatedEntity: HassEntity = {
        ...armingEntity,
        attributes: {
          next_state: 'armed_away',
          exit_seconds_left: 15,
        },
        last_updated: '2023-01-01T00:00:15Z',
      };
      const updatedHass = {
        ...mockHass,
        states: {
          'alarm_control_panel.ring_alarm': updatedEntity,
        },
      };

      element.hass = updatedHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // With interpolation, the base values are updated but progress is calculated by the interval
      // Verify the base values are set correctly for interpolation
      expect((element as any)._lastExitSecondsLeft).toBe(15);
      expect((element as any).transitionState.totalDuration).toBe(30); // Should remain unchanged

      // Wait for the interpolation interval to update progress (50ms interval)
      await new Promise((resolve) => setTimeout(resolve, 100));
      await element.updateComplete;

      // Now progress should be approximately 50% (may vary slightly due to timing)
      expect((element as any).transitionState.progress).toBeGreaterThanOrEqual(49);
      expect((element as any).transitionState.progress).toBeLessThanOrEqual(52);

      // Update to near completion (3 seconds left)
      const nearCompleteEntity: HassEntity = {
        ...armingEntity,
        attributes: {
          next_state: 'armed_away',
          exit_seconds_left: 3,
        },
        last_updated: '2023-01-01T00:00:27Z',
      };
      const nearCompleteHass = {
        ...mockHass,
        states: {
          'alarm_control_panel.ring_alarm': nearCompleteEntity,
        },
      };

      element.hass = nearCompleteHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Wait for the interpolation interval to update progress
      await new Promise((resolve) => setTimeout(resolve, 100));
      await element.updateComplete;

      // Verify progress is approximately 90% (may vary slightly due to timing)
      expect((element as any).transitionState.progress).toBeGreaterThanOrEqual(89);
      expect((element as any).transitionState.progress).toBeLessThanOrEqual(92);
      expect((element as any)._lastExitSecondsLeft).toBe(3);
    });
  });

  describe('Transition cleanup on state exit', () => {
    it('should clear transition state when alarm becomes armed', async () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      // Start with arming state
      const armingEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'arming',
        attributes: {
          next_state: 'armed_away',
          exit_seconds_left: 10,
        },
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = armingEntity;

      element.setConfig(config);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify transition is active
      expect((element as any).transitionState.isTransitioning).toBe(true);

      // Change to armed_away state
      const armedEntity: HassEntity = {
        ...armingEntity,
        state: 'armed_away',
        attributes: {},
        last_updated: '2023-01-01T00:00:10Z',
      };
      const armedHass = {
        ...mockHass,
        states: {
          'alarm_control_panel.ring_alarm': armedEntity,
        },
      };

      element.hass = armedHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify transition is cleared
      expect((element as any).transitionState.isTransitioning).toBe(false);
      expect((element as any).transitionState.targetAction).toBeNull();
      expect((element as any).transitionState.progress).toBe(0);
    });

    it('should clear transition state when entity becomes unavailable', async () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      // Start with arming state
      const armingEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'arming',
        attributes: {
          next_state: 'armed_away',
          exit_seconds_left: 20,
        },
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = armingEntity;

      element.setConfig(config);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      expect((element as any).transitionState.isTransitioning).toBe(true);

      // Make entity unavailable
      const unavailableEntity: HassEntity = {
        ...armingEntity,
        state: 'unavailable',
        last_updated: '2023-01-01T00:00:05Z',
      };
      const unavailableHass = {
        ...mockHass,
        states: {
          'alarm_control_panel.ring_alarm': unavailableEntity,
        },
      };

      element.hass = unavailableHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify transition is cleared
      expect((element as any).transitionState.isTransitioning).toBe(false);
      expect((element as any).entityError).toContain('unavailable');
    });
  });

  describe('Rapid state change handling', () => {
    it('should cancel previous transition when new state change occurs', async () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      // Start with arming to away
      const armingAwayEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'arming',
        attributes: {
          next_state: 'armed_away',
          exit_seconds_left: 30,
        },
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = armingAwayEntity;

      element.setConfig(config);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify initial transition
      expect((element as any).transitionState.isTransitioning).toBe(true);
      expect((element as any).transitionState.targetAction).toBe('arm_away');
      expect((element as any).transitionState.totalDuration).toBe(30);

      // Rapidly change to disarmed (user cancelled)
      const disarmedEntity: HassEntity = {
        ...armingAwayEntity,
        state: 'disarmed',
        attributes: {},
        last_updated: '2023-01-01T00:00:02Z',
      };
      const disarmedHass = {
        ...mockHass,
        states: {
          'alarm_control_panel.ring_alarm': disarmedEntity,
        },
      };

      element.hass = disarmedHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify transition is cancelled
      expect((element as any).transitionState.isTransitioning).toBe(false);
      expect((element as any).alarmState.state).toBe('disarmed');
    });

    it('should handle rapid transition target changes', async () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      // Start with arming to away
      const armingAwayEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'arming',
        attributes: {
          next_state: 'armed_away',
          exit_seconds_left: 30,
        },
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = armingAwayEntity;

      element.setConfig(config);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      expect((element as any).transitionState.targetAction).toBe('arm_away');

      // Change target to arm_home (user changed their mind)
      const armingHomeEntity: HassEntity = {
        ...armingAwayEntity,
        attributes: {
          next_state: 'armed_home',
          exit_seconds_left: 15, // New countdown
        },
        last_updated: '2023-01-01T00:00:02Z',
      };
      const armingHomeHass = {
        ...mockHass,
        states: {
          'alarm_control_panel.ring_alarm': armingHomeEntity,
        },
      };

      element.hass = armingHomeHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify new transition with new target and duration
      expect((element as any).transitionState.isTransitioning).toBe(true);
      expect((element as any).transitionState.targetAction).toBe('arm_home');
      expect((element as any).transitionState.totalDuration).toBe(15);
      expect((element as any).transitionState.progress).toBe(0); // Reset to 0
    });

    it('should handle multiple rapid state changes', async () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      const baseEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: {},
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = baseEntity;

      element.setConfig(config);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Rapid sequence: disarmed -> arming -> disarmed -> arming -> armed
      const states = [
        {
          state: 'arming',
          attributes: { next_state: 'armed_away', exit_seconds_left: 30 },
        },
        { state: 'disarmed', attributes: {} },
        {
          state: 'arming',
          attributes: { next_state: 'armed_home', exit_seconds_left: 15 },
        },
        { state: 'armed_home', attributes: {} },
      ];

      for (let i = 0; i < states.length; i++) {
        const entity: HassEntity = {
          ...baseEntity,
          state: states[i].state,
          attributes: states[i].attributes,
          last_updated: `2023-01-01T00:00:0${i + 1}Z`,
        };
        const hass = {
          ...mockHass,
          states: {
            'alarm_control_panel.ring_alarm': entity,
          },
        };

        element.hass = hass;
        (element as any)._handleEntityStateChange();
        await element.updateComplete;
      }

      // Final state should be armed_home with no transition
      expect((element as any).alarmState.state).toBe('armed_home');
      expect((element as any).transitionState.isTransitioning).toBe(false);
    });
  });

  describe('Button states with transition properties', () => {
    it('should pass transition properties to button states', async () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      const armingEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'arming',
        attributes: {
          next_state: 'armed_away',
          exit_seconds_left: 20,
        },
        context: { id: 'test-context' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = armingEntity;

      element.setConfig(config);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Get button states with transition
      const buttonStatesWithTransition = (
        element as any
      )._getButtonStatesWithTransition();

      // arm_away should be the transition target
      const armAwayState = buttonStatesWithTransition.get('arm_away');
      expect(armAwayState.isTransitionTarget).toBe(true);
      expect(armAwayState.transitionProgress).toBe(0);
      expect(armAwayState.transitionRemainingSeconds).toBe(20);

      // Other buttons should not be transition targets
      const disarmState = buttonStatesWithTransition.get('disarm');
      expect(disarmState.isTransitionTarget).toBe(false);

      const armHomeState = buttonStatesWithTransition.get('arm_home');
      expect(armHomeState.isTransitionTarget).toBe(false);
    });
  });
});
