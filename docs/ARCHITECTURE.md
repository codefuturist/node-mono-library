# Architecture Guide

Technical deep-dive into the node-mono-library architecture.

## System Architecture

```mermaid
C4Context
    title System Context Diagram

    Person(dev, "Developer", "Uses packages and apps")
    Person(user, "End User", "Uses admin dashboard")

    System(mono, "node-mono-library", "Monorepo")

    System_Ext(npm, "npm Registry", "Package distribution")
    System_Ext(github, "GitHub", "Source control & CI/CD")
    System_Ext(vercel, "Vercel", "App deployment")

    Rel(dev, mono, "Develops")
    Rel(user, mono, "Uses admin app")
    Rel(mono, npm, "Publishes packages")
    Rel(mono, github, "CI/CD")
    Rel(mono, vercel, "Deploys apps")
```

## Package Architecture

### Layered Dependencies

```mermaid
graph TB
    subgraph "Layer 4: Applications"
        ADMIN[admin]
        DOCS[docs]
        WEB[web]
    end

    subgraph "Layer 3: Feature Packages"
        CLI["@repo/cli"]
        UI["@repo/ui"]
    end

    subgraph "Layer 2: Core Libraries"
        UTILS["@repo/utils"]
        VALIDATORS["@repo/validators"]
    end

    subgraph "Layer 1: Configuration"
        ESLINT["@repo/eslint-config"]
        TS["@repo/typescript-config"]
        VITEST["@repo/vitest-config"]
    end

    ADMIN --> UI
    ADMIN --> UTILS
    ADMIN --> VALIDATORS
    WEB --> UI
    WEB --> UTILS

    CLI --> UTILS
    CLI --> VALIDATORS
    UI --> UTILS

    UTILS --> ESLINT
    UTILS --> TS
    UTILS --> VITEST
    VALIDATORS --> ESLINT
    VALIDATORS --> TS
    VALIDATORS --> VITEST

    style ADMIN fill:#3b82f6
    style DOCS fill:#3b82f6
    style WEB fill:#3b82f6
    style CLI fill:#10b981
    style UI fill:#8b5cf6
    style UTILS fill:#f59e0b
    style VALIDATORS fill:#f59e0b
    style ESLINT fill:#6b7280
    style TS fill:#6b7280
    style VITEST fill:#6b7280
```

## Data Flow

### Admin Dashboard

```mermaid
sequenceDiagram
    participant U as User
    participant A as Admin App
    participant Auth as NextAuth
    participant DB as Prisma/SQLite
    participant V as Validators

    U->>A: Login Request
    A->>V: Validate Input
    V-->>A: Valid
    A->>Auth: Authenticate
    Auth->>DB: Check Credentials
    DB-->>Auth: User Data
    Auth-->>A: Session Token
    A-->>U: Dashboard Access
```

### Package Publishing

```mermaid
sequenceDiagram
    participant D as Developer
    participant CS as Changeset
    participant CI as GitHub Actions
    participant NPM as npm Registry

    D->>CS: pnpm changeset
    CS-->>D: Create .md file
    D->>CI: Push to main
    CI->>CI: Run Tests
    CI->>CS: Version Packages
    CS->>NPM: Publish
    NPM-->>CI: Success
```

## Build System

### Turborepo Pipeline

```mermaid
flowchart TD
    subgraph "turbo.json Tasks"
        BUILD[build]
        LINT[lint]
        TEST[test]
        TYPES[check-types]
        DEV[dev]
    end

    subgraph "Dependencies"
        BUILD --> |"dependsOn: ^build"| BUILD
        TEST --> |"dependsOn: transit"| BUILD
        TYPES --> |"dependsOn: ^check-types"| TYPES
    end

    subgraph "Caching"
        CACHE[(Remote Cache)]
        BUILD --> CACHE
        LINT --> CACHE
        TEST --> CACHE
        TYPES --> CACHE
    end

    subgraph "Outputs"
        DIST[dist/]
        NEXT[.next/]
        COV[coverage/]
    end

    BUILD --> DIST
    BUILD --> NEXT
    TEST --> COV
```

### Build Optimization

| Feature            | Implementation          | Benefit              |
| ------------------ | ----------------------- | -------------------- |
| Task Caching       | Turborepo hash-based    | Skip unchanged work  |
| Parallel Execution | Turborepo orchestration | Faster builds        |
| Incremental Builds | TypeScript incremental  | Faster type checking |
| Tree Shaking       | tsup/esbuild            | Smaller bundles      |
| Code Splitting     | Next.js automatic       | Faster page loads    |

