# @repo/tsup-config

Shared [tsup](https://tsup.egoist.dev/) build configuration presets for the monorepo.

## Installation

This package is automatically available as a workspace dependency:

```bash
pnpm add -D @repo/tsup-config
```

## Usage

### Library Packages

For publishable packages with dual ESM/CJS output:

```ts
// tsup.config.ts
import { libraryConfig } from "@repo/tsup-config";

export default libraryConfig(["src/index.ts", "src/string.ts", "src/array.ts"]);
```

### CLI Packages

For command-line tools with executable and library exports:

```ts
// tsup.config.ts
import { cliConfig } from "@repo/tsup-config";

export default cliConfig("src/cli.ts", "src/index.ts");
```

### Internal Packages

For workspace-only packages (not published):

```ts
// tsup.config.ts
import { internalConfig } from "@repo/tsup-config";

export default internalConfig(["src/index.ts"]);
```

## Customization

All presets accept an optional `options` parameter for overrides:

```ts
import { libraryConfig } from "@repo/tsup-config";

export default libraryConfig(["src/index.ts"], {
  minify: true,
  splitting: true,
});
```

## Presets Overview

| Preset           | Format    | DTS | Shebang | Use Case             |
| ---------------- | --------- | --- | ------- | -------------------- |
| `libraryConfig`  | ESM + CJS | ✅  | ❌      | Publishable packages |
| `cliConfig`      | ESM       | ✅  | ✅      | CLI tools            |
| `internalConfig` | ESM       | ❌  | ❌      | Workspace-only       |
