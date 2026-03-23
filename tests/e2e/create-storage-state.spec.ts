import { test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test("Create logged-in storage state (manual)", async ({ page, context }) => {
  const outPath =
    process.env.PLAYWRIGHT_AUTH_OUT || "tests/e2e/.auth/session.json";
  const absOut = path.resolve(process.cwd(), outPath);

  await page.goto("/sign-in");
  console.log("Please sign in in the opened browser window. Waiting for post-login redirect...");
  await page.waitForURL(
    (url) => !url.pathname.startsWith("/sign-in"),
    { timeout: 10 * 60 * 1000 },
  );
  await page.waitForTimeout(1000);

  fs.mkdirSync(path.dirname(absOut), { recursive: true });
  await context.storageState({ path: absOut });
  console.log(`Saved storage state to: ${absOut}`);
});
