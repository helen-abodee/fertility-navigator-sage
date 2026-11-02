# Financial aid directory provenance (2026-11-02 refresh)

The 11 entries in `content/app/aid.ts` were seeded from the UCSD/AFP toolkit
(D4, pp.14-16) and re-verified against each organization's own website on
2026-11-02. Each entry keeps its D4 page citation and adds an `org-<id>`
citation for the organization's page. Facts below marked "third party" were
NOT used in app copy, only noted here.

## Allyson Whitney Foundation

- Read: https://allysonwhitney.org/grants/
- Changed vs D4: added the published grant range ($500 to $1,500), the
  post-treatment window (active treatment or up to 10 months after), the
  yearly application cycle, and the one-award-per-facility-per-year rule.
- Timing on the site (read 2026-11-02): requests due May 20, 2026; full
  applications due June 15, 2026; notification by about August 1, 2026. That
  2026 cycle has already passed and no 2027 dates were posted yet, so the app
  copy says only "once a year in a spring window."
- Ambiguous: grants "can be paid directly to the patient/family or for
  rent/medical expenses," and fertility costs are covered "with bills," so it
  is unclear whether fertility awards are reimbursement or direct payment.
  `payUpfront` left unset.

## Chick Mission

- Read: https://www.thechickmission.org/hope-grants/
- Changed vs D4: state list grew from 6 states (CA, CO, IL, NJ, NY, TX) to 10
  (adds FL, MT, OK, PA). Added age 18 to 40, female, pre-treatment
  requirement, income limits ($150k single / $200k married), medication
  exclusion, and the fact that an onboarded network clinic submits the
  application (D4 described a patient-initiated screening step; the site now
  says applications come from network clinics). Grant is paid to the partner
  clinic on final invoice, so `payUpfront: false`.
- Dollar cap: still not published (grant covers "costs associated with an egg
  freezing cycle").
- Audience: added `anatomy: ["ovaries_uterus"]` because the program is
  female-only, egg freezing only, per the site.

## Expect Miracles Foundation SAMFund

- Read: https://expectmiraclesfoundation.org/get-help/
- Changed vs D4: notification timing updated from "10 to 11 weeks" to the
  site's current "6 to 7 weeks after the closing date." Added the two grant
  tracks (Financial Assistance and Family Building), twice-a-year ~3-week
  windows (Family Building in March and September), and that both fall 2026
  cycles are closed with the next openings in early 2027.
- Dollar amounts: not published; the site says they cannot fund all
  applicants or award the maximum to all.
- Ambiguous: payment method (to patient vs vendor) not stated; `payUpfront`
  left unset. The site states age 21 to 39 "at time of application"; US
  residency requirement was in D4 and is kept.

## Fertility Within Reach

- Read (attempted): https://fertilitywithinreach.org/ and
  /fertility-preservation both returned HTTP 404 on 2026-11-02 (the GoDaddy
  site serves a literal "404 Not Found / File not found" page at every path,
  apex and www). bankingonthefuture.org does not resolve (DNS NXDOMAIN).
- Proof the org was live recently: Internet Archive snapshot of the homepage,
  2026-10-14, HTTP 200:
  https://web.archive.org/web/20261014215652/https://fertilitywithinreach.org/
  That snapshot shows an advocacy/education organization and says "Our
  Banking on the Future program has provided 50+ fertility preservation
  grants."
- Changed vs D4: D4's line ("you and your clinic complete the application
  together") could not be verified; replaced with an honest note that the
  website was unreachable in November 2026 and a social worker should confirm
  the program before applying. Not marked defunct: the site was up 3 weeks
  before this check, so this may be a temporary outage. RE-CHECK before the
  next content review.
- Third party (not used in copy): a GlobalGiving project PDF describes
  Banking on the Future as covering first-year storage, collection, testing,
  and freezing for oncology patients to age 21 and transgender patients to
  age 26.

## Livestrong Fertility

- Read: https://livestrong.org/how-we-help/livestrong-fertility/
- Changed vs D4: added the published value (at least 25 percent off services
  at partner clinics, plus free stimulation medication via EMD Serono for
  approved patients), the partner-clinic requirement, the
  insurance-checked-first requirement, and income limits for sperm
  preservation applicants ($101,000 single / $130,000 married AGI). Egg and
  embryo applicants must be uninsured or underinsured for preservation; no
  income cap is published for them.
- Discounts are applied through partner clinics, so `payUpfront: false`.
- Open as of 2026-11-02; no pause notice.

## NMDP (formerly Be The Match)

- Read: https://www.nmdp.org/patients/transplant-support/financial-support
  (also https://sicklecellred.org/resources/financial/ and a web search that
  surfaced the Good Grants detail).
- URL CHANGED: the D4 URL https://www.sicklecellconnect.com/ no longer
  resolves (DNS NXDOMAIN on 2026-11-02). Entry now points at NMDP's own
  financial support page, which lists the sickle cell disease fertility
  preservation grant.
- Changed vs D4: added the $10,000 cap, the ~350 percent federal poverty
  level income limit, the apply-before-preservation-begins rule, and that a
  transplant center social worker or NMDP patient navigator applies on the
  patient's behalf. NMDP's page lists coverage as egg retrieval/freezing,
  semen analysis/freezing, storage fees, and medication; D4's longer list
  (embryo work, ovarian tissue, TESE) was trimmed to what NMDP currently
  publishes.
- Ambiguous: how funds are disbursed (to clinic vs patient) is not stated;
  `payUpfront` left unset. Partner org SC RED confirms the program is active
  (20+ grants awarded).

## ReUnite Oncofertility

- Read: https://reuniterx.com/discount-programs/
- Changed vs D4: added the discount scale (up to 100 percent off, based on
  clinical considerations and financial need), self-pay/no-drug-benefit
  requirement, female-only and no-prior-chemotherapy criteria, proof of
  income (1040), the oncologist form, and per-cycle medication limits
  (Follistim AQ to 2,700 IU, 5 ganirelix syringes, one 10,000 IU Pregnyl
  vial; limits summarized in copy as "per-cycle limits").
- Discount applied at the pharmacy, so `payUpfront: false`. Open as of
  2026-11-02.
- Audience: added `anatomy: ["ovaries_uterus"]` and `stages: ["not_started"]`
  because the program is for female patients before chemotherapy, per the
  site.

## Team Maggie's Dream

- Read: https://www.teammaggiesdream.org/grants
- Changed vs D4: added the $2,500 cap, the insurance-denial requirement, the
  mail-in application (227 Hillcrest Drive, Roswell, GA 30075), the proof of
  financial need and personal paragraph, and that funds go directly to the
  medical provider (`payUpfront: false`).
- Ambiguous: the site does not say whether applications are currently open;
  it directs questions to teammaggieforacure@gmail.com. Award size depends on
  available funds and board review.

## Verna's Purse (ReproTech)

- Read: https://reprotech.com/for-customers/reprotech-storage-discount-programs/
  (the D4 URL https://reprotech.com/vernas-purse/ now 301-redirects there;
  entry URL updated).
- Changed vs D4: the program still exists under its own name on a combined
  "Storage Discount Programs" page alongside Anna's Gift (general financial
  hardship) and a military discount. Added that there are separate
  applications for semen/testicular tissue/oocyte/ovarian tissue vs embryos.
  Discount applied to the ReproTech storage account, so `payUpfront: false`.
