# Demo App - Using @repo/utils and @repo/validators

This example demonstrates how to use the `@repo/utils` and `@repo/validators` libraries in a real application.

## Setup

```bash
# Install dependencies
pnpm install

# Run the main demo
pnpm start

# Run utils examples only
pnpm utils

# Run validation examples only
pnpm validate

# Watch mode (auto-restart on changes)
pnpm dev
```

## What's Included

- `src/index.ts` - Combined examples using both libraries
- `src/utils-examples.ts` - Focused examples for @repo/utils
- `src/validation-examples.ts` - Focused examples for @repo/validators
- `src/user-service.ts` - Realistic service class example

## Key Takeaways

### Clean Imports

```typescript
// Import from subpaths for tree-shaking
import { capitalize, truncate } from "@repo/utils/string";
import { unique, chunk } from "@repo/utils/array";
import { isEmail, isUrl } from "@repo/validators/format";
import { isInRange } from "@repo/validators/number";
```

### Practical Usage

The examples show:

- Form validation
- Data transformation
- API response handling
- User input processing
- Async operations with retries
- Clean service layer patterns

## For External Projects

When using these packages from npm (after publishing):

```bash
npm install @repo/utils @repo/validators
```

The imports and usage remain exactly the same!
