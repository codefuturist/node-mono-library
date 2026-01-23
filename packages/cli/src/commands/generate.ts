/**
 * Generate Command
 * Generates boilerplate code for various patterns
 */

import { Command } from "commander";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import pc from "picocolors";

import { capitalize, toCamelCase, toKebabCase } from "@repo/utils/string";
import { isEmpty } from "@repo/validators/string";
import { logger } from "../utils/logger.js";

export interface GenerateOptions {
  type: "component" | "hook" | "util" | "service" | "validator";
  output?: string;
  force?: boolean;
}

interface GeneratorResult {
  files: string[];
  message: string;
}

/**
 * Generate content based on type
 */
function generateContent(type: string, name: string): string {
  const pascalName = capitalize(toCamelCase(name));
  const camelName = toCamelCase(name);

  switch (type) {
    case "component":
      return `import React from "react";

export interface ${pascalName}Props {
  children?: React.ReactNode;
  className?: string;
}

export function ${pascalName}({ children, className }: ${pascalName}Props) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default ${pascalName};
`;

    case "hook":
      return `import { useState, useCallback } from "react";

export interface Use${pascalName}Options {
  initialValue?: unknown;
}

export interface Use${pascalName}Result {
  value: unknown;
  setValue: (value: unknown) => void;
  reset: () => void;
}

export function use${pascalName}(options: Use${pascalName}Options = {}): Use${pascalName}Result {
  const [value, setValueState] = useState(options.initialValue);

  const setValue = useCallback((newValue: unknown) => {
    setValueState(newValue);
  }, []);

  const reset = useCallback(() => {
    setValueState(options.initialValue);
  }, [options.initialValue]);

  return {
    value,
    setValue,
    reset,
  };
}

export default use${pascalName};
`;

    case "util":
      return `/**
 * ${pascalName} utility functions
 */

/**
 * Example function
 */
export function ${camelName}(input: unknown): unknown {
  // TODO: Implement ${camelName}
  return input;
}

/**
 * Async version
 */
export async function ${camelName}Async(input: unknown): Promise<unknown> {
  // TODO: Implement ${camelName}Async
  return input;
}
`;

    case "service":
      return `/**
 * ${pascalName} Service
 */

export interface ${pascalName}Config {
  baseUrl?: string;
  timeout?: number;
}

export class ${pascalName}Service {
  private config: ${pascalName}Config;

  constructor(config: ${pascalName}Config = {}) {
    this.config = {
      baseUrl: "",
      timeout: 5000,
      ...config,
    };
  }

  async get(id: string): Promise<unknown> {
    // TODO: Implement get
    console.log(\`Getting \${id} from \${this.config.baseUrl}\`);
    return null;
  }

  async list(): Promise<unknown[]> {
    // TODO: Implement list
    return [];
  }

  async create(data: unknown): Promise<unknown> {
    // TODO: Implement create
    return data;
  }

  async update(id: string, data: unknown): Promise<unknown> {
    // TODO: Implement update
    console.log(\`Updating \${id}\`);
    return data;
  }

  async delete(id: string): Promise<boolean> {
    // TODO: Implement delete
    console.log(\`Deleting \${id}\`);
    return true;
  }
}

export default ${pascalName}Service;
`;

    case "validator":
      return `/**
 * ${pascalName} Validators
 */

import { isEmpty, hasMinLength } from "@repo/validators/string";
import { isNumber, isPositive } from "@repo/validators/number";

export interface ${pascalName}Data {
  id?: string;
  name: string;
  value: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate ${pascalName} data
 */
export function validate${pascalName}(data: ${pascalName}Data): ValidationResult {
  const errors: string[] = [];

  if (isEmpty(data.name)) {
    errors.push("Name is required");
  } else if (!hasMinLength(data.name, 2)) {
    errors.push("Name must be at least 2 characters");
  }

  if (!isNumber(data.value)) {
    errors.push("Value must be a number");
  } else if (!isPositive(data.value)) {
    errors.push("Value must be positive");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Type guard for ${pascalName}Data
 */
export function is${pascalName}(data: unknown): data is ${pascalName}Data {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;
  return typeof obj.name === "string" && typeof obj.value === "number";
}
`;

    default:
      return `// Generated ${type}: ${name}\n\nexport {};\n`;
  }
}

/**
 * Get file extension based on type
 */
function getExtension(type: string): string {
  switch (type) {
    case "component":
      return ".tsx";
    case "hook":
      return ".ts";
    default:
      return ".ts";
  }
}

/**
 * Get directory based on type
 */
function getDirectory(type: string): string {
  switch (type) {
    case "component":
      return "components";
    case "hook":
      return "hooks";
    case "util":
      return "utils";
    case "service":
      return "services";
    case "validator":
      return "validators";
    default:
      return "generated";
  }
}

/**
 * Run the generate command programmatically
 */
export async function runGenerate(
  name: string,
  options: GenerateOptions
): Promise<GeneratorResult> {
  if (isEmpty(name)) {
    throw new Error("Name is required");
  }

  const outputDir = options.output || getDirectory(options.type);
  const targetDir = resolve(process.cwd(), outputDir);
  const fileName =
    options.type === "component" || options.type === "hook"
      ? capitalize(toCamelCase(name))
      : toKebabCase(name);
  const extension = getExtension(options.type);
  const filePath = join(targetDir, `${fileName}${extension}`);

  // Check if file exists
  if (existsSync(filePath) && !options.force) {
    throw new Error(
      `File already exists: ${filePath}. Use --force to overwrite.`
    );
  }

  // Create directory if needed
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  // Generate content
  const content = generateContent(options.type, name);
  writeFileSync(filePath, content);

  return {
    files: [filePath],
    message: `Generated ${options.type}: ${fileName}${extension}`,
  };
}

// Command definition for CLI
export const generateCommand = new Command("generate")
  .alias("g")
  .description("Generate boilerplate code")
  .argument("<name>", "Name of the item to generate")
  .option(
    "-t, --type <type>",
    "Type to generate (component|hook|util|service|validator)",
    "util"
  )
  .option("-o, --output <dir>", "Output directory")
  .option("-f, --force", "Overwrite existing files", false)
  .action(async (name: string, options) => {
    try {
      logger.blank();
      logger.info(`Generating ${pc.cyan(options.type)}: ${pc.bold(name)}`);
      logger.blank();

      const result = await runGenerate(name, options as GenerateOptions);

      logger.step(1, 1, "Creating file...");
      logger.blank();
      logger.list(result.files);
      logger.blank();
      logger.success(result.message);
    } catch (error) {
      logger.error((error as Error).message);
      process.exit(1);
    }
  });
