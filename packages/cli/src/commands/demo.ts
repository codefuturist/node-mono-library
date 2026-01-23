/**
 * Demo Command
 * Demonstrates the CLI utilities and best practices
 */

import { Command } from "commander";
import pc from "picocolors";
import { logger } from "../utils/logger.js";

type DemoType = "spinner" | "prompts" | "exec" | "config" | "update" | "all";

export interface DemoOptions {
  type: DemoType;
}

/**
 * Run a specific demo
 */
export async function runDemo(type: DemoType): Promise<void> {
  logger.blank();

  switch (type) {
    case "spinner": {
      const { demoSpinner } = await import("../utils/spinner.js");
      await demoSpinner();
      break;
    }
    case "prompts": {
      const { demoPrompts } = await import("../utils/prompts.js");
      await demoPrompts();
      break;
    }
    case "exec": {
      const { demoExeca } = await import("../utils/exec.js");
      await demoExeca();
      break;
    }
    case "config": {
      const { demoConfig } = await import("../utils/store.js");
      await demoConfig();
      break;
    }
    case "update": {
      const { demoUpdateNotifier } = await import("../utils/update.js");
      await demoUpdateNotifier();
      break;
    }
    case "all": {
      const demos: { name: string; fn: () => Promise<void> }[] = [
        {
          name: "Spinner (ora)",
          fn: async () => (await import("../utils/spinner.js")).demoSpinner(),
        },
        {
          name: "Config (conf)",
          fn: async () => (await import("../utils/store.js")).demoConfig(),
        },
        {
          name: "Exec (execa)",
          fn: async () => (await import("../utils/exec.js")).demoExeca(),
        },
        {
          name: "Update (update-notifier)",
          fn: async () =>
            (await import("../utils/update.js")).demoUpdateNotifier(),
        },
        // Prompts last as it requires user interaction
        {
          name: "Prompts (@inquirer/prompts)",
          fn: async () => (await import("../utils/prompts.js")).demoPrompts(),
        },
      ];

      for (const demo of demos) {
        logger.blank();
        console.log(pc.bgCyan(pc.black(` ${demo.name} `)));
        console.log(pc.cyan("─".repeat(50)));
        await demo.fn();
        logger.blank();
        console.log(pc.dim("─".repeat(50)));
      }
      break;
    }
    default:
      throw new Error(`Unknown demo type: ${type}`);
  }

  logger.blank();
}

// Command definition for CLI
export const demoCommand = new Command("demo")
  .description("Run demos showcasing CLI utilities and best practices")
  .argument(
    "[type]",
    "Demo to run (spinner|prompts|exec|config|update|all)",
    "all"
  )
  .addHelpText(
    "after",
    `
${pc.dim("Available demos:")}
  ${pc.cyan("spinner")}   - Terminal spinners with ora
  ${pc.cyan("prompts")}   - Interactive prompts with @inquirer/prompts  
  ${pc.cyan("exec")}      - Process execution with execa
  ${pc.cyan("config")}    - Configuration storage with conf
  ${pc.cyan("update")}    - Update notifications with update-notifier
  ${pc.cyan("all")}       - Run all demos in sequence

${pc.dim("Examples:")}
  ${pc.cyan("$")} repo-cli demo spinner
  ${pc.cyan("$")} repo-cli demo prompts
  ${pc.cyan("$")} repo-cli demo all
`
  )
  .action(async (type: DemoType) => {
    try {
      await runDemo(type);
    } catch (error) {
      logger.error((error as Error).message);
      process.exit(1);
    }
  });
