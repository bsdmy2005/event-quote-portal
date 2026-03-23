import { expect, test, type Page, type TestInfo } from "@playwright/test";

async function snap(page: Page, testInfo: TestInfo, label: string) {
  const safe = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  await page.screenshot({
    path: testInfo.outputPath(`${Date.now()}-${safe}.png`),
    fullPage: true,
  });
}

test.describe("Public E2E Workflows with Success Screenshots", () => {
  test("home page renders and links to features", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /event procurement/i })).toBeVisible();
    await snap(page, testInfo, "public-home");

    await page.getByRole("link", { name: /features/i }).first().click();
    await expect(page).toHaveURL(/\/features$/);
    await expect(page.getByRole("heading", { name: "Features & Functionality" })).toBeVisible();
    await snap(page, testInfo, "public-features");
  });

test("agencies list page render", async ({ page }, testInfo) => {
    await page.goto("/agencies");
    await expect(page.getByRole("heading", { name: /event agencies/i })).toBeVisible();
    await snap(page, testInfo, "public-agencies-list");

    const noData = page.getByText("No agencies found");
    if (await noData.isVisible()) {
      await snap(page, testInfo, "public-agencies-empty-state");
      test.skip(true, "No agencies available in current dataset.");
      return;
    }

    const anyCard = page.locator("div.group").first();
    await expect(anyCard).toBeVisible();
    await snap(page, testInfo, "public-agencies-list-with-data");
  });

  test("suppliers list page render", async ({ page }, testInfo) => {
    await page.goto("/suppliers");
    await expect(page.getByRole("heading", { name: /event suppliers/i })).toBeVisible();
    await snap(page, testInfo, "public-suppliers-list");

    await snap(page, testInfo, "public-suppliers-list-rendered");
  });

  test("waitlist page renders and role selector works", async ({ page }, testInfo) => {
    await page.goto("/waitlist");
    await expect(page.getByRole("heading", { name: /be first to experience/i })).toBeVisible();
    await snap(page, testInfo, "public-waitlist");

    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: /cost consultant/i }).click();
    await snap(page, testInfo, "public-waitlist-role-selected");
  });
});
