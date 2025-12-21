# Ring Alarm Card

A custom Home Assistant Lovelace card for Ring alarm systems built with the Lit framework.

## Features

- **Real-time Alarm Status**: Display current Ring alarm system state (disarmed, armed-home, armed-away, pending, triggered)
- **Visual State Indicators**: Color-coded icons and text for each alarm state
- **Home Assistant Integration**: Automatic updates when alarm state changes
- **Theme Support**: Adapts to Home Assistant light/dark themes
- **Configurable Display**: Optional state text and compact mode
- **Error Handling**: Clear error messages with helpful guidance
- **Accessibility**: Full ARIA support for screen readers

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to "Frontend" section
3. Click the "+" button to add a new repository
4. Search for "Ring Alarm Card" or add this repository URL
5. Install the card
6. Add the card resource to your Lovelace configuration

### Manual Installation

1. Download the `ring-alarm-card.js` file from the latest release
2. Copy it to your `config/www/` directory
3. Add the resource to your Lovelace configuration:

```yaml
resources:
  - url: /local/ring-alarm-card.js
    type: module
```

## Prerequisites

- Home Assistant 2023.1 or later
- Ring integration installed and configured
- At least one `alarm_control_panel` entity from Ring integration

## Configuration

Add the card to your Lovelace dashboard:

```yaml
type: custom:ring-alarm-card
entity: alarm_control_panel.ring_alarm
title: "Ring Alarm System"
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | **Required** | Must be `custom:ring-alarm-card` |
| `entity` | string | **Required** | Ring alarm entity ID (e.g., `alarm_control_panel.ring_alarm`) |
| `title` | string | "Ring Alarm" | Card title to display |
| `show_state_text` | boolean | `true` | Show state text alongside icon |
| `compact_mode` | boolean | `false` | Use compact display mode |

### Example Configurations

**Basic Configuration:**
```yaml
type: custom:ring-alarm-card
entity: alarm_control_panel.ring_alarm
```

**Full Configuration:**
```yaml
type: custom:ring-alarm-card
entity: alarm_control_panel.ring_alarm
title: "Home Security System"
show_state_text: true
compact_mode: false
```

**Compact Mode:**
```yaml
type: custom:ring-alarm-card
entity: alarm_control_panel.ring_alarm
title: "Alarm"
show_state_text: false
compact_mode: true
```

## Alarm States

The card displays the following alarm states with appropriate colors and icons:

- **Disarmed** (Green): System is off
- **Armed Home** (Orange): System is armed for home occupancy
- **Armed Away** (Red): System is fully armed
- **Pending** (Blue, animated): System is arming/disarming
- **Triggered** (Red, flashing): Alarm has been triggered
- **Unknown** (Gray): State cannot be determined

## Troubleshooting

### Common Issues

**"Entity not found" error:**
- Verify the Ring integration is installed and working
- Check that the entity ID is correct (e.g., `alarm_control_panel.ring_alarm`)
- Ensure the entity exists in Developer Tools > States

**"Entity unavailable" error:**
- Check your Ring device connectivity
- Verify the Ring integration is functioning
- This may be temporary - the card will recover automatically

**Configuration errors:**
- Ensure `entity` field is provided and is a string
- Verify the entity domain is `alarm_control_panel`
- Check YAML syntax in your dashboard configuration

## Support

For issues and feature requests, please use the GitHub repository.