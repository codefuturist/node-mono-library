/**
 * Async & Parallel Processing Patterns
 *
 * This module demonstrates common async/parallel processing patterns in Node.js.
 * Use these patterns when you need to:
 * - Run multiple async operations concurrently
 * - Control concurrency limits
 * - Handle errors in parallel operations
 * - Process data streams efficiently
 *
 * @example
 * // Run the demo
 * repo-cli demo async
 */

import pc from "picocolors";

// Simulated async operation (e.g., API call, file read, etc.)
async function simulateTask(id: number, duration: number): Promise<string> {
  await sleep(duration);
  return `Task ${id} completed in ${duration}ms`;
}

// Simulated async operation that might fail
async function simulateUnreliableTask(
  id: number,
  duration: number,
  shouldFail: boolean
): Promise<string> {
  await sleep(duration);
  if (shouldFail) {
    throw new Error(`Task ${id} failed`);
  }
  return `Task ${id} succeeded`;
}

// Helper to sleep
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper to measure execution time
async function measure<T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = Math.round(performance.now() - start);
  return { result, duration };
}

/**
 * Pattern 1: Sequential Processing
 * Tasks run one after another. Total time = sum of all task times.
 * Use when: Tasks depend on each other, or order matters.
 */
async function demoSequential(): Promise<void> {
  console.log(pc.bold("\n📝 Pattern 1: Sequential Processing"));
  console.log(pc.dim("   Tasks run one after another (for...of loop)"));

  const tasks = [
    { id: 1, duration: 100 },
    { id: 2, duration: 150 },
    { id: 3, duration: 100 },
  ];

  const { result, duration } = await measure("sequential", async () => {
    const results: string[] = [];
    for (const task of tasks) {
      const result = await simulateTask(task.id, task.duration);
      results.push(result);
    }
    return results;
  });

  console.log(pc.green(`   ✓ Completed in ${duration}ms (expected ~350ms)`));
  console.log(pc.dim(`   Results: ${result.length} tasks completed`));
}

/**
 * Pattern 2: Promise.all - Parallel Processing
 * All tasks run concurrently. Total time ≈ longest task time.
 * Use when: Tasks are independent and you need ALL to succeed.
 * Caveat: Fails fast - if any promise rejects, all results are lost.
 */
async function demoPromiseAll(): Promise<void> {
  console.log(pc.bold("\n⚡ Pattern 2: Promise.all (Parallel)"));
  console.log(pc.dim("   All tasks run concurrently, fails if ANY fails"));

  const tasks = [
    { id: 1, duration: 100 },
    { id: 2, duration: 150 },
    { id: 3, duration: 100 },
  ];

  const { result, duration } = await measure("Promise.all", async () => {
    return Promise.all(tasks.map((t) => simulateTask(t.id, t.duration)));
  });

  console.log(pc.green(`   ✓ Completed in ${duration}ms (expected ~150ms)`));
  console.log(pc.dim(`   Results: ${result.length} tasks completed`));

  // Show what happens when one fails
  console.log(pc.yellow("\n   ⚠ Demonstrating fail-fast behavior:"));
  try {
    await Promise.all([
      simulateUnreliableTask(1, 100, false),
      simulateUnreliableTask(2, 50, true), // This fails
      simulateUnreliableTask(3, 100, false),
    ]);
  } catch (error) {
    console.log(pc.red(`   ✗ ${(error as Error).message} - all results lost!`));
  }
}

/**
 * Pattern 3: Promise.allSettled - Parallel with Error Handling
 * All tasks run concurrently, but failures don't stop others.
 * Use when: You want results from successful tasks even if some fail.
 */
