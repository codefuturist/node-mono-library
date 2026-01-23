/**
 * Replace Command
 * Recursive regex search and replace across files in the monorepo
 */

import { Command } from "commander";
import { replaceInFile } from "replace-in-file";
import pc from "picocolors";

import { logger } from "../utils/logger.js";

/**
 * Default patterns to ignore during replacement operations
 * These are common directories that should be excluded in a monorepo
 */
export const DEFAULT_IGNORE_PATTERNS = [
  "**/node_modules/**",
  "**/dist/**",
  "**/.turbo/**",
  "**/coverage/**",
  "**/.git/**",
  "**/build/**",
  "**/.next/**",
  "**/out/**",
  "**/*.min.js",
  "**/*.min.css",
  "**/pnpm-lock.yaml",
  "**/package-lock.json",
  "**/yarn.lock",
];

export interface ReplaceOptions {
  /** Regex pattern to search for (without delimiters) */
  pattern: string;
  /** Replacement string (supports $1, $2, etc. for capture groups) */
  replacement: string;
  /** Glob pattern(s) for files to include */
  files: string[];
  /** Additional patterns to ignore */
  ignore?: string[];
  /** Preview changes without modifying files */
  dry?: boolean;
  /** Show detailed output */
  verbose?: boolean;
  /** Case insensitive matching */
  ignoreCase?: boolean;
  /** Disable default ignore patterns */
  noDefaultIgnore?: boolean;
}

export interface ReplaceCommandResult {
  /** Files that were changed */
  changed: string[];
  /** Files that were unchanged */
  unchanged: string[];
  /** Total number of replacements made */
  totalReplacements: number;
  /** Whether this was a dry run */
  dryRun: boolean;
}

/**
 * Build regex from pattern string and options
 */
function buildRegex(pattern: string, ignoreCase: boolean): RegExp {
  const flags = ignoreCase ? "gi" : "g";
  return new RegExp(pattern, flags);
}

/**
 * Run the replace command programmatically
 */
export async function runReplace(
  options: ReplaceOptions
): Promise<ReplaceCommandResult> {
  const ignorePatterns = options.noDefaultIgnore
    ? options.ignore || []
    : [...DEFAULT_IGNORE_PATTERNS, ...(options.ignore || [])];

  const regex = buildRegex(options.pattern, options.ignoreCase ?? false);

  const results = await replaceInFile({
    files: options.files,
    from: regex,
    to: options.replacement,
    ignore: ignorePatterns,
    dry: options.dry ?? false,
    countMatches: true,
  });

  const changed: string[] = [];
  const unchanged: string[] = [];
  let totalReplacements = 0;

  for (const result of results) {
    if (result.hasChanged) {
      changed.push(result.file);
      totalReplacements += result.numReplacements ?? 0;
    } else {
      unchanged.push(result.file);
    }
  }

  return {
    changed,
    unchanged,
    totalReplacements,
    dryRun: options.dry ?? false,
  };
}

/**
 * Format the results for CLI output
 */
function formatResults(result: ReplaceCommandResult, verbose: boolean): void {
  logger.blank();

  if (result.dryRun) {
    logger.warn("DRY RUN - No files were modified");
    logger.blank();
  }

  if (result.changed.length === 0) {
    logger.info("No matches found");
    return;
  }

  logger.success(
    `${result.dryRun ? "Would replace" : "Replaced"} ${pc.bold(String(result.totalReplacements))} occurrence${result.totalReplacements === 1 ? "" : "s"} in ${pc.bold(String(result.changed.length))} file${result.changed.length === 1 ? "" : "s"}`
  );

  if (verbose) {
    logger.blank();
    logger.info("Modified files:");
    logger.list(
      result.changed.map((file) => pc.green(file)),
      "  "
    );

    if (result.unchanged.length > 0) {
      logger.blank();
      logger.dim(`${result.unchanged.length} files scanned with no matches`);
    }
  }
}

export const replaceCommand = new Command("replace")
  .alias("r")
  .description("Recursive regex search and replace across files")
  .argument("<pattern>", "Regex pattern to search for (without delimiters)")
  .argument(
    "<replacement>",
    'Replacement string (use $1, $2 for capture groups, or "" for empty)'
  )
  .argument("<files...>", "Glob pattern(s) for files to include")
  .option("-i, --ignore <patterns...>", "Additional patterns to ignore")
  .option("-d, --dry", "Preview changes without modifying files", false)
  .option("-v, --verbose", "Show detailed output", false)
  .option("-c, --ignore-case", "Case insensitive matching", false)
  .option("--no-default-ignore", "Disable default ignore patterns")
  .addHelpText(
    "after",
    `
${pc.dim("Default ignored patterns:")}
  node_modules, dist, .turbo, coverage, .git, build, .next, out,
  *.min.js, *.min.css, pnpm-lock.yaml, package-lock.json, yarn.lock

${pc.dim("Examples:")}
  ${pc.cyan("$")} repo-cli replace 'oldFunction' 'newFunction' 'src/**/*.ts'
  ${pc.cyan("$")} repo-cli replace 'import.*from.*old' 'import { x } from "new"' 'packages/**/*.ts' --dry
  ${pc.cyan("$")} repo-cli replace '(foo)(bar)' '$2$1' '**/*.js' --verbose
  ${pc.cyan("$")} repo-cli replace 'TODO' '' 'src/**/*.ts' --ignore 'src/legacy/**'
  ${pc.cyan("$")} repo-cli replace 'OldName' 'NewName' '**/*.ts' --ignore-case

${pc.dim("Alternative tools for one-off operations:")}
  ${pc.blue("• VS Code:")} Use built-in multi-file search/replace (Cmd+Shift+H)
  ${pc.blue("• sd:")}      Modern sed alternative - brew install sd
  ${pc.blue("• ripgrep:")} Fast search with replace - brew install ripgrep
  ${pc.blue("• sed:")}     find . -name '*.ts' -exec sed -i '' 's/old/new/g' {} +
`
  )
  .action(async (pattern, replacement, files, options) => {
    try {
      const result = await runReplace({
        pattern,
        replacement,
        files,
        ignore: options.ignore,
        dry: options.dry,
        verbose: options.verbose,
        ignoreCase: options.ignoreCase,
        noDefaultIgnore: !options.defaultIgnore, // Commander negates --no-* options
      });

      formatResults(result, options.verbose);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Replace failed: ${message}`);
      process.exit(1);
    }
  });
