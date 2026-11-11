# CRISP (Cancer-Related Infertility Score Predictor) — Methodology and Data Provenance

Research notes for the Nov 11 meeting with the UCSD reproductive endocrinologist.
All sources below were opened and read on 2026-11-02. Every claim in this file traces to one of these URLs. Nothing is filled from memory.

---

## 1. Sources read (all retrieved 2026-11-02)

| Source | URL | Notes |
|---|---|---|
| CRISP site home (EN) | https://oncofertilityrisk.com/en/ | Nav: Fertility Preservation, Birth Control, Pregnancy After Cancer, Menopause, CED Calculator, Toolkits, Symposium 2025, About Us, Contact Us, Español. UC San Diego Health logo. Site built by "Pendari" (footer credit). |
| Site sitemap index | https://oncofertilityrisk.com/sitemap.xml | 5 sub-sitemaps (EN/ES pages, EN/ES people, birth-control options). |
| EN page sitemap | https://oncofertilityrisk.com/en/wp-sitemap-posts-page-1.xml | 10 pages with lastmod dates (see Section 3). No separate "references", "methodology", "for providers", or FAQ page exists. |
| EN people sitemap | https://oncofertilityrisk.com/en/wp-sitemap-posts-pendari_people-1.xml | 16 team profile pages (see Section 3). |
| About page | https://oncofertilityrisk.com/en/about/ (lastmod 2024-12-05) | Team, funding, one-paragraph risk-derivation statement (quoted below). |
| Risk tool page (static text only) | https://oncofertilityrisk.com/en/infertility/ (lastmod 2025-09-09) | Disclaimer text quoted below. No reference list on the page. |
| CED calculator | https://oncofertilityrisk.com/en/ced-calculator/ (lastmod 2024-12-06) | Cites Green et al., Pediatric Blood and Cancer, DOI 10.1002/pbc.24679. |
| Toolkits page | https://oncofertilityrisk.com/en/toolkits/ (lastmod 2025-12-16) | Policy toolkits (not clinical); NCI R21CA256578 + CBCRP B30PIFP8715 funding; partner: Alliance for Fertility Preservation; contact AYAstudy@health.ucsd.edu. |
| Primary publication (full text) | https://pmc.ncbi.nlm.nih.gov/articles/PMC10739786/ | Nerb L, Yang E, Exume D, Dornisch A, Zhou B, Helsten T, Kaiser BN, Romero SAD, Su HI. "Development, Usability Testing, and Implementation Assessment of Cancer Related Infertility Score Predictor…" J Adolesc Young Adult Oncol 2023;12(6):843-850. DOI 10.1089/jayao.2022.0187; PubMed 37184539. |
| Precursor conference abstract | https://www.fertstert.org/article/S0015-0282(21)01186-9/fulltext | "DEVELOPMENT, USER-CENTERED DESIGN, AND IMPLEMENTATION MAPPING OF CRISP…" Fertility and Sterility (2021 meeting abstract). Found via search; full text returned HTTP 403 (paywalled) — title/authors confirmed from search listing only. |
| Din 2023 (related, same cohort) | PubMed abstract via NCBI efetch, PMID 37819662 | Din HN … Su HI. "Perceived and Objective Fertility Risk Among Female Survivors of AYA Cancer." JAMA Netw Open 2023;6(10):e2337245; PMC10568355. |
| NCI grant R01CA271104 | https://maps.cancer.gov/overview/DCCPSGrants/abstract.jsp?applId=10747416&term=CA271104 | Su (UCSD) stepped-wedge RCT of telehealth oncofertility care; abstract does NOT mention CRISP. |
| Oncofertility Consortium 2024 abstract book | https://oncofertility.msu.edu/wp-content/uploads/2024/09/Abstract-Book-OC2024.pdf | Searched for CRISP / oncofertilityrisk / Su risk tool: no matches in visible text. |
| PubMed searches | eutils esearch (2 queries) + esummary/efetch | "cancer related infertility score predictor" and "oncofertilityrisk" are NOT indexed phrases in PubMed (QuotedPhraseNotFound). Su HI + (infertility risk OR CRISP) returns 4 PMIDs: 37819662, 37184539, 34634132, 32047016. |

