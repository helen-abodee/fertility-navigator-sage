# Measuring whether the Navigator works (RCAC and friends)

Drafted 2026-11-09 from Helen's research brief on the RCAC scale, ahead of the
Dr. Su meeting. Companion artifact: "Navigator Measurement Plan" (claude.ai).

## The framing decision

RCAC measures worry. The Navigator is an education and decision-support tool,
so the outcomes it can plausibly move in one session are knowledge, decision
readiness, and risk-perception accuracy. RCAC belongs in the plan as the
4-week wellbeing outcome for the reflection path (fertility potential and
acceptance subscales track exactly what that path works on), not as the
primary KPI. Gorman 2019's own conclusion supports this: use it as a profile
of six subscale scores, never one total.

## Hard constraints the plan must respect

1. **Anti-anxiety principle.** The product never shows scores. Any in-product
   RCAC use must render as words per dimension (what weighs on you), not
   numbers, and must route somewhere useful (care team, mental health
   referral), never to a dashboard.
2. **Privacy lanes.** RCAC answers are health data. Lane 1 analytics cannot
   carry them (allowlisted event names only). On-device scoring is fine.
   Server-side collection means lane 2 consent or an IRB study where the
   SPONSOR's systems (REDCap) hold the data, not ours.
3. **Copyright and vetted language.** The 18 items are the authors'
   instrument. Do not paste them into the product without permission.
   Dr. Su is an author on both papers; ask her directly.
4. **Validity limits.** Validated in female survivors 18-45. Not validated
   in newly diagnosed patients (becoming-pregnant items read oddly
   pre-treatment), and the male RCAC-M failed structure confirmation in its
   only validation (n=32, Portuguese). Journey-stage gating applies: this is
   a survivor/post-decision instrument unless Dr. Su says otherwise.
5. **No care-team data without a BAA.** Process outcomes (referral made,
   consult attended, preservation completed) can only come from chart review
   under the sponsoring clinician's IRB, in their systems.

## Three tiers of incorporation

### Tier 1, now: measure around the product, not inside it
The tool does not change. A sponsor-run REDCap (or Qualtrics) survey carries
all instruments pre and post. To verify exposure without linking our data to
identities, the summary screen can show an on-device-generated short
completion code the participant types into the survey. No server linkage,
lane 1 stays pure.

### Tier 2, after Su permission: an on-device concern check-in
An optional module under My progress ("A check-in on the worry itself" or
similar), for the survivor and post-decision lanes:
- Fertility potential + acceptance subscales (6 items) by default; full 18
  for survivors if she advises.
- Scored on device. Results shown as words per dimension, never numbers.
- A subscale mean of 4+ (the authors' provisional flag) routes to "this is
  worth bringing to your care team" plus the mental-health arm of ASCO GPS
  6.4, citing Gorman 2015 (reproductive concerns associated with depression).
- Optional extra in the share code, like riskLabel today: patient chooses
  whether the care team sees their concern areas.
- Males: do not score (RCAC-M is not validated). Either skip or offer the
  same questions unscored as reflection prompts. Ask Dr. Su.

### Tier 3, the mini trial (Kaylin's suggestion)
A clinician sponsor-investigator with an institution (UCSD or the City of
Hope teams) holds the IRB; the LLC cannot be the IRB home and should not
touch study data. Phase 1 is a single-arm pre/post feasibility study, n
roughly 30-60 AYA patients and survivors:
- **Primary, same-visit:** decisional conflict (SURE, 4 items) and a 10-15
  item knowledge test adapted from Peate 2012 / Ehrbar 2019, pre and post.
- **The gem:** perceived vs objective risk concordance (Din 2023, Su senior
  author, baseline kappa 0.19). Participant states their perceived risk
  before and after using the tool; the tool's CRISP-derived guideline
  category (printed on the summary) is the comparator. This directly tests
  whether the risk screen works, using her own measure.
- **4 weeks:** RCAC fertility potential + acceptance subscales.
- **6 months:** Decision Regret Scale.
- **Feasibility:** completion rate, time on tool, which tabs opened (lane 1
  events are enough for this).
- **If the BAA path opens:** process counts by chart review at 12 weeks,
  mirroring Su's rural trial primary outcome.
Phase 2 would randomize (waitlist or information-sheet control) powered on
SURE/knowledge, ideally inside her telehealth infrastructure.

## Questions added to the Dr. Su list (crisp-methodology.md #11-14)
11. RCAC permission and fit for a decision-stage tool; what to do for newly
    diagnosed users and males.
12. Which instruments her telehealth and rural trials use, so our outcomes
    match and comparison stays possible.
13. Would UCSD (or she personally) sponsor or co-sponsor a pilot IRB study
    of the tool, or should the City of Hope teams hold it?
14. Is the 4+ subscale flag appropriate for routing a consumer-tool user to
    mental health resources, given cutoffs are not clinically validated?

## What we are NOT doing
- No RCAC items in the product before permission.
- No concern scores displayed as numbers, ever.
- No RCAC data to our Supabase in any lane currently built.
- No male scoring on an unvalidated instrument.
