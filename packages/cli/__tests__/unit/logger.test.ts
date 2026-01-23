/**
 * Tests for logger utility
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { logger } from "../../src/utils/logger.js";
import {
  mockConsole,
  stripAnsi,
  type ConsoleMock,
} from "../helpers/test-utils.js";

describe("logger", () => {
  let consoleMock: ConsoleMock;

  beforeEach(() => {
    consoleMock = mockConsole();
  });

  afterEach(() => {
    consoleMock.restore();
  });

  describe("info", () => {
    it("should log info messages", () => {
      logger.info("Test message");

      expect(consoleMock.log).toHaveBeenCalled();
      const output = stripAnsi(consoleMock.getOutput().join(""));
      expect(output).toContain("Test message");
    });
  });

  describe("success", () => {
    it("should log success messages", () => {
      logger.success("Operation completed");

      expect(consoleMock.log).toHaveBeenCalled();
      const output = stripAnsi(consoleMock.getOutput().join(""));
      expect(output).toContain("Operation completed");
    });
  });

  describe("warn", () => {
    it("should log warning messages", () => {
      logger.warn("Warning message");

      expect(consoleMock.log).toHaveBeenCalled();
      const output = stripAnsi(consoleMock.getOutput().join(""));
      expect(output).toContain("Warning message");
    });
  });

  describe("error", () => {
    it("should log error messages to stderr", () => {
      logger.error("Error message");

      expect(consoleMock.error).toHaveBeenCalled();
      const output = stripAnsi(consoleMock.getErrors().join(""));
      expect(output).toContain("Error message");
    });
  });

  describe("blank", () => {
    it("should log empty line", () => {
      logger.blank();

      expect(consoleMock.log).toHaveBeenCalled();
    });
  });

  describe("list", () => {
    it("should log items as a list", () => {
      logger.list(["Item 1", "Item 2", "Item 3"]);

      expect(consoleMock.log).toHaveBeenCalledTimes(3);
    });

    it("should handle empty list", () => {
      logger.list([]);

      expect(consoleMock.log).not.toHaveBeenCalled();
    });
  });

  describe("step", () => {
    it("should log step with progress", () => {
      logger.step(1, 5, "First step");

      expect(consoleMock.log).toHaveBeenCalled();
      const output = stripAnsi(consoleMock.getOutput().join(""));
      expect(output).toContain("1/5");
      expect(output).toContain("First step");
    });
  });

  describe("box", () => {
    it("should create a box around text", () => {
      logger.box("Title", "Boxed content");

      expect(consoleMock.log).toHaveBeenCalled();
    });
  });

  describe("dim", () => {
    it("should log dimmed text", () => {
      logger.dim("Dimmed text");

      expect(consoleMock.log).toHaveBeenCalled();
    });
  });
});
