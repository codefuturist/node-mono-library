# Version Management with Changesets

This monorepo uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

## Quick Start

### Creating a Changeset

After making changes to `@repo/utils` or `@repo/validators`:

```bash
pnpm changeset
```

Follow the prompts to:
1. Select which packages changed
2. Choose the semver bump type (major/minor/patch)
3. Write a summary of changes

### Versioning Packages

When ready to create a new version:

```bash
pnpm version-packages
```

This updates `package.json` versions and generates changelogs.

### Publishing to npm

To publish packages:

```bash
pnpm release
```

This runs all checks and publishes to npm.

## Commands

| Command | Description |
|---------|-------------|
| `pnpm changeset` | Create a new changeset |
| `pnpm version-packages` | Bump versions based on changesets |
| `pnpm release` | Build, test, and publish packages |

## Automated Workflow

1. **Development**: Create changesets as you make changes
2. **Version PR**: Changesets bot creates a PR with version bumps
3. **Release**: Merging the version PR publishes to npm

## Configuration

Changesets is configured in `.changeset/config.json`:

- **Auto-commit**: Enabled - versions are committed automatically
- **Access**: Public - packages are published as public
- **Base branch**: `develop` - version PRs target this branch
- **Ignored packages**: Apps (`docs`, `web`) are not versioned

## Example Workflow

```bash
# 1. Make changes to @repo/utils
# Edit packages/utils/src/string.ts

# 2. Create a changeset
pnpm changeset
# → Select @repo/utils
# → Select minor
# → Write "Add toSnakeCase utility function"

# 3. Commit the changeset
git add .changeset
git commit -m "Add toSnakeCase utility"
git push

# 4. When ready to release, version packages
pnpm version-packages
# → Updates version to 0.2.0
# → Generates CHANGELOG.md

# 5. Publish (or let CI handle it)
pnpm release
```

## Semver Guidelines

- **Patch** (0.1.0 → 0.1.1): Bug fixes, no API changes
- **Minor** (0.1.0 → 0.2.0): New features, backward compatible
- **Major** (0.1.0 → 1.0.0): Breaking changes

## CI/CD Integration

The `.github/workflows/release.yml` workflow:
- Triggers on pushes to `main` branch
- Creates "Version Packages" PR automatically
- Publishes to npm when version PR is merged

### Required Secrets

To enable npm publishing, add to GitHub repository secrets:
- `NPM_TOKEN` - Your npm access token ([create one](https://www.npmjs.com/settings/~/tokens))

## Learn More

- [Changesets Documentation](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
- [Semantic Versioning](https://semver.org/)
- [Publishing to npm](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
