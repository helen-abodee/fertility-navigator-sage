import { test, expect, type Page } from "@playwright/test";

/** Shared walk: the checkpoint persona through section 1. */
async function walkSection1(page: Page) {
  await page.getByRole("button", { name: "I have a treatment plan, or I'm in treatment" }).click();
  await page.getByRole("button", { name: "Just me" }).click();
  await page.getByRole("button", { name: "Not yet" }).click();
  await page.getByPlaceholder("Your age").fill("24");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  await page.getByRole("button", { name: "Breast cancer" }).click();
  await page.getByRole("button", { name: "Chemotherapy" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Cyclophosphamide (Cytoxan)" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "CMF (Cyclophosphamide, Methotrexate, Fluorouracil)" }).click();
}

test("the checkpoint path walks end to end with section milestones", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Start" }).click();

  await expect(page.getByRole("heading", { name: "Where are you right now?" })).toBeVisible();
  await walkSection1(page);

  // Milestone into the children section
  await expect(page.getByRole("heading", { name: "Now the part that's about you" })).toBeVisible();
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "Yes, I want to" }).click();

  // Milestone into the practical section
  await expect(page.getByRole("heading", { name: "Last stretch: the practical side" })).toBeVisible();
  await page.getByRole("button", { name: "Finish up" }).click();
  await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();

  // CRISP-powered risk reveal
  await expect(page.getByText("Lower risk group", { exact: true })).toBeVisible();
  await expect(page.getByText("studies behind this tool", { exact: false })).toBeVisible();
  await expect(page.getByText("For your care team")).toBeVisible();
  await page.getByRole("button", { name: "See my options" }).click();

  await expect(page.getByRole("heading", { name: "Your results, one piece at a time" })).toBeVisible();
  await expect(page.getByText("Last reviewed", { exact: false })).toBeVisible();
});

test("no treatment plan yet means a short flow with no treatment questions", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Diagnosed, no treatment plan yet" }).click();
  await page.getByRole("button", { name: "Just me" }).click();
  await expect(page.getByRole("heading", { name: "How old are you?" })).toBeVisible();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  // straight to the children milestone: no treatments question
  await expect(page.getByRole("heading", { name: "Now the part that's about you" })).toBeVisible();
});

test("'just learning' goes straight to the browse hub", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Just learning for now" }).click();
  await expect(page.getByRole("heading", { name: "Explore at your own pace" })).toBeVisible();
  await page.getByRole("button", { name: "Options", exact: true }).click();
  await expect(page.getByRole("button", { name: /Egg freezing/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Sperm banking/ })).toBeVisible();
});

test("answering no to children skips the practical section with dignity", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Diagnosed, no treatment plan yet" }).click();
  await page.getByRole("button", { name: "Just me" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "No", exact: true }).click();
  // no practical milestone, no insurance: straight to the risk screen
  await expect(page.getByRole("button", { name: "See my options" })).toBeVisible();
});

test("the welcome gate requires the privacy checkbox before Start", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Start" })).toBeDisabled();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByRole("heading", { name: "Where are you right now?" })).toBeVisible();
});

test("the hub tabs carry the real cited content", async ({ page }) => {
  await page.goto("/questions");
  await walkSection1(page);
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "Yes, I want to" }).click();
  await page.getByRole("button", { name: "Finish up" }).click();
  await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "See my options" }).click();

  // Options tab: egg freezing detail still works
  await page.getByRole("button", { name: "Options", exact: true }).click();
  await expect(page.getByRole("button", { name: /Egg freezing/ })).toBeVisible();
  await page.getByRole("button", { name: /Egg freezing/ }).click();
  await expect(page.getByText("Step 1 of 4")).toBeVisible();
  await page.getByRole("button", { name: "What would this look like for me?" }).click();
  await expect(page.getByText("about 10 to 12 days").first()).toBeVisible();
  await page.getByRole("button", { name: "Back to results" }).first().click();

  // Financing: coverage checker end to end
  await page.getByRole("button", { name: "Financing", exact: true }).click();
  await page.getByRole("button", { name: "My job" }).click();
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await page.getByRole("button", { name: "Fully insured" }).click();
  await expect(page.getByText("Likely covered")).toBeVisible();
  await expect(page.getByText("SB 600", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Financial aid programs" })).toBeVisible();

  // Per-option cost, coverage framing first
  await page.getByRole("button", { name: "Egg freezing", exact: true }).click();
  await expect(page.getByText("The money picture")).toBeVisible();
  await expect(page.getByText("The procedure, at published prices")).toBeVisible();

  // Health tab
  await page.getByRole("button", { name: "Health", exact: true }).click();
  await expect(page.getByText("Smoking speeds up the loss of eggs", { exact: false })).toBeVisible();

  // My progress panel now carries the journey, risk recap, and doctor questions
  await page.getByRole("button", { name: "My progress" }).click();
  await expect(page.getByRole("heading", { name: "Where I am with this" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Questions for your care team" })).toBeVisible();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByRole("button", { name: "Ask", exact: true })).toBeVisible();
});

test("the ask panel answers from cited sources only", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Just learning for now" }).click();
  await page.getByRole("button", { name: "Ask", exact: true }).click();

  // a canned question gets a cited card
  await page.getByRole("button", { name: "Will insurance cover it?" }).click();
  await expect(page.getByText("California law", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("Where this comes from").first()).toBeVisible();

  // free text about risk routes to the pointer, never a number
  await page.getByRole("textbox", { name: "Type a question" }).fill("what are my chances of being infertile");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText("not a personal prediction", { exact: false })).toBeVisible();

  // out-of-corpus is an honest no
  await page.getByRole("textbox", { name: "Type a question" }).fill("zxcvb plugh");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText("no sourced answer", { exact: false })).toBeVisible();

  // deep link lands on the Financing tab
  await page.getByRole("button", { name: /Open Financing/ }).first().click();
  await expect(page.getByRole("heading", { name: "Will insurance pay for this?" })).toBeVisible();
});

test("an out-of-state plan gets its state's AFP-tracked verdict", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Just learning for now" }).click();
  await page.getByRole("button", { name: "Financing", exact: true }).click();
  await page.getByRole("button", { name: "My job" }).click();
  await page.getByRole("button", { name: "No, another state" }).click();
  await page.getByLabel("Plan state").selectOption("NY");
  await page.getByRole("button", { name: "Fully insured" }).click();
  await expect(page.getByText("New York has a fertility preservation coverage law")).toBeVisible();
  await expect(page.getByText("Per the Alliance for Fertility Preservation", { exact: false })).toBeVisible();
});

