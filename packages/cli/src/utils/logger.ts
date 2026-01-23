/**
 * Logger utility for consistent CLI output
 *
 * Uses consola - the de facto standard logger for Node.js CLI applications.
 * Features: log levels, beautiful output, CI/TTY detection, timestamps.
 *
 * Log levels (set via LOG_LEVEL env or logger.level):
 *   0: fatal, error
 *   1: warn
 *   2: log
 *   3: info, success
 *   4: debug
 *   5: trace, verbose
 */

import { createConsola, LogLevels } from "consola";
import pc from "picocolors";

// Create a consola instance with CLI-friendly defaults
const consola = createConsola({
  level: LogLevels.info,
  formatOptions: {
    date: false,
    colors: true,
    compact: true,
  },
});

// Set log level from environment
if (process.env.LOG_LEVEL) {
  const level = process.env.LOG_LEVEL.toLowerCase();
  if (level in LogLevels) {
    consola.level = LogLevels[level as keyof typeof LogLevels];
  }
} else if (process.env.DEBUG) {
  consola.level = LogLevels.debug;
} else if (process.env.VERBOSE) {
  consola.level = LogLevels.verbose;
}

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

  // Access underlying consola instance for advanced usage
  raw: typeof consola;
}

const createLogger = (): Logger => {
  return {
    // Standard log levels - delegate to consola
    info: (message: string, ...args: unknown[]) =>
      consola.info(message, ...args),
    success: (message: string, ...args: unknown[]) =>
      consola.success(message, ...args),
    warn: (message: string, ...args: unknown[]) =>
      consola.warn(message, ...args),
    error: (message: string, ...args: unknown[]) =>
      consola.error(message, ...args),
    debug: (message: string, ...args: unknown[]) =>
      consola.debug(message, ...args),
    verbose: (message: string, ...args: unknown[]) =>
      consola.verbose(message, ...args),
    fatal: (message: string, ...args: unknown[]) =>
      consola.fatal(message, ...args),

    // CLI-specific helpers
    dim: (message: string) => {
      console.log(pc.dim(message));
    },

    blank: () => {
      console.log();
    },

    box: (title: string, content: string) => {
      consola.box({ title, message: content });
    },

    list: (items: string[], prefix = "•") => {
      items.forEach((item) => {
        console.log(pc.dim(`  ${prefix}`), item);
      });
    },

    step: (step: number, total: number, message: string) => {
      console.log(pc.cyan(`[${step}/${total}]`), message);
    },

    start: (message: string) => {
      consola.start(message);
    },

    // Configuration
    setLevel: (level: keyof typeof LogLevels) => {
      consola.level = LogLevels[level];
    },

    getLevel: () => consola.level,

    // Access underlying consola for advanced usage (prompts, spinners, etc.)
    raw: consola,
  };
};

export const logger = createLogger();

// Re-export consola for direct usage if needed
export { consola, LogLevels };
