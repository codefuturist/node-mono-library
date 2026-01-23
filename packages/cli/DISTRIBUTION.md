# CLI Distribution Guide

## 📦 Creating a Standalone Bundle

The CLI is bundled into a single executable file that includes all dependencies.

### Quick Commands (from root)

```bash
# Bundle CLI into single file
pnpm cli:bundle

# Bundle + install to ~/.local/bin/repo-cli
pnpm cli:install:local
```

### Build Commands

```bash
# Bundle everything (TypeScript → ncc bundled file)
pnpm build:bundle

# Bundle + install to ~/.local/bin/repo-cli
pnpm install:local
```

### What Happens

1. **tsup** compiles TypeScript → ESM JavaScript
2. **@vercel/ncc** bundles all dependencies into single file (~158KB)
3. Shebang added (`#!/usr/bin/env node`)
4. Copied to `~/.local/bin/repo-cli`

### Installation Location

```
~/.local/bin/repo-cli
```

Added to PATH via `~/.zshrc`:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

### Usage

```bash
repo-cli --version
repo-cli transform "Hello World" --kebab
repo-cli init my-project
repo-cli validate data.json --schema user
```

### Share with Friends

Send them the bundled file:

```bash
# They need Node.js installed
./repo-cli --help
```

Or install globally for them:

```bash
sudo cp repo-cli /usr/local/bin/
```

## 🚀 For True Binary (No Node.js Required)

Use **pkg** to create platform binaries:

```bash
# Create binaries for all platforms
pnpm build:binary
```

Or manually:

```bash
pkg bundled/index.js -t node25-macos-x64,node25-linux-x64,node25-win-x64 -o bin/repo-cli
```

Output:

- `bin/repo-cli-macos` (50-80MB)
- `bin/repo-cli-linux` (50-80MB)
- `bin/repo-cli-win.exe` (50-80MB)

**Requirements:** Node.js 25+

**Note:** Bundle with ncc first (done automatically by build:binary).
