# Turbo Generators

Interactive code scaffolding for the monorepo using [Turborepo Generators](https://turbo.build/repo/docs/guides/generating-code).

## Quick Start

```bash
# List all available generators
pnpm gen

# Or run a specific generator
pnpm gen:package     # Create a new package
pnpm gen:component   # Add a React component
pnpm gen:util        # Add a utility function
pnpm gen:app         # Create a Next.js app
```

## Available Generators

### 1. Package Generator (`pnpm gen:package`)

Creates a new package in `packages/` with full TypeScript setup.

**Prompts:**

- **Name**: Package name without `@repo/` prefix (e.g., `auth`, `cache`)
- **Description**: What the package does
- **Type**: Library (publishable) | Internal | Config

**What gets created:**

```text
packages/<name>/
├── package.json          # Configured for workspace
├── tsconfig.json         # Extends shared config
├── README.md             # Documentation template
├── src/
│   └── index.ts          # Entry point with example export
├── __tests__/            # (library type only)
│   └── index.test.ts     # Example test
├── tsup.config.ts        # (library type only)
├── vitest.config.ts      # (library type only)
└── eslint.config.mjs     # (library type only)
```

### 2. Component Generator (`pnpm gen:component`)

Adds a new React component to `@repo/ui`.

**Prompts:**

- **Name**: Component name in PascalCase (e.g., `DataTable`, `Modal`)
- **Include props?**: Generate a typed props interface
- **Include test?**: Generate a test file

**What gets created:**

```text
packages/ui/src/
├── <kebab-name>.tsx           # Component file
└── __tests__/
    └── <kebab-name>.test.tsx  # Test file (optional)
```

Also appends export to `packages/ui/src/index.ts`.

### 3. Utility Generator (`pnpm gen:util`)

Adds a utility function to `@repo/utils` in a specific category.

**Prompts:**

- **Name**: Function name in camelCase (e.g., `formatDate`, `parseUrl`)
- **Description**: What the function does
- **Category**: string | number | array | object | date | misc

**What gets created:**

```text
packages/utils/
├── src/<category>/<name>.ts           # Function file
└── __tests__/<category>/<name>.test.ts  # Test file
```

Also appends export to `packages/utils/src/<category>/index.ts`.

### 4. App Generator (`pnpm gen:app`)

Creates a new Next.js application in `apps/`.

**Prompts:**

- **Name**: App name (lowercase with hyphens)
- **Description**: What the app does
- **Include Tailwind?**: Set up Tailwind CSS

**What gets created:**

```text
apps/<name>/
├── package.json
├── tsconfig.json
├── next.config.js
├── eslint.config.js
├── postcss.config.mjs    # (with Tailwind)
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
└── public/
```

## After Running a Generator

1. **Install dependencies**: `pnpm install`
2. **Start developing**: Edit files in `src/`
3. **Run tests**: `pnpm test --filter=@repo/<name>`
4. **Build**: `pnpm build --filter=@repo/<name>`

## Customizing Templates

Templates are located in `turbo/generators/templates/` using [Handlebars](https://handlebarsjs.com/) syntax.

**Available helpers:**

- `{{name}}` - Raw name from prompt
- `{{kebabCase name}}` - Converts to kebab-case
- `{{camelCase name}}` - Converts to camelCase
- `{{pascalCase name}}` - Converts to PascalCase
- `{{#if condition}}...{{/if}}` - Conditional blocks
- `{{#eq value "test"}}...{{/eq}}` - Equality check

## Creating New Generators

Edit `turbo/generators/config.ts` to add new generators:

```typescript
plop.setGenerator("my-generator", {
  description: "What this generator does",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "Enter a name:",
    },
  ],
  actions: [
    {
      type: "add",
      path: "path/to/{{name}}/file.ts",
      templateFile: "templates/my-template.hbs",
    },
  ],
});
```

## Troubleshooting

**Generator not found:**

```bash
# Make sure you're in the repo root
cd /path/to/node-mono-library
pnpm gen
```

**Template errors:**

- Check Handlebars syntax in `turbo/generators/templates/`
- Ensure all referenced variables exist in prompts

**File already exists:**

- Generators won't overwrite existing files by default
- Delete the existing file or use `force: true` in the action

## Learn More

- [Turborepo Generators Guide](https://turbo.build/repo/docs/guides/generating-code)
- [Plop.js Documentation](https://plopjs.com/documentation/)
- [Handlebars Templates](https://handlebarsjs.com/guide/)
