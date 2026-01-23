/**
 * @repo/cli - Library exports for programmatic use
 *
 * This module exports the core functionality of the CLI
 * for use in other packages or scripts.
 */

// Export commands for programmatic use
export { runInit, type InitOptions } from "./commands/init.js";
export { runValidate, type ValidateOptions } from "./commands/validate.js";
export { runGenerate, type GenerateOptions } from "./commands/generate.js";
export { runTransform, type TransformOptions } from "./commands/transform.js";
export {
  runReplace,
  type ReplaceOptions,
  type ReplaceCommandResult,
  DEFAULT_IGNORE_PATTERNS,
} from "./commands/replace.js";

// Export utilities
export { logger, consola, LogLevels, type Logger } from "./utils/logger.js";
export { loadConfig, type CliConfig } from "./utils/config.js";
export {
  createSpinner,
  withSpinner,
  createStepSpinner,
  type SpinnerOptions,
  type StepDefinition,
  type StepSpinner,
} from "./utils/spinner.js";
export {
  promptText,
  promptPassword,
  promptConfirm,
  promptSelect,
  promptMultiSelect,
  promptNumber,
  promptEditor,
  promptWizard,
  type TextOptions,
  type SelectChoice,
  type WizardStep,
} from "./utils/prompts.js";
export {
  run,
  runCommand,
  runWithOutput,
  commandExists,
  runSequence,
  runParallel,
  getOutput,
  type RunOptions,
  type CommandResult,
} from "./utils/exec.js";
export {
  getConfig,
  cliConfig,
  type CliConfig as CliConfigSchema,
} from "./utils/store.js";
export {
  checkForUpdates,
  checkForUpdatesSync,
  getCachedUpdateInfo,
  formatUpdateMessage,
  type UpdateOptions,
} from "./utils/update.js";
export {
  runWithConcurrencyLimit,
  retry,
  debounce,
  throttle,
  type RetryOptions,
} from "./utils/async.js";

// Export constants
export { VERSION, CLI_NAME, CLI_DESCRIPTION } from "./constants.js";
