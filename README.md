# Ring Alarm Card

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![GitHub release](https://img.shields.io/github/release/username/ring-alarm-card.svg)](https://github.com/username/ring-alarm-card/releases)
[![License](https://img.shields.io/github/license/username/ring-alarm-card.svg)](LICENSE)

A custom Home Assistant Lovelace card for Ring alarm systems built with the modern Lit framework.

## Features

- 🚀 Built with modern Lit framework for fast, reactive components
- 📝 Full TypeScript support for better development experience
- 🎨 Proper Home Assistant theming integration
- ⚙️ Configurable card properties
- 🔒 Shadow DOM for style encapsulation
- 📱 Responsive design for all screen sizes

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to "Frontend" section
3. Click the "+" button in the bottom right
4. Search for "Ring Alarm Card"
5. Click "Install"
6. Restart Home Assistant

### Manual Installation

1. Download the `ring-alarm-card.js` file from the [latest release](https://github.com/username/ring-alarm-card/releases)
2. Copy it to your `config/www/` directory
3. Add the resource to your Lovelace configuration:

```yaml
resources:
  - url: /local/ring-alarm-card.js
    type: module
```

4. Restart Home Assistant

## Configuration

### Basic Configuration

Add the card to your Lovelace dashboard:

```yaml
type: custom:ring-alarm-card
title: "My Ring Alarm"
```

### Configuration Options

| Option | Type | Default | Required | Description |
|--------|------|---------|----------|-------------|
| `type` | string | - | ✅ | Must be `custom:ring-alarm-card` |
| `title` | string | "Custom Card" | ❌ | Card title to display |

### Example Configurations

#### Basic Card
```yaml
type: custom:ring-alarm-card
title: "Ring Security System"
```

#### Minimal Card
```yaml
type: custom:ring-alarm-card
```

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/username/ring-alarm-card.git
cd ring-alarm-card
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server with live reloading |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development with source maps |
| `npm run watch` | Build and watch for changes |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

### Project Structure

```
ring-alarm-card/
├── src/                    # Source code
│   ├── components/         # Card components
│   ├── config/            # Configuration management
│   ├── styles/            # CSS styles
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── config/                # Build configuration
├── dist/                  # Built files
├── demo/                  # Demo page
└── docs/                  # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

This project uses ESLint and Prettier for code formatting. Run `npm run lint` and `npm run format` before submitting PRs.

### Testing

All new features should include appropriate tests:
- Unit tests for individual components
- Property-based tests for configuration handling
- Integration tests for Home Assistant compatibility

Run tests with:
```bash
npm test
```

## Troubleshooting

### Card Not Showing Up

1. Ensure the resource is properly added to your Lovelace configuration
2. Check the browser console for any JavaScript errors
3. Verify Home Assistant has been restarted after installation

### Configuration Errors

The card will display error messages for invalid configurations. Common issues:
- Missing `type` field
- Incorrect `type` value (must be `custom:ring-alarm-card`)
- Invalid YAML syntax

### Browser Compatibility

This card requires a modern browser with support for:
- ES2020 features
- Web Components
- Shadow DOM

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 🐛 [Report bugs](https://github.com/username/ring-alarm-card/issues)
- 💡 [Request features](https://github.com/username/ring-alarm-card/issues)
- 💬 [Discussions](https://github.com/username/ring-alarm-card/discussions)

## Acknowledgments

- Built with [Lit](https://lit.dev/) framework
- Inspired by the Home Assistant community
- Thanks to all contributors