# Implementation Plan: Vacation Button

## Overview

This implementation adds a vacation toggle button to the Ring Alarm Card. The approach is incremental: first extending types and configuration, then creating the vacation button manager, updating the display renderer, and finally integrating into the main component.

## Tasks

- [x] 1. Extend types and configuration
  - [x] 1.1 Add vacation_entity to RingAlarmCardConfig interface
    - Update `src/types/index.ts` to add optional `vacation_entity?: string` field
    - _Requirements: 1.1_

  - [x] 1.2 Add vacation configuration validation to ConfigurationManager
    - Update `src/config/configuration-manager.ts` to validate vacation_entity format
    - Validate entity follows `input_boolean.*` pattern
    - Add descriptive error messages for invalid formats
    - _Requirements: 1.2, 1.3_

  - [x] 1.3 Write property test for vacation entity configuration validation
    - **Property 1: Vacation Entity Configuration Validation**
    - **Validates: Requirements 1.2, 1.3**

- [x] 2. Create VacationButtonManager utility
  - [x] 2.1 Create VacationButtonManager class with core logic
    - Create new file `src/utils/vacation-button-manager.ts`
    - Implement `VacationButtonState` and `VacationButtonDisplay` interfaces
    - Implement `getDisplayProperties()` returning icon, label, activeColor
    - Implement `isVacationActive(entityState)` returning boolean
    - Implement `getToggleService(currentState)` returning service name
    - Implement `isValidVacationEntity(entityId)` for format validation
    - _Requirements: 2.2, 2.3, 3.1, 3.2, 4.2, 4.3_

  - [x] 2.2 Write property test for state-to-active mapping
    - **Property 3: Vacation State to Active Mapping**
    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [x] 2.3 Write property test for toggle service selection
    - **Property 4: Toggle Service Selection**
    - **Validates: Requirements 4.2, 4.3**

- [x] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Update AlarmDisplayRenderer for vacation button
  - [x] 4.1 Add renderVacationButton method
    - Update `src/utils/alarm-display-renderer.ts`
    - Create method to render vacation button with proper styling
    - Use consistent button classes with existing control buttons
    - Apply info/blue color for active state
    - _Requirements: 2.4, 2.5, 3.4_

  - [x] 4.2 Add renderControlButtonsWithVacation method
    - Create method that renders alarm buttons followed by vacation button
    - Position vacation button after alarm control buttons
    - Handle null vacation state (don't render vacation button)
    - _Requirements: 2.1, 2.4_

  - [x] 4.3 Write property test for conditional vacation button rendering
    - **Property 2: Conditional Vacation Button Rendering**
    - **Validates: Requirements 1.4, 2.1**

- [x] 5. Update button styles for vacation button
  - [x] 5.1 Add vacation button active state styles
    - Update `src/styles/button-styles.ts`
    - Add `.control-button.active.vacation` styles using `--info-color`
    - Ensure consistent styling with other button states
    - _Requirements: 3.4, 2.5_

- [x] 6. Integrate vacation button into RingAlarmCard component
  - [x] 6.1 Add vacation state tracking to component
    - Update `src/components/ring-alarm-card.ts`
    - Add `vacationState` state property
    - Add `vacationEntityError` state property
    - Initialize vacation button state in `connectedCallback`
    - _Requirements: 3.1, 3.2_

  - [x] 6.2 Implement vacation entity validation and state handling
    - Add `_validateAndInitializeVacationEntity()` method
    - Add `_handleVacationEntityStateChange()` method
    - Update `_handleHassUpdate()` to check vacation entity changes
    - Handle entity not found and unavailable states
    - _Requirements: 1.5, 3.3_

  - [x] 6.3 Implement vacation button click handler
    - Add `_handleVacationButtonClick()` async method
    - Set loading state during service call
    - Call appropriate input_boolean service (turn_on/turn_off)
    - Handle errors with error state and 3-second recovery
    - _Requirements: 4.1, 4.4, 4.5_

  - [x] 6.4 Update render method to include vacation button
    - Update `_renderControlButtons()` to use new renderer method
    - Pass vacation state and click handler
    - Ensure vacation button renders only when configured
    - _Requirements: 1.4, 2.1_

  - [x] 6.5 Write property test for alarm state independence
    - **Property 5: Alarm State Independence**
    - **Validates: Requirements 5.1, 5.3**

  - [x] 6.6 Write property test for state isolation
    - **Property 6: State Isolation**
    - **Validates: Requirements 5.2, 5.4**

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Update demo page
  - [x] 8.1 Add vacation entity example to demo
    - Update `demo/index.html` to include vacation_entity configuration
    - Add mock input_boolean entity to demo HASS object
    - _Requirements: 2.1_

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
