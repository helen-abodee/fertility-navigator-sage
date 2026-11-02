# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow.spec.ts >> the checkpoint path shows real, cited content
- Location: e2e/flow.spec.ts:73:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Your California plan should cover fertility preservation before treatment')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Your California plan should cover fertility preservation before treatment') with timeout 5000ms
  - waiting for getByText('Your California plan should cover fertility preservation before treatment')

```

```yaml
- alert
- dialog "Egg freezing":
  - button "← Back to results"
  - heading "Egg freezing" [level=1]
  - paragraph: Mature eggs are collected from your ovaries and frozen, unfertilized, for possible use in the future.
  - group: Sources
  - heading "The steps, one swipe at a time" [level=2]
  - paragraph: Step 1 of 4
  - paragraph: Consult and baseline tests
  - paragraph: You meet a fertility doctor (a reproductive endocrinologist). They do a transvaginal ultrasound to look at your ovaries and count growing follicles. Blood tests check hormones related to fertility, including FSH and AMH.
  - paragraph: Step 2 of 4
  - paragraph: Hormone injections
  - paragraph: about 10 to 12 days
  - paragraph: You give yourself hormone shots each day to help a group of eggs mature. During this time you visit the clinic almost every other day for blood tests and ultrasounds.
  - paragraph: Step 3 of 4
  - paragraph: Egg retrieval
  - paragraph: about 20 to 30 minutes
  - paragraph: You get medicine so you sleep through it. The doctor uses an ultrasound wand and a very thin needle, passed through the wall of the vagina, to collect the mature eggs. Most people go home within an hour.
  - paragraph: Step 4 of 4
  - paragraph: Freezing and storage
  - paragraph: The mature eggs are frozen and stored. They can stay frozen for as long as you want. Storage is billed every year.
  - button "Previous step": ←
  - button "Go to step 1"
  - button "Go to step 2"
  - button "Go to step 3"
  - button "Go to step 4"
  - button "Next step": →
  - group: Sources
  - button "Hide my timeline" [expanded]
  - list:
    - listitem:
      - paragraph: First visit and tests
      - paragraph: about 1 to 3 days
    - listitem:
      - paragraph: Hormone shots with check-ins
      - paragraph: about 10 to 12 days
    - listitem:
      - paragraph: Egg retrieval, asleep for it
      - paragraph: one visit
    - listitem:
      - paragraph: Freezing
      - paragraph: one visit
  - paragraph: First visit to freezing is often about 2 to 3 weeks, and it usually does not have to wait for your cycle.
  - group: Sources
  - paragraph: What could this cost you?
  - text: "If you paid the published prices yourself $18,400 to $19,900 Years of storage:"
  - strong: "5"
  - slider "Years of storage": "5"
  - paragraph: "Not included (no published price): Thawing and using your eggs later."
  - paragraph: Your California plan should cover fertility preservation before cancer treatment (SB 600), so your cost may be your plan's usual deductible and copays instead of the prices above. Ask your plan what you would owe, and whether storage is covered and for how long.
  - paragraph: A rough range from published prices, not a quote. Your clinic's prices and your plan's share can differ.
  - group: Sources
  - heading "Good to know" [level=2]
  - paragraph: Not every egg collected will be mature enough to freeze, and frozen eggs do not guarantee a pregnancy later. Results vary from person to person. Storage is billed every year, and there are added costs later if you thaw and use the eggs.
  - group: Sources
  - button "Back to results"