Supplementary file attempt: PMC's Suppl_Data.docx (12.6KB) for PMC10739786 is behind PMC's proof-of-work download challenge; direct curl and Europe PMC both failed ("Article with id PMC10739786 is not open access one" — it is an author-manuscript deposit). The paper's only in-text pointer to it is the PubMed search strategy: "We searched PubMed (Supplementary Data S1)".

---

## 2. What is KNOWN about the data derivation (verbatim quotes)

### Who built it
- Su lab at UC San Diego Moores Cancer Center. Paper authors: Laura Nerb (UCSD School of Medicine, first author), Emily Yang, Dominique Exume, Anna Dornisch, Beth Zhou, Teresa Helsten, Bonnie N. Kaiser, Sally A.D. Romero, H. Irene Su (corresponding; Dept. of Obstetrics, Gynecology and Reproductive Sciences, UCSD; hisu@health.ucsd.edu).
- Website built by Pendari (footer credit on oncofertilityrisk.com).

### Funding
- Paper: "National Institutes of Health (NIH) UL1TR001442, NIH TL1TR001443, UCSD Dissemination, and Implementation Science Center Pilot Award."
- Site about page: "funded by the California Breast Cancer Research Program".
- Toolkits page: NCI R21CA256578 and CBCRP grant B30PIFP8715.

### How risks were estimated (paper, Materials and Methods — verbatim)
> "We previously conducted a prospective population-based cohort study on the impact of cancer treatments on ovarian function in 763 female adolescent and young adult (AYA) cancer survivors. The most common individual drug, chemotherapy regimen, radiation, and surgery exposures from this prior study were used to inform our targeted review of their impact on risks of infertility, acute ovarian failure, POI, as well as on surrogate outcomes of ovarian reserve tests and amenorrhea."

> "We searched PubMed (Supplementary Data S1), Web of Science, Embase, and Food and Drug Administration (FDA) package inserts to obtain primary outcome data from randomized controlled trials and cohort studies and searched reference lists of all included studies for additional relevant sources. Two clinician investigators reviewed the data and came to a consensus on estimated absolute and relative risks of outcomes stratified by age at treatment, hierarchically prioritizing outcomes in the following order: infertility, live births, acute ovarian failure, POI, decreased ovarian reserve, and amenorrhea. Where studies reported varied, we hierarchically prioritized by rigor of study design and sample size."

So the derivation is: regimen list seeded from the lab's own 763-survivor cohort (the "Reproductive Window" study; primary analysis = Su et al. JCEM 2020, ref 27 of the paper) → targeted literature review per regimen (PubMed, Web of Science, Embase, FDA package inserts, plus reference-list snowballing) → two-clinician consensus adjudication with an outcome hierarchy and study-rigor/sample-size tie-breaking.

### Risk bands (verbatim)
> "We selected <20% as low risk, as infertility risk in the general population is 10%–20%. The threshold between moderate and high was selected by the clinician research team."

Bands: Low (≤20%, green), Moderate (21–70%), High (>70%), Unknown. Note: the 21/70 split is explicitly a clinician-team judgment call, not an empirically derived cut.

### Scope and update mechanism (verbatim)
- Scope: "infertility risk data for 60 treatment regimens among 10 cancer types" (brain, breast, cervical, Hodgkin lymphoma, intestinal, leukemia, non-Hodgkin lymphoma, ovarian, sarcoma, uterine).
- Updates: "Because infertility risk evidence will change over time, the website supports crowdsourcing of new regimens of interest; crowd-sourced infertility data and references will be verified by the investigator team before being added to the database."

### Fertile Hope lineage
The paper does NOT mention Fertile Hope. Prior tools it positions against: "Published risk stratification tools include those of The Pediatric Initiative Network Risk Stratification System of the Oncofertility Consortium, the Childhood Cancer Survivor Study, the COG, and the International Late Effects of Childhood Cancer Guideline Harmonization Group." And: "Current online infertility risk tools are limited by broad risk groupings, focus on childhood cancer only, and/or lack of field testing."

### Validation
No formal accuracy/calibration validation is described in the 2023 paper. What was tested: usability (think-aloud sessions; Table 1 lists seven design/workflow issues and fixes) and implementation constructs via CFIR (Table 2). "Future implementation will require further studies to examine efficacy and implementation outcomes." Limitation acknowledged: "Selection bias may impact generalizability, given that providers were recruited through convenience purposive sampling from sites in Southern California."

