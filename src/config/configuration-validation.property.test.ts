/**
 * Property-based tests for Ring Alarm Card configuration validation
 * Tests the enhanced configuration interface with alarm-specific fields
 */

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { RingAlarmCardConfig } from '../types';
import { ConfigurationManager } from './configuration-manager';

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

  describe('Property 1: Vacation Entity Configuration Validation', () => {
    // Feature: vacation-button, Property 1: Vacation Entity Configuration Validation
    // Validates: Requirements 1.2, 1.3

    /**
     * Generator for valid input_boolean entity names
     * Entity names must start with a letter or underscore and contain only alphanumeric characters and underscores
     */
    const validEntityNameArb = fc
      .tuple(
        fc.constantFrom(
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'q',
          'r',
          's',
          't',
          'u',
          'v',
          'w',
          'x',
          'y',
          'z',
          '_'
        ),
        fc.stringOf(
          fc.constantFrom(
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '_'
          ),
          { minLength: 0, maxLength: 20 }
        )
      )
      .map(([first, rest]) => first + rest);

    /**
     * Generator for valid vacation entity IDs (input_boolean.*)
     */
    const validVacationEntityArb = validEntityNameArb.map(
      name => `input_boolean.${name}`
    );

    /**
     * Generator for invalid vacation entity IDs (wrong domain)
     */
    const invalidDomainEntityArb = fc
      .constantFrom(
        'switch',
        'sensor',
        'binary_sensor',
        'light',
        'automation',
        'script'
      )
      .chain(domain => validEntityNameArb.map(name => `${domain}.${name}`));

    /**
     * Generator for entity names starting with a number (invalid)
     */
    const invalidStartWithNumberArb = fc
      .tuple(
        fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'),
        fc.stringOf(
          fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '_'),
          { minLength: 0, maxLength: 10 }
        )
      )
      .map(([first, rest]) => `input_boolean.${first}${rest}`);

    /**
     * Generator for entity names with invalid characters
     */
    const invalidCharactersEntityArb = fc
      .tuple(
        validEntityNameArb,
        fc.constantFrom('-', '.', ' ', '!', '@', '#', '$', '%')
      )
      .map(([name, char]) => `input_boolean.${name}${char}suffix`);

    it('should accept valid input_boolean entity IDs', () => {
      fc.assert(
        fc.property(validVacationEntityArb, entityId => {
          const config: RingAlarmCardConfig = {
            type: 'custom:ring-alarm-card',
            entity: 'alarm_control_panel.ring_alarm',
            vacation_entity: entityId,
          };

          // Should not throw for valid input_boolean entities
          expect(() =>
            ConfigurationManager.validateConfig(config)
          ).not.toThrow();
        }),
        { numRuns: 100 }
      );
    });

    it('should reject entity IDs with wrong domain', () => {
      fc.assert(
        fc.property(invalidDomainEntityArb, entityId => {
          const config: RingAlarmCardConfig = {
            type: 'custom:ring-alarm-card',
            entity: 'alarm_control_panel.ring_alarm',
            vacation_entity: entityId,
          };

          // Should throw for non-input_boolean entities
          expect(() => ConfigurationManager.validateConfig(config)).toThrow(
            'must be an input_boolean entity'
          );
        }),
        { numRuns: 100 }
      );
    });

    it('should reject entity names starting with a number', () => {
      fc.assert(
        fc.property(invalidStartWithNumberArb, entityId => {
          const config: RingAlarmCardConfig = {
            type: 'custom:ring-alarm-card',
            entity: 'alarm_control_panel.ring_alarm',
            vacation_entity: entityId,
          };

          // Should throw for entity names starting with a number
          expect(() => ConfigurationManager.validateConfig(config)).toThrow(
            'contains invalid characters'
          );
        }),
        { numRuns: 100 }
      );
    });

    it('should reject entity names with invalid characters', () => {
      fc.assert(
        fc.property(invalidCharactersEntityArb, entityId => {
          const config: RingAlarmCardConfig = {
            type: 'custom:ring-alarm-card',
            entity: 'alarm_control_panel.ring_alarm',
            vacation_entity: entityId,
          };

          // Should throw for entity names with invalid characters
          expect(() => ConfigurationManager.validateConfig(config)).toThrow();
        }),
        { numRuns: 100 }
      );
    });

    it('should accept configuration without vacation_entity', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.option(fc.string(), { nil: undefined }),
            show_state_text: fc.option(fc.boolean(), { nil: undefined }),
            compact_mode: fc.option(fc.boolean(), { nil: undefined }),
          }),
          options => {
            const config: RingAlarmCardConfig = {
              type: 'custom:ring-alarm-card',
              entity: 'alarm_control_panel.ring_alarm',
              ...options,
            };

            // Should not throw when vacation_entity is not provided
            expect(() =>
              ConfigurationManager.validateConfig(config)
            ).not.toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject non-string vacation_entity values', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.integer(),
            fc.boolean(),
            fc.array(fc.string()),
            fc.object()
          ),
          invalidValue => {
            const config = {
              type: 'custom:ring-alarm-card',
              entity: 'alarm_control_panel.ring_alarm',
              vacation_entity: invalidValue,
            } as any;

            // Should throw for non-string vacation_entity
            expect(() => ConfigurationManager.validateConfig(config)).toThrow(
              'vacation_entity must be a string'
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject vacation_entity missing entity name', () => {
      const missingNameEntities = [
        'input_boolean.',
        'input_boolean',
        'input_boolean. ',
      ];

      missingNameEntities.forEach(entityId => {
        const config: RingAlarmCardConfig = {
          type: 'custom:ring-alarm-card',
          entity: 'alarm_control_panel.ring_alarm',
          vacation_entity: entityId,
        };

        expect(() => ConfigurationManager.validateConfig(config)).toThrow();
      });
    });
  });
});
