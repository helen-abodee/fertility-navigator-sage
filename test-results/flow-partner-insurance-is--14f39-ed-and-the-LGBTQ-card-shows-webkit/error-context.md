# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow.spec.ts >> partner insurance is asked only when partnered, and the LGBTQ+ card shows
- Location: e2e/flow.spec.ts:269:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Check your partner\'s plan too')
Expected: visible
Error: strict mode violation: getByText('Check your partner\'s plan too') resolved to 2 elements:
    1) <span class="font-heading text-xl font-semibold">Check your partner's plan too</span> aka locator('span').filter({ hasText: 'Check your partner\'s plan too' })
    2) <h2 class="text-lg">Check your partner's plan too</h2> aka locator('h2').filter({ hasText: 'Check your partner\'s plan too' })

Call log:
  - Expect "toBeVisible" getByText('Check your partner\'s plan too') with timeout 5000ms
  - waiting for getByText('Check your partner\'s plan too')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]
  - alert [ref=e11]
  - main [ref=e12]:
    - generic [ref=e13]:
      - heading "Your results, one piece at a time" [level=1] [ref=e14]
      - paragraph [ref=e15]: Nothing here expires. Take the tabs in any order.
    - navigation "Result sections" [ref=e16]:
      - generic [ref=e17]:
        - button "Start here (visited)" [ref=e18]:
          - generic [ref=e22]: Start here
          - generic [ref=e23]: (visited)
        - button "Options" [ref=e24]
        - button "Paying for it" [ref=e29]
        - button "Clinics" [ref=e35]
        - button "Health" [ref=e41]
    - generic [ref=e48]:
      - generic [ref=e49]:
        - heading "Will insurance pay for this?" [level=2] [ref=e50]
        - paragraph [ref=e51]: A few taps. No member IDs, ever.
        - generic [ref=e52]:
          - paragraph [ref=e53]: How do you get your insurance?
          - generic [ref=e54]:
            - button "My job" [ref=e55]
            - button "A parent's or partner's job" [ref=e56]
            - button "I bought it, or Covered California" [ref=e57]
            - button "Medi-Cal" [ref=e58]
            - button "Medicare" [ref=e59]
            - button "Military" [ref=e60]
            - button "Federal employee plan" [ref=e61]
            - button "No insurance" [ref=e62]
            - button "I don't know" [ref=e63]
      - generic [ref=e64]:
        - heading "What could an option cost?" [level=2] [ref=e65]
        - paragraph [ref=e66]: Pick one. Coverage comes first; the full prices follow.
        - generic [ref=e67]:
          - button "Egg freezing" [ref=e68]
          - button "Embryo freezing" [ref=e69]
          - button "Ovarian tissue freezing" [ref=e70]
          - button "Ovarian suppression (GnRH agonist)" [ref=e71]
          - button "Ovarian transposition" [ref=e72]
      - group [ref=e73]:
        - generic "If you're LGBTQ+" [ref=e74] [cursor=pointer]:
          - text: If you're LGBTQ+
          - generic [aria-hidden] [ref=e75]: +
      - group [ref=e76]:
        - generic "Your California plan should cover fertility preservation" [ref=e77] [cursor=pointer]:
          - text: Your California plan should cover fertility preservation
          - generic [aria-hidden] [ref=e78]: +
      - group [ref=e79]:
        - generic "Check your partner's plan too" [ref=e80] [cursor=pointer]:
          - text: Check your partner's plan too
          - generic [aria-hidden] [ref=e81]: +
      - generic [ref=e82]:
        - heading "Help paying for it" [level=2] [ref=e83]
        - paragraph [ref=e84]: Many of these programs reimburse you after you pay, so ask each one about timing.
        - generic [ref=e85]:
          - generic [ref=e86]:
            - paragraph [ref=e87]:
              - link "Men Having Babies" [ref=e88]:
                - /url: https://menhavingbabies.org/assistance/
            - paragraph [ref=e89]: Discounted or free fertility and surrogacy services, plus grants, for gay prospective parents. The program runs in two stages.
            - paragraph [ref=e90]: "Who it's for: Gay men and transgender women becoming first-time parents."
            - paragraph [ref=e91]: "Amount: not published"
            - group [ref=e92]:
              - generic "Sources" [ref=e93] [cursor=pointer]
          - generic [ref=e94]:
            - paragraph [ref=e95]:
              - link "Allyson Whitney Foundation" [ref=e96]:
                - /url: https://allysonwhitney.org/grants/
            - paragraph [ref=e97]: Life Interrupted Grants of $500 to $1,500 for young adults with rare cancers. Grants can go toward fertility costs like egg retrieval and sperm banking, as well as rent and medical bills.
            - paragraph [ref=e98]: "Who it's for: US citizen, age 16 to 36, with a rare cancer diagnosis, in active treatment or within 10 months after it. You cannot apply on your own: a facility, such as an oncology social worker, doctor's office, or patient navigator, must request the application for you, and each facility can receive only one award per grant year. Applications open once a year in a spring window, with decisions by about August 1. Awards depend on available funds."
            - paragraph [ref=e99]: "Amount: $500 to $1,500 per grant"
            - group [ref=e100]:
              - generic "Sources" [ref=e101] [cursor=pointer]
          - generic [ref=e102]:
            - paragraph [ref=e103]:
              - link "Chick Mission" [ref=e104]:
                - /url: https://www.thechickmission.org/hope-grants/
            - paragraph [ref=e105]: Hope Grants that cover the costs of one egg freezing cycle before cancer treatment. Medication costs are not included. The grant is paid directly to a fertility clinic in their network, so you do not pay first and wait for repayment.
            - paragraph [ref=e106]: "Who it's for: Female, age 18 to 40, with a cancer diagnosis and a treatment plan that an oncologist says puts fertility at risk, before any chemo or radiation. Available in California, Colorado, Florida, Illinois, Montana, New Jersey, New York, Oklahoma, Pennsylvania, and Texas. Income limits apply (under $150,000 single or $200,000 married). A fertility clinic in their network submits the application for you, before your cycle starts."
            - paragraph [ref=e107]: "Amount: not published"
            - group [ref=e108]:
              - generic "Sources" [ref=e109] [cursor=pointer]
          - generic [ref=e110]:
            - paragraph [ref=e111]:
              - link "Fertility Within Reach" [ref=e112]:
                - /url: https://fertilitywithinreach.org/
            - paragraph [ref=e113]: Education and advocacy for getting fertility treatment and preservation covered, plus the Banking on the Future grant, which has helped young cancer patients pay for the first year of storage.
            - paragraph [ref=e114]: "Who it's for: Their website was not reachable when we checked in November 2026, so current program details could not be confirmed. An oncology social worker can help you check whether the grant is still active before you apply."
            - paragraph [ref=e115]: "Amount: not published"
            - group [ref=e116]:
              - generic "Sources" [ref=e117] [cursor=pointer]
          - generic [ref=e118]:
            - paragraph [ref=e119]:
              - link "Livestrong Fertility" [ref=e120]:
                - /url: https://livestrong.org/how-we-help/livestrong-fertility/
            - paragraph [ref=e121]: Discounted fertility preservation through partner clinics (at least 25 percent off services) plus free fertility medication from a pharmaceutical partner for approved patients. Discounts are applied at the clinic, so you do not pay full price first and wait for repayment.
            - paragraph [ref=e122]: "Who it's for: Lawfully present in the US with a confirmed cancer diagnosis, before treatment. Your oncology team confirms that treatment poses a risk to fertility, you choose a Livestrong partner fertility clinic, and you show that insurance will not cover preservation. Egg and embryo freezing applicants must be uninsured or have limited coverage; sperm banking applicants also have income limits (household income of $101,000 or less if single, $130,000 or less if married)."
            - paragraph [ref=e123]: "Amount: at least 25 percent off partner clinic services, plus free medication for approved patients"
            - group [ref=e124]:
              - generic "Sources" [ref=e125] [cursor=pointer]
          - generic [ref=e126]:
            - paragraph [ref=e127]:
              - link "NMDP (formerly Be The Match)" [ref=e128]:
                - /url: https://www.nmdp.org/patients/transplant-support/financial-support
            - paragraph [ref=e129]: Fertility preservation grants of up to $10,000 for people with sickle cell disease before a transplant. Covers egg retrieval and freezing, semen analysis and freezing, storage fees, and medication.
            - paragraph [ref=e130]: "Who it's for: Diagnosis of sickle cell disease, preparing for a transplant, with household income at or below about 350 percent of the federal poverty level. The application must go in before preservation begins, and a transplant center social worker or NMDP patient navigator applies on your behalf."
            - paragraph [ref=e131]: "Amount: up to $10,000"
            - group [ref=e132]:
              - generic "Sources" [ref=e133] [cursor=pointer]
          - generic [ref=e134]:
            - paragraph [ref=e135]:
              - link "ReUnite Oncofertility" [ref=e136]:
                - /url: https://reuniterx.com/discount-programs/
            - paragraph [ref=e137]: Discounted fertility medication for cancer patients preserving fertility before treatment. The discount can cover up to 100 percent of what you would pay for covered medicines, based on income and clinical need, and is applied when the pharmacy fills the order.
            - paragraph [ref=e138]: "Who it's for: Female patients whose cancer treatment can affect fertility, with no prior chemotherapy, who are paying for the medication themselves without fertility drug coverage. Covered medicines are Follistim AQ cartridge, ganirelix acetate injection, and Pregnyl, with per-cycle limits. You apply online with proof of income, and your oncologist completes a form."
            - paragraph [ref=e139]: "Amount: up to 100 percent off covered medications"
            - group [ref=e140]:
              - generic "Sources" [ref=e141] [cursor=pointer]
          - generic [ref=e142]:
            - paragraph [ref=e143]:
              - link "Team Maggie's Dream" [ref=e144]:
                - /url: https://www.teammaggiesdream.org/grants
            - paragraph [ref=e145]: Fertility assistance grants of up to $2,500 for teens and young adults with cancer, for preservation costs like egg retrieval and sperm banking. Funds are paid directly to the medical provider, not to you.
            - paragraph [ref=e146]: "Who it's for: US citizen, age 15 to 37, receiving cancer treatment, uninsured or denied fertility preservation coverage by your insurance carrier. You mail in an application with proof of financial need and medical treatment, plus a short paragraph about why you are applying. Award size depends on available funds."
            - paragraph [ref=e147]: "Amount: up to $2,500 per grant"
            - group [ref=e148]:
              - generic "Sources" [ref=e149] [cursor=pointer]
          - generic [ref=e150]:
            - paragraph [ref=e151]:
              - link "Verna's Purse (ReproTech)" [ref=e152]:
                - /url: https://reprotech.com/for-customers/reprotech-storage-discount-programs/
            - paragraph [ref=e153]: Reduced rates on long-term storage of eggs, sperm, embryos, ovarian tissue, or testicular tissue through ReproTech, for people with cancer-related fertility needs who would have trouble paying storage fees.
            - paragraph [ref=e154]: "Who it's for: People storing specimens with ReproTech whose fertility is affected by cancer. There are separate applications for egg, sperm, and tissue storage and for embryo storage, and the discount is set case by case. Blood testing for infectious disease is required."
            - paragraph [ref=e155]: "Amount: not published"
            - group [ref=e156]:
              - generic "Sources" [ref=e157] [cursor=pointer]
          - generic [ref=e158]:
            - paragraph [ref=e159]:
              - link "Walgreens Specialty Pharmacy fertility preservation program" [ref=e160]:
                - /url: https://www.walgreens.com/topic/pharmacy/specialty-pharmacy/fertility-preservation.jsp
            - paragraph [ref=e161]: Free fertility medication, donated by Ferring Pharmaceuticals through its Heart Beat program, for women preserving fertility before cancer treatment. Covers up to 2 preservation cycles, and the pharmacy supplies the medication at no cost.
            - paragraph [ref=e162]: "Who it's for: Female, age 43 or younger (over age 40, an AMH blood test result above 0.5 is needed), diagnosed with cancer within the last 12 months, before any treatment that could harm fertility. There are no income requirements. Not available in Massachusetts, New Jersey, or Arkansas. Your care team contacts the pharmacy to enroll you."
            - paragraph [ref=e163]: "Amount: free medication for up to 2 cycles"
            - group [ref=e164]:
              - generic "Sources" [ref=e165] [cursor=pointer]
          - generic [ref=e166]:
            - paragraph [ref=e167]:
              - link "Worth the Wait" [ref=e168]:
                - /url: https://worththewaitcharity.com/
            - paragraph [ref=e169]: Grants of $500 to $2,500 for fertility preservation before cancer treatment (Emergency Preservation Grants) and for family building after treatment, including frozen embryo transfer, egg, embryo, or semen preservation, storage fees, adoption, and surrogacy. Grants are paid directly to the clinic or agency.
            - paragraph [ref=e170]: "Who it's for: Age 13 to 39 with a cancer diagnosis, not yet a parent, receiving care at a US facility or working with a US agency, with financial hardship shown on an IRS tax form and no fertility insurance coverage. Your oncology provider confirms the treatment is needed because of cancer therapy. Emergency preservation applications are reviewed twice a month; family building grants run in quarterly cycles. Emergency grants must be used within 60 days and family building grants within 120 days."
            - paragraph [ref=e171]: "Amount: $500 to $2,500 per grant"
            - group [ref=e172]:
              - generic "Sources" [ref=e173] [cursor=pointer]
    - button "Continue to Clinics" [ref=e174]:
      - text: Continue to Clinics
      - generic [aria-hidden] [ref=e175]: →
    - generic [ref=e176]:
      - button "Download or print my summary" [ref=e177]
      - paragraph [ref=e178]: The summary is built by your own browser. Nothing is uploaded.
      - button "Start over and erase everything" [ref=e179]
      - paragraph [ref=e180]:
        - text: Last reviewed 2026-10-30.
        - link "All sources" [ref=e181]:
          - /url: /sources
        - text: ·
        - link "Privacy policy" [ref=e182]:
          - /url: /privacy
