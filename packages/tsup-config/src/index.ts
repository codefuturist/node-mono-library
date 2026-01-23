/**
 * @repo/tsup-config
 *
 * Shared tsup build configuration presets for the monorepo.
 * Provides factory functions to create consistent build configs across packages.
 */

import type { Options } from "tsup";

/**
 * Base configuration shared across all presets
 */
const baseConfig: Partial<Options> = {
  sourcemap: true,
  treeshake: true,
  minify: false,
  target: "es2022",
};

/**
 * Library configuration preset for publishable packages.
 * Generates dual ESM/CJS builds with TypeScript declarations.
 *
 * @param entry - Entry points (e.g., ["src/index.ts", "src/string.ts"])
 * @param options - Additional tsup options to merge
 *
 * @example
 * ```ts
 * import { libraryConfig } from "@repo/tsup-config";
 *
 * export default libraryConfig(["src/index.ts", "src/string.ts"]);
 * ```
 */
export function libraryConfig(
  entry: string[],
  options: Partial<Options> = {}
): Options {
  return {
    ...baseConfig,
    entry,
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    splitting: false,
    ...options,
  };
}

/**
 * CLI configuration preset for command-line tools.
 * Creates an ESM executable with shebang and a separate library entry.
 *
 * @param cliEntry - CLI entry point (e.g., "src/cli.ts")
 * @param libEntry - Library entry point (e.g., "src/index.ts")
 * @param options - Additional tsup options to merge with both configs
 *
 * @example
 * ```ts
 * import { cliConfig } from "@repo/tsup-config";
 *
 * export default cliConfig("src/cli.ts", "src/index.ts");
 * ```
 */
export function cliConfig(
  cliEntry: string,
  libEntry: string,
  options: Partial<Options> = {}
): Options[] {
  return [
    // CLI entry (executable with shebang)
    {
      ...baseConfig,
      entry: { cli: cliEntry },
      format: ["esm"],
      dts: false,
      clean: true,
      banner: {
        js: "#!/usr/bin/env node",
      },
      ...options,
    },
    // Library entry (for programmatic use)
    {
      ...baseConfig,
      entry: { index: libEntry },
      format: ["esm"],
      dts: true,
      clean: false, // Don't clean again
      ...options,
    },
  ];
}

/**
 * Internal package configuration for workspace-only packages.
 * ESM only, no declarations (uses source directly).
 *
 * @param entry - Entry points
 * @param options - Additional tsup options
 *
 * @example
 * ```ts
 * import { internalConfig } from "@repo/tsup-config";
 *
 * export default internalConfig(["src/index.ts"]);
 * ```
 */
export function internalConfig(
  entry: string[],
  options: Partial<Options> = {}
): Options {
  return {
    ...baseConfig,
    entry,
    format: ["esm"],
    dts: false,
    clean: true,
    ...options,
  };
}

export type { Options as TsupOptions };
