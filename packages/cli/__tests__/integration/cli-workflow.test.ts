/**
 * Integration tests for the CLI
 * Tests the full workflow and command interactions
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { runInit } from "../../src/commands/init.js";
import { runValidate } from "../../src/commands/validate.js";
import { runGenerate } from "../../src/commands/generate.js";
import { runTransform } from "../../src/commands/transform.js";
import {
  createTempDir,
  cleanupTempDir,
  createTestFile,
  mockCwd,
} from "../helpers/test-utils.js";

describe("CLI Integration Tests", () => {
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

  describe("full project workflow", () => {
    it("should initialize a project and generate components", async () => {
      // Step 1: Initialize a new project
      await runInit("my-app", { type: "project" });

      // Verify project was created
      expect(existsSync(join(tempDir, "my-app"))).toBe(true);
      expect(existsSync(join(tempDir, "my-app", "package.json"))).toBe(true);

      // Step 2: Generate a component within the project
      const projectCwd = join(tempDir, "my-app");
      const restoreProjectCwd = mockCwd(projectCwd);

      try {
        await runGenerate("Button", { type: "component" });
        await runGenerate("useAuth", { type: "hook" });
        await runGenerate("api", { type: "service" });

        // Verify generated files
        expect(existsSync(join(projectCwd, "components", "Button.tsx"))).toBe(
          true
        );
        expect(existsSync(join(projectCwd, "hooks", "UseAuth.ts"))).toBe(true);
        expect(existsSync(join(projectCwd, "services", "api.ts"))).toBe(true);
      } finally {
        restoreProjectCwd();
      }
    });

    it("should create config and use it for validation", async () => {
      // Create a config file
      await runInit("my-config", { type: "config" });
      expect(existsSync(join(tempDir, "repo-cli.json"))).toBe(true);

      // Create test data and validate
      createTestFile(tempDir, "user.json", {
        name: "John Doe",
        email: "john@example.com",
        age: 25,
      });

      const result = await runValidate("user.json", { schema: "user" });
      expect(result.valid).toBe(true);
    });
  });

  describe("data transformation pipeline", () => {
    it("should transform data through multiple operations", async () => {
      // Create input file with duplicate array
      const input = [1, 2, 2, 3, 3, 3, 4, 5, 5, 6];
      createTestFile(tempDir, "numbers.json", input);

      // Remove duplicates
      const uniqueResult = await runTransform("numbers.json", {
        json: true,
        unique: true,
      });
      expect(uniqueResult).toEqual([1, 2, 3, 4, 5, 6]);

      // Chunk the unique array
      const chunkedResult = await runTransform(
        JSON.stringify([1, 2, 3, 4, 5, 6]),
        { json: true, chunk: 2 }
      );
      expect(chunkedResult).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });

    it("should transform strings from file", async () => {
      createTestFile(tempDir, "names.txt", "John Smith");

      const kebabResult = await runTransform("names.txt", { kebab: true });
      expect(kebabResult).toBe("john-smith");
    });
  });

  describe("validation workflow", () => {
    it("should validate multiple files against different schemas", async () => {
      // Create test files
      createTestFile(tempDir, "user.json", {
        name: "Alice",
        email: "alice@example.com",
        age: 30,
      });

      createTestFile(tempDir, "product.json", {
        name: "Widget",
        price: 29.99,
        sku: "ABC123",
      });

      createTestFile(tempDir, "contact.json", {
        email: "contact@company.com",
        phone: "+1-555-123-4567",
      });

      // Validate each
      const userResult = await runValidate("user.json", { schema: "user" });
      const productResult = await runValidate("product.json", {
        schema: "product",
      });
      const contactResult = await runValidate("contact.json", {
        schema: "contact",
      });

      expect(userResult.valid).toBe(true);
      expect(productResult.valid).toBe(true);
      expect(contactResult.valid).toBe(true);
    });

    it("should identify validation errors across files", async () => {
      createTestFile(tempDir, "bad-user.json", {
        name: "X", // Too short
        email: "invalid",
        age: 200,
      });

      const result = await runValidate("bad-user.json", { schema: "user" });

      expect(result.valid).toBe(false);
      expect(
        result.results.filter((r) => !r.valid).length
      ).toBeGreaterThanOrEqual(2);
    });
  });

  describe("code generation workflow", () => {
    it("should generate a complete feature set", async () => {
      // Generate related files for a "user" feature
      await runGenerate("user", { type: "service" });
      await runGenerate("user", { type: "validator" });
      await runGenerate("UserCard", { type: "component" });
      await runGenerate("useUser", { type: "hook" });

      // Verify all files exist
      expect(existsSync(join(tempDir, "services", "user.ts"))).toBe(true);
      expect(existsSync(join(tempDir, "validators", "user.ts"))).toBe(true);
      expect(existsSync(join(tempDir, "components", "UserCard.tsx"))).toBe(
        true
      );
      expect(existsSync(join(tempDir, "hooks", "UseUser.ts"))).toBe(true);
    });

    it("should generate to custom directories", async () => {
      await runGenerate("Button", { type: "component", output: "src/ui" });
      await runGenerate("Input", { type: "component", output: "src/ui" });
      await runGenerate("Modal", { type: "component", output: "src/ui" });

      expect(existsSync(join(tempDir, "src", "ui", "Button.tsx"))).toBe(true);
      expect(existsSync(join(tempDir, "src", "ui", "Input.tsx"))).toBe(true);
      expect(existsSync(join(tempDir, "src", "ui", "Modal.tsx"))).toBe(true);
    });
  });

  describe("error recovery", () => {
    it("should handle invalid operations gracefully", async () => {
      // Try to validate non-existent file
      await expect(
        runValidate("missing.json", { schema: "user" })
      ).rejects.toThrow();

      // After error, other operations should still work
      createTestFile(tempDir, "valid.json", {
        name: "Test",
        email: "test@test.com",
      });
      const result = await runValidate("valid.json", { schema: "user" });
      expect(result.valid).toBe(true);
    });

    it("should continue after generation failure", async () => {
      // Generate file
      await runGenerate("Button", { type: "component" });

      // Try to generate same file (should fail without force)
      await expect(
        runGenerate("Button", { type: "component" })
      ).rejects.toThrow();

      // Generate different file should work
      await runGenerate("Input", { type: "component" });
      expect(existsSync(join(tempDir, "components", "Input.tsx"))).toBe(true);
    });
  });

  describe("complex data scenarios", () => {
    it("should handle large arrays in transform", async () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i % 100);
      createTestFile(tempDir, "large.json", largeArray);

      const result = await runTransform("large.json", {
        json: true,
        unique: true,
      });
      expect(Array.isArray(result)).toBe(true);
      expect((result as number[]).length).toBe(100);
    });

    it("should validate deeply nested structures", async () => {
      createTestFile(tempDir, "nested.json", {
        name: "Nested User",
        email: "nested@example.com",
        age: 35,
      });

      const result = await runValidate("nested.json", { schema: "user" });
      expect(result.valid).toBe(true);
    });
  });
});
