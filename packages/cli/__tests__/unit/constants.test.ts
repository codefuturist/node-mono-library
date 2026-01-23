/**
 * Tests for constants and configuration
 */

import { describe, it, expect } from "vitest";

import {
  VERSION,
  CLI_NAME,
  CLI_DESCRIPTION,
  SCHEMAS,
} from "../../src/constants.js";

describe("constants", () => {
  describe("VERSION", () => {
    it("should be a valid semver string", () => {
      expect(VERSION).toMatch(/^\d+\.\d+\.\d+(-[\w.]+)?$/);
    });
  });

  describe("CLI_NAME", () => {
    it("should be defined", () => {
      expect(CLI_NAME).toBeDefined();
      expect(typeof CLI_NAME).toBe("string");
      expect(CLI_NAME.length).toBeGreaterThan(0);
    });

    it("should be a valid CLI name (no spaces)", () => {
      expect(CLI_NAME).not.toContain(" ");
    });
  });

  describe("CLI_DESCRIPTION", () => {
    it("should be defined and descriptive", () => {
      expect(CLI_DESCRIPTION).toBeDefined();
      expect(CLI_DESCRIPTION.length).toBeGreaterThan(10);
    });
  });

  describe("SCHEMAS", () => {
    it("should have user schema", () => {
      expect(SCHEMAS).toHaveProperty("user");
      expect(SCHEMAS.user).toHaveProperty("email");
      expect(SCHEMAS.user).toHaveProperty("name");
      expect(SCHEMAS.user).toHaveProperty("age");
    });

    it("should have product schema", () => {
      expect(SCHEMAS).toHaveProperty("product");
      expect(SCHEMAS.product).toHaveProperty("name");
      expect(SCHEMAS.product).toHaveProperty("price");
      expect(SCHEMAS.product).toHaveProperty("sku");
    });

    it("should have contact schema", () => {
      expect(SCHEMAS).toHaveProperty("contact");
      expect(SCHEMAS.contact).toHaveProperty("email");
      expect(SCHEMAS.contact).toHaveProperty("phone");
    });

    it("should use valid field type definitions", () => {
      // Check field type format
      Object.values(SCHEMAS).forEach((schema) => {
        Object.values(schema).forEach((fieldType) => {
          expect(typeof fieldType).toBe("string");
          expect(fieldType.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
