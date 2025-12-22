# Implementation Plan: Alarm Control Buttons

## Overview

This implementation plan breaks down the alarm control buttons feature into discrete coding tasks. Each task builds incrementally on previous work, ensuring the feature is developed in a testable and maintainable way.

## Tasks

- [x] 1. Create AlarmControlManager utility class
  - [x] 1.1 Create `src/utils/alarm-control-manager.ts` with type definitions
    - Define `ControlActionType`, `ControlAction`, and `ControlButtonState` interfaces
    - Export types from `src/types/index.ts`
    - _Requirements: 1.1, 1.2, 3.1, 3.2, 3.3_

  - [x] 1.2 Implement `getControlActions()` method
    - Return array of three control actions: disarm, arm_home, arm_away
    - Include service names, labels, icons, and active colors
    - _Requirements: 1.2, 6.2_

  - [x] 1.3 Implement `getActiveAction()` method
    - Map alarm states to corresponding action types
    - Return null for states that don't map to a button
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 1.4 Implement `areControlsDisabled()` method
    - Return true for transitional states (arming, disarming, pending, triggered)
    - Return true for undefined alarm state
    - _Requirements: 2.5, 4.2, 4.3_

  - [x] 1.5 Implement `getServiceForAction()` method
    - Map action types to Home Assistant service names
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 1.6 Write property test for state-to-active-action mapping
    - **Property 1: State-to-Active-Button Mapping**
    - **Validates: Requirements 2.1, 2.2, 2.3, 6.2**

  - [x] 1.7 Write property test for transitional states
    - **Property 2: Transitional States Disable Controls**
    - **Validates: Requirements 2.5**

  - [x] 1.8 Write property test for button-to-service mapping
    - **Property 3: Button-to-Service Mapping**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 2. Checkpoint - Ensure AlarmControlManager tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Add control button styles
  - [x] 3.1 Create button styles in `src/styles/button-styles.ts`
    - Define base button styles using HA CSS custom properties
    - Define active, inactive, disabled, loading, and error states
    - Define compact mode variant styles
    - _Requirements: 1.4, 1.5, 2.4, 6.1, 6.2, 6.3_

  - [x] 3.2 Export button styles and integrate with card styles
    - Import button styles into card-styles.ts or component
    - _Requirements: 6.1_

- [x] 4. Extend AlarmDisplayRenderer for button rendering
  - [x] 4.1 Add `renderControlButtons()` method to AlarmDisplayRenderer
    - Render horizontal row of three buttons
    - Accept alarm state and button states as parameters
    - Accept click handler callback
    - _Requirements: 1.1, 1.3_

  - [x] 4.2 Add `renderControlButton()` method for single button
    - Render button with label, icon, and appropriate state classes
    - Include ARIA attributes (aria-label, aria-pressed, aria-disabled)
    - Handle click events
    - _Requirements: 5.1, 5.4, 5.5_

  - [x] 4.3 Write property test for ARIA labels
    - **Property 4: ARIA Labels Present**
    - **Validates: Requirements 5.1**

  - [x] 4.4 Write property test for ARIA pressed attribute
    - **Property 5: ARIA Pressed Reflects Active State**
    - **Validates: Requirements 5.4**

  - [x] 4.5 Write property test for ARIA disabled attribute
    - **Property 6: ARIA Disabled Reflects Disabled State**
    - **Validates: Requirements 5.5**

- [x] 5. Checkpoint - Ensure renderer tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Integrate control buttons into RingAlarmCard
  - [x] 6.1 Add button state management to RingAlarmCard
    - Add `@state() buttonStates` property as Map
    - Initialize button states in constructor or connectedCallback
    - _Requirements: 2.4, 3.5, 4.1_

  - [x] 6.2 Implement `_handleControlButtonClick()` method
    - Set loading state on clicked button
    - Call Home Assistant service via `this.hass.callService()`
    - Handle success: clear loading state
    - Handle failure: set error state, schedule clear after 3s
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.4_

  - [x] 6.3 Update render method to include control buttons
    - Call `AlarmDisplayRenderer.renderControlButtons()` after status display
    - Pass current alarm state, button states, and click handler
    - Only render when entity is valid and HASS is available
    - _Requirements: 1.1, 4.2, 4.3_

  - [x] 6.4 Write unit tests for button click handling
    - Test service call with correct parameters
    - Test loading state during service call
    - Test error state on service failure
    - Test error state clears after 3 seconds
    - _Requirements: 3.4, 3.5, 4.1, 4.4_

- [x] 7. Checkpoint - Ensure integration tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Final integration and cleanup
  - [x] 8.1 Update type exports in `src/types/index.ts`
    - Export all new types (ControlActionType, ControlAction, ControlButtonState)
    - _Requirements: N/A (code organization)_

  - [x] 8.2 Update demo page to showcase control buttons
    - Add example configuration showing control buttons
    - _Requirements: N/A (documentation)_

- [x] 9. Final checkpoint - All tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks including property tests are required for comprehensive coverage
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