- Dollar/percent discount: not published on ReproTech's site; kept
  "not published." Third party (not used in copy): several clinic resource
  pages describe it as 70 percent off annual storage for three years for US
  citizens/permanent residents with cancer who meet income thresholds.
- The infectious disease blood testing line is kept on the D4 citation; the
  current web page does not restate it (the application PDFs are image-based
  and could not be text-extracted).

## Walgreens Specialty Pharmacy fertility preservation program

- Read: https://www.walgreens.com/topic/pharmacy/specialty-pharmacy/fertility-preservation.jsp
- Changed vs D4: named the donor program (Ferring Pharmaceuticals "Heart
  Beat"), added age 43 or younger (over 40 requires AMH above 0.5), diagnosis
  within the last 12 months, no prior gonadotoxic treatment, no financial
  requirements, exclusion of Massachusetts, New Jersey, and Arkansas, and the
  pharmacy contact (888-347-3415). Kept the 2-cycle limit (confirmed).
  Medication is donated/free, so `payUpfront: false`; cap described as "free
  medication for up to 2 cycles."
- Ambiguous: the page says "SELECT medications" without naming them, and does
  not spell out the enrollment steps (care team contacts the pharmacy).

## Worth the Wait

- Read: https://worththewaitcharity.com/request-help/ (entry URL stays the
  homepage; the citation points at the request-help page).
- Changed vs D4: kept the $500 to $2,500 range (confirmed). Added the two
  tracks (Emergency Preservation before treatment; Post-Cancer Treatment
  Family Building), twice-monthly emergency review (apply by the 14th, hear
  by the 16th; apply from the 15th, hear by the 2nd), quarterly family
  building cycles (cycle 15 runs October 1 to December 31, 2026), use-by
  windows (60 days emergency, 120 days family building), US facility/agency
  requirement, IRS-documented financial hardship, no fertility insurance
  coverage, and oncology provider sign-off. Paid directly to the clinic or
  agency, so `payUpfront: false`.
- Ambiguous: the site's cycle 15 line says awards "will be awarded on January
  15, 2026," which looks like a typo for 2027; not used in copy.