async function demoPromiseAllSettled(): Promise<void> {
  console.log(
    pc.bold("\n🛡️  Pattern 3: Promise.allSettled (Resilient Parallel)")
  );
  console.log(pc.dim("   All tasks run, collects both successes and failures"));

  const { result, duration } = await measure("Promise.allSettled", async () => {
    return Promise.allSettled([
      simulateUnreliableTask(1, 100, false),
      simulateUnreliableTask(2, 50, true), // This fails
      simulateUnreliableTask(3, 100, false),
    ]);
  });

  console.log(pc.green(`   ✓ Completed in ${duration}ms`));

  const fulfilled = result.filter((r) => r.status === "fulfilled");
  const rejected = result.filter((r) => r.status === "rejected");

  console.log(
    pc.dim(
      `   Results: ${fulfilled.length} succeeded, ${rejected.length} failed`
    )
  );

  // Show how to extract values
  console.log(pc.dim("\n   Extracting results:"));
  result.forEach((r, i) => {
    if (r.status === "fulfilled") {
      console.log(pc.green(`   [${i}] ✓ ${r.value}`));
    } else {
      console.log(pc.red(`   [${i}] ✗ ${r.reason.message}`));
    }
  });
}

/**
 * Pattern 4: Promise.race - First to Complete Wins
 * Returns result of the first promise to settle (success OR failure).
 * Use when: You want the fastest response, or implementing timeouts.
 */
async function demoPromiseRace(): Promise<void> {
  console.log(pc.bold("\n🏃 Pattern 4: Promise.race (First Wins)"));
  console.log(
    pc.dim("   Returns first promise to settle (success or failure)")
  );

  const { result, duration } = await measure("Promise.race", async () => {
    return Promise.race([
      simulateTask(1, 200), // Slow
      simulateTask(2, 50), // Fast - wins!
      simulateTask(3, 150), // Medium
    ]);
  });

  console.log(pc.green(`   ✓ Completed in ${duration}ms`));
  console.log(pc.dim(`   Winner: ${result}`));

  // Common use case: Timeout pattern
  console.log(pc.yellow("\n   💡 Common use: Timeout pattern"));
  console.log(pc.dim("   const result = await Promise.race(["));
  console.log(pc.dim("     fetchData(),"));
  console.log(pc.dim("     timeout(5000, 'Request timed out')"));
  console.log(pc.dim("   ]);"));
}

/**
 * Pattern 5: Promise.any - First Success Wins
 * Returns first promise to SUCCEED. Only fails if ALL fail.
 * Use when: You have multiple sources and need just one to work.
 */
async function demoPromiseAny(): Promise<void> {
  console.log(pc.bold("\n🎯 Pattern 5: Promise.any (First Success Wins)"));
  console.log(pc.dim("   Returns first successful promise, ignores failures"));

  const { result, duration } = await measure("Promise.any", async () => {
    return Promise.any([
      simulateUnreliableTask(1, 100, true), // Fails
      simulateUnreliableTask(2, 150, false), // Succeeds - wins!
      simulateUnreliableTask(3, 200, true), // Fails
    ]);
  });

  console.log(pc.green(`   ✓ Completed in ${duration}ms`));
  console.log(pc.dim(`   Winner: ${result}`));

  // Show what happens when ALL fail
  console.log(pc.yellow("\n   ⚠ When all fail:"));
  try {
    await Promise.any([
      simulateUnreliableTask(1, 50, true),
      simulateUnreliableTask(2, 50, true),
    ]);
  } catch {
    console.log(pc.red(`   ✗ AggregateError: All promises rejected`));
  }
}

/**
 * Pattern 6: Controlled Concurrency (Pool/Limit)
 * Run tasks in parallel but limit how many run at once.
 * Use when: Avoiding rate limits, memory constraints, or API throttling.
 */
async function demoControlledConcurrency(): Promise<void> {
  console.log(pc.bold("\n🎛️  Pattern 6: Controlled Concurrency (Pool)"));
  console.log(pc.dim("   Parallel execution with max concurrent limit"));

  const tasks = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    duration: 100,
  }));

  const concurrencyLimit = 3;

  const { result, duration } = await measure("pool", async () => {
    return runWithConcurrencyLimit(
      tasks,
      (task) => simulateTask(task.id, task.duration),
      concurrencyLimit
    );
  });

  console.log(pc.green(`   ✓ Completed in ${duration}ms`));
  console.log(
    pc.dim(
      `   10 tasks, limit ${concurrencyLimit} concurrent → ~400ms expected`
    )
  );
  console.log(pc.dim(`   Results: ${result.length} tasks completed`));
}

/**
 * Generic concurrency limiter implementation
 * This is what libraries like p-limit do under the hood
 */