```

# Test source

```ts
  8   | test("the checkpoint path walks end to end on a phone", async ({ page }) => {
  9   |   await page.goto("/");
  10  |   await page.getByRole("checkbox").check();
  11  |   await page.getByRole("button", { name: "Start" }).click();
  12  | 
  13  |   await expect(page.getByRole("heading", { name: "Who is this for?" })).toBeVisible();
  14  |   await page.getByRole("button", { name: "Just me" }).click();
  15  | 
  16  |   await page.getByRole("button", { name: "I haven't started treatment yet" }).click();
  17  | 
  18  |   await expect(page.getByRole("heading", { name: "How old are you?" })).toBeVisible();
  19  |   await page.getByPlaceholder("Your age").fill("24");
  20  |   await page.getByRole("button", { name: "Continue" }).click();
  21  | 
  22  |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  23  | 
  24  |   await expect(page.getByRole("heading", { name: "What is your diagnosis?" })).toBeVisible();
  25  |   await page.getByRole("button", { name: "Breast cancer" }).click();
  26  | 
  27  |   await page.getByRole("button", { name: "Chemotherapy" }).click();
  28  |   await page.getByRole("button", { name: "Continue" }).click();
  29  | 
  30  |   await expect(page.getByRole("heading", { name: "Do you know which chemo medicines?" })).toBeVisible();
  31  |   await page.getByRole("button", { name: "Cyclophosphamide (Cytoxan)" }).click();
  32  |   await page.getByRole("button", { name: "Continue" }).click();
  33  | 
  34  |   await page.getByRole("button", { name: "Yes, I want to" }).click();
  35  | 
  36  |   await page
  37  |     .getByRole("button", { name: "A job-based or private plan in California" })
  38  |     .click();
  39  | 
  40  |   await expect(page.getByRole("heading", { name: "Your ZIP code" })).toBeVisible();
  41  |   await page.getByRole("button", { name: "Skip this question" }).click();
  42  | 
  43  |   // Risk reveal screen comes first
  44  |   await expect(page.getByRole("button", { name: "See my options" })).toBeVisible();
  45  |   await page.getByRole("button", { name: "See my options" }).click();
  46  | 
  47  |   await expect(
  48  |     page.getByRole("heading", { name: "Options that may fit your situation" }),
  49  |   ).toBeVisible();
  50  |   await expect(page.getByText("Last reviewed", { exact: false })).toBeVisible();
  51  | });
  52  | 
  53  | test("back works and the survivor fork asks how long ago", async ({ page }) => {
  54  |   await page.goto("/questions");
  55  |   await page.getByRole("button", { name: "Just me" }).click();
  56  |   await page.getByRole("button", { name: "I finished treatment" }).click();
  57  |   await expect(
  58  |     page.getByRole("heading", { name: "How long ago did you finish cancer treatment?" }),
  59  |   ).toBeVisible();
  60  |   await page.getByRole("button", { name: "← Back" }).click();
  61  |   await expect(page.getByRole("heading", { name: "Where are you with cancer treatment?" })).toBeVisible();
  62  | });
  63  | 
  64  | test("the welcome gate requires the privacy checkbox before Start", async ({ page }) => {
  65  |   await page.goto("/");
  66  |   await expect(page.getByRole("button", { name: "Start" })).toBeDisabled();
  67  |   await expect(page.getByRole("link", { name: "privacy policy" })).toBeVisible();
  68  |   await page.getByRole("checkbox").check();
  69  |   await page.getByRole("button", { name: "Start" }).click();
  70  |   await expect(page.getByRole("heading", { name: "Who is this for?" })).toBeVisible();
  71  | });
  72  | 
  73  | test("the checkpoint path shows real, cited content", async ({ page }) => {
  74  |   await page.goto("/questions");
  75  |   await page.getByRole("button", { name: "Just me" }).click();
  76  |   await page.getByRole("button", { name: "I haven't started treatment yet" }).click();
  77  |   await page.getByPlaceholder("Your age").fill("24");
  78  |   await page.getByRole("button", { name: "Continue" }).click();
  79  |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  80  |   await page.getByRole("button", { name: "Breast cancer" }).click();
  81  |   await page.getByRole("button", { name: "Chemotherapy" }).click();
  82  |   await page.getByRole("button", { name: "Continue" }).click();
  83  |   await page.getByRole("button", { name: "Cyclophosphamide (Cytoxan)" }).click();
  84  |   await page.getByRole("button", { name: "Continue" }).click();
  85  |   await page.getByRole("button", { name: "Yes, I want to" }).click();
  86  |   await page
  87  |     .getByRole("button", { name: "A job-based or private plan in California" })
  88  |     .click();
  89  |   await page.getByRole("button", { name: "Skip this question" }).click();
  90  | 
  91  |   // Dedicated risk screen: group, short text, continue
  92  |   await expect(page.getByText("Lower risk group", { exact: true })).toBeVisible();
  93  |   await expect(page.getByRole("heading", { name: /lower risk group/ })).toBeVisible();
  94  |   await page.getByRole("button", { name: "See my options" }).click();
  95  | 
  96  |   // Options as tappable rows: egg freezing shown, sperm banking hidden
  97  |   await expect(page.getByRole("button", { name: /Egg freezing/ })).toBeVisible();
  98  |   await expect(page.getByText("You collect semen samples", { exact: false })).not.toBeVisible();
  99  | 
  100 |   // Open the detail: swipeable steps, personal timeline, cost estimator
  101 |   await page.getByRole("button", { name: /Egg freezing/ }).click();
  102 |   await expect(page.getByText("Step 1 of 4")).toBeVisible();
  103 |   await page.getByRole("button", { name: "Go to step 2" }).click();
  104 |   await expect(page.getByText("Hormone shots", { exact: false }).first()).toBeVisible();
  105 |   await page.getByRole("button", { name: "What would this look like for me?" }).click();
  106 |   await expect(page.getByText("about 10 to 12 days").first()).toBeVisible();
  107 |   await expect(page.getByText("If you paid the published prices yourself")).toBeVisible();
> 108 |   await expect(page.getByText("Your California plan should cover fertility preservation before treatment", { exact: false })).toBeVisible();
      |                                                                                                                               ^ Error: expect(locator).toBeVisible() failed
  109 |   await page.getByText("Sources", { exact: true }).first().click();
  110 |   await expect(page.getByText("ASCO 2025", { exact: false }).first()).toBeVisible();
  111 |   await page.getByRole("button", { name: "Back to results" }).first().click();
  112 | 
  113 |   // Insurance branch: SB 600 guidance for CA commercial, pre-treatment
  114 |   await expect(
  115 |     page.getByText("Your California plan should cover fertility preservation").first(),
  116 |   ).toBeVisible();
  117 | 
  118 |   // Aid + doctor questions + summary download present
  119 |   await expect(page.getByRole("heading", { name: "Help paying for it" })).toBeVisible();
  120 |   await expect(
  121 |     page.getByRole("heading", { name: "Questions you could ask your care team" }),
  122 |   ).toBeVisible();
  123 |   await expect(page.getByRole("button", { name: "Download or print my summary" })).toBeVisible();
  124 | });
  125 | 
  126 | test("the coverage checker gives a granular verdict with next steps", async ({ page }) => {
  127 |   await page.goto("/questions");
  128 |   await page.getByRole("button", { name: "Just me" }).click();
  129 |   await page.getByRole("button", { name: "I haven't started treatment yet" }).click();
  130 |   await page.getByRole("button", { name: "Skip this question" }).click();
  131 |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  132 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  133 |   await page.getByRole("button", { name: "I'm not sure yet" }).click();
  134 |   await page.getByRole("button", { name: "Continue" }).click();
  135 |   await page.getByRole("button", { name: "Maybe" }).click();
  136 |   await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  137 |   await page.getByRole("button", { name: "Skip this question" }).click();
  138 |   await page.getByRole("button", { name: "See my options" }).click();
  139 | 
  140 |   await expect(page.getByRole("heading", { name: "Will insurance pay for this?" })).toBeVisible();
  141 |   await page.getByRole("button", { name: "My job" }).click();
  142 |   await page.getByRole("button", { name: "Yes", exact: true }).click();
  143 |   await page.getByRole("button", { name: "Fully insured" }).click();
  144 |   await expect(page.getByText("Likely covered")).toBeVisible();
  145 |   await expect(page.getByText("SB 600", { exact: false }).first()).toBeVisible();
  146 |   await expect(page.getByText("magic words", { exact: false })).toBeVisible();
  147 | });
  148 | 
  149 | test("Medi-Cal gets an honest verdict and aid, never false hope", async ({ page }) => {
  150 |   await page.goto("/questions");
  151 |   await page.getByRole("button", { name: "Just me" }).click();
  152 |   await page.getByRole("button", { name: "I finished treatment" }).click();
  153 |   await page.getByRole("button", { name: "1 to 5 years ago" }).click();
  154 |   await page.getByRole("button", { name: "Skip this question" }).click();
  155 |   await page.getByRole("button", { name: "I have testes" }).click();
  156 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  157 |   await page.getByRole("button", { name: "Chemotherapy" }).click();
  158 |   await page.getByRole("button", { name: "Continue" }).click();
  159 |   await page.getByRole("button", { name: "I don't know the names" }).click();
  160 |   await page.getByRole("button", { name: "Continue" }).click();
  161 |   await page.getByRole("button", { name: "Maybe" }).click();
  162 |   await page.getByRole("button", { name: "Medi-Cal" }).click();
  163 |   await page.getByRole("button", { name: "Skip this question" }).click();
  164 |   await page.getByRole("button", { name: "See my options" }).click();
  165 | 
  166 |   // survivor spine + prefilled Medi-Cal verdict
  167 |   await expect(page.getByRole("heading", { name: "Where you stand now, and what can help" })).toBeVisible();
  168 |   await expect(page.getByText("Medi-Cal does not cover this right now")).toBeVisible();
  169 |   await expect(page.getByText("Likely not covered")).toBeVisible();
  170 | });
  171 | 
```