# Data architecture: patient journeys and care-team tracking

Last reviewed: 2026-11-02. Design for Helen's ask: City of Hope social workers and the care team want to know where their patients are in the process (reached out to a clinic, had a consult, decided not to preserve, and so on).

## The constraint that shapes everything

The product's promise, printed on the privacy page and load-bearing for user trust, is that answers never leave the device. The moment stage data flows from a patient's phone to a care team, it is identifiable health information tied to a cancer diagnosis: PHI. That requires, at minimum, a HIPAA business associate agreement between City of Hope and whoever hosts the backend, real authentication for staff, audit logging, and probably City of Hope IRB/compliance review. None of that is a reason not to do it; it is a reason to stage it deliberately.

## The shared vocabulary (built now)

`lib/journey.ts` defines the stage model both sides will speak:

- Stages: `learned_risk`, `talked_care_team`, `checked_coverage`, `contacted_clinic`, `had_consult`, `started_preservation`
- Outcomes: `completed`, `decided_not_to`, or still deciding (null)
- Anti-anxiety rules are part of the model: no percentages, no "incomplete," and `decided_not_to` is a finished, respected endpoint, which is exactly what a social worker needs to see to stop outreach gracefully.

Keep these ids stable; they are the future wire format.

## Three architectures, in order of when they can exist

### A. Patient-held journey (SHIPPED, v1)

The patient checks off stages on their own device (`JourneySection`), stored in local storage only. The printed/PDF summary includes their status lines, so the existing social-work workflow (patient brings or sends their summary; social worker records status in their own system) gets structured, consistent status language at zero privacy cost. The care team's tracker is whatever they already use (their EHR notes, a REDCap project, a spreadsheet); this app feeds it through the patient's own hands.

- Cost: nothing new. BAA: none needed. Ship date: now.
- Limit: no passive visibility; the team sees status only when the patient shares.

### B. Check-in codes (the pragmatic middle, v2 candidate)

The social worker's dashboard (a tiny separate staff app) generates a short code per patient (e.g., `ANCHOR-7F3K`), recorded in their own patient list. The patient can enter the code once, and from then on the app sends ONLY journey events (stage id + date, no answers, no risk inputs, no diagnosis, no ZIP) to a backend keyed by that code. The staff app shows each code's stage. The mapping code-to-person lives solely inside City of Hope.

- Honest assessment: pseudonymized is not anonymized; the linkage makes it PHI, so this still needs a BAA with the hosting vendor (Supabase has HIPAA plans with BAAs; we know the platform well from Dyad) and City of Hope sign-off. But the payload is minimal, patient-initiated, revocable (an "unlink" button that is honored server-side), and the patient app keeps its "your answers never leave the device" promise literally: answers never do, only stage checkmarks after explicit opt-in, with the privacy page updated to say exactly that.
- Consent screen is non-negotiable and plain: "Share my checklist, and only my checklist, with my care team. You can stop any time."

### C. Full care-team platform (v3, if the program wants it)

Staff SSO (City of Hope identity), patient accounts or coded enrollment, journey plus optional structured flags the patient chooses to share (e.g., "insurance denied, appealing"), caseload views, outreach reminders for social workers, audit trail. This is an EHR-adjacent product: BAA, security review, retention policy, breach obligations, and realistically IRB conversation if anyone wants to study the data. Architecture follows Dyad's shape (Next.js + Supabase with row-level security), but on a HIPAA-eligible tier with PHI isolated in its own project, never the Lovable-era one.

## Recommendation

Ship A now (done). Bring B to Estella as the proposal, with the consent screen mocked, because it preserves the tool's promise while giving her team the visibility they actually asked for, and the BAA conversation can start with a one-page payload description ("six stage ids and dates per code"). Hold C until the program commits staff to using it.

## What never changes

Whatever tier: risk inputs, diagnosis, age, ZIP, and insurance answers stay on the device. The only data class that ever crosses the wire is journey stages, by explicit, revocable, patient-initiated consent.
