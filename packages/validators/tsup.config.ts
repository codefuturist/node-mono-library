import { libraryConfig } from "@repo/tsup-config";

export default libraryConfig([
  "src/index.ts",
  "src/string.ts",
  "src/number.ts",
  "src/object.ts",
  "src/date.ts",
  "src/format.ts",
]);
