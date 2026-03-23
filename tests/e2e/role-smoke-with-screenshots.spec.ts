import { expect, test, type Browser, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";

const agencyState = process.env.PLAYWRIGHT_AGENCY_STATE || "tests/e2e/.auth/agency.json";
const supplierState = process.env.PLAYWRIGHT_SUPPLIER_STATE || "tests/e2e/.auth/supplier.json";
const consultantState = process.env.PLAYWRIGHT_CONSULTANT_STATE || "tests/e2e/.auth/cost-consultant.json";

function ensureStateFiles() {
  const missing = [agencyState, supplierState, consultantState].filter((p) => !fs.existsSync(p));
  test.skip(missing.length > 0, `Missing auth state files: ${missing.join(", ")}`);
}

async function snap(page: Page, testInfo: TestInfo, label: string) {
  const safe = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  await page.screenshot({
    path: testInfo.outputPath(`${Date.now()}-${safe}.png`),
    fullPage: true,
  });
}

test.describe.serial("Role Smoke E2E with Success Screenshots", () => {
  test("agency can view RFQ list and open details", async ({ browser }, testInfo) => {
    ensureStateFiles();
    const context = await browser.newContext({ storageState: agencyState });
    const page = await context.newPage();
    try {
      await page.goto("/rfqs");
      await expect(page.getByRole("heading", { name: "RFQs" })).toBeVisible();
      await snap(page, testInfo, "agency-rfqs-list");

      const details = page.getByRole("link", { name: "View Details" }).first();
      await expect(details).toBeVisible();
      await details.click();
      await expect(page).toHaveURL(/\/rfqs\/[0-9a-f-]{36}$/);
      await snap(page, testInfo, "agency-rfq-details");
    } finally {
      await context.close();
    }
  });

  test("supplier can view received RFQs page", async ({ browser }, testInfo) => {
    ensureStateFiles();
    const context = await browser.newContext({ storageState: supplierState });
    const page = await context.newPage();
    try {
      await page.goto("/rfqs/received");
      if (page.url().includes("/organization")) {
        await expect(page.getByRole("heading", { name: "Organization Overview" })).toBeVisible();
        await snap(page, testInfo, "supplier-redirected-to-organization");
        test.skip(true, "Supplier auth state is not mapped to a supplier profile/role in this environment.");
        return;
      }
      await expect(page.getByRole("heading", { name: "Received RFQs" })).toBeVisible();
      await snap(page, testInfo, "supplier-received-rfqs");

      const firstCard = page.locator("div.rounded-lg.border").first();
      if (await firstCard.isVisible()) {
        await snap(page, testInfo, "supplier-received-rfq-card-visible");
      }
    } finally {
      await context.close();
    }
  });

  test("cost consultant can open performance dashboard", async ({ browser }, testInfo) => {
    ensureStateFiles();
    const context = await browser.newContext({ storageState: consultantState });
    const page = await context.newPage();
    try {
      await page.goto("/organization/performance");
      await expect(page.getByRole("heading", { name: "Supplier Performance & Rankings" })).toBeVisible();
      await snap(page, testInfo, "cost-consultant-performance-dashboard");
    } finally {
      await context.close();
    }
  });
});
