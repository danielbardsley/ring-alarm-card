# HACS Distribution

## HACS Requirements

For this custom Lovelace card to work with HACS (Home Assistant Community Store), specific requirements must be met:

### Required Files in Repository Root

- `hacs.json` - HACS configuration file
- `info.md` - Card information for HACS UI
- `README.md` - Installation and usage documentation
- `LICENSE` - License file
- `ring-alarm-card.js` - Built JavaScript file (MUST be committed)

### HACS Configuration

The `hacs.json` file specifies:
- `filename`: Path to the built JS file (`ring-alarm-card.js`)
- `name`: Display name in HACS
- `render_readme`: Whether to show README in HACS UI
- `homeassistant`: Minimum Home Assistant version required

### Critical: Built Files Must Be Committed

**IMPORTANT**: Unlike typical Node.js projects, HACS requires the built JavaScript file to be committed to the repository root because:

1. HACS downloads files directly from the GitHub repository
2. HACS doesn't run build processes
3. Users need the pre-built JavaScript file to use the card

### Git Workflow for HACS

When making changes:

1. Make code changes in `src/`
2. Run `npm run build` to generate `ring-alarm-card.js`
3. Commit both source and built files:
   ```bash
   git add src/ ring-alarm-card.js*
   git commit -m "feat: your changes"
   ```
4. Or use the convenience script:
   ```bash
   npm run build:commit
   ```

### Release Process

1. Update version in `package.json`
2. Run `npm run release` (builds, tests, lints)
3. Commit all changes including built files
4. Create and push a version tag:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
5. GitHub Actions will create a release automatically

### HACS Installation Path

When users install via HACS, the file is downloaded to:
```
config/www/community/ring-alarm-card/ring-alarm-card.js
```

Users then add it as a resource in Lovelace:
```yaml
resources:
  - url: /hacsfiles/ring-alarm-card/ring-alarm-card.js
    type: module
```

### Troubleshooting HACS Issues

**"Repository structure not compliant"**
- Ensure `ring-alarm-card.js` exists and is committed to repository root
- Verify `hacs.json` has correct `filename` path
- Check that all required files exist in repository root

**"File not found"**
- Rebuild and commit: `npm run build && git add ring-alarm-card.js* && git commit`
- Push changes to GitHub
- Wait a few minutes for HACS to refresh

**"Invalid configuration"**
- Validate `hacs.json` syntax
- Ensure `filename` matches actual file path
- Check minimum Home Assistant version is reasonable