# HIPAA, in plain terms, for this product

Last reviewed: 2026-11-03. Written for Helen's "make it very clear what we can do" question.

## The one-sentence rule

HIPAA binds providers, health plans, and anyone handling patient data ON THEIR BEHALF. It does not bind patients. A patient doing anything with their own information, including texting their own progress to a social worker, can never violate HIPAA.

## What we can do today, with zero HIPAA exposure

1. **Everything currently shipped.** Answers stay on the device; the progress code is created on the patient's phone and sent by the patient through their own SMS/email. We never touch it. The clinician's board decodes codes locally in their browser. No covered entity's data ever passes through anything we run.
2. **A care-team directory inside the app.** A built-in list of the program's social workers (name, role, phone/email) so the patient picks "my social worker is Maria" instead of typing a number. This is just public staff contact info bundled into the app, like a hospital's website footer. Selecting a person stores the choice on the device; sending still happens through the patient's own phone. No HIPAA trigger. The real constraint is OUR unbranded rule: listing City of Hope staff requires their written permission, so the shipped directory holds clearly labeled sample entries until then.
3. **The clinician's own records.** When a social worker receives a patient's text and keeps notes (in our /team board, their EHR, or a notebook), that is the provider handling data they were given by the patient; it falls under City of Hope's existing HIPAA compliance, not ours. Our board keeps it in their browser only, which makes it easy for them, but their obligations are theirs and already covered by their employer's program.

## What TRIGGERS HIPAA for us

The moment any server we operate receives identifiable patient health information in order to deliver it to the care team, we become a **business associate** of City of Hope. That includes a "send to my care team" button that routes through our backend, our database of patient-to-social-worker links with progress attached, or push notifications containing stage changes. Pseudonyms don't escape it: a code linked to a person is identifiable.

It also chains: if we send via Twilio (SMS) or SendGrid (email) carrying patient info on the provider's behalf, those vendors must sign BAAs with us too.

## If we cross the line on purpose (the v2 "check-in codes" design)

Required, roughly in order:
1. **Business associate agreement** between City of Hope and the operating entity (someone has to be the legal counterparty; today the project has no entity).
2. **HIPAA-eligible infrastructure** with a BAA from the host (Supabase, AWS, and GCP all offer this on specific tiers).
3. **Safeguards**: encryption in transit and at rest, real authentication for staff (ideally City of Hope SSO), role-based access, audit logging of every access, minimum-necessary data design (our stage-only payload already is), retention and deletion policy, and a breach-notification plan (HIPAA requires notifying within 60 days).
4. **City of Hope's own gauntlet**: their security/privacy office review, and possibly IRB if anyone studies the data.

None of this is prohibitive; it is a sequencing decision. The product's current design intentionally gets the full patient value and most of the clinician value without any of it.

## How much data can we share without triggering HIPAA? (Helen's question)

The surprising answer: **granularity is not the trigger. Custody is.**

| Data | Patient sends it themselves (print, their own text/email, a code they hand over) | It passes through a server we run |
|---|---|---|
| Journey stages only | No HIPAA | HIPAA (business associate) |
| Stages + risk group | No HIPAA | HIPAA |
| Stages + options considered + coverage status | No HIPAA | HIPAA |
| The entire results summary, answers and all | No HIPAA | HIPAA |

So if social workers need MORE granular information in a no-BAA MVP, the lever is not shrinking the payload; it is keeping the patient as the sender. The product pattern for that is **per-field consent at the moment of sharing**: checkboxes like "also include my risk group," "include the options I'm considering," "include my coverage status," each off by default, each added to the printed summary and the share code only when ticked. Unlimited richness, zero HIPAA, because the patient is doing the sharing.

The one-tap sync database is the opposite trade: minimal data, maximal convenience, but it IS our server in the middle, so real-patient use needs the BAA no matter how small the payload. Current status: it carries stages plus any ticked extras, and it is gated for demos and pilots until that agreement exists.

## Recommendation

Ship the on-device care-team directory now (sample entries until City of Hope approves names). Bring the v2 check-in-code sync to Estella as a one-page proposal with this brief attached. Decide on an operating entity before signing anything.
