# Design Document: Vacation Button

## Overview

This design adds a fourth "Vacation" toggle button to the Ring Alarm Card. The vacation button controls a configurable `input_boolean` entity and operates independently of the alarm armed/disarmed states. The implementation extends the existing button infrastructure while maintaining separation between alarm control and vacation toggle functionality.

## Architecture

The vacation button feature integrates with the existing Ring Alarm Card architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    RingAlarmCard Component                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │ ConfigManager   │  │ AlarmControlManager             │  │
│  │ (validates      │  │ (alarm buttons: disarm,         │  │
│  │  vacation_entity│  │  arm_home, arm_away)            │  │
│  │  config)        │  └─────────────────────────────────┘  │
│  └─────────────────┘                                        │
│                       ┌─────────────────────────────────┐  │
│                       │ VacationButtonManager (NEW)     │  │
│                       │ (vacation toggle logic)         │  │
│                       └─────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    AlarmDisplayRenderer                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Control Buttons Row                                  │   │
│  │ [Disarm] [Home] [Away] [Vacation]                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Separate Manager**: Create a new `VacationButtonManager` utility class to handle vacation-specific logic, keeping it separate from `AlarmControlManager` which handles alarm state transitions.

2. **Shared Button Rendering**: Reuse the existing button rendering infrastructure in `AlarmDisplayRenderer` with a new method for the vacation button.

3. **Independent State**: The vacation button state is tracked separately from alarm button states, ensuring independence.

4. **Optional Feature**: The vacation button only appears when `vacation_entity` is configured, maintaining backward compatibility.

## Components and Interfaces

### Configuration Extension

```typescript
// Extended RingAlarmCardConfig in src/types/index.ts
export interface RingAlarmCardConfig extends LovelaceCardConfig {
  type: 'custom:ring-alarm-card';
  entity: string;
  title?: string;
  show_state_text?: boolean;
  compact_mode?: boolean;
  vacation_entity?: string; // NEW: Optional input_boolean entity for vacation mode
}
```

### VacationButtonManager

```typescript
// New file: src/utils/vacation-button-manager.ts

/**
 * Interface for vacation button state
 */
export interface VacationButtonState {
  isActive: boolean;      // true when input_boolean is "on"
  isLoading: boolean;     // true during service call
  hasError: boolean;      // true after failed service call
  isDisabled: boolean;    // true when entity unavailable
}

/**
 * Interface for vacation button display properties
 */
export interface VacationButtonDisplay {
  label: string;          // "Vacation"
  icon: string;           // "mdi:beach"
  activeColor: string;    // "--info-color"
}

export class VacationButtonManager {
  /**
   * Get display properties for the vacation button
   */
  static getDisplayProperties(): VacationButtonDisplay;

  /**
   * Determine if vacation mode is active based on entity state
   * @param entityState - The state string from the input_boolean entity
   */
  static isVacationActive(entityState: string | undefined): boolean;

  /**
   * Get the service to call for toggling vacation mode
   * @param currentState - Current state of the input_boolean
   * @returns Service name: "turn_on" or "turn_off"
   */
  static getToggleService(currentState: string | undefined): string;

  /**
   * Validate that an entity ID is a valid input_boolean
   * @param entityId - The entity ID to validate
   * @returns true if valid input_boolean format
   */
  static isValidVacationEntity(entityId: string): boolean;
}
```

### ConfigurationManager Updates

```typescript
// Updates to src/config/configuration-manager.ts

export class ConfigurationManager {
  /**
   * Validates the card configuration
   * Extended to validate vacation_entity if provided
   */
  static validateConfig(config: RingAlarmCardConfig): void {
    // ... existing validation ...
    
    // NEW: Validate vacation_entity if provided
    if (config.vacation_entity !== undefined) {
      if (typeof config.vacation_entity !== 'string') {
        throw new Error('vacation_entity must be a string');
      }
      
      if (!config.vacation_entity.startsWith('input_boolean.')) {
        throw new Error(
          'vacation_entity must be an input_boolean entity. ' +
          'Example: "input_boolean.vacation_mode"'
        );
      }
      
      // Validate entity name format
      const entityName = config.vacation_entity.split('.')[1];
      if (!entityName || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(entityName)) {
        throw new Error('vacation_entity has invalid entity name format');
      }
    }
  }

  /**
   * Validates that a vacation entity exists in Home Assistant
   */
  static validateVacationEntityExists(
    hass: HomeAssistant, 
    entityId: string
  ): void;
}
```

### AlarmDisplayRenderer Updates

```typescript
// Updates to src/utils/alarm-display-renderer.ts

export class AlarmDisplayRenderer {
  /**
   * Render the vacation button
   * @param vacationState - Current vacation button state
   * @param onClick - Callback when button is clicked
   */
  static renderVacationButton(
    vacationState: VacationButtonState,
    onClick: () => void
  ): TemplateResult;

  /**
   * Render control buttons row with optional vacation button
   * Extended to include vacation button when configured
   */
  static renderControlButtonsWithVacation(
    alarmState: AlarmState | undefined,
    buttonStates: Map<ControlActionType, ControlButtonState>,
    vacationState: VacationButtonState | null,
    onAlarmButtonClick: (action: ControlActionType) => void,
    onVacationClick: () => void,
    liveAnnouncement?: string
  ): TemplateResult;
}
```

### RingAlarmCard Component Updates

