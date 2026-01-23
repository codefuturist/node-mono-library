import { describe, it, expect, vi } from "vitest";
import { delay, retry, debounce, throttle, parallelLimit } from "../src/async";

describe("async utilities", () => {
    describe("delay", () => {
        it("delays execution", async () => {
            const start = Date.now();
            await delay(50);
            const elapsed = Date.now() - start;
            expect(elapsed).toBeGreaterThanOrEqual(45);
        });
    });

    describe("retry", () => {
        it("succeeds on first try", async () => {
            const fn = vi.fn().mockResolvedValue("success");
            const result = await retry(fn);
            expect(result).toBe("success");
            expect(fn).toHaveBeenCalledTimes(1);
        });

        it("retries on failure", async () => {
            const fn = vi
                .fn()
                .mockRejectedValueOnce(new Error("fail"))
                .mockResolvedValue("success");

            const result = await retry(fn, { initialDelay: 10 });
            expect(result).toBe("success");
            expect(fn).toHaveBeenCalledTimes(2);
        });

        it("throws after max attempts", async () => {
            const fn = vi.fn().mockRejectedValue(new Error("always fails"));

            await expect(retry(fn, { maxAttempts: 2, initialDelay: 10 })).rejects.toThrow(
                "always fails"
            );
            expect(fn).toHaveBeenCalledTimes(2);
        });
    });

    describe("debounce", () => {
        it("debounces function calls", async () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 50);

            debounced();
            debounced();
            debounced();

            expect(fn).not.toHaveBeenCalled();

            await delay(60);
            expect(fn).toHaveBeenCalledTimes(1);
        });
    });

    describe("throttle", () => {
        it("throttles function calls", async () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 50);

            throttled();
            throttled();
            throttled();

            expect(fn).toHaveBeenCalledTimes(1);

            await delay(60);
            throttled();
            expect(fn).toHaveBeenCalledTimes(2);
        });
    });

    describe("parallelLimit", () => {
        it("processes items with concurrency limit", async () => {
            const items = [1, 2, 3, 4, 5];
            const results = await parallelLimit(items, 2, async (n) => n * 2);
            // Results may be in any order due to parallel execution
            expect(results.sort((a, b) => a - b)).toEqual([2, 4, 6, 8, 10]);
        });

        it("handles empty array", async () => {
            const results = await parallelLimit([], 2, async (n) => n);
            expect(results).toEqual([]);
        });
    });
});
