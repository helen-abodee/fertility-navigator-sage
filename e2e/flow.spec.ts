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

  // Risk reveal screen comes first
  await expect(page.getByRole("button", { name: "See my options" })).toBeVisible();
  await page.getByRole("button", { name: "See my options" }).click();

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

  // Dedicated risk screen: group, short text, continue
  await expect(page.getByText("Lower risk group", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /lower risk group/ })).toBeVisible();
  await page.getByRole("button", { name: "See my options" }).click();

  // Options as tappable rows: egg freezing shown, sperm banking hidden
  await expect(page.getByRole("button", { name: /Egg freezing/ })).toBeVisible();
  await expect(page.getByText("You collect semen samples", { exact: false })).not.toBeVisible();

  // Open the detail: swipeable steps, personal timeline, cost estimator
  await page.getByRole("button", { name: /Egg freezing/ }).click();
  await expect(page.getByText("Step 1 of 4")).toBeVisible();
  await page.getByRole("button", { name: "Go to step 2" }).click();
  await expect(page.getByText("Hormone shots", { exact: false }).first()).toBeVisible();
  await page.getByRole("button", { name: "What would this look like for me?" }).click();
  await expect(page.getByText("about 10 to 12 days").first()).toBeVisible();
  await expect(page.getByText("If you paid the published prices yourself")).toBeVisible();
  await expect(page.getByText("Your California plan should cover fertility preservation before treatment", { exact: false })).toBeVisible();
  await page.getByText("Sources", { exact: true }).first().click();
  await expect(page.getByText("ASCO 2025", { exact: false }).first()).toBeVisible();
  await page.getByRole("button", { name: "Back to results" }).first().click();

  // Insurance branch: SB 600 guidance for CA commercial, pre-treatment
  await expect(
    page.getByText("Your California plan should cover fertility preservation").first(),
  ).toBeVisible();

  // Aid + doctor questions + summary download present
  await expect(page.getByRole("heading", { name: "Help paying for it" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Questions you could ask your care team" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Download or print my summary" })).toBeVisible();
});

test("the coverage checker gives a granular verdict with next steps", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Just me" }).click();
  await page.getByRole("button", { name: "I haven't started treatment yet" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  await page.getByRole("button", { name: "I'm not sure yet" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Maybe" }).click();
  await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "See my options" }).click();

  await expect(page.getByRole("heading", { name: "Will insurance pay for this?" })).toBeVisible();
  await page.getByRole("button", { name: "My job" }).click();
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await page.getByRole("button", { name: "Fully insured" }).click();
  await expect(page.getByText("Likely covered")).toBeVisible();
  await expect(page.getByText("SB 600", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("magic words", { exact: false })).toBeVisible();
});

test("Medi-Cal gets an honest verdict and aid, never false hope", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Just me" }).click();
  await page.getByRole("button", { name: "I finished treatment" }).click();
  await page.getByRole("button", { name: "1 to 5 years ago" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "I have testes" }).click();
  await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  await page.getByRole("button", { name: "Chemotherapy" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "I don't know the names" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Maybe" }).click();
  await page.getByRole("button", { name: "Medi-Cal" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "See my options" }).click();

  // survivor spine + prefilled Medi-Cal verdict
  await expect(page.getByRole("heading", { name: "Where you stand now, and what can help" })).toBeVisible();
  await expect(page.getByText("Medi-Cal does not cover this right now")).toBeVisible();
  await expect(page.getByText("Likely not covered")).toBeVisible();
});
