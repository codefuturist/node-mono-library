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
export { logger } from "./utils/logger.js";
export { loadConfig, type CliConfig } from "./utils/config.js";

// Export constants
export { VERSION, CLI_NAME, CLI_DESCRIPTION } from "./constants.js";
