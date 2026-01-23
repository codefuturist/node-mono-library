import { defineConfig } from "tsup";

export default defineConfig([
  // CLI entry (executable with shebang)
  {
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    dts: false,
    clean: true,
    sourcemap: true,
    treeshake: true,
    minify: false,
    target: "es2022",
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
  // Library entry (for programmatic use)
  {
    entry: { index: "src/index.ts" },
    format: ["esm"],
    dts: true,
    clean: false, // Don't clean again
    sourcemap: true,
    treeshake: true,
    minify: false,
    target: "es2022",
  },
]);
