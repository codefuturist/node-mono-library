/**
 * Configuration loader
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export interface CliConfig {
  defaultSchema?: string;
  outputDir?: string;
  templates?: Record<string, string>;
}

const CONFIG_FILES = [
  "repo-cli.json",
  ".repo-cli.json",
  "repo-cli.config.json",
];

/**
 * Load configuration from the current directory or parent directories
 */
export function loadConfig(cwd: string = process.cwd()): CliConfig | null {
  for (const filename of CONFIG_FILES) {
    const configPath = resolve(cwd, filename);
    if (existsSync(configPath)) {
      try {
        const content = readFileSync(configPath, "utf-8");
        return JSON.parse(content) as CliConfig;
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Get config value with fallback
 */
export function getConfigValue<K extends keyof CliConfig>(
  config: CliConfig | null,
  key: K,
  fallback: NonNullable<CliConfig[K]>
): NonNullable<CliConfig[K]> {
  return (config?.[key] ?? fallback) as NonNullable<CliConfig[K]>;
}
