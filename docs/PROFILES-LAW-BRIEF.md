# User Profiles and the Law: What Actually Applies to Us

Plain-language brief for a direct-to-consumer fertility-preservation navigator for cancer patients, California-focused, not operated by or on behalf of any clinic or health plan. All sources retrieved 2026-11-05. This is research, not legal advice; lane 2 decisions should go through counsel.

**The one-line correction to "no HIPAA = no rules":** HIPAA probably does not apply to us, and that is exactly why three other regimes do. The FTC's Health Breach Notification Rule, California's CMIA, and the CCPA/CPRA were all extended in 2022 to 2024 specifically to catch consumer health apps that fall outside HIPAA. Regulators have already fined fertility and mental-health apps under them.

---

## (a) When HIPAA applies to an app, and when it does not

HIPAA covers "covered entities" (providers, plans, clearinghouses) and their "business associates" (vendors handling patient data on a covered entity's behalf). An app developer is regulated only if it fits one of those boxes.

OCR's guidance, "Health App Use Scenarios and HIPAA," walks through this with concrete scenarios:

- **Not covered:** a consumer finds and downloads the app on their own and enters their own health information (symptoms, cycle data, treatment history they typed in themselves). The developer is not a business associate, even if the user later chooses to send data to their doctor. The consumer's own decision to share with a provider does not create a HIPAA relationship for the developer.
- **Covered (business associate):** the app is offered **by or on behalf of** a covered entity; a provider **contracts with the developer** and directs patients to the app as part of care (patient management, monitoring, messaging); or the developer builds **interfaces into the provider's EHR** and handles data on the provider's behalf. Who pays matters: if a provider or plan pays for or commissions the app, OCR leans toward business-associate status; if the consumer chooses and uses it independently, OCR leans against.

Sources:
- OCR, Health App Use Scenarios & HIPAA (PDF): https://www.hhs.gov/sites/default/files/ocr-health-app-developer-scenarios-2-2016.pdf
- HHS health apps guidance hub: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-apps/index.html
- Scenario-by-scenario analyses: https://www.haynesboone.com/news/publications/ocr-hipaa-guidance-for-mobile-health-developers and https://healthlawcenterplc.com/hipaa-when-are-mobile-app-developers-business-associates/

**What this means for us:** as long as patients find us themselves and no clinic commissions, pays for, or integrates with the app, HIPAA does not apply. The moment we partner with an oncology practice that "prescribes" the app or we push data into a clinic's EHR under contract, we become a business associate and HIPAA attaches, with a required Business Associate Agreement, Security Rule compliance, and breach duties.

---

## (b) The laws that DO apply to a non-HIPAA health app with profiles

### 1. FTC Health Breach Notification Rule (16 CFR Part 318, amended 2024)

The FTC finalized amendments in April 2024 (effective July 29, 2024) that **explicitly cover health apps and online services not subject to HIPAA**. An app that holds identifiable health information drawn from multiple sources (user-entered answers plus, say, account or device data) is a "vendor of personal health records" or PHR-related entity. Fertility and cancer-treatment data are squarely the kind of "PHR identifiable health information" the rule covers.

Key points:

- **"Breach" is not just hacking.** The 2024 rule confirms that an **unauthorized disclosure** counts, including voluntarily sending user health data to an ad or analytics third party without authorization. Sharing fertility answers with an SDK is a reportable "breach."
- **Duties when a breach happens:** notify affected individuals without unreasonable delay and within 60 calendar days of discovery; notify the FTC (simultaneously with consumer notice if 500+ people affected); media notice in some cases; the notice must name the third parties that got the data.
- **Penalties:** civil penalties per violation per day, enforced by the FTC.

Enforcement record (all pre-dating the 2024 amendment, under the original rule plus FTC Act Section 5):

- **GoodRx (Feb 2023), $1.5M:** first-ever HBNR action. Shared medication and health-condition data with Facebook, Google, and Criteo for ad targeting, never told users, displayed a fake HIPAA seal. Permanently banned from sharing health data for advertising.
- **Premom / Easy Healthcare (May 2023), $100K federal plus $100K to states:** an **ovulation and fertility tracker**, the closest analog to us. Sent cycle, fertility, and pregnancy data plus geolocation to Google, AppsFlyer, and two China-based analytics SDKs (Umeng, Jiguang) despite promising not to. HBNR violation for failing to notify users of the unauthorized disclosures; banned from sharing health data for ads; ordered to have third parties delete the data.
- **BetterHelp (2023), $7.8M refunded to consumers:** Section 5 (deception) rather than HBNR. Fed intake-questionnaire answers, emails, and IPs to Facebook, Snapchat, Criteo, and Pinterest for ad audiences after promising limited use. First FTC order returning money to consumers over health data.

Sources:
- Final rule press release: https://www.ftc.gov/news-events/news/press-releases/2024/04/ftc-finalizes-changes-health-breach-notification-rule
- Rule page (16 CFR Part 318): https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule
- GoodRx: https://www.ftc.gov/news-events/news/press-releases/2023/02/ftc-enforcement-action-bar-goodrx-sharing-consumers-sensitive-health-info-advertising
- Premom: https://www.ftc.gov/news-events/news/press-releases/2023/05/ovulation-tracking-app-premom-will-be-barred-sharing-health-data-advertising-under-proposed-ftc
- BetterHelp final order: https://www.ftc.gov/news-events/news/press-releases/2023/07/ftc-gives-final-approval-order-banning-betterhelp-sharing-sensitive-health-data-advertising
- 2024 amendment analysis: https://www.insideprivacy.com/health-privacy/ftc-issues-final-rule-to-expand-scope-of-the-health-breach-notification-rule/

### 2. California CMIA (Civil Code 56 et seq.), especially 56.06

This is the big one for us, and the least known. CMIA is California's medical-confidentiality law for providers. Section 56.06 **deems certain consumer-software businesses to BE providers of health care** for CMIA purposes:

- **56.06(b):** "Any business that offers software or hardware to consumers, including a mobile application or other related device that is designed to maintain medical information in order to make the information available to an individual or a provider of health care at the request of the individual or a provider of health care, for purposes of allowing the individual to manage the individual's information, or for the diagnosis, treatment, or management of a medical condition of the individual, shall be deemed to be a provider of health care subject to the requirements of this part."
- **56.06(e):** the same deeming rule for "any business that offers a **reproductive or sexual health digital service** to a consumer." Added by **AB 254 (2023, effective Jan 1, 2024)**, which also expanded "medical information" in 56.05 to include "reproductive or sexual health application information": data about fertility, menstrual cycle, pregnancy, plans to conceive, and anything from which those can be inferred. Mental-health digital services were added the year before by **AB 2089 (2022, effective Jan 1, 2023)**. (The related **AB 1242 (2022)** is the law-enforcement shield: it blocks California companies from aiding out-of-state warrants targeting abortion-related data.)

A profile that stores a user's cancer diagnosis context and fertility-preservation answers hits both subdivisions. Consequences of being a deemed provider:

- No disclosure of medical information without a valid signed authorization (Civil Code 56.10 and 56.11), with narrow exceptions. Routine sharing with analytics or ad vendors is a violation, full stop.
- Duty to maintain confidentiality; negligent release creates liability.
- **Penalties (56.36):** private right of action with **$1,000 nominal damages per violation with no proof of actual harm** (class-action fuel); actual damages; administrative fines up to $25,000 per negligent violation and **up to $250,000 per violation** for knowing/willful use or disclosure for financial gain.

Sources:
- Civil Code 56.06 text: https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=56.06 (mirror: https://codes.findlaw.com/ca/civil-code/civ-sect-56-06/)
- Civil Code 56.05 definitions: https://codes.findlaw.com/ca/civil-code/civ-sect-56-05/
- AB 2089 (mental health digital services): https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202120220AB2089
- AB 254 (reproductive/sexual health digital services): https://calmatters.digitaldemocracy.org/bills/ca_202320240ab254
- CMIA penalties overview: https://stateslaws.com/california-cmia-coverage-authorization-and-penalties/

### 3. CCPA/CPRA (Civil Code 1798.100 et seq.)

- Health data, including "personal information collected and analyzed concerning a consumer's health," is **"sensitive personal information"** under 1798.140, triggering the right to limit use and heightened obligations.
- **But the law only applies to a "business":** a **for-profit** entity doing business in California that meets at least one threshold: more than $25M annual gross revenue (inflation-adjusted); buys/sells/shares personal information of 100,000+ consumers or households per year; or derives 50%+ of revenue from selling or sharing personal information.
- **A nonprofit is not a "business" and is not covered.** A small for-profit under all three thresholds is also not covered. And personal information governed by CMIA is exempted from CCPA anyway (1798.145), so for us CMIA, not CPRA, does the work either way.

Sources:
- CCPA overview and thresholds: https://en.wikipedia.org/wiki/California_Consumer_Privacy_Act
- Covered-business FAQs: https://www.jacksonlewis.com/insights/navigating-california-consumer-privacy-act-30-essential-faqs-covered-businesses-including-clarifying-regulations-effective-1126

### Backdrop: the regulators are watching this exact category

In July 2023 the FTC and OCR sent a joint letter to ~130 hospitals and telehealth companies warning about Meta Pixel and Google Analytics sending health data to third parties, citing GoodRx, BetterHelp, Premom, and Flo Health by name. Third-party tracking on health products is the single behavior that has drawn every recent enforcement action.

Source: https://www.mintz.com/insights-center/viewpoints/2826/2023-07-24-ocr-and-ftc-issue-joint-statement-warning-health-care

---

## (c) The two-lane framework

### Lane 1: anonymous engagement analytics, zero health data. Do now.

Event-level product analytics that carry **no health information and no identity**: page views, feature usage, session counts, button clicks, funnel steps, with anonymous or rotating IDs and no cross-site tracking. Cookieless, privacy-first tools (Plausible, Vercel Analytics, self-hosted Umami) are built for exactly this.

Why this is near-zero legal weight:

- No HIPAA (we are not a covered entity or BA regardless).
- No HBNR exposure: the rule governs "PHR identifiable health information"; an event stream with no health content and no identifiable individual is outside it.
- No CMIA exposure: CMIA protects "individually identifiable" medical information; anonymous feature-usage counts identify no one and contain no medical facts.
- No CCPA issue if we are a nonprofit or under thresholds, and aggregate/de-identified data is excluded from "personal information" anyway.

**Where the line is.** The event NAME and PAYLOAD are what matter, not the tool. These cross the line:

- Sending **answer values** into analytics: `survey_answer {question: "sperm_banking", value: "yes"}` is health data.
- Event names that encode health state: `viewed_azoospermia_options`, `clicked_ivf_after_chemo`. Visiting a specific condition page tied to a persistent ID is exactly the pixel pattern the FTC and OCR called out.
- Attaching email, user ID, or any identifier that links events to a known person whose health status can be inferred.
- Ad-tech SDKs or pixels (Meta, Google Ads, TikTok) anywhere in the product. This is what GoodRx, Premom, and BetterHelp were fined for.

Safe pattern: generic page paths and feature events (`started_quiz`, `completed_quiz`, `opened_clinic_finder`), anonymous IDs, no custom properties carrying answers, no third-party ad or social SDKs. If a page URL itself reveals condition detail, roll it up before sending (`/guide/*` not `/guide/testicular-cancer-sperm-banking`).

### Lane 2: user profiles storing survey answers. Do with counsel.

The moment we store a named account containing fertility/cancer survey answers, we are, in California, a **deemed provider of health care under CMIA 56.06** and a **PHR vendor under the FTC HBNR**. That is workable (every period-tracker operates here) but it is a real compliance posture, not a toggle:

- CMIA provider-grade confidentiality: no disclosure without signed authorization, vendor contracts that forbid secondary use, exposure to $1,000-per-user no-harm-needed lawsuits.
- HBNR breach program: ability to detect, and notify users/FTC within 60 days of, any breach, where "breach" includes our own unauthorized sharing.
- This needs a legal entity to carry the liability, a truthful published privacy policy (the FTC's Section 5 cases are mostly "you broke your own promises"), and a written security program.

---

## (d) Lane 2 checklist (if/when pursued)

1. **Form the entity first.** LLC or nonprofit before the first profile is stored; the CMIA/HBNR liability should never sit on a person.
2. **Engage privacy counsel** for a one-time review: CMIA 56.06 posture, HBNR applicability memo, privacy policy, terms.
3. **Privacy policy that tells the truth**, written before launch: what is collected, what is never shared, retention, deletion. Every FTC case above started with a broken promise.
4. **Signed, CMIA-grade authorization flow** for any disclosure beyond serving the user (56.11 has specific formatting requirements); default to zero disclosure.
5. **Written security program:** encryption at rest and in transit, access controls, audit logging, vendor inventory. Only vendors under contracts barring secondary use (standard DPAs; no ad-tech).
6. **Breach response plan:** detection, 60-day notification clock, FTC reporting path for 500+ users, template notices naming recipients.
7. **Keep lanes physically separate:** profile database never feeds the analytics pipeline; analytics stays lane-1 clean even after profiles exist.
8. **Data minimization and deletion:** store only answers the product needs, honor deletion requests completely, set a retention schedule (the GoodRx order required a public one).
9. **Re-check HIPAA on every partnership:** any clinic that commissions, pays for, or EHR-integrates with us flips us into business-associate territory (BAA plus Security Rule).
10. **No ad pixels or social SDKs, ever**, on any page where a logged-in state or health-specific URL exists.
