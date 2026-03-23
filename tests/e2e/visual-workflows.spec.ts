import { expect, test } from "@playwright/test";

function requireAuthState() {
  test.skip(
    !process.env.PLAYWRIGHT_STORAGE_STATE,
    "Set PLAYWRIGHT_STORAGE_STATE to a valid logged-in storage state JSON.",
  );
}

function isRole(role: "agency" | "supplier" | "cost_consultant") {
  return process.env.PLAYWRIGHT_ROLE === role;
}

test.describe("Visible E2E Workflows", () => {
  test("Supplier marketplace NDA flow", async ({ page }) => {
    requireAuthState();
    test.skip(!isRole("supplier"), "This scenario is for supplier role.");

    await page.goto("/rfqs/marketplace");
    await expect(page.getByRole("heading", { name: "RFQ Marketplace" })).toBeVisible();

    const noData = page.getByText("No published RFQs available.");
    if (await noData.isVisible()) {
      test.skip(true, "No published marketplace RFQs available in current dataset.");
      return;
    }

    await page.getByRole("link", { name: "View Teaser" }).first().click();
    await expect(page).toHaveURL(/\/rfqs\/marketplace\/[^/]+$/);
    await expect(page.getByRole("heading", { name: "Teaser Summary" })).toBeVisible();

    const expressInterestButton = page.getByRole("button", { name: "Express Interest" });
    if (await expressInterestButton.isVisible()) {
      await expressInterestButton.click();
      await page.waitForTimeout(800);
    }

    const acceptNdaButton = page.getByRole("button", { name: "Accept NDA" });
    if (await acceptNdaButton.isVisible()) {
      await acceptNdaButton.click();
      await page.waitForTimeout(800);
    }

    await page.getByRole("link", { name: "Continue to Brief" }).click();

    const briefLocked = page.getByText("Brief Locked");
    if (await briefLocked.isVisible()) {
      await expect(briefLocked).toBeVisible();
    } else {
      await expect(page.getByRole("heading", { name: "Full Brief" })).toBeVisible();
    }
  });

  test("Supplier responds to received RFQ", async ({ page }) => {
    requireAuthState();
    test.skip(!isRole("supplier"), "This scenario is for supplier role.");

    await page.goto("/rfqs/received");
    await expect(page.getByRole("heading", { name: "Received RFQs" })).toBeVisible();

    const respondLink = page.getByRole("link", { name: "Submit Quotation" }).first();
    if (!(await respondLink.isVisible())) {
      test.skip(true, "No received invites available to respond to.");
      return;
    }

    await respondLink.click();
    await expect(page.getByRole("heading", { name: "Respond to RFQ" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Submit Proposal" })).toBeVisible();
  });

  test("Agency evaluation and cost estimate screens", async ({ page }) => {
    requireAuthState();
    test.skip(!isRole("agency"), "This scenario is for agency role.");

    await page.goto("/rfqs");
    await expect(page.getByRole("heading", { name: "RFQs" })).toBeVisible();

    const viewDetails = page.getByRole("link", { name: "View Details" }).first();
    if (!(await viewDetails.isVisible())) {
      test.skip(true, "No RFQs available.");
      return;
    }

    await viewDetails.click();
    await expect(page).toHaveURL(/\/rfqs\/[^/]+$/);
    await expect(page.getByRole("link", { name: "Back to RFQs" })).toBeVisible();

    const evaluationLink = page.getByRole("link", { name: "Evaluation" });
    if (await evaluationLink.isVisible()) {
      await evaluationLink.click();
      await expect(page.getByText(/^Evaluation:/)).toBeVisible();
    }

    await page.goto("/rfqs");
    await page.getByRole("link", { name: "View Details" }).first().click();
    const costEstimateLink = page.getByRole("link", { name: "Cost Estimate" });
    if (await costEstimateLink.isVisible()) {
      await costEstimateLink.click();
      await expect(page.getByText(/^Cost Estimates:/)).toBeVisible();
    }
  });

  test("Cost consultant performance and RFQ screens", async ({ page }) => {
    requireAuthState();
    test.skip(!isRole("cost_consultant"), "This scenario is for cost consultant role.");

    await page.goto("/rfqs");
    await expect(page).toHaveURL(/\/organization$/);

    await page.goto("/organization/performance");
    await expect(
      page.getByRole("heading", { name: "Supplier Performance & Rankings" }),
    ).toBeVisible();
  });
});
