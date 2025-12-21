/**
 * Unit tests for Home Assistant utility functions
 * Tests specific scenarios for entity monitoring and validation
 */

import { describe, it, expect } from '@jest/globals';
import { HomeAssistant, HassEntity } from '../types';
import {
  hasRelevantStateChanges,
  getEntityState,
  hasEntityStateChanged,
  isEntityAvailable,
  getEntityDomain,
  validateAlarmEntity,
  getHassStatus,
} from './hass-utils';

// Test data helpers
const createHassEntity = (
  entityId: string,
  state: string = 'disarmed',
  lastUpdated?: string
): HassEntity => ({
  entity_id: entityId,
  state,
  attributes: {},
  context: { id: 'test-context' },
  last_changed: '2023-01-01T00:00:00Z',
  last_updated: lastUpdated || '2023-01-01T00:00:00Z',
});

const createHomeAssistant = (
  entities: Record<string, HassEntity> = {}
): HomeAssistant => ({
  states: entities,
  callService: async () => ({}),
  language: 'en',
  themes: {},
  selectedTheme: null,
  panels: {},
  panelUrl: '',
});

describe('HASS Utils Unit Tests', () => {
  describe('getEntityState', () => {
    it('should return entity when it exists', () => {
      const entityId = 'alarm_control_panel.ring_alarm';
      const entity = createHassEntity(entityId, 'disarmed');
      const hass = createHomeAssistant({ [entityId]: entity });

      const result = getEntityState(hass, entityId);

      expect(result).toBe(entity);
      expect(result?.entity_id).toBe(entityId);
      expect(result?.state).toBe('disarmed');
    });

    it('should return undefined when entity does not exist', () => {
      const hass = createHomeAssistant({});

      const result = getEntityState(hass, 'alarm_control_panel.nonexistent');

      expect(result).toBeUndefined();
    });

    it('should return undefined when hass is null', () => {
      const result = getEntityState(null as any, 'alarm_control_panel.test');

      expect(result).toBeUndefined();
    });

    it('should return undefined when hass.states is null', () => {
      const hass = { ...createHomeAssistant(), states: null as any };

      const result = getEntityState(hass, 'alarm_control_panel.test');

      expect(result).toBeUndefined();
    });
  });

  describe('hasEntityStateChanged', () => {
    it('should detect state value changes', () => {
      const entityId = 'alarm_control_panel.ring_alarm';
      const oldEntity = createHassEntity(entityId, 'disarmed');
      const newEntity = createHassEntity(entityId, 'armed_home');

      const oldHass = createHomeAssistant({ [entityId]: oldEntity });
      const newHass = createHomeAssistant({ [entityId]: newEntity });

      const result = hasEntityStateChanged(oldHass, newHass, entityId);

      expect(result).toBe(true);
    });

    it('should detect last_updated changes', () => {
      const entityId = 'alarm_control_panel.ring_alarm';
      const oldEntity = createHassEntity(
        entityId,
        'disarmed',
        '2023-01-01T00:00:00Z'
      );
      const newEntity = createHassEntity(
        entityId,
        'disarmed',
        '2023-01-01T00:01:00Z'
      );

      const oldHass = createHomeAssistant({ [entityId]: oldEntity });
      const newHass = createHomeAssistant({ [entityId]: newEntity });

      const result = hasEntityStateChanged(oldHass, newHass, entityId);

      expect(result).toBe(true);
    });

    it('should not detect changes when nothing changed', () => {
      const entityId = 'alarm_control_panel.ring_alarm';
      const entity = createHassEntity(
        entityId,
        'disarmed',
        '2023-01-01T00:00:00Z'
      );

      const oldHass = createHomeAssistant({ [entityId]: entity });
      const newHass = createHomeAssistant({ [entityId]: { ...entity } });

      const result = hasEntityStateChanged(oldHass, newHass, entityId);

      expect(result).toBe(false);
    });

    it('should detect entity appearing', () => {
      const entityId = 'alarm_control_panel.ring_alarm';
      const entity = createHassEntity(entityId, 'disarmed');

      const oldHass = createHomeAssistant({});
      const newHass = createHomeAssistant({ [entityId]: entity });

      const result = hasEntityStateChanged(oldHass, newHass, entityId);

      expect(result).toBe(true);
    });

    it('should detect entity disappearing', () => {
      const entityId = 'alarm_control_panel.ring_alarm';
      const entity = createHassEntity(entityId, 'disarmed');

      const oldHass = createHomeAssistant({ [entityId]: entity });
      const newHass = createHomeAssistant({});

      const result = hasEntityStateChanged(oldHass, newHass, entityId);

      expect(result).toBe(true);
    });

    it('should not detect changes when entity does not exist in either', () => {
      const oldHass = createHomeAssistant({});
      const newHass = createHomeAssistant({});

      const result = hasEntityStateChanged(
        oldHass,
        newHass,
        'alarm_control_panel.nonexistent'
      );

      expect(result).toBe(false);
    });
  });

  describe('hasRelevantStateChanges', () => {
    it('should detect changes for monitored entities', () => {
      const entityId = 'alarm_control_panel.ring_alarm';
      const oldEntity = createHassEntity(entityId, 'disarmed');
      const newEntity = createHassEntity(entityId, 'armed_home');

      const oldHass = createHomeAssistant({ [entityId]: oldEntity });
      const newHass = createHomeAssistant({ [entityId]: newEntity });

      const result = hasRelevantStateChanges(oldHass, newHass, [entityId]);

      expect(result).toBe(true);
    });

    it('should not detect changes for non-monitored entities', () => {
      const monitoredId = 'alarm_control_panel.ring_alarm';
      const otherEntityId = 'sensor.temperature';

      const oldEntity = createHassEntity(otherEntityId, '20');
      const newEntity = createHassEntity(otherEntityId, '21');

      const oldHass = createHomeAssistant({ [otherEntityId]: oldEntity });
      const newHass = createHomeAssistant({ [otherEntityId]: newEntity });

      const result = hasRelevantStateChanges(oldHass, newHass, [monitoredId]);

      expect(result).toBe(false);
    });

    it('should fall back to state count check when no entities specified', () => {
      const entity1 = createHassEntity('sensor.temp1', '20');
      const entity2 = createHassEntity('sensor.temp2', '21');

      const oldHass = createHomeAssistant({ 'sensor.temp1': entity1 });
      const newHass = createHomeAssistant({
        'sensor.temp1': entity1,
        'sensor.temp2': entity2,
      });

      const result = hasRelevantStateChanges(oldHass, newHass);

      expect(result).toBe(true);
    });

    it('should handle empty entity list', () => {
      const oldHass = createHomeAssistant({});
      const newHass = createHomeAssistant({});

      const result = hasRelevantStateChanges(oldHass, newHass, []);

      expect(result).toBe(false);
    });
  });

  describe('isEntityAvailable', () => {
    it('should return true for available entities', () => {
      const entityId = 'alarm_control_panel.ring_alarm';
      const entity = createHassEntity(entityId, 'disarmed');
      const hass = createHomeAssistant({ [entityId]: entity });

      const result = isEntityAvailable(hass, entityId);

      expect(result).toBe(true);
    });

    it('should return false for unavailable entities', () => {
      const entityId = 'alarm_control_panel.ring_alarm';
      const entity = createHassEntity(entityId, 'unavailable');
      const hass = createHomeAssistant({ [entityId]: entity });

      const result = isEntityAvailable(hass, entityId);

      expect(result).toBe(false);
    });

    it('should return false for non-existent entities', () => {
      const hass = createHomeAssistant({});

      const result = isEntityAvailable(hass, 'alarm_control_panel.nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('getEntityDomain', () => {
    it('should extract domain from valid entity ID', () => {
      const result = getEntityDomain('alarm_control_panel.ring_alarm');

      expect(result).toBe('alarm_control_panel');
    });

    it('should extract domain from sensor entity', () => {
      const result = getEntityDomain('sensor.temperature');

      expect(result).toBe('sensor');
    });

    it('should handle entity ID without dot', () => {
      const result = getEntityDomain('invalid_entity_id');

      expect(result).toBe('invalid_entity_id');
    });

    it('should handle empty string', () => {
      const result = getEntityDomain('');

      expect(result).toBe('');
    });

    it('should handle entity ID with multiple dots', () => {
      const result = getEntityDomain('alarm_control_panel.ring.alarm.system');

      expect(result).toBe('alarm_control_panel');
    });
  });

  describe('validateAlarmEntity', () => {
    it('should validate correct alarm entity', () => {
      const entityId = 'alarm_control_panel.ring_alarm';
      const entity = createHassEntity(entityId, 'disarmed');
      const hass = createHomeAssistant({ [entityId]: entity });

      const result = validateAlarmEntity(hass, entityId);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject non-string entity ID', () => {
      const hass = createHomeAssistant({});

      const result = validateAlarmEntity(hass, null as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Entity ID must be a non-empty string');
    });

    it('should reject empty entity ID', () => {
      const hass = createHomeAssistant({});

      const result = validateAlarmEntity(hass, '');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Entity ID must be a non-empty string');
    });

    it('should reject entity ID without dot', () => {
      const hass = createHomeAssistant({});

      const result = validateAlarmEntity(hass, 'invalid_entity');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Entity ID must be in format "domain.entity_name"'
      );
    });

    it('should reject wrong domain', () => {
      const entityId = 'sensor.temperature';
      const entity = createHassEntity(entityId, '20');
      const hass = createHomeAssistant({ [entityId]: entity });

      const result = validateAlarmEntity(hass, entityId);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Entity must be an alarm_control_panel, got "sensor"'
      );
    });

    it('should reject non-existent entity', () => {
      const hass = createHomeAssistant({});

      const result = validateAlarmEntity(
        hass,
        'alarm_control_panel.nonexistent'
      );

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Entity "alarm_control_panel.nonexistent" not found in Home Assistant'
      );
    });

    it('should reject unavailable entity', () => {
      const entityId = 'alarm_control_panel.ring_alarm';
      const entity = createHassEntity(entityId, 'unavailable');
      const hass = createHomeAssistant({ [entityId]: entity });

      const result = validateAlarmEntity(hass, entityId);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Entity "alarm_control_panel.ring_alarm" is currently unavailable'
      );
    });
  });

  describe('getHassStatus', () => {
    it('should return "not connected" when hass is undefined', () => {
      const result = getHassStatus();

      expect(result).toBe('not connected');
    });

    it('should return "not connected" when hass is null', () => {
      const result = getHassStatus(null as any);

      expect(result).toBe('not connected');
    });

    it('should return "connecting" when hass.states is null', () => {
      const hass = { ...createHomeAssistant(), states: null as any };

      const result = getHassStatus(hass);

      expect(result).toBe('connecting');
    });

    it('should return "connecting" when hass.states is undefined', () => {
      const hass = { ...createHomeAssistant(), states: undefined as any };

      const result = getHassStatus(hass);

      expect(result).toBe('connecting');
    });

    it('should return "connected" when hass is properly initialized', () => {
      const hass = createHomeAssistant({});

      const result = getHassStatus(hass);

      expect(result).toBe('connected');
    });

    it('should return "connected" when hass has entities', () => {
      const entity = createHassEntity(
        'alarm_control_panel.ring_alarm',
        'disarmed'
      );
      const hass = createHomeAssistant({
        'alarm_control_panel.ring_alarm': entity,
      });

      const result = getHassStatus(hass);

      expect(result).toBe('connected');
    });
  });
});
