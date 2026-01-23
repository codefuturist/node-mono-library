import { test, expect } from "@playwright/test";

/**
 * Tests for unauthenticated pages (login flow)
 * These tests run WITHOUT stored auth state
 */
test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login page", async ({ page }) => {
    await expect(page).toHaveTitle(/Admin/);
    await expect(page.locator("text=/Admin Login/i")).toBeVisible();
  });

  test("should show validation errors for empty form", async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for HTML5 validation or custom error messages
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test("should login with valid credentials", async ({ page }) => {
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');

    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await expect(page).toHaveURL(/dashboard/);
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=/invalid|error/i")).toBeVisible({
      timeout: 5000,
    });
  });
});
