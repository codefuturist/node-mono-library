import type { PlopTypes } from "@turbo/gen";

// Learn more about Turborepo Generators at:
// https://turbo.build/repo/docs/guides/generating-code

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // ============================================
  // GENERATOR 1: New Package
  // Usage: pnpm turbo gen package
  // ============================================
  plop.setGenerator("package", {
    description: "Create a new internal package in packages/",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Package name (without @repo/ prefix):",
        validate: (input: string) => {
          if (!input) return "Package name is required";
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return "Package name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "Package description:",
        default: "A shared package for the monorepo",
      },
      {
        type: "list",
        name: "type",
        message: "Package type:",
        choices: [
          { name: "Library (publishable with tsup)", value: "library" },
          { name: "Internal (workspace only)", value: "internal" },
          { name: "Config (shared configuration)", value: "config" },
        ],
        default: "library",
      },
    ],
    actions: (answers) => {
      const actions: PlopTypes.ActionType[] = [];
      const packagePath = "packages/{{name}}";

      // Common files for all package types
      actions.push(
        {
          type: "add",
          path: `${packagePath}/package.json`,
          templateFile: "templates/package/package.json.hbs",
        },
        {
          type: "add",
          path: `${packagePath}/tsconfig.json`,
          templateFile: "templates/package/tsconfig.json.hbs",
        },
        {
          type: "add",
          path: `${packagePath}/README.md`,
          templateFile: "templates/package/README.md.hbs",
        },
        {
          type: "add",
          path: `${packagePath}/src/index.ts`,
          templateFile: "templates/package/src/index.ts.hbs",
        }
      );

      // Library-specific files (publishable packages)
      if (answers?.type === "library") {
        actions.push(
          {
            type: "add",
            path: `${packagePath}/tsup.config.ts`,
            templateFile: "templates/package/tsup.config.ts.hbs",
          },
          {
            type: "add",
            path: `${packagePath}/vitest.config.ts`,
            templateFile: "templates/package/vitest.config.ts.hbs",
          },
          {
            type: "add",
            path: `${packagePath}/eslint.config.mjs`,
            templateFile: "templates/package/eslint.config.mjs.hbs",
          },
          {
            type: "add",
            path: `${packagePath}/__tests__/index.test.ts`,
            templateFile: "templates/package/__tests__/index.test.ts.hbs",
          }
        );
      }

      // Final message
      actions.push({
        type: "add",
        path: `${packagePath}/.turbo-gen-complete`,
        template: `Package @repo/{{name}} created successfully!

Next steps:
1. Run: pnpm install
2. Start developing in packages/{{name}}/src/
3. Run tests: pnpm test --filter=@repo/{{name}}
`,
        force: true,
      });

      return actions;
    },
  });

  // ============================================
  // GENERATOR 2: New Component (for @repo/ui)
  // Usage: pnpm turbo gen component
  // ============================================
  plop.setGenerator("component", {
    description: "Create a new React component in @repo/ui",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (PascalCase):",
        validate: (input: string) => {
          if (!input) return "Component name is required";
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return "Component name must be PascalCase (e.g., MyButton, DataTable)";
          }
          return true;
        },
      },
      {
        type: "confirm",
        name: "withProps",
        message: "Include props interface?",
        default: true,
      },
      {
        type: "confirm",
        name: "withTest",
        message: "Include test file?",
        default: true,
      },
    ],
    actions: (answers) => {
      const actions: PlopTypes.ActionType[] = [];

      actions.push({
        type: "add",
        path: "packages/ui/src/{{kebabCase name}}.tsx",
        templateFile: "templates/component/component.tsx.hbs",
      });

      if (answers?.withTest) {
        actions.push({
          type: "add",
          path: "packages/ui/src/__tests__/{{kebabCase name}}.test.tsx",
          templateFile: "templates/component/component.test.tsx.hbs",
        });
      }

      // Append export to index.ts
      actions.push({
        type: "append",
        path: "packages/ui/src/index.ts",
        template: 'export * from "./{{kebabCase name}}";\n',
      });

      return actions;
    },
  });

  // ============================================
  // GENERATOR 3: New Utility Function
  // Usage: pnpm turbo gen util
  // ============================================
  plop.setGenerator("util", {
    description: "Create a new utility function in @repo/utils",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Function name (camelCase):",
        validate: (input: string) => {
          if (!input) return "Function name is required";
          if (!/^[a-z][a-zA-Z0-9]*$/.test(input)) {
            return "Function name must be camelCase (e.g., formatDate, parseUrl)";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "Function description:",
        default: "A utility function",
      },
      {
        type: "list",
        name: "category",
        message: "Category (submodule):",
        choices: ["string", "number", "array", "object", "date", "misc"],
        default: "misc",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/utils/src/{{category}}/{{name}}.ts",
        templateFile: "templates/util/function.ts.hbs",
      },
      {
        type: "add",
        path: "packages/utils/__tests__/{{category}}/{{name}}.test.ts",
        templateFile: "templates/util/function.test.ts.hbs",
      },
      {
        type: "append",
        path: "packages/utils/src/{{category}}/index.ts",
        template: 'export { {{name}} } from "./{{name}}";\n',
      },
    ],
  });

  // ============================================
  // GENERATOR 4: New App
  // Usage: pnpm turbo gen app
  // ============================================
  plop.setGenerator("app", {
    description: "Create a new Next.js app in apps/",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "App name:",
        validate: (input: string) => {
          if (!input) return "App name is required";
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return "App name must be lowercase with hyphens";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "App description:",
        default: "A Next.js application",
      },
      {
        type: "confirm",
        name: "withTailwind",
        message: "Include Tailwind CSS?",
        default: true,
      },
    ],
    actions: (answers) => {
      const actions: PlopTypes.ActionType[] = [];
      const appPath = "apps/{{name}}";

      actions.push(
        {
          type: "add",
          path: `${appPath}/package.json`,
          templateFile: "templates/app/package.json.hbs",
        },
        {
          type: "add",
          path: `${appPath}/tsconfig.json`,
          templateFile: "templates/app/tsconfig.json.hbs",
        },
        {
          type: "add",
          path: `${appPath}/next.config.js`,
          templateFile: "templates/app/next.config.js.hbs",
        },
        {
          type: "add",
          path: `${appPath}/eslint.config.js`,
          templateFile: "templates/app/eslint.config.js.hbs",
        },
        {
          type: "add",
          path: `${appPath}/app/page.tsx`,
          templateFile: "templates/app/app/page.tsx.hbs",
        },
        {
          type: "add",
          path: `${appPath}/app/layout.tsx`,
          templateFile: "templates/app/app/layout.tsx.hbs",
        },
        {
          type: "add",
          path: `${appPath}/app/globals.css`,
          templateFile: answers?.withTailwind
            ? "templates/app/app/globals-tailwind.css.hbs"
            : "templates/app/app/globals.css.hbs",
        },
        {
          type: "add",
          path: `${appPath}/public/.gitkeep`,
          template: "",
        }
      );

      if (answers?.withTailwind) {
        actions.push({
          type: "add",
          path: `${appPath}/postcss.config.mjs`,
          templateFile: "templates/app/postcss.config.mjs.hbs",
        });
      }

      return actions;
    },
  });
}
