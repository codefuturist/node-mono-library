import { describe, it, expect } from "vitest";
import { chunk } from "../src/array";
import { capitalize, truncate } from "../src/string";

describe("array utils", () => {
  describe("chunk", () => {
    it("should split array into chunks of specified size", () => {
      const arr = [1, 2, 3, 4, 5, 6, 7];
      expect(chunk(arr, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });

    it("should return empty array for empty input", () => {
      expect(chunk([], 2)).toEqual([]);
    });

    it("should handle chunk size larger than array", () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });

    it("should handle chunk size of 1", () => {
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });
  });
});

describe("string utils", () => {
  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("should handle empty string", () => {
      expect(capitalize("")).toBe("");
    });

    it("should handle already capitalized", () => {
      expect(capitalize("Hello")).toBe("Hello");
    });
  });

  describe("truncate", () => {
    it("should truncate long strings", () => {
      expect(truncate("Hello World", 5)).toBe("He...");
    });

    it("should not truncate short strings", () => {
      expect(truncate("Hi", 5)).toBe("Hi");
    });

    it("should use custom suffix", () => {
      expect(truncate("Hello World", 5, "…")).toBe("Hell…");
    });
  });
});
