/**
 * VacationButtonManager - Utility module for managing vacation button logic
 * Handles vacation toggle state, display properties, and service mappings
 */

/**
 * Interface for vacation button state
 */
export interface VacationButtonState {
  /** true when input_boolean is "on" */
  isActive: boolean;
  /** true during service call */
  isLoading: boolean;
  /** true after failed service call */
  hasError: boolean;
  /** true when entity unavailable */
  isDisabled: boolean;
}

/**
 * Interface for vacation button display properties
 */
export interface VacationButtonDisplay {
  /** Button label text */
  label: string;
  /** MDI icon name */
  icon: string;
  /** CSS variable for active state color */
  activeColor: string;
}

/**
 * VacationButtonManager class for managing vacation button logic
 */
export class VacationButtonManager {
  /**
   * Get display properties for the vacation button
   * @returns Display properties including label, icon, and active color
   */
  static getDisplayProperties(): VacationButtonDisplay {
    return {
      label: 'Vacation',
      icon: 'mdi:beach',
      activeColor: '--info-color',
    };
  }

  /**
   * Determine if vacation mode is active based on entity state
   * @param entityState - The state string from the input_boolean entity
   * @returns true if vacation mode is active (state is "on")
   */
  static isVacationActive(entityState: string | undefined): boolean {
    return entityState === 'on';
  }

  /**
   * Get the service to call for toggling vacation mode
   * @param currentState - Current state of the input_boolean
   * @returns Service name: "turn_on" or "turn_off"
   */
  static getToggleService(currentState: string | undefined): string {
    return currentState === 'on' ? 'turn_off' : 'turn_on';
  }

  /**
   * Validate that an entity ID is a valid input_boolean
   * @param entityId - The entity ID to validate
   * @returns true if valid input_boolean format
   */
  static isValidVacationEntity(entityId: string): boolean {
    if (!entityId || typeof entityId !== 'string') {
      return false;
    }

    if (!entityId.startsWith('input_boolean.')) {
      return false;
    }

    const entityName = entityId.split('.')[1];
    if (!entityName) {
      return false;
    }

    // Entity name must start with letter or underscore, contain only alphanumeric and underscores
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(entityName);
  }

  /**
   * Create an initial vacation button state
   * @returns Default vacation button state
   */
  static createInitialState(): VacationButtonState {
    return {
      isActive: false,
      isLoading: false,
      hasError: false,
      isDisabled: false,
    };
  }

  /**
   * Create a vacation button state from entity state
   * @param entityState - The state string from the input_boolean entity
   * @param isUnavailable - Whether the entity is unavailable
   * @returns VacationButtonState based on entity state
   */
  static createStateFromEntity(
    entityState: string | undefined,
    isUnavailable: boolean = false
  ): VacationButtonState {
    return {
      isActive: VacationButtonManager.isVacationActive(entityState),
      isLoading: false,
      hasError: false,
      isDisabled: isUnavailable || entityState === undefined,
    };
  }
}
