/**
 * Property-based tests for AlarmStateManager
 * Tests state mapping consistency and helper functions
 */

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { AlarmStateManager } from './alarm-state-manager';
import { HassEntity, AlarmState } from '@/types';

describe('Property-Based Tests for AlarmStateManager', () => {
  describe('Property 2: State Mapping Consistency', () => {
    it('should consistently map all valid alarm states to correct visual representations', () => {
      // Feature: ring-alarm-ui, Property 2: State Mapping Consistency
      // Validates: Requirements 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, FR-2
      fc.assert(
        fc.property(
          fc.constantFrom(
            'disarmed',
            'armed_home',
            'armed_away',
            'pending',
            'triggered'
          ),
          fc
            .string({ minLength: 1, maxLength: 20 })
            .map(s => s.replace(/[^a-zA-Z0-9_]/g, '_')),
          (alarmState: string, entitySuffix: string) => {
            // Create a mock entity with the alarm state
            const mockEntity: HassEntity = {
              entity_id: `alarm_control_panel.${entitySuffix}`,
              state: alarmState,
              attributes: {},
              context: { id: 'test' },
              last_changed: '2023-01-01T00:00:00Z',
              last_updated: '2023-01-01T00:00:00Z',
            };

            const result = AlarmStateManager.mapEntityState(mockEntity);

            // Verify the result has all required properties
            expect(result).toHaveProperty('state');
            expect(result).toHaveProperty('icon');
            expect(result).toHaveProperty('color');
            expect(result).toHaveProperty('label');
            expect(result).toHaveProperty('isAnimated');

            // Verify state mapping consistency
            expect(result.state).toBe(alarmState as AlarmState['state']);

            // Verify icon format (should be MDI icon)
            expect(result.icon).toMatch(/^mdi:/);

            // Verify color format (should be CSS custom property)
            expect(result.color).toMatch(/^--[\w-]+-color$/);

            // Verify label is non-empty string
            expect(typeof result.label).toBe('string');
            expect(result.label.length).toBeGreaterThan(0);

            // Verify isAnimated is boolean
            expect(typeof result.isAnimated).toBe('boolean');

            // Verify specific state mappings
            switch (alarmState) {
              case 'disarmed':
                expect(result.icon).toBe('mdi:shield-off');
                expect(result.color).toBe('--success-color');
                expect(result.label).toBe('Disarmed');
                expect(result.isAnimated).toBe(false);
                break;
              case 'armed_home':
                expect(result.icon).toBe('mdi:home-lock');
                expect(result.color).toBe('--warning-color');
                expect(result.label).toBe('Armed Home');
                expect(result.isAnimated).toBe(false);
                break;
              case 'armed_away':
                expect(result.icon).toBe('mdi:shield-lock');
                expect(result.color).toBe('--error-color');
                expect(result.label).toBe('Armed Away');
                expect(result.isAnimated).toBe(false);
                break;
              case 'pending':
                expect(result.icon).toBe('mdi:clock-outline');
                expect(result.color).toBe('--warning-color');
                expect(result.label).toBe('Pending');
                expect(result.isAnimated).toBe(true);
                break;
              case 'triggered':
                expect(result.icon).toBe('mdi:shield-alert');
                expect(result.color).toBe('--error-color');
                expect(result.label).toBe('Triggered');
                expect(result.isAnimated).toBe(true);
                break;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle unknown states consistently', () => {
      // Feature: ring-alarm-ui, Property 2: State Mapping Consistency
      // Validates: Requirements 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, FR-2
      fc.assert(
        fc.property(
          fc
            .string({ minLength: 1, maxLength: 20 })
            .filter(
              s =>
                ![
                  'disarmed',
                  'armed_home',
                  'armed_away',
                  'pending',
                  'triggered',
                ].includes(s)
            ),
          fc
            .string({ minLength: 1, maxLength: 20 })
            .map(s => s.replace(/[^a-zA-Z0-9_]/g, '_')),
          (unknownState: string, entitySuffix: string) => {
            const mockEntity: HassEntity = {
              entity_id: `alarm_control_panel.${entitySuffix}`,
              state: unknownState,
              attributes: {},
              context: { id: 'test' },
              last_changed: '2023-01-01T00:00:00Z',
              last_updated: '2023-01-01T00:00:00Z',
            };

            const result = AlarmStateManager.mapEntityState(mockEntity);

            // Unknown states should always map to 'unknown'
            expect(result.state).toBe('unknown');
            expect(result.icon).toBe('mdi:help-circle');
            expect(result.color).toBe('--disabled-text-color');
            expect(result.label).toBe('Unknown');
            expect(result.isAnimated).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have consistent helper function results', () => {
      // Feature: ring-alarm-ui, Property 2: State Mapping Consistency
      // Validates: Requirements 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, FR-2
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
          (state: AlarmState['state']) => {
            const icon = AlarmStateManager.getStateIcon(state);
            const color = AlarmStateManager.getStateColor(state);
            const label = AlarmStateManager.getStateLabel(state);

            // Helper functions should return consistent results
            expect(icon).toMatch(/^mdi:/);
            expect(color).toMatch(/^--[\w-]+-color$/);
            expect(typeof label).toBe('string');
            expect(label.length).toBeGreaterThan(0);

            // Results should match what mapEntityState would produce
            const mockEntity: HassEntity = {
              entity_id: 'alarm_control_panel.test',
              state: state === 'unknown' ? 'invalid_state' : state,
              attributes: {},
              context: { id: 'test' },
              last_changed: '2023-01-01T00:00:00Z',
              last_updated: '2023-01-01T00:00:00Z',
            };

            const mappedState = AlarmStateManager.mapEntityState(mockEntity);
            expect(mappedState.icon).toBe(icon);
            expect(mappedState.color).toBe(color);
            expect(mappedState.label).toBe(label);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
