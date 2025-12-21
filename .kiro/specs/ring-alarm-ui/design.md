# Ring Alarm UI Design Document

## Overview

This design document outlines the implementation approach for adding basic alarm status display functionality to the Ring Alarm Card. The design builds upon the existing Lit-based component architecture and extends it to display Ring alarm system states with proper Home Assistant integration.

The implementation focuses on creating a minimal viable product that displays alarm states (disarmed, armed-home, armed-away, pending, triggered) with appropriate visual indicators while maintaining the existing project patterns and architecture.

## Architecture

### Component Architecture

The design extends the existing `RingAlarmCard` component with alarm-specific functionality while maintaining the current Lit-based architecture:

```
RingAlarmCard (Enhanced)
├── Configuration Management (ConfigurationManager)
├── State Management (AlarmStateManager - New)
├── Visual Rendering (AlarmDisplayRenderer - New)
├── Theme Integration (Existing cardStyles + AlarmStyles - New)
└── Entity Monitoring (Enhanced hass-utils)
```

### Key Architectural Decisions

1. **Extend Existing Component**: Enhance the current `RingAlarmCard` rather than creating new components
2. **State Management Layer**: Add `AlarmStateManager` to handle alarm-specific state logic
3. **Visual Rendering Layer**: Add `AlarmDisplayRenderer` to handle alarm state visualization
4. **Configuration Extension**: Extend existing `ConfigurationManager` with alarm-specific validation
5. **Styling Enhancement**: Add alarm-specific styles while maintaining theme integration

## Components and Interfaces

### Enhanced RingAlarmCard Component

```typescript
@customElement('ring-alarm-card')
export class RingAlarmCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: RingAlarmCardConfig;
  @state() private alarmState?: AlarmState;
  @state() private entityError?: string;

  // Enhanced methods
  protected override updated(changedProps: PropertyValues): void;
  private _handleEntityStateChange(entityId: string, newState: HassEntity): void;
  private _validateEntity(): void;
  protected override render(): TemplateResult;
}
```

### AlarmStateManager (New)

```typescript
export class AlarmStateManager {
  static mapEntityState(entity: HassEntity): AlarmState;
  static getStateIcon(state: AlarmState): string;
  static getStateColor(state: AlarmState): string;
  static getStateLabel(state: AlarmState): string;
  static isValidAlarmEntity(entity: HassEntity): boolean;
}
```

### AlarmDisplayRenderer (New)

```typescript
export class AlarmDisplayRenderer {
  static renderAlarmStatus(
    alarmState: AlarmState,
    config: RingAlarmCardConfig
  ): TemplateResult;
  static renderErrorState(error: string): TemplateResult;
  static renderLoadingState(): TemplateResult;
}
```

### Enhanced Configuration Types

```typescript
export interface RingAlarmCardConfig extends LovelaceCardConfig {
  type: 'custom:ring-alarm-card';
  entity: string; // Required: alarm_control_panel entity ID
  title?: string;
  show_state_text?: boolean; // Default: true
  compact_mode?: boolean; // Default: false
}

export interface AlarmState {
  state: 'disarmed' | 'armed_home' | 'armed_away' | 'pending' | 'triggered' | 'unknown';
  icon: string;
  color: string;
  label: string;
  isAnimated: boolean;
}
```

## Data Models

### Entity State Mapping

The design maps Home Assistant alarm_control_panel entity states to internal `AlarmState` objects:

| Entity State | Internal State | Icon | Color | Animation |
|-------------|---------------|------|-------|-----------|
| `disarmed` | `disarmed` | `mdi:shield-off` | `--success-color` | No |
| `armed_home` | `armed_home` | `mdi:home-lock` | `--warning-color` | No |
| `armed_away` | `armed_away` | `mdi:shield-lock` | `--error-color` | No |
| `pending` | `pending` | `mdi:clock-outline` | `--info-color` | Yes |
| `triggered` | `triggered` | `mdi:shield-alert` | `--error-color` | Yes (Flash) |
| Other/Unknown | `unknown` | `mdi:help-circle` | `--disabled-text-color` | No |

### Configuration Validation Rules

```typescript
const configValidationRules = {
  entity: {
    required: true,
    type: 'string',
    pattern: /^alarm_control_panel\./,
    validation: (hass: HomeAssistant, entityId: string) => {
      return hass.states[entityId] !== undefined;
    }
  },
  title: {
    required: false,
    type: 'string',
    maxLength: 50
  },
  show_state_text: {
    required: false,
    type: 'boolean',
    default: true
  },
  compact_mode: {
    required: false,
    type: 'boolean',
    default: false
  }
};
```

### Error Handling Model

```typescript
interface EntityError {
  type: 'not_found' | 'invalid_domain' | 'unavailable' | 'unknown';
  message: string;
  entityId: string;
}
```

## Implementation Strategy

### Phase 1: Core Infrastructure
1. Extend `RingAlarmCardConfig` interface with required `entity` field
2. Enhance `ConfigurationManager` with entity validation
3. Create `AlarmStateManager` utility class
4. Update `hass-utils` with entity monitoring functions

