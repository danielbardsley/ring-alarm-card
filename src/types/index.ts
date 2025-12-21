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
  title?: string;
}

// Lovelace card interface
export interface LovelaceCard extends HTMLElement {
  setConfig(config: LovelaceCardConfig): void;
  set hass(hass: HomeAssistant);
  getCardSize?(): number | Promise<number>;
  getConfigElement?(): HTMLElement;
  getStubConfig?(): LovelaceCardConfig;
}