### Site-level methodology text (verbatim, about page)
> "Infertility Risk estimates are based on results that were published in studies such as clinical trials, randomized control trials, etc." … a "thorough literature search…for each of the treatment regimens using PubMed, Web of Science, Embase, and FDA package inserts."

### Site disclaimers (verbatim, /en/infertility/)
> "CRISP calculates population-based infertility risk (for females) based on age, cancer treatment, and the most current data available. Individual risks may vary."
> "Website does not substitute for clinical care and should be used in consultation with medical professionals."

### CED companion calculator
- Page cites: "Green et al. 2013. Pediatric Blood and Cancer. DOI: 10.1002/pbc.24679" and describes CED as "an approach to quantifying alkylating chemotherapy exposures developed by investigators from the Childhood Cancer Survivor Study." (The CRISP paper's ref 29 cites the same work as Pediatr Blood Cancer 2014;61(1):53–67 — online-first 2013, print 2014.)
- Inputs: mg/m² doses for ten alkylators (cyclophosphamide, ifosfamide, procarbazine, chlorambucil, BCNU, CCNU, melphalan, thio-TEPA, nitrogen mustard, busulfan).

---

## 3. Site inventory (static pages, with lastmod dates)

Pages (/en/): about (2024-12-05), contact-us (2025-09-05), home (2024-12-05), infertility (2025-09-09), pregnancy (2026-04-23), ced-calculator (2024-12-06), birth-control (2026-04-20), toolkits (2025-12-16), symposium-2025 (2025-09-11), menopause (2025-09-11). There is NO dedicated references, methodology, FAQ, or for-providers page.

Team (people pages, all /en/people/): H. Irene Su MD MSCE; Sally Romero PhD MPH; Laura Nerb; Emily Yang; Anna Dornisch MD MAS; Shiloh Williams PhD RN; Helen Palomino LCSW; Nguyen Do; Blanca Equihua-Felix MD MS; Ricardo Flores Ortega MPH; Milagro D. Jeanmarie-Tucker MHS; Lourdes Murcia MSW; Ksenya Shliakhtsitsava MD MAS; Anika Christofferson; Emma Rommelfanger; Kelsey Keverline MD.

Mission (about page, verbatim): "Provide meaningful information on women's health issues for young people who have faced cancer or cancer treatment" and "Conduct high quality clinical and behavioral research for young cancer survivors on survivorship care."

---

## 4. What remains UNPUBLISHED

1. **The regimen-risk table itself.** The 2023 paper does not include the 60-regimen × risk mapping (confirmed: tables are usability issues and CFIR factors; Figure 1 is screenshots). The 12.6KB supplementary docx is cited in-text only as the PubMed search strategy ("Supplementary Data S1"), so the per-regimen point estimates and their reference mapping appear to exist only inside the tool's database.
2. **The per-regimen reference mapping.** Figure 1 shows the tool's risk summary output includes "reference materials," meaning citations surface per-query in the PDF output, but no consolidated bibliography is published on the site or in the paper.
3. **The exact moderate/high threshold rationale** beyond "selected by the clinician research team."
4. **Who the "two clinician investigators" were** (not named in the paper).
5. **Any accuracy/calibration validation** against observed outcomes — none found in the paper, PubMed (through 2026-11-02), or the Oncofertility Consortium 2024 abstract book.
6. **Database update history** — the crowdsourcing pipeline is described, but no changelog or "last reviewed" dates are posted (page lastmod dates reflect CMS edits, not evidence review).
7. **A male/sperm version** — no mention anywhere opened; the tool is explicitly "for females."

---

## 5. Related publications and projects from the group

- **Nerb L, Yang E, Exume D, Dornisch A, Zhou B, Helsten T, Kaiser BN, Romero SAD, Su HI.** Development, Usability Testing, and Implementation Assessment of CRISP. J Adolesc Young Adult Oncol 2023;12(6):843-850. PMID 37184539; PMC10739786. (The primary CRISP paper.)
- **Fertility and Sterility 2021 meeting abstract** (S0015-0282(21)01186-9): "Development, user-centered design, and implementation mapping of CRISP, an online cancer-related infertility risk tool for female cancer survivors" — precursor to the 2023 paper; paywalled (403).
- **Su HI, Kwan B, Whitcomb BW, et al.** Modeling variation in the reproductive lifespan of female adolescent and young adult cancer survivors using AMH. J Clin Endocrinol Metab 2020;105(8):2740–2751. (Ref 27 of the CRISP paper; the 763-survivor "Reproductive Window" cohort that seeded the regimen list.)
- **Din HN, …, Su HI.** Perceived and Objective Fertility Risk Among Female Survivors of AYA Cancer. JAMA Netw Open 2023;6(10):e2337245; PMID 37819662; PMC10568355. (Same cohort; classifies treatments into low/moderate/high gonadotoxicity and shows perceived risk has minimal agreement with objective risk, κ=0.19 — the clinical motivation for CRISP-style counseling.)
- **NCI R01CA271104** (Su, UCSD): "Evaluation of a Telehealth Oncofertility Care Intervention in AYA Cancer Patients: a Stepped Wedge Cluster Randomized Controlled Trial" — 18 oncology clinics, 3 health systems; EHR-based screening + telehealth counseling + financial navigation. Grant abstract does not name CRISP, but this is the lab's active implementation vehicle.
- **Yoeun SW, McMenamin SB, Flores Ortega R, et al. (2025).** Fertility Preservation Benefit Mandates: A Toolkit to Improve Effectiveness. UCSD + Alliance for Fertility Preservation (policy toolkit on the site, not a CRISP methods paper).
- No CRISP validation or update paper after 2023 was found (PubMed esearch 2026-11-02; "cancer related infertility score predictor" and "oncofertilityrisk" are not indexed phrases; the 2024 Oncofertility Consortium abstract book has no CRISP match).

---

## 6. Every literature reference found that the tool/papers cite for RISK ESTIMATES

From the site:
- Green DM et al. The cyclophosphamide equivalent dose… Pediatr Blood Cancer (DOI 10.1002/pbc.24679) — cited by the CED calculator page.

From the CRISP paper's reference list (risk-estimate-relevant subset; the full list is 46 refs, many on usability/implementation methods):
1. Barton SE et al. (2013). Infertility, infertility treatment, and achievement of pregnancy in female survivors of childhood cancer. Lancet Oncol.
2. Chemaitilly W et al. (2017). Premature ovarian insufficiency in childhood cancer survivors. J Clin Endocrinol Metab.
3. Letourneau JM et al. (2012). Acute ovarian failure underestimates age-specific reproductive impairment. Cancer.
4. Meacham LR et al. (2020). Standardizing risk assessment for gonadal insufficiency. J Adolesc Young Adult Oncol. (ref 15)
5. Clark RA et al. (2020). Predicting acute ovarian failure in childhood cancer survivors. Lancet Oncol. (ref 16)
6. Su HI, Kwan B, Whitcomb BW et al. (2020). Modeling variation in the reproductive lifespan of female AYA cancer survivors using AMH. J Clin Endocrinol Metab 105(8):2740–2751. (ref 27)
7. Chandra A, Copen CE, Stephen EH (2013). Infertility and impaired fecundity in the United States, 1982–2010: NSFG. Natl Health Stat Rep 67. (ref 28 — basis of the "general population 10–20%" low-risk anchor)
8. Green DM, Nolan VG, Goodman PJ et al. (2014). The cyclophosphamide equivalent dose… Pediatr Blood Cancer 61(1):53–67. (ref 29)
9. Children's Oncology Group Long-Term Follow-Up Guidelines v5.0 (2018). (ref 44)
10. van Dorp W, Mulder RL, Kremer LCM et al. (2016). Recommendations for POI surveillance for female survivors of childhood, adolescent, and young adult cancer. J Clin Oncol 34(28):3440–3450. (ref 45)

Comparator/prior online tools cited (refs 22–24): Save My Fertility (savemyfertility.org), Alliance for Fertility Preservation "Fertility Risks from Treatment" page (allianceforfertilitypreservation.org/fertility-risks-from-treatment/).

IMPORTANT caveat: these are the references cited IN THE PAPER. The per-regimen primary studies behind each of the 60 risk estimates (the output of the PubMed/WoS/Embase/FDA-insert review) are not enumerated in any opened source; they surface only inside the tool's per-query risk summary PDF.

---

## 7. Questions for the Nov 11 UCSD meeting

1. **The table:** Can you share the full 60-regimen risk table with its per-regimen reference mapping (the database behind the tool)? The 2023 JAYAO paper and its supplement publish only the search strategy, not the mapping. Is there a plan to publish it?
2. **Adjudication:** Who were the "two clinician investigators" who reached consensus on the risk assignments, and was inter-rater agreement or any structured evidence-grading (e.g., GRADE) recorded? How were FDA package-insert data weighed against cohort data?
3. **Update cadence:** How often is the evidence base re-reviewed, and how many crowd-sourced regimens have been verified and added since launch? Is there a changelog we could point to? (Page lastmod dates run 2024–2026, but those look like CMS edits.)
4. **Thresholds:** The 21–70% moderate band is wide and the moderate/high cut was a clinician-team choice. Has any work since 2023 examined whether these bands match how patients and providers actually act on them (e.g., in light of Din 2023's κ=0.19 perception-vs-objective finding)?
5. **Validation:** Is any calibration/validation against observed fertility outcomes underway — e.g., within the Reproductive Window cohort or the R01CA271104 stepped-wedge telehealth trial? Is CRISP embedded in that trial's counseling workflow?
6. **Male version:** The tool is explicitly female-only. Is a male/testicular gonadotoxicity version planned, and would they collaborate on one? (Directly relevant to our product's male-fertility focus.)
7. **Licensing/embedding:** Can third parties cite, link, deep-link, or embed CRISP (or consume its database via an API)? Is there a license, data-use agreement, or collaboration pathway — and who owns the IP (UCSD, the lab, CBCRP terms)?
8. **Scope boundaries:** How should a downstream product handle the "Unknown" category and newer regimens (e.g., immunotherapy, targeted agents) that the 60-regimen set may not cover — and is expanding beyond the original cohort-seeded regimen list on the roadmap?

## Added 2026-11-04: intake-triage question for the Nov 11 meeting

9. When a patient decides they want to act, what intake criteria does your team use to
   triage and fast-track oncofertility referrals (days until treatment starts, age,
   regimen, payer)? We want to build a "ready to act" mini-intake that asks the same
   questions and orders the patient's next steps the way your navigators would, and we
   would rather mirror your triage logic than invent one.

10. Should a patient-facing tool include "getting ready to preserve" lifestyle content at all
    (heat, smoking, testosterone, cannabis effects on sample and egg quality)? We built it,
    sourced to ASRM and Cleveland Clinic patient pages, but want your read on whether it helps
    preparation or adds stress for newly diagnosed patients.

## Added 2026-11-09: measurement questions for the meeting (RCAC and trial design)

11. **RCAC in a decision-stage tool:** You are an author on both RCAC papers. Could we
    have permission to use the items in the tool, and which subscales would you use for
    a tool that serves newly diagnosed patients as well as survivors? The becoming-pregnant
    items read oddly pre-treatment, and RCAC-M failed structure confirmation in its only
    validation. What should newly diagnosed users and users with testes get instead?
12. **Outcome matching:** Which instruments do your telehealth and rural trials use
    (decisional conflict, knowledge, RCAC, regret, concordance)? We want our pilot's
    outcomes to match yours so comparison stays possible.
13. **Sponsorship:** Our mentor suggested a clinician-sponsored pilot (IRB study). Would
    UCSD or your team sponsor or co-sponsor it, or is the City of Hope survivorship/social
    work side the right home? We would keep all study data in the sponsor's systems.
14. **The 4+ flag:** The 2014 paper proposes a subscale mean of 4 or above as a provisional
    flag. Is that appropriate for routing a consumer-tool user toward mental health
    resources (per Gorman 2015 on depression), given clinical cutoffs are not validated?


## Added 2026-11-11: permission on record

In the 2026-11-11 meeting, Dr. Irene Su gave Helen verbal permission to use
CRISP and her related research in this tool. Get it in writing (one email
line) before public launch; until then this note is the record.
