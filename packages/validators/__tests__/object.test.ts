import { describe, it, expect } from "vitest";
import {
    isPlainObject,
    isNull,
    isUndefined,
    isNullish,
    isNotNullish,
    hasKeys,
    hasAnyKey,
    isEmptyObject,
    isEmptyArray,
    isArray,
    hasMinItems,
    hasMaxItems,
    includes,
} from "../src/object";

describe("object validators", () => {
    describe("isPlainObject", () => {
        it("returns true for plain objects", () => {
            expect(isPlainObject({})).toBe(true);
            expect(isPlainObject({ a: 1 })).toBe(true);
        });

        it("returns false for non-plain objects", () => {
            expect(isPlainObject([])).toBe(false);
            expect(isPlainObject(null)).toBe(false);
            expect(isPlainObject(new Date())).toBe(false);
        });
    });

    describe("isNull / isUndefined / isNullish", () => {
        it("validates null", () => {
            expect(isNull(null)).toBe(true);
            expect(isNull(undefined)).toBe(false);
        });

        it("validates undefined", () => {
            expect(isUndefined(undefined)).toBe(true);
            expect(isUndefined(null)).toBe(false);
        });

        it("validates nullish values", () => {
            expect(isNullish(null)).toBe(true);
            expect(isNullish(undefined)).toBe(true);
            expect(isNullish(0)).toBe(false);
            expect(isNullish("")).toBe(false);
        });
    });

    describe("isNotNullish", () => {
        it("returns true for non-nullish values", () => {
            expect(isNotNullish(0)).toBe(true);
            expect(isNotNullish("")).toBe(true);
            expect(isNotNullish(false)).toBe(true);
        });

        it("returns false for nullish values", () => {
            expect(isNotNullish(null)).toBe(false);
            expect(isNotNullish(undefined)).toBe(false);
        });
    });

    describe("hasKeys", () => {
        it("returns true when object has all keys", () => {
            expect(hasKeys({ a: 1, b: 2, c: 3 }, ["a", "b"])).toBe(true);
        });

        it("returns false when object is missing keys", () => {
            expect(hasKeys({ a: 1 } as { a: number; b?: number }, ["a", "b"])).toBe(
                false
            );
        });
    });

    describe("hasAnyKey", () => {
        it("returns true when object has at least one key", () => {
            expect(
                hasAnyKey({ a: 1 } as { a?: number; b?: number }, ["a", "b"])
            ).toBe(true);
        });

        it("returns false when object has none of the keys", () => {
            expect(
                hasAnyKey({ c: 1 } as { a?: number; b?: number; c: number }, ["a", "b"])
            ).toBe(false);
        });
    });

    describe("isEmptyObject", () => {
        it("returns true for empty object", () => {
            expect(isEmptyObject({})).toBe(true);
        });

        it("returns false for non-empty object", () => {
            expect(isEmptyObject({ a: 1 })).toBe(false);
        });
    });

    describe("isEmptyArray / isArray", () => {
        it("validates empty array", () => {
            expect(isEmptyArray([])).toBe(true);
            expect(isEmptyArray([1])).toBe(false);
        });

        it("validates arrays", () => {
            expect(isArray([])).toBe(true);
            expect(isArray({})).toBe(false);
        });
    });

    describe("hasMinItems / hasMaxItems", () => {
        it("validates minimum items", () => {
            expect(hasMinItems([1, 2, 3], 2)).toBe(true);
            expect(hasMinItems([1], 2)).toBe(false);
        });

        it("validates maximum items", () => {
            expect(hasMaxItems([1, 2], 3)).toBe(true);
            expect(hasMaxItems([1, 2, 3, 4], 3)).toBe(false);
        });
    });

    describe("includes", () => {
        it("checks if array includes value", () => {
            expect(includes([1, 2, 3], 2)).toBe(true);
            expect(includes([1, 2, 3], 4)).toBe(false);
        });
    });
});
