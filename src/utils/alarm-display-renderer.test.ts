/**
 * Unit tests for AlarmDisplayRenderer
 */

import { describe, it, expect } from '@jest/globals';
import { AlarmDisplayRenderer } from './alarm-display-renderer';
import { AlarmState, RingAlarmCardConfig } from '@/types';

// Helper functions
const createAlarmState = (state: AlarmState['state']): AlarmState => ({
  state,
  icon: 'mdi:shield-off',
  color: '--success-color',
  label: 'Test State',
  isAnimated: false,
});

const createConfig = (
  overrides: Partial<RingAlarmCardConfig> = {}
): RingAlarmCardConfig => ({
  type: 'custom:ring-alarm-card',
  entity: 'alarm_control_panel.test',
  show_state_text: true,
  compact_mode: false,
  ...overrides,
});

describe('AlarmDisplayRenderer Unit Tests', () => {
  describe('renderAlarmStatus', () => {
    it('should render alarm status with icon and text by default', () => {
      const alarmState = createAlarmState('disarmed');
      const config = createConfig();

      const result = AlarmDisplayRenderer.renderAlarmStatus(alarmState, config);
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('class="alarm-status');
      expect(htmlString).toContain('ha-icon');
      expect(htmlString).toContain('Test State');
      expect(htmlString).toContain('role="status"');
      expect(htmlString).toContain('disarmed'); // State class
      expect(htmlString).toContain('mdi:shield-off'); // Icon
    });

    it('should render alarm status without text when show_state_text is false', () => {
      const alarmState = createAlarmState('armed_home');
      const config = createConfig({ show_state_text: false });

      const result = AlarmDisplayRenderer.renderAlarmStatus(alarmState, config);
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('ha-icon');
      expect(htmlString).toContain('armed_home'); // State should still be in the output
      // Text should not be rendered when show_state_text is false
      expect(htmlString).not.toContain('class="alarm-text"');
    });

    it('should apply compact mode class when compact_mode is true', () => {
      const alarmState = createAlarmState('armed_away');
      const config = createConfig({ compact_mode: true });

      const result = AlarmDisplayRenderer.renderAlarmStatus(alarmState, config);
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('class="alarm-status');
      expect(htmlString).toContain('compact');
      expect(htmlString).toContain('armed_away');
    });

    it('should render different alarm states with correct classes', () => {
      const states: AlarmState['state'][] = [
        'disarmed',
        'armed_home',
        'armed_away',
        'pending',
        'triggered',
        'unknown',
      ];
      const config = createConfig();

      states.forEach(state => {
        const alarmState = createAlarmState(state);
        const result = AlarmDisplayRenderer.renderAlarmStatus(
          alarmState,
          config
        );
        const htmlString = result.getHTML?.() || result.toString();

        expect(htmlString).toContain('class="alarm-status');
        expect(htmlString).toContain(state); // State should appear in the output
      });
    });

    it('should include proper ARIA attributes', () => {
      const alarmState = createAlarmState('pending');
      const config = createConfig();

      const result = AlarmDisplayRenderer.renderAlarmStatus(alarmState, config);
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('role="status"');
      expect(htmlString).toContain('aria-label="Alarm system status:');
      expect(htmlString).toContain('aria-live="polite"');
      expect(htmlString).toContain('aria-hidden="true"');
    });

    it('should apply custom color from alarm state', () => {
      const alarmState: AlarmState = {
        state: 'triggered',
        icon: 'mdi:shield-alert',
        color: '--error-color',
        label: 'Triggered',
        isAnimated: true,
      };
      const config = createConfig();

      const result = AlarmDisplayRenderer.renderAlarmStatus(alarmState, config);
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('style="color: var(');
      expect(htmlString).toContain('--error-color');
    });
  });

  describe('renderErrorState', () => {
    it('should render error message with icon', () => {
      const errorMessage = 'Test error message';
      const result = AlarmDisplayRenderer.renderErrorState(errorMessage);
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('class="alarm-error"');
      expect(htmlString).toContain('ha-icon');
      expect(htmlString).toContain('icon="mdi:alert-circle"');
      expect(htmlString).toContain(errorMessage);
      expect(htmlString).toContain('role="alert"');
    });

    it('should include proper ARIA attributes for error', () => {
      const errorMessage = 'Configuration error';
      const result = AlarmDisplayRenderer.renderErrorState(errorMessage);
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('role="alert"');
      expect(htmlString).toContain('aria-label="Error:');
      expect(htmlString).toContain('aria-hidden="true"');
    });

    it('should handle empty error message', () => {
      const result = AlarmDisplayRenderer.renderErrorState('');
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('class="alarm-error"');
      expect(htmlString).toContain('ha-icon');
    });

    it('should handle long error messages', () => {
      const longMessage =
        'This is a very long error message that should still be displayed properly in the error state rendering';
      const result = AlarmDisplayRenderer.renderErrorState(longMessage);
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain(longMessage);
      expect(htmlString).toContain('class="alarm-error"');
    });
  });

  describe('renderLoadingState', () => {
    it('should render loading indicator with spinner', () => {
      const result = AlarmDisplayRenderer.renderLoadingState();
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('class="alarm-loading"');
      expect(htmlString).toContain('ha-icon');
      expect(htmlString).toContain('icon="mdi:loading"');
      expect(htmlString).toContain('Loading...');
      expect(htmlString).toContain('role="status"');
    });

    it('should include proper ARIA attributes for loading', () => {
      const result = AlarmDisplayRenderer.renderLoadingState();
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('role="status"');
      expect(htmlString).toContain('aria-label="Loading alarm status"');
      expect(htmlString).toContain('aria-live="polite"');
      expect(htmlString).toContain('aria-hidden="true"');
    });
  });

  describe('renderEntityNotFound', () => {
    it('should render entity not found error with entity ID', () => {
      const entityId = 'alarm_control_panel.ring_alarm';
      const result = AlarmDisplayRenderer.renderEntityNotFound(entityId);
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('class="alarm-error"');
      expect(htmlString).toContain('ha-icon');
      expect(htmlString).toContain('icon="mdi:alert-circle-outline"');
      expect(htmlString).toContain(`Entity not found: ${entityId}`);
      expect(htmlString).toContain('Please check:');
      expect(htmlString).toContain('role="alert"');
    });

    it('should include proper ARIA attributes for entity not found', () => {
      const entityId = 'alarm_control_panel.test';
      const result = AlarmDisplayRenderer.renderEntityNotFound(entityId);
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('role="alert"');
      expect(htmlString).toContain('aria-label="Entity not found error:');
      expect(htmlString).toContain('aria-hidden="true"');
    });

    it('should include help text for entity not found', () => {
      const entityId = 'alarm_control_panel.missing';
      const result = AlarmDisplayRenderer.renderEntityNotFound(entityId);
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('Please check:');
      expect(htmlString).toContain('<ul');
    });

    it('should handle different entity ID formats', () => {
      const entityIds = [
        'alarm_control_panel.ring',
        'alarm_control_panel.test_alarm',
        'alarm_control_panel.home_security',
      ];

      entityIds.forEach(entityId => {
        const result = AlarmDisplayRenderer.renderEntityNotFound(entityId);
        const htmlString = result.getHTML?.() || result.toString();

        expect(htmlString).toContain(`Entity not found: ${entityId}`);
        expect(htmlString).toContain('class="alarm-error"');
      });
    });
  });

  describe('Compact mode rendering', () => {
    it('should apply compact class for all rendering functions when applicable', () => {
      const alarmState: AlarmState = {
        state: 'disarmed',
        icon: 'mdi:shield-off',
        color: '--success-color',
        label: 'Disarmed',
        isAnimated: false,
      };
      const compactConfig = createConfig({ compact_mode: true });

      const result = AlarmDisplayRenderer.renderAlarmStatus(
        alarmState,
        compactConfig
      );
      const htmlString = result.getHTML?.() || result.toString();

      expect(htmlString).toContain('compact');
    });
  });

  describe('Accessibility compliance', () => {
    it('should ensure all rendered states have proper ARIA roles', () => {
      const alarmState = createAlarmState('armed_home');
      const config = createConfig();

      // Test alarm status
      const alarmResult = AlarmDisplayRenderer.renderAlarmStatus(
        alarmState,
        config
      );
      expect(alarmResult.getHTML?.() || alarmResult.toString()).toContain(
        'role="status"'
      );

      // Test error state
      const errorResult = AlarmDisplayRenderer.renderErrorState('Test error');
      expect(errorResult.getHTML?.() || errorResult.toString()).toContain(
        'role="alert"'
      );

      // Test loading state
      const loadingResult = AlarmDisplayRenderer.renderLoadingState();
      expect(loadingResult.getHTML?.() || loadingResult.toString()).toContain(
        'role="status"'
      );

      // Test entity not found
      const notFoundResult =
        AlarmDisplayRenderer.renderEntityNotFound('test.entity');
      expect(notFoundResult.getHTML?.() || notFoundResult.toString()).toContain(
        'role="alert"'
      );
    });

    it('should ensure all icons have aria-hidden attribute', () => {
      const alarmState = createAlarmState('pending');
      const config = createConfig();

      // Test all rendering functions include aria-hidden on icons
      const functions = [
        () => AlarmDisplayRenderer.renderAlarmStatus(alarmState, config),
        () => AlarmDisplayRenderer.renderErrorState('Error'),
        () => AlarmDisplayRenderer.renderLoadingState(),
        () => AlarmDisplayRenderer.renderEntityNotFound('test.entity'),
      ];

      functions.forEach(renderFn => {
        const result = renderFn();
        const htmlString = result.getHTML?.() || result.toString();
        expect(htmlString).toContain('aria-hidden="true"');
      });
    });
  });
});
