/**
 * Type definitions for Home Assistant and Ring Alarm Card
 */

export interface HomeAssistant {
  states: { [entity_id: string]: HassEntity };
  callService(domain: string, service: string, data?: any): Promise<any>;
  language: string;
  themes: any;
  selectedTheme: string | null;
  panels: any;
  panelUrl: string;
  // Additional HASS properties as needed
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: { [key: string]: any };
  context: HassContext;
  last_changed: string;
  last_updated: string;
}

export interface HassContext {
  id: string;
  parent_id?: string;
  user_id?: string;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: any;
}

export interface RingAlarmCardConfig extends LovelaceCardConfig {
  type: 'custom:ring-alarm-card';
  entity: string; // Required: alarm_control_panel entity ID
  title?: string;
  show_state_text?: boolean; // Default: true
  compact_mode?: boolean; // Default: false
  vacation_entity?: string; // Optional: input_boolean entity for vacation mode
}

// Lovelace card interface
export interface LovelaceCard extends HTMLElement {
  setConfig(config: LovelaceCardConfig): void;
  set hass(hass: HomeAssistant);
  getCardSize?(): number | Promise<number>;
  getConfigElement?(): HTMLElement;
  getStubConfig?(): LovelaceCardConfig;
}

// Alarm-specific interfaces
export interface AlarmState {
  state:
    | 'disarmed'
    | 'armed_home'
    | 'armed_away'
    | 'armed_night'
    | 'armed_vacation'
    | 'armed_custom_bypass'
    | 'arming'
    | 'disarming'
    | 'pending'
    | 'triggered'
    | 'unknown';
  icon: string;
  color: string;
  label: string;
  isAnimated: boolean;
}

export interface EntityError {
  type: 'not_found' | 'invalid_domain' | 'unavailable' | 'unknown';
  message: string;
  entityId: string;
}

// Re-export control types from AlarmControlManager
export type {
  ControlActionType,
  ControlAction,
  ControlButtonState,
} from '@/utils/alarm-control-manager';

// Re-export transition types from TransitionStateManager
export type { TransitionState } from '@/utils/transition-state-manager';
