# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow.spec.ts >> clinics: map first, radius filter, tappable detail pages
- Location: e2e/flow.spec.ts:369:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Consult', { exact: true })
Expected: visible
Error: strict mode violation: getByText('Consult', { exact: true }) resolved to 2 elements:
    1) <strong>Consult</strong> aka locator('strong').filter({ hasText: /^Consult$/ })
    2) <span class="text-muted shrink-0">Consult</span> aka getByRole('dialog', { name: 'HRC Fertility' }).getByText('Consult', { exact: true })

Call log:
  - Expect "toBeVisible" getByText('Consult', { exact: true }) with timeout 5000ms
  - waiting for getByText('Consult', { exact: true })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]
  - alert [ref=e11]
  - main [ref=e12]:
    - generic [ref=e13]:
      - heading "Your results, one piece at a time" [level=1] [ref=e14]
      - paragraph [ref=e15]: Nothing here expires. Take the tabs in any order.
    - navigation "Result sections" [ref=e16]:
      - generic [ref=e17]:
        - button "Road (visited)" [ref=e18]:
          - generic [ref=e22]: Road
          - generic [ref=e23]: (visited)
        - button "Options" [ref=e24]
        - button "Financing" [ref=e29]
        - button "Compare" [ref=e35]
        - button "Clinics" [ref=e41]
    - generic [ref=e50]:
      - generic [ref=e51]:
        - heading "Fertility clinics" [level=2] [ref=e52]
        - paragraph [ref=e53]: These clinics appear on resource lists used by cancer-center social workers. Being listed is not an endorsement. Prices shown are only what each clinic publishes itself.
      - region "Map of fertility clinics" [ref=e55]:
        - generic:
          - generic:
            - img:
              - generic:
                - generic [ref=e56] [cursor=pointer]
                - generic [ref=e57] [cursor=pointer]
                - generic [ref=e58] [cursor=pointer]
                - generic [ref=e59] [cursor=pointer]
                - generic [ref=e60] [cursor=pointer]
                - generic [ref=e61] [cursor=pointer]
                - generic [ref=e62] [cursor=pointer]
                - generic [ref=e63] [cursor=pointer]
                - generic [ref=e64] [cursor=pointer]
                - generic [ref=e65] [cursor=pointer]
                - generic [ref=e66] [cursor=pointer]
                - generic [ref=e67] [cursor=pointer]
                - generic [ref=e68] [cursor=pointer]
                - generic [ref=e69] [cursor=pointer]
                - generic [ref=e70] [cursor=pointer]
                - generic [ref=e71] [cursor=pointer]
                - generic [ref=e72] [cursor=pointer]
                - generic [ref=e73] [cursor=pointer]
                - generic [ref=e74] [cursor=pointer]
                - generic [ref=e75] [cursor=pointer]
                - generic [ref=e76] [cursor=pointer]
                - generic [ref=e77] [cursor=pointer]
                - generic [ref=e78] [cursor=pointer]
                - generic [ref=e79] [cursor=pointer]
                - generic [ref=e80] [cursor=pointer]
                - generic [ref=e81] [cursor=pointer]
                - generic [ref=e82] [cursor=pointer]
                - generic [ref=e83] [cursor=pointer]
                - generic [ref=e84] [cursor=pointer]
                - generic [ref=e85] [cursor=pointer]
        - generic:
          - generic [ref=e86]:
            - button "Zoom in" [ref=e87] [cursor=pointer]: +
            - button "Zoom out" [ref=e88] [cursor=pointer]: −
          - generic [ref=e89]:
            - link "Leaflet" [ref=e90] [cursor=pointer]:
              - /url: https://leafletjs.com
            - text: "| ©"
            - link "OpenStreetMap" [ref=e95] [cursor=pointer]:
              - /url: https://www.openstreetmap.org/copyright
            - text: contributors
      - generic [ref=e96]:
        - button "Works with cancer patients" [ref=e97]
        - button "Sperm banking" [ref=e98]
        - button "Ovarian tissue freezing" [ref=e99]
      - generic [ref=e100]:
        - button "Within 15 mi" [ref=e101]
        - button "Within 40 mi" [pressed] [ref=e102]
        - button "Any distance" [ref=e103]
      - generic [ref=e104]:
        - button "HRC Fertility 55 S. Lake Ave, 9th Fl., Pasadena, CA 91101 oncofertility 0 mi" [active] [ref=e105]:
          - generic [ref=e108]:
            - generic [ref=e109]: HRC Fertility
            - generic [ref=e110]: 55 S. Lake Ave, 9th Fl., Pasadena, CA 91101
            - generic [ref=e111]: oncofertility
          - generic [ref=e113]:
            - generic [ref=e114]: 0 mi
            - generic [aria-hidden] [ref=e115]: ›
        - 'button "CARE Fertility 500 E. Colorado Street, Suite #400, Glendale, CA 91205 oncofertility free consult 6 mi" [ref=e116]':
          - generic [ref=e119]:
            - generic [ref=e120]: CARE Fertility
            - generic [ref=e121]: "500 E. Colorado Street, Suite #400, Glendale, CA 91205"
            - generic [ref=e122]:
              - generic [ref=e123]: oncofertility
              - generic [ref=e124]: free consult
          - generic [ref=e125]:
            - generic [ref=e126]: 6 mi
            - generic [aria-hidden] [ref=e127]: ›
        - button "Pacific Reproductive Center 3720 Lomita Blvd, Suite 200, Torrance, CA 90505 oncofertility 7 mi" [ref=e128]:
          - generic [ref=e131]:
            - generic [ref=e132]: Pacific Reproductive Center
            - generic [ref=e133]: 3720 Lomita Blvd, Suite 200, Torrance, CA 90505
            - generic [ref=e134]: oncofertility
          - generic [ref=e136]:
            - generic [ref=e137]: 7 mi
            - generic [aria-hidden] [ref=e138]: ›
        - button "Reproductive Fertility Center 8635 West 3rd Street, Suite 1170W, Los Angeles, CA 90048 oncofertility 15 mi" [ref=e139]:
          - generic [ref=e142]:
            - generic [ref=e143]: Reproductive Fertility Center
            - generic [ref=e144]: 8635 West 3rd Street, Suite 1170W, Los Angeles, CA 90048
            - generic [ref=e145]: oncofertility
          - generic [ref=e147]:
            - generic [ref=e148]: 15 mi
            - generic [aria-hidden] [ref=e149]: ›
        - button "Fertility & Reproductive Health (UCLA Health) 200 UCLA Medical Plaza, Suite 220 & 430, Los Angeles, CA 90095 oncofertility 18 mi" [ref=e150]:
          - generic [ref=e153]:
            - generic [ref=e154]: Fertility & Reproductive Health (UCLA Health)
            - generic [ref=e155]: 200 UCLA Medical Plaza, Suite 220 & 430, Los Angeles, CA 90095
            - generic [ref=e156]: oncofertility
          - generic [ref=e158]:
            - generic [ref=e159]: 18 mi
            - generic [aria-hidden] [ref=e160]: ›
        - 'button "Pinnacle Fertility Los Angeles (formerly California Fertility Partners) 11818 Wilshire Boulevard #300, Los Angeles, CA 90025 oncofertility 20 mi" [ref=e161]':
          - generic [ref=e164]:
            - generic [ref=e165]: Pinnacle Fertility Los Angeles (formerly California Fertility Partners)
            - generic [ref=e166]: "11818 Wilshire Boulevard #300, Los Angeles, CA 90025"
            - generic [ref=e167]: oncofertility
          - generic [ref=e169]:
            - generic [ref=e170]: 20 mi
            - generic [aria-hidden] [ref=e171]: ›
        - button "The Center for Fertility and Gynecology 18370 Burbank Blvd, Ste 301, Tarzana, CA 91356 oncofertility 21 mi" [ref=e172]:
          - generic [ref=e175]:
            - generic [ref=e176]: The Center for Fertility and Gynecology
            - generic [ref=e177]: 18370 Burbank Blvd, Ste 301, Tarzana, CA 91356
            - generic [ref=e178]: oncofertility
          - generic [ref=e180]:
            - generic [ref=e181]: 21 mi
            - generic [aria-hidden] [ref=e182]: ›
        - button "Innovative Fertility Center 3500 N. Sepulveda Blvd. Ste. 130, Manhattan Beach, CA 90266 oncofertility 23 mi" [ref=e183]:
          - generic [ref=e186]:
            - generic [ref=e187]: Innovative Fertility Center
            - generic [ref=e188]: 3500 N. Sepulveda Blvd. Ste. 130, Manhattan Beach, CA 90266
            - generic [ref=e189]: oncofertility
          - generic [ref=e191]:
            - generic [ref=e192]: 23 mi
            - generic [aria-hidden] [ref=e193]: ›
        - button "OC Fertility + OC Biogenix 1401 Avocado Avenue, Suite 403 + 402, Newport Beach, CA 92660 oncofertility 40 mi" [ref=e194]:
          - generic [ref=e197]:
            - generic [ref=e198]: OC Fertility + OC Biogenix
            - generic [ref=e199]: 1401 Avocado Avenue, Suite 403 + 402, Newport Beach, CA 92660
            - generic [ref=e200]: oncofertility
          - generic [ref=e202]:
            - generic [ref=e203]: 40 mi
            - generic [aria-hidden] [ref=e204]: ›
        - button "LF Livestrong Fertility (program of the Livestrong Foundation) Address on their site oncofertility" [ref=e205]:
          - generic [ref=e206]: LF
          - generic [ref=e207]:
            - generic [ref=e208]: Livestrong Fertility (program of the Livestrong Foundation)
            - generic [ref=e209]: Address on their site
            - generic [ref=e210]: oncofertility
          - generic [aria-hidden] [ref=e213]: ›
        - button "S SaveMyFertility Address on their site oncofertility" [ref=e214]:
          - generic [ref=e215]: S
          - generic [ref=e216]:
            - generic [ref=e217]: SaveMyFertility
            - generic [ref=e218]: Address on their site
            - generic [ref=e219]: oncofertility
          - generic [aria-hidden] [ref=e222]: ›
        - button "TO The Oncofertility Consortium (housed at Michigan State University) Address on their site oncofertility" [ref=e223]:
          - generic [ref=e224]: TO
          - generic [ref=e225]:
            - generic [ref=e226]: The Oncofertility Consortium (housed at Michigan State University)
            - generic [ref=e227]: Address on their site
            - generic [ref=e228]: oncofertility
          - generic [aria-hidden] [ref=e231]: ›
        - button "WF Western Fertility Institute Address on their site" [ref=e232]:
          - generic [ref=e233]: WF
          - generic [ref=e234]:
            - generic [ref=e235]: Western Fertility Institute
            - generic [ref=e236]: Address on their site
          - generic [aria-hidden] [ref=e238]: ›
      - paragraph [ref=e239]: Map and thumbnails © OpenStreetMap contributors.
      - dialog "HRC Fertility" [ref=e240]:
        - generic [ref=e241]:
          - button "← Back to clinics" [ref=e242]
          - generic [ref=e248]:
            - heading "HRC Fertility" [level=1] [ref=e249]
            - paragraph [ref=e250]: 0 miles from your ZIP
          - generic [ref=e251]:
            - paragraph [ref=e252]: "\"HRC is one of the largest providers of advanced fertility treatments in the United States. They offer fertility testing and a wide range of reproductive treatments.\""
            - group [ref=e253]:
              - generic "Source" [ref=e254] [cursor=pointer]
          - generic [ref=e256]:
            - generic [ref=e257]:
              - generic [ref=e258]: Consult
              - generic [ref=e259]: Not published
            - generic [ref=e260]:
              - generic [ref=e261]: Insurance
              - generic [ref=e262]: Aetna, Anthem Blue Cross, Blue Shield of California +11 more
            - generic [ref=e263]:
              - generic [ref=e264]: Financing
              - generic [ref=e265]: CapexMD; Future Family
            - generic [ref=e266]:
              - generic [ref=e267]: Services
              - generic [ref=e268]: IVF, IVF with ICSI, IUI +11 more
          - generic [ref=e269]:
            - paragraph [ref=e270]: Locations
            - paragraph [ref=e271]: "Pasadena: 55 S. Lake Ave, 9th Fl., Pasadena, CA 91101"
            - paragraph [ref=e272]: "Beverly Hills: 9777 Wilshire Blvd, Suite 600, Beverly Hills, CA 90212"
            - paragraph [ref=e273]: "Carlsbad: 6183 Paseo Del Norte, Ste 270, Carlsbad, CA 92011"
            - paragraph [ref=e274]: "Encino: 15503 Ventura Blvd #200, Encino, CA 91436"
            - paragraph [ref=e275]: "Fullerton: 1950 Sunnycrest Dr #2400, Fullerton, CA 92835"
            - paragraph [ref=e276]: "Mission Viejo: 27800 Medical Center Rd. Building 1, Suite 308, Mission Viejo, CA 92691"
            - paragraph [ref=e277]: "Newport Beach: 20360 SW Birch Street, Suite #200, Newport Beach, CA 92660"
            - paragraph [ref=e278]: "Rancho Cucamonga: 8112 Milliken Ave. #101, Rancho Cucamonga, CA 91730"
            - paragraph [ref=e279]: "San Diego: 9339 Genesee Ave., #125, San Diego, CA 92121"
            - paragraph [ref=e280]: "Santa Clarita Valley: 26357 McBean Pkwy. Suite 210, Valencia, CA 91355"
            - paragraph [ref=e281]: "West LA: 11500 Olympic Blvd #504, West Los Angeles, CA 90064"
            - paragraph [ref=e282]: "Westlake Village: 1220 La Venta Dr #103, Westlake Village, CA 91361"
          - paragraph [ref=e283]: "Source: the clinic's own site, checked 2026-10-30"
          - generic [ref=e284]:
            - link "Website" [ref=e285] [cursor=pointer]:
              - /url: https://www.havingbabies.com/
            - link "Call 1-866-HRC-4IVF (1-866-472-4483)" [ref=e286] [cursor=pointer]:
              - /url: tel:1866418664724483
          - button "Back to clinics" [ref=e287]
    - generic [ref=e288]:
      - button "Download or print my summary" [ref=e289]
      - paragraph [ref=e290]: The summary is built by your own browser. Nothing is uploaded.
      - button "Start over and erase everything" [ref=e291]
      - paragraph [ref=e292]:
        - text: Last reviewed 2026-10-30.
        - link "All sources" [ref=e293] [cursor=pointer]:
          - /url: /sources
        - text: ·
        - link "Privacy policy" [ref=e294] [cursor=pointer]:
          - /url: /privacy
    - navigation "Quick actions" [ref=e295]:
      - generic [ref=e296]:
        - button "My progress" [ref=e297]
        - button "Reach out" [ref=e302]
        - button "Ask" [ref=e307]
