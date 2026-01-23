# Contributing to node-mono-library

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/codefuturist/node-mono-library.git
cd node-mono-library

# 2. Install dependencies
pnpm install

# 3. Verify setup
pnpm validate
```

## 📋 Development Workflow

### Branch Naming

We use Git Flow. Create branches from `develop`:

```bash
# Feature branch
pnpm flow:feature:start    # Creates feature/<name>

# Hotfix branch (urgent fixes)
pnpm flow:hotfix:start     # Creates hotfix/<version>
```

### Making Changes

1. **Create a branch** from `develop`
2. **Make your changes**
3. **Write/update tests** - We aim for high coverage
4. **Run validation**: `pnpm validate`
5. **Commit** using conventional commits

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
pnpm commit              # Interactive commit helper
pnpm commit:help         # Show commit format guide
```

Format: `<type>(<scope>): <description>`

| Type       | Description             |
| ---------- | ----------------------- |
| `feat`     | New feature             |
| `fix`      | Bug fix                 |
| `docs`     | Documentation changes   |
| `style`    | Code style (formatting) |
| `refactor` | Code refactoring        |
| `perf`     | Performance improvement |
| `test`     | Adding/updating tests   |
| `build`    | Build system changes    |
| `ci`       | CI/CD changes           |
| `chore`    | Maintenance tasks       |

Examples:

- `feat(utils): add debounce function`
- `fix(validators): handle empty string in isEmail`
- `docs: update contributing guide`

### Testing

```bash
pnpm test                 # Run all tests
pnpm test:watch           # Watch mode
pnpm test:coverage        # With coverage
pnpm test:e2e             # E2E tests (Playwright)
```

### Code Quality

```bash
pnpm lint                 # Check linting
pnpm lint:fix             # Fix linting issues
pnpm format               # Format code
pnpm check-types          # TypeScript check
pnpm validate             # Run all checks
```

## 📦 Working with Packages

### Package Structure

```
packages/
├── utils/          # @repo/utils - Utility functions
├── validators/     # @repo/validators - Validation functions
├── ui/             # @repo/ui - React components
├── cli/            # @repo/cli - CLI tool
├── eslint-config/  # Shared ESLint config
├── typescript-config/  # Shared TS config
└── vitest-config/  # Shared Vitest config
```

### Adding New Features

1. Add code to `src/`
2. Add tests to `__tests__/`
3. Update exports in `src/index.ts`
4. Update README if needed

### Creating a Changeset

For changes to publishable packages (`@repo/utils`, `@repo/validators`, `@repo/cli`):

```bash
pnpm changeset            # Create a changeset
```

Select the affected packages, choose version bump (patch/minor/major), and write a summary.

## 🔄 Pull Request Process

1. **Ensure all checks pass**: `pnpm validate`
2. **Create PR** to `develop` branch
3. **Fill out PR template**
4. **Request review**
5. **Address feedback**
6. **Squash merge** when approved

### PR Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Changeset created (if needed)
- [ ] All CI checks pass

## 🏗️ Project Architecture

### Monorepo Structure

```
├── apps/               # Applications
│   ├── admin/          # Admin dashboard (Next.js + Prisma)
│   ├── docs/           # Documentation site
│   └── web/            # Demo web app
├── packages/           # Shared libraries
├── examples/           # Usage examples
├── tests/              # E2E tests
└── docs/               # Project documentation
```

### Key Technologies

- **Build**: Turborepo + tsup
- **Runtime**: Node.js 20+
- **Package Manager**: pnpm 10+
- **Framework**: Next.js 16
- **Database**: Prisma + SQLite (libsql)
- **Testing**: Vitest + Playwright
- **Styling**: Tailwind CSS

## 🐛 Reporting Issues

1. Check [existing issues](https://github.com/codefuturist/node-mono-library/issues)
2. Use issue templates when creating new issues
3. Include reproduction steps
4. Provide environment details

## 💬 Getting Help

- Check the [documentation](./docs/)
- Open a [discussion](https://github.com/codefuturist/node-mono-library/discussions)
- Review existing issues and PRs

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing! 🎉
