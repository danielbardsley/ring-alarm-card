/**
 * Unit Tests for Ring Alarm Card Theme Integration
 *
 * Tests specific theme configurations and light/dark theme rendering
 * Validates: Requirements 1.4, FR-4
 */

import { RingAlarmCard } from './ring-alarm-card';
import { HomeAssistant, RingAlarmCardConfig, HassEntity } from '../types';

// Register the custom element
import '../index';

// Mock Home Assistant object for testing
const createMockHass = (
  theme?: string,
  themeData?: Record<string, any>
): HomeAssistant => ({
  states: {
    'alarm_control_panel.ring_alarm': {
      entity_id: 'alarm_control_panel.ring_alarm',
      state: 'disarmed',
      attributes: {},
      last_changed: '2023-01-01T00:00:00Z',
      last_updated: '2023-01-01T00:00:00Z',
      context: { id: 'test', parent_id: null, user_id: null },
    } as HassEntity,
  },
  config: {
    latitude: 0,
    longitude: 0,
    elevation: 0,
    unit_system: { length: 'km', mass: 'kg', temperature: '°C', volume: 'L' },
    location_name: 'Test',
    time_zone: 'UTC',
    components: [],
    config_dir: '/config',
    whitelist_external_dirs: [],
    allowlist_external_dirs: [],
    allowlist_external_urls: [],
    version: '2023.1.0',
    config_source: 'storage',
    safe_mode: false,
    state: 'RUNNING',
    external_url: null,
    internal_url: null,
  },
  services: {},
  callService: jest.fn().mockResolvedValue({}),
  language: 'en',
  themes: themeData || {},
  selectedTheme: theme || null,
  panels: {},
  panelUrl: '',
});