## Testing Strategy

```mermaid
graph TB
    subgraph "Testing Pyramid"
        E2E[E2E Tests - Playwright]
        INT[Integration Tests]
        UNIT[Unit Tests - Vitest]
    end

    subgraph "Coverage"
        E2E --> |"Critical paths"| ADMIN
        INT --> |"Cross-package"| VALIDATORS
        UNIT --> |"All functions"| UTILS
    end

    UNIT --> |"Foundation"| INT
    INT --> |"Builds on"| E2E

    style E2E fill:#ef4444
    style INT fill:#f59e0b
    style UNIT fill:#10b981
```

## Security Model

```mermaid
flowchart LR
    subgraph "Input"
        USER[User Input]
    end

    subgraph "Validation Layer"
        V1[String Validators]
        V2[Format Validators]
        V3[Type Guards]
    end

    subgraph "Processing"
        LOGIC[Business Logic]
    end

    subgraph "Output"
        RESPONSE[Safe Response]
    end

    USER --> V1
    USER --> V2
    USER --> V3
    V1 --> LOGIC
    V2 --> LOGIC
    V3 --> LOGIC
    LOGIC --> RESPONSE
```

## Deployment Architecture

```mermaid
flowchart TB
    subgraph "Source"
        GH[GitHub Repository]
    end

    subgraph "CI/CD"
        GHA[GitHub Actions]
        TURBO[Turborepo]
    end

    subgraph "Artifacts"
        NPM[(npm Registry)]
        DOCKER[(Docker Images)]
    end

    subgraph "Hosting"
        VERCEL[Vercel]
        VPS[VPS/Cloud]
    end

    subgraph "Apps"
        ADMIN_PROD[Admin Dashboard]
        DOCS_PROD[Documentation]
        WEB_PROD[Web Demo]
    end

    GH --> GHA
    GHA --> TURBO
    TURBO --> NPM
    TURBO --> DOCKER
    TURBO --> VERCEL
    VERCEL --> ADMIN_PROD
    VERCEL --> DOCS_PROD
    VERCEL --> WEB_PROD
```

## Configuration Inheritance

```mermaid
flowchart TD
    subgraph "TypeScript"
        BASE_TS[typescript-config/base.json]
        NEXT_TS[typescript-config/nextjs.json]
        REACT_TS[typescript-config/react-library.json]
    end

    subgraph "ESLint"
        BASE_ES[eslint-config/base.js]
        NEXT_ES[eslint-config/next.js]
        REACT_ES[eslint-config/react-internal.js]
    end

    BASE_TS --> NEXT_TS
    BASE_TS --> REACT_TS

    BASE_ES --> NEXT_ES
    BASE_ES --> REACT_ES

    NEXT_TS --> |"extends"| ADMIN_CFG[apps/admin/tsconfig.json]
    REACT_TS --> |"extends"| UI_CFG[packages/ui/tsconfig.json]

    NEXT_ES --> |"extends"| ADMIN_ESL[apps/admin/eslint.config.mjs]
    REACT_ES --> |"extends"| UI_ESL[packages/ui/eslint.config.mjs]
```

## Module Resolution

### Package Exports

```mermaid
graph LR
    subgraph "@repo/utils"
        INDEX[index.ts]
        STRING[string.ts]
        ARRAY[array.ts]
        OBJECT[object.ts]
        ASYNC[async.ts]
    end

    subgraph "Consumers"
        IMPORT1["import { capitalize } from '@repo/utils/string'"]
        IMPORT2["import * as utils from '@repo/utils'"]
    end

    IMPORT1 --> STRING
    IMPORT2 --> INDEX
    INDEX --> STRING
    INDEX --> ARRAY
    INDEX --> OBJECT
    INDEX --> ASYNC
```

## Performance Considerations

| Area     | Strategy        | Implementation         |
| -------- | --------------- | ---------------------- |
| Build    | Caching         | Turborepo remote cache |
| Dev      | Hot Reload      | Next.js Fast Refresh   |
| Bundle   | Tree Shaking    | tsup + esbuild         |
| Runtime  | Lazy Loading    | Dynamic imports        |
| Database | Connection Pool | Prisma                 |
| Testing  | Parallel        | Vitest threads         |

---

_See [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for a quick visual reference._
