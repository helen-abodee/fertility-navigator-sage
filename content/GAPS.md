# Content Gaps and Conflicts

Last reviewed: 2026-10-30. Things the product spec needs that the current source documents (see INVENTORY.md) do not support. Per project rules, none of these get filled from memory; each needs a document, a named published guideline, or Helen's sign-off on a source.

## Decisions from Helen (2026-10-30)

- C1 and C2 approved: D4 (dated July 31, 2025 — always show the date) is the insurance and financial-aid source; D2's financial section and resource list are never cited. Feedback note for Estella: `content/NOTE-FOR-ESTELLA.md`.
- Gap 1 (option-eligibility logic): approved to use the ASCO 2025 guideline as a source. In progress.
- Gap 2 (egg-freezing timeline etc.): find the most reputable online source and show Helen BEFORE using it. In progress; not yet approved.
- Gap 3 (ovarian suppression): Helen asked what it is; include only if the ASCO guideline supports discussing it. Pending research.
- Gap 4 (2026 CA IVF law): verify it exists and find a citable source. In progress.
- Gap 7 (survivor labs): include; use the language the sourced guideline/clinic materials use.
- Gap 11 (partner clinics): RESOLVED. There is no partner list. List all clinics the source docs recommend, using the docs' own framing (a resource list, explicitly not an endorsement). No "partner" labels anywhere.
- Post-launch: scheduled background tracker to detect when the insurance content goes stale (AFP legislation map, DMHC). Build at checkpoint 4.

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

## Explicitly out of scope for v1 (parked, per kickoff)

- Sending patient data to the care team (needs BAA + backend).
- Any personal probability or recommendation output from the risk module.
