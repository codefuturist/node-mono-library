/**
 * Test utilities for CLI testing
 */

import {
  mkdirSync,
  writeFileSync,
  rmSync,
  existsSync,
  mkdtempSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { vi, type Mock } from "vitest";

/**
 * Create a temporary directory for test isolation
 */
export function createTempDir(prefix = "cli-test-"): string {
  return mkdtempSync(join(tmpdir(), prefix));
}

/**
 * Clean up a temporary directory
 */
export function cleanupTempDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Create a test file with content
 */
export function createTestFile(
  dir: string,
  filename: string,
  content: string | object
): string {
  const filePath = join(dir, filename);
  const dirPath = join(dir, ...filename.split("/").slice(0, -1));

  if (dirPath !== dir && !existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }

  const fileContent =
    typeof content === "object" ? JSON.stringify(content, null, 2) : content;
  writeFileSync(filePath, fileContent);
  return filePath;
}

/**
 * Create multiple test files
 */
export function createTestFiles(
  dir: string,
  files: Record<string, string | object>
): Record<string, string> {
  const paths: Record<string, string> = {};
  for (const [filename, content] of Object.entries(files)) {
    paths[filename] = createTestFile(dir, filename, content);
  }
  return paths;
}

/**
 * Mock console methods for testing CLI output
 */
export interface ConsoleMock {
  log: Mock;
  error: Mock;
  warn: Mock;
  info: Mock;
  restore: () => void;
  getOutput: () => string[];
  getErrors: () => string[];
}

export function mockConsole(): ConsoleMock {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;

  const logMock = vi.fn();
  const errorMock = vi.fn();
  const warnMock = vi.fn();
  const infoMock = vi.fn();

  console.log = logMock;
  console.error = errorMock;
  console.warn = warnMock;
  console.info = infoMock;

  return {
    log: logMock,
    error: errorMock,
    warn: warnMock,
    info: infoMock,
    restore: () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    },
    getOutput: () => logMock.mock.calls.map((call) => call.join(" ")),
    getErrors: () => errorMock.mock.calls.map((call) => call.join(" ")),
  };
}

/**
 * Mock process.exit for testing CLI exit codes
 */
export interface ProcessExitMock {
  mock: Mock;
  restore: () => void;
  getExitCode: () => number | undefined;
  wasCalled: () => boolean;
}

export function mockProcessExit(): ProcessExitMock {
  const originalExit = process.exit;
  const exitMock = vi.fn();

  process.exit = exitMock as never;

  return {
    mock: exitMock,
    restore: () => {
      process.exit = originalExit;
    },
    getExitCode: () => exitMock.mock.calls[0]?.[0] as number | undefined,
    wasCalled: () => exitMock.mock.calls.length > 0,
  };
}

/**
 * Mock process.cwd for testing in different directories
 */
export function mockCwd(dir: string): () => void {
  const mockFn = vi.spyOn(process, "cwd").mockReturnValue(dir);

  return () => {
    mockFn.mockRestore();
  };
}

/**
 * Wait for async operations to complete
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Strip ANSI color codes from string for easier testing
 */
export function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
}

/**
 * Capture stdout/stderr during execution
 */
export interface OutputCapture {
  stdout: string[];
  stderr: string[];
}

export async function captureOutput<T>(
  fn: () => Promise<T>
): Promise<{ result: T; output: OutputCapture }> {
  const stdout: string[] = [];
  const stderr: string[] = [];

  const originalWrite = process.stdout.write;
  const originalErrWrite = process.stderr.write;

  process.stdout.write = (chunk: string | Uint8Array) => {
    stdout.push(String(chunk));
    return true;
  };

  process.stderr.write = (chunk: string | Uint8Array) => {
    stderr.push(String(chunk));
    return true;
  };

  try {
    const result = await fn();
    return { result, output: { stdout, stderr } };
  } finally {
    process.stdout.write = originalWrite;
    process.stderr.write = originalErrWrite;
  }
}
