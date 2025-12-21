/**
 * Property-based tests for AlarmDisplayRenderer accessibility compliance
 */

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';

import { AlarmDisplayRenderer } from './alarm-display-renderer';
import { AlarmState, RingAlarmCardConfig } from '@/types';

describe('AlarmDisplayRenderer Property Tests', () => {
  describe('Property 6: Accessibility Compliance', () => {
    it('should include proper ARIA attributes for all alarm states', () => {
      // Feature: ring-alarm-ui, Property 6: Accessibility Compliance
      // Validates: Requirements 2.5
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
          fc.boolean(), // show_state_text
          fc.boolean(), // compact_mode
          (state, showStateText, compactMode) => {
            // Create a valid AlarmState object
            const alarmState: AlarmState = {
              state: state as AlarmState['state'],
              icon: 'mdi:shield-off',
              color: '--success-color',
              label: 'Test State',
              isAnimated: false,
            };

            // Create config
            const config: RingAlarmCardConfig = {
              type: 'custom:ring-alarm-card',
              entity: 'alarm_control_panel.test',
              show_state_text: showStateText,
              compact_mode: compactMode,
            };

            // Render the alarm status
            const result = AlarmDisplayRenderer.renderAlarmStatus(
              alarmState,
              config
            );
            const htmlString = result.getHTML?.() || result.toString();

            // Verify ARIA attributes are present
            expect(htmlString).toMatch(/role="status"/);
            expect(htmlString).toMatch(/aria-label="[^"]*"/);
            expect(htmlString).toMatch(/aria-live="polite"/);
            expect(htmlString).toMatch(/aria-hidden="true"/);

            // Verify accessibility structure
            expect(htmlString).toContain('class="alarm-status');
            expect(htmlString).toContain('ha-icon');

            // If text is shown, verify it has proper labeling
            if (showStateText) {
              expect(htmlString).toMatch(/aria-label="Current state:[^"]*"/);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include proper ARIA attributes for error states', () => {
      // Feature: ring-alarm-ui, Property 6: Accessibility Compliance
      // Validates: Requirements 2.5
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          errorMessage => {
            // Render error state
            const result = AlarmDisplayRenderer.renderErrorState(errorMessage);
            const htmlString = result.getHTML?.() || result.toString();

            // Verify ARIA attributes for error state
            expect(htmlString).toMatch(/role="alert"/);
            expect(htmlString).toMatch(/aria-label="Error:[^"]*"/);
            expect(htmlString).toMatch(/aria-hidden="true"/);

            // Verify error structure
            expect(htmlString).toContain('class="alarm-error');
            expect(htmlString).toContain('ha-icon');
            expect(htmlString).toContain(errorMessage);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include proper ARIA attributes for loading state', () => {
      // Feature: ring-alarm-ui, Property 6: Accessibility Compliance
      // Validates: Requirements 2.5
      fc.assert(
        fc.property(
          fc.constant(null), // No parameters needed for loading state
          () => {
            // Render loading state
            const result = AlarmDisplayRenderer.renderLoadingState();
            const htmlString = result.getHTML?.() || result.toString();

            // Verify ARIA attributes for loading state
            expect(htmlString).toMatch(/role="status"/);
            expect(htmlString).toMatch(/aria-label="Loading alarm status"/);
            expect(htmlString).toMatch(/aria-live="polite"/);
            expect(htmlString).toMatch(/aria-hidden="true"/);

            // Verify loading structure
            expect(htmlString).toContain('class="alarm-loading');
            expect(htmlString).toContain('ha-icon');
            expect(htmlString).toContain('Loading...');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include proper ARIA attributes for entity not found errors', () => {
      // Feature: ring-alarm-ui, Property 6: Accessibility Compliance
      // Validates: Requirements 2.5
      fc.assert(
        fc.property(
          fc
            .string({ minLength: 1, maxLength: 50 })
            .map(s => `alarm_control_panel.${s}`),
          entityId => {
            // Render entity not found error
            const result = AlarmDisplayRenderer.renderEntityNotFound(entityId);
            const htmlString = result.getHTML?.() || result.toString();

            // Verify ARIA attributes for entity not found error
            expect(htmlString).toMatch(/role="alert"/);
            expect(htmlString).toMatch(
              /aria-label="Entity not found error:[^"]*"/
            );
            expect(htmlString).toMatch(/aria-hidden="true"/);

            // Verify entity not found structure
            expect(htmlString).toContain('class="alarm-error');
            expect(htmlString).toContain('ha-icon');
            expect(htmlString).toContain(entityId);
            expect(htmlString).toContain('Entity not found');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
