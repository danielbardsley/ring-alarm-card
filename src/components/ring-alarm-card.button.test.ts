/**
 * Unit tests for RingAlarmCard control button click handling
 * Tests service calls, loading states, error states, and error recovery
 * Requirements: 3.4, 3.5, 4.1, 4.4
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { RingAlarmCard } from './ring-alarm-card';
import { HomeAssistant, RingAlarmCardConfig, HassEntity } from '../types';

// Register the custom element
import '../index';

describe('RingAlarmCard Button Click Handling', () => {
  let element: RingAlarmCard;
  let mockHass: HomeAssistant;
  let mockCallService: jest.Mock;

  beforeEach(() => {
    // Create a fresh element for each test
    element = document.createElement('ring-alarm-card') as RingAlarmCard;
    document.body.appendChild(element);

    // Create mock callService function
    mockCallService = jest.fn().mockResolvedValue({});

    // Create mock HASS object
    mockHass = {
      states: {},
      callService: mockCallService,
      language: 'en',
      themes: {},
      selectedTheme: null,
      panels: {},
      panelUrl: '',
    };

    // Add a valid alarm entity
    const alarmEntity: HassEntity = {
      entity_id: 'alarm_control_panel.ring_alarm',
      state: 'disarmed',
      attributes: {},
      context: { id: 'test-context' },
      last_changed: '2023-01-01T00:00:00Z',
      last_updated: '2023-01-01T00:00:00Z',
    };
    mockHass.states['alarm_control_panel.ring_alarm'] = alarmEntity;
  });

  afterEach(() => {
    // Clean up after each test
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
    jest.clearAllMocks();
  });

  /**
   * Helper to set up the card with a valid configuration
   */
  async function setupCard(): Promise<void> {
    const config: RingAlarmCardConfig = {
      type: 'custom:ring-alarm-card',
      entity: 'alarm_control_panel.ring_alarm',
    };

    element.setConfig(config);
    element.hass = mockHass;

    // Manually trigger validation since Lit lifecycle isn't working in tests
    (element as any)._validateAndInitializeEntity();
    await element.updateComplete;
  }

  describe('Service call with correct parameters', () => {
    it('should call alarm_disarm service when disarm button is clicked', async () => {
      await setupCard();

      // Trigger the button click handler
      await (element as any)._handleControlButtonClick('disarm');

      expect(mockCallService).toHaveBeenCalledWith(
        'alarm_control_panel',
        'alarm_disarm',
        { entity_id: 'alarm_control_panel.ring_alarm' }
      );
    });

    it('should call alarm_arm_home service when home button is clicked', async () => {
      await setupCard();

      // Trigger the button click handler
      await (element as any)._handleControlButtonClick('arm_home');

      expect(mockCallService).toHaveBeenCalledWith(
        'alarm_control_panel',
        'alarm_arm_home',
        { entity_id: 'alarm_control_panel.ring_alarm' }
      );
    });

    it('should call alarm_arm_away service when away button is clicked', async () => {
      await setupCard();

      // Trigger the button click handler
      await (element as any)._handleControlButtonClick('arm_away');

      expect(mockCallService).toHaveBeenCalledWith(
        'alarm_control_panel',
        'alarm_arm_away',
        { entity_id: 'alarm_control_panel.ring_alarm' }
      );
    });

    it('should not call service when HASS is unavailable', async () => {
      await setupCard();

      // Remove HASS
      (element as any).hass = undefined;

      // Trigger the button click handler
      await (element as any)._handleControlButtonClick('disarm');

      expect(mockCallService).not.toHaveBeenCalled();
    });

    it('should not call service when entity is not configured', async () => {
      // Create element without appending to DOM to avoid connectedCallback
      const testElement = new RingAlarmCard();

      // Set HASS but don't set config (simulating missing entity)
      testElement.hass = mockHass;

      // Manually initialize button states since connectedCallback won't run
      (testElement as any)._initializeButtonStates();

      // Trigger the button click handler - should return early due to missing config
      await (testElement as any)._handleControlButtonClick('disarm');

      expect(mockCallService).not.toHaveBeenCalled();
    });
  });

  describe('Loading state during service call', () => {
    it('should set loading state when button is clicked', async () => {
      await setupCard();

      // Create a promise that we can control
      let resolveService: () => void;
      const servicePromise = new Promise<void>(resolve => {
        resolveService = resolve;
      });
      mockCallService.mockReturnValue(servicePromise);

      // Start the button click (don't await)
      const clickPromise = (element as any)._handleControlButtonClick('disarm');

      // Check loading state is set
      const buttonState = (element as any).buttonStates.get('disarm');
      expect(buttonState.isLoading).toBe(true);

      // Resolve the service call
      resolveService!();
      await clickPromise;
    });

    it('should clear loading state after successful service call', async () => {
      await setupCard();

      // Trigger the button click handler
      await (element as any)._handleControlButtonClick('disarm');

      // Check loading state is cleared
      const buttonState = (element as any).buttonStates.get('disarm');
      expect(buttonState.isLoading).toBe(false);
    });

    it('should clear loading state after failed service call', async () => {
      await setupCard();

      // Make service call fail
      mockCallService.mockRejectedValue(new Error('Service call failed'));

      // Trigger the button click handler
      await (element as any)._handleControlButtonClick('disarm');

      // Check loading state is cleared
      const buttonState = (element as any).buttonStates.get('disarm');
      expect(buttonState.isLoading).toBe(false);
    });
  });

  describe('Error state on service failure', () => {
    it('should set error state when service call fails', async () => {
      await setupCard();

      // Make service call fail
      mockCallService.mockRejectedValue(new Error('Service call failed'));

      // Trigger the button click handler
      await (element as any)._handleControlButtonClick('disarm');

      // Check error state is set
      const buttonState = (element as any).buttonStates.get('disarm');
      expect(buttonState.hasError).toBe(true);
    });

    it('should not set error state when service call succeeds', async () => {
      await setupCard();

      // Trigger the button click handler
      await (element as any)._handleControlButtonClick('disarm');

      // Check error state is not set
      const buttonState = (element as any).buttonStates.get('disarm');
      expect(buttonState.hasError).toBe(false);
    });

    it('should clear previous error state when button is clicked again', async () => {
      await setupCard();

      // First call fails
      mockCallService.mockRejectedValueOnce(new Error('Service call failed'));
      await (element as any)._handleControlButtonClick('disarm');

      // Verify error state is set
      let buttonState = (element as any).buttonStates.get('disarm');
      expect(buttonState.hasError).toBe(true);

      // Second call succeeds
      mockCallService.mockResolvedValueOnce({});
      await (element as any)._handleControlButtonClick('disarm');

      // Verify error state is cleared
      buttonState = (element as any).buttonStates.get('disarm');
      expect(buttonState.hasError).toBe(false);
    });
  });

  describe('Error state clears after 3 seconds', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should clear error state after 3 seconds', async () => {
      await setupCard();

      // Make service call fail
      mockCallService.mockRejectedValue(new Error('Service call failed'));

      // Trigger the button click handler
      await (element as any)._handleControlButtonClick('disarm');

      // Check error state is set
      let buttonState = (element as any).buttonStates.get('disarm');
      expect(buttonState.hasError).toBe(true);

      // Advance time by 3 seconds
      jest.advanceTimersByTime(3000);

      // Check error state is cleared
      buttonState = (element as any).buttonStates.get('disarm');
      expect(buttonState.hasError).toBe(false);
    });

    it('should not clear error state before 3 seconds', async () => {
      await setupCard();

      // Make service call fail
      mockCallService.mockRejectedValue(new Error('Service call failed'));

      // Trigger the button click handler
      await (element as any)._handleControlButtonClick('disarm');

      // Check error state is set
      let buttonState = (element as any).buttonStates.get('disarm');
      expect(buttonState.hasError).toBe(true);

      // Advance time by 2.9 seconds
      jest.advanceTimersByTime(2900);

      // Check error state is still set
      buttonState = (element as any).buttonStates.get('disarm');
      expect(buttonState.hasError).toBe(true);
    });
  });

  describe('Button state management', () => {
    it('should initialize button states for all actions', async () => {
      await setupCard();

      const buttonStates = (element as any).buttonStates;

      expect(buttonStates.has('disarm')).toBe(true);
      expect(buttonStates.has('arm_home')).toBe(true);
      expect(buttonStates.has('arm_away')).toBe(true);
    });

    it('should have correct initial state for all buttons', async () => {
      await setupCard();

      const buttonStates = (element as any).buttonStates;

      for (const [, state] of buttonStates) {
        expect(state.isActive).toBe(false);
        expect(state.isLoading).toBe(false);
        expect(state.isDisabled).toBe(false);
        expect(state.hasError).toBe(false);
      }
    });

    it('should update only the clicked button state', async () => {
      await setupCard();

      // Create a promise that we can control
      let resolveService: () => void;
      const servicePromise = new Promise<void>(resolve => {
        resolveService = resolve;
      });
      mockCallService.mockReturnValue(servicePromise);

      // Start the button click (don't await)
      const clickPromise = (element as any)._handleControlButtonClick('disarm');

      // Check only disarm button is loading
      expect((element as any).buttonStates.get('disarm').isLoading).toBe(true);
      expect((element as any).buttonStates.get('arm_home').isLoading).toBe(
        false
      );
      expect((element as any).buttonStates.get('arm_away').isLoading).toBe(
        false
      );

      // Resolve the service call
      resolveService!();
      await clickPromise;
    });
  });
});
