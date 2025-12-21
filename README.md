# Ring Alarm Card

A custom Home Assistant Lovelace card for Ring alarm systems built with Lit framework.

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

### Scripts

- `npm start` - Start development server with live reloading
- `npm run build` - Build for production
- `npm run build:dev` - Build for development with source maps
- `npm run watch` - Build and watch for changes
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Installation

This card will be available through HACS (Home Assistant Community Store).

## Configuration

```yaml
type: custom:ring-alarm-card
title: "My Ring Alarm"
```

## License

MIT