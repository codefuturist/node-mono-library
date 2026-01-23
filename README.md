# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
pnpm dlx create-turbo@latest
```

or

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/utils`: a utility library with string, array, object, and async helpers (publishable)
- `@repo/validators`: a validation library with type-safe validators for strings, numbers, dates, and formats (publishable)
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Using the Libraries

The `@repo/utils` and `@repo/validators` packages are publishable libraries that can be used in external projects.

### Installation (from npm)

After the packages are published to npm:

```bash
# Install @repo/utils
npm install @repo/utils
# or
pnpm add @repo/utils

# Install @repo/validators
npm install @repo/validators
# or
pnpm add @repo/validators
```

### Quick Usage Examples

**@repo/utils** - Utility functions:

```typescript
// Import specific modules
import { capitalize, truncate } from "@repo/utils/string";
import { unique, chunk } from "@repo/utils/array";
import { deepClone, pick } from "@repo/utils/object";
import { delay, retry } from "@repo/utils/async";

// Or import everything
import * as utils from "@repo/utils";

capitalize("hello");       // "Hello"
unique([1, 2, 2, 3]);     // [1, 2, 3]
deepClone({ a: 1 });      // { a: 1 } (deep copy)
await delay(1000);        // Wait 1 second
```

**@repo/validators** - Validation functions:

```typescript
// Import specific modules
import { isEmpty, hasMinLength } from "@repo/validators/string";
import { isNumber, isInRange } from "@repo/validators/number";
import { isPlainObject, hasKeys } from "@repo/validators/object";
import { isValidDate, isPast } from "@repo/validators/date";
import { isEmail, isUrl } from "@repo/validators/format";

// Or import everything
import * as validators from "@repo/validators";

isEmpty("");              // true
isInRange(5, 1, 10);     // true
isEmail("a@b.com");      // true
isValidDate(new Date()); // true
```

For full API documentation, see:
- [@repo/utils README](packages/utils/README.md)
- [@repo/validators README](packages/validators/README.md)

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Versioning and Publishing

This monorepo uses [Changesets](https://github.com/changesets/changesets) for version management and publishing to npm.

### Quick Commands

```bash
pnpm changeset              # Create a changeset after making changes
pnpm version-packages       # Bump versions based on changesets
pnpm release                # Build, test, and publish to npm
```

### Workflow

1. Make changes to `@repo/utils` or `@repo/validators`
2. Create a changeset: `pnpm changeset`
3. Commit the changeset with your changes
4. When ready to release: `pnpm version-packages` and `pnpm release`

For detailed documentation, see [docs/VERSIONING.md](docs/VERSIONING.md).

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [Publishing Packages](https://turborepo.dev/docs/guides/publishing-libraries)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
