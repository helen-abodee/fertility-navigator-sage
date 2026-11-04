# Prompt for Claude (cowork) to draft the stakeholder slides

Paste everything below the line into Claude, and attach these two files from
~/navigator: `content/SOURCE-MAP.csv` and `docs/HIPAA-BRIEF.md`.

---

I'm building an unbranded, free, mobile-first web tool for adolescents and young adults (15-45) with cancer who are deciding whether to preserve their fertility, developed with input from a comprehensive cancer center's social work and survivorship team. I need a slide deck (10-12 slides) to present to my mentor, the cancer center's social workers, and Dr. Irene Su's team at UCSD, whose CRISP tool and insurance toolkit are two of our core sources. The deck's job: show them exactly what inputs and sources power each part of the product, so they can validate or correct them. Audience is clinical and academic; the tone is rigorous and humble, not a startup pitch. No patient-identifiable anything; the product is unbranded (never name the cancer center).

I'm attaching two files: SOURCE-MAP.csv (every screen and input mapped to its source, grouped by area) and HIPAA-BRIEF.md (our data-custody model).

Structure I want:
1. One slide: what the tool is and the design principles (anti-anxiety: "not sure" is always a valid answer; never pushes toward or away from preserving; every fact cited with its date; 6th-8th grade reading level; answers never leave the device).
2. One slide: the patient flow in one diagram (entry triage with five lanes including "no treatment plan yet" and "just learning"; three themed survey sections; risk screen; tabbed results hub).
3. One slide: the risk assessment. Key points: it returns guideline categories, never personal probabilities; the primary source is UCSD's CRISP tool (matched by diagnosis + regimen + age, with each result's underlying study citation); fallback rules come from the Livestrong/Fertile Hope charts, ESMO 2020, and COG survivorship guidelines; everything dose-dependent honestly says "depends on your dose, ask for your CED."
4. One slide: the "whether I want children" reflection path, sourced from the Ottawa Personal Decision Guide, the BEFORE decision aid, Cancer Fertility and Me, and the CDC reproductive life plan, with equipoise (never leaning a direction) as the design rule.
5. One slide: insurance and money. SB 600 (2019, fertility preservation as a basic benefit pre-treatment) and SB 729 (IVF coverage from 2026 plan years), the coverage checker's verdict logic, the cost estimator that starts at procedure-only prices with storage as an opt-in add-on, and the re-verified financial aid directory with a soft eligibility check.
6. One slide: the clinic directory and map (17 clinics from the center's own resource list, every fact from each clinic's own website with retrieval dates, "not published" when absent, never estimated).
7. One slide: the care-team loop. Patient-held journey checklist with three equal outcomes (preserved / still deciding / not preserving); progress sharing where the patient is always the sender; the pilot one-tap sync and its inbox model.
8. One slide: data custody and HIPAA, straight from the brief: granularity is not the trigger, custody is; the table of what's shareable patient-sent vs server-mediated; what a BAA path would require.
9. One slide: what we're asking this audience: validate the risk mapping against their counseling practice, the regimen lists, the triage criteria they use when a patient is ready to act (we deliberately haven't built intake triage until we hear theirs), and the pathway to officially citing/embedding CRISP.
10. One slide: open gaps, honestly: the clinical risk document still pending from the survivorship NP, no outcome validation of CRISP published, male risk tables thinner than female, attorney-reviewed LGBTQ+ legal module pending.

For each slide, give me: a headline that states the point (not a topic label), 3-5 tight bullets, and a speaker note of 2-3 sentences. Pull specifics (sources, dates, numbers like "66 sourced rows," "$12,400 published egg-freezing cycle," "135 CRISP treatments enumerated") from the attached CSV rather than inventing. Flag anything in the CSV that seems thin so I can shore it up before presenting. No em dashes anywhere.
