import { describe, it, expect } from "vitest";
import { isEmail, isValidDate } from "../../../validators/src";
import { capitalize, truncate } from "../../../utils/src/string";

describe("Integration: Validators + Utils", () => {
  it("should validate and format email", () => {
    const email = "test@example.com";
    expect(isEmail(email)).toBe(true);
    expect(capitalize(email)).toBe("Test@example.com");
  });

  it("should validate and truncate long strings", () => {
    const longEmail = "very.long.email.address@example.com";
    expect(isEmail(longEmail)).toBe(true);
    expect(truncate(longEmail, 10)).toBe("very.lo...");
  });

  it("should validate dates and format", () => {
    const date = new Date("2024-01-01");
    expect(isValidDate(date)).toBe(true);
    expect(date.toISOString()).toContain("2024-01-01");
  });
});
