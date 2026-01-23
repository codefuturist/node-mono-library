# Testing Guide

This monorepo uses a comprehensive testing strategy following **Turborepo best practices** with per-package Vitest configurations and Playwright for E2E tests.

## Table of Contents

- [Architecture](#architecture)
- [Test Stack](#test-stack)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)

## Architecture

### Turborepo Testing Pattern

This project follows Turborepo's recommended testing approach with a **shared configuration package**:

- **Shared config package** (`@repo/vitest-config`): Centralized test configuration
- **Per-package configurations**: Each package extends the shared config
- **Task-level caching**: Tests are cached based on inputs (source + test files)
- **Parallel execution**: Turborepo runs tests across packages in parallel
- **Dependency awareness**: Tests depend on `transit` task for topological order
- **Incremental testing**: Use `--filter` to test specific packages

### Transit Task Pattern

The `transit` task is a Turborepo pattern for managing topological dependencies:

```json
"test": {
  "dependsOn": ["transit", "@repo/vitest-config#build"]
},
"transit": {
  "dependsOn": ["^transit"]
}
```

This ensures tests run in the correct order based on package dependencies.

### Why Shared Config Package?

- **Consistency**: All packages use the same base configuration
- **DRY**: Avoid duplicating configuration across packages
- **Easy updates**: Change once, applies everywhere
- **Type-safe**: Shared config is built and type-checked
- **Flexible**: Packages can override specific settings

## Test Stack

### Unit & Integration Tests

- **Vitest 4.x** - Fast, ESM-first test runner with native TypeScript support
- **@testing-library/react** - React component testing utilities
- **happy-dom** - Lightweight DOM implementation for Node.js
- **@vitest/coverage-v8** - V8-based code coverage

### E2E Tests

- **Playwright** - Modern E2E testing framework
- Multi-browser support (Chromium, Firefox, WebKit)
- Mobile viewport testing
- Parallel test execution

## Running Tests

### Unit & Integration Tests (via Turborepo)

```bash
# Run all package tests (leverages Turborepo caching)
pnpm test

# Run tests in watch mode (auto-rerun on changes)
pnpm test:watch

# Run tests with coverage reports
pnpm test:coverage

# Run only package tests (exclude apps)
pnpm test:packages

# Force re-run all tests (bypass cache)
pnpm test --force

# Run tests in a specific package
pnpm --filter @repo/validators test
pnpm --filter @repo/utils test

# Run tests for packages affected by changes
turbo run test --filter=[HEAD^1]

# Run tests and see Turborepo execution graph
pnpm test --graph

# Run tests with verbose output
pnpm test --output-logs=full
```

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run E2E tests in debug mode
pnpm test:e2e:debug

# View test report
pnpm test:e2e:report
```

### Run All Tests

```bash
# Run both unit and E2E tests
pnpm test:all
```

## Writing Tests

### Configuring Tests in a Package

Each package that needs tests should:

1. **Add dependencies** to `package.json`:
```json
{
  "devDependencies": {
    "@repo/vitest-config": "workspace:*",
    "vitest": "^4.0.18",
    "@vitest/coverage-v8": "^4.0.18"
  }
}
```

2. **Create `vitest.config.ts`** extending shared config:
```typescript
import { defineConfig } from "vitest/config";
import { sharedConfig } from "@repo/vitest-config";

export default defineConfig({
  ...sharedConfig,
  test: {
    ...sharedConfig.test,
    // Package-specific overrides (optional)
    environment: 'jsdom', // For React components
    include: ["__tests__/**/*.test.ts"],
  },
});
```

3. **Add test scripts** to `package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Unit Tests

**Example: Testing a utility function**

```typescript
// packages/utils/__tests__/string.test.ts
import { describe, it, expect } from "vitest";
import { capitalize, truncate } from "../src/string";

describe("string utils", () => {
  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("should handle empty string", () => {
      expect(capitalize("")).toBe("");
    });
  });

  describe("truncate", () => {
    it("should truncate long strings", () => {
      expect(truncate("Hello World", 5)).toBe("Hello...");
    });

    it("should not truncate short strings", () => {
      expect(truncate("Hi", 5)).toBe("Hi");
    });
  });
});
```

### Component Tests

**Example: Testing a React component**

```typescript
// packages/ui/__tests__/button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../src/components/button'

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})
```

### Integration Tests

**Example: Testing package interactions**

```typescript
// packages/validators/__tests__/integration/cross-package.test.ts
import { describe, it, expect } from "vitest";
import { isEmail } from "@repo/validators";
import { capitalize } from "@repo/utils";

describe("Integration: Validators + Utils", () => {
  it("should validate and format email", () => {
    const email = "test@example.com";
    expect(isEmail(email)).toBe(true);
    expect(capitalize(email)).toBe("Test@example.com");
  });
});
```

### E2E Tests

**Example: Testing user flows**

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should login successfully", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrong");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=/error|invalid/i")).toBeVisible();
  });
});
```

## Test Structure

### Directory Structure

```
node-mono-library/
├── packages/
│   ├── utils/
│   │   ├── src/
│   │   └── __tests__/
│   │       ├── utils.test.ts
│   │       └── integration/
│   ├── validators/
│   │   ├── src/
│   │   └── __tests__/
│   │       ├── validators.test.ts
│   │       └── integration/
│   └── ui/
│       ├── src/
│       └── __tests__/
│           └── components/
├── apps/
│   └── admin/
│       ├── src/
│       └── __tests__/
├── tests/
│   └── e2e/
│       ├── admin.spec.ts
│       ├── auth.spec.ts
│       └── navigation.spec.ts
├── vitest.config.ts
├── vitest.setup.ts
└── playwright.config.ts
```

### Naming Conventions

- **Unit tests:** `*.test.ts` or `*.spec.ts`
- **Component tests:** `*.test.tsx` or `*.spec.tsx`
- **Integration tests:** Place in `integration/` folder
- **E2E tests:** `*.spec.ts` in `tests/e2e/`

## Best Practices

### General

✅ **DO:**

- Write descriptive test names
- Test one thing per test
- Use arrange-act-assert pattern
- Mock external dependencies
- Test edge cases and error conditions
- Keep tests independent
- Use meaningful assertions

❌ **DON'T:**

- Test implementation details
- Write tests that depend on each other
- Use arbitrary timeouts
- Test third-party libraries
- Over-mock (mock only what's needed)

### Unit Tests

```typescript
// ✅ Good: Clear, focused test
it("should return user by id", async () => {
  const user = await getUserById("123");
  expect(user.id).toBe("123");
});

