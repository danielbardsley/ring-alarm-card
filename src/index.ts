/**
 * Ring Alarm Card - Entry point
 * A custom Home Assistant Lovelace card for Ring alarm systems
 */

// Import the main component (this will register the custom element)
import './components/ring-alarm-card';

// Register the card with Home Assistant
import { registerCard } from './registration/card-registration';

// Export types for external use
export type { 
  RingAlarmCardConfig, 
  HomeAssistant, 
  HassEntity,
  LovelaceCard,
  LovelaceCardConfig 
} from './types';

// Export the main component
export { RingAlarmCard } from './components/ring-alarm-card';

// Export configuration utilities
export { ConfigurationManager } from './config/configuration-manager';

// Register the card
registerCard();