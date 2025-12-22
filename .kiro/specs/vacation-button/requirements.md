# Requirements Document

## Introduction

This feature adds a fourth "Vacation" toggle button to the Ring Alarm Card. Unlike the existing alarm control buttons (Disarm, Home, Away) which control the alarm state, the Vacation button is a simple toggle that controls a configurable `input_boolean` entity. It operates independently of the alarm armed/disarmed states and provides a visual indicator for vacation mode status.

## Glossary

- **Ring_Alarm_Card**: The custom Lovelace card component for Ring alarm system integration
- **Vacation_Button**: A toggle button that controls an input_boolean entity for vacation mode
- **Input_Boolean**: A Home Assistant helper entity that stores a boolean (on/off) state
- **Control_Buttons**: The row of buttons displayed on the card for controlling alarm and vacation states
- **Configuration_Manager**: The module responsible for validating and merging card configuration

## Requirements

### Requirement 1: Vacation Button Configuration

**User Story:** As a user, I want to configure an optional vacation mode entity, so that I can enable vacation mode functionality on my Ring Alarm Card.

#### Acceptance Criteria

1. THE Configuration_Manager SHALL accept an optional `vacation_entity` field in the card configuration
2. WHEN `vacation_entity` is provided, THE Configuration_Manager SHALL validate that it follows the `input_boolean.*` entity ID format
3. WHEN `vacation_entity` is provided with an invalid format, THE Configuration_Manager SHALL throw a descriptive error message
4. WHEN `vacation_entity` is not provided, THE Ring_Alarm_Card SHALL not display the Vacation_Button
5. WHEN `vacation_entity` is provided but the entity does not exist in Home Assistant, THE Ring_Alarm_Card SHALL display an appropriate error state

### Requirement 2: Vacation Button Display

**User Story:** As a user, I want to see a vacation button alongside the alarm control buttons, so that I can easily toggle vacation mode.

#### Acceptance Criteria

1. WHEN `vacation_entity` is configured and valid, THE Ring_Alarm_Card SHALL display the Vacation_Button in the control buttons row
2. THE Vacation_Button SHALL display a vacation-appropriate icon (mdi:beach)
3. THE Vacation_Button SHALL display the label "Vacation"
4. THE Vacation_Button SHALL be positioned after the existing alarm control buttons (Disarm, Home, Away)
5. THE Vacation_Button SHALL use consistent styling with the existing control buttons

### Requirement 3: Vacation Button State Reflection

**User Story:** As a user, I want the vacation button to reflect the current state of my vacation mode entity, so that I can see at a glance whether vacation mode is active.

#### Acceptance Criteria

1. WHEN the `input_boolean` entity state is "on", THE Vacation_Button SHALL display in an active/highlighted state
2. WHEN the `input_boolean` entity state is "off", THE Vacation_Button SHALL display in an inactive state
3. WHEN the `input_boolean` entity state changes, THE Vacation_Button SHALL update its visual state accordingly
4. THE Vacation_Button active state SHALL use a distinct color (info/blue) to differentiate from alarm states

### Requirement 4: Vacation Button Toggle Action

**User Story:** As a user, I want to toggle vacation mode by clicking the vacation button, so that I can easily enable or disable vacation mode.

#### Acceptance Criteria

1. WHEN a user clicks the Vacation_Button, THE Ring_Alarm_Card SHALL call the appropriate Home Assistant service to toggle the input_boolean
2. WHEN the `input_boolean` is "off" and the button is clicked, THE Ring_Alarm_Card SHALL call `input_boolean.turn_on`
3. WHEN the `input_boolean` is "on" and the button is clicked, THE Ring_Alarm_Card SHALL call `input_boolean.turn_off`
4. WHILE the service call is in progress, THE Vacation_Button SHALL display a loading indicator
5. IF the service call fails, THE Vacation_Button SHALL display an error state and recover after a timeout

### Requirement 5: Vacation Button Independence

**User Story:** As a user, I want the vacation button to work independently of the alarm state, so that I can toggle vacation mode regardless of whether the alarm is armed or disarmed.

#### Acceptance Criteria

1. THE Vacation_Button SHALL remain enabled regardless of the current alarm state (armed, disarmed, arming, etc.)
2. THE Vacation_Button state SHALL not affect or be affected by alarm state transitions
3. WHEN the alarm is in a transitional state (arming, disarming, pending), THE Vacation_Button SHALL still be clickable
4. THE Vacation_Button SHALL not participate in alarm transition progress indicators
