import { defineConfig } from "vitest/config";

/**
 * Options for creating a Vitest configuration
 */
export interface CreateConfigOptions {
  /** Test name shown in reporter (defaults to package name from cwd) */
  name?: string;
  /** Test environment: 'node' | 'jsdom' | 'happy-dom' */
  environment?: "node" | "jsdom" | "happy-dom";
  /** Glob patterns for test files */
  include?: string[];
  /** Additional coverage include patterns */
  coverageInclude?: string[];
  /** Additional coverage exclude patterns */
  coverageExclude?: string[];
}

/**
 * Base shared configuration for all packages
 */
const baseTestConfig = {
  globals: true,
  coverage: {
    provider: "v8" as const,
    reporter: [["json", { file: "coverage.json" }], "text", "html"],
    include: ["src/**/*.ts"],
    exclude: [
      "node_modules",
      "dist",
      "**/*.d.ts",
      "**/*.config.*",
      "**/mockData",
      "**/__tests__/**",
    ],
  },
};

/**
 * Creates a Vitest configuration with sensible defaults.
 * Simplifies per-package setup to a single function call.
 *
 * @param options - Configuration options
 * @returns Vitest configuration object
 *
 * @example
 * ```ts
 * // vitest.config.ts - minimal setup
 * import { createConfig } from "@repo/vitest-config";
 *
 * export default createConfig();
 * ```
 *
 * @example
 * ```ts
 * // vitest.config.ts - with customization
 * import { createConfig } from "@repo/vitest-config";
 *
 * export default createConfig({
 *   name: "my-package",
 *   environment: "jsdom",
 *   include: ["__tests__/**\/*.test.tsx"],
 * });
 * ```
 */
export function createConfig(options: CreateConfigOptions = {}) {
  const {
    name,
    environment = "node",
    include = ["__tests__/**/*.test.ts"],
    coverageInclude = [],
    coverageExclude = [],
  } = options;

  return defineConfig({
    test: {
      globals: baseTestConfig.globals,
      name,
      environment,
      include,
      coverage: {
        provider: "v8",
        reporter: [["json", { file: "coverage.json" }], "text", "html"],
        include: [...baseTestConfig.coverage.include, ...coverageInclude],
        exclude: [...baseTestConfig.coverage.exclude, ...coverageExclude],
      },
    },
  });
}

/**
 * Shared Vitest configuration for the monorepo
 * @deprecated Use `createConfig()` instead for a cleaner setup
 *
 * This configuration can be extended by individual packages
 * to maintain consistency across the monorepo.
 */
export const sharedConfig = {
  test: {
    ...baseTestConfig,
    environment: "node" as const,
  },
} as const;
