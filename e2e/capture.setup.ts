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

  await page.getByRole("link", { name: "Start" }).click();
  await page.screenshot({ path: `${OUT}/02-q-who.png` });

  await page.getByRole("button", { name: "Just me" }).click();
  await page.screenshot({ path: `${OUT}/03-q-stage.png` });

  await page.getByRole("button", { name: "I haven't started treatment yet" }).click();
  await page.getByPlaceholder("Your age").fill("24");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.screenshot({ path: `${OUT}/04-q-anatomy.png` });

  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "Chemotherapy" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Yes, I want to" }).click();
  await page
    .getByRole("button", { name: "A plan through a job, or a private plan, based in California" })
    .click();
  await page.getByPlaceholder("5-digit ZIP").fill("91101");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/05-results-top.png` });

  const eggCard = page.locator("section", {
    has: page.getByRole("heading", { name: "Egg freezing" }),
  });
  await eggCard.getByRole("button", { name: "What actually happens, step by step" }).click();
  await eggCard.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/06-egg-steps.png` });

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
