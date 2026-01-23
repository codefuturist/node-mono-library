/**
 * CLI Entry Point
 * This is the main executable for the repo-cli command
 */

import { program } from "commander";
import pc from "picocolors";

import { initCommand } from "./commands/init.js";
import { validateCommand } from "./commands/validate.js";
import { generateCommand } from "./commands/generate.js";
import { transformCommand } from "./commands/transform.js";
import { replaceCommand } from "./commands/replace.js";
import { demoCommand } from "./commands/demo.js";
import { VERSION, CLI_NAME, CLI_DESCRIPTION } from "./constants.js";
import { checkForUpdates } from "./utils/update.js";

// Check for updates (non-blocking, shows notification at exit if available)
checkForUpdates();

// Configure the main program
program
  .name(CLI_NAME)
  .description(CLI_DESCRIPTION)
  .version(VERSION, "-v, --version", "Display version number")
  .helpOption("-h, --help", "Display help for command")
  .configureOutput({
    outputError: (str, write) => write(pc.red(str)),
  });

// Register commands
program.addCommand(initCommand);
program.addCommand(validateCommand);
program.addCommand(generateCommand);
program.addCommand(transformCommand);
program.addCommand(replaceCommand);
program.addCommand(demoCommand);

// Add global options
program.option("--no-color", "Disable colored output");
program.option("--verbose", "Enable verbose output");

// Custom help formatting
program.addHelpText(
  "after",
  `
${pc.dim("Examples:")}
  ${pc.cyan("$")} repo-cli init my-project
  ${pc.cyan("$")} repo-cli validate data.json --schema user
  ${pc.cyan("$")} repo-cli generate component Button
  ${pc.cyan("$")} repo-cli transform input.txt --kebab
  ${pc.cyan("$")} repo-cli replace 'old' 'new' 'src/**/*.ts' --dry
  ${pc.cyan("$")} repo-cli demo spinner

${pc.dim("Documentation:")}
  ${pc.blue("https://github.com/codefuturist/node-mono-library")}
`
);

// Parse arguments and execute
program.parseAsync(process.argv).catch((error: Error) => {
  console.error(pc.red("Error:"), error.message);
  process.exit(1);
});
