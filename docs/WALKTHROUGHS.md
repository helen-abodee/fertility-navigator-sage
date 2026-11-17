# Canonical walkthrough personas (audit list)

The paths to walk when auditing the tool, each tied to the e2e test that
guards it. "Woman/man" shorthand = the anatomy answer; the tool itself asks
about anatomy, not gender.

| # | Persona | Entry + key answers | What must be true | e2e guard |
|---|---------|--------------------|-------------------|-----------|
| 1 | Before treatment, woman | Plan lane, "Not yet", ovaries | Egg/embryo/tissue options; risk from CRISP; Financing; NO Health, NO Family building | "the checkpoint path walks end to end" + "the hub tabs carry the real cited content" |
| 2 | Before treatment, man | No-plan lane, testes | Sperm banking + TESE; NO Health, NO Family building | "before-treatment man sees the pre-treatment path" |
| 3 | In treatment, woman/man | Plan lane, "Already started" | Sperm banking still shown (ASCO 3.5 counseling); NO Health, NO Family building | covered by tab-gating assertions |
| 4 | After treatment, woman | Finished lane, ovaries | Egg/embryo (post-treatment), Health tab, FAMILY BUILDING tab with all six paths, POSITIVE-trial fact | "after-treatment woman walks her own path" |
| 5 | After treatment, man | Finished lane, testes | Fertility-check guidance, banked-sperm line, Health + Family building tabs | "Medi-Cal survivors get the honest verdict" |
| 6 | Just learning | Browse lane | Everything visible, nothing personalized | "'just learning' goes straight to the browse hub" |
| 7 | Unsure about children | Any lane, feelings "I'm not sure" | Reflection path offered, skippable, lands safely | the two reflection tests |
| 8 | Answering for someone else | Caregiver lane | UNDER REVIEW: Estella wants it removed; Helen hasn't decided | none yet |

Cross-cutting checks on every persona: skipped answers never hide content,
every fact shows "Where this comes from", no urgency or guilt copy (tone
tests), summary prints, Ask answers only from the corpus.
