import { defineConfig } from "vitest/config";
import { sharedConfig } from "@repo/vitest-config";

export default defineConfig({
  ...sharedConfig,
  test: {
    ...sharedConfig.test,
    include: ["__tests__/**/*.test.ts"],
    exclude: ["__tests__/helpers/**"],
    coverage: {
      ...sharedConfig.test.coverage,
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["src/cli.ts", "src/index.ts"],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    reporters: ["verbose"],
    pool: "forks",
    sequence: {
      shuffle: true,
    },
    typecheck: {
      enabled: false,
    },
  },
});
