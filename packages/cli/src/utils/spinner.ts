/**
 * Spinner utility for long-running operations
 *
 * Uses ora - the de facto standard terminal spinner.
 * Features: Multiple spinner styles, colors, prefixes, and promise support.
 *
 * @example
 * // Basic usage
 * const spinner = createSpinner('Loading...');
 * spinner.start();
 * await doWork();
 * spinner.succeed('Done!');
 *
 * @example
 * // With promise wrapper
 * const result = await withSpinner(
 *   fetchData(),
 *   { text: 'Fetching data...', successText: 'Data loaded!' }
 * );
 *
 * @example
 * // Step-by-step operations
 * const steps = createStepSpinner([
 *   { name: 'install', text: 'Installing dependencies...' },
 *   { name: 'build', text: 'Building project...' },
 *   { name: 'test', text: 'Running tests...' },
 * ]);
 * await steps.run('install', () => installDeps());
 * await steps.run('build', () => buildProject());
 * await steps.run('test', () => runTests());
 */

import ora, { type Ora, type Options as OraOptions } from "ora";

export interface SpinnerOptions extends OraOptions {
  /** Text to show on success */
  successText?: string;
  /** Text to show on failure */
  failText?: string;
}

export interface StepDefinition {
  name: string;
  text: string;
}

export interface StepSpinner {
  run: <T>(stepName: string, fn: () => Promise<T>) => Promise<T>;
  fail: (stepName: string, error?: string) => void;
  spinner: Ora;
}

/**
 * Create a spinner instance
 */
export function createSpinner(textOrOptions?: string | SpinnerOptions): Ora {
  const options: OraOptions =
    typeof textOrOptions === "string" ? { text: textOrOptions } : textOrOptions ?? {};

  return ora({
    color: "cyan",
    ...options,
  });
}

/**
 * Wrap a promise with a spinner
 * Automatically shows success/fail based on promise resolution
 */
export async function withSpinner<T>(
  promise: Promise<T>,
  options: SpinnerOptions = {}
): Promise<T> {
  const { successText, failText, ...oraOptions } = options;
  const spinner = createSpinner(oraOptions);

  spinner.start();

  try {
    const result = await promise;
    spinner.succeed(successText);
    return result;
  } catch (error) {
    spinner.fail(failText ?? (error instanceof Error ? error.message : "Failed"));
    throw error;
  }
}

/**
 * Create a step-by-step spinner for multi-step operations
 */
export function createStepSpinner(steps: StepDefinition[]): StepSpinner {
  const stepMap = new Map(steps.map((s) => [s.name, s]));
  const spinner = createSpinner();

  return {
    spinner,

    async run<T>(stepName: string, fn: () => Promise<T>): Promise<T> {
      const step = stepMap.get(stepName);
      if (!step) {
        throw new Error(`Unknown step: ${stepName}`);
      }

      spinner.text = step.text;
      spinner.start();

      try {
        const result = await fn();
        spinner.succeed();
        return result;
      } catch (error) {
        spinner.fail();
        throw error;
      }
    },

    fail(stepName: string, error?: string) {
      const step = stepMap.get(stepName);
      spinner.text = error ?? step?.text ?? stepName;
      spinner.fail();
    },
  };
}

/**
 * Demo function showing spinner capabilities
 */
export async function demoSpinner(): Promise<void> {
  const { logger } = await import("./logger.js");

  logger.info("Spinner Demo - ora package\n");

  // Demo 1: Basic spinner
  const spinner1 = createSpinner("Processing files...");
  spinner1.start();
  await new Promise((r) => setTimeout(r, 1500));
  spinner1.succeed("Files processed successfully");

  // Demo 2: Different states
  const spinner2 = createSpinner("Checking configuration...");
  spinner2.start();
  await new Promise((r) => setTimeout(r, 1000));
  spinner2.warn("Configuration has warnings");

  // Demo 3: withSpinner helper
  await withSpinner(new Promise((r) => setTimeout(r, 1500)), {
    text: "Installing dependencies...",
    successText: "Dependencies installed",
  });

  // Demo 4: Step spinner
  const steps = createStepSpinner([
    { name: "fetch", text: "Fetching remote data..." },
    { name: "parse", text: "Parsing response..." },
    { name: "save", text: "Saving to disk..." },
  ]);

  await steps.run("fetch", () => new Promise((r) => setTimeout(r, 800)));
  await steps.run("parse", () => new Promise((r) => setTimeout(r, 600)));
  await steps.run("save", () => new Promise((r) => setTimeout(r, 400)));

  logger.blank();
  logger.success("All spinner demos completed!");
}
