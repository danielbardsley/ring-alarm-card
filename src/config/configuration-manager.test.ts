/**
 * Unit tests for ConfigurationManager
 */

import { ConfigurationManager } from './configuration-manager';
import { RingAlarmCardConfig, HomeAssistant, HassEntity } from '../types';

describe('ConfigurationManager', () => {
  describe('validateConfig', () => {
    it('should accept valid configuration', () => {
      const validConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      expect(() =>
        ConfigurationManager.validateConfig(validConfig)
      ).not.toThrow();
    });

    it('should accept valid configuration with optional fields', () => {
      const validConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        title: 'My Alarm',
        show_state_text: false,
        compact_mode: true,
      };

      expect(() =>
        ConfigurationManager.validateConfig(validConfig)
      ).not.toThrow();
    });

    it('should reject null or undefined configuration', () => {
      expect(() => ConfigurationManager.validateConfig(null as any)).toThrow(
        'Ring Alarm Card configuration is required and must be an object'
      );
      expect(() =>
        ConfigurationManager.validateConfig(undefined as any)
      ).toThrow(
        'Ring Alarm Card configuration is required and must be an object'
      );
    });

    it('should reject non-object configuration', () => {
      expect(() =>
        ConfigurationManager.validateConfig('invalid' as any)
      ).toThrow(
        'Ring Alarm Card configuration is required and must be an object'
      );
      expect(() => ConfigurationManager.validateConfig(123 as any)).toThrow(
        'Ring Alarm Card configuration is required and must be an object'
      );
    });

    it('should reject invalid card type', () => {
      const invalidConfig = {
        type: 'wrong-type',
        entity: 'alarm_control_panel.ring_alarm',
      } as RingAlarmCardConfig;

      expect(() => ConfigurationManager.validateConfig(invalidConfig)).toThrow(
        'Ring Alarm Card: Invalid card type'
      );
    });

    it('should reject missing entity field', () => {
      const configWithoutEntity = {
        type: 'custom:ring-alarm-card',
      } as RingAlarmCardConfig;

      expect(() =>
        ConfigurationManager.validateConfig(configWithoutEntity)
      ).toThrow('Entity field is required');
    });

    it('should reject non-string entity field', () => {
      const configWithInvalidEntity = {
        type: 'custom:ring-alarm-card',
        entity: 123,
      } as any;

      expect(() =>
        ConfigurationManager.validateConfig(configWithInvalidEntity)
      ).toThrow('Entity field must be a string');
    });

    it('should reject entity with wrong domain', () => {
      const configWithWrongDomain: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'sensor.temperature',
      };

      expect(() =>
        ConfigurationManager.validateConfig(configWithWrongDomain)
      ).toThrow('Ring Alarm Card: Entity');
    });

    it('should reject invalid show_state_text type', () => {
      const configWithInvalidShowStateText = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        show_state_text: 'invalid',
      } as any;

      expect(() =>
        ConfigurationManager.validateConfig(configWithInvalidShowStateText)
      ).toThrow('Ring Alarm Card: show_state_text must be true or false');
    });

    it('should reject invalid compact_mode type', () => {
      const configWithInvalidCompactMode = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        compact_mode: 'invalid',
      } as any;

      expect(() =>
        ConfigurationManager.validateConfig(configWithInvalidCompactMode)
      ).toThrow('Ring Alarm Card: compact_mode must be true or false');
    });

    it('should accept valid vacation_entity configuration', () => {
      const validConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        vacation_entity: 'input_boolean.vacation_mode',
      };

      expect(() =>
        ConfigurationManager.validateConfig(validConfig)
      ).not.toThrow();
    });

    it('should accept configuration without vacation_entity', () => {
      const validConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      expect(() =>
        ConfigurationManager.validateConfig(validConfig)
      ).not.toThrow();
    });

    it('should reject non-string vacation_entity', () => {
      const configWithInvalidVacationEntity = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        vacation_entity: 123,
      } as any;

      expect(() =>
        ConfigurationManager.validateConfig(configWithInvalidVacationEntity)
      ).toThrow('Ring Alarm Card: vacation_entity must be a string');
    });

    it('should reject vacation_entity with wrong domain', () => {
      const configWithWrongDomain: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        vacation_entity: 'switch.vacation_mode',
      };

      expect(() =>
        ConfigurationManager.validateConfig(configWithWrongDomain)
      ).toThrow('must be an input_boolean entity');
    });

    it('should reject vacation_entity missing entity name', () => {
      const configWithMissingName: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        vacation_entity: 'input_boolean.',
      };

      expect(() =>
        ConfigurationManager.validateConfig(configWithMissingName)
      ).toThrow('is missing the entity name');
    });

    it('should reject vacation_entity with invalid characters', () => {
      const configWithInvalidChars: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        vacation_entity: 'input_boolean.vacation-mode',
      };

      expect(() =>
        ConfigurationManager.validateConfig(configWithInvalidChars)
      ).toThrow('contains invalid characters');
    });

    it('should reject vacation_entity starting with number', () => {
      const configWithNumberStart: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        vacation_entity: 'input_boolean.123vacation',
      };

      expect(() =>
        ConfigurationManager.validateConfig(configWithNumberStart)
      ).toThrow('contains invalid characters');
    });
  });

  describe('validateEntityExists', () => {
    const mockEntity: HassEntity = {
      entity_id: 'alarm_control_panel.ring_alarm',
      state: 'disarmed',
      attributes: {},
      context: { id: 'test' },
      last_changed: '2023-01-01T00:00:00Z',
      last_updated: '2023-01-01T00:00:00Z',
    };

    const mockHass: HomeAssistant = {
      states: {
        'alarm_control_panel.ring_alarm': mockEntity,
        'sensor.temperature': {
          ...mockEntity,
          entity_id: 'sensor.temperature',
        },
      },
      callService: jest.fn(),
      language: 'en',
      themes: {},
      selectedTheme: null,
      panels: {},
      panelUrl: '',
    };

    it('should accept existing alarm_control_panel entity', () => {
      expect(() =>
        ConfigurationManager.validateEntityExists(
          mockHass,
          'alarm_control_panel.ring_alarm'
        )
      ).not.toThrow();
    });

    it('should reject non-existing entity', () => {
      expect(() =>
        ConfigurationManager.validateEntityExists(
          mockHass,
          'alarm_control_panel.nonexistent'
        )
      ).toThrow(
        'Entity "alarm_control_panel.nonexistent" not found in Home Assistant'
      );
    });

    it('should reject entity with wrong domain', () => {
      expect(() =>
        ConfigurationManager.validateEntityExists(
          mockHass,
          'sensor.temperature'
        )
      ).toThrow(
        'Entity "sensor.temperature" has domain "sensor" but must be an "alarm_control_panel" entity'
      );
    });

    it('should reject when hass is not available', () => {
      expect(() =>
        ConfigurationManager.validateEntityExists(
          null as any,
          'alarm_control_panel.ring_alarm'
        )
      ).toThrow('Home Assistant connection is not available');
    });

    it('should reject when hass.states is not available', () => {
      const invalidHass = { ...mockHass, states: undefined } as any;
      expect(() =>
        ConfigurationManager.validateEntityExists(
          invalidHass,
          'alarm_control_panel.ring_alarm'
        )
      ).toThrow('Home Assistant connection is not available');
    });
  });

  describe('getDefaultConfig', () => {
    it('should return default configuration values', () => {
      const defaults = ConfigurationManager.getDefaultConfig();

      expect(defaults.title).toBe('Ring Alarm');
      expect(defaults.show_state_text).toBe(true);
      expect(defaults.compact_mode).toBe(false);
      expect(defaults.entity).toBeUndefined(); // No default for entity
    });
  });

  describe('mergeConfig', () => {
    it('should merge user config with defaults', () => {
      const userConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      const merged = ConfigurationManager.mergeConfig(userConfig);

      expect(merged.type).toBe('custom:ring-alarm-card');
      expect(merged.entity).toBe('alarm_control_panel.ring_alarm');
      expect(merged.title).toBe('Ring Alarm');
      expect(merged.show_state_text).toBe(true);
      expect(merged.compact_mode).toBe(false);
    });

    it('should preserve user-provided values over defaults', () => {
      const userConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        title: 'Custom Title',
        show_state_text: false,
        compact_mode: true,
      };

      const merged = ConfigurationManager.mergeConfig(userConfig);

      expect(merged.title).toBe('Custom Title');
      expect(merged.show_state_text).toBe(false);
      expect(merged.compact_mode).toBe(true);
    });

    it('should handle undefined optional fields', () => {
      const userConfig: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
        title: undefined,
        show_state_text: undefined,
        compact_mode: undefined,
      };

      const merged = ConfigurationManager.mergeConfig(userConfig);

      expect(merged.title).toBe('Ring Alarm');
      expect(merged.show_state_text).toBe(true);
      expect(merged.compact_mode).toBe(false);
    });
  });
});
