/**
 * Unit tests for AlarmStateManager
 * Tests specific examples and edge cases for state helper functions
 */

import { describe, it, expect } from '@jest/globals';
import { AlarmStateManager } from './alarm-state-manager';
import { HassEntity } from '@/types';

describe('AlarmStateManager Unit Tests', () => {
  describe('mapEntityState', () => {
    it('should map disarmed state correctly', () => {
      const entity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: {},
        context: { id: 'test' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };

      const result = AlarmStateManager.mapEntityState(entity);

      expect(result).toEqual({
        state: 'disarmed',
        icon: 'mdi:shield-off',
        color: '--success-color',
        label: 'Disarmed',
        isAnimated: false,
      });
    });

    it('should map armed_home state correctly', () => {
      const entity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'armed_home',
        attributes: {},
        context: { id: 'test' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };

      const result = AlarmStateManager.mapEntityState(entity);

      expect(result).toEqual({
        state: 'armed_home',
        icon: 'mdi:home-lock',
        color: '--warning-color',
        label: 'Armed Home',
        isAnimated: false,
      });
    });

    it('should map armed_away state correctly', () => {
      const entity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'armed_away',
        attributes: {},
        context: { id: 'test' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };

      const result = AlarmStateManager.mapEntityState(entity);

      expect(result).toEqual({
        state: 'armed_away',
        icon: 'mdi:shield-lock',
        color: '--error-color',
        label: 'Armed Away',
        isAnimated: false,
      });
    });

    it('should map pending state correctly with animation', () => {
      const entity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'pending',
        attributes: {},
        context: { id: 'test' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };

      const result = AlarmStateManager.mapEntityState(entity);

      expect(result).toEqual({
        state: 'pending',
        icon: 'mdi:clock-outline',
        color: '--warning-color',
        label: 'Pending',
        isAnimated: true,
      });
    });

    it('should map triggered state correctly with animation', () => {
      const entity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'triggered',
        attributes: {},
        context: { id: 'test' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };

      const result = AlarmStateManager.mapEntityState(entity);

      expect(result).toEqual({
        state: 'triggered',
        icon: 'mdi:shield-alert',
        color: '--error-color',
        label: 'Triggered',
        isAnimated: true,
      });
    });

    it('should handle unknown states', () => {
      const entity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'invalid_state',
        attributes: {},
        context: { id: 'test' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };

      const result = AlarmStateManager.mapEntityState(entity);

      expect(result).toEqual({
        state: 'unknown',
        icon: 'mdi:help-circle',
        color: '--disabled-text-color',
        label: 'Unknown',
        isAnimated: false,
      });
    });

    it('should handle case-insensitive state matching', () => {
      const entity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'DISARMED',
        attributes: {},
        context: { id: 'test' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };

      const result = AlarmStateManager.mapEntityState(entity);

      expect(result.state).toBe('disarmed');
      expect(result.icon).toBe('mdi:shield-off');
    });
  });

  describe('getStateIcon', () => {
    it('should return correct icons for all states', () => {
      expect(AlarmStateManager.getStateIcon('disarmed')).toBe('mdi:shield-off');
      expect(AlarmStateManager.getStateIcon('armed_home')).toBe(
        'mdi:home-lock'
      );
      expect(AlarmStateManager.getStateIcon('armed_away')).toBe(
        'mdi:shield-lock'
      );
      expect(AlarmStateManager.getStateIcon('pending')).toBe(
        'mdi:clock-outline'
      );
      expect(AlarmStateManager.getStateIcon('triggered')).toBe(
        'mdi:shield-alert'
      );
      expect(AlarmStateManager.getStateIcon('unknown')).toBe('mdi:help-circle');
    });
  });

  describe('getStateColor', () => {
    it('should return correct colors for all states', () => {
      expect(AlarmStateManager.getStateColor('disarmed')).toBe(
        '--success-color'
      );
      expect(AlarmStateManager.getStateColor('armed_home')).toBe(
        '--warning-color'
      );
      expect(AlarmStateManager.getStateColor('armed_away')).toBe(
        '--error-color'
      );
      expect(AlarmStateManager.getStateColor('pending')).toBe(
        '--warning-color'
      );
      expect(AlarmStateManager.getStateColor('triggered')).toBe(
        '--error-color'
      );
      expect(AlarmStateManager.getStateColor('unknown')).toBe(
        '--disabled-text-color'
      );
    });
  });

  describe('getStateLabel', () => {
    it('should return correct labels for all states', () => {
      expect(AlarmStateManager.getStateLabel('disarmed')).toBe('Disarmed');
      expect(AlarmStateManager.getStateLabel('armed_home')).toBe('Armed Home');
      expect(AlarmStateManager.getStateLabel('armed_away')).toBe('Armed Away');
      expect(AlarmStateManager.getStateLabel('pending')).toBe('Pending');
      expect(AlarmStateManager.getStateLabel('triggered')).toBe('Triggered');
      expect(AlarmStateManager.getStateLabel('unknown')).toBe('Unknown');
    });
  });

  describe('isValidAlarmEntity', () => {
    it('should validate alarm_control_panel entities', () => {
      const validEntity: HassEntity = {
        entity_id: 'alarm_control_panel.ring_alarm',
        state: 'disarmed',
        attributes: {},
        context: { id: 'test' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };

      expect(AlarmStateManager.isValidAlarmEntity(validEntity)).toBe(true);
    });

    it('should reject non-alarm entities', () => {
      const invalidEntity: HassEntity = {
        entity_id: 'sensor.temperature',
        state: '20',
        attributes: {},
        context: { id: 'test' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };

      expect(AlarmStateManager.isValidAlarmEntity(invalidEntity)).toBe(false);
    });

    it('should handle null/undefined entities', () => {
      expect(AlarmStateManager.isValidAlarmEntity(null as any)).toBe(false);
      expect(AlarmStateManager.isValidAlarmEntity(undefined as any)).toBe(
        false
      );
    });

    it('should handle entities without entity_id', () => {
      const entityWithoutId = {
        state: 'disarmed',
        attributes: {},
        context: { id: 'test' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      } as any;

      expect(AlarmStateManager.isValidAlarmEntity(entityWithoutId)).toBe(false);
    });

    it('should handle malformed entity IDs', () => {
      const malformedEntity: HassEntity = {
        entity_id: 'invalid_format',
        state: 'disarmed',
        attributes: {},
        context: { id: 'test' },
        last_changed: '2023-01-01T00:00:00Z',
        last_updated: '2023-01-01T00:00:00Z',
      };

      expect(AlarmStateManager.isValidAlarmEntity(malformedEntity)).toBe(false);
    });

    it('should validate different alarm entity names', () => {
      const entities = [
        'alarm_control_panel.ring_alarm',
        'alarm_control_panel.my_alarm',
        'alarm_control_panel.test123',
        'alarm_control_panel.home_security',
      ];

      entities.forEach(entityId => {
        const entity: HassEntity = {
          entity_id: entityId,
          state: 'disarmed',
          attributes: {},
          context: { id: 'test' },
          last_changed: '2023-01-01T00:00:00Z',
          last_updated: '2023-01-01T00:00:00Z',
        };

        expect(AlarmStateManager.isValidAlarmEntity(entity)).toBe(true);
      });
    });
  });
});
