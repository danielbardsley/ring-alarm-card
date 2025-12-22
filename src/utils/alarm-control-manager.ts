/**
 * AlarmControlManager - Utility module for managing alarm control buttons
 * Handles control actions, button states, and service mappings
 */

import { AlarmState } from '@/types';

/**
 * Type for control action identifiers
 */
export type ControlActionType = 'disarm' | 'arm_home' | 'arm_away';

/**
 * Interface for a control action definition
 */
export interface ControlAction {
  type: ControlActionType;
  service: string;
  label: string;
  icon: string;
  activeColor: string;
}

/**
 * Interface for control button visual state
 */
export interface ControlButtonState {
  isActive: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  hasError: boolean;
}

/**
 * AlarmControlManager class for managing alarm control button logic
 */
export class AlarmControlManager {
  /**
   * Get the list of available control actions
   * @returns Array of control actions for disarm, arm_home, and arm_away
   */
  static getControlActions(): ControlAction[] {
    return [
      {
        type: 'disarm',
        service: 'alarm_disarm',
        label: 'Disarmed',
        icon: 'mdi:shield-off',
        activeColor: '--success-color',
      },
      {
        type: 'arm_home',
        service: 'alarm_arm_home',
        label: 'Home',
        icon: 'mdi:home-lock',
        activeColor: '--warning-color',
      },
      {
        type: 'arm_away',
        service: 'alarm_arm_away',
        label: 'Away',
        icon: 'mdi:shield-lock',
        activeColor: '--error-color',
      },
    ];
  }

  /**
   * Determine which action corresponds to the current alarm state
   * @param alarmState - The current alarm state
   * @returns The corresponding action type or null if no match
   */
  static getActiveAction(
    alarmState: AlarmState['state'] | undefined
  ): ControlActionType | null {
    switch (alarmState) {
      case 'disarmed':
        return 'disarm';
      case 'armed_home':
        return 'arm_home';
      case 'armed_away':
        return 'arm_away';
      default:
        return null;
    }
  }

  /**
   * Check if control actions should be disabled based on alarm state
   * @param alarmState - The current alarm state
   * @returns True if controls should be disabled
   */
  static areControlsDisabled(
    alarmState: AlarmState['state'] | undefined
  ): boolean {
    if (alarmState === undefined) {
      return true;
    }

    const transitionalStates: AlarmState['state'][] = [
      'arming',
      'disarming',
      'pending',
      'triggered',
    ];

    return transitionalStates.includes(alarmState);
  }

  /**
   * Get the Home Assistant service name for an action
   * @param action - The action type
   * @returns The Home Assistant service name
   */
  static getServiceForAction(action: ControlActionType): string {
    const serviceMap: Record<ControlActionType, string> = {
      disarm: 'alarm_disarm',
      arm_home: 'alarm_arm_home',
      arm_away: 'alarm_arm_away',
    };

    return serviceMap[action];
  }

  /**
   * Map an action type to its display properties
   * @param action - The action type
   * @returns Display properties including label, icon, and active color
   */
  static getActionDisplayProperties(action: ControlActionType): {
    label: string;
    icon: string;
    activeColor: string;
  } {
    const actions = AlarmControlManager.getControlActions();
    const actionDef = actions.find(a => a.type === action);

    if (!actionDef) {
      return {
        label: 'Unknown',
        icon: 'mdi:help-circle',
        activeColor: '--disabled-text-color',
      };
    }

    return {
      label: actionDef.label,
      icon: actionDef.icon,
      activeColor: actionDef.activeColor,
    };
  }
}
