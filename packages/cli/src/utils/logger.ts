/**
 * Logger utility for consistent CLI output
 */

import pc from "picocolors";

export interface Logger {
  info: (message: string) => void;
  success: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  debug: (message: string) => void;
  dim: (message: string) => void;
  blank: () => void;
  box: (title: string, content: string) => void;
  list: (items: string[], prefix?: string) => void;
  step: (step: number, total: number, message: string) => void;
}

const createLogger = (): Logger => {
  return {
    info: (message: string) => {
      console.log(pc.blue("ℹ"), message);
    },

    success: (message: string) => {
      console.log(pc.green("✓"), message);
    },

    warn: (message: string) => {
      console.log(pc.yellow("⚠"), message);
    },

    error: (message: string) => {
      console.error(pc.red("✖"), message);
    },

    debug: (message: string) => {
      if (process.env.DEBUG) {
        console.log(pc.gray("⚙"), pc.dim(message));
      }
    },

    dim: (message: string) => {
      console.log(pc.dim(message));
    },

    blank: () => {
      console.log();
    },

    box: (title: string, content: string) => {
      const width = Math.max(title.length, content.length) + 4;
      const line = "─".repeat(width);
      console.log(pc.dim(`┌${line}┐`));
      console.log(pc.dim("│"), pc.bold(title.padEnd(width - 2)), pc.dim("│"));
      console.log(pc.dim(`├${line}┤`));
      console.log(pc.dim("│"), content.padEnd(width - 2), pc.dim("│"));
      console.log(pc.dim(`└${line}┘`));
    },

    list: (items: string[], prefix = "•") => {
      items.forEach((item) => {
        console.log(pc.dim(`  ${prefix}`), item);
      });
    },

    step: (step: number, total: number, message: string) => {
      console.log(pc.cyan(`[${step}/${total}]`), message);
    },
  };
};

export const logger = createLogger();
