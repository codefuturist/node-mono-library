import { describe, it, expect } from "vitest";
import { unique, chunk, groupBy, last, first, shuffle } from "../src/array";

describe("array utilities", () => {
  describe("unique", () => {
    it("removes duplicate values", () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it("handles empty array", () => {
      expect(unique([])).toEqual([]);
    });

    it("handles strings", () => {
      expect(unique(["a", "b", "a"])).toEqual(["a", "b"]);
    });
  });

  describe("chunk", () => {
    it("chunks array into smaller arrays", () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("handles exact division", () => {
      expect(chunk([1, 2, 3, 4], 2)).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });

    it("throws on invalid size", () => {
      expect(() => chunk([1, 2, 3], 0)).toThrow();
    });

    it("handles empty array", () => {
      expect(chunk([], 2)).toEqual([]);
    });
  });

  describe("shuffle", () => {
    it("returns array of same length", () => {
      const arr = [1, 2, 3, 4, 5];
      expect(shuffle(arr)).toHaveLength(5);
    });

    it("contains all original elements", () => {
      const arr = [1, 2, 3, 4, 5];
      expect(shuffle(arr).sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it("does not modify original array", () => {
      const arr = [1, 2, 3, 4, 5];
      shuffle(arr);
      expect(arr).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("groupBy", () => {
    it("groups items by key function", () => {
      const items = [
        { type: "a", value: 1 },
        { type: "b", value: 2 },
        { type: "a", value: 3 },
      ];
      expect(groupBy(items, (item) => item.type)).toEqual({
        a: [
          { type: "a", value: 1 },
          { type: "a", value: 3 },
        ],
        b: [{ type: "b", value: 2 }],
      });
    });

    it("handles empty array", () => {
      expect(groupBy([], (x) => x)).toEqual({});
    });
  });

  describe("first and last", () => {
    it("returns first element", () => {
      expect(first([1, 2, 3])).toBe(1);
    });

    it("returns last element", () => {
      expect(last([1, 2, 3])).toBe(3);
    });

    it("returns undefined for empty array", () => {
      expect(first([])).toBeUndefined();
      expect(last([])).toBeUndefined();
    });
  });
});
