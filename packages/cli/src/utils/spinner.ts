/**
 * Spinner utility for CLI loading indicators
 *
 * A pkg-compatible spinner using simple console output.
 * Replaces ora which has issues in pkg binaries.
 */

import pc from "picocolors";

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export interface SpinnerOptions {
  text?: string;
  color?: "cyan" | "green" | "yellow" | "red" | "blue" | "magenta";
}

export interface Spinner {
  start: (text?: string) => Spinner;
  stop: () => Spinner;
  succeed: (text?: string) => Spinner;
  fail: (text?: string) => Spinner;
  warn: (text?: string) => Spinner;
  info: (text?: string) => Spinner;
  text: string;
  isSpinning: boolean;
}

const colorFns: Record<string, (s: string) => string> = {
  cyan: pc.cyan,
  green: pc.green,
  yellow: pc.yellow,
  red: pc.red,
  blue: pc.blue,
  magenta: pc.magenta,
};

/**
 * Create a spinner instance
 */
export function createSpinner(options: SpinnerOptions | string = {}): Spinner {
  const opts: SpinnerOptions =
    typeof options === "string" ? { text: options } : options;
  const colorFn = colorFns[opts.color || "cyan"] || pc.cyan;

  let text = opts.text || "";
  let isSpinning = false;
  let frameIndex = 0;
  let interval: ReturnType<typeof setInterval> | null = null;

  const clearLine = () => {
    if (process.stdout.isTTY) {
      process.stdout.write("\r\x1b[K");
    }
  };

  const render = () => {
    if (!process.stdout.isTTY) return;
    const frame = frames[frameIndex] ?? "⠋";
    frameIndex = (frameIndex + 1) % frames.length;
    process.stdout.write(`\r${colorFn(frame)} ${text || ""}`);
  };

  const spinner: Spinner = {
    get text() {
      return text;
    },
    set text(value: string) {
      text = value;
    },
    get isSpinning() {
      return isSpinning;
    },

    start(newText?: string) {
      if (newText) text = newText;
      if (isSpinning) return spinner;
      isSpinning = true;

      if (process.stdout.isTTY) {
        interval = setInterval(render, 80);
        render();
      } else {
        // Non-TTY: just print the text
        console.log(`⠋ ${text}`);
      }
      return spinner;
    },

    stop() {
      if (!isSpinning) return spinner;
      isSpinning = false;
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      clearLine();
      return spinner;
    },

    succeed(newText?: string) {
      spinner.stop();
      console.log(`${pc.green("✔")} ${newText || text}`);
      return spinner;
    },

    fail(newText?: string) {
      spinner.stop();
      console.log(`${pc.red("✖")} ${newText || text}`);
      return spinner;
    },

    warn(newText?: string) {
      spinner.stop();
      console.log(`${pc.yellow("⚠")} ${newText || text}`);
      return spinner;
    },

    info(newText?: string) {
      spinner.stop();
      console.log(`${pc.cyan("ℹ")} ${newText || text}`);
      return spinner;
    },
  };

  return spinner;
}

export interface StepDefinition<T> {
  text: string;
  run: () => Promise<T>;
}

export interface StepSpinner {
  run: <T>(step: StepDefinition<T>) => Promise<T>;
  runAll: <T>(steps: StepDefinition<T>[]) => Promise<T[]>;
}

/**
 * Create a step spinner for running sequential tasks
 */
export function createStepSpinner(): StepSpinner {
  return {
    async run<T>(step: StepDefinition<T>): Promise<T> {
      const spinner = createSpinner(step.text);
      spinner.start();
      try {
        const result = await step.run();
        spinner.succeed();
        return result;
      } catch (error) {
        spinner.fail();
        throw error;
      }
    },

    async runAll<T>(steps: StepDefinition<T>[]): Promise<T[]> {
      const results: T[] = [];
      for (const step of steps) {
        results.push(await this.run(step));
      }
      return results;
    },
  };
}

/**
 * Run a function with a spinner
 */
export async function withSpinner<T>(
  text: string,
  fn: () => Promise<T>
): Promise<T> {
  const spinner = createSpinner(text);
  spinner.start();
  try {
    const result = await fn();
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail();
    throw error;
  }
}

/**
 * Demo function showing spinner capabilities
 */
export async function demoSpinner(): Promise<void> {
  console.log("Simple Spinner Demo\n");

  // Demo 1: Basic spinner
  console.log(pc.dim("1. Basic spinner:"));
  const spinner = createSpinner("Loading...");
  spinner.start();
  await new Promise((r) => setTimeout(r, 1500));
  spinner.succeed("Loaded successfully!");

  // Demo 2: Failure case
  console.log(pc.dim("\n2. Failure case:"));
  const spinner2 = createSpinner("Checking connection...");
  spinner2.start();
  await new Promise((r) => setTimeout(r, 1000));
  spinner2.fail("Connection failed");

  // Demo 3: Warning case
  console.log(pc.dim("\n3. Warning case:"));
  const spinner3 = createSpinner("Validating...");
  spinner3.start();
  await new Promise((r) => setTimeout(r, 1000));
  spinner3.warn("Validation passed with warnings");

  // Demo 4: Sequential steps
  console.log(pc.dim("\n4. Sequential steps with createStepSpinner:"));
  const stepSpinner = createStepSpinner();
  await stepSpinner.runAll([
    { text: "Installing dependencies", run: () => delay(800) },
    { text: "Building project", run: () => delay(1200) },
    { text: "Running tests", run: () => delay(1000) },
  ]);

  // Demo 5: withSpinner helper
  console.log(pc.dim("\n5. Using withSpinner helper:"));
  await withSpinner("Processing data...", async () => {
    await delay(1500);
    return "done";
  });

  console.log(pc.green("\n✔ Spinner demo completed!"));
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
