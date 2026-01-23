import { test as setup, expect } from "@playwright/test";

const authFile = "tests/e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");

    // Fill in login form
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "admin123");

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for successful login and redirect
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Verify we're authenticated
    await expect(page).toHaveURL(/dashboard/);

    // Save signed-in state to file
    await page.context().storageState({ path: authFile });
});
