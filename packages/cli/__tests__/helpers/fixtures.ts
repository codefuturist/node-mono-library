/**
 * Test fixtures for CLI testing
 */

// ============================================================================
// User Schema Fixtures
// ============================================================================

export const validUser = {
  id: "user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  age: 30,
};

export const invalidUserEmail = {
  id: "user-456",
  name: "Jane Doe",
  email: "not-an-email",
  age: 25,
};

export const invalidUserAge = {
  id: "user-789",
  name: "Bob Smith",
  email: "bob@example.com",
  age: 150, // Too old
};

export const invalidUserName = {
  id: "user-000",
  name: "A", // Too short
  email: "a@example.com",
  age: 20,
};

export const partialUser = {
  name: "Partial User",
};

// ============================================================================
// Product Schema Fixtures
// ============================================================================

export const validProduct = {
  id: "prod-001",
  name: "Awesome Widget",
  price: 29.99,
  sku: "SKU123ABC",
  url: "https://example.com/widget",
};

export const invalidProductPrice = {
  name: "Expensive Widget",
  price: -10, // Negative price
  sku: "SKU456",
};

export const invalidProductSku = {
  name: "Bad SKU Widget",
  price: 19.99,
  sku: "SKU-123!@#", // Non-alphanumeric
};

export const invalidProductUrl = {
  name: "Bad URL Widget",
  price: 19.99,
  url: "not a valid url",
};

// ============================================================================
// Contact Schema Fixtures
// ============================================================================

export const validContact = {
  name: "Jane Contact",
  email: "jane@company.com",
  phone: "+1-555-123-4567",
  website: "https://jane.example.com",
};

export const invalidContactEmail = {
  name: "Bad Email Contact",
  email: "invalid-email",
  phone: "+1-555-999-0000",
};

export const invalidContactPhone = {
  name: "Bad Phone Contact",
  email: "valid@email.com",
  phone: "not-a-phone",
};

// ============================================================================
// Array Fixtures for Transform
// ============================================================================

export const duplicateNumbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
export const uniqueNumbers = [1, 2, 3, 4];

export const duplicateStrings = [
  "apple",
  "banana",
  "apple",
  "cherry",
  "banana",
];
export const uniqueStrings = ["apple", "banana", "cherry"];

export const chunkableArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const chunkedBy2 = [
  [1, 2],
  [3, 4],
  [5, 6],
  [7, 8],
  [9, 10],
];
export const chunkedBy3 = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];

// ============================================================================
// String Fixtures for Transform
// ============================================================================

export const transformCases = {
  "Hello World": {
    kebab: "hello-world",
    camel: "helloWorld",
    capitalize: "Hello World",
  },
  "hello-world": {
    kebab: "hello-world",
    camel: "helloWorld",
    capitalize: "Hello-world",
  },
  helloWorld: {
    kebab: "hello-world",
    camel: "helloWorld",
    capitalize: "HelloWorld",
  },
};

export const truncateCases = [
  { input: "Hello World", length: 5, expected: "He..." },
  { input: "Hello World", length: 10, expected: "Hello W..." },
  { input: "Hi", length: 10, expected: "Hi" }, // No truncation needed
  { input: "Testing", length: 7, expected: "Testing" }, // Exactly at limit
];

// ============================================================================
// Package.json Template
// ============================================================================

export const packageJsonTemplate = (name: string) => ({
  name: `@repo/${name}`,
  version: "0.1.0",
  description: `${name} package`,
  type: "module",
  main: "./dist/index.js",
  types: "./dist/index.d.ts",
  scripts: {
    build: "tsup",
    dev: "tsup --watch",
    test: "vitest run",
    lint: "eslint . --max-warnings 0",
  },
});

// ============================================================================
// Component Templates
// ============================================================================

export const componentTemplate = (name: string) => `import React from "react";

export interface ${name}Props {
  children?: React.ReactNode;
  className?: string;
}

export function ${name}({ children, className }: ${name}Props) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default ${name};
`;

// ============================================================================
// Config Fixtures
// ============================================================================

export const defaultConfig = {
  defaultSchema: "user",
  outputDir: "./generated",
  templates: {
    component: "./templates/component.ts",
  },
};

export const customConfig = {
  defaultSchema: "product",
  outputDir: "./src/generated",
  templates: {
    component: "./templates/react-component.tsx",
    hook: "./templates/react-hook.ts",
  },
};
