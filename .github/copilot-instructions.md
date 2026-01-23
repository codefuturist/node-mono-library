# Copilot Instructions for node-mono-library

## Architecture Overview

This is a **pnpm + Turborepo** monorepo with shared TypeScript packages and Next.js apps.

**Workspace structure:**

- `apps/` – Next.js applications (admin, docs, web)
- `packages/` – Shared libraries with `@repo/*` namespace
- `examples/` – Usage examples for publishable packages

**Key dependency flow:** `apps → @repo/ui, @repo/utils, @repo/validators` and all packages depend on `@repo/eslint-config`, `@repo/typescript-config`, `@repo/vitest-config`.

## Package Patterns

**Publishable packages** (`@repo/utils`, `@repo/validators`):

- Use **tsup** for dual ESM/CJS builds with multiple entry points
- Export submodules: `@repo/utils/string`, `@repo/validators/format`
- See `packages/utils/tsup.config.ts` for build pattern

**Internal packages** (`@repo/ui`, `@repo/eslint-config`):

- Use `workspace:*` protocol for internal deps
- Not published to npm

## Essential Commands

```bash
# Development
pnpm dev                    # All apps in parallel
pnpm dev --filter=admin     # Single app

# Testing (uses Turborepo caching)
pnpm test                   # All packages
pnpm test:packages          # Only packages/*
pnpm test --filter=@repo/utils

# E2E tests (Playwright, requires admin app running)
pnpm test:e2e
pnpm test:e2e:ui            # Interactive mode

# Validation before commit
pnpm validate               # lint + format:check + check-types + test

# Version management
pnpm changeset              # Create changeset for package changes
pnpm changeset:version      # Bump versions, update changelogs
```

## Testing Conventions

- Tests live in `__tests__/` directories (not colocated with source)
- Use `vitest` with shared config from `@repo/vitest-config`
- Import from vitest directly: `import { describe, it, expect } from "vitest"`
- Each package extends shared config via `packages/utils/vitest.config.ts`

**CLI package** has separate test commands: `test:unit`, `test:commands`, `test:integration`

## Commit & Versioning

**Conventional commits required** – enforced by husky + commitlint:

```
feat(utils): add toSnakeCase function
fix(validators): handle null in isEmail
```

**Changesets workflow** for publishable packages:

1. Make changes to `@repo/utils` or `@repo/validators`
2. Run `pnpm changeset` → select packages, bump type, write summary
3. Commit the `.changeset/*.md` file with your changes
4. `pnpm changeset:version` updates versions and CHANGELOG.md

## Adding New Packages

Use `pnpm new:lib` or copy from `packages/validators/`:

1. Create `packages/<name>/` with `src/`, `__tests__/`
2. Copy `package.json`, `tsconfig.json`, `tsup.config.ts`, `vitest.config.ts`
3. Update name to `@repo/<name>`, configure exports
4. Run `pnpm install` to link workspace

## Admin App (apps/admin)

- **Next.js 16** + **Prisma** with SQLite (libsql adapter)
- Database commands: `pnpm --filter=admin db:push`, `db:seed`, `db:studio`
- E2E tests in `tests/e2e/admin.spec.ts`

## Configuration Locations

| Config          | Location                                       |
| --------------- | ---------------------------------------------- |
| TypeScript base | `packages/typescript-config/base.json`         |
| ESLint shared   | `packages/eslint-config/base.js`               |
| Vitest shared   | `packages/vitest-config/src/index.ts`          |
| Turborepo tasks | `turbo.json`                                   |
| Changesets      | `.changeset/config.json` (baseBranch: develop) |
