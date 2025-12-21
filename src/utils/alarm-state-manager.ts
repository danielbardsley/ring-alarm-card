/**
 * AlarmStateManager - Utility module for managing alarm state mapping and helpers
 */

import { AlarmState, HassEntity } from '@/types';

export class AlarmStateManager {
  /**
   * Maps a Home Assistant entity to an AlarmState object
   * @param entity - The Home Assistant entity
   * @returns AlarmState object with visual representation
   */
  static mapEntityState(entity: HassEntity): AlarmState {
    const state = entity.state.toLowerCase();

    switch (state) {
      case 'disarmed':
        return {
          state: 'disarmed',
          icon: 'mdi:shield-off',
          color: '--success-color',
          label: 'Disarmed',
          isAnimated: false,
        };

      case 'armed_home':
        return {
          state: 'armed_home',
          icon: 'mdi:home-lock',
          color: '--warning-color',
          label: 'Armed Home',
          isAnimated: false,
        };

      case 'armed_away':
        return {
          state: 'armed_away',
          icon: 'mdi:shield-lock',
          color: '--error-color',
          label: 'Armed Away',
          isAnimated: false,
        };

      case 'pending':
        return {
          state: 'pending',
          icon: 'mdi:clock-outline',
          color: '--info-color',
          label: 'Pending',
          isAnimated: true,
        };

      case 'triggered':
        return {
          state: 'triggered',
          icon: 'mdi:shield-alert',
          color: '--error-color',
          label: 'Triggered',
          isAnimated: true,
        };

      default:
        return {
          state: 'unknown',
          icon: 'mdi:help-circle',
          color: '--disabled-text-color',
          label: 'Unknown',
          isAnimated: false,
        };
    }
  }

  /**
   * Get the appropriate MDI icon for an alarm state
   * @param state - The alarm state
   * @returns MDI icon string
   */
  static getStateIcon(state: AlarmState['state']): string {
    switch (state) {
      case 'disarmed':
        return 'mdi:shield-off';
      case 'armed_home':
        return 'mdi:home-lock';
      case 'armed_away':
        return 'mdi:shield-lock';
      case 'pending':
        return 'mdi:clock-outline';
      case 'triggered':
        return 'mdi:shield-alert';
      case 'unknown':
      default:
        return 'mdi:help-circle';
    }
  }

  /**
   * Get the CSS custom property for an alarm state color
   * @param state - The alarm state
   * @returns CSS custom property string
   */
  static getStateColor(state: AlarmState['state']): string {
    switch (state) {
      case 'disarmed':
        return '--success-color';
      case 'armed_home':
        return '--warning-color';
      case 'armed_away':
      case 'triggered':
        return '--error-color';
      case 'pending':
        return '--info-color';
      case 'unknown':
      default:
        return '--disabled-text-color';
    }
  }

  /**
   * Get the human-readable label for an alarm state
   * @param state - The alarm state
   * @returns Human-readable label string
   */
  static getStateLabel(state: AlarmState['state']): string {
    switch (state) {
      case 'disarmed':
        return 'Disarmed';
      case 'armed_home':
        return 'Armed Home';
      case 'armed_away':
        return 'Armed Away';
      case 'pending':
        return 'Pending';
      case 'triggered':
        return 'Triggered';
      case 'unknown':
      default:
        return 'Unknown';
    }
  }

  /**
   * Validate that an entity is a valid alarm_control_panel type
   * @param entity - The Home Assistant entity
   * @returns True if entity is valid alarm type
   */
  static isValidAlarmEntity(entity: HassEntity): boolean {
    if (!entity || !entity.entity_id) {
      return false;
    }

    // Check if entity domain is alarm_control_panel
    const domain = entity.entity_id.split('.')[0];
    return domain === 'alarm_control_panel';
  }
}
