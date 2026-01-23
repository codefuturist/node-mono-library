import { describe, it, expect } from "vitest";
import {
  isEmail,
  isValidDate,
  isPositive,
  isInRange,
  hasMinLength,
  hasMaxLength,
} from "../src";

describe("validators", () => {
  describe("string validators", () => {
    describe("isEmail", () => {
      it("should validate correct emails", () => {
        expect(isEmail("test@example.com")).toBe(true);
        expect(isEmail("user.name+tag@example.co.uk")).toBe(true);
      });

      it("should reject invalid emails", () => {
        expect(isEmail("invalid")).toBe(false);
        expect(isEmail("test@")).toBe(false);
        expect(isEmail("@example.com")).toBe(false);
        expect(isEmail("")).toBe(false);
      });
    });

    describe("hasMinLength", () => {
      it("should validate minimum length", () => {
        expect(hasMinLength("hello", 3)).toBe(true);
        expect(hasMinLength("hi", 3)).toBe(false);
        expect(hasMinLength("", 1)).toBe(false);
      });
    });

    describe("hasMaxLength", () => {
      it("should validate maximum length", () => {
        expect(hasMaxLength("hi", 5)).toBe(true);
        expect(hasMaxLength("hello world", 5)).toBe(false);
      });
    });
  });

  describe("number validators", () => {
    describe("isPositive", () => {
      it("should validate positive numbers", () => {
        expect(isPositive(5)).toBe(true);
        expect(isPositive(0.1)).toBe(true);
        expect(isPositive(0)).toBe(false);
        expect(isPositive(-1)).toBe(false);
      });
    });

    describe("isInRange", () => {
      it("should validate number ranges", () => {
        expect(isInRange(5, 0, 10)).toBe(true);
        expect(isInRange(0, 0, 10)).toBe(true);
        expect(isInRange(10, 0, 10)).toBe(true);
        expect(isInRange(11, 0, 10)).toBe(false);
        expect(isInRange(-1, 0, 10)).toBe(false);
      });
    });
  });

  describe("date validators", () => {
    describe("isValidDate", () => {
      it("should validate Date objects", () => {
        expect(isValidDate(new Date())).toBe(true);
        expect(isValidDate(new Date("2024-01-01"))).toBe(true);
        expect(isValidDate(new Date("invalid"))).toBe(false);
      });

      it("should handle various date inputs", () => {
        // isValidDate only accepts Date objects based on implementation
        expect(isValidDate(new Date("2024-01-01"))).toBe(true);
        expect(isValidDate(new Date("invalid"))).toBe(false);
      });
    });
  });
});
