/**
 * Transform Command
 * Transform strings and data using @repo/utils
 */

import { Command } from "commander";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import pc from "picocolors";

import {
  capitalize,
  toKebabCase,
  toCamelCase,
  truncate,
} from "@repo/utils/string";
import { unique, chunk } from "@repo/utils/array";
import { logger } from "../utils/logger.js";

export interface TransformOptions {
  kebab?: boolean;
  camel?: boolean;
  capitalize?: boolean;
  truncate?: number;
  unique?: boolean;
  chunk?: number;
  json?: boolean;
}

type TransformResult = string | string[] | unknown;

/**
 * Transform a string based on options
 */
function transformString(input: string, options: TransformOptions): string {
  let result = input;

  if (options.kebab) {
    result = toKebabCase(result);
  }

  if (options.camel) {
    result = toCamelCase(result);
  }

  if (options.capitalize) {
    result = capitalize(result);
  }

  if (options.truncate) {
    result = truncate(result, options.truncate);
  }

  return result;
}

/**
 * Transform an array based on options
 */
function transformArray<T>(input: T[], options: TransformOptions): T[] | T[][] {
  let result: T[] | T[][] = input;

  if (options.unique) {
    result = unique(input);
  }

  if (options.chunk && options.chunk > 0) {
    result = chunk(result as T[], options.chunk);
  }

  return result;
}

/**
 * Run the transform command programmatically
 */
export async function runTransform(
  input: string,
  options: TransformOptions
): Promise<TransformResult> {
  let data: string | unknown[];

  // Check if input is a file
  const filePath = resolve(process.cwd(), input);
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, "utf-8");

    if (options.json) {
      try {
        data = JSON.parse(content);
      } catch {
        throw new Error("Failed to parse JSON file");
      }
    } else {
      data = content.trim();
    }
  } else {
    // Treat as raw input
    if (options.json) {
      try {
        data = JSON.parse(input);
      } catch {
        throw new Error("Failed to parse JSON input");
      }
    } else {
      data = input;
    }
  }

  // Apply transformations
  if (Array.isArray(data)) {
    return transformArray(data, options);
  }

  if (typeof data === "string") {
    return transformString(data, options);
  }

  throw new Error("Input must be a string or array");
}

// Command definition for CLI
export const transformCommand = new Command("transform")
  .alias("t")
  .description("Transform strings or data using @repo/utils")
  .argument("<input>", "String to transform or path to file")
  .option("-k, --kebab", "Convert to kebab-case")
  .option("-c, --camel", "Convert to camelCase")
  .option("-C, --capitalize", "Capitalize first letter")
  .option("--truncate <length>", "Truncate to length", parseInt)
  .option("-u, --unique", "Remove duplicate values (for arrays)")
  .option("--chunk <size>", "Split into chunks (for arrays)", parseInt)
  .option("-j, --json", "Parse input as JSON")
  .action(async (input: string, options) => {
    try {
      const result = await runTransform(input, options as TransformOptions);

      logger.blank();
      logger.info("Transform result:");
      logger.blank();

      if (Array.isArray(result)) {
        console.log(pc.green(JSON.stringify(result, null, 2)));
      } else {
        console.log(pc.green(String(result)));
      }

      logger.blank();
    } catch (error) {
      logger.error((error as Error).message);
      process.exit(1);
    }
  });
