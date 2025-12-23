# Ring Alarm Card

A custom Home Assistant Lovelace card for Ring alarm systems built with the modern Lit framework.

## Purpose

This project provides a custom card component that integrates Ring alarm systems into Home Assistant's Lovelace dashboard interface. The card is designed to be:

- **Modern**: Built with Lit framework for reactive, fast components
- **Type-safe**: Full TypeScript support throughout
- **Themeable**: Proper Home Assistant theming integration
- **Configurable**: Flexible card properties and configuration options
- **Responsive**: Works across all screen sizes
- **Accessible**: Full ARIA support for screen readers

## Target Platform

- **Home Assistant**: Custom Lovelace card for HACS distribution
- **Browser Compatibility**: Modern browsers with ES2022, Web Components, and Shadow DOM support
- **Distribution**: Available through HACS (Home Assistant Community Store)

## Key Features

- **Alarm Status Display**: Shows current alarm state with icon and label
- **Control Buttons**: Disarm, Home, and Away buttons for quick state changes
- **Vacation Mode**: Optional toggle button for vacation mode via input_boolean entity
- **Transition Progress**: Visual progress indicator during arming/disarming countdowns
- **Error Handling**: Clear error messages with recovery guidance
- **Theme Integration**: Respects Home Assistant light/dark themes
- **Compact Mode**: Smaller layout option for space-constrained dashboards
- **Shadow DOM**: Style encapsulation prevents conflicts
- **Accessibility**: ARIA labels, live regions, and keyboard navigation

## Configuration Options

```yaml
type: custom:ring-alarm-card
entity: alarm_control_panel.ring_alarm  # Required
title: Ring Alarm                        # Optional
show_state_text: true                    # Optional, default: true
compact_mode: false                      # Optional, default: false
vacation_entity: input_boolean.vacation  # Optional
```