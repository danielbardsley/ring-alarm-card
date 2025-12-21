import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

describe('Distribution Setup', () => {
  const projectRoot = process.cwd();
  const mainBundle = join(projectRoot, 'ring-alarm-card.js');
  const gzipBundle = join(projectRoot, 'ring-alarm-card.js.gz');

  describe('Build Output Generation', () => {
    it('should generate the main bundle file', () => {
      expect(existsSync(mainBundle)).toBe(true);
    });

    it('should generate a non-empty bundle file', () => {
      expect(existsSync(mainBundle)).toBe(true);
      const stats = statSync(mainBundle);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should contain the custom element registration', () => {
      const bundleContent = readFileSync(mainBundle, 'utf-8');
      expect(bundleContent).toContain('ring-alarm-card');
      expect(bundleContent).toContain('customElements.define');
    });

    it('should be a valid ES module', () => {
      const bundleContent = readFileSync(mainBundle, 'utf-8');
      // Should not contain CommonJS patterns
      expect(bundleContent).not.toContain('module.exports');
      expect(bundleContent).not.toContain('require(');
    });

    it('should generate gzipped version for production builds', () => {
      // This test assumes production build has been run
      // In a real scenario, you might want to run the build as part of the test
      if (process.env.NODE_ENV === 'production') {
        expect(existsSync(gzipBundle)).toBe(true);
        const gzipStats = statSync(gzipBundle);
        const originalStats = statSync(mainBundle);
        expect(gzipStats.size).toBeLessThan(originalStats.size);
      }
    });
  });

  describe('HACS Compatibility Structure', () => {
    it('should have hacs.json file', () => {
      const hacsFile = join(process.cwd(), 'hacs.json');
      expect(existsSync(hacsFile)).toBe(true);
    });

    it('should have valid hacs.json content', () => {
      const hacsFile = join(process.cwd(), 'hacs.json');
      const hacsContent = JSON.parse(readFileSync(hacsFile, 'utf-8'));

      expect(hacsContent).toHaveProperty('name');
      expect(hacsContent).toHaveProperty('filename', 'ring-alarm-card.js');
      expect(hacsContent).toHaveProperty('render_readme', true);
      expect(hacsContent.name).toBe('Ring Alarm Card');
    });

    it('should have info.md file for HACS', () => {
      const infoFile = join(process.cwd(), 'info.md');
      expect(existsSync(infoFile)).toBe(true);
    });

    it('should have comprehensive info.md content', () => {
      const infoFile = join(process.cwd(), 'info.md');
      const infoContent = readFileSync(infoFile, 'utf-8');

      expect(infoContent).toContain('# Ring Alarm Card');
      expect(infoContent).toContain('## Installation');
      expect(infoContent).toContain('## Configuration');
      expect(infoContent).toContain('custom:ring-alarm-card');
    });

    it('should have proper project structure for HACS', () => {
      // Check for required files
      expect(existsSync(join(process.cwd(), 'README.md'))).toBe(true);
      expect(existsSync(join(process.cwd(), 'LICENSE'))).toBe(true);
      expect(existsSync(join(process.cwd(), 'CHANGELOG.md'))).toBe(true);
    });
  });

  describe('Resource Declaration Files', () => {
    it('should have package.json with correct main field', () => {
      const packageFile = join(process.cwd(), 'package.json');
      const packageContent = JSON.parse(readFileSync(packageFile, 'utf-8'));

      expect(packageContent.main).toBe('ring-alarm-card.js');
      expect(packageContent.module).toBe('ring-alarm-card.js');
    });

    it('should have package.json with HACS-compatible metadata', () => {
      const packageFile = join(process.cwd(), 'package.json');
      const packageContent = JSON.parse(readFileSync(packageFile, 'utf-8'));

      expect(packageContent.name).toBe('ring-alarm-card');
      expect(packageContent.keywords).toContain('home-assistant');
      expect(packageContent.keywords).toContain('lovelace');
      expect(packageContent.keywords).toContain('custom-card');
    });

    it('should have proper repository information', () => {
      const packageFile = join(process.cwd(), 'package.json');
      const packageContent = JSON.parse(readFileSync(packageFile, 'utf-8'));

      expect(packageContent).toHaveProperty('repository');
      expect(packageContent).toHaveProperty('bugs');
      expect(packageContent).toHaveProperty('homepage');
      expect(packageContent.repository.type).toBe('git');
    });

    it('should have release scripts configured', () => {
      const packageFile = join(process.cwd(), 'package.json');
      const packageContent = JSON.parse(readFileSync(packageFile, 'utf-8'));

      expect(packageContent.scripts).toHaveProperty('release');
      expect(packageContent.scripts).toHaveProperty('version');
      expect(packageContent.scripts).toHaveProperty('postversion');
    });

    it('should have GitHub Actions workflow files', () => {
      expect(existsSync(join(process.cwd(), '.github/workflows/ci.yml'))).toBe(
        true
      );
      expect(
        existsSync(join(process.cwd(), '.github/workflows/release.yml'))
      ).toBe(true);
    });

    it('should have valid GitHub Actions CI workflow', () => {
      const ciFile = join(process.cwd(), '.github/workflows/ci.yml');
      const ciContent = readFileSync(ciFile, 'utf-8');

      expect(ciContent).toContain('name: CI');
      expect(ciContent).toContain('npm test');
      expect(ciContent).toContain('npm run build');
      expect(ciContent).toContain('npm run lint');
    });

    it('should have valid GitHub Actions release workflow', () => {
      const releaseFile = join(process.cwd(), '.github/workflows/release.yml');
      const releaseContent = readFileSync(releaseFile, 'utf-8');

      expect(releaseContent).toContain('name: Release');
      expect(releaseContent).toContain('tags:');
      expect(releaseContent).toContain('ring-alarm-card.js');
    });
  });

  describe('Documentation Files', () => {
    it('should have comprehensive README.md', () => {
      const readmeFile = join(process.cwd(), 'README.md');
      const readmeContent = readFileSync(readmeFile, 'utf-8');

      expect(readmeContent).toContain('# Ring Alarm Card');
      expect(readmeContent).toContain('## Installation');
      expect(readmeContent).toContain('### HACS (Recommended)');
      expect(readmeContent).toContain('### Manual Installation');
      expect(readmeContent).toContain('## Configuration');
      expect(readmeContent).toContain('## Development');
    });

    it('should have LICENSE file', () => {
      const licenseFile = join(process.cwd(), 'LICENSE');
      const licenseContent = readFileSync(licenseFile, 'utf-8');

      expect(licenseContent).toContain('MIT License');
      expect(licenseContent).toContain('Ring Alarm Card');
    });

    it('should have CHANGELOG.md', () => {
      const changelogFile = join(process.cwd(), 'CHANGELOG.md');
      const changelogContent = readFileSync(changelogFile, 'utf-8');

      expect(changelogContent).toContain('# Changelog');
      expect(changelogContent).toContain('## [Unreleased]');
      expect(changelogContent).toContain('Keep a Changelog');
    });
  });
});
