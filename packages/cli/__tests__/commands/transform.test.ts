/**
 * Comprehensive tests for the transform command
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { runTransform } from "../../src/commands/transform.js";
import {
  createTempDir,
  cleanupTempDir,
  createTestFile,
  mockCwd,
} from "../helpers/test-utils.js";
import {
  duplicateNumbers,
  uniqueNumbers,
  duplicateStrings,
  uniqueStrings,
  chunkableArray,
  chunkedBy2,
  chunkedBy3,
  transformCases,
  truncateCases,
} from "../helpers/fixtures.js";

describe("transform command", () => {
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

  describe("string transformations", () => {
    describe("kebab-case conversion", () => {
      it.each(Object.entries(transformCases))(
        "should convert %s to kebab-case",
        async (input, expected) => {
          const result = await runTransform(input, { kebab: true });
          expect(result).toBe(expected.kebab);
        }
      );
    });

    describe("camelCase conversion", () => {
      it.each(Object.entries(transformCases))(
        "should convert %s to camelCase",
        async (input, expected) => {
          const result = await runTransform(input, { camel: true });
          expect(result).toBe(expected.camel);
        }
      );
    });

    describe("capitalize conversion", () => {
      it("should capitalize first letter", async () => {
        const result = await runTransform("hello", { capitalize: true });
        expect(result).toBe("Hello");
      });

      it("should handle already capitalized strings", async () => {
        const result = await runTransform("Hello", { capitalize: true });
        expect(result).toBe("Hello");
      });

      it("should handle single character strings", async () => {
        const result = await runTransform("a", { capitalize: true });
        expect(result).toBe("A");
      });
    });

    describe("truncation", () => {
      it.each(truncateCases)(
        "should truncate '$input' to $length characters",
        async ({ input, length, expected }) => {
          const result = await runTransform(input, { truncate: length });
          expect(result).toBe(expected);
        }
      );
    });

    describe("chained transformations", () => {
      it("should apply kebab then capitalize", async () => {
        const result = await runTransform("Hello World", {
          kebab: true,
          capitalize: true,
        });
        expect(result).toBe("Hello-world");
      });

      it("should apply multiple transformations in order", async () => {
        const result = await runTransform("HELLO_WORLD", {
          kebab: true,
          truncate: 8,
        });
        expect(result).toBe("hello...");
      });
    });
  });

  describe("array transformations", () => {
    describe("unique", () => {
      it("should remove duplicate numbers", async () => {
        const result = await runTransform(JSON.stringify(duplicateNumbers), {
          json: true,
          unique: true,
        });
        expect(result).toEqual(uniqueNumbers);
      });

      it("should remove duplicate strings", async () => {
        const result = await runTransform(JSON.stringify(duplicateStrings), {
          json: true,
          unique: true,
        });
        expect(result).toEqual(uniqueStrings);
      });

      it("should handle already unique arrays", async () => {
        const result = await runTransform(JSON.stringify(uniqueNumbers), {
          json: true,
          unique: true,
        });
        expect(result).toEqual(uniqueNumbers);
      });

      it("should handle empty arrays", async () => {
        const result = await runTransform("[]", { json: true, unique: true });
        expect(result).toEqual([]);
      });
    });

    describe("chunk", () => {
      it("should chunk array into groups of 2", async () => {
        const result = await runTransform(JSON.stringify(chunkableArray), {
          json: true,
          chunk: 2,
        });
        expect(result).toEqual(chunkedBy2);
      });

      it("should chunk array into groups of 3", async () => {
        const result = await runTransform(JSON.stringify(chunkableArray), {
          json: true,
          chunk: 3,
        });
        expect(result).toEqual(chunkedBy3);
      });

      it("should handle chunk size larger than array", async () => {
        const result = await runTransform("[1, 2, 3]", {
          json: true,
          chunk: 10,
        });
        expect(result).toEqual([[1, 2, 3]]);
      });
    });

    describe("chained array transformations", () => {
      it("should apply unique then chunk", async () => {
        const input = [1, 1, 2, 2, 3, 3, 4, 4];
        const result = await runTransform(JSON.stringify(input), {
          json: true,
          unique: true,
          chunk: 2,
        });
        expect(result).toEqual([
          [1, 2],
          [3, 4],
        ]);
      });
    });
  });

  describe("file input", () => {
    it("should read and transform from file", async () => {
      createTestFile(tempDir, "input.txt", "Hello World");

      const result = await runTransform("input.txt", { kebab: true });
      expect(result).toBe("hello-world");
    });

    it("should read and transform JSON from file", async () => {
      createTestFile(tempDir, "data.json", [1, 2, 2, 3]);

      const result = await runTransform("data.json", {
        json: true,
        unique: true,
      });
      expect(result).toEqual([1, 2, 3]);
    });

    it("should trim file content", async () => {
      createTestFile(tempDir, "whitespace.txt", "  Hello World  \n");

      const result = await runTransform("whitespace.txt", { kebab: true });
      expect(result).toBe("hello-world");
    });
  });

  describe("error handling", () => {
    it("should throw on invalid JSON input", async () => {
      await expect(
        runTransform("not valid json", { json: true })
      ).rejects.toThrow("Failed to parse JSON");
    });

    it("should throw on invalid JSON file", async () => {
      createTestFile(tempDir, "bad.json", "{ invalid json }");

      await expect(runTransform("bad.json", { json: true })).rejects.toThrow(
        "Failed to parse JSON"
      );
    });

    it("should throw when input is not string or array", async () => {
      await expect(
        runTransform('{"key": "value"}', { json: true, unique: true })
      ).rejects.toThrow("must be a string or array");
    });
  });
});
