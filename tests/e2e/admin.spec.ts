import { test, expect } from "@playwright/test";

/**
 * Tests for authenticated pages
 * These tests use stored auth state from auth.setup.ts
 * No need to login in beforeEach - already authenticated!
 */

test.describe("Dashboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Already authenticated via stored state, just navigate
    await page.goto("/dashboard");
  });

  test("should display dashboard", async ({ page }) => {
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator("text=/dashboard/i").first()).toBeVisible();
  });

  test("should navigate to users page", async ({ page }) => {
    await page.click("text=Users");
    await expect(page).toHaveURL(/users/);
    await expect(page.locator("text=/users/i").first()).toBeVisible();
  });

  test("should navigate to products page", async ({ page }) => {
    await page.click("text=Products");
    await expect(page).toHaveURL(/products/);
    await expect(page.locator("text=/products/i").first()).toBeVisible();
  });

  test("should navigate to orders page", async ({ page }) => {
    await page.click("text=Orders");
    await expect(page).toHaveURL(/orders/);
    await expect(page.locator("text=/orders/i").first()).toBeVisible();
  });

  test("should logout successfully", async ({ page }) => {
    // Click on avatar/dropdown to reveal logout option
    await page.click('[data-slot="card"]').catch(() => { });
    const logoutButton = page.locator("text=/sign out|logout/i");
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/login/);
    } else {
      // Logout might be in a dropdown menu
      await page.click('button:has-text("A")').catch(() => { });
      await page.click("text=/sign out|logout/i");
      await expect(page).toHaveURL(/login/);
    }
  });
});

test.describe("Dashboard Features", () => {
  test.beforeEach(async ({ page }) => {
    // Already authenticated via stored state
    await page.goto("/dashboard");
  });

  test("should display statistics cards", async ({ page }) => {
    await expect(page.locator("text=/revenue|total/i").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("should display recent orders", async ({ page }) => {
    await expect(page.locator("text=/recent|orders/i").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("should be responsive", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("text=/dashboard/i").first()).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("text=/dashboard/i").first()).toBeVisible();
  });
});

