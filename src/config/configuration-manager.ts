/**
 * Configuration management utilities for Ring Alarm Card
 */

import { RingAlarmCardConfig } from '../types';

export class ConfigurationManager {
  /**
   * Validates the card configuration
   * @param config - The configuration object to validate
   * @throws Error if configuration is invalid
   */
  static validateConfig(config: RingAlarmCardConfig): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration object');
    }
    
    if (config.type !== 'custom:ring-alarm-card') {
      throw new Error('Invalid card type. Expected "custom:ring-alarm-card"');
    }
  }
  
  /**
   * Returns the default configuration values
   * @returns Default configuration object
   */
  static getDefaultConfig(): Partial<RingAlarmCardConfig> {
    return {
      title: 'Custom Card'
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
    
    return merged;
  }
}
