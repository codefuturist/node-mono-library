import { defineConfig } from "tsup";

export default defineConfig({
    entry: [
        "src/index.ts",
        "src/string.ts",
        "src/number.ts",
        "src/object.ts",
        "src/date.ts",
        "src/format.ts",
    ],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    treeshake: true,
});
