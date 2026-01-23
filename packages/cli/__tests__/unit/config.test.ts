/**
 * Tests for config utility
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { loadConfig, type CliConfig } from "../../src/utils/config.js";
import {
  createTempDir,
  cleanupTempDir,
  createTestFile,
  mockCwd,
} from "../helpers/test-utils.js";
import { defaultConfig, customConfig } from "../helpers/fixtures.js";

describe("config", () => {
  let tempDir: string;
  let restoreCwd: () => void;

  beforeEach(() => {
    tempDir = createTempDir();
    restoreCwd = mockCwd(tempDir);
  });

  afterEach(() => {
    restoreCwd();
    cleanupTempDir(tempDir);
  });

  describe("loadConfig", () => {
    it("should return null when no config file exists", async () => {
      const config = await loadConfig();
      expect(config).toBeNull();
    });

    it("should load config from repo-cli.json", async () => {
      createTestFile(tempDir, "repo-cli.json", defaultConfig);

      const config = await loadConfig();

      expect(config).toBeDefined();
      expect(config?.defaultSchema).toBe("user");
      expect(config?.outputDir).toBe("./generated");
    });

    it("should load config from .repo-cli.json", async () => {
      createTestFile(tempDir, ".repo-cli.json", customConfig);

      const config = await loadConfig();

      expect(config).toBeDefined();
      expect(config?.defaultSchema).toBe("product");
    });

    it("should prefer repo-cli.json over .repo-cli.json", async () => {
      createTestFile(tempDir, "repo-cli.json", { defaultSchema: "user" });
      createTestFile(tempDir, ".repo-cli.json", { defaultSchema: "product" });

      const config = await loadConfig();

      expect(config?.defaultSchema).toBe("user");
    });

    it("should return null for invalid JSON", async () => {
      createTestFile(tempDir, "repo-cli.json", "invalid json {");

      const config = await loadConfig();

      expect(config).toBeNull();
    });

    it("should handle all config properties", async () => {
      const fullConfig: CliConfig = {
        defaultSchema: "contact",
        outputDir: "./output",
        templates: {
          component: "./tpl/component.tsx",
          hook: "./tpl/hook.ts",
        },
      };
      createTestFile(tempDir, "repo-cli.json", fullConfig);

      const config = await loadConfig();

      expect(config).toEqual(fullConfig);
    });
  });
});
