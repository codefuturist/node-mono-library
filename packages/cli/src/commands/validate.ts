/**
 * Validate Command
 * Validates data against predefined schemas using @repo/validators
 */

import { Command } from "commander";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import pc from "picocolors";

import { isEmail, isUrl, isPhoneNumber } from "@repo/validators/format";
import { isNumber, isInRange } from "@repo/validators/number";
import {
  hasMinLength,
  hasMaxLength,
  isAlphanumeric,
} from "@repo/validators/string";
import { isPlainObject } from "@repo/validators/object";
import { logger } from "../utils/logger.js";
import { SCHEMAS, type SchemaName } from "../constants.js";

export interface ValidateOptions {
  schema: SchemaName;
  strict?: boolean;
  quiet?: boolean;
}

interface ValidationResult {
  field: string;
  valid: boolean;
  message: string;
}

/**
 * Validate a value against a field type
 */
function validateField(
  value: unknown,
  fieldType: string
): { valid: boolean; message: string } {
  const parts = fieldType.split(":");
  const type = parts[0];

  switch (type) {
    case "email":
      return {
        valid: typeof value === "string" && isEmail(value),
        message: "Must be a valid email address",
      };

    case "url":
      return {
        valid: typeof value === "string" && isUrl(value),
        message: "Must be a valid URL",
      };

    case "phone":
      return {
        valid: typeof value === "string" && isPhoneNumber(value),
        message: "Must be a valid phone number",
      };

    case "string": {
      if (typeof value !== "string") {
        return { valid: false, message: "Must be a string" };
      }
      const minLen = parts[1] ? parseInt(parts[1], 10) : 0;
      const maxLen = parts[2] ? parseInt(parts[2], 10) : Infinity;

      if (!hasMinLength(value, minLen)) {
        return {
          valid: false,
          message: `Must be at least ${minLen} characters`,
        };
      }
      if (maxLen !== Infinity && !hasMaxLength(value, maxLen)) {
        return {
          valid: false,
          message: `Must be at most ${maxLen} characters`,
        };
      }
      return { valid: true, message: "Valid" };
    }

    case "number": {
      if (!isNumber(value)) {
        return { valid: false, message: "Must be a number" };
      }
      const min = parts[1] ? parseFloat(parts[1]) : -Infinity;
      const max = parts[2] ? parseFloat(parts[2]) : Infinity;

      if (!isInRange(value as number, min, max)) {
        return { valid: false, message: `Must be between ${min} and ${max}` };
      }
      return { valid: true, message: "Valid" };
    }

    case "alphanumeric":
      return {
        valid: typeof value === "string" && isAlphanumeric(value),
        message: "Must be alphanumeric",
      };

    default:
      return { valid: true, message: "Unknown type, skipping validation" };
  }
}

/**
 * Run the validate command programmatically
 */
export async function runValidate(
  file: string,
  options: ValidateOptions
): Promise<{ valid: boolean; results: ValidationResult[] }> {
  const filePath = resolve(process.cwd(), file);

  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${file}`);
  }

  // Load and parse JSON
  let data: unknown;
  try {
    const content = readFileSync(filePath, "utf-8");
    data = JSON.parse(content);
  } catch {
    throw new Error(`Failed to parse JSON file: ${file}`);
  }

  if (!isPlainObject(data)) {
    throw new Error("Data must be a JSON object");
  }

  // Get schema
  const schema = SCHEMAS[options.schema];
  if (!schema) {
    throw new Error(
      `Unknown schema: ${options.schema}. Available: ${Object.keys(SCHEMAS).join(", ")}`
    );
  }

  // Validate each field
  const results: ValidationResult[] = [];
  let allValid = true;

  for (const [field, fieldType] of Object.entries(schema)) {
    const value = (data as Record<string, unknown>)[field];

    if (options.strict && value === undefined) {
      results.push({
        field,
        valid: false,
        message: "Required field is missing",
      });
      allValid = false;
      continue;
    }

    if (value === undefined) {
      continue;
    }

    const result = validateField(value, fieldType);
    results.push({ field, ...result });

    if (!result.valid) {
      allValid = false;
    }
  }

  return { valid: allValid, results };
}

// Command definition for CLI
export const validateCommand = new Command("validate")
  .description("Validate a JSON file against a schema")
  .argument("<file>", "JSON file to validate")
  .option(
    "-s, --schema <schema>",
    "Schema to validate against (user|product|contact)",
    "user"
  )
  .option("--strict", "Require all schema fields to be present", false)
  .option("-q, --quiet", "Only output errors", false)
  .action(async (file: string, options) => {
    try {
      logger.blank();
      logger.info(
        `Validating ${pc.bold(file)} against ${pc.cyan(options.schema)} schema`
      );
      logger.blank();

      const { valid, results } = await runValidate(
        file,
        options as ValidateOptions
      );

      // Display results
      for (const result of results) {
        if (options.quiet && result.valid) continue;

        const icon = result.valid ? pc.green("✓") : pc.red("✖");
        const field = result.valid ? result.field : pc.red(result.field);
        const message = result.valid ? pc.dim(result.message) : result.message;

        console.log(`  ${icon} ${field}: ${message}`);
      }

      logger.blank();

      if (valid) {
        logger.success("All validations passed!");
      } else {
        logger.error("Validation failed");
        process.exit(1);
      }
    } catch (error) {
      logger.error((error as Error).message);
      process.exit(1);
    }
  });
