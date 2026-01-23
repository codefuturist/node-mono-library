/**
 * Validation Examples
 * Demonstrates clean usage of @repo/validators library
 */

import { isEmpty, hasMinLength, isAlphanumeric } from "@repo/validators/string";
import { isNumber, isInRange, isPositive } from "@repo/validators/number";
import { hasKeys, isPlainObject } from "@repo/validators/object";
import { isValidDate, isPast, isFuture } from "@repo/validators/date";
import { isEmail, isUrl, isPhoneNumber } from "@repo/validators/format";

console.log("=== Form Validation Examples ===\n");

// User registration form validation
interface RegistrationForm {
  username: string;
  email: string;
  password: string;
  age: number;
  website?: string;
}

function validateRegistration(form: RegistrationForm): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Username validation
  if (isEmpty(form.username)) {
    errors.push("Username is required");
  } else if (!hasMinLength(form.username, 3)) {
    errors.push("Username must be at least 3 characters");
  } else if (!isAlphanumeric(form.username)) {
    errors.push("Username must be alphanumeric");
  }

  // Email validation
  if (isEmpty(form.email)) {
    errors.push("Email is required");
  } else if (!isEmail(form.email)) {
    errors.push("Email format is invalid");
  }

  // Password validation
  if (isEmpty(form.password)) {
    errors.push("Password is required");
  } else if (!hasMinLength(form.password, 8)) {
    errors.push("Password must be at least 8 characters");
  }

  // Age validation
  if (!isNumber(form.age)) {
    errors.push("Age must be a number");
  } else if (!isInRange(form.age, 13, 120)) {
    errors.push("Age must be between 13 and 120");
  }

  // Optional website validation
  if (form.website && !isEmpty(form.website) && !isUrl(form.website)) {
    errors.push("Website URL is invalid");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Test with valid data
console.log("Testing valid registration:");
const validForm: RegistrationForm = {
  username: "john123",
  email: "john@example.com",
  password: "securePass123",
  age: 25,
  website: "https://john.dev",
};

const validResult = validateRegistration(validForm);
console.log(`  Valid: ${validResult.valid}`);
if (!validResult.valid) {
  console.log("  Errors:", validResult.errors);
}

// Test with invalid data
console.log("\nTesting invalid registration:");
const invalidForm: RegistrationForm = {
  username: "jo",
  email: "invalid-email",
  password: "short",
  age: 10,
  website: "not-a-url",
};

const invalidResult = validateRegistration(invalidForm);
console.log(`  Valid: ${invalidResult.valid}`);
console.log("  Errors:");
invalidResult.errors.forEach((err) => console.log(`    - ${err}`));

console.log("\n=== API Request Validation ===\n");

// Validate API request payload
function validateProductRequest(data: unknown): data is {
  name: string;
  price: number;
  category: string;
} {
  if (!isPlainObject(data)) {
    console.log("  ✗ Data is not a plain object");
    return false;
  }

  if (!hasKeys(data, ["name", "price", "category"])) {
    console.log("  ✗ Missing required keys");
    return false;
  }

  const { name, price, category } = data;

  if (isEmpty(name as string)) {
    console.log("  ✗ Product name is required");
    return false;
  }

  if (!isNumber(price) || !isPositive(price)) {
    console.log("  ✗ Price must be a positive number");
    return false;
  }

  if (isEmpty(category as string)) {
    console.log("  ✗ Category is required");
    return false;
  }

  return true;
}

const validProduct = {
  name: "Laptop",
  price: 999,
  category: "Electronics",
};

console.log("Valid product request:");
if (validateProductRequest(validProduct)) {
  console.log("  ✓ Product is valid");
  console.log(`  Processing: ${validProduct.name}`);
}

const invalidProduct = {
  name: "",
  price: -50,
};

console.log("\nInvalid product request:");
validateProductRequest(invalidProduct);

console.log("\n=== Date Validation Examples ===\n");

// Event scheduling validation
function validateEventDate(dateStr: string): {
  valid: boolean;
  message: string;
} {
  const date = new Date(dateStr);

  if (!isValidDate(date)) {
    return { valid: false, message: "Invalid date format" };
  }

  if (isPast(date)) {
    return { valid: false, message: "Event date cannot be in the past" };
  }

  if (!isFuture(date)) {
    return { valid: false, message: "Event date must be in the future" };
  }

  return { valid: true, message: "Event date is valid" };
}

console.log("Event date validation:");
console.log('  "2030-12-25":', validateEventDate("2030-12-25").message);
console.log('  "2020-01-01":', validateEventDate("2020-01-01").message);
console.log('  "invalid":', validateEventDate("invalid").message);

console.log("\n=== Contact Information Validation ===\n");

interface ContactInfo {
  email: string;
  phone: string;
  website?: string;
}

function validateContact(contact: ContactInfo): boolean {
  let valid = true;

  console.log(`Email "${contact.email}": ${isEmail(contact.email) ? "✓" : "✗"}`);
  valid = valid && isEmail(contact.email);

  console.log(
    `Phone "${contact.phone}": ${isPhoneNumber(contact.phone) ? "✓" : "✗"}`
  );
  valid = valid && isPhoneNumber(contact.phone);

  if (contact.website) {
    console.log(
      `Website "${contact.website}": ${isUrl(contact.website) ? "✓" : "✗"}`
    );
    valid = valid && isUrl(contact.website);
  }

  return valid;
}

console.log("Valid contact info:");
validateContact({
  email: "contact@company.com",
  phone: "+1-555-123-4567",
  website: "https://company.com",
});

console.log("\nInvalid contact info:");
validateContact({
  email: "not-an-email",
  phone: "123",
  website: "not-a-url",
});

console.log("\n✓ Validation examples completed!\n");
