import { describe, it, expect } from "vitest";
import { deepClone, deepMerge, pick, omit, isEmpty } from "../src/object";

describe("object utilities", () => {
  describe("deepClone", () => {
    it("clones nested objects", () => {
      const original = { a: { b: { c: 1 } } };
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.a).not.toBe(original.a);
    });

    it("clones arrays", () => {
      const original = [1, [2, 3], { a: 4 }];
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it("clones dates", () => {
      const date = new Date();
      const cloned = deepClone(date);
      expect(cloned.getTime()).toBe(date.getTime());
      expect(cloned).not.toBe(date);
    });

    it("handles primitives", () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone("hello")).toBe("hello");
      expect(deepClone(null)).toBe(null);
    });
  });

  describe("deepMerge", () => {
    it("merges nested objects", () => {
      const obj1 = { a: { b: 1, c: 2 } };
      const obj2 = { a: { c: 3, d: 4 } };
      expect(deepMerge(obj1, obj2)).toEqual({ a: { b: 1, c: 3, d: 4 } });
    });

    it("handles multiple objects", () => {
      const result = deepMerge({ a: 1 }, { b: 2 }, { c: 3 });
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("does not merge arrays", () => {
      const obj1 = { arr: [1, 2] };
      const obj2 = { arr: [3, 4] };
      expect(deepMerge(obj1, obj2)).toEqual({ arr: [3, 4] });
    });
  });

  describe("pick", () => {
    it("picks specified keys", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ["a", "c"])).toEqual({ a: 1, c: 3 });
    });

    it("ignores missing keys", () => {
      const obj = { a: 1, b: 2 };
      expect(pick(obj, ["a", "c" as keyof typeof obj])).toEqual({ a: 1 });
    });
  });

  describe("omit", () => {
    it("omits specified keys", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ["b"])).toEqual({ a: 1, c: 3 });
    });

    it("handles empty keys array", () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, [])).toEqual({ a: 1, b: 2 });
    });
  });

  describe("isEmpty", () => {
    it("returns true for empty object", () => {
      expect(isEmpty({})).toBe(true);
    });

    it("returns false for non-empty object", () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });
});