### Phase 2: State Management
1. Add alarm state tracking to `RingAlarmCard` component
2. Implement entity state change detection
3. Add error state handling for invalid/missing entities
4. Implement state mapping and validation

### Phase 3: Visual Implementation
1. Create `AlarmDisplayRenderer` for state visualization
2. Add alarm-specific CSS styles with animations
3. Implement responsive design for different card sizes
4. Add accessibility attributes and ARIA labels

### Phase 4: Integration & Polish
1. Integrate all components in main `RingAlarmCard` render method
2. Add comprehensive error handling and user feedback
3. Implement theme integration and color customization
4. Add configuration validation with helpful error messages

## Styling Architecture

### CSS Custom Properties Integration

```css
:host {
  /* Alarm state colors using HA theme variables */
  --alarm-disarmed-color: var(--success-color, #4caf50);
  --alarm-armed-home-color: var(--warning-color, #ff9800);
  --alarm-armed-away-color: var(--error-color, #f44336);
  --alarm-pending-color: var(--info-color, #2196f3);
  --alarm-unknown-color: var(--disabled-text-color, #9e9e9e);
}
```

### Component Layout Structure

```css
.alarm-card {
  /* Base card styling (existing) */
}

.alarm-status {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 12px;
}

.alarm-icon {
  font-size: 2.5rem;
  transition: color 0.3s ease;
}

.alarm-text {
  font-size: 1.2rem;
  font-weight: 500;
  text-transform: capitalize;
}

.alarm-pending {
  animation: pulse 2s infinite;
}

.alarm-triggered {
  animation: flash 1s infinite;
}

/* Compact mode styles */
.compact .alarm-status {
  padding: 12px;
  gap: 8px;
}

.compact .alarm-icon {
  font-size: 1.8rem;
}

.compact .alarm-text {
  font-size: 1rem;
}
```

## Error Handling Strategy

### Configuration Errors
- Invalid entity ID format → Show configuration error with example
- Entity not found → Show "Entity not found" with entity ID
- Wrong entity domain → Show "Must be alarm_control_panel entity"
- Missing required config → Show "Entity configuration required"

### Runtime Errors
- Entity becomes unavailable → Show "Entity unavailable" with retry option
- HASS connection lost → Show "Home Assistant disconnected"
- Unknown entity state → Show state as "Unknown" with warning icon

### Error Recovery
- Automatic retry on entity availability
- Graceful degradation when HASS is unavailable
- Clear error messages with actionable guidance

## Performance Considerations

### Rendering Optimization
- Use Lit's efficient change detection for state updates
- Minimize DOM updates by tracking only relevant entity changes
- Implement shouldUpdate logic for entity-specific changes
- Use CSS transitions for smooth state changes

### Memory Management
- Remove event listeners on component disconnect
- Avoid memory leaks in entity state monitoring
- Efficient state comparison to prevent unnecessary renders

### Network Efficiency
- Monitor only the configured entity, not all entities
- Batch state updates to prevent excessive re-renders
- Use efficient entity state comparison algorithms

## Testing Strategy

### Unit Testing Approach
- **Configuration Validation**: Test all config validation rules with valid/invalid inputs
- **State Mapping**: Test entity state to AlarmState mapping for all possible states
- **Error Handling**: Test error scenarios (missing entity, wrong domain, unavailable)
- **Rendering Logic**: Test render output for different states and configurations
- **Theme Integration**: Test color and styling with different HA themes

### Integration Testing Approach
- **Entity Monitoring**: Test entity state change detection and handling
- **HASS Integration**: Test component behavior with HASS object updates
- **Configuration Changes**: Test dynamic configuration updates
- **Error Recovery**: Test recovery from error states when entity becomes available

### Property-Based Testing Requirements
- Configuration validation with randomly generated valid/invalid configs
- State transitions with random entity state sequences
- Theme integration with random theme configurations
- Error handling with random error conditions

## Accessibility Requirements

### ARIA Implementation
```html
<div class="alarm-status" 
     role="status" 
     aria-label="Alarm system status: ${state}"
     aria-live="polite">
  <ha-icon icon="${icon}" 
           aria-hidden="true"
           class="alarm-icon"></ha-icon>
  <span class="alarm-text" 
        aria-label="Current state: ${label}">
    ${label}
  </span>
</div>
```

### Screen Reader Support
- Proper ARIA labels for all interactive elements
- Live regions for state change announcements
- Descriptive text for icon-only elements
- Keyboard navigation support where applicable

### Color Accessibility
- Maintain WCAG 2.1 AA contrast ratios for all state colors
- Provide non-color indicators (icons) for state differentiation
- Test with color blindness simulation tools
- Support high contrast themes

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The following properties define the correctness requirements for the Ring Alarm UI implementation. Each property represents a universal rule that must hold across all valid inputs and configurations.

