# Adding New Projects to the Monorepo

This guide explains how to add new packages or apps to this Turborepo monorepo.

## Quick Commands

```bash
# View help
pnpm scaffold:help

# Create new library package
pnpm new:lib

# Create new app
pnpm new:app

# List all workspace packages
pnpm workspace:list
```

## 1. Adding a New Package (Shared Library)

Packages are reusable libraries shared across apps (e.g., `@repo/auth`, `@repo/hooks`).

### Using the script:
```bash
pnpm new:lib
# Enter package name when prompted (e.g., "auth")
```

### Manual steps:
```bash
# 1. Create folder structure
mkdir -p packages/my-package/{src,__tests__}

# 2. Copy template from existing package
cp packages/validators/package.json packages/my-package/
cp packages/validators/tsconfig.json packages/my-package/
cp packages/validators/tsup.config.ts packages/my-package/

# 3. Update package.json
# - Change "name": "@repo/my-package"
# - Update description
# - Update exports/main/types as needed

# 4. Create src/index.ts
echo 'export const myFunction = () => "Hello";' > packages/my-package/src/index.ts

# 5. Install dependencies
pnpm install

# 6. Build and test
cd packages/my-package
pnpm build
pnpm test
```

### Package.json template:
```json
{
  "name": "@repo/my-package",
  "version": "0.1.0",
  "description": "Description here",
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "tsup": "^8.5.1",
    "typescript": "^5.9.3",
    "vitest": "^4.0.18"
  }
}
```

## 2. Adding a New App

Apps are deployable applications (e.g., Next.js, Vite).

### Using Next.js:
```bash
pnpm dlx create-next-app@latest apps/my-app
# Select options as needed
```

### Using Vite:
```bash
pnpm dlx create-vite@latest apps/my-app
```

### Manual steps after creation:
```bash
# 1. Add to workspace (if not in apps/*)
# Edit pnpm-workspace.yaml if needed

# 2. Install dependencies
pnpm install

# 3. Copy ESLint config
cp packages/utils/eslint.config.mjs apps/my-app/

# 4. Update turbo.json to include new app tasks
```

## 3. After Adding New Project

### 1. Install dependencies:
```bash
pnpm install
```

### 2. Verify workspace:
```bash
pnpm workspace:list
```

### 3. Add changeset (for packages):
```bash
pnpm changeset
# Select package, version type, and add description
```

### 4. Build and test:
```bash
# Build everything
pnpm build

# Or just your package
pnpm --filter @repo/my-package build

# Test
pnpm --filter @repo/my-package test
```

### 5. Commit changes:
```bash
git add .
pnpm commit
```

## 4. Common Patterns

### Internal dependencies:
In your new package's `package.json`, reference other packages:
```json
{
  "dependencies": {
    "@repo/utils": "workspace:*",
    "@repo/validators": "workspace:*"
  }
}
```

### Turbo caching:
Turbo automatically caches builds. No configuration needed for standard setups.

### Publishing:
Only packages (not apps) are published to npm. Update `.changeset/config.json` if you want to ignore certain packages.

## 5. Troubleshooting

### Package not found:
```bash
# Clear and reinstall
pnpm pkg:fresh
```

### Build errors:
```bash
# Clean everything
pnpm clean
pnpm build
```

### Type errors:
```bash
# Build dependencies first
pnpm build
pnpm check-types
```

## Directory Structure

```
node-mono-library/
├── apps/                    # Deployable applications
│   ├── docs/               # Documentation site
│   └── web/                # Main web app
├── packages/               # Shared libraries
│   ├── ui/                # React components
│   ├── utils/             # Utility functions
│   ├── validators/        # Validation logic
│   ├── eslint-config/     # Shared ESLint config
│   └── typescript-config/ # Shared TS config
├── examples/              # Example implementations
├── .changeset/           # Changesets for versioning
└── turbo.json           # Turborepo configuration
```

## Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Changesets](https://github.com/changesets/changesets)