async function runWithConcurrencyLimit<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  limit: number
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const promise = fn(item).then((result) => {
      results.push(result);
    });

    executing.push(promise);

    // If we've hit the limit, wait for one to finish
    if (executing.length >= limit) {
      await Promise.race(executing);
      // Remove settled promises
      executing.splice(
        0,
        executing.length,
        ...executing.filter((p) => {
          let settled = false;
          p.then(() => (settled = true)).catch(() => (settled = true));
          return !settled;
        })
      );
    }
  }

  // Wait for remaining
  await Promise.all(executing);
  return results;
}

/**
 * Pattern 7: Async Iteration (for-await-of)
 * Process async items as they arrive (streams, paginated APIs).
 * Use when: Data arrives over time, memory-efficient processing.
 */
async function demoAsyncIteration(): Promise<void> {
  console.log(pc.bold("\n🔄 Pattern 7: Async Iteration (for-await-of)"));
  console.log(pc.dim("   Process items as they arrive, memory efficient"));

  // Simulated async generator (like paginated API)
  async function* fetchPages(): AsyncGenerator<number[]> {
    for (let page = 1; page <= 3; page++) {
      await sleep(100);
      yield Array.from({ length: 3 }, (_, i) => page * 10 + i);
    }
  }

  const { result, duration } = await measure("async-iteration", async () => {
    const allItems: number[] = [];
    for await (const page of fetchPages()) {
      console.log(pc.dim(`   Received page: [${page.join(", ")}]`));
      allItems.push(...page);
    }
    return allItems;
  });

  console.log(pc.green(`   ✓ Completed in ${duration}ms`));
  console.log(pc.dim(`   Total items: ${result.length}`));
}

/**
 * Pattern 8: Pipeline Processing
 * Chain async operations, each step processes output of previous.
 * Use when: Data transformation pipelines, ETL processes.
 */
async function demoPipeline(): Promise<void> {
  console.log(pc.bold("\n🔗 Pattern 8: Pipeline Processing"));
  console.log(pc.dim("   Chain async operations in sequence"));

  // Each step is an async transformer
  const pipeline = [
    async (data: number[]): Promise<number[]> => {
      await sleep(50);
      return data.map((x) => x * 2); // Double
    },
    async (data: number[]): Promise<number[]> => {
      await sleep(50);
      return data.filter((x) => x > 5); // Filter
    },
    async (data: number[]): Promise<number[]> => {
      await sleep(50);
      return data.map((x) => x + 1); // Increment
    },
  ];

  const initialData = [1, 2, 3, 4, 5];

  const { result, duration } = await measure("pipeline", async () => {
    let data = initialData;
    for (const step of pipeline) {
      data = await step(data);
    }
    return data;
  });

  console.log(pc.green(`   ✓ Completed in ${duration}ms`));
  console.log(pc.dim(`   Input:  [${initialData.join(", ")}]`));
  console.log(pc.dim(`   Output: [${result.join(", ")}]`));
  console.log(pc.dim("   Steps: ×2 → >5 → +1"));
}

/**
 * Pattern 9: Retry with Exponential Backoff
 * Retry failed async operations with increasing delays.
 * Use when: Handling transient failures, network issues.
 */
async function demoRetry(): Promise<void> {
  console.log(pc.bold("\n🔁 Pattern 9: Retry with Exponential Backoff"));
  console.log(pc.dim("   Automatically retry failed operations"));

  let attempts = 0;

  const { result, duration } = await measure("retry", async () => {
    return retry(
      async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error(`Attempt ${attempts} failed`);
        }
        return "Success on attempt 3!";
      },
      {
        maxRetries: 5,
        initialDelay: 50,
        onRetry: (error, attempt) => {
          console.log(pc.yellow(`   ↻ Attempt ${attempt} failed, retrying...`));
        },
      }
    );
  });

  console.log(pc.green(`   ✓ Completed in ${duration}ms`));
  console.log(pc.dim(`   Result: ${result}`));
}

/**
 * Generic retry implementation with exponential backoff
 */
interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay?: number;
  backoffFactor?: number;
  onRetry?: (error: Error, attempt: number) => void;
}

