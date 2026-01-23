/**
 * Comprehensive tests for the replace command
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
    runReplace,
    DEFAULT_IGNORE_PATTERNS,
} from "../../src/commands/replace.js";
import {
    createTempDir,
    cleanupTempDir,
    createTestFile,
    mockCwd,
} from "../helpers/test-utils.js";

describe("replace command", () => {
    let tempDir: string;
    let restoreCwd: () => void;

    beforeEach(() => {
        tempDir = createTempDir("replace-test-");
        restoreCwd = mockCwd(tempDir);
    });

    afterEach(() => {
        restoreCwd();
        cleanupTempDir(tempDir);
    });

    describe("basic replacements", () => {
        it("should replace a simple string pattern", async () => {
            createTestFile(tempDir, "test.ts", "const foo = 'hello';\nconst bar = 'foo';");

            const result = await runReplace({
                pattern: "foo",
                replacement: "baz",
                files: [join(tempDir, "**/*.ts")],
                noDefaultIgnore: true,
            });

            expect(result.changed).toHaveLength(1);
            expect(result.totalReplacements).toBe(2);

            const content = readFileSync(join(tempDir, "test.ts"), "utf-8");
            expect(content).toBe("const baz = 'hello';\nconst bar = 'baz';");
        });

        it("should replace with regex pattern", async () => {
            createTestFile(tempDir, "test.ts", "import { x } from 'old-lib';\nimport { y } from 'old-lib';");

            const result = await runReplace({
                pattern: "from 'old-lib'",
                replacement: "from 'new-lib'",
                files: [join(tempDir, "**/*.ts")],
                noDefaultIgnore: true,
            });

            expect(result.changed).toHaveLength(1);
            expect(result.totalReplacements).toBe(2);

            const content = readFileSync(join(tempDir, "test.ts"), "utf-8");
            expect(content).toContain("from 'new-lib'");
            expect(content).not.toContain("from 'old-lib'");
        });

        it("should support capture groups", async () => {
            createTestFile(tempDir, "test.ts", "const myVariable = 1;\nconst myFunction = () => {};");

            const result = await runReplace({
                pattern: "my(Variable|Function)",
                replacement: "the$1",
                files: [join(tempDir, "**/*.ts")],
                noDefaultIgnore: true,
            });

            expect(result.changed).toHaveLength(1);
            expect(result.totalReplacements).toBe(2);

            const content = readFileSync(join(tempDir, "test.ts"), "utf-8");
            expect(content).toContain("theVariable");
            expect(content).toContain("theFunction");
        });

        it("should replace with empty string", async () => {
            createTestFile(tempDir, "test.ts", "// TODO: fix this\nconst x = 1;");

            const result = await runReplace({
                pattern: "// TODO: fix this\\n",
                replacement: "",
                files: [join(tempDir, "**/*.ts")],
                noDefaultIgnore: true,
            });

            expect(result.changed).toHaveLength(1);

            const content = readFileSync(join(tempDir, "test.ts"), "utf-8");
            expect(content).toBe("const x = 1;");
        });
    });

    describe("case sensitivity", () => {
        it("should be case sensitive by default", async () => {
            createTestFile(tempDir, "test.ts", "Foo foo FOO");

            const result = await runReplace({
                pattern: "foo",
                replacement: "bar",
                files: [join(tempDir, "**/*.ts")],
                noDefaultIgnore: true,
            });

            expect(result.totalReplacements).toBe(1);

            const content = readFileSync(join(tempDir, "test.ts"), "utf-8");
            expect(content).toBe("Foo bar FOO");
        });

        it("should support case insensitive matching", async () => {
            createTestFile(tempDir, "test.ts", "Foo foo FOO");

            const result = await runReplace({
                pattern: "foo",
                replacement: "bar",
                files: [join(tempDir, "**/*.ts")],
                ignoreCase: true,
                noDefaultIgnore: true,
            });

            expect(result.totalReplacements).toBe(3);

            const content = readFileSync(join(tempDir, "test.ts"), "utf-8");
            expect(content).toBe("bar bar bar");
        });
    });

    describe("dry run mode", () => {
        it("should not modify files in dry run mode", async () => {
            const originalContent = "const foo = 'bar';";
            createTestFile(tempDir, "test.ts", originalContent);

            const result = await runReplace({
                pattern: "foo",
                replacement: "baz",
                files: [join(tempDir, "**/*.ts")],
                dry: true,
                noDefaultIgnore: true,
            });

            expect(result.dryRun).toBe(true);
            expect(result.changed).toHaveLength(1);

            const content = readFileSync(join(tempDir, "test.ts"), "utf-8");
            expect(content).toBe(originalContent);
        });
    });

    describe("multiple files", () => {
        it("should replace across multiple files", async () => {
            createTestFile(tempDir, "a.ts", "const foo = 1;");
            createTestFile(tempDir, "b.ts", "const foo = 2;");
            createTestFile(tempDir, "c.ts", "const bar = 3;");

            const result = await runReplace({
                pattern: "foo",
                replacement: "baz",
                files: [join(tempDir, "**/*.ts")],
                noDefaultIgnore: true,
            });

            expect(result.changed).toHaveLength(2);
            expect(result.unchanged).toHaveLength(1);
            expect(result.totalReplacements).toBe(2);
        });

        it("should support multiple glob patterns", async () => {
            createTestFile(tempDir, "src/a.ts", "foo");
            createTestFile(tempDir, "lib/b.ts", "foo");
            createTestFile(tempDir, "test/c.ts", "foo");

            const result = await runReplace({
                pattern: "foo",
                replacement: "bar",
                files: [join(tempDir, "src/**/*.ts"), join(tempDir, "lib/**/*.ts")],
                noDefaultIgnore: true,
            });

            expect(result.changed).toHaveLength(2);

            const testContent = readFileSync(join(tempDir, "test/c.ts"), "utf-8");
            expect(testContent).toBe("foo"); // unchanged
        });
    });

    describe("ignore patterns", () => {
        it("should respect custom ignore patterns", async () => {
            createTestFile(tempDir, "src/a.ts", "foo");
            createTestFile(tempDir, "legacy/b.ts", "foo");

            const result = await runReplace({
                pattern: "foo",
                replacement: "bar",
                files: [join(tempDir, "**/*.ts")],
                ignore: [join(tempDir, "legacy/**")],
                noDefaultIgnore: true,
            });

            expect(result.changed).toHaveLength(1);

            const legacyContent = readFileSync(join(tempDir, "legacy/b.ts"), "utf-8");
            expect(legacyContent).toBe("foo");
        });

        it("should use default ignore patterns when not disabled", async () => {
            createTestFile(tempDir, "src/a.ts", "foo");
            createTestFile(tempDir, "node_modules/b.ts", "foo");
            createTestFile(tempDir, "dist/c.ts", "foo");

            const result = await runReplace({
                pattern: "foo",
                replacement: "bar",
                files: [join(tempDir, "**/*.ts")],
                // noDefaultIgnore is false by default
            });

            // Only src/a.ts should be changed, node_modules and dist are ignored
            expect(result.changed).toHaveLength(1);
            expect(result.changed[0]).toContain("src/a.ts");
        });

        it("should have comprehensive default ignore patterns", () => {
            expect(DEFAULT_IGNORE_PATTERNS).toContain("**/node_modules/**");
            expect(DEFAULT_IGNORE_PATTERNS).toContain("**/dist/**");
            expect(DEFAULT_IGNORE_PATTERNS).toContain("**/.turbo/**");
            expect(DEFAULT_IGNORE_PATTERNS).toContain("**/coverage/**");
            expect(DEFAULT_IGNORE_PATTERNS).toContain("**/.git/**");
            expect(DEFAULT_IGNORE_PATTERNS).toContain("**/.next/**");
            expect(DEFAULT_IGNORE_PATTERNS).toContain("**/pnpm-lock.yaml");
        });
    });

    describe("edge cases", () => {
        it("should handle no matches gracefully", async () => {
            createTestFile(tempDir, "test.ts", "const bar = 1;");

            const result = await runReplace({
                pattern: "nonexistent",
                replacement: "replacement",
                files: [join(tempDir, "**/*.ts")],
                noDefaultIgnore: true,
            });

            expect(result.changed).toHaveLength(0);
            expect(result.unchanged).toHaveLength(1);
            expect(result.totalReplacements).toBe(0);
        });

        it("should handle empty files", async () => {
            createTestFile(tempDir, "empty.ts", "");

            const result = await runReplace({
                pattern: "foo",
                replacement: "bar",
                files: [join(tempDir, "**/*.ts")],
                noDefaultIgnore: true,
            });

            expect(result.changed).toHaveLength(0);
        });

        it("should handle special regex characters in pattern", async () => {
            createTestFile(tempDir, "test.ts", "const x = [1, 2, 3];");

            const result = await runReplace({
                pattern: "\\[1, 2, 3\\]",
                replacement: "[4, 5, 6]",
                files: [join(tempDir, "**/*.ts")],
                noDefaultIgnore: true,
            });

            expect(result.changed).toHaveLength(1);

            const content = readFileSync(join(tempDir, "test.ts"), "utf-8");
            expect(content).toBe("const x = [4, 5, 6];");
        });

        it("should handle multiline patterns", async () => {
            createTestFile(tempDir, "test.ts", "function foo() {\n  return 1;\n}");

            const result = await runReplace({
                pattern: "function foo\\(\\) \\{\\n  return 1;\\n\\}",
                replacement: "const foo = () => 1;",
                files: [join(tempDir, "**/*.ts")],
                noDefaultIgnore: true,
            });

            expect(result.changed).toHaveLength(1);

            const content = readFileSync(join(tempDir, "test.ts"), "utf-8");
            expect(content).toBe("const foo = () => 1;");
        });
    });

    describe("result structure", () => {
        it("should return correct result structure", async () => {
            createTestFile(tempDir, "a.ts", "foo foo");
            createTestFile(tempDir, "b.ts", "bar");

            const result = await runReplace({
                pattern: "foo",
                replacement: "baz",
                files: [join(tempDir, "**/*.ts")],
                noDefaultIgnore: true,
            });

            expect(result).toHaveProperty("changed");
            expect(result).toHaveProperty("unchanged");
            expect(result).toHaveProperty("totalReplacements");
            expect(result).toHaveProperty("dryRun");
            expect(Array.isArray(result.changed)).toBe(true);
            expect(Array.isArray(result.unchanged)).toBe(true);
            expect(typeof result.totalReplacements).toBe("number");
            expect(typeof result.dryRun).toBe("boolean");
        });
    });
});