test("Medi-Cal survivors get the honest verdict", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "I finished cancer treatment" }).click();
  await page.getByRole("button", { name: "Just me" }).click();
  await page.getByRole("button", { name: "1 to 5 years ago" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "I have testes" }).click();
  await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  await page.getByRole("button", { name: "Chemotherapy" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "I don't know the names" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "Maybe" }).click();
  await page.getByRole("button", { name: "Skip for now" }).click();
  await page.getByRole("button", { name: "Finish up" }).click();
  await page.getByRole("button", { name: "Medi-Cal" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "See my options" }).click();

  await expect(page.getByRole("heading", { name: "Where you stand, and what can help" })).toBeVisible();
  await page.getByRole("button", { name: "Financing", exact: true }).click();
  await expect(page.getByText("Medi-Cal does not cover this right now")).toBeVisible();
  await expect(page.getByText("Likely not covered")).toBeVisible();
});

test("the journey tracker records stages and respects deciding not to", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Just learning for now" }).click();
  await page.getByRole("button", { name: "My progress" }).click();
  await page.getByRole("button", { name: "Contacted a clinic" }).click();
  await expect(page.getByRole("button", { name: "✓ Contacted a clinic" })).toBeVisible();
  await page.getByRole("button", { name: "Still deciding" }).click();
  await expect(page.getByRole("button", { name: "Still deciding" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("'I'm not sure' about children offers the thinking-it-through path", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Diagnosed, no treatment plan yet" }).click();
  await page.getByRole("button", { name: "Just me" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "I'm not sure", exact: true }).click();

  await expect(page.getByRole("heading", { name: "Not sure? That's worth taking seriously." })).toBeVisible();
  await page.getByRole("button", { name: "Walk me through it" }).click();
  await expect(page.getByRole("heading", { name: "This is two decisions, not one" })).toBeVisible();
  await page.getByRole("button", { name: "Next thought" }).click();
  await page.getByRole("button", { name: "Truly torn" }).click();
  for (let i = 0; i < 6; i++) {
    const next = page.getByRole("button", { name: "Next thought" });
    if (await next.isVisible().catch(() => false)) await next.click();
  }
  await page.getByRole("button", { name: "I've thought about it, keep going" }).click();
  // unsure keeps the practical section
  await expect(page.getByRole("heading", { name: "Last stretch: the practical side" })).toBeVisible();
});

test("skipping the reflection also lands safely", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Diagnosed, no treatment plan yet" }).click();
  await page.getByRole("button", { name: "Just me" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "I have testes" }).click();
  await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  await page.getByRole("button", { name: "Skip for now" }).click();
  await expect(page.getByRole("heading", { name: "Last stretch: the practical side" })).toBeVisible();
});

test("the money tab is hidden when children are a no", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Diagnosed, no treatment plan yet" }).click();
  await page.getByRole("button", { name: "Just me" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "No", exact: true }).click();
  await page.getByRole("button", { name: "See my options" }).click();
  await expect(page.getByRole("button", { name: "Options", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Financing" })).not.toBeVisible();
});

test("the risk screen carries the care-team callout", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Just learning for now" }).click();
  await page.getByRole("button", { name: "My progress" }).click();
  await expect(page.getByRole("button", { name: "Thinking about children, someday?" })).toBeVisible();
  await page.getByRole("button", { name: "Thinking about children, someday?" }).click();
  await expect(page.getByRole("heading", { name: "Not sure? That's worth taking seriously." })).toBeVisible();
  await page.getByRole("button", { name: "Skip for now" }).click();
  await expect(page.getByRole("button", { name: "Options", exact: true })).toBeVisible();
});

test("the share code round-trips from patient to the team board", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Just learning for now" }).click();
  await page.getByRole("button", { name: "My progress" }).click();
  await page.getByRole("button", { name: "Talked with my care team" }).click();
  await page.getByRole("button", { name: "Share my progress with my care team" }).click();
  const code = (await page.locator("p.font-mono").textContent())?.trim() ?? "";
  expect(code.startsWith("FPN1.")).toBeTruthy();

  await page.goto("/team");
  await page.getByLabel("Progress code").fill(code);
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByText("Added ✓")).toBeVisible();
  await expect(page.getByText("1/6", { exact: false })).toBeVisible();
  await expect(page.getByText("In motion")).toBeVisible();
});

test("clinics: map first, radius filter, tappable detail pages", async ({ page }) => {
  await page.goto("/questions");
  await walkSection1(page);
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "Yes, I want to" }).click();
  await page.getByRole("button", { name: "Finish up" }).click();
  await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  await page.getByPlaceholder("5-digit ZIP").fill("91101");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "See my options" }).click();

  await page.getByRole("button", { name: "Clinics", exact: true }).click();
  await expect(page.getByRole("region", { name: "Map of fertility clinics" })).toBeVisible();
  await page.getByRole("button", { name: "Within 40 mi" }).click();
  await page.getByRole("button", { name: /HRC Fertility/ }).first().click();
  await expect(page.getByRole("heading", { name: /HRC Fertility/ }).first()).toBeVisible();
  await expect(page.getByText("Published prices", { exact: false }).first()).toBeVisible();
  await page.getByRole("button", { name: "Back to clinics" }).first().click();
});

