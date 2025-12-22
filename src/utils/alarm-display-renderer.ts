/**
 * AlarmDisplayRenderer - Utility module for rendering alarm status and error states
 * Provides functions to render alarm states with proper accessibility and styling
 */

import { html, TemplateResult } from 'lit';
import { AlarmState, RingAlarmCardConfig, ControlButtonState } from '@/types';
import {
  AlarmControlManager,
  ControlAction,
  ControlActionType,
} from './alarm-control-manager';
import {
  VacationButtonManager,
  VacationButtonState,
} from './vacation-button-manager';

export class AlarmDisplayRenderer {
  /**
   * Render alarm status with icon and optional text
   * @param alarmState - The current alarm state
   * @param config - Card configuration
   * @returns TemplateResult for alarm status display
   */
  static renderAlarmStatus(
    alarmState: AlarmState,
    config: RingAlarmCardConfig
  ): TemplateResult {
    const stateClass = `alarm-${alarmState.state}`;
    const compactClass = config.compact_mode ? 'compact' : '';
    const showText = config.show_state_text !== false; // Default to true

    return html`
      <div
        class="alarm-status ${stateClass} ${compactClass}"
        role="status"
        aria-label="Alarm system status: ${alarmState.label}"
        aria-live="polite"
      >
        <ha-icon
          icon="${alarmState.icon}"
          class="alarm-icon"
          aria-hidden="true"
          style="color: var(${alarmState.color})"
        ></ha-icon>
        ${showText
          ? html`
              <span
                class="alarm-text"
                aria-label="Current state: ${alarmState.label}"
              >
                ${alarmState.label}
              </span>
            `
          : ''}
      </div>
    `;
  }

  /**
   * Render error state with icon and message
   * @param error - Error message to display
   * @returns TemplateResult for error display
   */
  static renderErrorState(error: string): TemplateResult {
    return html`
      <div class="alarm-error" role="alert" aria-label="Error: ${error}">
        <div class="alarm-error-message">
          <ha-icon
            icon="mdi:alert-circle"
            class="alarm-error-icon"
            aria-hidden="true"
          ></ha-icon>
          ${error}
        </div>
      </div>
    `;
  }

  /**
   * Render loading state with spinner
   * @returns TemplateResult for loading display
   */
  static renderLoadingState(): TemplateResult {
    return html`
      <div
        class="alarm-loading"
        role="status"
        aria-label="Loading alarm status"
        aria-live="polite"
      >
        <ha-icon
          icon="mdi:loading"
          class="alarm-loading-icon"
          aria-hidden="true"
        ></ha-icon>
        <span>Loading...</span>
      </div>
    `;
  }

