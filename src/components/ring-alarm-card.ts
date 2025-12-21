/**
 * Ring Alarm Card Component
 * 
 * A custom Lovelace card that provides a foundation for Ring alarm system integration.
 * Currently displays a basic "Hello World" message and implements all required
 * Lovelace card interface methods.
 */

import { LitElement, html, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { HomeAssistant, LovelaceCard, RingAlarmCardConfig } from '../types';
import { ConfigurationManager } from '../config/configuration-manager';
import { cardStyles } from '../styles/card-styles';
import { hasRelevantStateChanges, getHassStatus } from '../utils/hass-utils';

@customElement('ring-alarm-card')
export class RingAlarmCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: RingAlarmCardConfig;

  /**
   * Lit component styles using CSS-in-JS
   */
  static override styles = cardStyles;

  /**
   * Set the card configuration
   * Required by Lovelace card interface
   */
  public setConfig(config: RingAlarmCardConfig): void {
    try {
      ConfigurationManager.validateConfig(config);
      this.config = ConfigurationManager.mergeConfig(config);
    } catch (error) {
      throw new Error(`Ring Alarm Card configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

    // Log HASS updates for debugging (can be removed in production)
    if (oldHass && oldHass !== this.hass) {
      // Check for state changes that might affect this card
      const hasStateChanges = hasRelevantStateChanges(oldHass, this.hass);
      
      if (hasStateChanges) {
        // Trigger re-render for state changes
        this.requestUpdate();
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
        ${this.config.title ? html`<div class="title">${this.config.title}</div>` : ''}
        <div class="content">
          <div class="hello-world">
            Hello World
          </div>
          ${hassStatus !== 'connected' ? html`
            <div class="hass-status">
              <small>Home Assistant: ${hassStatus}</small>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}