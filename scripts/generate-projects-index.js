#!/usr/bin/env node

/**
 * Auto-generates PROJECTS.md from workspace package.json files
 * Run: node scripts/generate-projects-index.js
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

function readPackageJson(dir) {
  const pkgPath = join(dir, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    return JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    return null;
  }
}

function getProjects(baseDir, type) {
  const dir = join(ROOT, baseDir);
  if (!existsSync(dir)) return [];

  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const pkg = readPackageJson(join(dir, d.name));
      if (!pkg) return null;
      return {
        name: pkg.name || d.name,
        path: `${baseDir}/${d.name}`,
        description: pkg.description || "-",
        version: pkg.version || "-",
        private: pkg.private !== false,
        type,
      };
    })
    .filter(Boolean);
}

function generateMarkdown(apps, packages) {
  const now = new Date().toISOString().split("T")[0];

  let md = `# Projects Index

> Auto-generated on ${now}. Run \`pnpm projects:generate\` to update.

## 📱 Apps

| App | Path | Description | Version |
| --- | ---- | ----------- | ------- |
`;

  for (const app of apps) {
    md += `| **${app.name}** | \`${app.path}\` | ${app.description} | ${app.version} |\n`;
  }

  const publishable = packages.filter((p) => !p.private);
  const internal = packages.filter((p) => p.private);

  if (publishable.length) {
    md += `
## 📦 Publishable Packages

| Package | Path | Description | Version |
| ------- | ---- | ----------- | ------- |
`;
    for (const pkg of publishable) {
      md += `| **${pkg.name}** | \`${pkg.path}\` | ${pkg.description} | ${pkg.version} |\n`;
    }
  }

  if (internal.length) {
    md += `
## 🔧 Internal Packages

| Package | Path | Description |
| ------- | ---- | ----------- |
`;
    for (const pkg of internal) {
      md += `| **${pkg.name}** | \`${pkg.path}\` | ${pkg.description} |\n`;
    }
  }

  md += `
## 🚀 Quick Commands

\`\`\`bash
# List all projects
pnpm list -r --depth -1

# Run all apps
pnpm dev

# Run specific app/package
pnpm dev --filter=<name>
pnpm test --filter=<name>
\`\`\`
`;

  return md;
}

// Main
const apps = getProjects("apps", "app");
const packages = getProjects("packages", "package");

const markdown = generateMarkdown(apps, packages);
writeFileSync(join(ROOT, "PROJECTS.md"), markdown);

console.log(`✅ Generated PROJECTS.md with ${apps.length} apps and ${packages.length} packages`);
