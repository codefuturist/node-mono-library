/**
 * Comprehensive tests for the validate command
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { runValidate } from "../../src/commands/validate.js";
import {
  createTempDir,
  cleanupTempDir,
  createTestFile,
  mockCwd,
} from "../helpers/test-utils.js";
import {
  validUser,
  invalidUserEmail,
  invalidUserAge,
  invalidUserName,
  partialUser,
  validProduct,
  invalidProductPrice,
  invalidProductSku,
  validContact,
  invalidContactEmail,
  invalidContactPhone,
} from "../helpers/fixtures.js";

describe("validate command", () => {
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

  describe("user schema validation", () => {
    it("should validate a complete valid user", async () => {
      createTestFile(tempDir, "user.json", validUser);

      const result = await runValidate("user.json", { schema: "user" });

      expect(result.valid).toBe(true);
      expect(result.results.every((r) => r.valid)).toBe(true);
    });

    it("should reject invalid email format", async () => {
      createTestFile(tempDir, "user.json", invalidUserEmail);

      const result = await runValidate("user.json", { schema: "user" });

      expect(result.valid).toBe(false);
      const emailResult = result.results.find((r) => r.field === "email");
      expect(emailResult?.valid).toBe(false);
      expect(emailResult?.message).toContain("email");
    });

    it("should reject age out of valid range", async () => {
      createTestFile(tempDir, "user.json", invalidUserAge);

      const result = await runValidate("user.json", { schema: "user" });

      expect(result.valid).toBe(false);
      const ageResult = result.results.find((r) => r.field === "age");
      expect(ageResult?.valid).toBe(false);
    });

    it("should reject name that is too short", async () => {
      createTestFile(tempDir, "user.json", invalidUserName);

      const result = await runValidate("user.json", { schema: "user" });

      expect(result.valid).toBe(false);
      const nameResult = result.results.find((r) => r.field === "name");
      expect(nameResult?.valid).toBe(false);
    });

    it("should pass partial user in non-strict mode", async () => {
      createTestFile(tempDir, "user.json", partialUser);

      const result = await runValidate("user.json", { schema: "user" });

      expect(result.valid).toBe(true);
    });

    it("should fail partial user in strict mode", async () => {
      createTestFile(tempDir, "user.json", partialUser);

      const result = await runValidate("user.json", {
        schema: "user",
        strict: true,
      });

      expect(result.valid).toBe(false);
      expect(result.results.some((r) => r.message.includes("missing"))).toBe(
        true
      );
    });
  });

  describe("product schema validation", () => {
    it("should validate a complete valid product", async () => {
      createTestFile(tempDir, "product.json", validProduct);

      const result = await runValidate("product.json", { schema: "product" });

      expect(result.valid).toBe(true);
    });

    it("should reject negative price", async () => {
      createTestFile(tempDir, "product.json", invalidProductPrice);

      const result = await runValidate("product.json", { schema: "product" });

      expect(result.valid).toBe(false);
      const priceResult = result.results.find((r) => r.field === "price");
      expect(priceResult?.valid).toBe(false);
    });

    it("should reject non-alphanumeric SKU", async () => {
      createTestFile(tempDir, "product.json", invalidProductSku);

      const result = await runValidate("product.json", { schema: "product" });

      expect(result.valid).toBe(false);
      const skuResult = result.results.find((r) => r.field === "sku");
      expect(skuResult?.valid).toBe(false);
    });
  });

  describe("contact schema validation", () => {
    it("should validate a complete valid contact", async () => {
      createTestFile(tempDir, "contact.json", validContact);

      const result = await runValidate("contact.json", { schema: "contact" });

      expect(result.valid).toBe(true);
    });

    it("should reject invalid email in contact", async () => {
      createTestFile(tempDir, "contact.json", invalidContactEmail);

      const result = await runValidate("contact.json", { schema: "contact" });

      expect(result.valid).toBe(false);
    });

    it("should reject invalid phone number", async () => {
      createTestFile(tempDir, "contact.json", invalidContactPhone);

      const result = await runValidate("contact.json", { schema: "contact" });

      expect(result.valid).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should throw for non-existent file", async () => {
      await expect(
        runValidate("nonexistent.json", { schema: "user" })
      ).rejects.toThrow("File not found");
    });

    it("should throw for invalid JSON", async () => {
      createTestFile(tempDir, "invalid.json", "not valid json {");

      await expect(
        runValidate("invalid.json", { schema: "user" })
      ).rejects.toThrow("Failed to parse");
    });

    it("should throw for unknown schema", async () => {
      createTestFile(tempDir, "data.json", { foo: "bar" });

      await expect(
        runValidate("data.json", { schema: "unknown" as never })
      ).rejects.toThrow("Unknown schema");
    });

    it("should throw for non-object data", async () => {
      createTestFile(tempDir, "array.json", [1, 2, 3]);

      await expect(
        runValidate("array.json", { schema: "user" })
      ).rejects.toThrow("must be a JSON object");
    });
  });

  describe("validation result structure", () => {
    it("should return results for each validated field", async () => {
      createTestFile(tempDir, "user.json", validUser);

      const result = await runValidate("user.json", { schema: "user" });

      expect(result.results.length).toBeGreaterThan(0);
      result.results.forEach((r) => {
        expect(r).toHaveProperty("field");
        expect(r).toHaveProperty("valid");
        expect(r).toHaveProperty("message");
      });
    });

    it("should include validation messages in results", async () => {
      createTestFile(tempDir, "user.json", invalidUserEmail);

      const result = await runValidate("user.json", { schema: "user" });

      const emailResult = result.results.find((r) => r.field === "email");
      expect(emailResult?.message).toBeTruthy();
      expect(emailResult?.message.length).toBeGreaterThan(0);
    });
  });
});
