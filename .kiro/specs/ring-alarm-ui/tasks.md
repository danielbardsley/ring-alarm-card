# Implementation Plan: Ring Alarm UI

## Overview

This implementation plan breaks down the Ring Alarm UI feature into discrete, modular tasks with clean separation of concerns. Each task builds incrementally on previous work, ensuring testable progress at every step. The plan emphasizes modularity by creating separate utility modules before integrating them into the main component.

## Tasks

- [x] 1. Extend type definitions for alarm functionality
  - Add `AlarmState` interface with state, icon, color, label, and animation properties
  - Extend `RingAlarmCardConfig` interface with required `entity` field and optional `show_state_text`, `compact_mode` fields
  - Add `EntityError` interface for error handling
  - Update `HassEntity` type if needed for alarm-specific attributes
  - _Requirements: 3.1, 3.4, FR-1_

- [x] 1.1 Write property test for configuration validation
  - **Property 3: Configuration Validation**
  - **Validates: Requirements 3.1, 3.2, 3.4**
  - Test that valid configurations are accepted and invalid ones are rejected
  - _Requirements: 3.1, 3.2, 3.4_

- [x] 2. Create AlarmStateManager utility module
  - [x] 2.1 Implement state mapping function (mapEntityState)
    - Map entity states to AlarmState objects with icon, color, label
    - Handle all alarm states: disarmed, armed_home, armed_away, pending, triggered, unknown
    - _Requirements: 1.1, 1.2, FR-2_

  - [x] 2.2 Implement state helper functions
    - `getStateIcon(state)`: Return appropriate MDI icon for each state
    - `getStateColor(state)`: Return CSS custom property for each state
    - `getStateLabel(state)`: Return human-readable label for each state
    - `isValidAlarmEntity(entity)`: Validate entity is alarm_control_panel type
    - _Requirements: 2.1, 2.2, 2.3, 2.4, FR-2_

  - [x] 2.3 Write property test for state mapping consistency
    - **Property 2: State Mapping Consistency**
    - **Validates: Requirements 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, FR-2**
    - Test that all valid alarm states map to correct visual representations
    - _Requirements: 1.1, 1.2, 2.1-2.4, FR-2_

  - [x] 2.4 Write unit tests for state helper functions
    - Test each helper function with specific state examples
    - Test edge cases and unknown states
    - _Requirements: 2.1-2.4, FR-2_

- [x] 3. Enhance ConfigurationManager for alarm validation
  - [x] 3.1 Add entity field validation
    - Validate `entity` field is required and is a string
    - Validate entity ID format matches `alarm_control_panel.*` pattern
    - Add validation for optional boolean fields (`show_state_text`, `compact_mode`)
    - _Requirements: 3.1, 3.2_

  - [x] 3.2 Add entity existence validation
    - Create `validateEntityExists(hass, entityId)` method
    - Check if entity exists in HASS states object
    - Validate entity domain is `alarm_control_panel`
    - Return helpful error messages for validation failures
    - _Requirements: 3.2, 3.3_

  - [x] 3.3 Update default configuration
    - Add defaults for `show_state_text: true` and `compact_mode: false`
    - Ensure entity field has no default (must be provided)
    - _Requirements: 3.4_

  - [x] 3.4 Write unit tests for configuration validation
    - Test valid configurations are accepted
    - Test invalid configurations are rejected with proper errors
    - Test entity validation with existing and non-existing entities
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Enhance hass-utils for entity monitoring
  - [x] 5.1 Add entity-specific state change detection
    - Update `hasRelevantStateChanges` to monitor specific entity IDs
    - Add `getEntityState(hass, entityId)` helper function
    - Add `hasEntityStateChanged(oldHass, newHass, entityId)` function
    - _Requirements: 1.3, FR-1_

  - [x] 5.2 Add entity validation helpers
    - Create `isEntityAvailable(hass, entityId)` function
    - Create `getEntityDomain(entityId)` function
    - Create `validateAlarmEntity(hass, entityId)` function
    - _Requirements: 3.2, FR-3_

  - [x] 5.3 Write property test for entity integration
    - **Property 1: Entity Integration and State Updates**
    - **Validates: Requirements 1.3, FR-1**
    - Test that entity state changes trigger card updates
    - _Requirements: 1.3, FR-1_

  - [x] 5.4 Write unit tests for entity monitoring
    - Test entity state change detection with specific scenarios
    - Test entity validation with various entity types
    - _Requirements: 1.3, 3.2, FR-1_

