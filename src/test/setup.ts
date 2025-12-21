// Jest setup file for Ring Alarm Card tests
import 'jest-environment-jsdom';

// Mock Lit framework components
jest.mock('lit', () => ({
  LitElement: class MockLitElement extends HTMLElement {
    static styles = {};
    requestUpdate = jest.fn().mockResolvedValue(undefined);
    updateComplete = Promise.resolve();

    constructor() {
      super();
      // Create a mock shadow root using Object.defineProperty
      const mockShadowRoot = document.createElement('div');
      Object.defineProperty(this, 'shadowRoot', {
        value: mockShadowRoot,
        writable: false,
        configurable: true,
      });
    }
  },
  html: jest.fn((strings, ...values) => {
    return strings.join('') + values.join('');
  }),
  css: jest.fn((strings, ...values) => {
    return strings.join('') + values.join('');
  }),
  TemplateResult: class MockTemplateResult {},
  PropertyValues: class MockPropertyValues extends Map {},
}));

jest.mock('lit/decorators.js', () => ({
  customElement: (tagName: string) => (target: any) => {
    // Mock custom element registration
    if (!customElements.get(tagName)) {
      customElements.define(tagName, target);
    }
    return target;
  },
  property: () => () => {
    // Mock property decorator
  },
  state: () => () => {
    // Mock state decorator
  },
}));

// Mock Home Assistant globals
declare global {
  interface Window {
    customCards?: any[];
    loadCardHelpers?: () => Promise<any>;
  }
}

// Setup JSDOM environment for web components
Object.defineProperty(window, 'customElements', {
  value: global.customElements,
  writable: true,
});

// Mock Home Assistant card helpers
window.loadCardHelpers = jest.fn().mockResolvedValue({
  createCardElement: jest.fn(),
  getLovelaceCards: jest.fn().mockReturnValue([]),
});

// Setup custom cards array
window.customCards = window.customCards || [];

// Mock CSS custom properties for theming tests
Object.defineProperty(document.documentElement.style, 'getPropertyValue', {
  value: jest.fn().mockReturnValue(''),
  writable: true,
});

// Add console error suppression for expected test errors
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

export {};
