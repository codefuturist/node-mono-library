import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextJsConfig,
  {
    // Admin app specific rules
    rules: {
      // Allow console for development/debugging
      "no-console": "off",
      // Allow unused vars prefixed with underscore (intentionally unused)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default config;
