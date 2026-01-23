/**
 * User Service - Realistic Example
 * Shows how to use both libraries together in a service class
 */

import { capitalize, truncate } from "@repo/utils/string";
import { pick, omit } from "@repo/utils/object";
import { delay, retry } from "@repo/utils/async";
import {
  isEmail,
  isPhoneNumber,
  isUrl,
  isUuid,
} from "@repo/validators/format";
import { hasMinLength, isEmpty } from "@repo/validators/string";
import { isInRange } from "@repo/validators/number";
import { isValidDate, isPast } from "@repo/validators/date";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  phone?: string;
  website?: string;
  bio?: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  password: string;
  phone?: string;
  website?: string;
  bio?: string;
}

interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  bio?: string;
  website?: string;
  memberSince: Date;
}

class UserService {
  /**
   * Validate user input before creation
   */
  private validateUserInput(input: CreateUserInput): string[] {
    const errors: string[] = [];

    // Email validation
    if (isEmpty(input.email) || !isEmail(input.email)) {
      errors.push("Valid email is required");
    }

    // Name validation
    if (isEmpty(input.firstName)) {
      errors.push("First name is required");
    }
    if (isEmpty(input.lastName)) {
      errors.push("Last name is required");
    }

    // Age validation
    if (!isInRange(input.age, 13, 120)) {
      errors.push("Age must be between 13 and 120");
    }

    // Password validation
    if (!hasMinLength(input.password, 8)) {
      errors.push("Password must be at least 8 characters");
    }

    // Optional fields
    if (input.phone && !isPhoneNumber(input.phone)) {
      errors.push("Phone number format is invalid");
    }

    if (input.website && !isUrl(input.website)) {
      errors.push("Website URL is invalid");
    }

    return errors;
  }

  /**
   * Create a new user with validation and transformation
   */
  async createUser(input: CreateUserInput): Promise<User | { errors: string[] }> {
    const errors = this.validateUserInput(input);

    if (errors.length > 0) {
      return { errors };
    }

    // Simulate API call with retry
    const saveToDatabase = async (): Promise<User> => {
      await delay(100); // Simulate network delay

      // Generate mock ID
      const id = crypto.randomUUID();

      // Transform names (capitalize)
      const firstName = capitalize(input.firstName.toLowerCase());
      const lastName = capitalize(input.lastName.toLowerCase());

      // Truncate bio if too long
      const bio = input.bio ? truncate(input.bio, 200) : undefined;

      // Simulate password hashing
      const passwordHash = `hashed_${input.password}`;

      return {
        id,
        email: input.email.toLowerCase(),
        firstName,
        lastName,
        age: input.age,
        phone: input.phone,
        website: input.website,
        bio,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    };

    return retry(saveToDatabase, { maxAttempts: 3, delayMs: 50 });
  }

  /**
   * Transform user to public format (hide sensitive data)
   */
  toPublicUser(user: User): PublicUser {
    // Remove sensitive fields
    const safeUser = omit(user, ["passwordHash", "updatedAt"]);

    return {
      ...pick(safeUser, ["id", "email", "firstName", "lastName", "bio", "website"]),
      fullName: `${user.firstName} ${user.lastName}`,
      memberSince: user.createdAt,
    };
  }

  /**
   * Validate and update user
   */
  async updateUser(
    userId: string,
    updates: Partial<CreateUserInput>
  ): Promise<User | { errors: string[] }> {
    const errors: string[] = [];

    // Validate ID
    if (!isUuid(userId)) {
      errors.push("Invalid user ID format");
    }

    // Validate updates if present
    if (updates.email !== undefined && !isEmail(updates.email)) {
      errors.push("Invalid email format");
    }

    if (updates.age !== undefined && !isInRange(updates.age, 13, 120)) {
      errors.push("Age must be between 13 and 120");
    }

    if (updates.phone !== undefined && !isPhoneNumber(updates.phone)) {
      errors.push("Invalid phone number");
    }

    if (updates.website !== undefined && !isUrl(updates.website)) {
      errors.push("Invalid website URL");
    }

    if (errors.length > 0) {
      return { errors };
    }

    // Simulate database update
    await delay(50);

    // Return mock updated user
    return {
      id: userId,
      email: updates.email || "user@example.com",
      firstName: updates.firstName ? capitalize(updates.firstName) : "John",
      lastName: updates.lastName ? capitalize(updates.lastName) : "Doe",
      age: updates.age || 25,
      phone: updates.phone,
      website: updates.website,
      bio: updates.bio ? truncate(updates.bio, 200) : undefined,
      passwordHash: "hashed_password",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
    };
  }
}

// Demo usage
async function demo() {
  console.log("=== User Service Demo ===\n");

  const service = new UserService();

  // Create a valid user
  console.log("Creating valid user...");
  const validInput: CreateUserInput = {
    email: "john.doe@example.com",
    firstName: "john",
    lastName: "doe",
    age: 28,
    password: "securePassword123",
    phone: "+1-555-123-4567",
    website: "https://johndoe.com",
    bio: "Software developer passionate about clean code and testing.",
  };

  const result = await service.createUser(validInput);

  if ("errors" in result) {
    console.log("  ✗ Validation failed:", result.errors);
  } else {
    console.log("  ✓ User created successfully!");
    console.log("  ID:", result.id);
    console.log("  Name:", `${result.firstName} ${result.lastName}`);
    console.log("  Email:", result.email);

    // Convert to public format
    const publicUser = service.toPublicUser(result);
    console.log("\n  Public user data:");
    console.log("  ", JSON.stringify(publicUser, null, 2));
  }

  // Try creating invalid user
  console.log("\nCreating invalid user...");
  const invalidInput: CreateUserInput = {
    email: "not-an-email",
    firstName: "",
    lastName: "Smith",
    age: 5,
    password: "short",
    phone: "123",
    website: "not-a-url",
  };

  const invalidResult = await service.createUser(invalidInput);

  if ("errors" in invalidResult) {
    console.log("  ✗ Validation failed (as expected):");
    invalidResult.errors.forEach((err) => console.log(`    - ${err}`));
  }

  console.log("\n✓ User service demo completed!\n");
}

demo();
