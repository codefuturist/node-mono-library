import { describe, it, expect } from "vitest";
import { hello } from "../src/index.js";

describe("my-project", () => {
  it("should return hello message", () => {
    expect(hello()).toBe("Hello from my-project!");
  });
});
