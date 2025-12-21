/**
 * Property-based tests for Home Assistant utility functions
 * Tests entity integration and state change detection
 */

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { HomeAssistant, HassEntity } from '../types';
import {
  hasRelevantStateChanges,
  hasEntityStateChanged,
  isEntityAvailable,
  getEntityDomain,
  validateAlarmEntity,
} from './hass-utils';

// Test data generators
const generateHassEntity = (
  entityId: string,
  state: string = 'disarmed'
): HassEntity => ({
  entity_id: entityId,
  state,
  attributes: {},
  context: { id: 'test-context' },
  last_changed: new Date().toISOString(),
  last_updated: new Date().toISOString(),
});

const generateHomeAssistant = (
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

describe('Property-Based Tests for HASS Utils Entity Integration', () => {
  describe('Property 1: Entity Integration and State Updates', () => {
    it('should detect entity state changes when entity state value changes', () => {
      // Feature: ring-alarm-ui, Property 1: Entity Integration and State Updates
      // Validates: Requirements 1.3, FR-1
      fc.assert(
        fc.property(
          fc.constantFrom(
            'disarmed',
            'armed_home',
            'armed_away',
            'pending',
            'triggered'
          ),
          fc.constantFrom(
            'disarmed',
            'armed_home',
            'armed_away',
            'pending',
            'triggered'
          ),
          (oldState: string, newState: string) => {
            const entityId = 'alarm_control_panel.ring_alarm';
            const oldEntity = generateHassEntity(entityId, oldState);
            const newEntity = generateHassEntity(entityId, newState);

            const oldHass = generateHomeAssistant({ [entityId]: oldEntity });
            const newHass = generateHomeAssistant({ [entityId]: newEntity });

            const hasChanged = hasEntityStateChanged(
              oldHass,
              newHass,
              entityId
            );

            // Should detect change when states are different
            if (oldState !== newState) {
              expect(hasChanged).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should detect entity availability changes', () => {
      // Feature: ring-alarm-ui, Property 1: Entity Integration and State Updates
      // Validates: Requirements 1.3, FR-1
      fc.assert(
        fc.property(
          fc.constantFrom(
            'alarm_control_panel.ring_alarm',
            'alarm_control_panel.test'
          ),
          (entityId: string) => {
            const entity = generateHassEntity(entityId, 'disarmed');

            // Test entity appearing (undefined -> exists)
            const oldHass = generateHomeAssistant({});
            const newHass = generateHomeAssistant({ [entityId]: entity });

            const hasChanged = hasEntityStateChanged(
              oldHass,
              newHass,
              entityId
            );
            expect(hasChanged).toBe(true);

            // Test entity disappearing (exists -> undefined)
            const hasChangedReverse = hasEntityStateChanged(
              newHass,
              oldHass,
              entityId
            );
            expect(hasChangedReverse).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly identify entity availability', () => {
      // Feature: ring-alarm-ui, Property 1: Entity Integration and State Updates
      // Validates: Requirements 1.3, FR-1
      fc.assert(
        fc.property(
          fc.constantFrom(
            'disarmed',
            'armed_home',
            'armed_away',
            'unavailable'
          ),
          (state: string) => {
            const entityId = 'alarm_control_panel.ring_alarm';
            const entity = generateHassEntity(entityId, state);
            const hass = generateHomeAssistant({ [entityId]: entity });

            const isAvailable = isEntityAvailable(hass, entityId);

            // Entity should be available unless state is 'unavailable'
            if (state === 'unavailable') {
              expect(isAvailable).toBe(false);
            } else {
              expect(isAvailable).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should extract correct domain from entity IDs', () => {
      // Feature: ring-alarm-ui, Property 1: Entity Integration and State Updates
      // Validates: Requirements 1.3, FR-1
      fc.assert(
        fc.property(
          fc.constantFrom(
            'alarm_control_panel.ring_alarm',
            'sensor.temperature',
            'light.living_room',
            'switch.outlet'
          ),
          (entityId: string) => {
            const domain = getEntityDomain(entityId);
            const expectedDomain = entityId.split('.')[0];

            expect(domain).toBe(expectedDomain);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate alarm entities correctly', () => {
      // Feature: ring-alarm-ui, Property 1: Entity Integration and State Updates
      // Validates: Requirements 1.3, FR-1
      fc.assert(
        fc.property(
          fc.constantFrom(
            'alarm_control_panel.ring_alarm',
            'alarm_control_panel.test',
            'sensor.temperature',
            'light.living_room'
          ),
          fc.constantFrom('disarmed', 'armed_home', 'unavailable'),
          (entityId: string, state: string) => {
            const entity = generateHassEntity(entityId, state);
            const hass = generateHomeAssistant({ [entityId]: entity });

            const validation = validateAlarmEntity(hass, entityId);

            // Should be valid only if:
            // 1. Domain is alarm_control_panel
            // 2. Entity exists
            // 3. Entity is not unavailable
            const isAlarmDomain = entityId.startsWith('alarm_control_panel.');
            const isAvailable = state !== 'unavailable';

            if (isAlarmDomain && isAvailable) {
              expect(validation.isValid).toBe(true);
              expect(validation.error).toBeUndefined();
            } else {
              expect(validation.isValid).toBe(false);
              expect(validation.error).toBeDefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should detect relevant state changes for monitored entities', () => {
      // Feature: ring-alarm-ui, Property 1: Entity Integration and State Updates
      // Validates: Requirements 1.3, FR-1
      fc.assert(
        fc.property(
          fc.constantFrom('disarmed', 'armed_home', 'armed_away'),
          fc.constantFrom('disarmed', 'armed_home', 'armed_away'),
          (oldState: string, newState: string) => {
            const entityId = 'alarm_control_panel.ring_alarm';
            const oldEntity = generateHassEntity(entityId, oldState);
            const newEntity = generateHassEntity(entityId, newState);

            const oldHass = generateHomeAssistant({ [entityId]: oldEntity });
            const newHass = generateHomeAssistant({ [entityId]: newEntity });

            const hasRelevantChanges = hasRelevantStateChanges(
              oldHass,
              newHass,
              [entityId]
            );

            // Should detect relevant changes when monitoring specific entity
            if (oldState !== newState) {
              expect(hasRelevantChanges).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