```

# Test source

```ts
  288 |   await page.goto("/questions");
  289 |   await page.getByRole("button", { name: "Before treatment starts" }).click();
  290 |   await page.getByRole("button", { name: "Haven't decided yet" }).click();
  291 |   await page.getByRole("button", { name: "Not yet" }).click();
  292 |   await page.getByRole("button", { name: "Skip this question" }).click();
  293 |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  294 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  295 |   await page.getByRole("button", { name: "Keep going" }).click();
  296 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  297 | 
  298 |   await expect(page.getByRole("heading", { name: "Not sure? That's worth taking seriously." })).toBeVisible();
  299 |   await page.getByRole("button", { name: "Walk me through it" }).click();
  300 |   await expect(page.getByRole("heading", { name: "This is two decisions, not one" })).toBeVisible();
  301 |   await page.getByRole("button", { name: "Next thought" }).click();
  302 |   await page.getByRole("button", { name: "Truly torn" }).click();
  303 |   for (let i = 0; i < 6; i++) {
  304 |     const next = page.getByRole("button", { name: "Next thought" });
  305 |     if (await next.isVisible().catch(() => false)) await next.click();
  306 |   }
  307 |   await page.getByRole("button", { name: "I've thought about it, keep going" }).click();
  308 |   // unsure keeps the practical section
  309 |   await expect(page.getByRole("heading", { name: "Last stretch: the practical side" })).toBeVisible();
  310 | });
  311 | 
  312 | test("skipping the reflection also lands safely", async ({ page }) => {
  313 |   await page.goto("/questions");
  314 |   await page.getByRole("button", { name: "Before treatment starts" }).click();
  315 |   await page.getByRole("button", { name: "Haven't decided yet" }).click();
  316 |   await page.getByRole("button", { name: "Not yet" }).click();
  317 |   await page.getByRole("button", { name: "Skip this question" }).click();
  318 |   await page.getByRole("button", { name: "I have testes" }).click();
  319 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  320 |   await page.getByRole("button", { name: "Keep going" }).click();
  321 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  322 |   await page.getByRole("button", { name: "Skip for now" }).click();
  323 |   await expect(page.getByRole("heading", { name: "Last stretch: the practical side" })).toBeVisible();
  324 | });
  325 | 
  326 | test("the money tab is hidden when children are a no", async ({ page }) => {
  327 |   await page.goto("/questions");
  328 |   await page.getByRole("button", { name: "Before treatment starts" }).click();
  329 |   await page.getByRole("button", { name: "Haven't decided yet" }).click();
  330 |   await page.getByRole("button", { name: "Not yet" }).click();
  331 |   await page.getByRole("button", { name: "Skip this question" }).click();
  332 |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  333 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  334 |   await page.getByRole("button", { name: "Keep going" }).click();
  335 |   await page.getByRole("button", { name: "No", exact: true }).click();
  336 |   await page.getByRole("button", { name: "See my options" }).click();
  337 |   await expect(page.getByRole("button", { name: "Options", exact: true })).toBeVisible();
  338 |   await expect(page.getByRole("button", { name: "Financing" })).not.toBeVisible();
  339 | });
  340 | 
  341 | test("the risk screen carries the care-team callout", async ({ page }) => {
  342 |   await page.goto("/questions");
  343 |   await page.getByRole("button", { name: "Just learning for now" }).click();
  344 |   await page.getByRole("button", { name: "My progress" }).click();
  345 |   await expect(page.getByRole("button", { name: "Thinking about children, someday?" })).toBeVisible();
  346 |   await page.getByRole("button", { name: "Thinking about children, someday?" }).click();
  347 |   await expect(page.getByRole("heading", { name: "Not sure? That's worth taking seriously." })).toBeVisible();
  348 |   await page.getByRole("button", { name: "Skip for now" }).click();
  349 |   await expect(page.getByRole("button", { name: "Options", exact: true })).toBeVisible();
  350 | });
  351 | 
  352 | test("the share code round-trips from patient to the team board", async ({ page }) => {
  353 |   await page.goto("/questions");
  354 |   await page.getByRole("button", { name: "Just learning for now" }).click();
  355 |   await page.getByRole("button", { name: "My progress" }).click();
  356 |   await page.getByRole("button", { name: "Talked with my care team" }).click();
  357 |   await page.getByRole("button", { name: "Share my progress with my care team" }).click();
  358 |   const code = (await page.locator("p.font-mono").textContent())?.trim() ?? "";
  359 |   expect(code.startsWith("FPN1.")).toBeTruthy();
  360 | 
  361 |   await page.goto("/team");
  362 |   await page.getByLabel("Progress code").fill(code);
  363 |   await page.getByRole("button", { name: "Add", exact: true }).click();
  364 |   await expect(page.getByText("Added ✓")).toBeVisible();
  365 |   await expect(page.getByText("1/6", { exact: false })).toBeVisible();
  366 |   await expect(page.getByText("In motion")).toBeVisible();
  367 | });
  368 | 
  369 | test("clinics: map first, radius filter, tappable detail pages", async ({ page }) => {
  370 |   await page.goto("/questions");
  371 |   await walkSection1(page);
  372 |   await page.getByRole("button", { name: "Keep going" }).click();
  373 |   await page.getByRole("button", { name: "Yes, I want to" }).click();
  374 |   await page.getByRole("button", { name: "Not yet", exact: true }).click();
  375 |   await page.getByRole("button", { name: "Two", exact: true }).click();
  376 |   await page.getByRole("button", { name: "In about 1 to 3 years" }).click();
  377 |   await page.getByRole("button", { name: "Finish up" }).click();
  378 |   await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  379 |   await page.getByPlaceholder("5-digit ZIP").fill("91101");
  380 |   await page.getByRole("button", { name: "Continue" }).click();
  381 |   await page.getByRole("button", { name: "See my options" }).click();
  382 | 
  383 |   await page.getByRole("button", { name: "Clinics", exact: true }).click();
  384 |   await expect(page.getByRole("region", { name: "Map of fertility clinics" })).toBeVisible();
  385 |   await page.getByRole("button", { name: "Within 40 mi" }).click();
  386 |   await page.getByRole("button", { name: /HRC Fertility/ }).first().click();
  387 |   await expect(page.getByRole("heading", { name: /HRC Fertility/ }).first()).toBeVisible();
> 388 |   await expect(page.getByText("Consult", { exact: true })).toBeVisible();
      |                                                            ^ Error: expect(locator).toBeVisible() failed
  389 |   await expect(page.getByText("Aetna", { exact: false }).first()).toBeVisible();
  390 |   await page.getByRole("button", { name: "Back to clinics" }).first().click();
  391 | });
  392 | 
  393 | test("the survey never asks about partners, and the LGBTQ+ guidance still shows", async ({ page }) => {
  394 |   await page.goto("/questions");
  395 |   await page.getByRole("button", { name: "Before treatment starts" }).click();
  396 |   await page.getByRole("button", { name: "Haven't decided yet" }).click();
  397 |   await page.getByRole("button", { name: "Not yet" }).click();
  398 |   await page.getByRole("button", { name: "Skip this question" }).click();
  399 |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  400 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  401 |   await page.getByRole("button", { name: "Keep going" }).click();
  402 |   await page.getByRole("button", { name: "Yes, I want to" }).click();
  403 |   await page.getByRole("button", { name: "Not yet", exact: true }).click();
  404 |   await page.getByRole("button", { name: "Two", exact: true }).click();
  405 |   await page.getByRole("button", { name: "In about 1 to 3 years" }).click();
  406 |   await page.getByRole("button", { name: "Finish up" }).click();
  407 |   await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  408 |   // straight to ZIP: no partner question exists anymore
  409 |   await expect(page.getByRole("heading", { name: /ZIP|area/i })).toBeVisible();
  410 |   await page.getByRole("button", { name: "Skip this question" }).click();
  411 |   await page.getByRole("button", { name: "See my options" }).click();
  412 | 
  413 |   await page.getByRole("button", { name: "Ask", exact: true }).click();
  414 |   await page.getByText("Common questions").click();
  415 |   await expect(page.getByText("If you're LGBTQ+").first()).toBeVisible();
  416 |   await expect(page.getByText("Check your partner's plan too").first()).toBeVisible();
  417 | });
  418 | 
  419 | test("the team board demo and the aid fit check work", async ({ page }) => {
  420 |   await page.goto("/team");
  421 |   await page.getByRole("button", { name: "Load 5 sample patients (demo)" }).click();
  422 |   await expect(page.getByRole("textbox", { name: "Patient label" }).first()).toHaveValue(/Demo/);
  423 |   await expect(page.getByText("Still deciding, on purpose")).toBeVisible();
  424 | 
  425 |   await page.goto("/questions");
  426 |   await page.getByRole("button", { name: "Before treatment starts" }).click();
  427 |   await page.getByRole("button", { name: "Haven't decided yet" }).click();
  428 |   await page.getByRole("button", { name: "Not yet" }).click();
  429 |   await page.getByPlaceholder("Your age").fill("19");
  430 |   await page.getByRole("button", { name: "Continue" }).click();
  431 |   await page.getByRole("button", { name: "I have ovaries, a uterus, or both" }).click();
  432 |   await page.getByRole("button", { name: "I'm not sure", exact: true }).click();
  433 |   await page.getByRole("button", { name: "Keep going" }).click();
  434 |   await page.getByRole("button", { name: "Yes, I want to" }).click();
  435 |   await page.getByRole("button", { name: "Not yet", exact: true }).click();
  436 |   await page.getByRole("button", { name: "Two", exact: true }).click();
  437 |   await page.getByRole("button", { name: "In about 1 to 3 years" }).click();
  438 |   await page.getByRole("button", { name: "Finish up" }).click();
  439 |   await page.getByRole("button", { name: "A job-based or private plan in California" }).click();
  440 |   await page.getByRole("button", { name: "Skip this question" }).click();
  441 |   await page.getByRole("button", { name: "See my options" }).click();
  442 |   await page.getByRole("button", { name: "Financing", exact: true }).click();
  443 |   // a 19-year-old pre-treatment: SAMFund (21-39, survivors) lands in unlikely with reasons
  444 |   await expect(page.getByText("Probably not a fit for you", { exact: false })).toBeVisible();
  445 |   await expect(page.getByRole("heading", { name: "Financial aid programs" })).toBeVisible();
  446 | });
  447 | 
  448 | test("the compare tab grades options side by side in words", async ({ page }) => {
  449 |   await page.goto("/questions");
  450 |   await page.getByRole("button", { name: "Just learning for now" }).click();
  451 |   await page.getByRole("button", { name: "Compare", exact: true }).click();
  452 |   await expect(page.getByRole("heading", { name: "Compare options side by side" })).toBeVisible();
  453 |   await expect(page.getByText("Takes a couple of weeks and real money", { exact: false })).toBeVisible();
  454 |   await page.getByRole("button", { name: /Ovarian tissue freezing/ }).first().click();
  455 |   await expect(page.getByText("Surgery under anesthesia")).toBeVisible();
  456 | });
  457 | 
  458 | test("reach out drafts a clinic message with copy and call", async ({ page }) => {
  459 |   await page.goto("/questions");
  460 |   await page.getByRole("button", { name: "Just learning for now" }).click();
  461 |   await page.getByRole("button", { name: "Reach out" }).click();
  462 |   await expect(page.getByRole("heading", { name: "A fertility clinic" })).toBeVisible();
  463 |   await page.getByRole("button", { name: /HRC Fertility/ }).first().click();
  464 |   // no stage was given on this lane, so the message must NOT claim "recently diagnosed"
  465 |   await expect(page.getByText("interested in fertility preservation", { exact: false })).toBeVisible();
  466 |   await expect(page.getByText("recently diagnosed")).not.toBeVisible();
  467 |   await expect(page.getByRole("button", { name: /Copy message/ })).toBeVisible();
  468 | });
  469 | 
```