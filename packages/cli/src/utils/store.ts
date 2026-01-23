/**
 * Configuration storage utility
 *
 * Uses conf - Simple config handling for CLI apps.
 * Features: JSON storage, schema validation, defaults, migrations, encryption.
 *
 * @example
 * // Get/set values
 * config.set('theme', 'dark');
 * const theme = config.get('theme');
 *
 * @example
 * // With typed config
 * interface MyConfig {
 *   apiKey: string;
 *   theme: 'light' | 'dark';
 *   recentProjects: string[];
 * }
 * const config = createConfig<MyConfig>({ ... });
 */

import Conf from "conf";
import pc from "picocolors";
import { CLI_NAME } from "../constants.js";

/**
 * CLI configuration schema
 */
export interface CliConfig {
  /** User's preferred theme */
  theme: "light" | "dark" | "auto";
  /** Default output format */
  outputFormat: "json" | "table" | "plain";
  /** Enable verbose logging */
  verbose: boolean;
  /** Recently used projects */
  recentProjects: string[];
  /** API endpoints */
  endpoints: {
    api?: string;
    registry?: string;
  };
  /** User preferences */
  preferences: {
    confirmDestructive: boolean;
    colorOutput: boolean;
    maxRecentProjects: number;
  };
  /** Last update check timestamp */
  lastUpdateCheck?: number;
}

/**
 * Default configuration values
 */
const defaults: CliConfig = {
  theme: "auto",
  outputFormat: "plain",
  verbose: false,
  recentProjects: [],
  endpoints: {},
  preferences: {
    confirmDestructive: true,
    colorOutput: true,
    maxRecentProjects: 10,
  },
};

/**
 * Create the CLI configuration store
 */
function createCliConfig() {
  return new Conf<CliConfig>({
    projectName: CLI_NAME,
    defaults,
    // Schema validation (optional but recommended)
    schema: {
      theme: {
        type: "string",
        enum: ["light", "dark", "auto"],
      },
      outputFormat: {
        type: "string",
        enum: ["json", "table", "plain"],
      },
      verbose: {
        type: "boolean",
      },
      recentProjects: {
        type: "array",
        items: { type: "string" },
      },
      endpoints: {
        type: "object",
        properties: {
          api: { type: "string" },
          registry: { type: "string" },
        },
      },
      preferences: {
        type: "object",
        properties: {
          confirmDestructive: { type: "boolean" },
          colorOutput: { type: "boolean" },
          maxRecentProjects: { type: "number" },
        },
      },
      lastUpdateCheck: {
        type: "number",
      },
    },
  });
}

// Singleton instance
let configInstance: Conf<CliConfig> | null = null;

/**
 * Get the CLI configuration instance
 */
export function getConfig(): Conf<CliConfig> {
  if (!configInstance) {
    configInstance = createCliConfig();
  }
  return configInstance;
}

// Convenience accessors
export const cliConfig = {
  /** Get a config value */
  get<K extends keyof CliConfig>(key: K): CliConfig[K] {
    return getConfig().get(key);
  },

  /** Set a config value */
  set<K extends keyof CliConfig>(key: K, value: CliConfig[K]): void {
    getConfig().set(key, value);
  },

  /** Check if a key exists */
  has(key: keyof CliConfig): boolean {
    return getConfig().has(key);
  },

  /** Delete a config key */
  delete(key: keyof CliConfig): void {
    getConfig().delete(key);
  },

  /** Reset config to defaults */
  reset(): void {
    getConfig().clear();
  },

  /** Get all config as object */
  getAll(): CliConfig {
    return getConfig().store;
  },

  /** Get config file path */
  getPath(): string {
    return getConfig().path;
  },

  /** Add a project to recent projects */
  addRecentProject(projectPath: string): void {
    const conf = getConfig();
    const recent = conf.get("recentProjects");
    const maxRecent = conf.get("preferences").maxRecentProjects;

    // Remove if already exists, then add to front
    const filtered = recent.filter((p) => p !== projectPath);
    const updated = [projectPath, ...filtered].slice(0, maxRecent);

    conf.set("recentProjects", updated);
  },

  /** Get recent projects */
  getRecentProjects(): string[] {
    return getConfig().get("recentProjects");
  },

  /** Check if should confirm destructive actions */
  shouldConfirmDestructive(): boolean {
    return getConfig().get("preferences").confirmDestructive;
  },
};

/**
 * Demo function showing conf capabilities
 */
export async function demoConfig(): Promise<void> {
  const { logger } = await import("./logger.js");

  logger.info("Configuration Storage Demo - conf package\n");

  const conf = getConfig();

  // Show config file location
  logger.dim(`Config file: ${conf.path}`);
  logger.blank();

  // Demo 1: Read defaults
  logger.dim("1. Default configuration:");
  console.log(`   Theme: ${pc.cyan(cliConfig.get("theme"))}`);
  console.log(`   Output format: ${pc.cyan(cliConfig.get("outputFormat"))}`);
  console.log(`   Verbose: ${pc.cyan(String(cliConfig.get("verbose")))}`);

  // Demo 2: Set values
  logger.blank();
  logger.dim("2. Setting configuration values:");
  cliConfig.set("theme", "dark");
  cliConfig.set("verbose", true);
  console.log(`   Theme set to: ${pc.green("dark")}`);
  console.log(`   Verbose set to: ${pc.green("true")}`);

  // Demo 3: Recent projects
  logger.blank();
  logger.dim("3. Managing recent projects:");
  cliConfig.addRecentProject("/home/user/project-a");
  cliConfig.addRecentProject("/home/user/project-b");
  cliConfig.addRecentProject("/home/user/project-c");
  const recent = cliConfig.getRecentProjects();
  console.log(`   Recent projects: ${pc.cyan(recent.join(", "))}`);

  // Demo 4: Nested configuration
  logger.blank();
  logger.dim("4. Nested configuration:");
  const prefs = cliConfig.get("preferences");
  console.log(
    `   Confirm destructive: ${pc.cyan(String(prefs.confirmDestructive))}`
  );
  console.log(`   Color output: ${pc.cyan(String(prefs.colorOutput))}`);
  console.log(
    `   Max recent projects: ${pc.cyan(String(prefs.maxRecentProjects))}`
  );

  // Demo 5: View all config
  logger.blank();
  logger.dim("5. Full configuration object:");
  console.log(JSON.stringify(cliConfig.getAll(), null, 2));

  // Reset for clean state
  logger.blank();
  logger.dim("6. Resetting to defaults...");
  cliConfig.reset();
  logger.success("   Configuration reset to defaults");

  logger.blank();
  logger.success("Config demo completed!");
}
