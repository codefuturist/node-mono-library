import { describe, it, expect } from "vitest";
import {
  isValidDate,
  isValidDateString,
  isPast,
  isFuture,
  isToday,
  isBefore,
  isAfter,
  isBetweenDates,
  isWeekend,
  isWeekday,
  isSameDay,
  isLeapYear,
} from "../src/date";

describe("date validators", () => {
  describe("isValidDate", () => {
    it("returns true for valid Date objects", () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date("2024-01-15"))).toBe(true);
    });

    it("returns false for invalid Date objects", () => {
      expect(isValidDate(new Date("invalid"))).toBe(false);
    });

    it("returns false for non-Date values", () => {
      expect(isValidDate("2024-01-15")).toBe(false);
      expect(isValidDate(null)).toBe(false);
    });
  });

  describe("isValidDateString", () => {
    it("returns true for valid date strings", () => {
      expect(isValidDateString("2024-01-15")).toBe(true);
      expect(isValidDateString("January 15, 2024")).toBe(true);
    });

    it("returns false for invalid date strings", () => {
      expect(isValidDateString("not a date")).toBe(false);
    });
  });

  describe("isPast / isFuture", () => {
    it("validates past dates", () => {
      const pastDate = new Date(Date.now() - 86400000);
      expect(isPast(pastDate)).toBe(true);
    });

    it("validates future dates", () => {
      const futureDate = new Date(Date.now() + 86400000);
      expect(isFuture(futureDate)).toBe(true);
    });
  });

  describe("isToday", () => {
    it("returns true for today", () => {
      expect(isToday(new Date())).toBe(true);
    });

    it("returns false for other days", () => {
      const yesterday = new Date(Date.now() - 86400000);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe("isBefore / isAfter", () => {
    it("validates before relationship", () => {
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-15");
      expect(isBefore(date1, date2)).toBe(true);
      expect(isBefore(date2, date1)).toBe(false);
    });

    it("validates after relationship", () => {
      const date1 = new Date("2024-01-15");
      const date2 = new Date("2024-01-01");
      expect(isAfter(date1, date2)).toBe(true);
    });
  });

  describe("isBetweenDates", () => {
    it("returns true when date is in range", () => {
      const date = new Date("2024-01-15");
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-31");
      expect(isBetweenDates(date, start, end)).toBe(true);
    });

    it("returns false when date is outside range", () => {
      const date = new Date("2024-02-15");
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-31");
      expect(isBetweenDates(date, start, end)).toBe(false);
    });
  });

  describe("isWeekend / isWeekday", () => {
    it("validates weekends", () => {
      const saturday = new Date("2024-01-13"); // Saturday
      const sunday = new Date("2024-01-14"); // Sunday
      expect(isWeekend(saturday)).toBe(true);
      expect(isWeekend(sunday)).toBe(true);
    });

    it("validates weekdays", () => {
      const monday = new Date("2024-01-15"); // Monday
      expect(isWeekday(monday)).toBe(true);
      expect(isWeekend(monday)).toBe(false);
    });
  });

  describe("isSameDay", () => {
    it("returns true for same day", () => {
      const date1 = new Date("2024-01-15T10:00:00");
      const date2 = new Date("2024-01-15T22:00:00");
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it("returns false for different days", () => {
      const date1 = new Date("2024-01-15");
      const date2 = new Date("2024-01-16");
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe("isLeapYear", () => {
    it("validates leap years", () => {
      expect(isLeapYear(2024)).toBe(true);
      expect(isLeapYear(2000)).toBe(true);
      expect(isLeapYear(2023)).toBe(false);
      expect(isLeapYear(1900)).toBe(false);
    });
  });
});
