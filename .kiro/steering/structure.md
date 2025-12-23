# Project Structure

## Root Directory Organization

```
ring-alarm-card/
├── src/                    # Source code (main development area)
├── config/                 # Build configuration files
├── dist/                   # Built output files (generated)
├── demo/                   # Demo pages for development
├── coverage/               # Test coverage reports (generated)
├── node_modules/           # Dependencies (generated)
└── docs/                   # Documentation files
```

## Source Code Structure (`src/`)

```
src/
├── components/             # Lit components
│   └── ring-alarm-card.ts  # Main card component
├── config/                 # Configuration management
│   └── configuration-manager.ts
├── registration/           # Card registration logic
│   └── card-registration.ts
├── styles/                 # CSS-in-JS styles
│   ├── card-styles.ts      # Main card styles
│   ├── alarm-styles.ts     # Alarm status styles
│   └── button-styles.ts    # Control button styles
├── types/                  # TypeScript type definitions
│   └── index.ts
├── utils/                  # Utility modules
│   ├── hass-utils.ts              # Home Assistant utilities
│   ├── alarm-state-manager.ts     # Alarm state mapping
│   ├── alarm-control-manager.ts   # Button actions and services
│   ├── alarm-display-renderer.ts  # UI rendering utilities
│   ├── transition-state-manager.ts # Progress indicator logic
│   └── vacation-button-manager.ts  # Vacation toggle logic
├── test/                   # Test utilities and setup
│   └── setup.ts
├── index.ts                # Main entry point
└── *.test.ts               # Test files (co-located)
```

## Architecture Patterns

### Component Structure
- **Main Component**: `src/components/ring-alarm-card.ts`
- **Lit Decorators**: Use `@customElement`, `@property`, `@state`
- **Shadow DOM**: All components use shadow DOM for encapsulation
- **CSS-in-JS**: Styles defined in separate files, imported as `static styles`

### Configuration Management
- **Centralized**: `ConfigurationManager` handles all config validation and merging
- **Type Safety**: All configs use TypeScript interfaces
- **Validation**: Strict validation with helpful error messages

### Testing Strategy
- **Co-located Tests**: Test files next to source files (`*.test.ts`)
- **Test Categories**: Unit, integration, property-based, and distribution tests
- **Test Setup**: Shared setup in `src/test/setup.ts`
- **Coverage**: Minimum 80% coverage required

### Import Conventions
- **Path Aliases**: Use `@/` for src imports (configured in tsconfig)
- **Relative Imports**: For same-directory imports
- **Barrel Exports**: Use `index.ts` files for clean public APIs

### File Naming
- **Components**: kebab-case matching custom element names
- **Utilities**: kebab-case with descriptive names
- **Types**: PascalCase interfaces, camelCase for type aliases
- **Tests**: Same name as source file with `.test.ts` suffix

## Build Output Structure (`dist/`)

```
dist/
├── ring-alarm-card.js      # Main bundle (ES module)
├── ring-alarm-card.js.gz   # Gzipped version (production)
└── ring-alarm-card.js.map  # Source map (development)
```

## Configuration Files

- **TypeScript**: `tsconfig.json` with strict settings
- **Build**: `config/rollup.config.mjs` for bundling
- **Linting**: `.eslintrc.json` with TypeScript rules
- **Formatting**: `.prettierrc.json` for consistent style
- **Testing**: `jest.config.cjs` with jsdom environment
- **Git Hooks**: `.husky/` for pre-commit validation

## Development Workflow

1. **Entry Point**: All development starts from `src/index.ts`
2. **Component Development**: Create/modify components in `src/components/`
3. **Style Development**: CSS-in-JS in `src/styles/`
4. **Type Definitions**: Add types to `src/types/`
5. **Testing**: Co-locate tests with source files
6. **Build**: Use `npm run build` for production output