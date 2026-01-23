# Examples

This directory contains example applications demonstrating how to use the libraries from this monorepo.

## Available Examples

### demo-app

A comprehensive demonstration of `@repo/utils` and `@repo/validators` libraries showing real-world usage patterns.

**Location:** `examples/demo-app/`

**Quick Start:**

```bash
cd examples/demo-app

# Install dependencies (if needed)
pnpm install

# Run the main demo
pnpm start

# Run specific examples
pnpm utils      # Utility functions demo
pnpm validate   # Validation functions demo
```

**What it demonstrates:**

- Clean imports using subpath exports
- Form validation patterns
- Data transformation workflows
- API request/response handling
- Service layer implementation
- Type-safe validation
- Async operations with retries
- Object manipulation and cloning

See [`demo-app/README.md`](demo-app/README.md) for detailed documentation.

## Creating Your Own Project

To use these libraries in a new external project (after publishing to npm):

```bash
# Create your project
mkdir my-project
cd my-project
npm init -y

# Install the libraries
npm install @repo/utils @repo/validators

# Start coding!
```

Example usage:

```typescript
import { capitalize, chunk } from "@repo/utils";
import { isEmail, isInRange } from "@repo/validators";

// Your code here
```

## Tips for Best Results

1. **Import from subpaths** for better tree-shaking:

   ```typescript
   // Good - tree-shakeable
   import { capitalize } from "@repo/utils/string";

   // Also works, but may include unused code
   import { capitalize } from "@repo/utils";
   ```

2. **Use TypeScript** for full type safety and IntelliSense

3. **Combine both libraries** for powerful data validation and transformation

4. **Check the package READMEs** for complete API references:
   - [@repo/utils](../packages/utils/README.md)
   - [@repo/validators](../packages/validators/README.md)