- [x] 6. Create alarm-specific styles module
  - [x] 6.1 Create alarm-styles.ts file
    - Define CSS custom properties for alarm state colors
    - Create styles for alarm status display (icon + text layout)
    - Add animation keyframes for pending and triggered states
    - Create compact mode styles
    - _Requirements: 1.2, 2.1-2.4_

  - [x] 6.2 Add theme integration styles
    - Use Home Assistant CSS custom properties for colors
    - Ensure proper contrast ratios for accessibility
    - Support both light and dark themes
    - _Requirements: 1.4, FR-4_

  - [x] 6.3 Add error state styles
    - Create styles for error message display
    - Add warning/error color schemes
    - _Requirements: 3.3, FR-3_

- [x] 7. Create AlarmDisplayRenderer utility module
  - [x] 7.1 Implement renderAlarmStatus function
    - Accept AlarmState and config parameters
    - Render icon with proper size and color
    - Render state label if show_state_text is true
    - Apply compact mode styles if enabled
    - Add proper ARIA labels and accessibility attributes
    - _Requirements: 1.1, 1.2, 2.5_

  - [x] 7.2 Implement error rendering functions
    - `renderErrorState(error)`: Display error messages with icon
    - `renderLoadingState()`: Display loading indicator
    - `renderEntityNotFound(entityId)`: Specific error for missing entity
    - _Requirements: 3.3, FR-3_

  - [x] 7.3 Write property test for accessibility compliance
    - **Property 6: Accessibility Compliance**
    - **Validates: Requirements 2.5**
    - Test that all rendered states include proper ARIA attributes
    - _Requirements: 2.5_

  - [x] 7.4 Write unit tests for rendering functions
    - Test alarm status rendering with different states
    - Test error state rendering
    - Test compact mode rendering
    - _Requirements: 1.1, 1.2, 3.3_

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Integrate alarm functionality into RingAlarmCard component
  - [x] 9.1 Add alarm state management to component
    - Add `@state() private alarmState?: AlarmState` property
    - Add `@state() private entityError?: string` property
    - Update component to track configured entity
    - _Requirements: FR-1, FR-3_

  - [x] 9.2 Enhance setConfig method
    - Call enhanced ConfigurationManager validation
    - Validate entity exists using new validation methods
    - Set entityError state if validation fails
    - Initialize alarm state from entity if valid
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 9.3 Enhance _handleHassUpdate method
    - Check for configured entity state changes
    - Update alarmState when entity state changes
    - Handle entity becoming unavailable
    - Clear errors when entity becomes available
    - _Requirements: 1.3, FR-1, FR-3_

  - [x] 9.4 Update render method
    - Use AlarmDisplayRenderer for alarm status display
    - Show error state if entityError is set
    - Show loading state if entity not yet loaded
    - Maintain existing title rendering
    - Remove "Hello World" placeholder
    - _Requirements: 1.1, 1.2, 3.3_

  - [x] 9.5 Write property test for error handling resilience
    - **Property 4: Error Handling Resilience**
    - **Validates: Requirements FR-3, 3.3**
    - Test that error conditions don't crash the card
    - _Requirements: FR-3, 3.3_

  - [x] 9.6 Write integration tests for component
    - Test full component lifecycle with entity changes
    - Test configuration changes
    - Test error recovery scenarios
    - _Requirements: 1.3, 3.2, FR-1, FR-3_

- [x] 10. Add theme integration and testing
  - [x] 10.1 Verify theme CSS custom properties
    - Ensure all alarm colors use HA theme variables
    - Test color adaptation with theme changes
    - Verify contrast ratios meet accessibility standards
    - _Requirements: 1.4, FR-4_

  - [x] 10.2 Write property test for theme integration
    - **Property 5: Theme Integration**
    - **Validates: Requirements 1.4, FR-4**
    - Test that theme changes update card styling appropriately
    - _Requirements: 1.4, FR-4_

  - [x] 10.3 Write unit tests for theme integration
    - Test specific theme configurations
    - Test light and dark theme rendering
    - _Requirements: 1.4, FR-4_

- [x] 11. Final integration and polish
  - [x] 11.1 Update card registration
    - Verify card registration still works with enhanced component
    - Test card appears in Lovelace card picker
    - _Requirements: FR-1_

  - [x] 11.2 Add comprehensive error messages
    - Ensure all error paths have clear, actionable messages
    - Add examples in error messages where helpful
    - _Requirements: 3.3, FR-3_

  - [x] 11.3 Verify HACS compatibility
    - Build production bundle
    - Test card loads in Home Assistant
    - Verify no console errors
    - _Requirements: FR-1_

  - [x] 11.4 Write end-to-end integration tests
    - Test complete user workflows
    - Test configuration → display → state change flow
    - Test error → recovery flow
    - _Requirements: All_

- [x] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Verify 80% test coverage is maintained
  - Run full test suite including property-based tests

## Notes

- Tasks are comprehensive with full testing and validation from the start
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- The implementation follows a modular approach: utilities first, then integration
- Clean separation of concerns: state management, rendering, and configuration are separate modules
- Each module is independently testable before integration