/**
 * Configuration management utilities for Ring Alarm Card
 */

import { RingAlarmCardConfig, HomeAssistant } from '../types';

export class ConfigurationManager {
  /**
   * Validates the card configuration
   * @param config - The configuration object to validate
   * @throws Error if configuration is invalid
   */
  static validateConfig(config: RingAlarmCardConfig): void {
    if (!config || typeof config !== 'object') {
      throw new Error(
        'Ring Alarm Card configuration is required and must be an object. Please provide a valid configuration.'
      );
    }

    if (config.type !== 'custom:ring-alarm-card') {
      throw new Error(
        `Ring Alarm Card: Invalid card type "${config.type}". Expected "custom:ring-alarm-card". Please check your card configuration.`
      );
    }

    // Validate required entity field
    if (!config.entity) {
      throw new Error(
        'Ring Alarm Card: Entity field is required. Please specify an alarm_control_panel entity. Example: "entity: alarm_control_panel.ring_alarm"'
      );
    }

    if (typeof config.entity !== 'string') {
      throw new Error(
        `Ring Alarm Card: Entity field must be a string, but received ${typeof config.entity}. Example: "entity: alarm_control_panel.ring_alarm"`
      );
    }

    // Validate entity ID format matches alarm_control_panel.* pattern
    const entityPattern = /^alarm_control_panel\./;
    if (!entityPattern.test(config.entity)) {
      throw new Error(
        `Ring Alarm Card: Entity "${config.entity}" must be an alarm_control_panel entity. Expected format: "alarm_control_panel.your_alarm_name". Please check your Ring integration entities.`
      );
    }

    // Validate entity has a name after the domain
    const entityParts = config.entity.split('.');
    if (
      entityParts.length !== 2 ||
      !entityParts[1] ||
      entityParts[1].trim() === ''
    ) {
      throw new Error(
        `Ring Alarm Card: Entity "${config.entity}" is missing the entity name. Expected format: "alarm_control_panel.your_alarm_name". Please check your Ring integration entities.`
      );
    }

    // Validate entity name contains only valid characters (letters, numbers, underscores)
    const entityName = entityParts[1];
    const validEntityNamePattern = /^[a-zA-Z0-9_]+$/;
    if (!validEntityNamePattern.test(entityName)) {
      throw new Error(
        `Ring Alarm Card: Entity name "${entityName}" contains invalid characters. Entity names can only contain letters, numbers, and underscores. Example: "alarm_control_panel.ring_alarm"`
      );
    }

    // Reject entity names that start with a number (not valid in Home Assistant)
    if (/^\d/.test(entityName)) {
      throw new Error(
        `Ring Alarm Card: Entity name "${entityName}" cannot start with a number. Entity names must start with a letter or underscore. Example: "alarm_control_panel.ring_alarm"`
      );
    }

    // Reject entity names that are too short (less than 2 characters)
    if (entityName.length < 2) {
      throw new Error(
        `Ring Alarm Card: Entity name "${entityName}" is too short. Entity names must be at least 2 characters long. Example: "alarm_control_panel.ring_alarm"`
      );
    }

    // Validate optional boolean fields
    if (
      config.show_state_text !== undefined &&
      typeof config.show_state_text !== 'boolean'
    ) {
      throw new Error(
        `Ring Alarm Card: show_state_text must be true or false, but received ${typeof config.show_state_text}. Example: "show_state_text: true"`
      );
    }

    if (
      config.compact_mode !== undefined &&
      typeof config.compact_mode !== 'boolean'
    ) {
      throw new Error(
        `Ring Alarm Card: compact_mode must be true or false, but received ${typeof config.compact_mode}. Example: "compact_mode: false"`
      );
    }

    // Validate title if provided
    if (
      config.title !== undefined &&
      config.title !== null &&
      typeof config.title !== 'string'
    ) {
      throw new Error(
        `Ring Alarm Card: title must be a string, but received ${typeof config.title}. Example: "title: My Ring Alarm"`
      );
    }

    // Validate vacation_entity if provided
    if (config.vacation_entity !== undefined) {
      if (typeof config.vacation_entity !== 'string') {
        throw new Error(
          `Ring Alarm Card: vacation_entity must be a string, but received ${typeof config.vacation_entity}. Example: "vacation_entity: input_boolean.vacation_mode"`
        );
      }

      // Validate entity ID format matches input_boolean.* pattern
      if (!config.vacation_entity.startsWith('input_boolean.')) {
        throw new Error(
          `Ring Alarm Card: vacation_entity "${config.vacation_entity}" must be an input_boolean entity. Expected format: "input_boolean.vacation_mode". Please create an input_boolean helper in Home Assistant.`
        );
      }

      // Validate entity has a name after the domain
      const vacationEntityParts = config.vacation_entity.split('.');
      if (
        vacationEntityParts.length !== 2 ||
        !vacationEntityParts[1] ||
        vacationEntityParts[1].trim() === ''
      ) {
        throw new Error(
          `Ring Alarm Card: vacation_entity "${config.vacation_entity}" is missing the entity name. Expected format: "input_boolean.vacation_mode".`
        );
      }

      // Validate entity name contains only valid characters (letters, numbers, underscores)
      const vacationEntityName = vacationEntityParts[1];
      const validVacationEntityNamePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
      if (!validVacationEntityNamePattern.test(vacationEntityName)) {
        throw new Error(
          `Ring Alarm Card: vacation_entity name "${vacationEntityName}" contains invalid characters. Entity names must start with a letter or underscore and contain only letters, numbers, and underscores. Example: "input_boolean.vacation_mode"`
        );
      }
    }
  }

