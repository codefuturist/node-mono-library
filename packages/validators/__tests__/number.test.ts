import { describe, it, expect } from "vitest";
import {
    isNumber,
    isInteger,
    isPositive,
    isNegative,
    isZero,
    isInRange,
    isGreaterThan,
    isLessThan,
    isEven,
    isOdd,
    isDivisibleBy,
} from "../src/number";

describe("number validators", () => {
    describe("isNumber", () => {
        it("returns true for valid numbers", () => {
            expect(isNumber(42)).toBe(true);
            expect(isNumber(3.14)).toBe(true);
            expect(isNumber(-10)).toBe(true);
        });

        it("returns false for NaN and Infinity", () => {
            expect(isNumber(NaN)).toBe(false);
            expect(isNumber(Infinity)).toBe(false);
            expect(isNumber(-Infinity)).toBe(false);
        });

        it("returns false for non-numbers", () => {
            expect(isNumber("42")).toBe(false);
            expect(isNumber(null)).toBe(false);
            expect(isNumber(undefined)).toBe(false);
        });
    });

    describe("isInteger", () => {
        it("returns true for integers", () => {
            expect(isInteger(42)).toBe(true);
            expect(isInteger(-10)).toBe(true);
            expect(isInteger(0)).toBe(true);
        });

        it("returns false for floats", () => {
            expect(isInteger(3.14)).toBe(false);
        });
    });

    describe("isPositive / isNegative / isZero", () => {
        it("validates positive numbers", () => {
            expect(isPositive(5)).toBe(true);
            expect(isPositive(-5)).toBe(false);
            expect(isPositive(0)).toBe(false);
        });

        it("validates negative numbers", () => {
            expect(isNegative(-5)).toBe(true);
            expect(isNegative(5)).toBe(false);
            expect(isNegative(0)).toBe(false);
        });

        it("validates zero", () => {
            expect(isZero(0)).toBe(true);
            expect(isZero(1)).toBe(false);
        });
    });

    describe("isInRange", () => {
        it("returns true when in range", () => {
            expect(isInRange(5, 1, 10)).toBe(true);
            expect(isInRange(1, 1, 10)).toBe(true);
            expect(isInRange(10, 1, 10)).toBe(true);
        });

        it("returns false when outside range", () => {
            expect(isInRange(0, 1, 10)).toBe(false);
            expect(isInRange(11, 1, 10)).toBe(false);
        });
    });

    describe("isGreaterThan / isLessThan", () => {
        it("validates greater than", () => {
            expect(isGreaterThan(10, 5)).toBe(true);
            expect(isGreaterThan(5, 5)).toBe(false);
        });

        it("validates less than", () => {
            expect(isLessThan(3, 5)).toBe(true);
            expect(isLessThan(5, 5)).toBe(false);
        });
    });

    describe("isEven / isOdd", () => {
        it("validates even numbers", () => {
            expect(isEven(4)).toBe(true);
            expect(isEven(5)).toBe(false);
            expect(isEven(0)).toBe(true);
        });

        it("validates odd numbers", () => {
            expect(isOdd(5)).toBe(true);
            expect(isOdd(4)).toBe(false);
        });
    });

    describe("isDivisibleBy", () => {
        it("validates divisibility", () => {
            expect(isDivisibleBy(10, 5)).toBe(true);
            expect(isDivisibleBy(10, 3)).toBe(false);
        });

        it("handles division by zero", () => {
            expect(isDivisibleBy(10, 0)).toBe(false);
        });
    });
});
