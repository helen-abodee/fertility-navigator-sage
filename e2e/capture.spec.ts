import { test } from "@playwright/test";

/**
 * Screenshot capture for iteration reviews. Not an assertion suite.
 * Run: npx playwright test e2e/capture.setup.ts
 * Output: scratch/shots/*.png (gitignored)
 */
const OUT = process.env.SHOT_DIR || "scratch/shots";

test("capture iteration screenshots", async ({ page }) => {
  test.setTimeout(120000);

  await page.goto("/");
  await page.screenshot({ path: `${OUT}/01-welcome.png` });

  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Start" }).click();
  await page.screenshot({ path: `${OUT}/02-q-who.png` });

  await page.getByRole("button", { name: "Just me" }).click();
  await page.screenshot({ path: `${OUT}/03-q-stage.png` });

  await page.getByRole("button", { name: "I haven't started treatment yet" }).click();
  await page.getByPlaceholder("Your age").fill("24");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.screenshot({ path: `${OUT}/04-q-anatomy.png` });

  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  await page.screenshot({ path: `${OUT}/04b-q-diagnosis.png` });
  await page.getByRole("button", { name: "Breast cancer" }).click();
  await page.getByRole("button", { name: "Chemotherapy" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.screenshot({ path: `${OUT}/04c-q-chemo.png` });
  await page.getByRole("button", { name: "Cyclophosphamide (Cytoxan)" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Yes, I want to" }).click();
  await page
    .getByRole("button", { name: "A job-based or private plan in California" })
    .click();
  await page.getByPlaceholder("5-digit ZIP").fill("91101");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/05-results-top.png` });

  await page
    .getByRole("heading", { name: "Will treatment affect your fertility?" })
    .scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/05b-risk.png` });

  await page.getByRole("heading", { name: "Your options" }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/06-option-rows.png` });

  await page.getByRole("button", { name: /Egg freezing/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/06b-egg-detail.png` });
  await page.getByRole("button", { name: "Go to step 2" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/06c-egg-step2.png` });
  await page.getByRole("button", { name: "What would this look like for me?" }).click();
  await page.getByText("If you paid the published prices yourself").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/06d-timeline-cost.png` });
  await page.getByRole("button", { name: "Back to results" }).first().click();
  await page.waitForTimeout(300);

  await page
    .getByRole("heading", { name: "Your California plan should cover fertility preservation" })
    .scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/07-insurance.png` });

  const aid = page.getByRole("heading", { name: "Help paying for it" });
  if (await aid.isVisible().catch(() => false)) {
    await aid.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${OUT}/08-aid.png` });
  }

  const clinics = page.getByRole("heading", { name: "Fertility clinics" });
  if (await clinics.isVisible().catch(() => false)) {
    await clinics.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // map tiles
    await page.screenshot({ path: `${OUT}/09-clinics.png` });
  }

  await page.getByRole("button", { name: "Download or print my summary" }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/10-footer.png` });
});
