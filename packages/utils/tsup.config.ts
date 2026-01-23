import { defineConfig } from "tsup";

export default defineConfig({
    entry: [
        "src/index.ts",
        "src/string.ts",
        "src/array.ts",
        "src/object.ts",
        "src/async.ts",
    ],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    treeshake: true,
});