```

# Test source

```ts
  191 |   await page.getByRole("button", { name: "I've thought about it, keep going" }).click();
  192 |   // unsure keeps the practical section
  193 |   await expect(page.getByRole("heading", { name: "Last stretch: the practical side" })).toBeVisible();
  194 | });
  195 | 
  196 | test("skipping the reflection also lands safely", async ({ page }) => {
  197 |   await page.goto("/questions");
  198 |   await page.getByRole("button", { name: "Diagnosed, no treatment plan yet" }).click();
  199 |   await page.getByRole("button", { name: "Just me" }).click();
  200 |   await page.getByRole("button", { name: "Skip this question" }).click();
  201 |   await page.getByRole("button", { name: "I have testes" }).click();
  202 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  203 |   await page.getByRole("button", { name: "Keep going" }).click();
  204 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  205 |   await page.getByRole("button", { name: "Skip for now" }).click();
  206 |   await expect(page.getByRole("heading", { name: "Last stretch: the practical side" })).toBeVisible();
  207 | });
  208 | 
  209 | test("the money tab is hidden when children are a no", async ({ page }) => {
  210 |   await page.goto("/questions");
  211 |   await page.getByRole("button", { name: "Diagnosed, no treatment plan yet" }).click();
  212 |   await page.getByRole("button", { name: "Just me" }).click();
  213 |   await page.getByRole("button", { name: "Skip this question" }).click();
  214 |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  215 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  216 |   await page.getByRole("button", { name: "Keep going" }).click();
  217 |   await page.getByRole("button", { name: "No", exact: true }).click();
  218 |   await page.getByRole("button", { name: "See my options" }).click();
  219 |   await expect(page.getByRole("button", { name: "Start here" })).toBeVisible();
  220 |   await expect(page.getByRole("button", { name: "Paying for it" })).not.toBeVisible();
  221 | });
  222 | 
  223 | test("the risk screen carries the care-team callout", async ({ page }) => {
  224 |   await page.goto("/questions");
  225 |   await page.getByRole("button", { name: "Just learning for now" }).click();
  226 |   await expect(page.getByRole("button", { name: "Thinking about children, someday?" })).toBeVisible();
  227 |   await page.getByRole("button", { name: "Thinking about children, someday?" }).click();
  228 |   await expect(page.getByRole("heading", { name: "Not sure? That's worth taking seriously." })).toBeVisible();
  229 |   await page.getByRole("button", { name: "Skip for now" }).click();
  230 |   await expect(page.getByRole("button", { name: "Start here" })).toBeVisible();
  231 | });
  232 | 
  233 | test("the share code round-trips from patient to the team board", async ({ page }) => {
  234 |   await page.goto("/questions");
  235 |   await page.getByRole("button", { name: "Just learning for now" }).click();
  236 |   await page.getByRole("button", { name: "Talked with my care team" }).click();
  237 |   await page.getByRole("button", { name: "Share my progress with my care team" }).click();
  238 |   const code = (await page.locator("p.font-mono").textContent())?.trim() ?? "";
  239 |   expect(code.startsWith("FPN1.")).toBeTruthy();
  240 | 
  241 |   await page.goto("/team");
  242 |   await page.getByLabel("Progress code").fill(code);
  243 |   await page.getByRole("button", { name: "Add", exact: true }).click();
  244 |   await expect(page.getByText("Added ✓")).toBeVisible();
  245 |   await expect(page.getByText("1/6", { exact: false })).toBeVisible();
  246 |   await expect(page.getByText("In motion")).toBeVisible();
  247 | });
  248 | 
  249 | test("clinic filters narrow by radius and budget, map behind a toggle", async ({ page }) => {
  250 |   await page.goto("/questions");
  251 |   await walkSection1(page);
  252 |   await page.getByRole("button", { name: "Keep going" }).click();
  253 |   await page.getByRole("button", { name: "Yes, I want to" }).click();
  254 |   await page.getByRole("button", { name: "Finish up" }).click();
  255 |   await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  256 |   await page.getByPlaceholder("5-digit ZIP").fill("91101");
  257 |   await page.getByRole("button", { name: "Continue" }).click();
  258 |   await page.getByRole("button", { name: "See my options" }).click();
  259 | 
  260 |   await page.getByRole("button", { name: "Clinics", exact: true }).click();
  261 |   await expect(page.getByRole("button", { name: "Within 15 mi" })).toBeVisible();
  262 |   await page.getByRole("button", { name: "Within 15 mi" }).click();
  263 |   await expect(page.getByRole("button", { name: "Show these on a map" })).toBeVisible();
  264 |   await page.getByRole("button", { name: "Under $2,000" }).click();
  265 |   await page.getByRole("button", { name: "Show these on a map" }).click();
  266 |   await expect(page.getByRole("region", { name: "Map of fertility clinics" })).toBeVisible();
  267 | });
  268 | 
  269 | test("partner insurance is asked only when partnered, and the LGBTQ+ card shows", async ({ page }) => {
  270 |   await page.goto("/questions");
  271 |   await page.getByRole("button", { name: "Diagnosed, no treatment plan yet" }).click();
  272 |   await page.getByRole("button", { name: "Me and my partner" }).click();
  273 |   await page.getByRole("button", { name: "Skip this question" }).click();
  274 |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  275 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  276 |   await page.getByRole("button", { name: "Keep going" }).click();
  277 |   await page.getByRole("button", { name: "Yes, I want to" }).click();
  278 |   await page.getByRole("button", { name: "Finish up" }).click();
  279 |   await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  280 | 
  281 |   // the partnered-only question
  282 |   await expect(
  283 |     page.getByRole("heading", { name: "Does your partner have insurance through work?" }),
  284 |   ).toBeVisible();
  285 |   await page.getByRole("button", { name: "Yes", exact: true }).click();
  286 |   await page.getByRole("button", { name: "Skip this question" }).click();
  287 |   await page.getByRole("button", { name: "See my options" }).click();
  288 | 
  289 |   await page.getByRole("button", { name: "Paying for it", exact: true }).click();
  290 |   await expect(page.getByText("If you're LGBTQ+").first()).toBeVisible();
> 291 |   await expect(page.getByText("Check your partner's plan too")).toBeVisible();
      |                                                                 ^ Error: expect(locator).toBeVisible() failed
  292 | });
  293 | 
```