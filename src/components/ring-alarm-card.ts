/**
 * Ring Alarm Card Component
 *
 * A custom Lovelace card that provides a foundation for Ring alarm system integration.
 * Currently displays a basic "Hello World" message and implements all required
 * Lovelace card interface methods.
 */

import { LitElement, html, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type {
  HomeAssistant,
  LovelaceCard,
  RingAlarmCardConfig,
  AlarmState,
  ControlButtonState,
  TransitionState,
} from '../types';
import type { ControlActionType } from '../utils/alarm-control-manager';
import { ConfigurationManager } from '../config/configuration-manager';
import { AlarmStateManager } from '../utils/alarm-state-manager';
import { AlarmDisplayRenderer } from '../utils/alarm-display-renderer';
import { AlarmControlManager } from '../utils/alarm-control-manager';
import { TransitionStateManager } from '../utils/transition-state-manager';
import { cardStyles } from '../styles/card-styles';
import { getHassStatus, hasEntityStateChanged } from '../utils/hass-utils';

@customElement('ring-alarm-card')
export class RingAlarmCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: RingAlarmCardConfig;
  @state() private alarmState: AlarmState | undefined;
  @state() private entityError: string | undefined;
  @state() private buttonStates: Map<ControlActionType, ControlButtonState> =
    new Map();
  @state() private transitionState: TransitionState =
    TransitionStateManager.createEmptyState();

  /**
   * Track the total duration when a transition starts
   * This is captured from the initial exitSecondsLeft value
   */
  private _transitionTotalDuration: number = 0;

  /**
   * Track the last action clicked by the user
   * Used to determine transition target when entity attributes don't provide it
   */
  private _lastClickedAction: ControlActionType | null = null;

  /**
   * Lit component styles using CSS-in-JS
   */
  static override styles = cardStyles;

  /**
   * Initialize button states for all control actions
   */
  private _initializeButtonStates(): void {
    const actions = AlarmControlManager.getControlActions();
    const newButtonStates = new Map<ControlActionType, ControlButtonState>();

    for (const action of actions) {
      newButtonStates.set(action.type, {
        isActive: false,
        isLoading: false,
        isDisabled: false,
        hasError: false,
      });
    }

    this.buttonStates = newButtonStates;
  }

  /**
   * Lifecycle callback when element is connected to DOM
   */
  override connectedCallback(): void {
    // Call super only if it exists (may not in test environments)
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this._initializeButtonStates();
  }

  /**
   * Update the state of a specific button
   * @param action - The action type to update
   * @param state - Partial state to merge with existing state
   */
  private _updateButtonState(
    action: ControlActionType,
    state: Partial<ControlButtonState>
  ): void {
    const currentState = this.buttonStates.get(action) || {
      isActive: false,
      isLoading: false,
      isDisabled: false,
      hasError: false,
    };

    const newButtonStates = new Map(this.buttonStates);
    newButtonStates.set(action, { ...currentState, ...state });
    this.buttonStates = newButtonStates;
  }

  /**
   * Clear error state on a button after a delay
   * @param action - The action type to clear error for
   */
  private _clearButtonError(action: ControlActionType): void {
    setTimeout(() => {
      this._updateButtonState(action, { hasError: false });
    }, 3000);
  }

  /**
   * Handle control button click - call Home Assistant service
   * @param action - The action type that was clicked
   */
  private async _handleControlButtonClick(
    action: ControlActionType
  ): Promise<void> {
    if (!this.hass || !this.config?.entity) {
      return;
    }

    // Track the last clicked action for transition target detection
    this._lastClickedAction = action;

    // Set loading state
    this._updateButtonState(action, { isLoading: true, hasError: false });

    try {
      // Get the service name for this action
      const service = AlarmControlManager.getServiceForAction(action);

      // Call the Home Assistant service
      await this.hass.callService('alarm_control_panel', service, {
        entity_id: this.config.entity,
      });

      // Success - clear loading state
      this._updateButtonState(action, { isLoading: false });
    } catch (error) {
      // Failure - set error state and schedule clear
      this._updateButtonState(action, { isLoading: false, hasError: true });
      this._clearButtonError(action);
    }
  }

  /**
   * Set the card configuration
   * Required by Lovelace card interface
   */
  public setConfig(config: RingAlarmCardConfig): void {
    // Validate basic configuration structure - this should throw for invalid configs
    ConfigurationManager.validateConfig(config);
    this.config = ConfigurationManager.mergeConfig(config);

    // Clear any previous errors
    this.entityError = undefined;
    this.alarmState = undefined;

    // If HASS is available, validate entity and initialize state
    if (this.hass) {
      this._validateAndInitializeEntity();
    }
  }

  /**
   * Get the card size for Lovelace layout
   * Required by Lovelace card interface
   */
  public getCardSize(): number {
    return 2; // Standard card height units
  }

  /**
   * Handle HASS object updates
   */
  protected override updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has('hass')) {
      this._handleHassUpdate(changedProps.get('hass'));
    }
  }

  /**
   * Handle HASS object changes with proper change detection
   * @param oldHass - Previous HASS object
   */
  private _handleHassUpdate(oldHass?: HomeAssistant): void {
    if (!this.hass) {
      return;
    }

    // If this is the first HASS update and we have config, validate entity
    if (!oldHass && this.config) {
      this._validateAndInitializeEntity();
      return;
    }

    if (oldHass && oldHass !== this.hass) {
      // Check for configured entity state changes
      if (this.config?.entity) {
        if (hasEntityStateChanged(oldHass, this.hass, this.config.entity)) {
          this._handleEntityStateChange();
        }
      }

      // Handle theme changes
      if (oldHass.selectedTheme !== this.hass.selectedTheme) {
        this._handleThemeChange();
      }
    }
  }

  /**
   * Handle theme changes
   */
  private _handleThemeChange(): void {
    // Theme changes are automatically handled by CSS custom properties
    // This method is available for future theme-specific logic
    this.requestUpdate();
  }

  /**
   * Handle entity state changes
   */
  private _handleEntityStateChange(): void {
    if (!this.config?.entity || !this.hass) {
      return;
    }

    const entity = this.hass.states[this.config.entity];

    // Handle entity becoming unavailable
    if (!entity) {
      this.entityError = `entity_not_found:${this.config.entity}`;
      this.alarmState = undefined;
      this._clearTransitionState();
      return;
    }

    if (entity.state === 'unavailable') {
      this.entityError = `entity_unavailable:${this.config.entity}`;
      this.alarmState = undefined;
      this._clearTransitionState();
      return;
    }

    // Entity is available - clear errors and update state
    if (AlarmStateManager.isValidAlarmEntity(entity)) {
      const previousState = this.alarmState?.state;
      this.alarmState = AlarmStateManager.mapEntityState(entity);
      this.entityError = undefined;

      // Handle transition state changes
      this._handleTransitionStateChange(
        this.alarmState.state,
        entity.attributes,
        previousState
      );
    } else {
      const domain = this.config.entity.split('.')[0];
      this.entityError = `wrong_domain:${this.config.entity}:${domain}`;
      this.alarmState = undefined;
      this._clearTransitionState();
    }
  }

  /**
   * Handle transition state changes
   * Detects when alarm enters/exits transitional states and manages progress
   * @param currentState - The current alarm state
   * @param entityAttributes - The entity attributes
   * @param previousState - The previous alarm state (if any)
   */
  private _handleTransitionStateChange(
    currentState: AlarmState['state'],
    entityAttributes: Record<string, unknown>,
    previousState?: AlarmState['state']
  ): void {
    const isCurrentlyTransitional =
      TransitionStateManager.isTransitionalState(currentState);
    const wasTransitional = previousState
      ? TransitionStateManager.isTransitionalState(previousState)
      : false;

    // Get exitSecondsLeft from entity attributes - Ring uses camelCase
    const exitSecondsLeft =
      (entityAttributes.exitSecondsLeft as number) ??
      (entityAttributes.exit_seconds_left as number) ??
      (entityAttributes.delay as number) ??
      (entityAttributes.seconds_left as number) ??
      0;

    if (isCurrentlyTransitional) {
      // Entering or continuing a transitional state
      let targetAction = TransitionStateManager.getTransitionTarget(
        currentState,
        entityAttributes
      );

      // Use last clicked action as fallback for arming states
      if (
        currentState === 'arming' &&
        targetAction === 'arm_away' &&
        this._lastClickedAction &&
        (this._lastClickedAction === 'arm_home' ||
          this._lastClickedAction === 'arm_away')
      ) {
        // If we have a recent click and the default is arm_away,
        // use the clicked action instead (more reliable)
        targetAction = this._lastClickedAction;
      }

      // Check if this is a new transition or a change in target
      const isNewTransition =
        !wasTransitional || previousState !== currentState;
      const targetChanged =
        this.transitionState.isTransitioning &&
        this.transitionState.targetAction !== targetAction;

      if (isNewTransition || targetChanged) {
        // Cancel any previous transition and start fresh
        // This handles rapid state changes by immediately applying the latest state
        this._transitionTotalDuration =
          TransitionStateManager.captureInitialDuration(exitSecondsLeft);
        this.transitionState = TransitionStateManager.createTransitionState(
          targetAction,
          exitSecondsLeft
        );
      } else {
        // Continuing in same transitional state - update progress
        const progress = TransitionStateManager.calculateProgress(
          exitSecondsLeft,
          this._transitionTotalDuration
        );

        this.transitionState = {
          ...this.transitionState,
          remainingSeconds: exitSecondsLeft,
          progress,
        };
      }
    } else if (wasTransitional) {
      // Exited transitional state - clear transition immediately
      this._clearTransitionState();
    }
  }

  /**
   * Clear the transition state
   */
  private _clearTransitionState(): void {
    this._transitionTotalDuration = 0;
    this._lastClickedAction = null;
    this.transitionState = TransitionStateManager.createEmptyState();
  }

  /**
   * Validate entity and initialize alarm state
   */
  private _validateAndInitializeEntity(): void {
    if (!this.config?.entity || !this.hass) {
      return;
    }

    try {
      // Validate entity exists and is correct domain
      ConfigurationManager.validateEntityExists(this.hass, this.config.entity);

      // Get entity and initialize alarm state
      const entity = this.hass.states[this.config.entity];
      if (entity && AlarmStateManager.isValidAlarmEntity(entity)) {
        this.alarmState = AlarmStateManager.mapEntityState(entity);
        this.entityError = undefined;

        // Initialize transition state if entity is in transitional state
        this._handleTransitionStateChange(
          this.alarmState.state,
          entity.attributes,
          undefined
        );
      } else {
        const domain = this.config.entity.split('.')[0];
        this.entityError = `wrong_domain:${this.config.entity}:${domain}`;
        this.alarmState = undefined;
        this._clearTransitionState();
      }
    } catch (error) {
      // Parse the error to provide specific error types
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown entity validation error';

      if (errorMessage.includes('not found')) {
        this.entityError = `entity_not_found:${this.config.entity}`;
      } else if (errorMessage.includes('unavailable')) {
        this.entityError = `entity_unavailable:${this.config.entity}`;
      } else if (errorMessage.includes('domain')) {
        const domain = this.config.entity.split('.')[0];
        this.entityError = `wrong_domain:${this.config.entity}:${domain}`;
      } else {
        this.entityError = errorMessage;
      }

      this.alarmState = undefined;
      this._clearTransitionState();
    }
  }

  /**
   * Render the card content
   * Required by LitElement
   */
  protected override render(): TemplateResult {
    if (!this.config) {
      return html`
        <div class="card">
          <div class="content">
            <p>Card configuration required</p>
          </div>
        </div>
      `;
    }

    // Check HASS availability for better integration feedback
    const hassStatus = getHassStatus(this.hass);

    return html`
      <div class="card">
        ${this.config.title
          ? html`<div class="title">${this.config.title}</div>`
          : ''}
        <div class="content">${this._renderMainContent(hassStatus)}</div>
      </div>
    `;
  }

  /**
   * Render the main content based on current state
   */
  private _renderMainContent(hassStatus: string): TemplateResult {
    // Show HASS connection issues first
    if (hassStatus !== 'connected') {
      return html`
        <div class="hass-status">
          <small>Home Assistant: ${hassStatus}</small>
        </div>
      `;
    }

    // Show entity error if present with specific error rendering
    if (this.entityError) {
      return this._renderSpecificError(this.entityError);
    }

    // Show loading state if entity not yet loaded
    if (!this.alarmState && this.config.entity) {
      return AlarmDisplayRenderer.renderLoadingState();
    }

    // Show alarm status and control buttons if available
    if (this.alarmState) {
      return html`
        ${AlarmDisplayRenderer.renderAlarmStatus(this.alarmState, this.config)}
        ${this._renderControlButtons()}
      `;
    }

    // Fallback - should not normally reach here
    return html`
      <div class="content">
        <p>No alarm data available</p>
      </div>
    `;
  }

  /**
   * Render control buttons when entity is valid and HASS is available
   */
  private _renderControlButtons(): TemplateResult {
    // Only render when entity is valid and HASS is available
    if (!this.hass || !this.config?.entity) {
      return html``;
    }

    // Create button states with transition properties
    const buttonStatesWithTransition = this._getButtonStatesWithTransition();

    // Generate live announcement for transitional states
    const liveAnnouncement = this.transitionState.isTransitioning
      ? AlarmDisplayRenderer.generateTransitionAnnouncement(
          this.alarmState?.state ?? 'unknown',
          this.transitionState.targetAction
        )
      : undefined;

    return AlarmDisplayRenderer.renderControlButtons(
      this.alarmState,
      buttonStatesWithTransition,
      (action: ControlActionType) => this._handleControlButtonClick(action),
      liveAnnouncement
    );
  }

  /**
   * Get button states with transition properties merged in
   * @returns Map of button states with transition information
   */
  private _getButtonStatesWithTransition(): Map<
    ControlActionType,
    ControlButtonState
  > {
    const newButtonStates = new Map<ControlActionType, ControlButtonState>();

    for (const [action, state] of this.buttonStates) {
      const isTransitionTarget =
        this.transitionState.isTransitioning &&
        this.transitionState.targetAction === action;

      if (isTransitionTarget) {
        newButtonStates.set(action, {
          ...state,
          isTransitionTarget: true,
          transitionProgress: this.transitionState.progress,
          transitionRemainingSeconds: this.transitionState.remainingSeconds,
        });
      } else {
        newButtonStates.set(action, {
          ...state,
          isTransitionTarget: false,
        });
      }
    }

    return newButtonStates;
  }

  /**
   * Render specific error types with appropriate messages
   */
  private _renderSpecificError(errorCode: string): TemplateResult {
    if (errorCode.startsWith('entity_not_found:')) {
      const entityId = errorCode.split(':')[1] ?? 'unknown';
      return AlarmDisplayRenderer.renderEntityNotFound(entityId);
    }

    if (errorCode.startsWith('entity_unavailable:')) {
      const entityId = errorCode.split(':')[1] ?? 'unknown';
      return AlarmDisplayRenderer.renderEntityUnavailable(entityId);
    }

    if (errorCode.startsWith('wrong_domain:')) {
      const parts = errorCode.split(':');
      const entityId = parts[1] ?? 'unknown';
      const actualDomain = parts[2] ?? 'unknown';
      return AlarmDisplayRenderer.renderWrongEntityDomain(
        entityId,
        actualDomain
      );
    }

    if (errorCode.startsWith('config_error:')) {
      const error = errorCode.substring('config_error:'.length);
      return AlarmDisplayRenderer.renderConfigurationError(error);
    }

    // Fallback for any other errors
    return AlarmDisplayRenderer.renderErrorState(errorCode);
  }
}
