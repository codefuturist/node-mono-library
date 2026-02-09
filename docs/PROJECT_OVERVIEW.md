# Project Overview

A visual guide to the node-mono-library architecture and structure.

## 📊 Repository Structure

```text
node-mono-library/
├── apps/                    # Deployable applications
│   ├── admin/              # Admin dashboard (Next.js 16 + Prisma)
│   ├── docs/               # Documentation site (Next.js)
│   └── web/                # Demo web app (Next.js)
│
├── packages/               # Shared libraries
│   ├── cli/               # CLI tool (@repo/cli) - publishable
│   ├── utils/             # Utility functions (@repo/utils) - publishable
│   ├── validators/        # Validation library (@repo/validators) - publishable
│   ├── ui/                # React components (@repo/ui)
│   ├── eslint-config/     # Shared ESLint config
│   ├── typescript-config/ # Shared TS config
│   └── vitest-config/     # Shared test config
│
├── examples/              # Usage examples
│   └── demo-app/         # Example app using packages
│
├── tests/                 # E2E tests (Playwright)
│   └── e2e/
│
├── docs/                  # Project documentation
└── scripts/               # Build & packaging scripts
```

## 🔗 Package Dependency Graph

```mermaid
graph TD
    subgraph Apps
        A[admin]
        D[docs]
        W[web]
    end

    subgraph "Publishable Packages"
        CLI["@repo/cli"]
        U["@repo/utils"]
        V["@repo/validators"]
    end

    subgraph "Internal Packages"
        UI["@repo/ui"]
        EC["@repo/eslint-config"]
        TC["@repo/typescript-config"]
        VC["@repo/vitest-config"]
    end

    %% App dependencies
    A --> UI
    A --> U
    A --> V
    W --> UI
    W --> U

    %% CLI dependencies
    CLI --> U
    CLI --> V

    %% All packages use configs
    U --> EC
    U --> TC
    U --> VC
    V --> EC
    V --> TC
    V --> VC
    UI --> EC
    UI --> TC
    CLI --> EC
    CLI --> TC
    CLI --> VC

    %% Apps use configs
    A --> EC
    A --> TC
    D --> EC
    D --> TC
    W --> EC
    W --> TC

    style A fill:#3b82f6,color:#fff
    style D fill:#3b82f6,color:#fff
    style W fill:#3b82f6,color:#fff
    style CLI fill:#10b981,color:#fff
    style U fill:#10b981,color:#fff
    style V fill:#10b981,color:#fff
    style UI fill:#8b5cf6,color:#fff
    style EC fill:#6b7280,color:#fff
    style TC fill:#6b7280,color:#fff
    style VC fill:#6b7280,color:#fff
```

## 🏗️ Build Pipeline

```mermaid
flowchart LR
    subgraph "Development"
        DEV[pnpm dev]
        WATCH[Hot Reload]
    end

    subgraph "Quality Checks"
        LINT[ESLint]
        FORMAT[Prettier]
        TYPES[TypeScript]
        TEST[Vitest]
    end

    subgraph "Build"
        BUILD[Turborepo Build]
        CACHE[Remote Cache]
    end

    subgraph "Output"
        NEXT[.next/]
        DIST[dist/]
    end

    DEV --> WATCH
    LINT --> BUILD
    FORMAT --> BUILD
    TYPES --> BUILD
    TEST --> BUILD
    BUILD --> CACHE
    BUILD --> NEXT
    BUILD --> DIST
```

## 🔄 Git Workflow

```mermaid
gitGraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Feature work"
    branch feature/new-feature
    checkout feature/new-feature
    commit id: "Add feature"
    commit id: "Tests"
    checkout develop
    merge feature/new-feature id: "Merge feature"
    branch release/1.0.0
    checkout release/1.0.0
    commit id: "Bump versions"
    checkout main
    merge release/1.0.0 id: "Release 1.0.0" tag: "v1.0.0"
    checkout develop
    merge main id: "Sync"
```

## 📦 Package Types

| Type          | Packages                                        | Purpose                 | Published |
| ------------- | ----------------------------------------------- | ----------------------- | --------- |
| **Apps**      | admin, docs, web                                | Deployable applications | No        |
| **Libraries** | utils, validators, cli                          | Reusable functionality  | Yes (npm) |
| **UI**        | ui                                              | React components        | No        |
| **Config**    | eslint-config, typescript-config, vitest-config | Shared configurations   | No        |

## 🛠️ Technology Stack

```mermaid
mindmap
  root((node-mono-library))
    Build
      Turborepo
      tsup
      pnpm
    Runtime
      Node.js 20+
      TypeScript 5.x
    Frontend
      Next.js 16
      React 19
      Tailwind CSS
    Backend
      Prisma
      SQLite/libsql
      NextAuth.js
    Testing
      Vitest
      Playwright
      Testing Library
    Quality
      ESLint
      Prettier
      Husky
      Commitlint
```

## 📁 Key Files

| File                     | Purpose                       |
| ------------------------ | ----------------------------- |
| `turbo.json`             | Turborepo task configuration  |
| `pnpm-workspace.yaml`    | Workspace package definitions |
| `package.json`           | Root scripts and dependencies |
| `.changeset/config.json` | Version management config     |
| `playwright.config.ts`   | E2E test configuration        |
| `eslint.config.mjs`      | Root ESLint configuration     |

## 🚀 Quick Commands

```bash
# Development
pnpm dev              # Start all apps
pnpm dev --filter=admin  # Start specific app

# Quality
pnpm validate         # Full validation suite
pnpm lint            # Lint all packages
pnpm test            # Run all tests

# Build
pnpm build           # Build all packages
pnpm build --filter=@repo/utils  # Build specific

# Release
pnpm changeset       # Create changeset
pnpm release         # Full release flow
```

## 📚 Documentation Index

| Document                                      | Description           |
| --------------------------------------------- | --------------------- |
| [README.md](../README.md)                     | Project introduction  |
| [CONTRIBUTING.md](../.github/CONTRIBUTING.md) | Contribution guide    |
| [TESTING.md](TESTING.md)                      | Testing strategies    |
| [VERSIONING.md](VERSIONING.md)                | Version management    |
| [ADDING-PROJECTS.md](ADDING-PROJECTS.md)      | Creating new packages |
| [RELEASE_SECRETS.md](RELEASE_SECRETS.md)      | CI/CD secrets setup   |

## 🔍 Package Details

### @repo/utils

String, array, object, and async utility functions.

```typescript
import { capitalize } from "@repo/utils/string";
import { unique } from "@repo/utils/array";
import { deepClone } from "@repo/utils/object";
import { retry } from "@repo/utils/async";
```

### @repo/validators

Type-safe validation functions.

```typescript
import { isEmail } from "@repo/validators/format";
import { isInRange } from "@repo/validators/number";
import { isEmpty } from "@repo/validators/string";
import { isValidDate } from "@repo/validators/date";
```

### @repo/cli

Command-line tool for project scaffolding and utilities.

```bash
repo-cli init          # Initialize project
repo-cli generate      # Generate code
repo-cli validate      # Validate project
```

---

_Generated for node-mono-library. Run `pnpm docs:generate` to regenerate._
