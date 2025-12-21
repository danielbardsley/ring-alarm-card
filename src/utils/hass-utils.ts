/**
 * Utility functions for Home Assistant integration
 */

import { HomeAssistant, HassEntity } from '../types';

/**
 * Checks if there are relevant state changes that affect the card
 * @param oldHass - Previous HASS object
 * @param newHass - New HASS object
 * @param entityIds - Optional array of specific entity IDs to monitor
 * @returns True if there are relevant changes
 */
export function hasRelevantStateChanges(
  oldHass: HomeAssistant,
  newHass: HomeAssistant,
  entityIds?: string[]
): boolean {
  // If specific entities are provided, only check those
  if (entityIds && entityIds.length > 0) {
    return entityIds.some(entityId =>
      hasEntityStateChanged(oldHass, newHass, entityId)
    );
  }

  // Fallback to general state count check
  const oldStateCount = Object.keys(oldHass.states || {}).length;
  const newStateCount = Object.keys(newHass.states || {}).length;

  if (oldStateCount !== newStateCount) {
    return true;
  }

  return false;
}

/**
 * Gets the state of a specific entity
 * @param hass - HASS object
 * @param entityId - Entity ID to get state for
 * @returns Entity state object or undefined if not found
 */
export function getEntityState(
  hass: HomeAssistant,
  entityId: string
): HassEntity | undefined {
  if (!hass?.states) {
    return undefined;
  }

  return hass.states[entityId];
}

/**
 * Checks if a specific entity's state has changed
 * @param oldHass - Previous HASS object
 * @param newHass - New HASS object
 * @param entityId - Entity ID to check
 * @returns True if the entity state changed
 */
export function hasEntityStateChanged(
  oldHass: HomeAssistant,
  newHass: HomeAssistant,
  entityId: string
): boolean {
  const oldEntity = getEntityState(oldHass, entityId);
  const newEntity = getEntityState(newHass, entityId);

  // If entity availability changed
  if (!oldEntity && newEntity) return true;
  if (oldEntity && !newEntity) return true;
  if (!oldEntity && !newEntity) return false;

  // Check if state or last_updated changed
  return (
    oldEntity!.state !== newEntity!.state ||
    oldEntity!.last_updated !== newEntity!.last_updated
  );
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

/**
 * Checks if an entity is available in Home Assistant
 * @param hass - HASS object
 * @param entityId - Entity ID to check
 * @returns True if entity exists and is available
 */
export function isEntityAvailable(
  hass: HomeAssistant,
  entityId: string
): boolean {
  const entity = getEntityState(hass, entityId);
  return entity !== undefined && entity.state !== 'unavailable';
}

/**
 * Extracts the domain from an entity ID
 * @param entityId - Entity ID (e.g., "alarm_control_panel.ring_alarm")
 * @returns Domain part (e.g., "alarm_control_panel")
 */
export function getEntityDomain(entityId: string): string {
  const parts = entityId.split('.');
  return parts[0] || '';
}

/**
 * Validates that an entity is a valid alarm control panel entity
 * @param hass - HASS object
 * @param entityId - Entity ID to validate
 * @returns Validation result with success flag and error message
 */
export function validateAlarmEntity(
  hass: HomeAssistant,
  entityId: string
): { isValid: boolean; error?: string } {
  // Check if entity ID format is valid
  if (!entityId || typeof entityId !== 'string') {
    return { isValid: false, error: 'Entity ID must be a non-empty string' };
  }

  // Check if entity ID has proper format
  if (!entityId.includes('.')) {
    return {
      isValid: false,
      error: 'Entity ID must be in format "domain.entity_name"',
    };
  }

  // Check if domain is alarm_control_panel
  const domain = getEntityDomain(entityId);
  if (domain !== 'alarm_control_panel') {
    return {
      isValid: false,
      error: `Entity must be an alarm_control_panel, got "${domain}"`,
    };
  }

  // Check if entity exists in HASS
  const entity = getEntityState(hass, entityId);
  if (!entity) {
    return {
      isValid: false,
      error: `Entity "${entityId}" not found in Home Assistant`,
    };
  }

  // Check if entity is available
  if (entity.state === 'unavailable') {
    return {
      isValid: false,
      error: `Entity "${entityId}" is currently unavailable`,
    };
  }

  return { isValid: true };
}
