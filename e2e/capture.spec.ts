import { test } from "@playwright/test";

/**
 * Screenshot capture for iteration reviews. Not an assertion suite.
 * Run: SHOT_DIR=scratch/shots npx playwright test capture
 */
const OUT = process.env.SHOT_DIR || "scratch/shots";

test("capture iteration screenshots", async ({ page }) => {
  test.setTimeout(120000);

  await page.goto("/");
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/01-welcome.png` });
  await page.getByRole("checkbox").check();
  if (await page.getByRole("button", { name: "Start" }).isDisabled()) {
    await page.getByRole("checkbox").uncheck();
    await page.getByRole("checkbox").check();
  }
  await page.getByRole("button", { name: "Start" }).click();
  await page.screenshot({ path: `${OUT}/02-entry.png` });

  await page.getByRole("button", { name: "I have a treatment plan, or I'm in treatment" }).click();
  await page.getByRole("button", { name: "Thinking it through right now" }).click();
  await page.getByRole("button", { name: "Just me" }).click();
  await page.getByRole("button", { name: "Not yet" }).click();
  await page.getByPlaceholder("Your age").fill("24");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.screenshot({ path: `${OUT}/03-anatomy-icons.png` });
  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  await page.getByRole("button", { name: "Breast cancer" }).click();
  await page.screenshot({ path: `${OUT}/04-treatments-icons.png` });
  await page.getByRole("button", { name: "Chemotherapy" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Cyclophosphamide (Cytoxan)" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "CMF (Cyclophosphamide, Methotrexate, Fluorouracil)" }).click();

  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/05-milestone-2.png` });
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/06-feelings-warm.png` });
  await page.getByRole("button", { name: "Yes, I want to" }).click();
  await page.getByRole("button", { name: "Two", exact: true }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/07-milestone-3.png` });
  await page.getByRole("button", { name: "Finish up" }).click();
  await page.screenshot({ path: `${OUT}/08-insurance-blue.png` });
  await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();

  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/09-risk-reveal.png` });
  await page.getByRole("button", { name: "See my options" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/10-hub-start.png` });

  await page.getByRole("button", { name: "Options", exact: true }).click();
  await page.screenshot({ path: `${OUT}/11-hub-options.png` });

  await page.getByRole("button", { name: "Financing", exact: true }).click();
  await page.getByRole("button", { name: "My job" }).click();
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await page.getByRole("button", { name: "Fully insured" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/12-hub-money.png` });

  await page.getByRole("button", { name: "Clinics", exact: true }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/13-hub-clinics.png` });

  await page.getByRole("button", { name: "My progress" }).click();
  await page.getByRole("heading", { name: "Where I am with this" }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/14-journey.png` });
});
