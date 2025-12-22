# Implementation Plan: Alarm State Transitions

## Overview

This implementation plan breaks down the alarm state transitions and progress indicator feature into discrete coding tasks. Each task builds incrementally on previous work, ensuring the feature is developed in a testable and maintainable way.

## Tasks

- [x] 1. Create TransitionStateManager utility class
  - [x] 1.1 Create `src/utils/transition-state-manager.ts` with type definitions
    - Define `TransitionState` interface
    - Export types from `src/types/index.ts`
    - _Requirements: 2.1, 3.1, 4.1, 4.2, 4.3_

  - [x] 1.2 Implement `isTransitionalState()` method
    - Return true for 'arming', 'pending', 'disarming' states
    - Return false for all other states
    - _Requirements: 2.1, 2.5_

  - [x] 1.3 Implement `getTransitionTarget()` method
    - For 'arming' state, determine target from entity attributes (next_state or similar)
    - For 'pending' state, return the currently armed state
    - Return null for non-transitional states
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 1.4 Implement `calculateProgress()` method
    - Calculate progress as ((totalDuration - exitSecondsLeft) / totalDuration) * 100
    - Clamp result to [0, 100] range
    - Handle edge cases (zero duration, negative values)
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 1.5 Write property test for transitional state detection
    - **Property 1: Transitional State Detection**
    - **Validates: Requirements 2.1, 2.5**

  - [x] 1.6 Write property test for progress calculation accuracy
    - **Property 3: Progress Calculation Accuracy**
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 2. Checkpoint - Ensure TransitionStateManager tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Add progress indicator styles
  - [x] 3.1 Add progress indicator CSS to `src/styles/button-styles.ts`
    - Add `.transitioning` class with `::before` pseudo-element
    - Implement conic-gradient background for progress effect
    - Add mask to show only border area
    - Define `--progress-percent` and `--progress-color` custom properties
    - _Requirements: 2.2, 2.3, 6.1, 6.4_

  - [x] 3.2 Add theme-specific progress colors
    - Set `--progress-color` based on target action (home=warning, away=error)
    - Ensure visibility in light and dark themes
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 3.3 Add reduced motion support for progress indicator
    - Disable animation when `prefers-reduced-motion: reduce`
    - Show static progress state instead
    - _Requirements: 5.3, 5.4_

  - [x] 3.4 Update state transition animations to 300ms
    - Ensure button state transitions use 300ms duration
    - Add transition properties for background, border, color
    - _Requirements: 1.4_

- [x] 4. Extend AlarmDisplayRenderer for transition states
  - [x] 4.1 Update `renderControlButton()` to support transition state
    - Add `transitioning` class when button is transition target
    - Set `--progress-percent` CSS custom property from progress value
    - Set `--progress-color` based on action type
    - _Requirements: 2.1, 4.4_

  - [x] 4.2 Update ARIA label for transitioning buttons
    - Include countdown status in aria-label (e.g., "Arming away - 30 seconds remaining")
    - _Requirements: 5.1_

  - [x] 4.3 Add ARIA live region for state announcements
    - Add live region element to control buttons container
    - Update announcement when entering transitional state
    - _Requirements: 5.2_

  - [x] 4.4 Write property test for progress indicator presence
    - **Property 2: Progress Indicator Presence**
    - **Validates: Requirements 2.1, 2.5**

  - [x] 4.5 Write property test for target button identification
    - **Property 4: Target Button Identification**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

  - [x] 4.6 Write property test for ARIA label on progress indicator
    - **Property 5: ARIA Label on Progress Indicator**
    - **Validates: Requirements 5.1**

  - [x] 4.7 Write property test for ARIA live region updates
    - **Property 6: ARIA Live Region Updates**
    - **Validates: Requirements 5.2**

- [x] 5. Checkpoint - Ensure renderer tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Integrate transition state into RingAlarmCard
  - [x] 6.1 Add transition state tracking to RingAlarmCard
    - Add `@state() transitionState: TransitionState` property
    - Track `totalDuration` when transition starts (capture initial exitSecondsLeft)
    - _Requirements: 3.1, 3.2_

  - [x] 6.2 Update state change handling for transitions
    - Detect when alarm enters transitional state
    - Capture initial exitSecondsLeft as totalDuration
    - Update progress as exitSecondsLeft changes
    - Clear transition state when alarm exits transitional state
    - _Requirements: 2.1, 2.5, 3.3, 3.4_

  - [x] 6.3 Pass transition state to button rendering
    - Extend buttonStates Map to include transition properties
    - Pass progress and target information to renderControlButtons
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 6.4 Handle rapid state changes
    - Cancel previous transition when new state change occurs
    - Apply latest state immediately
    - _Requirements: 1.5_

  - [x] 6.5 Write unit tests for transition state integration
    - Test transition state tracking on state change
    - Test progress updates as exitSecondsLeft decreases
    - Test transition cleanup on state exit
    - Test rapid state change handling
    - _Requirements: 1.5, 2.1, 2.5, 3.1, 3.2, 3.3, 3.4_

- [x] 7. Checkpoint - Ensure integration tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Final integration and cleanup
  - [x] 8.1 Update type exports in `src/types/index.ts`
    - Export `TransitionState` interface
    - _Requirements: N/A (code organization)_

  - [x] 8.2 Update demo page to showcase transitions
    - Add example showing transitional states
    - Add controls to simulate countdown
    - _Requirements: N/A (documentation)_

- [x] 9. Final checkpoint - All tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks including property tests are required for comprehensive coverage
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