### Property 1: Entity Integration and State Updates
*For any* valid alarm_control_panel entity and any state change sequence, when the entity state changes in Home Assistant, the card should update its display to reflect the new state within the next render cycle.
**Validates: Requirements 1.3, FR-1**

### Property 2: State Mapping Consistency  
*For any* valid alarm entity state (disarmed, armed_home, armed_away, pending, triggered, unknown), the card should consistently map that state to the correct visual representation (icon, color, label) as defined in the state mapping table.
**Validates: Requirements 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, FR-2**

### Property 3: Configuration Validation
*For any* configuration object, the card should accept valid configurations (with required entity field and optional title/display options) and reject invalid configurations with appropriate error messages.
**Validates: Requirements 3.1, 3.2, 3.4**

### Property 4: Error Handling Resilience
*For any* error condition (missing entity, invalid entity, unavailable entity), the card should display a clear error message and continue functioning without crashing or showing undefined states.
**Validates: Requirements FR-3, 3.3**

### Property 5: Theme Integration
*For any* Home Assistant theme configuration, the card should adapt its colors and styling to match the theme while maintaining readability and proper contrast ratios.
**Validates: Requirements 1.4, FR-4**

### Property 6: Accessibility Compliance
*For any* rendered alarm state, the card should include proper ARIA labels, screen reader support, and accessibility attributes that follow Home Assistant design patterns.
**Validates: Requirements 2.5**

### Property 7: Entity Validation Round Trip
*For any* entity configuration, if the entity exists in Home Assistant and is of the correct domain (alarm_control_panel), then configuring the card with that entity should result in successful initialization without errors.
**Validates: Requirements 3.2**

## Error Handling

### Error Classification and Response

**Configuration Errors (Fail Fast)**
- Missing required `entity` field → Throw configuration error immediately
- Invalid entity ID format → Throw validation error with format example
- Non-existent entity → Display "Entity not found: {entityId}" message
- Wrong entity domain → Display "Entity must be alarm_control_panel type" message

**Runtime Errors (Graceful Degradation)**
- Entity becomes unavailable → Display "Entity temporarily unavailable" with retry
- HASS connection lost → Display "Home Assistant disconnected" status
- Unknown entity state → Display state as "Unknown" with help icon
- Rendering errors → Log error and display fallback "Card error" message

**Error Recovery Mechanisms**
- Automatic retry when entity becomes available again
- Graceful fallback to previous known state during temporary issues
- Clear error messages with actionable user guidance
- Maintain card functionality even during partial failures

### Error State Rendering

```typescript
interface ErrorDisplayConfig {
  type: 'configuration' | 'entity' | 'connection' | 'unknown';
  message: string;
  recoverable: boolean;
  retryAction?: () => void;
}
```

## Testing Strategy

### Dual Testing Approach

The implementation requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific state mapping examples (disarmed → green + unlock icon)
- Edge cases and boundary conditions
- Integration points between components
- Error scenarios with known inputs
- Accessibility attribute verification

**Property-Based Tests** focus on:
- Universal properties across all possible inputs
- Configuration validation with randomly generated configs
- State transitions with random entity state sequences
- Theme integration with random theme configurations
- Error handling with random error conditions

### Property-Based Testing Configuration

Each property test must:
- Run minimum 100 iterations due to randomization
- Reference its corresponding design document property
- Use descriptive tags: **Feature: ring-alarm-ui, Property {number}: {property_text}**
- Generate realistic test data within the alarm system domain
- Validate universal correctness properties, not specific examples

### Test Implementation Requirements

**Testing Framework**: Jest with fast-check for property-based testing
**Coverage Target**: Minimum 80% coverage for branches, functions, lines, statements
**Test Categories**:
- Unit tests: `*.test.ts` files co-located with source
- Property tests: `*.property.test.ts` files for universal properties
- Integration tests: `integration/*.test.ts` for component interaction
- Accessibility tests: `accessibility/*.test.ts` for ARIA and screen reader support

**Test Data Generation**:
- Valid entity IDs: `alarm_control_panel.{random_name}`
- Alarm states: Random selection from valid state enum
- Theme configurations: Random HA theme property combinations
- Error conditions: Random invalid configurations and missing entities

### Example Property Test Structure

```typescript
describe('Property 2: State Mapping Consistency', () => {
  it('should consistently map entity states to visual representations', () => {
    fc.assert(fc.property(
      fc.constantFrom('disarmed', 'armed_home', 'armed_away', 'pending', 'triggered'),
      (alarmState) => {
        const visualRep = AlarmStateManager.mapEntityState({ state: alarmState });
        
        // Verify consistent mapping
        expect(visualRep.state).toBe(alarmState);
        expect(visualRep.icon).toMatch(/^mdi:/);
        expect(visualRep.color).toMatch(/^--\w+-color$/);
        expect(visualRep.label).toBeTruthy();
      }
    ), { numRuns: 100 });
  });
});
```

This comprehensive testing strategy ensures that both specific behaviors and universal properties are validated, providing confidence in the correctness and reliability of the Ring Alarm UI implementation.