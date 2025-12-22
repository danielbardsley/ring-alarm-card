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

      case 'armed_night':
        return {
          state: 'armed_night',
          icon: 'mdi:weather-night',
          color: '--info-color',
          label: 'Armed Night',
          isAnimated: false,
        };

      case 'armed_vacation':
        return {
          state: 'armed_vacation',
          icon: 'mdi:airplane',
          color: '--warning-color',
          label: 'Armed Vacation',
          isAnimated: false,
        };

      case 'armed_custom_bypass':
        return {
          state: 'armed_custom_bypass',
          icon: 'mdi:shield-check',
          color: '--warning-color',
          label: 'Armed Custom',
          isAnimated: false,
        };

      case 'arming':
        return {
          state: 'arming',
          icon: 'mdi:shield-sync',
          color: '--info-color',
          label: 'Arming',
          isAnimated: true,
        };

      case 'disarming':
        return {
          state: 'disarming',
          icon: 'mdi:shield-sync',
          color: '--info-color',
          label: 'Disarming',
          isAnimated: true,
        };

      case 'pending':
        return {
          state: 'pending',
          icon: 'mdi:clock-outline',
          color: '--warning-color',
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
      case 'armed_night':
        return 'mdi:weather-night';
      case 'armed_vacation':
        return 'mdi:airplane';
      case 'armed_custom_bypass':
        return 'mdi:shield-check';
      case 'arming':
      case 'disarming':
        return 'mdi:shield-sync';
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
      case 'armed_vacation':
      case 'armed_custom_bypass':
      case 'pending':
        return '--warning-color';
      case 'armed_away':
      case 'triggered':
        return '--error-color';
      case 'armed_night':
      case 'arming':
      case 'disarming':
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
      case 'armed_night':
        return 'Armed Night';
      case 'armed_vacation':
        return 'Armed Vacation';
      case 'armed_custom_bypass':
        return 'Armed Custom';
      case 'arming':
        return 'Arming';
      case 'disarming':
        return 'Disarming';
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