// ❌ Bad: Testing multiple things
it("should handle users", async () => {
  const user = await getUserById("123");
  const users = await getAllUsers();
  await deleteUser("123");
  // Too much in one test
});
```

### Component Tests

```typescript
// ✅ Good: Testing user behavior
it('should submit form when valid', async () => {
  render(<LoginForm />)

  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
  await userEvent.type(screen.getByLabelText(/password/i), 'password123')
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(mockSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  })
})

// ❌ Bad: Testing implementation
it('should call useState hook', () => {
  // Don't test React internals
})
```

### E2E Tests

```typescript
// ✅ Good: Testing complete user flow
test("complete checkout process", async ({ page }) => {
  await page.goto("/products");
  await page.click("text=Add to Cart");
  await page.click("text=Checkout");
  await page.fill("#email", "test@example.com");
  await page.click("text=Complete Order");

  await expect(page.locator("text=Order Confirmed")).toBeVisible();
});

// ❌ Bad: Testing styling
test("button is blue", async ({ page }) => {
  // E2E tests shouldn't test CSS
});
```

## Coverage

### View Coverage Report

```bash
pnpm test:coverage
```

Coverage reports are generated in `coverage/` directory.

### Coverage Thresholds

Aim for:

- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

Configure in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      lines: 80,
      branches: 75,
      functions: 80,
      statements: 80,
    },
  },
});
```

## Mocking

### Mocking Functions

```typescript
import { vi } from "vitest";

const mockFn = vi.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue(Promise.resolve("data"));

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith("arg");
```

### Mocking Modules

```typescript
vi.mock("../api/users", () => ({
  getUsers: vi.fn(() => Promise.resolve([{ id: 1, name: "Test" }])),
  createUser: vi.fn(),
}));
```

### Mocking Dates

```typescript
import { vi } from "vitest";

vi.useFakeTimers();
vi.setSystemTime(new Date("2024-01-01"));

// Your test code

vi.useRealTimers();
```

## Debugging Tests

### Vitest

```bash
# Debug specific test file
pnpm vitest run path/to/test.test.ts

# Run tests with verbose output
pnpm vitest run --reporter=verbose

# Update snapshots
pnpm vitest run -u
```

### Playwright

```bash
# Debug mode with inspector
pnpm test:e2e:debug

# Run specific test file
pnpm playwright test tests/e2e/login.spec.ts

# Run tests in headed mode
pnpm playwright test --headed

# Run with specific browser
pnpm playwright test --project=chromium
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run unit tests
        run: pnpm test

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Troubleshooting

### Common Issues

**1. Tests timing out**

```typescript
// Increase timeout for specific test
it("slow test", async () => {
  // test code
}, 10000); // 10 second timeout
```

**2. Flaky E2E tests**

```typescript
// Use proper waits
await page.waitForSelector("text=Loaded");
await expect(page.locator("text=Content")).toBeVisible();

// Don't use arbitrary timeouts
await page.waitForTimeout(1000); // ❌ Bad
```

**3. Module not found errors**

- Check path aliases in `vitest.config.ts`
- Ensure `tsconfig.json` paths are correct
- Run `pnpm install` to update dependencies

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Test Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Examples

See existing tests for examples:

- `packages/utils/__tests__/` - Unit tests
- `packages/validators/__tests__/` - Validator tests
- `tests/e2e/` - E2E test examples
