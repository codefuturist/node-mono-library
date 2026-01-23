/**
 * Update notifier utility
 *
 * Uses update-notifier - Notify users when a package update is available.
 * Features: Non-blocking check, persistent caching, customizable notifications.
 *
 * @example
 * // At CLI startup
 * import { checkForUpdates } from './utils/update.js';
 * checkForUpdates();  // Non-blocking, shows message if update available
 *
 * @example
 * // Force check and get result
 * const update = await checkForUpdatesSync();
 * if (update) {
 *   console.log(`Update available: ${update.current} → ${update.latest}`);
 * }
 */

import pc from "picocolors";
import updateNotifier from "update-notifier";

import { CLI_NAME, VERSION } from "../constants.js";

import type { UpdateInfo } from "update-notifier";

// Package info for update-notifier
const pkg = {
  name: CLI_NAME,
  version: VERSION,
};

/**
 * Update notifier options
 */
export interface UpdateOptions {
  /** Check interval in milliseconds (default: 1 day) */
  updateCheckInterval?: number;
  /** Whether to show the notification (default: true) */
  shouldNotify?: boolean;
  /** Defer the notification to process exit (default: true) */
  defer?: boolean;
}

/**
 * Check for updates (non-blocking)
 * This is meant to be called at CLI startup - it won't slow down execution
 */
export function checkForUpdates(options: UpdateOptions = {}): void {
  const {
    updateCheckInterval = 1000 * 60 * 60 * 24, // 1 day
    shouldNotify = true,
    defer = true,
  } = options;

  const notifier = updateNotifier({
    pkg,
    updateCheckInterval,
  });

  if (shouldNotify) {
    // This will show a message at process exit if an update is available
    notifier.notify({
      defer,
      message: `Update available: ${pc.dim("{currentVersion}")} → ${pc.green("{latestVersion}")}
Run ${pc.cyan(`npm i -g ${CLI_NAME}`)} to update`,
    });
  }
}

/**
 * Check for updates synchronously and return result
 * Useful when you need to programmatically check for updates
 */
export async function checkForUpdatesSync(): Promise<UpdateInfo | undefined> {
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 0, // Always check
  });

  // Fetch update info
  const update = await notifier.fetchInfo();

  if (update.type !== "latest") {
    return update;
  }

  return undefined;
}

/**
 * Get cached update info (from last check)
 */
export function getCachedUpdateInfo(): UpdateInfo | undefined {
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24,
  });

  return notifier.update;
}

/**
 * Format update notification message
 */
export function formatUpdateMessage(update: UpdateInfo): string {
  const lines = [
    "",
    pc.yellow("╭─────────────────────────────────────────╮"),
    pc.yellow("│                                         │"),
    pc.yellow("│   ") +
      pc.white("Update available: ") +
      pc.dim(update.current) +
      pc.white(" → ") +
      pc.green(update.latest) +
      pc.yellow("   │"),
    pc.yellow("│                                         │"),
    pc.yellow("│   ") +
      pc.cyan(`Run: npm i -g ${CLI_NAME}`) +
      " ".repeat(Math.max(0, 20 - CLI_NAME.length)) +
      pc.yellow("│"),
    pc.yellow("│                                         │"),
    pc.yellow("╰─────────────────────────────────────────╯"),
    "",
  ];

  return lines.join("\n");
}

/**
 * Demo function showing update-notifier capabilities
 */
export async function demoUpdateNotifier(): Promise<void> {
  const { logger } = await import("./logger.js");

  logger.info("Update Notifier Demo - update-notifier package\n");

  // Demo 1: Show current version
  logger.dim("1. Current CLI version:");
  console.log(`   ${pc.cyan(CLI_NAME)} v${pc.cyan(VERSION)}`);

  // Demo 2: Check for updates
  logger.blank();
  logger.dim("2. Checking for updates...");

  try {
    const update = await checkForUpdatesSync();

    if (update) {
      logger.success(
        `   Update available: ${update.current} → ${update.latest}`
      );
      logger.blank();
      console.log(formatUpdateMessage(update));
    } else {
      logger.success("   You're running the latest version!");
    }
  } catch {
    logger.warn(
      "   Could not check for updates (offline or registry unavailable)"
    );
  }

  // Demo 3: Show how non-blocking check works
  logger.blank();
  logger.dim("3. Non-blocking update check (used at CLI startup):");
  console.log(`   ${pc.dim("// In your CLI entry point:")}`);
  console.log(`   ${pc.cyan("checkForUpdates()")}`);
  console.log(
    `   ${pc.dim("// Continues immediately, notification shown at exit if update available")}`
  );

  // Demo 4: Cached info
  logger.blank();
  logger.dim("4. Getting cached update info:");
  const cached = getCachedUpdateInfo();
  if (cached) {
    console.log(
      `   Cached: ${cached.current} → ${cached.latest} (${cached.type})`
    );
  } else {
    console.log(`   ${pc.dim("No cached update info available")}`);
  }

  logger.blank();
  logger.success("Update notifier demo completed!");

  // Show the actual non-blocking notification
  logger.blank();
  logger.dim(
    "Enabling non-blocking update check (will show at process exit if update available)..."
  );
  checkForUpdates();
}
