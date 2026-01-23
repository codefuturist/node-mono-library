import { describe, it, expect } from "vitest";
import {
    isEmpty,
    isNotEmpty,
    hasMinLength,
    hasMaxLength,
    hasLengthBetween,
    isAlpha,
    isAlphanumeric,
    matchesPattern,
    contains,
    startsWith,
    endsWith,
} from "../src/string";

describe("string validators", () => {
    describe("isEmpty", () => {
        it("returns true for empty string", () => {
            expect(isEmpty("")).toBe(true);
        });

        it("returns true for whitespace-only string", () => {
            expect(isEmpty("   ")).toBe(true);
        });

        it("returns false for non-empty string", () => {
            expect(isEmpty("hello")).toBe(false);
        });
    });

    describe("isNotEmpty", () => {
        it("returns false for empty string", () => {
            expect(isNotEmpty("")).toBe(false);
        });

        it("returns true for non-empty string", () => {
            expect(isNotEmpty("hello")).toBe(true);
        });
    });

    describe("hasMinLength", () => {
        it("returns true when string meets minimum length", () => {
            expect(hasMinLength("hello", 5)).toBe(true);
        });

        it("returns false when string is too short", () => {
            expect(hasMinLength("hi", 5)).toBe(false);
        });
    });

    describe("hasMaxLength", () => {
        it("returns true when string is within maximum length", () => {
            expect(hasMaxLength("hello", 10)).toBe(true);
        });

        it("returns false when string exceeds maximum length", () => {
            expect(hasMaxLength("hello world", 5)).toBe(false);
        });
    });

    describe("hasLengthBetween", () => {
        it("returns true when length is within range", () => {
            expect(hasLengthBetween("hello", 3, 10)).toBe(true);
        });

        it("returns false when length is outside range", () => {
            expect(hasLengthBetween("hi", 3, 10)).toBe(false);
        });
    });

    describe("isAlpha", () => {
        it("returns true for alphabetic string", () => {
            expect(isAlpha("Hello")).toBe(true);
        });

        it("returns false for string with numbers", () => {
            expect(isAlpha("Hello123")).toBe(false);
        });
    });

    describe("isAlphanumeric", () => {
        it("returns true for alphanumeric string", () => {
            expect(isAlphanumeric("Hello123")).toBe(true);
        });

        it("returns false for string with special characters", () => {
            expect(isAlphanumeric("Hello-123")).toBe(false);
        });
    });

    describe("matchesPattern", () => {
        it("returns true when string matches pattern", () => {
            expect(matchesPattern("abc123", /^[a-z]+\d+$/)).toBe(true);
        });

        it("returns false when string does not match pattern", () => {
            expect(matchesPattern("ABC123", /^[a-z]+\d+$/)).toBe(false);
        });
    });

    describe("contains", () => {
        it("returns true when substring is found", () => {
            expect(contains("hello world", "world")).toBe(true);
        });

        it("returns false when substring is not found", () => {
            expect(contains("hello world", "foo")).toBe(false);
        });
    });

    describe("startsWith / endsWith", () => {
        it("checks prefix correctly", () => {
            expect(startsWith("hello world", "hello")).toBe(true);
            expect(startsWith("hello world", "world")).toBe(false);
        });

        it("checks suffix correctly", () => {
            expect(endsWith("hello world", "world")).toBe(true);
            expect(endsWith("hello world", "hello")).toBe(false);
        });
    });
});
