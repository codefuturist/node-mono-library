/**
 * Logger utility for consistent CLI output
 *
 * A pkg-compatible logger using picocolors for styling.
 * Replaces consola which causes segfaults in pkg binaries.
 *
 * Log levels:
 *   0: silent
 *   1: error, fatal
 *   2: warn
 *   3: info, success (default)
 *   4: debug
 *   5: verbose, trace
 */

import pc from "picocolors";

// Log level constants
export const LogLevels = {
  silent: 0,
  error: 1,
  fatal: 1,
  warn: 2,
  info: 3,
  success: 3,
  debug: 4,
  verbose: 5,
  trace: 5,
} as const;

export interface Logger {
  // Standard log levels
  info: (message: string, ...args: unknown[]) => void;
  success: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
  verbose: (message: string, ...args: unknown[]) => void;
  fatal: (message: string, ...args: unknown[]) => void;

  // CLI-specific helpers
  dim: (message: string) => void;
  blank: () => void;
  box: (title: string, content: string) => void;
  list: (items: string[], prefix?: string) => void;
  step: (step: number, total: number, message: string) => void;
  start: (message: string) => void;

  // Configuration
  setLevel: (level: keyof typeof LogLevels) => void;
  getLevel: () => number;
}

// Get initial log level from environment
const getInitialLevel = (): number => {
  if (process.env.LOG_LEVEL) {
    const level = process.env.LOG_LEVEL.toLowerCase();
    if (level in LogLevels) {
      return LogLevels[level as keyof typeof LogLevels];
    }
  }
  if (process.env.DEBUG) return LogLevels.debug;
  if (process.env.VERBOSE) return LogLevels.verbose;
  return LogLevels.info;
};

let currentLevel = getInitialLevel();

// Format args for output
const formatArgs = (args: unknown[]): string => {
  if (args.length === 0) return "";
  return " " + args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
};

const createLogger = (): Logger => {
  return {
    // Standard log levels
    info: (message: string, ...args: unknown[]) => {
      if (currentLevel >= LogLevels.info) {
        console.log(`${pc.cyan("ℹ")} ${message}${formatArgs(args)}`);
      }
    },
    success: (message: string, ...args: unknown[]) => {
      if (currentLevel >= LogLevels.success) {
        console.log(`${pc.green("✔")} ${message}${formatArgs(args)}`);
      }
    },
    warn: (message: string, ...args: unknown[]) => {
      if (currentLevel >= LogLevels.warn) {
        console.warn(`${pc.yellow("⚠")} ${pc.yellow(message)}${formatArgs(args)}`);
      }
    },
    error: (message: string, ...args: unknown[]) => {
      if (currentLevel >= LogLevels.error) {
        console.error(`${pc.red("✖")} ${pc.red(message)}${formatArgs(args)}`);
      }
    },
    debug: (message: string, ...args: unknown[]) => {
      if (currentLevel >= LogLevels.debug) {
        console.log(`${pc.magenta("●")} ${pc.dim(message)}${formatArgs(args)}`);
      }
    },
    verbose: (message: string, ...args: unknown[]) => {
      if (currentLevel >= LogLevels.verbose) {
        console.log(`${pc.dim("◦")} ${pc.dim(message)}${formatArgs(args)}`);
      }
    },
    fatal: (message: string, ...args: unknown[]) => {
      console.error(`${pc.bgRed(pc.white(" FATAL "))} ${pc.red(message)}${formatArgs(args)}`);
      process.exit(1);
    },

    // CLI helpers
    dim: (message: string) => {
      if (currentLevel >= LogLevels.info) {
        console.log(pc.dim(message));
      }
    },
    blank: () => {
      if (currentLevel >= LogLevels.info) {
        console.log("");
      }
    },
    box: (title: string, content: string) => {
      if (currentLevel >= LogLevels.info) {
        const lines = content.split("\n");
        const width = Math.max(title.length, ...lines.map((l) => l.length)) + 4;
        const top = `╭${"─".repeat(width)}╮`;
        const bottom = `╰${"─".repeat(width)}╯`;
        const titleLine = `│ ${pc.bold(title)}${" ".repeat(width - title.length - 2)} │`;
        const contentLines = lines.map((l) => `│ ${l}${" ".repeat(width - l.length - 2)} │`);
        console.log(pc.cyan(top));
        console.log(pc.cyan(titleLine));
        console.log(pc.cyan(`│${" ".repeat(width)}│`));
        contentLines.forEach((l) => console.log(pc.cyan(l)));
        console.log(pc.cyan(bottom));
      }
    },
    list: (items: string[], prefix = "  •") => {
      if (currentLevel >= LogLevels.info) {
        items.forEach((item) => console.log(`${pc.dim(prefix)} ${item}`));
      }
    },
    step: (step: number, total: number, message: string) => {
      if (currentLevel >= LogLevels.info) {
        console.log(`${pc.dim(`[${step}/${total}]`)} ${message}`);
      }
    },
    start: (message: string) => {
      if (currentLevel >= LogLevels.info) {
        console.log(`${pc.blue("▶")} ${message}`);
      }
    },

    // Configuration
    setLevel: (level: keyof typeof LogLevels) => {
      currentLevel = LogLevels[level];
    },
    getLevel: () => currentLevel,
  };
};

export const logger = createLogger();
