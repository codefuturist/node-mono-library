/**
 * Init Command
 * Scaffolds a new project or configuration file
 */

import { Command } from "commander";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import pc from "picocolors";

import { capitalize } from "@repo/utils/string";
import { isEmpty } from "@repo/validators/string";
import { logger } from "../utils/logger.js";
import { CLI_NAME } from "../constants.js";

export interface InitOptions {
  type: "project" | "config" | "component";
  force?: boolean;
  template?: string;
}

/**
 * Run the init command programmatically
 */
export async function runInit(
  name: string,
  options: InitOptions
): Promise<void> {
  if (isEmpty(name)) {
    throw new Error("Name is required");
  }

  const targetDir = resolve(process.cwd(), name);

  logger.blank();
  logger.info(`Initializing ${options.type}: ${pc.bold(name)}`);
  logger.blank();

  switch (options.type) {
    case "project":
      await scaffoldProject(name, targetDir, options);
      break;
    case "config":
      await scaffoldConfig();
      break;
    case "component":
      await scaffoldComponent(name, targetDir, options);
      break;
    default:
      throw new Error(`Unknown type: ${options.type}`);
  }

  logger.blank();
  logger.success(`Successfully created ${options.type}: ${pc.bold(name)}`);
  logger.blank();
}

async function scaffoldProject(
  name: string,
  targetDir: string,
  options: InitOptions
): Promise<void> {
  if (existsSync(targetDir) && !options.force) {
    throw new Error(
      `Directory ${name} already exists. Use --force to overwrite.`
    );
  }

  logger.step(1, 4, "Creating directory structure...");
  mkdirSync(join(targetDir, "src"), { recursive: true });
  mkdirSync(join(targetDir, "__tests__"), { recursive: true });

  logger.step(2, 4, "Creating package.json...");
  const packageJson = {
    name: `@repo/${name}`,
    version: "0.1.0",
    description: `${capitalize(name)} package`,
    type: "module",
    main: "./dist/index.js",
    types: "./dist/index.d.ts",
    scripts: {
      build: "tsup",
      dev: "tsup --watch",
      test: "vitest run",
      lint: "eslint . --max-warnings 0",
    },
  };
  writeFileSync(
    join(targetDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  logger.step(3, 4, "Creating source files...");
  writeFileSync(
    join(targetDir, "src", "index.ts"),
    `/**\n * @repo/${name}\n */\n\nexport function hello(): string {\n  return "Hello from ${name}!";\n}\n`
  );

  logger.step(4, 4, "Creating test file...");
  writeFileSync(
    join(targetDir, "__tests__", "index.test.ts"),
    `import { describe, it, expect } from "vitest";\nimport { hello } from "../src/index.js";\n\ndescribe("${name}", () => {\n  it("should return hello message", () => {\n    expect(hello()).toBe("Hello from ${name}!");\n  });\n});\n`
  );

  logger.blank();
  logger.dim("Next steps:");
  logger.list([`cd ${name}`, "pnpm install", "pnpm build", "pnpm test"]);
}

async function scaffoldConfig(): Promise<void> {
  const configPath = resolve(process.cwd(), `${CLI_NAME}.json`);

  if (existsSync(configPath)) {
    throw new Error(`Config file already exists: ${CLI_NAME}.json`);
  }

  logger.step(1, 1, "Creating configuration file...");

  const config = {
    defaultSchema: "user",
    outputDir: "./generated",
    templates: {
      component: "./templates/component.ts",
    },
  };

  writeFileSync(configPath, JSON.stringify(config, null, 2));

  logger.blank();
  logger.dim(`Created: ${CLI_NAME}.json`);
}

async function scaffoldComponent(
  name: string,
  targetDir: string,
  options: InitOptions
): Promise<void> {
  const componentDir = join(targetDir, "components");

  if (!existsSync(componentDir)) {
    mkdirSync(componentDir, { recursive: true });
  }

  const componentName = capitalize(name);
  const componentPath = join(componentDir, `${componentName}.tsx`);

  if (existsSync(componentPath) && !options.force) {
    throw new Error(
      `Component ${componentName} already exists. Use --force to overwrite.`
    );
  }

  logger.step(1, 1, `Creating component: ${componentName}...`);

  const template = `import React from "react";

export interface ${componentName}Props {
  children?: React.ReactNode;
  className?: string;
}

export function ${componentName}({ children, className }: ${componentName}Props) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
`;

  writeFileSync(componentPath, template);
  logger.dim(`Created: components/${componentName}.tsx`);
}

// Command definition for CLI
export const initCommand = new Command("init")
  .description("Initialize a new project, config, or component")
  .argument("<name>", "Name of the project/config/component")
  .option(
    "-t, --type <type>",
    "Type to create (project|config|component)",
    "project"
  )
  .option("-f, --force", "Overwrite existing files", false)
  .option("--template <template>", "Template to use")
  .action(async (name: string, options) => {
    try {
      await runInit(name, options as InitOptions);
    } catch (error) {
      logger.error((error as Error).message);
      process.exit(1);
    }
  });
