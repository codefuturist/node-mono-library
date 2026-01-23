# @repo/cli

[![GitHub Release](https://img.shields.io/github/v/release/codefuturist/node-mono-library?filter=@repo/cli*&label=release)](https://github.com/codefuturist/node-mono-library/releases)
[![npm](https://img.shields.io/npm/v/@repo/cli)](https://www.npmjs.com/package/@repo/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A command-line interface demonstrating the usage of `@repo/utils` and `@repo/validators` packages from the monorepo.

## Installation

### Quick Install (Recommended)

```bash
# Unix (macOS / Linux)
curl -fsSL https://raw.githubusercontent.com/codefuturist/node-mono-library/main/scripts/install.sh | bash

# Homebrew
brew tap codefuturist/tap && brew install repo-cli

# npm (requires Node.js)
npm install -g @repo/cli
```

See [INSTALL.md](./INSTALL.md) for all installation options (Chocolatey, Snap, manual download).

## Quick Start (Development)

```bash
# 1. Install all dependencies from monorepo root
pnpm install

# 2. Build the CLI and its dependencies
pnpm build --filter=@repo/cli

# 3. Run the CLI
pnpm --filter=@repo/cli start --help
```

## Installation Methods

### Method 1: Run from Monorepo (Recommended for Development)

```bash
# Build the CLI package (builds dependencies automatically via Turborepo)
pnpm build --filter=@repo/cli

# Run CLI commands using pnpm exec
pnpm --filter=@repo/cli exec repo-cli <command>

# Or use the start script
pnpm --filter=@repo/cli start <command>

# Examples:
pnpm --filter=@repo/cli start --help
pnpm --filter=@repo/cli start transform "Hello World" --kebab
pnpm --filter=@repo/cli start validate data.json --schema user
```

### Method 2: Link Globally (For Local System-wide Use)

```bash
# Build the CLI first
pnpm build --filter=@repo/cli

# Navigate to CLI package and link globally
cd packages/cli
pnpm link --global

# Now use from anywhere
repo-cli --help
repo-cli transform "Hello World" --kebab

# To unlink later:
pnpm unlink --global
```

### Method 3: Direct Node Execution

```bash
# Build first
pnpm build --filter=@repo/cli

# Run directly with Node
node packages/cli/dist/cli.js --help
node packages/cli/dist/cli.js transform "test" --kebab
```

## Turborepo Commands

The CLI integrates with Turborepo's build pipeline:

```bash
# Build everything (CLI + dependencies)
pnpm build

# Build only CLI and its workspace dependencies
pnpm build --filter=@repo/cli

# Build CLI in watch mode for development
pnpm --filter=@repo/cli dev

# Run CLI tests
pnpm test --filter=@repo/cli

# Run all tests including CLI
pnpm test

# Lint CLI package
pnpm lint --filter=@repo/cli
```

## Usage

### CLI Commands

```bash
# Using pnpm from monorepo
pnpm --filter=@repo/cli exec repo-cli <command>

# Or if linked globally
repo-cli <command>
```

### Commands

#### `init` - Initialize projects and configs

```bash
# Create a new package
repo-cli init my-package

# Create a config file
repo-cli init my-config --type config

# Create a component
repo-cli init Button --type component

# Force overwrite existing
repo-cli init my-package --force
```

#### `validate` - Validate data against schemas

Validate JSON files against predefined schemas (user, product, contact).

```bash
# Validate a user data file
repo-cli validate user.json --schema user

# Strict mode (all fields required)
repo-cli validate data.json --schema product --strict

# Quiet mode (only errors)
repo-cli validate data.json --schema contact --quiet
```

**Available schemas:**

- `user`: id, name, email, age
- `product`: id, name, price, sku, url
- `contact`: name, email, phone

Example user.json:

```json
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

#### `generate` (alias: `g`) - Generate boilerplate code

```bash
# Generate a utility module
repo-cli generate myUtil --type util

# Generate a React component
repo-cli generate Button --type component

# Generate a custom hook
repo-cli generate useAuth --type hook

# Generate a service
repo-cli generate api --type service

# Generate a validator
repo-cli generate order --type validator

# Custom output directory
repo-cli generate Button --type component --output src/ui
```

#### `transform` (alias: `t`) - Transform strings and data

```bash
# Convert to kebab-case
repo-cli transform "Hello World" --kebab
# Output: hello-world

# Convert to camelCase
repo-cli transform "hello-world" --camel
# Output: helloWorld

# Capitalize
repo-cli transform "hello" --capitalize
# Output: Hello

# Truncate
repo-cli transform "A very long string" --truncate 10
# Output: A very lon...

# Transform array (remove duplicates)
repo-cli transform '[1,2,2,3,3,3]' --json --unique
# Output: [1, 2, 3]

# Chunk an array
repo-cli transform '[1,2,3,4,5,6]' --json --chunk 2
# Output: [[1,2], [3,4], [5,6]]

# Transform from file
repo-cli transform data.json --json --unique
```

#### `replace` (alias: `r`) - Recursive regex search and replace

Perform regex-based search and replace across multiple files with glob patterns.

```bash
# Simple string replacement
repo-cli replace 'oldFunction' 'newFunction' 'src/**/*.ts'

# Preview changes with dry run (recommended first!)
repo-cli replace 'oldImport' 'newImport' 'packages/**/*.ts' --dry --verbose

# Case-insensitive matching
repo-cli replace 'OldName' 'NewName' '**/*.ts' --ignore-case

# Use capture groups
repo-cli replace '(foo)(bar)' '$2$1' '**/*.js' --verbose

# Remove patterns (replace with empty string)
repo-cli replace '// TODO: fix this' '' 'src/**/*.ts'

# Ignore specific directories
repo-cli replace 'old' 'new' 'src/**/*.ts' --ignore 'src/legacy/**' 'src/vendor/**'

# Disable default ignore patterns (node_modules, dist, etc.)
repo-cli replace 'pattern' 'replacement' '**/*.ts' --no-default-ignore
```

**Options:**

| Option                       | Description                              |
| ---------------------------- | ---------------------------------------- |
| `-d, --dry`                  | Preview changes without modifying files  |
| `-v, --verbose`              | Show detailed output including file list |
| `-c, --ignore-case`          | Case-insensitive regex matching          |
| `-i, --ignore <patterns...>` | Additional glob patterns to ignore       |
| `--no-default-ignore`        | Disable default ignore patterns          |

**Default ignored patterns:**

- `node_modules`, `dist`, `.turbo`, `coverage`, `.git`
- `build`, `.next`, `out`
- `*.min.js`, `*.min.css`
- `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`

**Alternative tools for one-off operations:**

- **VS Code:** Built-in multi-file search/replace (`Cmd+Shift+H`)
- **sd:** Modern sed alternative (`brew install sd`)
- **ripgrep:** Fast search with replace (`brew install ripgrep`)

## Programmatic Usage

The CLI can also be used as a library:

```typescript
import {
  runInit,
  runValidate,
  runGenerate,
  runTransform,
  runReplace,
} from "@repo/cli";

// Initialize a project
await runInit("my-project", { type: "project" });

// Validate data
const result = await runValidate("user.json", { schema: "user" });
console.log(result.valid); // true or false

// Generate code
await runGenerate("Button", { type: "component" });

// Transform strings
const kebab = await runTransform("Hello World", { kebab: true });
console.log(kebab); // "hello-world"

// Search and replace across files
const replaceResult = await runReplace({
  pattern: "oldFunction",
  replacement: "newFunction",
  files: ["src/**/*.ts"],
  dry: true, // preview mode
  verbose: true,
});
console.log(replaceResult.changed); // files that were modified
console.log(replaceResult.totalReplacements); // count of replacements
```

## Configuration

Create a `repo-cli.json` in your project root for default settings:

```json
{
  "defaultSchema": "user",
  "outputDir": "./generated",
  "templates": {
    "component": "./templates/component.ts"
  }
}
```

Generate the config file:

```bash
repo-cli init config --type config
```

## Dependencies

This CLI uses the following packages from the monorepo:

- **@repo/utils** - String and array utilities
- **@repo/validators** - Data validation functions

## Development

### Prerequisites

- **Node.js** >= 25.0.0
- **pnpm** >= 9.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/codefuturist/node-mono-library.git
cd node-mono-library

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Development Workflow

```bash
# Watch mode (rebuilds on file changes)
pnpm --filter=@repo/cli dev

# In another terminal, test your changes
pnpm --filter=@repo/cli exec repo-cli --help
```

### Testing

```bash
# Run all CLI tests
pnpm --filter=@repo/cli test

# Run specific test suites
pnpm --filter=@repo/cli test:unit        # Unit tests only
pnpm --filter=@repo/cli test:commands    # Command tests only
pnpm --filter=@repo/cli test:integration # Integration tests only

# Run with coverage
pnpm --filter=@repo/cli test:coverage

# Run all monorepo tests (including CLI)
pnpm test
```

### Building

```bash
# Build CLI and dependencies
pnpm build --filter=@repo/cli

# Build all packages
pnpm build

# Clean and rebuild
pnpm --filter=@repo/cli clean && pnpm build --filter=@repo/cli
```

### Turborepo Caching

Turborepo caches build and test results for faster subsequent runs:

```bash
# View cache status
turbo run build --filter=@repo/cli --dry-run

# Force rebuild (ignore cache)
turbo run build --filter=@repo/cli --force

# View dependency graph
turbo run build --filter=@repo/cli --graph
```

### Troubleshooting

**CLI not found after linking:**

```bash
# Verify the link
pnpm list -g

# Re-link
cd packages/cli
pnpm unlink --global
pnpm link --global
```

**Build errors:**

```bash
# Clean and reinstall
pnpm clean
rm -rf node_modules packages/*/node_modules
pnpm install
pnpm build
```

## License

MIT
