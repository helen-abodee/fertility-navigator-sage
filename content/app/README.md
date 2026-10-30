# App content provenance

Last reviewed: 2026-10-30. All content in this directory conforms to `lib/content-schema.ts`. Every medical, cost, or insurance fact carries a `Citation`. Nothing here is written from memory; every fact traces to one of the approved sources below. `content/GAPS.md` ("Found while writing content") lists what the sources could not support.

## Files

- `content.ts` assembles and exports `appContent: AppContent` (`lastReviewed: "2026-10-30"`).
- `options.ts` the seven preservation options.
- `guidance.ts` results-page guidance sections (insurance branches, survivor testing, semen collection prep, partner insurance).
- `aid.ts` financial aid directory.
- `questions.ts` questions to bring to the care team.
- `citations.ts` citation factories for the approved sources (single place for URLs, dates, and source names).

## Approved sources and what each one backs

### D4: UCSD Moores Cancer Center & Alliance for Fertility Preservation toolkit
`source-docs/estella/2025.12.16_FertilityPreservationToolkit_CLINICS.pdf`, last updated 2025-07-31. Page-level facts itemized in `content/INVENTORY.md`; detail pages re-read directly from the PDF on 2026-10-30.

- All dollar figures in `options.ts` costs: egg cycle $12,400 average, medicines ~$5,000, sperm test/analyze/freeze $500 to $1,000, storage $200 to $500 per year (p.3); service lists for each route (p.9).
- `guidance.ts` insurance content: SB 600 / DMHC / Knox-Keene recognition and the California appeal letter (p.36), appeal timelines including 4 days for urgent cases (p.35), plan funding types and self-funded caveat (pp.7-8), the CA mandate matrix row (pp.12, 33), and the entire benefit verification phone script: the "medically indicated fertility preservation / iatrogenic infertility, not general infertility benefits" wording (p.22), ICD-10/CPT prep (pp.20, 22-23), lifetime maximum questions (p.25), call-record prompts (pp.24, 29), spouse/dependent policyholder info (p.20).
- `aid.ts` in full: the fertility preservation philanthropic table (pp.14-16). The only published cap is Worth the Wait ($500 to $2,500); all others are "not published". `payUpfront` is set nowhere because D4 does not say which programs reimburse after upfront payment (see GAPS).
- `questions.ts`: the two insurance questions (codes; medical-necessity appeal).

### asco-2025: ASCO 2025 Fertility Preservation Guideline Update
`content/sources/asco-2025.md`; recommendations read via the COG endorsement PDF (URL in `citations.ts`), which reproduces them verbatim. Cited with recommendation numbers in `sourceName`.

- Status and audience of every option: egg freezing established (Rec 4.2), embryo freezing established (4.1), post-treatment egg/embryo freezing (4.3), sperm banking (3.1, plus 3.5 qualifiers: low counts should not dissuade, ICSI works with very little sperm), TESE (3.2), ovarian tissue freezing established, no stimulation needed, prepubertal option, reintroduction-risk caveat (4.10, 5.1), ovarian suppression adjunct-only stance and oncologic-emergency use (4.8, 4.9), ovarian transposition for pelvic radiation with its limits (4.5).
- Survivor guidance: "there may be no oocyte yield within 3 months of last chemotherapy dose" and AMH/AFC as post-treatment markers (Rec 4.3 qualifying statement). The spec's "100 days" figure is NOT used anywhere; it is unsourceable at patient-education grade (see `content/sources/patient-education-source-candidates.md`, verdict section).
- `questions.ts`: counseling-derived questions (1.1, 1.2, 1.3, 2.1, 4.2, 4.3, 4.5, 4.10, 3.2, 6.1, GPS 6.4).

### sb729: California SB 729 / SB 600 research
`content/sources/ca-ivf-law-2026.md`. Cited per underlying URL (CalMatters chaptered text, RESOLVE FAQ, Sen. Menjivar's office).

- `guidance.ts` survivor insurance section: SB 729 signed 2024-09-29, delayed by AB 116 to plans issued/amended/renewed on or after 2026-01-01; large-group fully insured must cover infertility treatment incl. IVF (3 completed retrievals, unlimited transfers); small group offer-only; self-funded, individual market, Medi-Cal excluded; religious employers exempt; CalPERS 2027-07-01; the broad infertility definition; renewal timing caveat.
- Medi-Cal section: both SB 729 and SB 600 exclude Medi-Cal managed care (corroborates D4's "No" as of 2025-06-01, re-verified 2026-10-30).

### Patient education set (all pages re-fetched and read 2026-10-30)

- **MSKCC Sperm Banking** (updated 2024-02-22): the entire semen collection prep section and sperm banking steps: 2 to 5 day abstinence, private room / home / hospital-room collection, 3 samples 2 to 3 days apart (1 day apart if treatment starts soon; 1 or 2 samples still helpful), no saliva/lubricant (mineral oil at base only), infectious disease testing, yearly storage fee, $800 to $1,000 example package price.
- **MSKCC Fertility Preservation Before Cancer Treatment, ovaries/uterus** (updated 2019-10-23): egg/embryo freezing steps (ultrasound + FSH/AMH baseline, ~10 days of daily shots, monitoring almost every other day, retrieval under anesthesia taking about 20 minutes with discharge within 1 hour), ovarian tissue freezing steps, annual storage fee and thaw costs.
- **MSKCC Fertility Evaluation After Cancer Treatment, ovaries/uterus** (updated 2019-10-23): survivor testing for ovaries (FSH, AMH, antral follicle count) and the "wait at least 1 year after completing cancer treatment" timing.
- **MSKCC Building Your Family After Cancer Treatment, testicles** (updated 2023-06-21): semen analysis "at least 1 year" after treatment; recovery "up to 5 years".
- **ASRM ReproductiveFacts.org Fertility Preservation Journey** (no date on page): cross-confirmation of 10 to 12 injection days, 15 to 30 minute retrieval under light anesthesia, 2 to 3 week embryo timeline, not all retrieved eggs are mature.
- **ASRM Cancer and its impact on sperm fact sheet** (revised 2023): surgical sperm retrieval and ICSI, collection condoms, indefinite storage ("over 20 years" pregnancies).
- **COG Health Links v6.0 (Oct 2023), Testicular + Ovarian Reproductive Health**: survivor labs (males: yearly check-up; AM testosterone, LH, FSH, inhibin; semen analysis after several days of abstinence; azoospermia needs more than one sample. females: yearly check-up; FSH, LH, estradiol if a problem is suspected), recovery usually in the first few years.
- **American Cancer Society, Preserving Fertility in Children and Teens** (revised 2025-01-13): cost cross-check ($500 to $1,000 banking, $200 to $500/year storage) and teen sensitivity around collection.
- **NCI Female Fertility and Cancer Treatment** (updated 2025-05-14, public domain): plain-language phrasing for ovarian transposition ("move the ovaries... away from the area receiving radiation", may be done during cancer surgery) and the GnRH agonist description ("causes the ovaries to shut down and stop making estradiol").

## Copy rules applied

6th to 8th grade reading level; calm, plain, no pressure in either direction; "not sure" treated as a normal answer; no claims that anything improves fertility or predicts pregnancy; real time constraints stated factually with citation only; no em dashes; no City of Hope branding; no scores, streaks, or guilt. D1/D2/D3 are not cited anywhere (per Helen's C1/C2 decisions in GAPS.md).
