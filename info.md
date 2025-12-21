# Ring Alarm Card

A custom Home Assistant Lovelace card for Ring alarm systems built with the Lit framework.

## Features

- Built with modern Lit framework for fast, reactive components
- TypeScript support for better development experience
- Proper Home Assistant theming integration
- Configurable card title and properties
- Shadow DOM for style encapsulation

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

## Configuration

Add the card to your Lovelace dashboard:

```yaml
type: custom:ring-alarm-card
title: "My Ring Alarm"
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | **Required** | Must be `custom:ring-alarm-card` |
| `title` | string | "Custom Card" | Card title to display |

## Support

For issues and feature requests, please use the GitHub repository.