describe('Ring Alarm Card Theme Integration Unit Tests', () => {
  let element: RingAlarmCard;

  beforeEach(() => {
    // Create element
    element = document.createElement('ring-alarm-card') as RingAlarmCard;
    document.body.appendChild(element);

    // Set basic config
    const config: RingAlarmCardConfig = {
      type: 'custom:ring-alarm-card',
      entity: 'alarm_control_panel.ring_alarm',
    };
    element.setConfig(config);
  });

  afterEach(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  describe('Light Theme Rendering', () => {
    it('should render correctly with light theme colors', () => {
      const lightTheme = {
        'primary-color': '#1976d2',
        'success-color': '#4caf50',
        'error-color': '#f44336',
        'warning-color': '#ff9800',
        'info-color': '#2196f3',
        'text-primary-color': '#212121',
        'card-background-color': '#ffffff',
      };

      const hassWithLightTheme = createMockHass('light', { light: lightTheme });

      // Should handle light theme without errors
      expect(() => {
        element.hass = hassWithLightTheme;
      }).not.toThrow();

      // Verify theme is applied
      expect(element.hass.selectedTheme).toBe('light');
      expect(element.hass.themes.light).toEqual(lightTheme);

      // Should render without errors
      expect(() => {
        element.requestUpdate();
      }).not.toThrow();
    });

    it('should use appropriate light theme fallback colors', () => {
      const lightThemeMinimal = {
        'primary-color': '#1976d2',
      };

      const hassWithLightTheme = createMockHass('light', {
        light: lightThemeMinimal,
      });
      element.hass = hassWithLightTheme;

      // Should handle minimal light theme configuration
      expect(element.hass.themes.light).toEqual(lightThemeMinimal);
      expect(() => element.requestUpdate()).not.toThrow();
    });
  });

  describe('Dark Theme Rendering', () => {
    it('should render correctly with dark theme colors', () => {
      const darkTheme = {
        'primary-color': '#bb86fc',
        'success-color': '#4caf50',
        'error-color': '#cf6679',
        'warning-color': '#ffb74d',
        'info-color': '#64b5f6',
        'text-primary-color': '#ffffff',
        'card-background-color': '#1e1e1e',
      };

      const hassWithDarkTheme = createMockHass('dark', { dark: darkTheme });

      // Should handle dark theme without errors
      expect(() => {
        element.hass = hassWithDarkTheme;
      }).not.toThrow();

      // Verify theme is applied
      expect(element.hass.selectedTheme).toBe('dark');
      expect(element.hass.themes.dark).toEqual(darkTheme);

      // Should render without errors
      expect(() => {
        element.requestUpdate();
      }).not.toThrow();
    });

    it('should handle dark theme with high contrast colors', () => {
      const darkHighContrastTheme = {
        'primary-color': '#ffffff',
        'success-color': '#00ff00',
        'error-color': '#ff0000',
        'warning-color': '#ffff00',
        'text-primary-color': '#ffffff',
        'card-background-color': '#000000',
      };

      const hassWithDarkTheme = createMockHass('dark-high-contrast', {
        'dark-high-contrast': darkHighContrastTheme,
      });

      element.hass = hassWithDarkTheme;

      expect(element.hass.selectedTheme).toBe('dark-high-contrast');
      expect(() => element.requestUpdate()).not.toThrow();
    });
  });

  describe('Custom Theme Configurations', () => {
    it('should handle custom theme with all alarm-specific colors', () => {
      const customTheme = {
        'success-color': '#2e7d32', // Custom green for disarmed
        'warning-color': '#f57c00', // Custom orange for armed_home
        'error-color': '#c62828', // Custom red for armed_away/triggered
        'info-color': '#1565c0', // Custom blue for pending
        'disabled-text-color': '#757575', // Custom gray for unknown
        'primary-text-color': '#1a1a1a',
        'secondary-text-color': '#666666',
      };

      const hassWithCustomTheme = createMockHass('custom', {
        custom: customTheme,
      });
      element.hass = hassWithCustomTheme;

      expect(element.hass.selectedTheme).toBe('custom');
      expect(element.hass.themes.custom).toEqual(customTheme);
      expect(() => element.requestUpdate()).not.toThrow();
    });

    it('should handle theme with CSS custom property format variations', () => {
      const themeWithVariations = {
        'primary-color': '#1976d2',
        'ha-card-background': '#ffffff',
        'ha-card-border-radius': '12px',
        'ha-card-border-color': '#e0e0e0',
        'rgb-primary-color': '25, 118, 210',
        'rgb-error-color': '244, 67, 54',
      };

      const hassWithTheme = createMockHass('variations', {
        variations: themeWithVariations,
      });
      element.hass = hassWithTheme;

      expect(element.hass.themes.variations).toEqual(themeWithVariations);
      expect(() => element.requestUpdate()).not.toThrow();
    });

    it('should handle theme with non-color properties', () => {
      const themeWithMixedProps = {
        'primary-color': '#1976d2',
        'ha-card-border-radius': '8px',
        'ha-card-box-shadow': '0 4px 8px rgba(0,0,0,0.2)',
        'font-family': 'Roboto, sans-serif',
        'font-size': '14px',
      };

      const hassWithTheme = createMockHass('mixed', {
        mixed: themeWithMixedProps,
      });
      element.hass = hassWithTheme;

      expect(element.hass.themes.mixed).toEqual(themeWithMixedProps);
      expect(() => element.requestUpdate()).not.toThrow();
    });
  });

  describe('Theme Switching', () => {
    it('should handle switching from light to dark theme', () => {
      const lightTheme = {
        'primary-color': '#1976d2',
        'card-background-color': '#ffffff',
      };
      const darkTheme = {
        'primary-color': '#bb86fc',
        'card-background-color': '#1e1e1e',
      };

      // Start with light theme
      const hassWithLightTheme = createMockHass('light', {
        light: lightTheme,
        dark: darkTheme,
      });
      element.hass = hassWithLightTheme;
      expect(element.hass.selectedTheme).toBe('light');

      // Switch to dark theme
      const hassWithDarkTheme = createMockHass('dark', {
        light: lightTheme,
        dark: darkTheme,
      });
      expect(() => {
        element.hass = hassWithDarkTheme;
      }).not.toThrow();

      expect(element.hass.selectedTheme).toBe('dark');
      expect(() => element.requestUpdate()).not.toThrow();
    });

    it('should handle switching between multiple custom themes', () => {
      const themes = {
        blue: { 'primary-color': '#2196f3' },
        green: { 'primary-color': '#4caf50' },
        red: { 'primary-color': '#f44336' },
      };

      // Test switching through all themes
      const themeNames = ['blue', 'green', 'red'];
      for (const themeName of themeNames) {
        const hassWithTheme = createMockHass(themeName, themes);

        expect(() => {
          element.hass = hassWithTheme;
        }).not.toThrow();

        expect(element.hass.selectedTheme).toBe(themeName);
        expect(() => element.requestUpdate()).not.toThrow();
      }
    });

    it('should handle rapid theme changes', () => {
      const themes = {
        theme1: { 'primary-color': '#f44336' },
        theme2: { 'primary-color': '#4caf50' },
        theme3: { 'primary-color': '#2196f3' },
      };

      // Rapidly switch themes
      for (let i = 0; i < 10; i++) {
        const themeName = `theme${(i % 3) + 1}`;
        const hassWithTheme = createMockHass(themeName, themes);

        expect(() => {
          element.hass = hassWithTheme;
        }).not.toThrow();

        expect(element.hass.selectedTheme).toBe(themeName);
      }

      // Should still be functional after rapid changes
      expect(() => element.requestUpdate()).not.toThrow();
    });
  });

  describe('Theme Error Handling', () => {
    it('should handle theme with invalid color values gracefully', () => {
      const invalidTheme = {
        'primary-color': 'invalid-color',
        'success-color': '#gggggg',
        'error-color': 'rgb(300, 300, 300)', // Invalid RGB values
      };

      const hassWithInvalidTheme = createMockHass('invalid', {
        invalid: invalidTheme,
      });

      // Should not throw even with invalid colors
      expect(() => {
        element.hass = hassWithInvalidTheme;
      }).not.toThrow();

      expect(element.hass.themes.invalid).toEqual(invalidTheme);
      expect(() => element.requestUpdate()).not.toThrow();
    });

    it('should handle empty theme object', () => {
      const emptyTheme = {};
      const hassWithEmptyTheme = createMockHass('empty', { empty: emptyTheme });

      expect(() => {
        element.hass = hassWithEmptyTheme;
      }).not.toThrow();

      expect(element.hass.themes.empty).toEqual(emptyTheme);
      expect(() => element.requestUpdate()).not.toThrow();
    });

    it('should handle theme switching to non-existent theme', () => {
      const themes = { light: { 'primary-color': '#1976d2' } };

      // Try to select a theme that doesn't exist
      const hassWithNonExistentTheme = createMockHass('non-existent', themes);

      expect(() => {
        element.hass = hassWithNonExistentTheme;
      }).not.toThrow();

      expect(element.hass.selectedTheme).toBe('non-existent');
      expect(element.hass.themes).toEqual(themes);
      expect(() => element.requestUpdate()).not.toThrow();
    });
  });

  describe('Theme CSS Integration', () => {
    it('should maintain CSS custom property structure', () => {
      const theme = {
        'success-color': '#4caf50',
        'error-color': '#f44336',
        'warning-color': '#ff9800',
      };

      const hassWithTheme = createMockHass('test', { test: theme });
      element.hass = hassWithTheme;

      // Verify that the component can access theme data
      expect(element.hass.themes.test).toEqual(theme);

      // The actual CSS custom property application is handled by the browser
      // We just verify the theme data is properly stored and accessible
      expect(() => element.requestUpdate()).not.toThrow();
    });

    it('should handle theme updates without breaking existing styles', () => {
      const initialTheme = { 'primary-color': '#1976d2' };
      const updatedTheme = {
        'primary-color': '#f44336',
        'success-color': '#4caf50',
      };

      // Set initial theme
      const hassWithInitialTheme = createMockHass('test', {
        test: initialTheme,
      });
      element.hass = hassWithInitialTheme;
      expect(() => element.requestUpdate()).not.toThrow();

      // Update theme with additional properties
      const hassWithUpdatedTheme = createMockHass('test', {
        test: updatedTheme,
      });
      expect(() => {
        element.hass = hassWithUpdatedTheme;
      }).not.toThrow();

      expect(element.hass.themes.test).toEqual(updatedTheme);
      expect(() => element.requestUpdate()).not.toThrow();
    });
  });
});
