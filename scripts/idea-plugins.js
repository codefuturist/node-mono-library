#!/usr/bin/env node
/**
 * Install JetBrains IDE plugins from .idea/externalDependencies.xml
 * Usage: node scripts/idea-plugins.js [ide]
 * IDE options: idea, webstorm, phpstorm, pycharm, rider, goland, rubymine, clion
 * Default: webstorm
 */

const { execSync } = require("child_process");
const { readFileSync } = require("fs");
const { platform } = require("os");

const ide = process.argv[2] || "webstorm";

const ideCommands = {
  darwin: {
    idea: 'open -na "IntelliJ IDEA.app" --args installPlugins',
    webstorm: 'open -na "WebStorm.app" --args installPlugins',
    phpstorm: 'open -na "PhpStorm.app" --args installPlugins',
    pycharm: 'open -na "PyCharm.app" --args installPlugins',
    rider: 'open -na "Rider.app" --args installPlugins',
    goland: 'open -na "GoLand.app" --args installPlugins',
    rubymine: 'open -na "RubyMine.app" --args installPlugins',
    clion: 'open -na "CLion.app" --args installPlugins',
  },
  win32: {
    idea: "idea64.exe installPlugins",
    webstorm: "webstorm64.exe installPlugins",
    phpstorm: "phpstorm64.exe installPlugins",
    pycharm: "pycharm64.exe installPlugins",
    rider: "rider64.exe installPlugins",
    goland: "goland64.exe installPlugins",
    rubymine: "rubymine64.exe installPlugins",
    clion: "clion64.exe installPlugins",
  },
  linux: {
    idea: "idea.sh installPlugins",
    webstorm: "webstorm.sh installPlugins",
    phpstorm: "phpstorm.sh installPlugins",
    pycharm: "pycharm.sh installPlugins",
    rider: "rider.sh installPlugins",
    goland: "goland.sh installPlugins",
    rubymine: "rubymine.sh installPlugins",
    clion: "clion.sh installPlugins",
  },
};

const os = platform();
const commands = ideCommands[os] || ideCommands.linux;
const command = commands[ide];

if (!command) {
  console.error(`Unknown IDE: ${ide}`);
  console.error(`Available: ${Object.keys(commands).join(", ")}`);
  process.exit(1);
}

// Parse plugin IDs from externalDependencies.xml
const xml = readFileSync(".idea/externalDependencies.xml", "utf-8");
const pluginIds = [...xml.matchAll(/plugin\s+id="([^"]+)"/g)].map((m) => m[1]);

if (pluginIds.length === 0) {
  console.log("No plugins found in .idea/externalDependencies.xml");
  process.exit(0);
}

console.log(`\nInstalling ${pluginIds.length} plugins for ${ide}...`);
console.log("Note: Close the IDE before running this command.\n");

// Install all plugins in one command (JetBrains CLI supports multiple IDs)
const fullCommand = `${command} ${pluginIds.join(" ")}`;
console.log(`Running: ${fullCommand}\n`);

try {
  execSync(fullCommand, { stdio: "inherit" });
  console.log("\n✓ Plugins installed. Restart your IDE to activate them.");
} catch (error) {
  console.error("\n✗ Failed to install plugins.");
  console.error("Make sure the IDE is closed and the CLI is in your PATH.");
  process.exit(1);
}
