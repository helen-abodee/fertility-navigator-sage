# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow.spec.ts >> the share code round-trips from patient to the team board
- Location: e2e/flow.spec.ts:369:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('1/6')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('1/6') with timeout 5000ms
  - waiting for getByText('1/6')

```

```yaml
- main:
  - heading "Care team board" [level=1]
  - paragraph: "Patients share a progress code from their \"Where I am with this\" checklist. Paste codes here to see where each person is. Codes contain only checklist stages, a date, and a nickname the patient chose: no answers, no diagnosis, nothing they didn't send. This board lives only in your browser."
  - textbox "Progress code":
    - /placeholder: Paste a code (FPN1....)
  - button "Add"
  - article:
    - textbox "Patient label": Patient 1
    - text: "In motion 1/7 · as of 2026-11-24 Latest: Talked with my care team"
    - button "Remove"
  - paragraph: "Follow-up order: people still deciding float to the top, least recent first. Finished journeys, either outcome, settle to the bottom."
- alert
```

# Test source

```ts
  283 |   await expect(page.getByRole("button", { name: "Health", exact: true })).not.toBeVisible();
  284 | });
  285 | 
  286 | test("the journey tracker records stages and respects deciding not to", async ({ page }) => {
  287 |   await page.goto("/questions");
  288 |   await page.getByRole("button", { name: "Understanding my fertility options" }).click();
  289 |   await page.getByRole("button", { name: "Just learning for now" }).click();
  290 |   await page.getByRole("button", { name: "My progress" }).click();
  291 |   await page.getByRole("button", { name: "Contacted a clinic" }).click();
  292 |   await expect(page.getByRole("button", { name: "✓ Contacted a clinic" })).toBeVisible();
  293 |   await page.getByRole("button", { name: "Still deciding" }).click();
  294 |   await expect(page.getByRole("button", { name: "Still deciding" })).toHaveAttribute(
  295 |     "aria-pressed",
  296 |     "true",
  297 |   );
  298 | });
  299 | 
  300 | test("'I'm not sure' about children offers the thinking-it-through path", async ({ page }) => {
  301 |   await page.goto("/questions");
  302 |   await page.getByRole("button", { name: "Understanding my fertility options" }).click();
  303 |   await page.getByRole("button", { name: "Before treatment starts" }).click();
  304 |   await page.getByRole("button", { name: "Haven't decided yet" }).click();
  305 |   await page.getByRole("button", { name: "Not yet" }).click();
  306 |   await page.getByRole("button", { name: "Skip this question" }).click();
  307 |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  308 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  309 |   await page.getByRole("button", { name: "Keep going" }).click();
  310 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  311 | 
  312 |   await expect(page.getByRole("heading", { name: "Not sure? That's worth taking seriously." })).toBeVisible();
  313 |   await page.getByRole("button", { name: "Walk me through it" }).click();
  314 |   await expect(page.getByRole("heading", { name: /Do I want children someday/ })).toBeVisible();
  315 |   await page.getByRole("button", { name: "Next thought" }).click();
  316 |   await page.getByRole("button", { name: "Truly torn" }).click();
  317 |   for (let i = 0; i < 6; i++) {
  318 |     const next = page.getByRole("button", { name: "Next thought" });
  319 |     if (await next.isVisible().catch(() => false)) await next.click();
  320 |   }
  321 |   await page.getByRole("button", { name: "I've thought about it, keep going" }).click();
  322 |   // unsure keeps the practical section
  323 |   await expect(page.getByRole("heading", { name: "Last stretch: the practical side" })).toBeVisible();
  324 | });
  325 | 
  326 | test("skipping the reflection also lands safely", async ({ page }) => {
  327 |   await page.goto("/questions");
  328 |   await page.getByRole("button", { name: "Understanding my fertility options" }).click();
  329 |   await page.getByRole("button", { name: "Before treatment starts" }).click();
  330 |   await page.getByRole("button", { name: "Haven't decided yet" }).click();
  331 |   await page.getByRole("button", { name: "Not yet" }).click();
  332 |   await page.getByRole("button", { name: "Skip this question" }).click();
  333 |   await page.getByRole("button", { name: "I have testes" }).click();
  334 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  335 |   await page.getByRole("button", { name: "Keep going" }).click();
  336 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  337 |   await page.getByRole("button", { name: "Skip for now" }).click();
  338 |   await expect(page.getByRole("heading", { name: "Last stretch: the practical side" })).toBeVisible();
  339 | });
  340 | 
  341 | test("the money tab is hidden when children are a no", async ({ page }) => {
  342 |   await page.goto("/questions");
  343 |   await page.getByRole("button", { name: "Understanding my fertility options" }).click();
  344 |   await page.getByRole("button", { name: "Before treatment starts" }).click();
  345 |   await page.getByRole("button", { name: "Haven't decided yet" }).click();
  346 |   await page.getByRole("button", { name: "Not yet" }).click();
  347 |   await page.getByRole("button", { name: "Skip this question" }).click();
  348 |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  349 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  350 |   await page.getByRole("button", { name: "Keep going" }).click();
  351 |   await page.getByRole("button", { name: "No", exact: true }).click();
  352 |   await page.getByRole("button", { name: "See my options" }).click();
  353 |   await expect(page.getByRole("button", { name: "Options", exact: true })).toBeVisible();
  354 |   await expect(page.getByRole("button", { name: "Financing" })).not.toBeVisible();
  355 | });
  356 | 
  357 | test("the risk screen carries the care-team callout", async ({ page }) => {
  358 |   await page.goto("/questions");
  359 |   await page.getByRole("button", { name: "Understanding my fertility options" }).click();
  360 |   await page.getByRole("button", { name: "Just learning for now" }).click();
  361 |   await page.getByRole("button", { name: "My progress" }).click();
  362 |   await expect(page.getByRole("button", { name: "Thinking about children, someday?" })).toBeVisible();
  363 |   await page.getByRole("button", { name: "Thinking about children, someday?" }).click();
  364 |   await expect(page.getByRole("heading", { name: "Not sure? That's worth taking seriously." })).toBeVisible();
  365 |   await page.getByRole("button", { name: "Skip for now" }).click();
  366 |   await expect(page.getByRole("button", { name: "Options", exact: true })).toBeVisible();
  367 | });
  368 | 
  369 | test("the share code round-trips from patient to the team board", async ({ page }) => {
  370 |   await page.goto("/questions");
  371 |   await page.getByRole("button", { name: "Understanding my fertility options" }).click();
  372 |   await page.getByRole("button", { name: "Just learning for now" }).click();
  373 |   await page.getByRole("button", { name: "My progress" }).click();
  374 |   await page.getByRole("button", { name: "Talked with my care team" }).click();
  375 |   await page.getByRole("button", { name: "Share my progress with my care team" }).click();
  376 |   const code = (await page.locator("p.font-mono").textContent())?.trim() ?? "";
  377 |   expect(code.startsWith("FPN1.")).toBeTruthy();
  378 | 
  379 |   await page.goto("/team");
  380 |   await page.getByLabel("Progress code").fill(code);
  381 |   await page.getByRole("button", { name: "Add", exact: true }).click();
  382 |   await expect(page.getByText("Added ✓")).toBeVisible();
> 383 |   await expect(page.getByText("1/6", { exact: false })).toBeVisible();
      |                                                         ^ Error: expect(locator).toBeVisible() failed
  384 |   await expect(page.getByText("In motion")).toBeVisible();
  385 | });
  386 | 
  387 | test("clinics: map first, radius filter, tappable detail pages", async ({ page }) => {
  388 |   await page.goto("/questions");
  389 |   await page.getByRole("button", { name: "Understanding my fertility options" }).click();
  390 |   await walkSection1(page);
  391 |   await page.getByRole("button", { name: "Keep going" }).click();
  392 |   await page.getByRole("button", { name: "Yes, I want to" }).click();
  393 |   await page.getByRole("button", { name: "Not yet", exact: true }).click();
  394 |   await page.getByRole("button", { name: "Two", exact: true }).click();
  395 |   await page.getByRole("button", { name: "In 1 to 2 years" }).click();
  396 |   await page.getByRole("button", { name: "Finish up" }).click();
  397 |   await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  398 |   await page.getByPlaceholder("5-digit ZIP").fill("91101");
  399 |   await page.getByRole("button", { name: "Continue" }).click();
  400 |   await page.getByRole("button", { name: "See my options" }).click();
  401 | 
  402 |   await page.getByRole("button", { name: "Clinics", exact: true }).click();
  403 |   await expect(page.getByRole("region", { name: "Map of fertility clinics" })).toBeVisible();
  404 |   await page.getByRole("button", { name: "Within 40 mi" }).click();
  405 |   await page.getByRole("button", { name: /HRC Fertility/ }).first().click();
  406 |   await expect(page.getByRole("heading", { name: /HRC Fertility/ }).first()).toBeVisible();
  407 |   await expect(page.getByText("Consult", { exact: true }).last()).toBeVisible();
  408 |   await expect(page.getByText("Aetna", { exact: false }).first()).toBeVisible();
  409 |   await page.getByRole("button", { name: "Back to clinics" }).first().click();
  410 | });
  411 | 
  412 | test("the survey never asks about partners, and the LGBTQ+ guidance still shows", async ({ page }) => {
  413 |   await page.goto("/questions");
  414 |   await page.getByRole("button", { name: "Understanding my fertility options" }).click();
  415 |   await page.getByRole("button", { name: "Before treatment starts" }).click();
  416 |   await page.getByRole("button", { name: "Haven't decided yet" }).click();
  417 |   await page.getByRole("button", { name: "Not yet" }).click();
  418 |   await page.getByRole("button", { name: "Skip this question" }).click();
  419 |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  420 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  421 |   await page.getByRole("button", { name: "Keep going" }).click();
  422 |   await page.getByRole("button", { name: "Yes, I want to" }).click();
  423 |   await page.getByRole("button", { name: "Not yet", exact: true }).click();
  424 |   await page.getByRole("button", { name: "Two", exact: true }).click();
  425 |   await page.getByRole("button", { name: "In 1 to 2 years" }).click();
  426 |   await page.getByRole("button", { name: "Finish up" }).click();
  427 |   await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  428 |   // straight to ZIP: no partner question exists anymore
  429 |   await expect(page.getByRole("heading", { name: /ZIP|area/i })).toBeVisible();
  430 |   await page.getByRole("button", { name: "Skip this question" }).click();
  431 |   await page.getByRole("button", { name: "See my options" }).click();
  432 | 
  433 |   await page.getByRole("button", { name: "Ask", exact: true }).click();
  434 |   await page.getByText("Common questions").click();
  435 |   await expect(page.getByText("If you're LGBTQ+").first()).toBeVisible();
  436 |   await expect(page.getByText("Check your partner's plan too").first()).toBeVisible();
  437 | });
  438 | 
  439 | test("the team board demo and the aid fit check work", async ({ page }) => {
  440 |   await page.goto("/team");
  441 |   await page.getByRole("button", { name: "Load 5 sample patients (demo)" }).click();
  442 |   await expect(page.getByRole("textbox", { name: "Patient label" }).first()).toHaveValue(/Demo/);
  443 |   await expect(page.getByText("Still deciding, on purpose")).toBeVisible();
  444 | 
  445 |   await page.goto("/questions");
  446 |   await page.getByRole("button", { name: "Understanding my fertility options" }).click();
  447 |   await page.getByRole("button", { name: "Before treatment starts" }).click();
  448 |   await page.getByRole("button", { name: "Haven't decided yet" }).click();
  449 |   await page.getByRole("button", { name: "Not yet" }).click();
  450 |   await page.getByPlaceholder("Your age").fill("19");
  451 |   await page.getByRole("button", { name: "Continue" }).click();
  452 |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  453 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  454 |   await page.getByRole("button", { name: "Keep going" }).click();
  455 |   await page.getByRole("button", { name: "Yes, I want to" }).click();
  456 |   await page.getByRole("button", { name: "Not yet", exact: true }).click();
  457 |   await page.getByRole("button", { name: "Two", exact: true }).click();
  458 |   await page.getByRole("button", { name: "In 1 to 2 years" }).click();
  459 |   await page.getByRole("button", { name: "Finish up" }).click();
  460 |   await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  461 |   await page.getByRole("button", { name: "Skip this question" }).click();
  462 |   await page.getByRole("button", { name: "See my options" }).click();
  463 |   await page.getByRole("button", { name: "Financing", exact: true }).click();
  464 |   // a 19-year-old pre-treatment: SAMFund (21-39, survivors) lands in unlikely with reasons
  465 |   await expect(page.getByText("Probably not a fit for you", { exact: false })).toBeVisible();
  466 |   await expect(page.getByRole("heading", { name: "Financial aid programs" })).toBeVisible();
  467 | });
  468 | 
  469 | test("the compare tab grades options side by side in words", async ({ page }) => {
  470 |   await page.goto("/questions");
  471 |   await page.getByRole("button", { name: "Understanding my fertility options" }).click();
  472 |   await page.getByRole("button", { name: "Just learning for now" }).click();
  473 |   await page.getByRole("button", { name: "Compare", exact: true }).click();
  474 |   await expect(page.getByRole("heading", { name: "Compare options side by side" })).toBeVisible();
  475 |   await expect(page.getByText("Takes a couple of weeks and real money", { exact: false })).toBeVisible();
  476 |   await page.getByRole("button", { name: /Ovarian tissue freezing/ }).first().click();
  477 |   await expect(page.getByText("Surgery under anesthesia")).toBeVisible();
  478 | });
  479 | 
  480 | test("reach out drafts a clinic message with copy and call", async ({ page }) => {
  481 |   await page.goto("/questions");
  482 |   await page.getByRole("button", { name: "Understanding my fertility options" }).click();
  483 |   await page.getByRole("button", { name: "Just learning for now" }).click();
```