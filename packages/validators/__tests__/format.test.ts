import { describe, it, expect } from "vitest";
import {
  isEmail,
  isUrl,
  isUuid,
  isPhoneNumber,
  isCreditCard,
  isHexColor,
  isIpv4,
  isSlug,
  isJson,
  isBase64,
  isSemver,
} from "../src/format";

describe("format validators", () => {
  describe("isEmail", () => {
    it("validates correct emails", () => {
      expect(isEmail("test@example.com")).toBe(true);
      expect(isEmail("user.name+tag@domain.co")).toBe(true);
    });

    it("rejects invalid emails", () => {
      expect(isEmail("invalid")).toBe(false);
      expect(isEmail("@domain.com")).toBe(false);
      expect(isEmail("user@")).toBe(false);
    });
  });

  describe("isUrl", () => {
    it("validates correct URLs", () => {
      expect(isUrl("https://example.com")).toBe(true);
      expect(isUrl("http://sub.domain.com/path?query=1")).toBe(true);
    });

    it("rejects invalid URLs", () => {
      expect(isUrl("not a url")).toBe(false);
      expect(isUrl("ftp://example.com")).toBe(false);
    });
  });

  describe("isUuid", () => {
    it("validates correct UUIDs", () => {
      expect(isUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
      expect(isUuid("6ba7b810-9dad-41d7-80b4-00c04fd430c8")).toBe(true);
    });

    it("rejects invalid UUIDs", () => {
      expect(isUuid("not-a-uuid")).toBe(false);
      expect(isUuid("550e8400-e29b-51d4-a716-446655440000")).toBe(false); // wrong version
    });
  });

  describe("isPhoneNumber", () => {
    it("validates correct phone numbers", () => {
      expect(isPhoneNumber("+1234567890")).toBe(true);
      expect(isPhoneNumber("123-456-7890")).toBe(true);
      expect(isPhoneNumber("(123) 456-7890")).toBe(true);
    });

    it("rejects invalid phone numbers", () => {
      expect(isPhoneNumber("123")).toBe(false);
      expect(isPhoneNumber("not a phone")).toBe(false);
    });
  });

  describe("isCreditCard", () => {
    it("validates correct credit card numbers (Luhn)", () => {
      expect(isCreditCard("4532015112830366")).toBe(true); // Valid test number
      expect(isCreditCard("4111111111111111")).toBe(true); // Visa test
    });

    it("rejects invalid credit card numbers", () => {
      expect(isCreditCard("1234567890123456")).toBe(false);
      expect(isCreditCard("123")).toBe(false);
    });
  });

  describe("isHexColor", () => {
    it("validates correct hex colors", () => {
      expect(isHexColor("#fff")).toBe(true);
      expect(isHexColor("#ffffff")).toBe(true);
      expect(isHexColor("#FF5733")).toBe(true);
      expect(isHexColor("#ff573380")).toBe(true); // with alpha
    });

    it("rejects invalid hex colors", () => {
      expect(isHexColor("fff")).toBe(false);
      expect(isHexColor("#gggggg")).toBe(false);
    });
  });

  describe("isIpv4", () => {
    it("validates correct IPv4 addresses", () => {
      expect(isIpv4("192.168.1.1")).toBe(true);
      expect(isIpv4("0.0.0.0")).toBe(true);
      expect(isIpv4("255.255.255.255")).toBe(true);
    });

    it("rejects invalid IPv4 addresses", () => {
      expect(isIpv4("256.1.1.1")).toBe(false);
      expect(isIpv4("192.168.1")).toBe(false);
      expect(isIpv4("not an ip")).toBe(false);
    });
  });

  describe("isSlug", () => {
    it("validates correct slugs", () => {
      expect(isSlug("hello-world")).toBe(true);
      expect(isSlug("my-post-123")).toBe(true);
      expect(isSlug("single")).toBe(true);
    });

    it("rejects invalid slugs", () => {
      expect(isSlug("Hello-World")).toBe(false);
      expect(isSlug("has spaces")).toBe(false);
      expect(isSlug("-starts-with")).toBe(false);
    });
  });

  describe("isJson", () => {
    it("validates correct JSON", () => {
      expect(isJson('{"key": "value"}')).toBe(true);
      expect(isJson("[1, 2, 3]")).toBe(true);
      expect(isJson('"string"')).toBe(true);
    });

    it("rejects invalid JSON", () => {
      expect(isJson("{invalid}")).toBe(false);
      expect(isJson("not json")).toBe(false);
    });
  });

  describe("isBase64", () => {
    it("validates correct base64", () => {
      expect(isBase64("SGVsbG8gV29ybGQ=")).toBe(true);
      expect(isBase64("dGVzdA==")).toBe(true);
    });

    it("rejects invalid base64", () => {
      expect(isBase64("")).toBe(false);
      expect(isBase64("not base64!")).toBe(false);
    });
  });

  describe("isSemver", () => {
    it("validates correct semver", () => {
      expect(isSemver("1.0.0")).toBe(true);
      expect(isSemver("1.2.3-alpha.1")).toBe(true);
      expect(isSemver("1.0.0+build.123")).toBe(true);
    });

    it("rejects invalid semver", () => {
      expect(isSemver("1.0")).toBe(false);
      expect(isSemver("v1.0.0")).toBe(false);
    });
  });
});
