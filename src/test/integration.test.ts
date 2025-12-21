/**
 * Integration tests for Ring Alarm Card
 * Tests the complete card functionality in a simulated Home Assistant environment
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { RingAlarmCard } from '../components/ring-alarm-card';
import { RingAlarmCardConfig, HomeAssistant } from '../types';
import { registerCard } from '../registration/card-registration';

// Ensure card is registered for integration tests
registerCard();

describe('Ring Alarm Card Integration Tests', () => {
  let card: RingAlarmCard;
  let mockHass: HomeAssistant;

  beforeEach(() => {
    card = new RingAlarmCard();
    mockHass = {
      states: {
        'sensor.ring_alarm_status': {
          entity_id: 'sensor.ring_alarm_status',
          state: 'disarmed',
          attributes: { friendly_name: 'Ring Alarm Status' },
          context: { id: 'test-context' },
          last_changed: '2023-01-01T00:00:00Z',
          last_updated: '2023-01-01T00:00:00Z',
        },
      },
      language: 'en',
      themes: {
        default: { primary_color: '#03a9f4' },
      },
      selectedTheme: 'default',
      panels: {},
      panelUrl: '',
      callService: jest.fn().mockResolvedValue({}),
    };
  });

  describe('Complete Card Lifecycle', () => {
    it('should handle complete initialization and configuration flow', () => {
      // Step 1: Configure the card
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        title: 'Ring Alarm System',
      };

      expect(() => card.setConfig(config)).not.toThrow();

      // Step 2: Assign HASS object
      expect(() => {
        card.hass = mockHass;
      }).not.toThrow();

      // Step 3: Verify card properties
      expect(card.getCardSize()).toBe(2);
      expect(card.hass).toBe(mockHass);

      // Step 4: Trigger render cycle
      expect(() => card.requestUpdate()).not.toThrow();
    });

    it('should handle configuration updates during runtime', () => {
      // Initial configuration
      const initialConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        title: 'Initial Title',
      };

      card.setConfig(initialConfig);
      card.hass = mockHass;

      // Update configuration
      const updatedConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        title: 'Updated Title',
      };

      expect(() => card.setConfig(updatedConfig)).not.toThrow();

      // Verify configuration was updated
      const storedConfig = (card as any).config;
      expect(storedConfig.title).toBe('Updated Title');
    });

    it('should handle HASS state changes during runtime', async () => {
      // Setup card
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        title: 'Ring Alarm',
      };

      card.setConfig(config);
      card.hass = mockHass;

      // Simulate state change
      const updatedHass: HomeAssistant = {
        ...mockHass,
        states: {
          ...mockHass.states,
          'sensor.ring_alarm_status': {
            ...mockHass.states['sensor.ring_alarm_status'],
            state: 'armed_home',
            last_updated: '2023-01-01T00:01:00Z',
          },
        },
      };

      expect(() => {
        card.hass = updatedHass;
      }).not.toThrow();

      expect(card.hass.states['sensor.ring_alarm_status'].state).toBe(
        'armed_home'
      );
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should recover from invalid configuration attempts', () => {
      // Set valid configuration first
      const validConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        title: 'Valid Config',
      };

      card.setConfig(validConfig);
      card.hass = mockHass;

      // Attempt invalid configuration
      const invalidConfig = {
        type: 'invalid-type',
        title: 'Invalid Config',
      } as RingAlarmCardConfig;

      expect(() => card.setConfig(invalidConfig)).toThrow();

      // Verify card still works with previous valid configuration
      expect(card.getCardSize()).toBe(2);
      expect(() => card.requestUpdate()).not.toThrow();
    });

    it('should handle missing HASS object gracefully', () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        title: 'Test Card',
      };

      card.setConfig(config);

      // Card should work without HASS object
      expect(card.getCardSize()).toBe(2);
      expect(() => card.requestUpdate()).not.toThrow();

      // Should handle HASS assignment later
      expect(() => {
        card.hass = mockHass;
      }).not.toThrow();
    });

    it('should handle theme changes without errors', () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        title: 'Theme Test',
      };

      card.setConfig(config);
      card.hass = mockHass;

      // Change theme
      const updatedHass = {
        ...mockHass,
        selectedTheme: 'dark',
        themes: {
          ...mockHass.themes,
          dark: { primary_color: '#000000' },
        },
      };

      expect(() => {
        card.hass = updatedHass;
      }).not.toThrow();

      expect(card.hass.selectedTheme).toBe('dark');
    });
  });

  describe('Home Assistant Integration Compatibility', () => {
    it('should be compatible with Home Assistant card loading system', () => {
      // Verify card is registered in customCards
      expect(window.customCards).toBeDefined();

      const ringCard = window.customCards?.find(
        card => card.type === 'ring-alarm-card'
      );
      expect(ringCard).toBeDefined();
      expect(ringCard?.name).toBe('Ring Alarm Card');
    });

    it('should support dynamic card creation', () => {
      // Test creating card via customElements
      const dynamicCard = document.createElement(
        'ring-alarm-card'
      ) as RingAlarmCard;
      expect(dynamicCard).toBeInstanceOf(RingAlarmCard);

      // Configure the dynamic card
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        title: 'Dynamic Card',
      };

      expect(() => dynamicCard.setConfig(config)).not.toThrow();
      expect(() => {
        dynamicCard.hass = mockHass;
      }).not.toThrow();
    });

    it('should handle service calls through HASS object', async () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        title: 'Service Test',
      };

      card.setConfig(config);
      card.hass = mockHass;

      // Test service call
      const serviceCall = card.hass.callService(
        'alarm_control_panel',
        'alarm_arm_home',
        {
          entity_id: 'alarm_control_panel.ring_alarm',
        }
      );

      expect(serviceCall).toBeInstanceOf(Promise);
      await expect(serviceCall).resolves.toEqual({});
    });
  });

  describe('Performance and Memory Management', () => {
    it('should handle multiple configuration updates efficiently', () => {
      const baseConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        title: 'Performance Test',
      };

      card.setConfig(baseConfig);
      card.hass = mockHass;

      // Perform multiple configuration updates
      for (let i = 0; i < 10; i++) {
        const config: RingAlarmCardConfig = {
          ...baseConfig,
          title: `Performance Test ${i}`,
        };

        expect(() => card.setConfig(config)).not.toThrow();
      }

      // Verify final state
      const finalConfig = (card as any).config;
      expect(finalConfig.title).toBe('Performance Test 9');
    });

    it('should handle multiple HASS updates efficiently', () => {
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        title: 'HASS Performance Test',
      };

      card.setConfig(config);
      card.hass = mockHass;

      // Perform multiple HASS updates
      for (let i = 0; i < 10; i++) {
        const updatedHass: HomeAssistant = {
          ...mockHass,
          states: {
            ...mockHass.states,
            'sensor.ring_alarm_status': {
              ...mockHass.states['sensor.ring_alarm_status'],
              state: i % 2 === 0 ? 'armed_home' : 'disarmed',
              last_updated: `2023-01-01T00:${i.toString().padStart(2, '0')}:00Z`,
            },
          },
        };

        expect(() => {
          card.hass = updatedHass;
        }).not.toThrow();
      }

      // Verify final state
      expect(card.hass.states['sensor.ring_alarm_status'].state).toBe(
        'disarmed'
      );
    });
  });
});
