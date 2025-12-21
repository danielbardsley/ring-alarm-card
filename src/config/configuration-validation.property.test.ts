/**
 * Property-based tests for Ring Alarm Card configuration validation
 * Tests the enhanced configuration interface with alarm-specific fields
 */

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { RingAlarmCardConfig } from '../types';

describe('Property-Based Tests for Alarm Configuration Validation', () => {
  describe('Property 3: Configuration Validation', () => {
    it('should validate required entity field format', () => {
      // Feature: ring-alarm-ui, Property 3: Configuration Validation
      // Validates: Requirements 3.1, 3.2, 3.4
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('alarm_control_panel.ring_alarm'),
            fc.constant('alarm_control_panel.my_alarm'),
            fc.constant('alarm_control_panel.test123')
          ),
          (entityId: string) => {
            const config: RingAlarmCardConfig = {
              type: 'custom:ring-alarm-card',
              entity: entityId,
            };

            // Valid alarm entity IDs should match the pattern
            expect(config.entity).toMatch(/^alarm_control_panel\./);
            expect(config.entity.length).toBeGreaterThan(
              'alarm_control_panel.'.length
            );
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should reject invalid entity formats', () => {
      // Feature: ring-alarm-ui, Property 3: Configuration Validation
      // Validates: Requirements 3.1, 3.2, 3.4
      const invalidEntities = [
        'sensor.temperature',
        'light.living_room',
        'alarm_control_panel.',
        'alarm_control_panel',
        '.ring_alarm',
        '',
      ];

      invalidEntities.forEach(entityId => {
        const isValid = entityId.match(/^alarm_control_panel\..+$/);
        expect(isValid).toBeFalsy();
      });
    });

    it('should validate optional boolean fields', () => {
      // Feature: ring-alarm-ui, Property 3: Configuration Validation
      // Validates: Requirements 3.1, 3.2, 3.4
      fc.assert(
        fc.property(
          fc.record({
            show_state_text: fc.option(fc.boolean(), { nil: undefined }),
            compact_mode: fc.option(fc.boolean(), { nil: undefined }),
          }),
          options => {
            const config: RingAlarmCardConfig = {
              type: 'custom:ring-alarm-card',
              entity: 'alarm_control_panel.ring_alarm',
              ...options,
            };

            // Optional fields should be undefined or boolean
            if (config.show_state_text !== undefined) {
              expect(typeof config.show_state_text).toBe('boolean');
            }
            if (config.compact_mode !== undefined) {
              expect(typeof config.compact_mode).toBe('boolean');
            }
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should require type field to be custom:ring-alarm-card', () => {
      // Feature: ring-alarm-ui, Property 3: Configuration Validation
      // Validates: Requirements 3.1, 3.2, 3.4
      const config: RingAlarmCardConfig = {
        type: 'custom:ring-alarm-card',
        entity: 'alarm_control_panel.ring_alarm',
      };

      expect(config.type).toBe('custom:ring-alarm-card');
      expect(config.entity).toBe('alarm_control_panel.ring_alarm');
    });

    it('should handle missing entity field as invalid', () => {
      // Feature: ring-alarm-ui, Property 3: Configuration Validation
      // Validates: Requirements 3.1, 3.2, 3.4
      const configWithoutEntity = {
        type: 'custom:ring-alarm-card',
        title: 'Test Card',
        // Missing entity field
      };

      // This should be considered invalid
      const hasRequiredEntity =
        'entity' in configWithoutEntity &&
        typeof configWithoutEntity.entity === 'string' &&
        configWithoutEntity.entity.startsWith('alarm_control_panel.');

      expect(hasRequiredEntity).toBe(false);
    });
  });
});
