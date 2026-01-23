import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");
  });

  test("should display login page", async ({ page }) => {
    await expect(page).toHaveTitle(/Admin/);
    await expect(page.locator("h1, h2")).toContainText(/login/i);
  });

  test("should show validation errors for empty form", async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for HTML5 validation or custom error messages
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test("should login with valid credentials", async ({ page }) => {
    // Fill in login form
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "admin123");

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL("**/dashboard", { timeout: 5000 });

    // Verify we're on the dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator("text=/invalid|error/i")).toBeVisible({
      timeout: 3000,
    });
  });
});

test.describe("Dashboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");
  });

  test("should navigate to users page", async ({ page }) => {
    await page.click("text=Users");
    await expect(page).toHaveURL(/users/);
    await expect(page.locator("h1")).toContainText(/users/i);
  });

  test("should navigate to products page", async ({ page }) => {
    await page.click("text=Products");
    await expect(page).toHaveURL(/products/);
    await expect(page.locator("h1")).toContainText(/products/i);
  });

  test("should navigate to orders page", async ({ page }) => {
    await page.click("text=Orders");
    await expect(page).toHaveURL(/orders/);
    await expect(page.locator("h1")).toContainText(/orders/i);
  });

  test("should logout successfully", async ({ page }) => {
    await page.click("text=Logout");
    await expect(page).toHaveURL(/login/);
  });
});

test.describe("Dashboard Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");
  });

  test("should display statistics cards", async ({ page }) => {
    // Check for stat cards
    await expect(page.locator("text=/revenue/i")).toBeVisible();
    await expect(page.locator("text=/orders/i")).toBeVisible();
    await expect(page.locator("text=/users/i")).toBeVisible();
  });

  test("should display recent orders", async ({ page }) => {
    await expect(page.locator("text=/recent orders/i")).toBeVisible();
  });

  test("should be responsive", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("nav")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("nav")).toBeVisible();
  });
});