async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxRetries,
    initialDelay,
    maxDelay = 30000,
    backoffFactor = 2,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        break;
      }

      onRetry?.(lastError, attempt);

      const delay = Math.min(
        initialDelay * Math.pow(backoffFactor, attempt - 1),
        maxDelay
      );
      await sleep(delay);
    }
  }

  throw lastError!;
}

/**
 * Pattern 10: Debounce & Throttle (Async)
 * Control how often async operations execute.
 * Use when: User input, resize events, API calls.
 */
async function demoDebounceThrottle(): Promise<void> {
  console.log(pc.bold("\n⏱️  Pattern 10: Debounce & Throttle"));
  console.log(pc.dim("   Control execution frequency of async operations"));

  // Debounce: Wait until calls stop, then execute once
  console.log(pc.cyan("\n   Debounce (waits for silence):"));
  const debouncedFn = debounce(async (value: string) => {
    console.log(pc.green(`   → Executed with: ${value}`));
  }, 100);

  console.log(pc.dim("   Calling rapidly 5 times..."));
  for (let i = 1; i <= 5; i++) {
    debouncedFn(`call-${i}`);
    await sleep(30);
  }
  await sleep(150); // Wait for debounce to fire

  // Throttle: Execute at most once per interval
  console.log(pc.cyan("\n   Throttle (max once per interval):"));
  let throttleCount = 0;
  const throttledFn = throttle(async () => {
    throttleCount++;
    console.log(pc.green(`   → Executed (${throttleCount})`));
  }, 100);

  console.log(pc.dim("   Calling rapidly 10 times over 300ms..."));
  for (let i = 0; i < 10; i++) {
    throttledFn();
    await sleep(30);
  }
  await sleep(150);
  console.log(
    pc.dim(`   Total executions: ${throttleCount} (limited by throttle)`)
  );
}

/**
 * Simple debounce implementation
 */
function debounce<T extends (...args: Parameters<T>) => Promise<void>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Simple throttle implementation
 */
function throttle<T extends (...args: Parameters<T>) => Promise<void>>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Run all async pattern demos
 */
export async function demoAsync(): Promise<void> {
  const { logger } = await import("./logger.js");

  logger.info("Async & Parallel Processing Patterns Demo\n");
  console.log(pc.dim("═".repeat(60)));

  await demoSequential();
  await demoPromiseAll();
  await demoPromiseAllSettled();
  await demoPromiseRace();
  await demoPromiseAny();
  await demoControlledConcurrency();
  await demoAsyncIteration();
  await demoPipeline();
  await demoRetry();
  await demoDebounceThrottle();

  console.log(pc.dim("\n" + "═".repeat(60)));
  logger.blank();
  logger.success("All async patterns demonstrated!");

  // Quick reference
  logger.blank();
  console.log(pc.bold("📚 Quick Reference:"));
  console.log(pc.dim("─".repeat(60)));
  console.log(
    `${pc.cyan("Sequential")}      │ for...of with await    │ Order matters`
  );
  console.log(
    `${pc.cyan("Promise.all")}     │ All parallel, fail-fast│ Need ALL results`
  );
  console.log(
    `${pc.cyan("Promise.allSettled")}│ All parallel, resilient│ Some may fail`
  );
  console.log(
    `${pc.cyan("Promise.race")}    │ First to settle wins   │ Timeouts`
  );
  console.log(
    `${pc.cyan("Promise.any")}     │ First success wins     │ Fallbacks`
  );
  console.log(
    `${pc.cyan("Concurrency Pool")}│ Parallel with limit    │ Rate limiting`
  );
  console.log(
    `${pc.cyan("Async Iteration")} │ for-await-of           │ Streams/pages`
  );
  console.log(`${pc.cyan("Pipeline")}        │ Chained transforms     │ ETL`);
  console.log(
    `${pc.cyan("Retry")}           │ Exponential backoff    │ Transient errors`
  );
  console.log(
    `${pc.cyan("Debounce/Throttle")}│ Frequency control      │ User input`
  );
}

// Export utilities for use elsewhere
export {
  runWithConcurrencyLimit,
  retry,
  debounce,
  throttle,
  type RetryOptions,
};
