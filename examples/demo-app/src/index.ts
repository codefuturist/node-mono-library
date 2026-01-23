/**
 * Main Demo
 * Quick overview of both libraries working together
 */

import { capitalize, truncate, toKebabCase } from "@repo/utils/string";
import { unique, chunk } from "@repo/utils/array";
import { pick, deepClone } from "@repo/utils/object";
import { delay } from "@repo/utils/async";

import { isEmail, isUrl } from "@repo/validators/format";
import { hasMinLength, isEmpty } from "@repo/validators/string";
import { isInRange } from "@repo/validators/number";

console.log("╔════════════════════════════════════════════════════╗");
console.log("║  @repo/utils & @repo/validators Demo              ║");
console.log("╚════════════════════════════════════════════════════╝\n");

// Example 1: Processing user input
console.log("📝 Example 1: User Input Processing\n");

const rawInput = {
  name: "   JANE DOE   ",
  email: "jane@example.com",
  bio: "This is a very long bio that should be truncated to avoid overwhelming the UI with too much text",
  tags: ["JavaScript", "TypeScript", "JavaScript", "React", "TypeScript"],
  age: 25,
};

// Clean and validate
const processedUser = {
  name: capitalize(rawInput.name.trim().toLowerCase()),
  slug: toKebabCase(rawInput.name.trim()),
  email: rawInput.email,
  emailValid: isEmail(rawInput.email),
  bio: truncate(rawInput.bio, 50),
  tags: unique(rawInput.tags),
  age: rawInput.age,
  ageValid: isInRange(rawInput.age, 18, 100),
};

console.log("Input:", JSON.stringify(pick(rawInput, ["name", "email", "age"]), null, 2));
console.log("\nProcessed:");
console.log(`  Name: ${processedUser.name} (${processedUser.slug})`);
console.log(`  Email: ${processedUser.email} ${processedUser.emailValid ? "✓" : "✗"}`);
console.log(`  Bio: ${processedUser.bio}`);
console.log(`  Tags: [${processedUser.tags.join(", ")}]`);
console.log(`  Age: ${processedUser.age} ${processedUser.ageValid ? "✓" : "✗"}`);

// Example 2: Form validation
console.log("\n\n📋 Example 2: Contact Form Validation\n");

interface ContactForm {
  name: string;
  email: string;
  website?: string;
  message: string;
}

function validateContactForm(form: ContactForm): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (isEmpty(form.name)) {
    errors.name = "Name is required";
  }

  if (isEmpty(form.email)) {
    errors.email = "Email is required";
  } else if (!isEmail(form.email)) {
    errors.email = "Invalid email format";
  }

  if (form.website && !isEmpty(form.website) && !isUrl(form.website)) {
    errors.website = "Invalid website URL";
  }

  if (!hasMinLength(form.message, 10)) {
    errors.message = "Message must be at least 10 characters";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

const validForm: ContactForm = {
  name: "John Smith",
  email: "john@example.com",
  website: "https://example.com",
  message: "Hello! This is a valid message.",
};

const invalidForm: ContactForm = {
  name: "",
  email: "invalid-email",
  website: "not-a-url",
  message: "short",
};

console.log("Valid form:");
const validResult = validateContactForm(validForm);
console.log(`  Result: ${validResult.valid ? "✓ Valid" : "✗ Invalid"}`);

console.log("\nInvalid form:");
const invalidResult = validateContactForm(invalidForm);
console.log(`  Result: ${invalidResult.valid ? "✓ Valid" : "✗ Invalid"}`);
console.log("  Errors:");
Object.entries(invalidResult.errors).forEach(([field, error]) => {
  console.log(`    ${field}: ${error}`);
});

// Example 3: API data processing
console.log("\n\n🔄 Example 3: API Data Processing\n");

interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  metadata: {
    lastLogin: Date;
    preferences: Record<string, unknown>;
  };
}

const apiResponse: ApiUser[] = [
  {
    id: 1,
    name: "alice johnson",
    email: "alice@example.com",
    role: "admin",
    metadata: { lastLogin: new Date(), preferences: { theme: "dark" } },
  },
  {
    id: 2,
    name: "bob smith",
    email: "bob@example.com",
    role: "user",
    metadata: { lastLogin: new Date(), preferences: { theme: "light" } },
  },
  {
    id: 3,
    name: "charlie brown",
    email: "charlie@example.com",
    role: "admin",
    metadata: { lastLogin: new Date(), preferences: { theme: "dark" } },
  },
];

// Process: capitalize names, extract public fields, batch process
const processedUsers = apiResponse.map((user) => {
  const nameParts = user.name.split(" ");
  return {
    ...pick(user, ["id", "email", "role"]),
    firstName: capitalize(nameParts[0]),
    lastName: capitalize(nameParts[1]),
    displayName: nameParts.map(capitalize).join(" "),
  };
});

console.log("Processed users:");
processedUsers.forEach((user) => {
  console.log(`  ${user.displayName} (${user.role}) - ${user.email}`);
});

// Batch processing
const batches = chunk(processedUsers, 2);
console.log(`\nProcessing in ${batches.length} batches of 2:`);
batches.forEach((batch, i) => {
  console.log(`  Batch ${i + 1}: ${batch.map((u) => u.displayName).join(", ")}`);
});

// Example 4: Safe data cloning
console.log("\n\n🔒 Example 4: Safe Data Operations\n");

const originalConfig = {
  app: {
    name: "MyApp",
    settings: {
      theme: "dark",
      notifications: true,
    },
  },
  apiKeys: {
    primary: "secret-key-1",
    secondary: "secret-key-2",
  },
};

// Create independent copy
const userConfig = deepClone(originalConfig);
userConfig.app.settings.theme = "light";

console.log("Original theme:", originalConfig.app.settings.theme);
console.log("User config theme:", userConfig.app.settings.theme);
console.log("✓ Deep clone prevents mutation");

// Simulate async operation
console.log("\n⏳ Simulating async operation...");
await delay(500);
console.log("✓ Operation completed");

console.log("\n╔════════════════════════════════════════════════════╗");
console.log("║  Demo Complete!                                    ║");
console.log("║                                                    ║");
console.log("║  Try:                                              ║");
console.log("║  - pnpm utils      (utility examples)              ║");
console.log("║  - pnpm validate   (validation examples)           ║");
console.log("╚════════════════════════════════════════════════════╝\n");
