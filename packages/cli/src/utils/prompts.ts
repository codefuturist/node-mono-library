/**
 * Interactive prompts utility
 *
 * Uses @inquirer/prompts - the modern Inquirer.js with ESM support.
 * Features: Text, password, confirm, select, multiselect, and more.
 *
 * @example
 * // Quick prompts
 * const name = await promptText('What is your name?');
 * const confirmed = await promptConfirm('Continue?');
 * const choice = await promptSelect('Pick a framework', ['React', 'Vue', 'Svelte']);
 *
 * @example
 * // Multi-step wizard
 * const answers = await promptWizard([
 *   { type: 'text', name: 'name', message: 'Project name?' },
 *   { type: 'select', name: 'framework', message: 'Framework?', choices: ['React', 'Vue'] },
 *   { type: 'confirm', name: 'typescript', message: 'Use TypeScript?' },
 * ]);
 */

import {
  input,
  password,
  confirm,
  select,
  checkbox,
  editor,
  number,
} from "@inquirer/prompts";
import pc from "picocolors";

export interface TextOptions {
  default?: string;
  validate?: (value: string) => boolean | string | Promise<boolean | string>;
  transformer?: (value: string) => string;
}

export interface SelectChoice<T = string> {
  name: string;
  value: T;
  description?: string;
  disabled?: boolean | string;
}

export interface WizardStep {
  type:
    | "text"
    | "password"
    | "confirm"
    | "select"
    | "multiselect"
    | "number"
    | "editor";
  name: string;
  message: string;
  default?: unknown;
  choices?: (string | SelectChoice)[];
  validate?: (value: unknown) => boolean | string | Promise<boolean | string>;
  when?: (answers: Record<string, unknown>) => boolean;
}

/**
 * Prompt for text input
 */
export async function promptText(
  message: string,
  options: TextOptions = {}
): Promise<string> {
  return input({
    message,
    default: options.default,
    validate: options.validate,
    transformer: options.transformer,
  });
}

/**
 * Prompt for password (masked input)
 */
export async function promptPassword(
  message: string,
  options: {
    mask?: string;
    validate?: (value: string) => boolean | string;
  } = {}
): Promise<string> {
  return password({
    message,
    mask: options.mask ?? "*",
    validate: options.validate,
  });
}

/**
 * Prompt for yes/no confirmation
 */
export async function promptConfirm(
  message: string,
  defaultValue = true
): Promise<boolean> {
  return confirm({
    message,
    default: defaultValue,
  });
}

/**
 * Prompt for single selection from choices
 */
export async function promptSelect<T extends string = string>(
  message: string,
  choices: (T | SelectChoice<T>)[],
  defaultValue?: T
): Promise<T> {
  const normalizedChoices = choices.map((c) =>
    typeof c === "string" ? { name: c, value: c } : c
  );

  return select({
    message,
    choices: normalizedChoices,
    default: defaultValue,
  });
}

/**
 * Prompt for multiple selections from choices
 */
export async function promptMultiSelect<T extends string = string>(
  message: string,
  choices: (T | SelectChoice<T>)[],
  options: { required?: boolean } = {}
): Promise<T[]> {
  const normalizedChoices = choices.map((c) =>
    typeof c === "string" ? { name: c, value: c } : c
  );

  return checkbox({
    message,
    choices: normalizedChoices,
    required: options.required,
  });
}

/**
 * Prompt for a number
 */
export async function promptNumber(
  message: string,
  options: { default?: number; min?: number; max?: number } = {}
): Promise<number | undefined> {
  return number({
    message,
    default: options.default,
    min: options.min,
    max: options.max,
  });
}

/**
 * Prompt for multi-line text via editor
 */
export async function promptEditor(
  message: string,
  options: { default?: string; postfix?: string } = {}
): Promise<string> {
  return editor({
    message,
    default: options.default,
    postfix: options.postfix ?? ".txt",
  });
}

/**
 * Run a multi-step wizard
 */
export async function promptWizard(
  steps: WizardStep[]
): Promise<Record<string, unknown>> {
  const answers: Record<string, unknown> = {};

  for (const step of steps) {
    // Check conditional display
    if (step.when && !step.when(answers)) {
      continue;
    }

    switch (step.type) {
      case "text":
        answers[step.name] = await promptText(step.message, {
          default: step.default as string,
          validate: step.validate as (value: string) => boolean | string,
        });
        break;

      case "password":
        answers[step.name] = await promptPassword(step.message);
        break;

      case "confirm":
        answers[step.name] = await promptConfirm(
          step.message,
          step.default as boolean
        );
        break;

      case "select":
        answers[step.name] = await promptSelect(
          step.message,
          step.choices ?? [],
          step.default as string
        );
        break;

      case "multiselect":
        answers[step.name] = await promptMultiSelect(
          step.message,
          step.choices ?? []
        );
        break;

      case "number":
        answers[step.name] = await promptNumber(step.message, {
          default: step.default as number,
        });
        break;

      case "editor":
        answers[step.name] = await promptEditor(step.message, {
          default: step.default as string,
        });
        break;
    }
  }

  return answers;
}

/**
 * Demo function showing prompt capabilities
 */
export async function demoPrompts(): Promise<void> {
  const { logger } = await import("./logger.js");

  logger.info("Interactive Prompts Demo - @inquirer/prompts\n");

  // Demo 1: Text input
  const name = await promptText("What is your project name?", {
    default: "my-awesome-project",
    validate: (v) => v.length >= 3 || "Name must be at least 3 characters",
  });
  logger.dim(`  → Project name: ${name}`);

  // Demo 2: Selection
  const framework = await promptSelect("Which framework do you prefer?", [
    {
      name: "React",
      value: "react",
      description: "A JavaScript library for building UIs",
    },
    {
      name: "Vue",
      value: "vue",
      description: "The progressive JavaScript framework",
    },
    {
      name: "Svelte",
      value: "svelte",
      description: "Cybernetically enhanced web apps",
    },
    {
      name: "Solid",
      value: "solid",
      description: "Simple and performant reactivity",
    },
  ]);
  logger.dim(`  → Framework: ${framework}`);

  // Demo 3: Multi-select
  const features = await promptMultiSelect("Select features to include:", [
    { name: "TypeScript", value: "typescript" },
    { name: "ESLint", value: "eslint" },
    { name: "Prettier", value: "prettier" },
    { name: "Testing (Vitest)", value: "vitest" },
    { name: "CI/CD (GitHub Actions)", value: "ci" },
  ]);
  logger.dim(`  → Features: ${features.join(", ") || "none"}`);

  // Demo 4: Confirmation
  const useDocker = await promptConfirm("Add Docker support?", false);
  logger.dim(`  → Docker: ${useDocker ? "yes" : "no"}`);

  // Demo 5: Number input
  const port = await promptNumber("Development server port?", {
    default: 3000,
    min: 1024,
    max: 65535,
  });
  logger.dim(`  → Port: ${port}`);

  logger.blank();
  logger.success("Prompts demo completed!");

  // Summary
  logger.blank();
  logger.box(
    "Project Configuration",
    `Name: ${pc.cyan(name)}
Framework: ${pc.cyan(framework)}
Features: ${pc.cyan(features.join(", ") || "none")}
Docker: ${pc.cyan(useDocker ? "yes" : "no")}
Port: ${pc.cyan(String(port))}`
  );
}
