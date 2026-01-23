import { describe, it, expect } from "vitest";
import {
  capitalize,
  toKebabCase,
  toCamelCase,
  truncate,
  randomString,
} from "../src/string";

describe("string utilities", () => {
  describe("capitalize", () => {
    it("capitalizes the first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("handles empty string", () => {
      expect(capitalize("")).toBe("");
    });

    it("handles already capitalized string", () => {
      expect(capitalize("Hello")).toBe("Hello");
    });

    it("only capitalizes first letter", () => {
      expect(capitalize("hello world")).toBe("Hello world");
    });
  });

  describe("toKebabCase", () => {
    it("converts camelCase to kebab-case", () => {
      expect(toKebabCase("helloWorld")).toBe("hello-world");
    });

    it("converts PascalCase to kebab-case", () => {
      expect(toKebabCase("HelloWorld")).toBe("hello-world");
    });

    it("converts spaces to dashes", () => {
      expect(toKebabCase("hello world")).toBe("hello-world");
    });

    it("converts underscores to dashes", () => {
      expect(toKebabCase("hello_world")).toBe("hello-world");
    });
  });

  describe("toCamelCase", () => {
    it("converts kebab-case to camelCase", () => {
      expect(toCamelCase("hello-world")).toBe("helloWorld");
    });

    it("converts snake_case to camelCase", () => {
      expect(toCamelCase("hello_world")).toBe("helloWorld");
    });

    it("converts spaces to camelCase", () => {
      expect(toCamelCase("hello world")).toBe("helloWorld");
    });
  });

  describe("truncate", () => {
    it("truncates long strings", () => {
      expect(truncate("hello world", 8)).toBe("hello...");
    });

    it("does not truncate short strings", () => {
      expect(truncate("hello", 10)).toBe("hello");
    });

    it("uses custom suffix", () => {
      expect(truncate("hello world", 8, "…")).toBe("hello w…");
    });
  });

  describe("randomString", () => {
    it("generates string of correct length", () => {
      expect(randomString(10)).toHaveLength(10);
    });

    it("generates different strings each time", () => {
      const str1 = randomString(20);
      const str2 = randomString(20);
      expect(str1).not.toBe(str2);
    });
  });
});