  /**
   * Render specific error for entity not found
   * @param entityId - The entity ID that was not found
   * @returns TemplateResult for entity not found error
   */
  static renderEntityNotFound(entityId: string): TemplateResult {
    const message = `Entity not found: ${entityId}`;
    const helpText = html`
      <div style="margin-top: 8px; font-size: 0.9em; opacity: 0.8;">
        <div>Please check:</div>
        <ul style="margin: 4px 0; padding-left: 16px;">
          <li>The entity exists in Home Assistant</li>
          <li>The Ring integration is properly configured</li>
          <li>The entity ID is spelled correctly</li>
        </ul>
        <div style="margin-top: 4px;">
          <strong>Example:</strong> <code>alarm_control_panel.ring_alarm</code>
        </div>
      </div>
    `;

    return html`
      <div
        class="alarm-error"
        role="alert"
        aria-label="Entity not found error: ${entityId}"
      >
        <div class="alarm-error-message">
          <ha-icon
            icon="mdi:alert-circle-outline"
            class="alarm-error-icon"
            aria-hidden="true"
          ></ha-icon>
          <div>
            <div style="font-weight: 500;">${message}</div>
            ${helpText}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render specific error for entity unavailable
   * @param entityId - The entity ID that is unavailable
   * @returns TemplateResult for entity unavailable error
   */
  static renderEntityUnavailable(entityId: string): TemplateResult {
    const message = `Entity unavailable: ${entityId}`;
    const helpText = html`
      <div style="margin-top: 8px; font-size: 0.9em; opacity: 0.8;">
        <div>This may be temporary. Please check:</div>
        <ul style="margin: 4px 0; padding-left: 16px;">
          <li>Your Ring device is online</li>
          <li>The Ring integration is working</li>
          <li>Your internet connection is stable</li>
        </ul>
        <div style="margin-top: 4px;">
          The card will automatically recover when the entity becomes available.
        </div>
      </div>
    `;

    return html`
      <div
        class="alarm-error"
        role="alert"
        aria-label="Entity unavailable: ${entityId}"
      >
        <div class="alarm-error-message">
          <ha-icon
            icon="mdi:wifi-off"
            class="alarm-error-icon"
            aria-hidden="true"
          ></ha-icon>
          <div>
            <div style="font-weight: 500;">${message}</div>
            ${helpText}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render specific error for wrong entity domain
   * @param entityId - The entity ID with wrong domain
   * @param actualDomain - The actual domain found
   * @returns TemplateResult for wrong domain error
   */
  static renderWrongEntityDomain(
    entityId: string,
    actualDomain: string
  ): TemplateResult {
    const message = `Wrong entity type: ${entityId}`;
    const helpText = html`
      <div style="margin-top: 8px; font-size: 0.9em; opacity: 0.8;">
        <div>Found domain: <code>${actualDomain}</code></div>
        <div>Expected domain: <code>alarm_control_panel</code></div>
        <div style="margin-top: 4px;">
          Please use an alarm_control_panel entity from your Ring integration.
        </div>
        <div style="margin-top: 4px;">
          <strong>Example:</strong> <code>alarm_control_panel.ring_alarm</code>
        </div>
      </div>
    `;

    return html`
      <div
        class="alarm-error"
        role="alert"
        aria-label="Wrong entity domain: ${entityId}"
      >
        <div class="alarm-error-message">
          <ha-icon
            icon="mdi:alert-octagon"
            class="alarm-error-icon"
            aria-hidden="true"
          ></ha-icon>
          <div>
            <div style="font-weight: 500;">${message}</div>
            ${helpText}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render configuration error with helpful guidance
   * @param error - Configuration error message
   * @returns TemplateResult for configuration error
   */
  static renderConfigurationError(error: string): TemplateResult {
    const helpText = html`
      <div style="margin-top: 8px; font-size: 0.9em; opacity: 0.8;">
        <div><strong>Example configuration:</strong></div>
        <pre
          style="background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px; margin: 4px 0; font-size: 0.8em;"
        >
type: custom:ring-alarm-card
entity: alarm_control_panel.ring_alarm
title: "My Ring Alarm"
show_state_text: true
compact_mode: false</pre
        >
      </div>
    `;

    return html`
      <div class="alarm-error" role="alert" aria-label="Configuration error">
        <div class="alarm-error-message">
          <ha-icon
            icon="mdi:cog-off"
            class="alarm-error-icon"
            aria-hidden="true"
          ></ha-icon>
          <div>
            <div style="font-weight: 500;">Configuration Error</div>
            <div style="margin-top: 4px;">${error}</div>
            ${helpText}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render the control buttons row
   * @param alarmState - The current alarm state (undefined if unavailable)
   * @param buttonStates - Map of button states for each action type
   * @param onButtonClick - Callback function when a button is clicked
   * @param liveAnnouncement - Optional announcement for ARIA live region
   * @returns TemplateResult for control buttons row
   */
  static renderControlButtons(
    alarmState: AlarmState | undefined,
    buttonStates: Map<ControlActionType, ControlButtonState>,
    onButtonClick: (action: ControlActionType) => void,
    liveAnnouncement?: string
  ): TemplateResult {
    const actions = AlarmControlManager.getControlActions();
    const activeAction = alarmState
      ? AlarmControlManager.getActiveAction(alarmState.state)
      : null;
    const controlsDisabled = AlarmControlManager.areControlsDisabled(
      alarmState?.state
    );

    return html`
      <div
        class="control-buttons"
        role="group"
        aria-label="Alarm control buttons"
      >
        ${actions.map(action => {
          const buttonState = buttonStates.get(action.type) || {
            isActive: false,
            isLoading: false,
            isDisabled: false,
            hasError: false,
          };

          // Merge computed state with provided state
          const computedState: ControlButtonState = {
            isActive: activeAction === action.type,
            isLoading: buttonState.isLoading,
            isDisabled: controlsDisabled || buttonState.isDisabled,
            hasError: buttonState.hasError,
          };

          // Add optional transition properties if present
          if (buttonState.isTransitionTarget !== undefined) {
            computedState.isTransitionTarget = buttonState.isTransitionTarget;
          }
          if (buttonState.transitionProgress !== undefined) {
            computedState.transitionProgress = buttonState.transitionProgress;
          }
          if (buttonState.transitionRemainingSeconds !== undefined) {
            computedState.transitionRemainingSeconds =
              buttonState.transitionRemainingSeconds;
          }

          return AlarmDisplayRenderer.renderControlButton(
            action,
            computedState,
            () => onButtonClick(action.type)
          );
        })}
        ${AlarmDisplayRenderer.renderLiveRegion(liveAnnouncement)}
      </div>
    `;
  }

  /**
   * Render ARIA live region for state announcements
   * @param announcement - The announcement text to display
   * @returns TemplateResult for ARIA live region
   */
  static renderLiveRegion(announcement?: string): TemplateResult {
    return html`
      <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
        ${announcement || ''}
      </div>
    `;
  }

  /**
   * Generate announcement text for transitional state changes
   * @param alarmState - The current alarm state
   * @param targetAction - The target action for the transition
   * @returns Announcement text for screen readers
   */
  static generateTransitionAnnouncement(
    alarmState: AlarmState['state'],
    targetAction: ControlActionType | null
  ): string {
    if (!targetAction) {
      return '';
    }

    const actionLabels: Record<ControlActionType, string> = {
      disarm: 'disarmed mode',
      arm_home: 'home mode',
      arm_away: 'away mode',
    };

    const targetLabel = actionLabels[targetAction];

    switch (alarmState) {
      case 'arming':
        return `Alarm arming to ${targetLabel}`;
      case 'pending':
        return `Alarm entry delay active, currently in ${targetLabel}`;
      case 'disarming':
        return `Alarm disarming`;
      default:
        return '';
    }
  }

  /**
   * Render a single control button
   * @param action - The control action definition
   * @param state - The button's current state
   * @param onClick - Callback function when button is clicked
   * @returns TemplateResult for a single control button
   */
  static renderControlButton(
    action: ControlAction,
    state: ControlButtonState,
    onClick: () => void
  ): TemplateResult {
    // Build CSS classes based on state
    const classes: string[] = ['control-button'];

    if (state.isActive) {
      classes.push('active', action.type);
    } else {
      classes.push('inactive');
    }

    if (state.isLoading) {
      classes.push('loading');
    }

    if (state.isDisabled) {
      classes.push('disabled');
    }

    if (state.hasError) {
      classes.push('error');
    }

    // Add transitioning class when button is transition target
    if (state.isTransitionTarget) {
      classes.push('transitioning', action.type);
    }

    // Generate ARIA label based on action type and transition state
    const ariaLabel = AlarmDisplayRenderer.generateAriaLabel(action, state);

    // Determine icon - use loading icon if loading
    const icon = state.isLoading ? 'mdi:loading' : action.icon;

    // Handle click - only if not disabled and not loading
    const handleClick = () => {
      if (!state.isDisabled && !state.isLoading) {
        onClick();
      }
    };

    // Build inline styles for progress indicator
    const progressPercent = state.transitionProgress ?? 0;
    const progressStyle = state.isTransitionTarget
      ? `--progress-percent: ${progressPercent};`
      : '';

    return html`
      <button
        class="${classes.join(' ')}"
        style="${progressStyle}"
        aria-label="${ariaLabel}"
        aria-pressed="${state.isActive ? 'true' : 'false'}"
        aria-disabled="${state.isDisabled ? 'true' : 'false'}"
        ?disabled="${state.isDisabled}"
        @click="${handleClick}"
      >
        <ha-icon
          class="control-button-icon"
          icon="${icon}"
          aria-hidden="true"
        ></ha-icon>
        <span class="control-button-label">${action.label}</span>
      </button>
    `;
  }

  /**
   * Generate ARIA label for a control button
   * Includes countdown status when button is transitioning
   * @param action - The control action definition
   * @param state - The button's current state
   * @returns ARIA label string
   */
  static generateAriaLabel(
    action: ControlAction,
    state: ControlButtonState
  ): string {
    // Base ARIA labels for each action type
    const baseAriaLabels: Record<ControlActionType, string> = {
      disarm: 'Set alarm to disarmed',
      arm_home: 'Arm alarm in home mode',
      arm_away: 'Arm alarm in away mode',
    };

    const baseLabel = baseAriaLabels[action.type];

    // If transitioning, include countdown status
    if (
      state.isTransitionTarget &&
      state.transitionRemainingSeconds !== undefined
    ) {
      const seconds = Math.ceil(state.transitionRemainingSeconds);
      const actionLabel =
        action.type === 'disarm'
          ? 'Disarming'
          : action.type === 'arm_home'
            ? 'Arming home'
            : 'Arming away';
      return `${actionLabel} - ${seconds} second${seconds !== 1 ? 's' : ''} remaining`;
    }

    return baseLabel;
  }

  /**
   * Render the vacation button
   * @param vacationState - Current vacation button state
   * @param onClick - Callback when button is clicked
   * @returns TemplateResult for vacation button
   */
  static renderVacationButton(
    vacationState: VacationButtonState,
    onClick: () => void
  ): TemplateResult {
    const displayProps = VacationButtonManager.getDisplayProperties();

    // Build CSS classes based on state
    const classes: string[] = ['control-button'];

    if (vacationState.isActive) {
      classes.push('active', 'vacation');
    } else {
      classes.push('inactive');
    }

    if (vacationState.isLoading) {
      classes.push('loading');
    }

    if (vacationState.isDisabled) {
      classes.push('disabled');
    }

    if (vacationState.hasError) {
      classes.push('error');
    }

    // Generate ARIA label
    const ariaLabel = vacationState.isActive
      ? 'Vacation mode is on. Click to turn off.'
      : 'Vacation mode is off. Click to turn on.';

    // Determine icon - use loading icon if loading
    const icon = vacationState.isLoading ? 'mdi:loading' : displayProps.icon;

    // Handle click - only if not disabled and not loading
    const handleClick = () => {
      if (!vacationState.isDisabled && !vacationState.isLoading) {
        onClick();
      }
    };

    return html`
      <button
        class="${classes.join(' ')}"
        aria-label="${ariaLabel}"
        aria-pressed="${vacationState.isActive ? 'true' : 'false'}"
        aria-disabled="${vacationState.isDisabled ? 'true' : 'false'}"
        ?disabled="${vacationState.isDisabled}"
        @click="${handleClick}"
      >
        <ha-icon
          class="control-button-icon"
          icon="${icon}"
          aria-hidden="true"
        ></ha-icon>
        <span class="control-button-label">${displayProps.label}</span>
      </button>
    `;
  }

  /**
   * Render control buttons row with optional vacation button
   * @param alarmState - The current alarm state (undefined if unavailable)
   * @param buttonStates - Map of button states for each action type
   * @param vacationState - Vacation button state (null if not configured)
   * @param onAlarmButtonClick - Callback function when an alarm button is clicked
   * @param onVacationClick - Callback function when vacation button is clicked
   * @param liveAnnouncement - Optional announcement for ARIA live region
   * @returns TemplateResult for control buttons row with optional vacation button
   */
  static renderControlButtonsWithVacation(
    alarmState: AlarmState | undefined,
    buttonStates: Map<ControlActionType, ControlButtonState>,
    vacationState: VacationButtonState | null,
    onAlarmButtonClick: (action: ControlActionType) => void,
    onVacationClick: () => void,
    liveAnnouncement?: string
  ): TemplateResult {
    const actions = AlarmControlManager.getControlActions();
    const activeAction = alarmState
      ? AlarmControlManager.getActiveAction(alarmState.state)
      : null;
    const controlsDisabled = AlarmControlManager.areControlsDisabled(
      alarmState?.state
    );

    return html`
      <div
        class="control-buttons"
        role="group"
        aria-label="Alarm control buttons"
      >
        ${actions.map(action => {
          const buttonState = buttonStates.get(action.type) || {
            isActive: false,
            isLoading: false,
            isDisabled: false,
            hasError: false,
          };

          // Merge computed state with provided state
          const computedState: ControlButtonState = {
            isActive: activeAction === action.type,
            isLoading: buttonState.isLoading,
            isDisabled: controlsDisabled || buttonState.isDisabled,
            hasError: buttonState.hasError,
          };

          // Add optional transition properties if present
          if (buttonState.isTransitionTarget !== undefined) {
            computedState.isTransitionTarget = buttonState.isTransitionTarget;
          }
          if (buttonState.transitionProgress !== undefined) {
            computedState.transitionProgress = buttonState.transitionProgress;
          }
          if (buttonState.transitionRemainingSeconds !== undefined) {
            computedState.transitionRemainingSeconds =
              buttonState.transitionRemainingSeconds;
          }

          return AlarmDisplayRenderer.renderControlButton(
            action,
            computedState,
            () => onAlarmButtonClick(action.type)
          );
        })}
        ${vacationState !== null
          ? AlarmDisplayRenderer.renderVacationButton(
              vacationState,
              onVacationClick
            )
          : ''}
        ${AlarmDisplayRenderer.renderLiveRegion(liveAnnouncement)}
      </div>
    `;
  }
}
