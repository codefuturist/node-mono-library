# @repo/vitest-config

Shared Vitest configuration for the monorepo.

## Usage

In your package's `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import { sharedConfig } from '@repo/vitest-config';

export default defineConfig({
  ...sharedConfig,
  test: {
    ...sharedConfig.test,
    // Package-specific overrides
  },
});
```

## Configuration

The shared config provides:

- **globals**: true - Use global test functions
- **environment**: 'node' - Default test environment
- **coverage**: V8 coverage with JSON + HTML reports
- **Standard excludes**: node_modules, dist, config files

## Overriding

Packages can override any setting:

```typescript
export default defineConfig({
  ...sharedConfig,
  test: {
    ...sharedConfig.test,
    environment: 'jsdom', // Override for React components
  },
});
```