```typescript
// Updates to src/components/ring-alarm-card.ts

@customElement('ring-alarm-card')
export class RingAlarmCard extends LitElement implements LovelaceCard {
  // NEW: Track vacation button state
  @state() private vacationState: VacationButtonState | null = null;
  
  // NEW: Track vacation entity error separately
  @state() private vacationEntityError: string | undefined;

  /**
   * Handle vacation button click
   */
  private async _handleVacationButtonClick(): Promise<void>;

  /**
   * Handle vacation entity state changes
   */
  private _handleVacationEntityStateChange(): void;

  /**
   * Validate and initialize vacation entity
   */
  private _validateAndInitializeVacationEntity(): void;
}
```

## Data Models

### State Flow

```
User clicks Vacation button
         │
         ▼
┌─────────────────────────┐
│ Set isLoading = true    │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Call input_boolean      │
│ turn_on or turn_off     │
└─────────────────────────┘
         │
    ┌────┴────┐
    │         │
 Success    Failure
    │         │
    ▼         ▼
┌────────┐ ┌────────────────┐
│isLoading│ │isLoading=false │
│= false │ │hasError=true   │
└────────┘ └────────────────┘
    │              │
    │              ▼
    │      ┌────────────────┐
    │      │ After 3s:      │
    │      │ hasError=false │
    │      └────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Entity state update     │
│ triggers UI refresh     │
└─────────────────────────┘
```

### Button State Mapping

| Entity State | isActive | Visual State |
|--------------|----------|--------------|
| "on"         | true     | Blue/highlighted |
| "off"        | false    | Inactive/gray |
| "unavailable"| false    | Disabled |
| undefined    | false    | Disabled |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*



### Property 1: Vacation Entity Configuration Validation

*For any* string provided as `vacation_entity` in the configuration, the Configuration_Manager SHALL accept it if and only if it matches the pattern `input_boolean.[valid_entity_name]` where valid_entity_name starts with a letter or underscore and contains only alphanumeric characters and underscores.

**Validates: Requirements 1.2, 1.3**

### Property 2: Conditional Vacation Button Rendering

*For any* valid card configuration, the vacation button SHALL be rendered if and only if `vacation_entity` is provided and is a valid input_boolean entity ID.

**Validates: Requirements 1.4, 2.1**

### Property 3: Vacation State to Active Mapping

*For any* input_boolean entity state, the vacation button `isActive` property SHALL be `true` if and only if the entity state equals "on".

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 4: Toggle Service Selection

*For any* current input_boolean state, clicking the vacation button SHALL call `input_boolean.turn_on` when state is "off" and `input_boolean.turn_off` when state is "on".

**Validates: Requirements 4.2, 4.3**

### Property 5: Alarm State Independence

*For any* alarm state (disarmed, armed_home, armed_away, arming, disarming, pending, triggered), the vacation button SHALL remain enabled and clickable.

**Validates: Requirements 5.1, 5.3**

### Property 6: State Isolation

*For any* sequence of alarm state transitions, the vacation button state (isActive, isLoading, hasError) SHALL remain unchanged unless explicitly modified by vacation button interactions.

**Validates: Requirements 5.2, 5.4**

## Error Handling

### Configuration Errors

| Error Condition | Error Message |
|-----------------|---------------|
| vacation_entity is not a string | "vacation_entity must be a string" |
| vacation_entity doesn't start with input_boolean. | "vacation_entity must be an input_boolean entity. Example: input_boolean.vacation_mode" |
| vacation_entity has invalid name format | "vacation_entity has invalid entity name format" |

### Runtime Errors

| Error Condition | Behavior |
|-----------------|----------|
| Vacation entity not found in HASS | Display error state on vacation button only, alarm buttons remain functional |
| Vacation entity unavailable | Disable vacation button, show unavailable state |
| Service call failure | Show error state on button, auto-recover after 3 seconds |

### Error Recovery

- Configuration errors: Thrown during `setConfig()`, prevents card rendering
- Entity not found: Checked on HASS update, shows inline error
- Service call failure: Button shows error state, clears after 3 second timeout

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples and edge cases:

1. **Configuration validation examples**:
   - Valid: `input_boolean.vacation_mode`
   - Invalid: `switch.vacation`, `input_boolean.`, `vacation_mode`

2. **Display property examples**:
   - Icon is `mdi:beach`
   - Label is `Vacation`
   - Active color is `--info-color`

3. **Error state examples**:
   - Service call failure triggers error state
   - Error clears after timeout

### Property-Based Tests

Property-based tests will use fast-check to verify universal properties:

1. **Configuration validation property**: Generate random strings, verify only valid input_boolean patterns pass
2. **State mapping property**: Generate random entity states, verify isActive mapping
3. **Toggle service property**: Generate random states, verify correct service selection
4. **Independence property**: Generate random alarm states, verify vacation button remains enabled

### Test Configuration

- Framework: Jest with fast-check
- Minimum iterations: 100 per property test
- Coverage threshold: 80% for new code
- Tag format: `Feature: vacation-button, Property N: [property_text]`

### Test File Structure

```
src/
├── utils/
│   ├── vacation-button-manager.ts
│   ├── vacation-button-manager.test.ts        # Unit tests
│   └── vacation-button-manager.property.test.ts # Property tests
├── config/
│   └── configuration-manager.test.ts          # Extended with vacation tests
└── components/
    └── ring-alarm-card.vacation.test.ts       # Integration tests
```
