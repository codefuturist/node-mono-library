/**
 * Tests for logger utility
 *
 * Note: consola writes to process.stdout/stderr directly, not console.log/error.
 * We mock the underlying consola instance for log-level methods.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { logger, consola } from "../../src/utils/logger.js";
import {
  mockConsole,
  stripAnsi,
  type ConsoleMock,
} from "../helpers/test-utils.js";

describe("logger", () => {
  let consoleMock: ConsoleMock;

  beforeEach(() => {
    consoleMock = mockConsole();
    // Mock consola methods (it uses its own output, not console.log)
    vi.spyOn(consola, "info").mockImplementation(() => {});
    vi.spyOn(consola, "success").mockImplementation(() => {});
    vi.spyOn(consola, "warn").mockImplementation(() => {});
    vi.spyOn(consola, "error").mockImplementation(() => {});
    vi.spyOn(consola, "box").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleMock.restore();
    vi.restoreAllMocks();
  });

  describe("info", () => {
    it("should log info messages", () => {
      logger.info("Test message");

      expect(consola.info).toHaveBeenCalledWith("Test message");
    });
  });

  describe("success", () => {
    it("should log success messages", () => {
      logger.success("Operation completed");

      expect(consola.success).toHaveBeenCalledWith("Operation completed");
    });
  });

  describe("warn", () => {
    it("should log warning messages", () => {
      logger.warn("Warning message");

      expect(consola.warn).toHaveBeenCalledWith("Warning message");
    });
  });

  describe("error", () => {
    it("should log error messages", () => {
      logger.error("Error message");

      expect(consola.error).toHaveBeenCalledWith("Error message");
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

      expect(consola.box).toHaveBeenCalledWith({
        title: "Title",
        message: "Boxed content",
      });
    });
  });

  describe("dim", () => {
    it("should log dimmed text", () => {
      logger.dim("Dimmed text");

      expect(consoleMock.log).toHaveBeenCalled();
    });
  });

  describe("setLevel", () => {
    it("should change log level", () => {
      logger.setLevel("debug");
      expect(logger.getLevel()).toBe(4); // debug level
      logger.setLevel("info");
      expect(logger.getLevel()).toBe(3); // info level
    });
  });
});
