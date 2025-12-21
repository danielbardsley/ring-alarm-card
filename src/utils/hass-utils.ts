/**
 * Utility functions for Home Assistant integration
 */

import { HomeAssistant } from '../types';

/**
 * Checks if there are relevant state changes that affect the card
 * @param oldHass - Previous HASS object
 * @param newHass - New HASS object
 * @returns True if there are relevant changes
 */
export function hasRelevantStateChanges(oldHass: HomeAssistant, newHass: HomeAssistant): boolean {
  // For now, we don't track specific entities, but this method provides
  // a foundation for future entity-specific monitoring
  
  // Check if the number of states changed
  const oldStateCount = Object.keys(oldHass.states || {}).length;
  const newStateCount = Object.keys(newHass.states || {}).length;
  
  if (oldStateCount !== newStateCount) {
    return true;
  }
  
  // In a real implementation, we would check specific entities
  // that this card cares about. For now, return false to avoid
  // unnecessary re-renders
  return false;
}

/**
 * Gets the current HASS connection status
 * @param hass - HASS object
 * @returns Status string for display
 */
export function getHassStatus(hass?: HomeAssistant): string {
  if (!hass) {
    return 'not connected';
  }
  
  if (!hass.states) {
    return 'connecting';
  }
  
  return 'connected';
}