/**
 * Utils Examples
 * Demonstrates clean usage of @repo/utils library
 */

// Import only what you need for better tree-shaking
import { capitalize, toKebabCase, truncate } from "@repo/utils/string";
import { unique, chunk, groupBy } from "@repo/utils/array";
import { deepClone, pick, omit } from "@repo/utils/object";
import { delay, retry, debounce } from "@repo/utils/async";

console.log("=== String Utils Examples ===\n");

// Clean text formatting
const userInput = "hello world";
console.log(`Original: "${userInput}"`);
console.log(`Capitalized: "${capitalize(userInput)}"`);
console.log(`Kebab case: "${toKebabCase(userInput)}"`);

// Truncate long text
const longText = "This is a very long piece of text that needs to be truncated";
console.log(`Truncated: "${truncate(longText, 30)}"`);

console.log("\n=== Array Utils Examples ===\n");

// Remove duplicates from user selections
const userSelections = [1, 2, 2, 3, 4, 4, 5];
console.log(`Original selections: [${userSelections}]`);
console.log(`Unique selections: [${unique(userSelections)}]`);

// Batch processing
const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const batches = chunk(items, 3);
console.log(`Processing in batches of 3:`, batches);

// Group data by category
interface Product {
  name: string;
  category: string;
  price: number;
}

const products: Product[] = [
  { name: "Laptop", category: "Electronics", price: 999 },
  { name: "Mouse", category: "Electronics", price: 29 },
  { name: "Desk", category: "Furniture", price: 299 },
  { name: "Chair", category: "Furniture", price: 199 },
];

const grouped = groupBy(products, (p) => p.category);
console.log("\nProducts grouped by category:");
Object.entries(grouped).forEach(([category, items]) => {
  console.log(`  ${category}: ${items.map((p) => p.name).join(", ")}`);
});

console.log("\n=== Object Utils Examples ===\n");

// Safe deep cloning
const original = { user: { name: "John", settings: { theme: "dark" } } };
const cloned = deepClone(original);
cloned.user.settings.theme = "light";
console.log("Original theme:", original.user.settings.theme); // "dark"
console.log("Cloned theme:", cloned.user.settings.theme); // "light"

// Extract only needed fields for API response
const fullUser = {
  id: 1,
  name: "Jane Doe",
  email: "jane@example.com",
  password: "secret123",
  internalId: "xyz",
  createdAt: new Date(),
};

const publicUser = omit(fullUser, ["password", "internalId"]);
console.log("\nPublic user data:", publicUser);

const userPreview = pick(fullUser, ["id", "name", "email"]);
console.log("User preview:", userPreview);

console.log("\n=== Async Utils Examples ===\n");

// Simulated API call with retry logic
async function unreliableApiCall() {
  const random = Math.random();
  if (random < 0.6) {
    throw new Error("Network timeout");
  }
  return { success: true, data: "API Response" };
}

console.log("Attempting API call with retry...");
try {
  const result = await retry(unreliableApiCall, {
    maxAttempts: 3,
    delayMs: 100,
  });
  console.log("✓ Success:", result);
} catch (error) {
  console.log("✗ Failed after retries:", (error as Error).message);
}

// Debounced search (simulated)
console.log("\nDebounced search simulation:");
const search = debounce((query: string) => {
  console.log(`  Searching for: "${query}"`);
}, 200);

// Only the last call will execute
search("h");
search("he");
search("hel");
search("hello");

// Wait for debounce to complete
await delay(300);

console.log("\n✓ Utils examples completed!\n");
