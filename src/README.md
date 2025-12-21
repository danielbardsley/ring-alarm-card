# Ring Alarm Card - Source Structure

This directory contains the modular source code for the Ring Alarm Card custom Home Assistant component.

## Directory Structure

```
src/
├── components/           # React-like components
│   └── ring-alarm-card.ts   # Main card component
├── config/              # Configuration management
│   └── configuration-manager.ts
├── registration/        # Home Assistant registration
│   └── card-registration.ts
├── styles/              # CSS styles
│   └── card-styles.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── hass-utils.ts
├── test/                # Test setup and utilities
│   └── setup.ts
├── index.ts             # Main entry point
├── ring-alarm-card.ts   # Legacy entry point (backward compatibility)
├── ring-alarm-card.test.ts  # Main test file
└── example.test.ts      # Example tests
```

## Module Responsibilities

### `components/`
Contains the main UI components built with Lit framework. Each component should be self-contained and focused on a specific UI concern.

### `config/`
Configuration management utilities including validation, defaults, and merging logic.

### `registration/`
Home Assistant integration code including custom card registration and global type declarations.

### `styles/`
CSS-in-JS styles using Lit's `css` template literal. Organized by component or feature.

### `types/`
TypeScript type definitions for Home Assistant interfaces, card configuration, and internal types.

### `utils/`
Pure utility functions that can be used across components. Should be stateless and testable.

### `test/`
Test setup, mocks, and shared testing utilities.

## Entry Points

- **`index.ts`**: Main entry point for the bundled application
- **`ring-alarm-card.ts`**: Legacy entry point for backward compatibility

## Development Guidelines

1. **Single Responsibility**: Each module should have a single, well-defined responsibility
2. **Dependency Direction**: Dependencies should flow inward (components → utils, not utils → components)
3. **Type Safety**: All modules should be fully typed with TypeScript
4. **Testing**: Each module should be testable in isolation
5. **Documentation**: Public APIs should be documented with JSDoc comments

## Building

The build system uses the main entry point (`src/index.ts`) to create the bundled output in `dist/ring-alarm-card.js`.