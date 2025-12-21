/**
 * Card registration utilities for Home Assistant integration
 */

/**
 * Registers the card with Home Assistant's custom cards registry
 */
export function registerCard(): void {
  // Add to Home Assistant's custom cards registry with enhanced metadata
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'ring-alarm-card',
    name: 'Ring Alarm Card',
    description: 'A custom card for Ring alarm systems',
    preview: true, // Indicates this card supports preview mode
    documentationURL: 'https://github.com/your-repo/ring-alarm-card#readme',
    version: '0.1.0'
  });
}

// Global type declarations
declare global {
  interface HTMLElementTagNameMap {
    'ring-alarm-card': import('../components/ring-alarm-card').RingAlarmCard;
  }
  
  interface Window {
    customCards?: any[];
  }
}