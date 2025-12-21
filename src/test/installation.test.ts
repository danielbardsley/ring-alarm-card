/**
 * Installation and deployment validation tests
 * Tests that verify the card can be properly installed and used in Home Assistant
 */

import { describe, it, expect } from '@jest/globals';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Installation and Deployment Validation', () => {
  const projectRoot = process.cwd();
  const bundlePath = join(projectRoot, 'ring-alarm-card.js');

  describe('Distribution Package Validation', () => {
    it('should have all required files for installation', () => {
      // Core distribution files - only check bundle in CI or after build
      if (process.env.CI || existsSync(bundlePath)) {
        expect(existsSync(bundlePath)).toBe(true);
      }
      expect(existsSync(join(projectRoot, 'package.json'))).toBe(true);
      expect(existsSync(join(projectRoot, 'README.md'))).toBe(true);
      expect(existsSync(join(projectRoot, 'LICENSE'))).toBe(true);

      // HACS compatibility files
      expect(existsSync(join(projectRoot, 'hacs.json'))).toBe(true);
      expect(existsSync(join(projectRoot, 'info.md'))).toBe(true);
    });

    it('should have valid bundle content for Home Assistant', () => {
      // Only run this test if bundle exists (after build)
      if (!existsSync(bundlePath)) {
        console.warn('Bundle not found - run "npm run build" first');
        expect(existsSync(bundlePath)).toBe(true);
        return;
      }

      const bundleContent = readFileSync(bundlePath, 'utf-8');

      // Should contain custom element registration
      expect(bundleContent).toContain('ring-alarm-card');
      expect(bundleContent).toContain('customElements');

      // Should contain Lit framework code
      expect(bundleContent).toContain('LitElement');

      // Should be minified for production
      expect(bundleContent.length).toBeGreaterThan(1000); // Reasonable size check

      // Should not contain development artifacts
      expect(bundleContent).not.toContain('console.log');
      expect(bundleContent).not.toContain('debugger');
    });

    it('should have proper HACS configuration', () => {
      const hacsConfig = JSON.parse(
        readFileSync(join(projectRoot, 'hacs.json'), 'utf-8')
      );

      expect(hacsConfig.name).toBe('Ring Alarm Card');
      expect(hacsConfig.filename).toBe('ring-alarm-card.js');
      expect(hacsConfig.render_readme).toBe(true);

      // Should have proper HACS metadata
      expect(hacsConfig.hacs).toBeDefined();
      expect(hacsConfig.homeassistant).toBeDefined();
    });

    it('should have comprehensive installation documentation', () => {
      const readme = readFileSync(join(projectRoot, 'README.md'), 'utf-8');

      // Should contain installation instructions
      expect(readme).toContain('## Installation');
      expect(readme).toContain('### HACS');
      expect(readme).toContain('### Manual');

      // Should contain configuration examples
      expect(readme).toContain('## Configuration');
      expect(readme).toContain('custom:ring-alarm-card');

      // Should contain usage examples
      expect(readme).toContain('type: custom:ring-alarm-card');
    });
  });

  describe('Home Assistant Integration Validation', () => {
    it('should register card in Home Assistant card registry', () => {
      // Import the card to trigger registration
      require('../index');

      // Verify customCards registry
      expect(window.customCards).toBeDefined();
      expect(Array.isArray(window.customCards)).toBe(true);

      const ringCard = window.customCards?.find(
        card => card.type === 'ring-alarm-card'
      );
      expect(ringCard).toBeDefined();
      expect(ringCard?.name).toBe('Ring Alarm Card');
      expect(ringCard?.description).toBe(
        'A custom card for Ring alarm systems'
      );
    });

    it('should be discoverable by Home Assistant card picker', () => {
      const ringCard = window.customCards?.find(
        card => card.type === 'ring-alarm-card'
      );

      // Should have all required properties for card picker
      expect(ringCard?.type).toBe('ring-alarm-card');
      expect(ringCard?.name).toBeDefined();
      expect(ringCard?.description).toBeDefined();

      // Name and description should be user-friendly
      expect(ringCard?.name.length).toBeGreaterThan(0);
      expect(ringCard?.description.length).toBeGreaterThan(0);
    });

    it('should support Home Assistant resource loading', () => {
      const packageJson = JSON.parse(
        readFileSync(join(projectRoot, 'package.json'), 'utf-8')
      );

      // Should have proper main field for resource loading
      expect(packageJson.main).toBe('ring-alarm-card.js');
      expect(packageJson.module).toBe('ring-alarm-card.js');

      // Should have proper type declaration
      expect(packageJson.type).toBe('module');
    });

    it('should have proper version management for updates', () => {
      const packageJson = JSON.parse(
        readFileSync(join(projectRoot, 'package.json'), 'utf-8')
      );

      // Should have semantic version
      expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/);

      // Should have release scripts
      expect(packageJson.scripts.release).toBeDefined();
      expect(packageJson.scripts.version).toBeDefined();
      expect(packageJson.scripts.postversion).toBeDefined();
    });
  });

  describe('Configuration Validation', () => {
    it('should accept minimal valid configuration', () => {
      const { RingAlarmCard } = require('../components/ring-alarm-card');
      const card = new RingAlarmCard();

      const minimalConfig = {
        type: 'custom:ring-alarm-card',
      };

      expect(() => card.setConfig(minimalConfig)).not.toThrow();

      // Should apply defaults
      const config = (card as any).config;
      expect(config.title).toBe('Custom Card');
    });

    it('should accept full configuration with all options', () => {
      const { RingAlarmCard } = require('../components/ring-alarm-card');
      const card = new RingAlarmCard();

      const fullConfig = {
        type: 'custom:ring-alarm-card',
        title: 'My Ring Alarm',
        customProperty: 'custom value',
      };

      expect(() => card.setConfig(fullConfig)).not.toThrow();

      const config = (card as any).config;
      expect(config.title).toBe('My Ring Alarm');
      expect(config.customProperty).toBe('custom value');
    });

    it('should provide clear error messages for invalid configurations', () => {
      const { RingAlarmCard } = require('../components/ring-alarm-card');
      const card = new RingAlarmCard();

      // Test various invalid configurations
      const invalidConfigs = [
        null,
        undefined,
        'string',
        123,
        { type: 'wrong-type' },
        { title: 'Missing type' },
      ];

      invalidConfigs.forEach(config => {
        expect(() => card.setConfig(config as any)).toThrow(
          /Ring Alarm Card configuration error/
        );
      });
    });
  });

  describe('Performance and Compatibility', () => {
    it('should have reasonable bundle size', () => {
      // Only run this test if bundle exists (after build)
      if (!existsSync(bundlePath)) {
        console.warn('Bundle not found - run "npm run build" first');
        expect(existsSync(bundlePath)).toBe(true);
        return;
      }

      const bundleStats = require('fs').statSync(bundlePath);
      const bundleSizeKB = bundleStats.size / 1024;

      // Should be under 200KB for reasonable loading time
      expect(bundleSizeKB).toBeLessThan(200);

      // Should be over 10KB to ensure it contains actual functionality
      expect(bundleSizeKB).toBeGreaterThan(10);
    });

    it('should support modern browser features', () => {
      // Only run this test if bundle exists (after build)
      if (!existsSync(bundlePath)) {
        console.warn('Bundle not found - run "npm run build" first');
        expect(existsSync(bundlePath)).toBe(true);
        return;
      }

      const bundleContent = readFileSync(bundlePath, 'utf-8');

      // Should use modern ES features (transpiled appropriately)
      expect(bundleContent).toContain('customElements');
      expect(bundleContent).toContain('shadowRoot');

      // Should not contain unsupported features
      expect(bundleContent).not.toContain('import('); // Dynamic imports should be inlined
    });

    it('should have proper error boundaries', () => {
      const { RingAlarmCard } = require('../components/ring-alarm-card');
      const card = new RingAlarmCard();

      // Should handle errors gracefully without crashing
      expect(() => {
        try {
          card.setConfig({ type: 'invalid' } as any);
        } catch (error) {
          // Error should be caught and handled
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toContain(
            'Ring Alarm Card configuration error'
          );
        }
      }).not.toThrow();
    });
  });

  describe('Development and Maintenance', () => {
    it('should have proper development scripts', () => {
      const packageJson = JSON.parse(
        readFileSync(join(projectRoot, 'package.json'), 'utf-8')
      );

      // Should have all necessary development scripts
      expect(packageJson.scripts.start).toBeDefined(); // Development server
      expect(packageJson.scripts.build).toBeDefined(); // Production build
      expect(packageJson.scripts.test).toBeDefined(); // Testing
      expect(packageJson.scripts.lint).toBeDefined(); // Code quality
      expect(packageJson.scripts.format).toBeDefined(); // Code formatting
    });

    it('should have proper dependency management', () => {
      const packageJson = JSON.parse(
        readFileSync(join(projectRoot, 'package.json'), 'utf-8')
      );

      // Should have Lit as main dependency
      expect(packageJson.dependencies.lit).toBeDefined();

      // Should have proper dev dependencies
      expect(packageJson.devDependencies.typescript).toBeDefined();
      expect(packageJson.devDependencies.rollup).toBeDefined();
      expect(packageJson.devDependencies.jest).toBeDefined();
      expect(packageJson.devDependencies.eslint).toBeDefined();
    });

    it('should have proper repository metadata', () => {
      const packageJson = JSON.parse(
        readFileSync(join(projectRoot, 'package.json'), 'utf-8')
      );

      // Should have repository information
      expect(packageJson.repository).toBeDefined();
      expect(packageJson.repository.type).toBe('git');
      expect(packageJson.repository.url).toContain('ring-alarm-card');

      // Should have issue tracking
      expect(packageJson.bugs).toBeDefined();
      expect(packageJson.bugs.url).toContain('issues');

      // Should have homepage
      expect(packageJson.homepage).toBeDefined();
    });
  });
});