  /**
   * Validates that an entity exists in Home Assistant and is the correct domain
   * @param hass - Home Assistant object
   * @param entityId - Entity ID to validate
   * @throws Error if entity doesn't exist or is wrong domain
   */
  static validateEntityExists(hass: HomeAssistant, entityId: string): void {
    if (!hass || !hass.states) {
      throw new Error(
        'Home Assistant connection is not available. Please wait for Home Assistant to load completely.'
      );
    }

    const entity = hass.states[entityId];
    if (!entity) {
      throw new Error(`Entity "${entityId}" not found in Home Assistant. Please check:
• The entity exists in your Home Assistant
• The Ring integration is properly configured
• The entity ID is spelled correctly
• The entity is available (not disabled)`);
    }

    // Extract domain from entity ID
    const domain = entityId.split('.')[0];
    if (domain !== 'alarm_control_panel') {
      throw new Error(
        `Entity "${entityId}" has domain "${domain}" but must be an "alarm_control_panel" entity. Please check your Ring integration and ensure you're using the correct alarm entity.`
      );
    }

    // Check if entity is unavailable
    if (entity.state === 'unavailable') {
      throw new Error(`Entity "${entityId}" is currently unavailable. This may be temporary. Please check:
• Your Ring device is online
• The Ring integration is working properly
• Your internet connection is stable`);
    }
  }

  /**
   * Returns the default configuration values
   * @returns Default configuration object
   */
  static getDefaultConfig(): Partial<RingAlarmCardConfig> {
    return {
      title: 'Ring Alarm',
      show_state_text: true,
      compact_mode: false,
      // Note: entity field has no default - must be provided by user
    };
  }

  /**
   * Merges user configuration with defaults
   * @param config - User provided configuration
   * @returns Merged configuration with defaults applied
   */
  static mergeConfig(config: RingAlarmCardConfig): RingAlarmCardConfig {
    const defaults = this.getDefaultConfig();
    const merged = { ...defaults, ...config };

    // Handle undefined values by applying defaults
    if (merged.title === undefined) {
      merged.title = defaults.title as string;
    }

    if (merged.show_state_text === undefined) {
      merged.show_state_text = defaults.show_state_text as boolean;
    }

    if (merged.compact_mode === undefined) {
      merged.compact_mode = defaults.compact_mode as boolean;
    }

    return merged;
  }
}