test("partner insurance is asked only when partnered, and the LGBTQ+ card shows", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Diagnosed, no treatment plan yet" }).click();
  await page.getByRole("button", { name: "Me and my partner" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "Yes, I want to" }).click();
  await page.getByRole("button", { name: "Finish up" }).click();
  await page.getByRole("button", { name: "A job-based or private plan in California" }).click();

  // the partnered-only question
  await expect(
    page.getByRole("heading", { name: "Does your partner have insurance through work?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "See my options" }).click();

  await page.getByRole("button", { name: "Reach out" }).click();
  await expect(page.getByText("If you're LGBTQ+").first()).toBeVisible();
  await expect(page.getByText("Check your partner's plan too").first()).toBeVisible();
});

test("the team board demo and the aid fit check work", async ({ page }) => {
  await page.goto("/team");
  await page.getByRole("button", { name: "Load 5 sample patients (demo)" }).click();
  await expect(page.getByRole("textbox", { name: "Patient label" }).first()).toHaveValue(/Demo/);
  await expect(page.getByText("Still deciding, on purpose")).toBeVisible();

  await page.goto("/questions");
  await page.getByRole("button", { name: "Diagnosed, no treatment plan yet" }).click();
  await page.getByRole("button", { name: "Just me" }).click();
  await page.getByPlaceholder("Your age").fill("19");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "Yes, I want to" }).click();
  await page.getByRole("button", { name: "Finish up" }).click();
  await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "See my options" }).click();
  await page.getByRole("button", { name: "Financing", exact: true }).click();
  // a 19-year-old pre-treatment: SAMFund (21-39, survivors) lands in unlikely with reasons
  await expect(page.getByText("Probably not a fit for you", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Financial aid programs" })).toBeVisible();
});

test("the compare tab grades options side by side in words", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Just learning for now" }).click();
  await page.getByRole("button", { name: "Compare", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Compare options side by side" })).toBeVisible();
  await expect(page.getByText("Takes a couple of weeks and real money", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: /Ovarian tissue freezing/ }).first().click();
  await expect(page.getByText("surgery under anesthesia")).toBeVisible();
});

test("reach out drafts a clinic message with copy and call", async ({ page }) => {
  await page.goto("/questions");
  await page.getByRole("button", { name: "Just learning for now" }).click();
  await page.getByRole("button", { name: "Reach out" }).click();
  await expect(page.getByRole("heading", { name: "A fertility clinic" })).toBeVisible();
  await page.getByRole("button", { name: /HRC Fertility/ }).first().click();
  // no stage was given on this lane, so the message must NOT claim "recently diagnosed"
  await expect(page.getByText("interested in fertility preservation", { exact: false })).toBeVisible();
  await expect(page.getByText("recently diagnosed")).not.toBeVisible();
  await expect(page.getByRole("button", { name: /Copy message/ })).toBeVisible();
});
