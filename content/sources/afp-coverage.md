# Alliance for Fertility Preservation: coverage map extraction

- **Recommended by:** Dr. Irene Su, in Helen's 2026-11-10 conversation.
- **Date retrieved:** 2026-11-10.
- **What was read:** the coverage-map page's own embedded dataset
  (`filterable_state_posts` on /resources/coverage-map/, the same data the
  interactive map renders), the filter taxonomy from the page markup, and all
  45 per-state pages under /states/.
- **Taxonomy (AFP's own filter labels, term id = label):**
  55 Large Group Employer, 56 Small Group Employer, 57 Individual,
  58 State Employee Benefits Plan, 59 Medicaid; 60 Sperm Banking,
  61 Oocyte (Egg) Banking, 62 Embryo Banking, 63 Ovarian Tissue
  Cryopreservation, 64 Storage; 65 Coverage Limited to Cancer,
  66 Coverage Limited to Cancer and Other Specific Diseases, 67 Includes
  Religious Exemption, 68 Prior Authorization Prohibited, 69 Coverage
  Limited to Large Group Employer Plans Only.
- **What we reproduce:** per-jurisdiction term sets as structured data in
  content/app/state-coverage.ts (23 jurisdictions: 21 states + DC + FEHB +
  VHA; California excluded because lib/coverage.ts carries the verified
  SB 600 / SB 729 logic). Bill numbers are NOT reproduced; each verdict
  deep-links the AFP state page, which carries bill text and history.
- **Why no bill numbers:** the state pages mix enacted and pending bills and
  an automated extraction could not reliably tell them apart. Linking AFP
  keeps the claim honest and the maintenance on the org that tracks it.
- **Caveats:** AFP is an advocacy organization and the map is its tracking,
  so verdicts say "per the Alliance for Fertility Preservation's tracking"
  and always include the verify-with-your-plan step. Self-funded employer
  plans are exempt from every state mandate (ERISA), which the engine
  enforces before any state verdict.
- **Staleness plan:** re-pull the dataset before launch and quarterly; the
  extraction is scripted in the session scratchpad and takes minutes.
