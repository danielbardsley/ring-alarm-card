# Technology Stack

## Core Framework & Language

- **Lit 3.1.0**: Modern web components framework for reactive UI
- **TypeScript 5.3.3**: Strict type checking with ES2022 target
- **ES Modules**: Modern module system with bundler resolution

## Build System

- **Rollup 4.9.6**: Module bundler with ES output format
- **TypeScript Plugin**: Direct TS compilation in build pipeline
- **Terser**: Production minification and optimization
- **Source Maps**: Development debugging support

## Development Tools

- **Web Dev Server**: Live reloading development server
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting with consistent style
- **Husky**: Git hooks for pre-commit validation

## Testing Framework

- **Jest 29.7.0**: Testing framework with jsdom environment
- **ts-jest**: TypeScript transformation for Jest
- **Fast-check**: Property-based testing library
- **Coverage**: 80% threshold for branches, functions, lines, statements

## Code Quality Standards

- **Strict TypeScript**: All strict compiler options enabled
- **ESLint Rules**: TypeScript-specific linting with Prettier integration
- **Path Aliases**: `@/*` maps to `src/*` for clean imports

## Common Commands

### Development
```bash
npm start              # Start dev server with live reload
npm run build:dev      # Development build with source maps
npm run watch          # Build and watch for changes
```

### Production
```bash
npm run build          # Production build (minified + gzipped)
npm run release        # Full release pipeline (build + test + lint)
```

### Testing
```bash
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
npm run test:property  # Run property-based tests only
```

### Code Quality
```bash
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

## Build Configuration

- **Entry Point**: `src/index.ts`
- **Output**: `dist/ring-alarm-card.js` (ES module format)
- **External Dependencies**: None (all bundled)
- **Development**: Source maps and unminified output
- **Production**: Minified, tree-shaken, with gzipped version