/**
 * Process execution utility
 *
 * Uses execa - the de facto standard for spawning processes in Node.js.
 * Features: Promise-based, proper error handling, streaming, pipes, and more.
 *
 * @example
 * // Run a command and get output
 * const { stdout } = await run('git', ['status']);
 *
 * @example
 * // Run with live output streaming
 * await runWithOutput('npm', ['install']);
 *
 * @example
 * // Check if a command exists
 * if (await commandExists('docker')) {
 *   await run('docker', ['build', '.']);
 * }
 *
 * @example
 * // Run multiple commands in sequence
 * await runSequence([
 *   ['npm', ['install']],
 *   ['npm', ['run', 'build']],
 *   ['npm', ['test']],
 * ]);
 */

import { execa, execaCommand, type Result } from "execa";
import pc from "picocolors";

export interface RunOptions {
  /** Show command before running */
  showCommand?: boolean;
  /** Throw on non-zero exit code (default: true) */
  throwOnError?: boolean;
  /** Working directory */
  cwd?: string;
  /** Environment variables */
  env?: Record<string, string>;
  /** Timeout in milliseconds */
  timeout?: number;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  failed: boolean;
  command: string;
}

/**
 * Run a command and return the result
 */
export async function run(
  command: string,
  args: string[] = [],
  options: RunOptions = {}
): Promise<CommandResult> {
  const { showCommand, throwOnError = true, ...execaOptions } = options;

  if (showCommand) {
    const { logger } = await import("./logger.js");
    logger.dim(`$ ${command} ${args.join(" ")}`);
  }

  try {
    const result = await execa(command, args, {
      reject: throwOnError,
      ...execaOptions,
    });

    return {
      stdout: String(result.stdout ?? ""),
      stderr: String(result.stderr ?? ""),
      exitCode: result.exitCode ?? 0,
      failed: result.failed,
      command: result.command,
    };
  } catch (error) {
    if (throwOnError) {
      throw error;
    }
    const err = error as Result;
    return {
      stdout: String(err.stdout ?? ""),
      stderr: String(err.stderr ?? ""),
      exitCode: err.exitCode ?? 1,
      failed: true,
      command: err.command ?? `${command} ${args.join(" ")}`,
    };
  }
}

/**
 * Run a command string (parsed by shell)
 */
export async function runCommand(
  command: string,
  options: RunOptions = {}
): Promise<CommandResult> {
  const { showCommand, throwOnError = true, ...execaOptions } = options;

  if (showCommand) {
    const { logger } = await import("./logger.js");
    logger.dim(`$ ${command}`);
  }

  try {
    const result = await execaCommand(command, {
      reject: throwOnError,
      ...execaOptions,
    });

    return {
      stdout: String(result.stdout ?? ""),
      stderr: String(result.stderr ?? ""),
      exitCode: result.exitCode ?? 0,
      failed: result.failed,
      command: result.command,
    };
  } catch (error) {
    if (throwOnError) {
      throw error;
    }
    const err = error as Result;
    return {
      stdout: String(err.stdout ?? ""),
      stderr: String(err.stderr ?? ""),
      exitCode: err.exitCode ?? 1,
      failed: true,
      command: err.command ?? command,
    };
  }
}

/**
 * Run a command with live output streaming to stdout/stderr
 */
export async function runWithOutput(
  command: string,
  args: string[] = [],
  options: Omit<RunOptions, "showCommand" | "throwOnError"> = {}
): Promise<CommandResult> {
  const result = await execa(command, args, {
    stdout: "inherit",
    stderr: "inherit",
    ...options,
  });

  return {
    stdout: String(result.stdout ?? ""),
    stderr: String(result.stderr ?? ""),
    exitCode: result.exitCode ?? 0,
    failed: result.failed,
    command: result.command,
  };
}

/**
 * Check if a command exists in PATH
 */
export async function commandExists(command: string): Promise<boolean> {
  try {
    const checkCmd = process.platform === "win32" ? "where" : "which";
    await execa(checkCmd, [command], { reject: true });
    return true;
  } catch {
    return false;
  }
}

/**
 * Run multiple commands in sequence
 */
export async function runSequence(
  commands: [string, string[]][],
  options: RunOptions = {}
): Promise<CommandResult[]> {
  const results: CommandResult[] = [];

  for (const [command, args] of commands) {
    const result = await run(command, args, options);
    results.push(result);

    if (result.failed && options.throwOnError !== false) {
      break;
    }
  }

  return results;
}

/**
 * Run multiple commands in parallel
 */
export async function runParallel(
  commands: [string, string[]][],
  options: RunOptions = {}
): Promise<CommandResult[]> {
  const promises = commands.map(([command, args]) =>
    run(command, args, options)
  );
  return Promise.all(promises);
}

/**
 * Get the output of a command (convenience wrapper)
 */
export async function getOutput(
  command: string,
  args: string[] = [],
  options: Omit<RunOptions, "showCommand" | "throwOnError"> = {}
): Promise<string> {
  const result = await run(command, args, { ...options, throwOnError: true });
  return result.stdout.trim();
}

/**
 * Demo function showing execa capabilities
 */
export async function demoExeca(): Promise<void> {
  const { logger } = await import("./logger.js");
  const { createSpinner } = await import("./spinner.js");

  logger.info("Process Execution Demo - execa package\n");

  // Demo 1: Simple command
  logger.dim("1. Running simple command:");
  const nodeVersion = await getOutput("node", ["--version"]);
  logger.success(`   Node.js version: ${pc.cyan(nodeVersion)}`);

  // Demo 2: Check command existence
  logger.blank();
  logger.dim("2. Checking command availability:");
  const commands = ["git", "docker", "kubectl", "nonexistent-cmd"];
  for (const cmd of commands) {
    const exists = await commandExists(cmd);
    const status = exists ? pc.green("✓ available") : pc.red("✗ not found");
    console.log(`   ${cmd}: ${status}`);
  }

  // Demo 3: Get git info
  logger.blank();
  logger.dim("3. Getting git information:");
  const gitBranch = await getOutput("git", ["branch", "--show-current"], {
    cwd: process.cwd(),
  }).catch(() => "not a git repo");
  logger.success(`   Current branch: ${pc.cyan(gitBranch)}`);

  // Demo 4: Run with error handling
  logger.blank();
  logger.dim("4. Running command with error handling:");
  const result = await run("ls", ["nonexistent-directory-12345"], {
    throwOnError: false,
  });
  if (result.failed) {
    logger.warn(
      `   Command failed (exit code ${result.exitCode}) - handled gracefully`
    );
  }

  // Demo 5: Sequence of commands
  logger.blank();
  logger.dim("5. Running commands in sequence:");
  const spinner = createSpinner("Executing command sequence...");
  spinner.start();

  const sequenceResults = await runSequence(
    [
      ["echo", ["Step 1: Initialize"]],
      ["echo", ["Step 2: Process"]],
      ["echo", ["Step 3: Complete"]],
    ],
    { showCommand: false }
  );

  spinner.succeed(`Executed ${sequenceResults.length} commands successfully`);

  logger.blank();
  logger.success("Execa demo completed!");
}
