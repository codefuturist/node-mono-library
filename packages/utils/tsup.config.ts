import { libraryConfig } from "@repo/tsup-config";

export default libraryConfig([
  "src/index.ts",
  "src/string.ts",
  "src/array.ts",
  "src/object.ts",
  "src/async.ts",
]);
