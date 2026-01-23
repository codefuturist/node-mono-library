/**
 * Comprehensive tests for the init command
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { runInit } from "../../src/commands/init.js";
import {
  createTempDir,
  cleanupTempDir,
  mockCwd,
} from "../helpers/test-utils.js";

describe("init command", () => {
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

  describe("project initialization", () => {
    it("should create a new project with all required files", async () => {
      await runInit("my-project", { type: "project" });

      const projectDir = join(tempDir, "my-project");

      expect(existsSync(projectDir)).toBe(true);
      expect(existsSync(join(projectDir, "package.json"))).toBe(true);
      expect(existsSync(join(projectDir, "src", "index.ts"))).toBe(true);
      expect(existsSync(join(projectDir, "__tests__", "index.test.ts"))).toBe(
        true
      );
    });

    it("should create valid package.json", async () => {
      await runInit("test-pkg", { type: "project" });

      const packageJson = JSON.parse(
        readFileSync(join(tempDir, "test-pkg", "package.json"), "utf-8")
      );

      expect(packageJson.name).toBe("@repo/test-pkg");
      expect(packageJson.version).toBe("0.1.0");
      expect(packageJson.type).toBe("module");
      expect(packageJson.scripts).toHaveProperty("build");
      expect(packageJson.scripts).toHaveProperty("test");
    });

    it("should create source file with correct content", async () => {
      await runInit("hello-pkg", { type: "project" });

      const content = readFileSync(
        join(tempDir, "hello-pkg", "src", "index.ts"),
        "utf-8"
      );

      expect(content).toContain("@repo/hello-pkg");
      expect(content).toContain("Hello from hello-pkg!");
    });

    it("should create test file with correct content", async () => {
      await runInit("my-pkg", { type: "project" });

      const content = readFileSync(
        join(tempDir, "my-pkg", "__tests__", "index.test.ts"),
        "utf-8"
      );

      expect(content).toContain("describe");
      expect(content).toContain("my-pkg");
      expect(content).toContain("expect(hello())");
    });

    it("should throw error if directory exists without force", async () => {
      await runInit("existing", { type: "project" });

      await expect(runInit("existing", { type: "project" })).rejects.toThrow(
        "already exists"
      );
    });

    it("should overwrite directory with force option", async () => {
      await runInit("overwrite-me", { type: "project" });
      await runInit("overwrite-me", { type: "project", force: true });

      expect(existsSync(join(tempDir, "overwrite-me"))).toBe(true);
    });
  });

  describe("config initialization", () => {
    it("should create config file in current directory", async () => {
      await runInit("config", { type: "config" });

      expect(existsSync(join(tempDir, "repo-cli.json"))).toBe(true);
    });

    it("should create valid config JSON", async () => {
      await runInit("config", { type: "config" });

      const config = JSON.parse(
        readFileSync(join(tempDir, "repo-cli.json"), "utf-8")
      );

      expect(config).toHaveProperty("defaultSchema");
      expect(config).toHaveProperty("outputDir");
      expect(config).toHaveProperty("templates");
    });

    it("should throw if config already exists", async () => {
      await runInit("config", { type: "config" });

      await expect(runInit("config", { type: "config" })).rejects.toThrow(
        "already exists"
      );
    });
  });

  describe("component initialization", () => {
    it("should create component file in components directory", async () => {
      await runInit("Button", { type: "component" });

      const componentPath = join(tempDir, "Button", "components", "Button.tsx");
      expect(existsSync(componentPath)).toBe(true);
    });

    it("should create valid React component", async () => {
      await runInit("MyWidget", { type: "component" });

      const content = readFileSync(
        join(tempDir, "MyWidget", "components", "MyWidget.tsx"),
        "utf-8"
      );

      expect(content).toContain("import React");
      expect(content).toContain("export interface MyWidgetProps");
      expect(content).toContain("export function MyWidget");
    });
  });

  describe("error handling", () => {
    it("should throw error for empty name", async () => {
      await expect(runInit("", { type: "project" })).rejects.toThrow(
        "Name is required"
      );
    });

    it("should throw error for unknown type", async () => {
      await expect(
        runInit("test", { type: "unknown" as never })
      ).rejects.toThrow("Unknown type");
    });
  });
});
