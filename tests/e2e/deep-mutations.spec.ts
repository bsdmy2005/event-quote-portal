import { expect, test, type Browser, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import postgres from "postgres";

loadEnv({ path: ".env.local" });

const agencyState = process.env.PLAYWRIGHT_AGENCY_STATE || "tests/e2e/.auth/agency.json";
const supplierState = process.env.PLAYWRIGHT_SUPPLIER_STATE || "tests/e2e/.auth/supplier.json";
const consultantState = process.env.PLAYWRIGHT_CONSULTANT_STATE || "tests/e2e/.auth/cost-consultant.json";

function ensureStateFiles() {
  const missing = [agencyState, supplierState, consultantState].filter((p) => !fsSync.existsSync(p));
  test.skip(missing.length > 0, `Missing auth state files: ${missing.join(", ")}`);
}

async function snap(page: Page, testInfo: TestInfo, label: string) {
  const safe = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  await page.screenshot({
    path: testInfo.outputPath(`${Date.now()}-${safe}.png`),
    fullPage: true,
  });
}

async function withStepTimeout<T>(label: string, ms: number, action: () => Promise<T>): Promise<T> {
  return Promise.race([
    action(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Step timeout (${ms}ms): ${label}`)), ms)
    ),
  ]);
}

function extractIdFromUrl(url: string, segment: "rfqs" | "cost-estimate"): string {
  const re = segment === "rfqs"
    ? /\/rfqs\/([0-9a-f-]{36})(?:\/|$)/
    : /\/cost-estimate\/([0-9a-f-]{36})(?:\/|$)/;
  const m = url.match(re);
  if (!m) throw new Error(`Could not extract ${segment} id from URL: ${url}`);
  return m[1];
}

function fakePdfPayload(name: string) {
  return {
    name,
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< >>\n%%EOF"),
  };
}

async function fetchSeededBaselineIds() {
  if (!process.env.DATABASE_URL) return null;
  const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
  try {
    const [rfq] = await sql<
      Array<{ id: string }>
    >`select id from rfqs where title like ${"Demo Agency%"} order by created_at desc limit 1`;
    const [submission] = await sql<
      Array<{ id: string }>
    >`select id from rfq_submissions order by created_at desc limit 1`;
    const [estimate] = await sql<
      Array<{ id: string }>
    >`select id from cost_estimates order by created_at desc limit 1`;
    return {
      seededRfqId: rfq?.id ?? null,
      seededSubmissionId: submission?.id ?? null,
      seededCostEstimateId: estimate?.id ?? null,
    };
  } finally {
    await sql.end();
  }
}

async function findRfqIdByTitle(rfqTitle: string): Promise<string | null> {
  if (!process.env.DATABASE_URL) return null;
  const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
  try {
    const [row] = await sql<Array<{ id: string }>>`
      select id from rfqs where title = ${rfqTitle} order by created_at desc limit 1
    `;
    return row?.id ?? null;
  } finally {
    await sql.end();
  }
}

async function waitForRfqIdByTitle(rfqTitle: string, timeoutMs: number): Promise<string | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const id = await findRfqIdByTitle(rfqTitle);
    if (id) return id;
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  return null;
}

async function createAndSendRfq(browser: Browser, testInfo: TestInfo, rfqTitle: string): Promise<string> {
  const context = await browser.newContext({ storageState: agencyState });
  const page = await context.newPage();
  try {
    await withStepTimeout("open rfq/new", 30_000, async () => {
      await page.goto("/rfqs/new");
      await expect(page.locator("h1", { hasText: "Create New RFQ" })).toBeVisible();
    });
    await snap(page, testInfo, "agency-rfq-new");

    await page.getByLabel("RFQ Title *").fill(rfqTitle);
    await page.getByLabel("Client Name *").fill("E2E Client Group");
    await page.getByLabel("Venue/Location").fill("Cape Town ICC");
    await page.getByLabel("Project Scope *").fill(
      "End-to-end event production covering AV, catering, staging, and operations."
    );
    await page.getByLabel("Required Services (comma separated)").fill("AV, Catering, Staging");
    await page.getByLabel("Teaser Summary (for marketplace)").fill("Confidential launch brief");
    await page.getByLabel("Require NDA before full brief access").check();

    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const yyyy = String(tomorrow.getFullYear());
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    await page.locator("#deadline-date-input").fill(`${yyyy}-${mm}-${dd}`);
    await snap(page, testInfo, "agency-rfq-filled");

    await withStepTimeout("submit rfq create", 90_000, async () => {
      await page.getByRole("button", { name: "Create RFQ" }).click();
      try {
        await page.waitForURL(
          (url) => /\/rfqs\/[0-9a-f-]{36}$/.test(url.pathname) || /\/rfqs$/.test(url.pathname),
          { timeout: 20_000 },
        );
      } catch {
        // Continue with DB fallback; some runs create the RFQ without immediate navigation.
      }
    });

    let rfqId: string | null = /\/rfqs\/[0-9a-f-]{36}$/.test(page.url())
      ? extractIdFromUrl(page.url(), "rfqs")
      : null;

    if (!rfqId) {
      const dbRfqId = await waitForRfqIdByTitle(rfqTitle, 45_000);
      if (dbRfqId) {
        rfqId = dbRfqId;
        if (!/\/rfqs\/[0-9a-f-]{36}$/.test(page.url())) {
          await page.goto(`/rfqs/${rfqId}`);
          await page.waitForURL(new RegExp(`/rfqs/${rfqId}$`), { timeout: 30_000 });
        }
      }
    }

    if (!rfqId && /\/rfqs$/.test(page.url())) {
      const rfqCard = page.locator("div.rounded-lg.border").filter({ hasText: rfqTitle }).first();
      await expect(rfqCard).toBeVisible({ timeout: 30_000 });
      await rfqCard.getByRole("link", { name: "View Details" }).click();
      await page.waitForURL(/\/rfqs\/[0-9a-f-]{36}$/);
      rfqId = extractIdFromUrl(page.url(), "rfqs");
    }

    if (!rfqId || !/\/rfqs\/[0-9a-f-]{36}$/.test(page.url())) {
      await snap(page, testInfo, "agency-create-unexpected-url");
      throw new Error(`RFQ create ended on unexpected URL: ${page.url()}`);
    }
    await snap(page, testInfo, "agency-rfq-created");

    await withStepTimeout("open send page", 30_000, async () => {
      await page.getByRole("link", { name: "Send to Suppliers" }).click();
      await page.waitForURL(/\/rfqs\/[0-9a-f-]{36}\/send$/);
      await expect(page.getByRole("heading", { name: "Select Suppliers" })).toBeVisible();
    });
    await page.getByRole("button", { name: "Select All" }).click();
    await snap(page, testInfo, "agency-send-select-all");
    await withStepTimeout("send rfq to suppliers", 120_000, async () => {
      await page.getByRole("button", { name: /Send to \d+ Supplier/ }).click();
      await page.waitForURL(new RegExp(`/rfqs/${rfqId}$`), { timeout: 90_000 });
    });
    await snap(page, testInfo, "agency-rfq-sent");

    return rfqId;
  } finally {
    await context.close();
  }
}

async function submitSupplierProposal(browser: Browser, testInfo: TestInfo, rfqTitle: string) {
  const context = await browser.newContext({ storageState: supplierState });
  const page = await context.newPage();
  try {
    await withStepTimeout("open supplier received", 30_000, async () => {
      await page.goto("/rfqs/received");
      if (page.url().includes("/organization")) {
        throw new Error(
          "Supplier auth state was redirected to /organization. Ensure tests/e2e/.auth/supplier.json is a supplier role account."
        );
      }
      await expect(page.getByRole("heading", { name: "Received RFQs" })).toBeVisible();
    });
    await snap(page, testInfo, "supplier-received");

    const card = page
      .locator("div.rounded-lg.border")
      .filter({ hasText: rfqTitle })
      .first();
    await expect(card).toBeVisible({ timeout: 45_000 });
    await card.getByRole("link", { name: "Submit Quotation" }).click();

    await page.waitForURL(/\/rfqs\/received\/[0-9a-f-]{36}\/respond$/, { timeout: 30_000 });
    await expect(page.getByRole("heading", { name: "Submit Proposal" })).toBeVisible();
    await page.locator("#proposal-file").setInputFiles(fakePdfPayload("proposal.pdf"));
    await page.getByLabel("Notes").fill("Supplier proposal submitted by deep E2E mutation flow.");
    await snap(page, testInfo, "supplier-proposal-filled");

    await withStepTimeout("submit supplier proposal", 120_000, async () => {
      await page.getByRole("button", { name: "Submit Proposal" }).click();
      await page.waitForURL(/\/rfqs\/received$/, { timeout: 90_000 });
    });
    await snap(page, testInfo, "supplier-proposal-submitted");
  } finally {
    await context.close();
  }
}

async function evaluateAwardAndCostEstimate(
  browser: Browser,
  testInfo: TestInfo,
  rfqId: string,
) {
  const context = await browser.newContext({ storageState: agencyState });
  const page = await context.newPage();
  try {
    await withStepTimeout("open evaluation", 30_000, async () => {
      await page.goto(`/rfqs/${rfqId}/evaluation`);
      await expect(page.getByText(/^Evaluation:/)).toBeVisible();
    });
    await snap(page, testInfo, "agency-evaluation-open");

    const firstSubmissionPanel = page.locator("div.border.rounded-lg.p-4").first();
    await expect(firstSubmissionPanel).toBeVisible();
    const idText = await firstSubmissionPanel.locator("text=/Submission ID:/").first().innerText();
    const submissionIdMatch = idText.match(/[0-9a-f-]{36}/i);
    if (!submissionIdMatch) throw new Error(`Submission id not found in text: ${idText}`);
    const submissionId = submissionIdMatch[0];

    const scoreForm = firstSubmissionPanel.locator("form").first();
    await scoreForm.getByLabel("Pricing").fill("8");
    await scoreForm.getByLabel("Concept").fill("7");
    await scoreForm.getByLabel("Compliance").fill("9");
    await scoreForm.getByLabel("Experience").fill("8");
    await scoreForm.getByLabel("Fit").fill("8");
    await scoreForm.getByLabel("Comments").fill("Strong technical and compliance response.");
    await snap(page, testInfo, "agency-score-filled");
    await scoreForm.getByRole("button", { name: "Save Score" }).click();

    const awardForm = page.locator("form").filter({ hasText: "Award Decision" }).first();
    await awardForm.getByLabel("Winner Submission ID").fill(submissionId);
    await awardForm.getByLabel("Contract Value").fill("550000");
    await awardForm.getByLabel("Awarded Budget").fill("500000");
    await awardForm.getByLabel("Reason").fill("Best overall weighted score.");
    await snap(page, testInfo, "agency-award-filled");
    await awardForm.getByRole("button", { name: "Save Award" }).click();

    await page.goto(`/rfqs/${rfqId}/cost-estimate`);
    await expect(page.getByText(/^Cost Estimates:/)).toBeVisible();
    await page.getByLabel("Title").fill(`E2E CE ${Date.now()}`);
    await page.getByLabel("Category").fill("Production");
    await page.getByLabel("Line Description").fill("Main event production package");
    await page.getByLabel("Unit Cost").fill("250000");
    await page.getByLabel("Quantity").fill("1");
    await page.getByLabel("Markup %").fill("12");
    await snap(page, testInfo, "agency-ce-generate-filled");
    await withStepTimeout("generate cost estimate", 90_000, async () => {
      await page.getByRole("button", { name: "Generate Cost Estimate" }).click();
      await page.waitForURL(/\/cost-estimate\/[0-9a-f-]{36}$/, { timeout: 60_000 });
    });
    const ceId = extractIdFromUrl(page.url(), "cost-estimate");
    await snap(page, testInfo, "agency-ce-open");

    await page.getByRole("button", { name: "Save Calculations" }).click();
    await page.getByRole("button", { name: "Publish CE" }).click();
    await page.getByRole("button", { name: "Export PDF" }).click();
    await page.getByRole("button", { name: "Export Client Summary" }).click();
    await snap(page, testInfo, "agency-ce-published-exported");

    return { submissionId, ceId };
  } finally {
    await context.close();
  }
}

test.describe.serial("Deep E2E Mutations", () => {
  test.setTimeout(5 * 60 * 1000);

  test("create RFQ -> submit proposal -> score+award -> generate+publish CE", async ({ browser }, testInfo) => {
    ensureStateFiles();

    const rfqTitle = `E2E Mutation RFQ ${Date.now()}`;
    const baselineSeededIds = await fetchSeededBaselineIds();

    const rfqId = await createAndSendRfq(browser, testInfo, rfqTitle);
    await submitSupplierProposal(browser, testInfo, rfqTitle);
    const { submissionId, ceId } = await evaluateAwardAndCostEstimate(browser, testInfo, rfqId);

    const result = {
      createdAt: new Date().toISOString(),
      rfqTitle,
      createdRfqId: rfqId,
      awardedSubmissionId: submissionId,
      createdCostEstimateId: ceId,
      baselineSeededIds,
      statesUsed: {
        agencyState: path.resolve(agencyState),
        supplierState: path.resolve(supplierState),
        consultantState: path.resolve(consultantState),
      },
    };

    const out = testInfo.outputPath("mutation-result.json");
    await fs.writeFile(out, JSON.stringify(result, null, 2), "utf8");
    console.log(`Mutation result saved: ${out}`);
  });
});
