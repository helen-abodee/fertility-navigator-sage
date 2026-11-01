import { test, expect } from "@playwright/test";

/**
 * Checkpoint-2 path: 24 years old, just diagnosed, ovaries, California
 * commercial insurance, single. Walks the whole click-through on a phone
 * viewport and lands on results.
 */
test("the checkpoint path walks end to end on a phone", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Start" }).click();

  await expect(page.getByRole("heading", { name: "Who is this for?" })).toBeVisible();
  await page.getByRole("button", { name: "Just me" }).click();

  await page.getByRole("button", { name: "I haven't started treatment yet" }).click();

  await expect(page.getByRole("heading", { name: "How old are you?" })).toBeVisible();
  await page.getByPlaceholder("Your age").fill("24");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();

  await expect(page.getByRole("heading", { name: "What is your diagnosis?" })).toBeVisible();
  await page.getByRole("button", { name: "Breast cancer" }).click();

  await page.getByRole("button", { name: "Chemotherapy" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Do you know which chemo medicines?" })).toBeVisible();
  await page.getByRole("button", { name: "Cyclophosphamide (Cytoxan)" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Yes, I want to" }).click();

  await page
    .getByRole("button", { name: "A job-based or private plan in California" })
    .click();

  await expect(page.getByRole("heading", { name: "Your ZIP code" })).toBeVisible();
  await page.getByRole("button", { name: "Skip this question" }).click();

  await expect(
    page.getByRole("heading", { name: "Options that may fit your situation" }),
  ).toBeVisible();
  await expect(page.getByText("Last reviewed", { exact: false })).toBeVisible();
});

test("back works and the survivor fork asks how long ago", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Just me" }).click();
  await page.getByRole("button", { name: "I finished treatment" }).click();
  await expect(
    page.getByRole("heading", { name: "How long ago did you finish treatment?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "← Back" }).click();
  await expect(page.getByRole("heading", { name: "Where are you with treatment?" })).toBeVisible();
});

test("the welcome gate requires the privacy checkbox before Start", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Start" })).toBeDisabled();
  await expect(page.getByRole("link", { name: "privacy policy" })).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByRole("heading", { name: "Who is this for?" })).toBeVisible();
});

test("the checkpoint path shows real, cited content", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Just me" }).click();
  await page.getByRole("button", { name: "I haven't started treatment yet" }).click();
  await page.getByPlaceholder("Your age").fill("24");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  await page.getByRole("button", { name: "Breast cancer" }).click();
  await page.getByRole("button", { name: "Chemotherapy" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Cyclophosphamide (Cytoxan)" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Yes, I want to" }).click();
  await page
    .getByRole("button", { name: "A job-based or private plan in California" })
    .click();
  await page.getByRole("button", { name: "Skip this question" }).click();

  // Risk panel leads the results, category from published frameworks
  await expect(page.getByRole("heading", { name: "Will treatment affect your fertility?" })).toBeVisible();
  await expect(page.getByText("Lower risk group", { exact: true })).toBeVisible();

  // Options that fit: egg freezing shown with steps on demand; sperm banking hidden
  await expect(page.getByRole("heading", { name: "Egg freezing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sperm banking" })).not.toBeVisible();
  await page
    .locator("section", { has: page.getByRole("heading", { name: "Egg freezing" }) })
    .getByRole("button", { name: "What actually happens, step by step" })
    .click();
  await expect(page.getByText("Source:", { exact: false }).first()).toBeVisible();

  // Insurance branch: SB 600 guidance for CA commercial, pre-treatment
  await expect(
    page.getByRole("heading", { name: "Your California plan should cover fertility preservation" }),
  ).toBeVisible();

  // Aid + doctor questions + summary download present
  await expect(page.getByRole("heading", { name: "Help paying for it" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Questions you could ask your care team" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Download or print my summary" })).toBeVisible();
});
