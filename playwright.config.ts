import { defineConfig, devices } from "@playwright/test";

const authFile = "tests/e2e/.auth/user.json";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    // Setup project - authenticates once and saves state
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },

    // Browser projects that depend on setup for auth
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: authFile,
      },
      dependencies: ["setup"],
      testIgnore: /.*\.setup\.ts/,
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        storageState: authFile,
      },
      dependencies: ["setup"],
      testIgnore: /.*\.setup\.ts/,
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        storageState: authFile,
      },
      dependencies: ["setup"],
      testIgnore: /.*\.setup\.ts/,
    },

    // Mobile viewports
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
        storageState: authFile,
      },
      dependencies: ["setup"],
      testIgnore: /.*\.setup\.ts/,
    },
    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 12"],
        storageState: authFile,
      },
      dependencies: ["setup"],
      testIgnore: /.*\.setup\.ts/,
    },

    // Unauthenticated tests (login page tests)
    {
      name: "chromium-unauthenticated",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*\.unauthenticated\.spec\.ts/,
    },
  ],

  webServer: {
    command: "pnpm --filter=admin dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
