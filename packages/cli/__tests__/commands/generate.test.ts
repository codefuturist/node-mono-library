/**
 * Comprehensive tests for the generate command
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { runGenerate } from "../../src/commands/generate.js";
import {
  createTempDir,
  cleanupTempDir,
  mockCwd,
} from "../helpers/test-utils.js";

describe("generate command", () => {
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

  describe("component generation", () => {
    it("should generate a React component file", async () => {
      await runGenerate("Button", { type: "component" });

      const filePath = join(tempDir, "components", "Button.tsx");
      expect(existsSync(filePath)).toBe(true);
    });

    it("should generate valid React component code", async () => {
      await runGenerate("MyWidget", { type: "component" });

      const content = readFileSync(
        join(tempDir, "components", "MyWidget.tsx"),
        "utf-8"
      );

      expect(content).toContain('import React from "react"');
      expect(content).toContain("export interface MyWidgetProps");
      expect(content).toContain("export function MyWidget");
      expect(content).toContain("export default MyWidget");
    });

    it("should convert kebab-case name to PascalCase", async () => {
      await runGenerate("my-button", { type: "component" });

      const filePath = join(tempDir, "components", "MyButton.tsx");
      expect(existsSync(filePath)).toBe(true);

      const content = readFileSync(filePath, "utf-8");
      expect(content).toContain("function MyButton");
    });
  });

  describe("hook generation", () => {
    it("should generate a React hook file", async () => {
      await runGenerate("auth", { type: "hook" });

      const filePath = join(tempDir, "hooks", "Auth.ts");
      expect(existsSync(filePath)).toBe(true);
    });

    it("should generate valid hook code", async () => {
      await runGenerate("toggle", { type: "hook" });

      const content = readFileSync(
        join(tempDir, "hooks", "Toggle.ts"),
        "utf-8"
      );

      expect(content).toContain("import { useState, useCallback }");
      expect(content).toContain("export function useToggle");
      expect(content).toContain("export interface UseToggleOptions");
      expect(content).toContain("export interface UseToggleResult");
    });
  });

  describe("util generation", () => {
    it("should generate a utility file", async () => {
      await runGenerate("format-date", { type: "util" });

      const filePath = join(tempDir, "utils", "format-date.ts");
      expect(existsSync(filePath)).toBe(true);
    });

    it("should generate valid utility code", async () => {
      await runGenerate("string-helper", { type: "util" });

      const content = readFileSync(
        join(tempDir, "utils", "string-helper.ts"),
        "utf-8"
      );

      expect(content).toContain("export function stringHelper");
      expect(content).toContain("export async function stringHelperAsync");
    });
  });

  describe("service generation", () => {
    it("should generate a service file", async () => {
      await runGenerate("api", { type: "service" });

      const filePath = join(tempDir, "services", "api.ts");
      expect(existsSync(filePath)).toBe(true);
    });

    it("should generate valid service code", async () => {
      await runGenerate("user", { type: "service" });

      const content = readFileSync(
        join(tempDir, "services", "user.ts"),
        "utf-8"
      );

      expect(content).toContain("export class UserService");
      expect(content).toContain("export interface UserConfig");
      expect(content).toContain("async get(");
      expect(content).toContain("async list(");
      expect(content).toContain("async create(");
      expect(content).toContain("async update(");
      expect(content).toContain("async delete(");
    });
  });

  describe("validator generation", () => {
    it("should generate a validator file", async () => {
      await runGenerate("order", { type: "validator" });

      const filePath = join(tempDir, "validators", "order.ts");
      expect(existsSync(filePath)).toBe(true);
    });

    it("should generate valid validator code", async () => {
      await runGenerate("payment", { type: "validator" });

      const content = readFileSync(
        join(tempDir, "validators", "payment.ts"),
        "utf-8"
      );

      expect(content).toContain("@repo/validators");
      expect(content).toContain("export interface PaymentData");
      expect(content).toContain("export function validatePayment");
      expect(content).toContain("export function isPayment");
    });
  });

  describe("custom output directory", () => {
    it("should respect custom output option", async () => {
      await runGenerate("Button", { type: "component", output: "src/ui" });

      const filePath = join(tempDir, "src", "ui", "Button.tsx");
      expect(existsSync(filePath)).toBe(true);
    });

    it("should create nested output directories", async () => {
      await runGenerate("Widget", {
        type: "component",
        output: "src/components/shared",
      });

      const filePath = join(
        tempDir,
        "src",
        "components",
        "shared",
        "Widget.tsx"
      );
      expect(existsSync(filePath)).toBe(true);
    });
  });

  describe("force option", () => {
    it("should throw without force if file exists", async () => {
      await runGenerate("Button", { type: "component" });

      await expect(
        runGenerate("Button", { type: "component" })
      ).rejects.toThrow("already exists");
    });

    it("should overwrite with force option", async () => {
      await runGenerate("Button", { type: "component" });
      await runGenerate("Button", { type: "component", force: true });

      const filePath = join(tempDir, "components", "Button.tsx");
      expect(existsSync(filePath)).toBe(true);
    });
  });

  describe("error handling", () => {
    it("should throw for empty name", async () => {
      await expect(runGenerate("", { type: "component" })).rejects.toThrow(
        "Name is required"
      );
    });
  });

  describe("return value", () => {
    it("should return generated file path", async () => {
      const result = await runGenerate("TestComponent", { type: "component" });

      expect(result.files).toHaveLength(1);
      expect(result.files[0]).toContain("TestComponent.tsx");
    });

    it("should return success message", async () => {
      const result = await runGenerate("MyUtil", { type: "util" });

      expect(result.message).toContain("Generated");
      expect(result.message).toContain("util");
    });
  });
});
