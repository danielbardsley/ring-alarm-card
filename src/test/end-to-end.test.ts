/**
 * End-to-End Integration Tests for Ring Alarm Card
 * Tests complete user workflows from configuration to display to state changes
 * Requirements: All
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { RingAlarmCard } from '../components/ring-alarm-card';
import { HomeAssistant, RingAlarmCardConfig, HassEntity } from '../types';

// Register the custom element
import '../index';

describe('Ring Alarm Card End-to-End Integration Tests', () => {
  let element: RingAlarmCard;
  let mockHass: HomeAssistant;

  beforeEach(() => {
    // Create a fresh element for each test
    element = document.createElement('ring-alarm-card') as RingAlarmCard;
    document.body.appendChild(element);

    // Create comprehensive mock HASS object
    mockHass = {
      states: {},
      callService: jest.fn().mockResolvedValue({}),
      language: 'en',
      themes: {
        default_theme: 'default',
        themes: {
          default: {
            'primary-color': '#03a9f4',
            'accent-color': '#ff9800',
            'success-color': '#4caf50',
            'warning-color': '#ff9800',
            'error-color': '#f44336',
            'info-color': '#2196f3',
            'disabled-text-color': '#9e9e9e',
          },
        },
      },
      selectedTheme: 'default',
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

  describe('Complete User Workflows', () => {
    it('should handle complete configuration → display → state change workflow', async () => {
      // === PHASE 1: User Configuration ===

      // User creates card configuration in Lovelace
      const userConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        title: 'Home Security System',
        show_state_text: true,
        compact_mode: false,
      };

      // User's Ring alarm entity exists in Home Assistant
      const ringAlarmEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: {
          friendly_name: 'Ring Alarm',
          device_class: 'security',
          supported_features: 15,
        },
        context: {
          id: 'ring-context',
          parent_id: undefined,
          user_id: 'user-123',
        },
        last_changed: '2023-01-01T08:00:00Z',
        last_updated: '2023-01-01T08:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = ringAlarmEntity;

      // === PHASE 2: Card Initialization ===

      // Home Assistant loads the card configuration
      element.setConfig(userConfig);

      // Home Assistant provides the HASS object
      element.hass = mockHass;

      // Trigger initialization (simulating Lit lifecycle)
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify successful initialization
      expect((element as any).config).toBeDefined();
      expect((element as any).config.entity).toBe(
        'alarm_control_panel.ring_alarm'
      );
      expect((element as any).config.title).toBe('Home Security System');
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('disarmed');
      expect((element as any).alarmState.label).toBe('Disarmed');
      expect((element as any).alarmState.color).toBe('--success-color');
      expect((element as any).alarmState.icon).toBe('mdi:shield-off');
      expect((element as any).entityError).toBeUndefined();

      // === PHASE 3: User Arms System (Away Mode) ===

      // User arms the system through Ring app or Home Assistant
      // This triggers a state change in Home Assistant
      const armedAwayEntity: HassEntity = {
        ...ringAlarmEntity,
        state: 'armed_away',
        last_changed: '2023-01-01T08:30:00Z',
        last_updated: '2023-01-01T08:30:00Z',
      };

      const updatedHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': armedAwayEntity,
        },
      };

      // Home Assistant notifies the card of the state change
      element.hass = updatedHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify card reflects the armed away state
      expect((element as any).alarmState.state).toBe('armed_away');
      expect((element as any).alarmState.label).toBe('Armed Away');
      expect((element as any).alarmState.color).toBe('--error-color');
      expect((element as any).alarmState.icon).toBe('mdi:shield-lock');
      expect((element as any).alarmState.isAnimated).toBe(false);

      // === PHASE 4: System Goes to Pending State ===

      // User returns home and disarms, system goes to pending
      const pendingEntity: HassEntity = {
        ...ringAlarmEntity,
        state: 'pending',
        last_changed: '2023-01-01T18:00:00Z',
        last_updated: '2023-01-01T18:00:00Z',
      };

      const pendingHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': pendingEntity,
        },
      };

      element.hass = pendingHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify pending state with animation
      expect((element as any).alarmState.state).toBe('pending');
      expect((element as any).alarmState.label).toBe('Pending');
      expect((element as any).alarmState.color).toBe('--info-color');
      expect((element as any).alarmState.icon).toBe('mdi:clock-outline');
      expect((element as any).alarmState.isAnimated).toBe(true);

      // === PHASE 5: System Disarmed Successfully ===

      const disarmedEntity: HassEntity = {
        ...ringAlarmEntity,
        state: 'disarmed',
        last_changed: '2023-01-01T18:00:30Z',
        last_updated: '2023-01-01T18:00:30Z',
      };

      const disarmedHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': disarmedEntity,
        },
      };

      element.hass = disarmedHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify final disarmed state
      expect((element as any).alarmState.state).toBe('disarmed');
      expect((element as any).alarmState.label).toBe('Disarmed');
      expect((element as any).alarmState.color).toBe('--success-color');
      expect((element as any).alarmState.icon).toBe('mdi:shield-off');
      expect((element as any).alarmState.isAnimated).toBe(false);
      expect((element as any).entityError).toBeUndefined();
    });

    it('should handle alarm triggered workflow', async () => {
      // === SETUP: System is armed away ===

      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        title: 'Security System',
      };

      const armedEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'armed_away',
        attributes: { friendly_name: 'Ring Alarm' },
        context: { id: 'test-context' },
        last_changed: '2023-01-01T10:00:00Z',
        last_updated: '2023-01-01T10:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = armedEntity;

      element.setConfig(config);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify armed state
      expect((element as any).alarmState.state).toBe('armed_away');

      // === PHASE 1: Alarm Triggered ===

      // Motion detected, alarm triggers
      const triggeredEntity: HassEntity = {
        ...armedEntity,
        state: 'triggered',
        attributes: {
          ...armedEntity.attributes,
          changed_by: 'motion_sensor.front_door',
        },
        last_changed: '2023-01-01T10:30:00Z',
        last_updated: '2023-01-01T10:30:00Z',
      };

      const triggeredHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': triggeredEntity,
        },
      };

      element.hass = triggeredHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify triggered state with animation
      expect((element as any).alarmState.state).toBe('triggered');
      expect((element as any).alarmState.label).toBe('Triggered');
      expect((element as any).alarmState.color).toBe('--error-color');
      expect((element as any).alarmState.icon).toBe('mdi:shield-alert');
      expect((element as any).alarmState.isAnimated).toBe(true);

      // === PHASE 2: User Disarms During Alarm ===

      // User quickly disarms the system
      const disarmingEntity: HassEntity = {
        ...armedEntity,
        state: 'pending',
        last_changed: '2023-01-01T10:31:00Z',
        last_updated: '2023-01-01T10:31:00Z',
      };

      const disarmingHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': disarmingEntity,
        },
      };

      element.hass = disarmingHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify pending state
      expect((element as any).alarmState.state).toBe('pending');
      expect((element as any).alarmState.isAnimated).toBe(true);

      // === PHASE 3: System Disarmed ===

      const finalDisarmedEntity: HassEntity = {
        ...armedEntity,
        state: 'disarmed',
        last_changed: '2023-01-01T10:31:30Z',
        last_updated: '2023-01-01T10:31:30Z',
      };

      const finalDisarmedHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': finalDisarmedEntity,
        },
      };

      element.hass = finalDisarmedHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify final disarmed state
      expect((element as any).alarmState.state).toBe('disarmed');
      expect((element as any).alarmState.label).toBe('Disarmed');
      expect((element as any).alarmState.isAnimated).toBe(false);
      expect((element as any).entityError).toBeUndefined();
    });

    it('should handle complete compact mode workflow', async () => {
      // === User configures compact mode ===

      const compactConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        title: 'Alarm',
        show_state_text: false,
        compact_mode: true,
      };

      const alarmEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: { friendly_name: 'Ring Alarm' },
        context: { id: 'test-context' },
        last_changed: '2023-01-01T12:00:00Z',
        last_updated: '2023-01-01T12:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = alarmEntity;

      element.setConfig(compactConfig);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify compact configuration
      expect((element as any).config.compact_mode).toBe(true);
      expect((element as any).config.show_state_text).toBe(false);
      expect((element as any).alarmState.state).toBe('disarmed');

      // === Test state changes in compact mode ===

      const states = [
        'armed_home',
        'armed_away',
        'pending',
        'triggered',
        'disarmed',
      ];

      for (const state of states) {
        const stateEntity: HassEntity = {
          ...alarmEntity,
          state,
          last_updated: `2023-01-01T12:0${states.indexOf(state)}:00Z`,
        };

        const stateHass = {
          ...mockHass,
          states: {
            ...mockHass.states,
            'alarm_control_panel.ring_alarm': stateEntity,
          },
        };

        element.hass = stateHass;
        (element as any)._handleEntityStateChange();
        await element.updateComplete;

        // Verify state is correctly mapped in compact mode
        expect((element as any).alarmState.state).toBe(state);
        expect((element as any).config.compact_mode).toBe(true);
        expect((element as any).config.show_state_text).toBe(false);
      }
    });
  });

  describe('Error → Recovery Workflows', () => {
    it('should handle complete error → recovery flow', async () => {
      // === PHASE 1: User Configuration Error ===

      // User initially configures with non-existent entity
      const wrongConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.nonexistent', // Valid format but doesn't exist
        title: 'My Alarm',
      };

      element.setConfig(wrongConfig);
      element.hass = mockHass; // No entities yet
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify configuration error is handled gracefully
      expect((element as any).entityError).toBeDefined();
      expect((element as any).entityError).toContain('entity_not_found');
      expect((element as any).alarmState).toBeUndefined();

      // === PHASE 2: User Fixes Configuration ===

      // User corrects the configuration
      const correctConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        title: 'My Alarm',
      };

      element.setConfig(correctConfig);
      await element.updateComplete;

      // Configuration is now valid, but entity doesn't exist yet
      expect((element as any).config.entity).toBe(
        'alarm_control_panel.ring_alarm'
      );
      expect((element as any).entityError).toBeDefined();
      expect((element as any).entityError).toContain('entity_not_found');

      // === PHASE 3: Ring Integration Comes Online ===

      // User sets up Ring integration, entity becomes available
      const ringEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: { friendly_name: 'Ring Alarm' },
        context: { id: 'test-context' },
        last_changed: '2023-01-01T14:00:00Z',
        last_updated: '2023-01-01T14:00:00Z',
      };

      const recoveredHass = {
        ...mockHass,
        states: {
          'alarm_control_panel.ring_alarm': ringEntity,
        },
      };

      element.hass = recoveredHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify complete recovery
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('disarmed');
      expect((element as any).alarmState.label).toBe('Disarmed');
      expect((element as any).entityError).toBeUndefined();

      // === PHASE 4: Temporary Network Issue ===

      // Ring device goes offline temporarily
      const unavailableEntity: HassEntity = {
        ...ringEntity,
        state: 'unavailable',
        last_updated: '2023-01-01T14:30:00Z',
      };

      const unavailableHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': unavailableEntity,
        },
      };

      element.hass = unavailableHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify graceful handling of unavailable state
      expect((element as any).entityError).toBeDefined();
      expect((element as any).entityError).toContain('entity_unavailable');
      expect((element as any).alarmState).toBeUndefined();

      // === PHASE 5: Network Recovery ===

      // Ring device comes back online
      const recoveredEntity: HassEntity = {
        ...ringEntity,
        state: 'armed_home',
        last_changed: '2023-01-01T14:35:00Z',
        last_updated: '2023-01-01T14:35:00Z',
      };

      const finalRecoveredHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': recoveredEntity,
        },
      };

      element.hass = finalRecoveredHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify final recovery with current state
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('armed_home');
      expect((element as any).alarmState.label).toBe('Armed Home');
      expect((element as any).entityError).toBeUndefined();
    });

    it('should handle Home Assistant restart workflow', async () => {
      // === PHASE 1: Normal Operation ===

      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      const normalEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'armed_away',
        attributes: { friendly_name: 'Ring Alarm' },
        context: { id: 'test-context' },
        last_changed: '2023-01-01T16:00:00Z',
        last_updated: '2023-01-01T16:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = normalEntity;

      element.setConfig(config);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify normal operation
      expect((element as any).alarmState.state).toBe('armed_away');
      expect((element as any).entityError).toBeUndefined();

      // === PHASE 2: Home Assistant Restart (HASS becomes unavailable) ===

      // Simulate Home Assistant restart - HASS object becomes null/undefined
      element.hass = null as any;
      await element.updateComplete;

      // Card should handle missing HASS gracefully
      expect(element.hass).toBeNull();
      expect(() => element.requestUpdate()).not.toThrow();

      // === PHASE 3: Home Assistant Comes Back Online ===

      // Home Assistant restarts with fresh state
      const restartedEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed', // State may have changed during restart
        attributes: { friendly_name: 'Ring Alarm' },
        context: { id: 'new-context' },
        last_changed: '2023-01-01T16:05:00Z',
        last_updated: '2023-01-01T16:05:00Z',
      };

      const restartedHass = {
        ...mockHass,
        states: {
          'alarm_control_panel.ring_alarm': restartedEntity,
        },
      };

      element.hass = restartedHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify recovery with potentially new state
      expect((element as any).alarmState).toBeDefined();
      expect((element as any).alarmState.state).toBe('disarmed');
      expect((element as any).alarmState.label).toBe('Disarmed');
      expect((element as any).entityError).toBeUndefined();
    });
  });

  describe('Theme Integration Workflows', () => {
    it('should handle complete theme switching workflow', async () => {
      // === SETUP: Card with alarm entity ===

      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      const alarmEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: { friendly_name: 'Ring Alarm' },
        context: { id: 'test-context' },
        last_changed: '2023-01-01T20:00:00Z',
        last_updated: '2023-01-01T20:00:00Z',
      };
      mockHass.states['alarm_control_panel.ring_alarm'] = alarmEntity;

      element.setConfig(config);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify initial state with default theme
      expect((element as any).alarmState.state).toBe('disarmed');
      expect(element.hass.selectedTheme).toBe('default');

      // === PHASE 1: User Switches to Dark Theme ===

      const darkThemeHass = {
        ...mockHass,
        selectedTheme: 'dark',
        themes: {
          ...mockHass.themes,
          themes: {
            ...mockHass.themes.themes,
            dark: {
              'primary-color': '#bb86fc',
              'accent-color': '#03dac6',
              'success-color': '#4caf50',
              'warning-color': '#ff9800',
              'error-color': '#cf6679',
              'info-color': '#2196f3',
              'disabled-text-color': '#666666',
            },
          },
        },
      };

      element.hass = darkThemeHass;
      await element.updateComplete;

      // Verify theme change is handled
      expect(element.hass.selectedTheme).toBe('dark');
      expect((element as any).alarmState.state).toBe('disarmed');
      expect((element as any).alarmState.color).toBe('--success-color'); // Color property name stays the same

      // === PHASE 2: State Changes with Dark Theme ===

      // Test all states with dark theme
      const states = ['armed_home', 'armed_away', 'pending', 'triggered'];

      for (const state of states) {
        const stateEntity: HassEntity = {
          ...alarmEntity,
          state,
          last_updated: `2023-01-01T20:0${states.indexOf(state) + 1}:00Z`,
        };

        const stateHass = {
          ...darkThemeHass,
          states: {
            ...darkThemeHass.states,
            'alarm_control_panel.ring_alarm': stateEntity,
          },
        };

        element.hass = stateHass;
        (element as any)._handleEntityStateChange();
        await element.updateComplete;

        // Verify state changes work correctly with dark theme
        expect((element as any).alarmState.state).toBe(state);
        expect(element.hass.selectedTheme).toBe('dark');
      }

      // === PHASE 3: User Switches to Custom Theme ===

      const customThemeHass = {
        ...mockHass,
        selectedTheme: 'custom',
        themes: {
          ...mockHass.themes,
          themes: {
            ...mockHass.themes.themes,
            custom: {
              'primary-color': '#9c27b0',
              'accent-color': '#e91e63',
              'success-color': '#8bc34a',
              'warning-color': '#ffc107',
              'error-color': '#e53935',
              'info-color': '#00bcd4',
              'disabled-text-color': '#757575',
            },
          },
        },
        states: {
          ...mockHass.states,
          'alarm_control_panel.ring_alarm': {
            ...alarmEntity,
            state: 'disarmed',
          },
        },
      };

      element.hass = customThemeHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Verify custom theme is handled
      expect(element.hass.selectedTheme).toBe('custom');
      expect((element as any).alarmState.state).toBe('disarmed');
      expect((element as any).alarmState.color).toBe('--success-color');
    });
  });

  describe('Multi-Entity Scenarios', () => {
    it('should handle switching between multiple Ring alarm entities', async () => {
      // === SETUP: Multiple Ring alarm entities ===

      const homeAlarmEntity: HassEntity = {
        entity_id: 'alarm_control_panel.home_alarm',
        state: 'disarmed',
        attributes: { friendly_name: 'Home Ring Alarm' },
        context: { id: 'home-context' },
        last_changed: '2023-01-01T22:00:00Z',
        last_updated: '2023-01-01T22:00:00Z',
      };

      const officeAlarmEntity: HassEntity = {
        entity_id: 'alarm_control_panel.office_alarm',
        state: 'armed_away',
        attributes: { friendly_name: 'Office Ring Alarm' },
        context: { id: 'office-context' },
        last_changed: '2023-01-01T22:00:00Z',
        last_updated: '2023-01-01T22:00:00Z',
      };

      mockHass.states['alarm_control_panel.home_alarm'] = homeAlarmEntity;
      mockHass.states['alarm_control_panel.office_alarm'] = officeAlarmEntity;

      // === PHASE 1: Configure for Home Alarm ===

      const homeConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.home_alarm',
        title: 'Home Security',
      };

      element.setConfig(homeConfig);
      element.hass = mockHass;
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify home alarm configuration
      expect((element as any).config.entity).toBe(
        'alarm_control_panel.home_alarm'
      );
      expect((element as any).config.title).toBe('Home Security');
      expect((element as any).alarmState.state).toBe('disarmed');
      expect((element as any).alarmState.label).toBe('Disarmed');

      // === PHASE 2: Switch to Office Alarm ===

      const officeConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.office_alarm',
        title: 'Office Security',
      };

      element.setConfig(officeConfig);
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Verify office alarm configuration
      expect((element as any).config.entity).toBe(
        'alarm_control_panel.office_alarm'
      );
      expect((element as any).config.title).toBe('Office Security');
      expect((element as any).alarmState.state).toBe('armed_away');
      expect((element as any).alarmState.label).toBe('Armed Away');

      // === PHASE 3: Both Alarms Change State Simultaneously ===

      // Update both entities
      const updatedHomeEntity: HassEntity = {
        ...homeAlarmEntity,
        state: 'armed_home',
        last_updated: '2023-01-01T22:30:00Z',
      };

      const updatedOfficeEntity: HassEntity = {
        ...officeAlarmEntity,
        state: 'triggered',
        last_updated: '2023-01-01T22:30:00Z',
      };

      const updatedHass = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'alarm_control_panel.home_alarm': updatedHomeEntity,
          'alarm_control_panel.office_alarm': updatedOfficeEntity,
        },
      };

      element.hass = updatedHass;
      (element as any)._handleEntityStateChange();
      await element.updateComplete;

      // Card should only reflect the office alarm (currently configured entity)
      expect((element as any).alarmState.state).toBe('triggered');
      expect((element as any).alarmState.label).toBe('Triggered');
      expect((element as any).alarmState.isAnimated).toBe(true);

      // === PHASE 4: Switch Back to Home Alarm ===

      element.setConfig(homeConfig);
      (element as any)._validateAndInitializeEntity();
      await element.updateComplete;

      // Should now reflect the home alarm's current state
      expect((element as any).config.entity).toBe(
        'alarm_control_panel.home_alarm'
      );
      expect((element as any).alarmState.state).toBe('armed_home');
      expect((element as any).alarmState.label).toBe('Armed Home');
    });
  });
});
