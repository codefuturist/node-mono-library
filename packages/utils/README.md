# @repo/utils

Shared utility functions for the monorepo. This package provides commonly-used helper functions for strings, arrays, objects, and async operations.

## Installation

### From npm (after publishing)

```bash
# npm
npm install @repo/utils

# pnpm
pnpm add @repo/utils

# yarn
yarn add @repo/utils
```

### Within the monorepo

If you're using this package within the monorepo, add it to your app's `package.json`:

```json
{
  "dependencies": {
    "@repo/utils": "workspace:*"
  }
}
```

Then run:

```bash
pnpm install
```

## Usage

### String Utilities

```typescript
import {
  capitalize,
  toKebabCase,
  toCamelCase,
  truncate,
  randomString,
} from "@repo/utils/string";

capitalize("hello"); // "Hello"
toKebabCase("helloWorld"); // "hello-world"
toCamelCase("hello-world"); // "helloWorld"
truncate("hello world", 8); // "hello..."
randomString(10); // "aBcDeFgHiJ"
```

### Array Utilities

```typescript
import {
  unique,
  chunk,
  shuffle,
  groupBy,
  first,
  last,
} from "@repo/utils/array";

unique([1, 2, 2, 3]); // [1, 2, 3]
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
first([1, 2, 3]); // 1
last([1, 2, 3]); // 3
groupBy(users, (u) => u.role); // { admin: [...], user: [...] }
```

### Object Utilities

```typescript
import { deepClone, deepMerge, pick, omit, isEmpty } from "@repo/utils/object";

deepClone({ a: { b: 1 } }); // Deep copy
deepMerge(obj1, obj2); // Recursively merge
pick(user, ["name", "email"]); // { name: ..., email: ... }
omit(user, ["password"]); // User without password
isEmpty({}); // true
```

### Async Utilities

```typescript
import {
  delay,
  retry,
  debounce,
  throttle,
  parallelLimit,
} from "@repo/utils/async";

await delay(1000); // Wait 1 second
await retry(fetchData, { maxAttempts: 3 }); // Retry with backoff
const debouncedFn = debounce(fn, 300); // Debounce
const throttledFn = throttle(fn, 100); // Throttle
await parallelLimit(items, 5, asyncFn); // Limit concurrency
```

## Development

```bash
# Build the package
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Type check
pnpm check-types

# Lint
pnpm lint
```

## API Reference

### String Utilities

| Function                         | Description                          |
| -------------------------------- | ------------------------------------ |
| `capitalize(str)`                | Capitalizes the first letter         |
| `toKebabCase(str)`               | Converts to kebab-case               |
| `toCamelCase(str)`               | Converts to camelCase                |
| `truncate(str, length, suffix?)` | Truncates with optional suffix       |
| `randomString(length)`           | Generates random alphanumeric string |

### Array Utilities

| Function              | Description                     |
| --------------------- | ------------------------------- |
| `unique(arr)`         | Removes duplicates              |
| `chunk(arr, size)`    | Splits into chunks              |
| `shuffle(arr)`        | Randomizes order (Fisher-Yates) |
| `groupBy(arr, keyFn)` | Groups by key function          |
| `first(arr)`          | Returns first element           |
| `last(arr)`           | Returns last element            |

### Object Utilities

| Function             | Description               |
| -------------------- | ------------------------- |
| `deepClone(obj)`     | Deep clones object        |
| `deepMerge(...objs)` | Deep merges objects       |
| `pick(obj, keys)`    | Picks specified keys      |
| `omit(obj, keys)`    | Omits specified keys      |
| `isEmpty(obj)`       | Checks if object is empty |

### Async Utilities

| Function                          | Description                               |
| --------------------------------- | ----------------------------------------- |
| `delay(ms)`                       | Promise-based delay                       |
| `retry(fn, options)`              | Retry with exponential backoff            |
| `debounce(fn, ms)`                | Debounces function calls                  |
| `throttle(fn, ms)`                | Throttles function calls                  |
| `parallelLimit(items, limit, fn)` | Parallel execution with concurrency limit |
