# Content Gaps and Conflicts

Last reviewed: 2026-10-30. Things the product spec needs that the current source documents (see INVENTORY.md) do not support. Per project rules, none of these get filled from memory; each needs a document, a named published guideline, or Helen's sign-off on a source.

## Decisions from Helen (2026-10-30)

- C1 and C2 approved: D4 (dated July 31, 2025 — always show the date) is the insurance and financial-aid source; D2's financial section and resource list are never cited. Feedback note for Estella: `content/NOTE-FOR-ESTELLA.md`.
- Gap 1 (option-eligibility logic): approved to use the ASCO 2025 guideline as a source. DONE 2026-10-30: recommendations extracted (via the COG endorsement PDF that reproduces them, since JCO full text is paywalled) into `content/sources/asco-2025.md`. Named risk-category tables still need the paywalled full text; listed there under "Not found."
- Gap 2 (egg-freezing timeline etc.): find the most reputable online source and show Helen BEFORE using it. Candidates memo in progress (`content/sources/patient-education-source-candidates.md`); not yet approved.
- Gap 3 (ovarian suppression): RESOLVED by ASCO 2025 (Rec 4.8, conditional): GnRH agonists should NOT be used in place of established methods, MAY be offered as an adjunct in breast cancer, and may help in oncologic emergencies (e.g., menstrual suppression). Hormonal gonadoprotection in males: recommended against (strong/high). Show as a short, honest "you may hear about this" note on relevant paths only.
- Gap 4 (2026 CA IVF law): VERIFIED 2026-10-30. It is SB 729 (signed 2024-09-29), delayed by AB 116 to plans issued/amended/renewed on or after Jan 1, 2026; CalPERS July 1, 2027. Large-group fully insured must cover infertility treatment incl. IVF (3 completed oocyte retrievals, unlimited embryo transfers); small group offer-only; individual market, self-funded ERISA, and religious employers excluded. Inclusive infertility definition (individual or with partner; nondiscrimination incl. marital status/orientation). Full citations: `content/sources/ca-ivf-law-2026.md`. Note: whether SB 729 itself covers "fertility preservation services" is asserted by advocates but undefined in statute; flagged there.
- Gap 5 (Medi-Cal): CONFIRMED still No as of 2026-10-30. SB 729 expressly excludes Medi-Cal managed care; D4's answer stands. The Medi-Cal branch says so plainly and routes to financial aid.
- Gap 7 (survivor labs): partially sourced. ASCO 2025: ovarian reserve assessed via AMH and antral follicle count; "there may be no oocyte yield within 3 months of last chemotherapy dose" (closest sourced analog to the "100 days" figure; use ASCO's wording). FSH/LH not addressed in readable ASCO sources; keep hunting or wait for Hannah's doc.
- Gap 11 (partner clinics): RESOLVED. There is no partner list. List all clinics the source docs recommend, using the docs' own framing (a resource list, explicitly not an endorsement). No "partner" labels anywhere.
- Post-launch: scheduled background tracker to detect when the insurance content goes stale (AFP legislation map, DMHC). Build at checkpoint 4.
- Gap 8 (risk logic) UPDATE 2026-11-01: Helen approved building v1 from published public frameworks before Hannah's document arrives (she loops back with Hannah Monday). Implemented in lib/risk/ from content/sources/risk-framework.md (Livestrong/Fertile Hope charts as spine, ESMO 2020, COG LTFU v6). Output is a guideline CATEGORY plus care-team prompt, never a probability; everything dose- or cycle-keyed falls back to "depends on dose" honestly. MUST be reconciled against Hannah's document when it lands; conflicts table lives in the risk-framework memo. ASCO 2025's own risk tables remain unread (paywalled); do not cite ASCO 2025 for any band.

## New (2026-11-03): LGBTQ+ legal guidance

16. **LGBTQ+ family-formation legal module.** Helen interviewed an LGBTQ+ family-formation lawyer (2026-11-03). Decision: do NOT generate legal guidance from model knowledge; legal claims need an attorney-reviewed source document, exactly like the clinical risk module needed Hannah's. Shipped now (sourced): an "If you're LGBTQ+" coverage card citing SB 729's inclusive infertility definition and nondiscrimination clause, plus Men Having Babies in the aid list (D4 p.16). To request from the lawyer, as a reviewed document: donor agreement basics (known vs anonymous), parentage orders in California, surrogacy legality and process in CA, consent and disposition agreements for stored embryos when there is a partner (disposition disputes are the classic failure mode), and anything specific to trans patients' stored gametes and name/gender-marker changes. When the document arrives it becomes a cited content module with the attorney named as reviewer.

## New (2026-11-04): "Ready to act" intake

17. **Action-mode intake and fast-track recommendations.** Helen wants: when a patient says they want to move, ask a short set of triage questions (how soon treatment starts, how fast they want an appointment, travel radius, payer) and output prioritized next steps, possibly flagging urgency to the care team. Deliberately NOT built yet: the triage criteria should mirror what oncofertility navigators actually use, which is question 9 for the Dr. Su meeting (Nov 11). Build after that conversation.

## Blocking for checkpoint 2 (the one real-content path)

1. **Which options fit which situations.** No document maps age / reproductive organs / treatment stage to the options that apply (for example: egg freezing requires time before treatment starts; ovarian tissue freezing can be done without stimulation; sperm banking before treatment). D4 lists the four service routes but not eligibility or timing logic. Need: the relevant ASCO/ASRM guideline text (D3 and D4 cite ASCO 2025, doi 10.1200/JCO-24-02782) or a document from Hannah/Estella.
2. **Procedure step-by-step explainers.** The spec's egg-freezing walkthrough (consult, labs, ~10-14 days of hormone shots with monitoring, retrieval under sedation, freezing, storage with annual fee) is not in any document. D4 gives the service components and costs but no patient-level sequence, durations, or sedation details. Same gap for sperm banking, embryo freezing, and ovarian tissue freezing. Need: patient-education source for each option.
3. **Ovarian suppression during treatment (GnRH agonist).** Named in the spec as an option; appears in NO source document. Do not show until sourced.

## Needed for checkpoint 3

4. **The "2026 California IVF law" for survivors (likely SB 729).** Not mentioned in any document. D4's state matrix predates it (June 1, 2025). Need the statute or a plain-language summary from a citable source before the survivor insurance path can mention it.
5. **Medi-Cal.** D4 says California Medicaid = No FP coverage as of June 1, 2025 [D4, p.33]. If the 2026 law or any later change affects Medi-Cal, our answer for the "Medi-Cal" insurance branch changes. Verify before shipping that branch; until then the supported statement is only the dated D4 one.
6. **SB 600 scope in plain language.** D4 supports: SB 600 (2019), Knox-Keene plans, DMHC recognizes FP as a covered benefit for patients at risk of iatrogenic infertility [D4, p.36]. Not supported: which plan types exactly (DMHC vs CDI), what services/cycles are included, survivor eligibility. Need DMHC guidance or statute text.
7. **Survivor lab guidance (AMH, FSH, LH) and the "about 100 days after last chemo" timing.** Not in any document. Expected in Hannah's risk-assessment document; otherwise needs a survivorship guideline source.
8. **Risk assessment logic (CED thresholds, radiation doses, risk categories).** Awaiting Hannah's document into `source-docs/risk-assessment/`. D3 links to UCSD's CED calculator and CRISP but the links carry no formulas we can cite. Module ships as "coming soon" until then.
9. **Semen collection prep guide.** Nothing in the documents describes the collection experience or preparation. Need a patient-education source (and ideally Estella's input, since the in-hospital drop-off is her observation).
10. **Clinic facts for the comparison view.** D1 gives names, phones, URLs only (one URL has a typo: "califroniafertilitypartners.com"). Prices, oncofertility services, insurance accepted, consult cost all come from the clinic-website fetch in workstream D, each field with source URL + retrieval date. UC San Diego's fertility preservation program is named in the spec as a dataset entry but no document describes it as a clinic (D4/D3 are authored by UCSD Moores; that is not a clinic listing).
11. **Partner-clinic designation.** The spec says partner clinics (including HRC Fertility Pasadena) get a "partner" label. The documents explicitly say the lists "do not constitute an endorsement by City of Hope" [D2, p.2]. Need Helen's written list of which clinics are partners and on what basis before any label ships.
12. **Financial aid caps.** D4 gives real eligibility detail but dollar caps only for Worth the Wait ($500-$2,500) and some general-infertility funds. Caps for Livestrong Fertility, Chick Mission, Team Maggie, etc. must come from their sites (with URL + date) in workstream D style.
13. **Storage costs beyond year one.** Supported: $200-$500/year generic range [D4, p.3]. Per-clinic annual fees need the clinic fetch.
14. **Lifestyle information notes** (e.g., "cannabis can lower sperm count"). Not in any document. Source each note or drop it.
15. **Reading-level and inclusivity review sources.** The spec's 6th-8th grade target and respectful organ-based questions have no source-doc constraint; flag for Estella/Hannah review at checkpoint 4.

## Conflicts between documents

- **C1: Insurance coverage.** D2 (2017 sources): sperm banking, egg freezing, embryo freezing "usually not covered" by insurance [D2, p.2]. D4 (2025): California commercial fully-insured plans are mandated to cover FP (SB 600, 2019) [D4, p.33, 36]. These describe different eras; D2 predates SB 600. Proposed resolution: use D4 for all insurance content and never cite D2's financial section. Helen to confirm.
- **C2: Stale resources in D2.** D2 lists Fertile Hope / fertilehope.org and its Sharing Hope program as a live organization; Fertile Hope was absorbed into Livestrong years ago (D4 lists only Livestrong Fertility). Proposed resolution: use D4's philanthropic table; never cite D2's resource list. Helen to confirm.
- **C3 (minor): HRC naming.** D1 calls it "HRC Fertility"; D2 calls it "Huntington Reproductive Center Medical Group Fertility." Same organization (havingbabies.com). Dataset will use the current public name from their site.

## Found while writing content (2026-10-30, workstream A+C)

Facts the spec or drafts wanted that no approved source supports. Each was left out of `content/app/*`; nothing was filled from memory.

16. **TESE procedure detail.** No approved source gives patient-level steps for testicular sperm extraction (anesthesia type, incision, duration, recovery). MSKCC's TESE patient page could not be found (both candidate URLs returned 404 on 2026-10-30). The option's steps are written only at the altitude ASRM's sperm fact sheet and D4's service list (p.9) support: consult, surgical removal of sperm from the testicle, freezing/storage. Needs a patient-education source before richer steps ship.
17. **Egg-freezing injection window "10 to 14 days".** The spec's figure is not in the approved sources: MSKCC says "about 10 days," ASRM says "10-12 days." Content says "about 10 to 12 days." If Helen wants "10 to 14," a source saying so is needed.
18. **GnRH agonist practicalities.** How often the ovarian-suppression medicine is given (injection schedule, monthly vs. per-cycle) is in no approved source; the option describes only what the medicine does (NCI phrasing) and ASCO's stance. No cost is published either.
19. **`payUpfront` for aid orgs.** D4 (pp.14-16) never says which programs pay clinics directly vs. reimburse after upfront payment. The field is unset on all 11 orgs; needs each org's own page (workstream D style: URL + retrieval date). Related: dollar caps beyond Worth the Wait are still unpublished (existing Gap 12).
20. **Embryo-specific lab costs.** D4 publishes only the egg-freezing cycle average ($12,400) and meds (~$5,000). Costs for fertilization/embryo creation, TESE, ovarian tissue surgery, and ovarian transposition are not published anywhere approved; shown as "not published."
21. **Post-treatment sperm banking.** ASCO Rec 4.3 supports post-treatment egg/embryo freezing, but the extraction has no parallel "may be offered post-treatment" statement for sperm banking, so the sperm banking option is gated to `not_started`. Survivors with testes get the semen-analysis guidance instead. If post-treatment banking should be offered as an option, it needs a source (possibly the unread JCO full text).
22. **Tissue storage fees.** D4's $200-$500/year storage range names "eggs or sperm"; ovarian/testicular tissue storage fees are not published. Flagged in the option's cost note.

## Explicitly out of scope for v1 (parked, per kickoff)

- Sending patient data to the care team (needs BAA + backend).
- Any personal probability or recommendation output from the risk module.

## 18. ASCO 2025 methods deliberately not in the tool yet (mapped 2026-11-09)
From the recommendation-by-recommendation map against Su et al., JCO 2025 (10.1200/JCO-24-02782):
- In vitro maturation of oocytes (Rec 4.4, emerging, conditional). Low availability; unknown live-birth rates in cancer survivors. Decide with Dr. Su whether to list it as "emerging."
- Uterine transposition (Rec 4.6): experimental, clinical trials only. Out of scope.
- Fertility-sparing cancer surgery (Rec 4.7: trachelectomy, progestin therapy for early endometrial cancer, fertility-sparing surgery for early ovarian cancer). These are treatment-selection decisions made with the oncologist, not preservation procedures a patient initiates; the tool does not cover them. Worth a pointer for cervical/uterine/ovarian cancer types if Dr. Su agrees.
- Testicular tissue cryopreservation (Rec 3.4/5.1): investigational, prepubertal males only; tool audience is 15 to 45 and the survey assumes puberty. Out of scope.
- Post-treatment sperm banking for survivors: ASCO 4.3 covers post-treatment egg/embryo freezing (included); the male analog is not an ASCO recommendation in the set we read. Survivors with testes currently get the fertility-check guidance instead. Ask Dr. Su what survivors should be told about banking after recovery.

## 19. JCO full text still unread
ascopubs.org 403s; the recommendation set came verbatim from the COG endorsement PDF. The JCO discussion sections and any data supplement tables (the #sec-5 anchor Helen sent) have not been read directly. If Helen saves the article as PDF and drops it in the repo, reconcile the memo against it.
