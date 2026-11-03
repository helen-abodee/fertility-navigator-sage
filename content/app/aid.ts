import type { AidOrg } from "../../lib/content-schema";
import { d4, orgSite } from "./citations";

/**
 * Financial aid directory. Seeded from the UCSD/AFP toolkit's philanthropic
 * resources table (D4, pp.14-16, fertility preservation section), then
 * verified against each organization's own website on 2026-11-02 (see
 * content/sources/aid-provenance.md for what changed and why).
 * Age ranges and medical criteria stay in `eligibility` as text; `audience`
 * is used only for coarse filters (treatment stage, anatomy, treatment type).
 * Dollar caps appear only where the source publishes them.
 */
export const aid: AidOrg[] = [
  {
    id: "men_having_babies",
    name: "Men Having Babies",
    what: "Discounted or free fertility and surrogacy services, plus grants, for gay prospective parents. The program runs in two stages.",
    eligibility: "Gay men and transgender women becoming first-time parents.",
    cap: "not published",
    url: "https://menhavingbabies.org/assistance/",
    audience: {},
    citations: [d4(16)],
  },
  {
    id: "allyson_whitney",
    fit: { minAge: 16, maxAge: 36 },
    name: "Allyson Whitney Foundation",
    what: "Life Interrupted Grants of $500 to $1,500 for young adults with rare cancers. Grants can go toward fertility costs like egg retrieval and sperm banking, as well as rent and medical bills.",
    eligibility:
      "US citizen, age 16 to 36, with a rare cancer diagnosis, in active treatment or within 10 months after it. You cannot apply on your own: a facility, such as an oncology social worker, doctor's office, or patient navigator, must request the application for you, and each facility can receive only one award per grant year. Applications open once a year in a spring window, with decisions by about August 1. Awards depend on available funds.",
    cap: "$500 to $1,500 per grant",
    url: "https://allysonwhitney.org/grants/",
    audience: {},
    citations: [
      d4(14),
      orgSite(
        "allyson_whitney",
        "Allyson Whitney Foundation: Life Interrupted Grants",
        "https://allysonwhitney.org/grants/"
      ),
    ],
  },
  {
    id: "chick_mission",
    fit: { minAge: 18, maxAge: 40, stage: "not_started", anatomy: ["ovaries_uterus"] },
    name: "Chick Mission",
    what: "Hope Grants that cover the costs of one egg freezing cycle before cancer treatment. Medication costs are not included. The grant is paid directly to a fertility clinic in their network, so you do not pay first and wait for repayment.",
    eligibility:
      "Female, age 18 to 40, with a cancer diagnosis and a treatment plan that an oncologist says puts fertility at risk, before any chemo or radiation. Available in California, Colorado, Florida, Illinois, Montana, New Jersey, New York, Oklahoma, Pennsylvania, and Texas. Income limits apply (under $150,000 single or $200,000 married). A fertility clinic in their network submits the application for you, before your cycle starts.",
    cap: "not published",
    payUpfront: false,
    url: "https://www.thechickmission.org/hope-grants/",
    audience: { stages: ["not_started"], anatomy: ["ovaries_uterus"] },
    citations: [
      d4(14),
      orgSite(
        "chick_mission",
        "The Chick Mission: Hope Grants",
        "https://www.thechickmission.org/hope-grants/"
      ),
    ],
  },
  {
    id: "expect_miracles_samfund",
    fit: { minAge: 21, maxAge: 39, stage: "finished" },
    name: "Expect Miracles Foundation SAMFund",
    what: "Grants for young adult cancer survivors who have finished active treatment. Family Building grants can help pay for fertility treatment and other paths to parenthood after cancer. Grant amounts vary, and not every applicant can be funded.",
    eligibility:
      "Age 21 to 39 at the time of application, with active cancer treatment completed. Applications open twice a year for about 3 weeks each (Family Building grants usually open in March and September). You hear back 6 to 7 weeks after a cycle closes. As of November 2026 the fall cycles are closed, and the next ones open in early 2027.",
    cap: "not published",
    url: "https://expectmiraclesfoundation.org/get-help/",
    audience: { stages: ["finished"] },
    citations: [
      d4(14),
      orgSite(
        "expect_miracles_samfund",
        "Expect Miracles Foundation: Get Help (SAMFund grants)",
        "https://expectmiraclesfoundation.org/get-help/"
      ),
    ],
  },
  {
    id: "fertility_within_reach",
    name: "Fertility Within Reach",
    what: "Education and advocacy for getting fertility treatment and preservation covered, plus the Banking on the Future grant, which has helped young cancer patients pay for the first year of storage.",
    eligibility:
      "Their website was not reachable when we checked in November 2026, so current program details could not be confirmed. An oncology social worker can help you check whether the grant is still active before you apply.",
    cap: "not published",
    url: "https://fertilitywithinreach.org/",
    audience: {},
    citations: [
      d4(14),
      orgSite(
        "fertility_within_reach",
        "Fertility Within Reach homepage (Internet Archive snapshot of 2026-10-14; live site returned 404 on 2026-11-02)",
        "https://web.archive.org/web/20261014215652/https://fertilitywithinreach.org/"
      ),
    ],
  },
  {
    id: "livestrong_fertility",
    name: "Livestrong Fertility",
    what: "Discounted fertility preservation through partner clinics (at least 25 percent off services) plus free fertility medication from a pharmaceutical partner for approved patients. Discounts are applied at the clinic, so you do not pay full price first and wait for repayment.",
    eligibility:
      "Lawfully present in the US with a confirmed cancer diagnosis, before treatment. Your oncology team confirms that treatment poses a risk to fertility, you choose a Livestrong partner fertility clinic, and you show that insurance will not cover preservation. Egg and embryo freezing applicants must be uninsured or have limited coverage; sperm banking applicants also have income limits (household income of $101,000 or less if single, $130,000 or less if married).",
    cap: "at least 25 percent off partner clinic services, plus free medication for approved patients",
    payUpfront: false,
    url: "https://livestrong.org/how-we-help/livestrong-fertility/",
    audience: {},
    citations: [
      d4(14),
      orgSite(
        "livestrong_fertility",
        "Livestrong Fertility program page",
        "https://livestrong.org/how-we-help/livestrong-fertility/"
      ),
    ],
  },
  {
    id: "nmdp",
    fit: { note: "it is for people with sickle cell disease, not cancer" },
    name: "NMDP (formerly Be The Match)",
    what: "Fertility preservation grants of up to $10,000 for people with sickle cell disease before a transplant. Covers egg retrieval and freezing, semen analysis and freezing, storage fees, and medication.",
    eligibility:
      "Diagnosis of sickle cell disease, preparing for a transplant, with household income at or below about 350 percent of the federal poverty level. The application must go in before preservation begins, and a transplant center social worker or NMDP patient navigator applies on your behalf.",
    cap: "up to $10,000",
    url: "https://www.nmdp.org/patients/transplant-support/financial-support",
    audience: { stages: ["not_started"], treatments: ["transplant"] },
    citations: [
      d4(14),
      orgSite(
        "nmdp",
        "NMDP: Financial assistance before and after transplant",
        "https://www.nmdp.org/patients/transplant-support/financial-support"
      ),
    ],
  },
  {
    id: "reunite_oncofertility",
    fit: { anatomy: ["ovaries_uterus"], stage: "not_started" },
    name: "ReUnite Oncofertility",
    what: "Discounted fertility medication for cancer patients preserving fertility before treatment. The discount can cover up to 100 percent of what you would pay for covered medicines, based on income and clinical need, and is applied when the pharmacy fills the order.",
    eligibility:
      "Female patients whose cancer treatment can affect fertility, with no prior chemotherapy, who are paying for the medication themselves without fertility drug coverage. Covered medicines are Follistim AQ cartridge, ganirelix acetate injection, and Pregnyl, with per-cycle limits. You apply online with proof of income, and your oncologist completes a form.",
    cap: "up to 100 percent off covered medications",
    payUpfront: false,
    url: "https://reuniterx.com/discount-programs/",
    audience: { stages: ["not_started"], anatomy: ["ovaries_uterus"] },
    citations: [
      d4(14),
      orgSite(
        "reunite_oncofertility",
        "ReUnite Rx: Discount Programs (Oncofertility)",
        "https://reuniterx.com/discount-programs/"
      ),
    ],
  },
  {
    id: "team_maggies_dream",
    fit: { minAge: 15, maxAge: 37 },
    name: "Team Maggie's Dream",
    what: "Fertility assistance grants of up to $2,500 for teens and young adults with cancer, for preservation costs like egg retrieval and sperm banking. Funds are paid directly to the medical provider, not to you.",
    eligibility:
      "US citizen, age 15 to 37, receiving cancer treatment, uninsured or denied fertility preservation coverage by your insurance carrier. You mail in an application with proof of financial need and medical treatment, plus a short paragraph about why you are applying. Award size depends on available funds.",
    cap: "up to $2,500 per grant",
    payUpfront: false,
    url: "https://www.teammaggiesdream.org/grants",
    audience: {},
    citations: [
      d4(14),
      d4(15),
      orgSite(
        "team_maggies_dream",
        "Team Maggie's Dream: Grants",
        "https://www.teammaggiesdream.org/grants"
      ),
    ],
  },
  {
    id: "vernas_purse",
    name: "Verna's Purse (ReproTech)",
    what: "Reduced rates on long-term storage of eggs, sperm, embryos, ovarian tissue, or testicular tissue through ReproTech, for people with cancer-related fertility needs who would have trouble paying storage fees.",
    eligibility:
      "People storing specimens with ReproTech whose fertility is affected by cancer. There are separate applications for egg, sperm, and tissue storage and for embryo storage, and the discount is set case by case. Blood testing for infectious disease is required.",
    cap: "not published",
    payUpfront: false,
    url: "https://reprotech.com/for-customers/reprotech-storage-discount-programs/",
    audience: {},
    citations: [
      d4(15),
      orgSite(
        "vernas_purse",
        "ReproTech: Storage Discount Programs (Verna's Purse)",
        "https://reprotech.com/for-customers/reprotech-storage-discount-programs/"
      ),
    ],
  },
  {
    id: "walgreens_specialty",
    fit: { maxAge: 43, anatomy: ["ovaries_uterus"], stage: "not_started" },
    name: "Walgreens Specialty Pharmacy fertility preservation program",
    what: "Free fertility medication, donated by Ferring Pharmaceuticals through its Heart Beat program, for women preserving fertility before cancer treatment. Covers up to 2 preservation cycles, and the pharmacy supplies the medication at no cost.",
    eligibility:
      "Female, age 43 or younger (over age 40, an AMH blood test result above 0.5 is needed), diagnosed with cancer within the last 12 months, before any treatment that could harm fertility. There are no income requirements. Not available in Massachusetts, New Jersey, or Arkansas. Your care team contacts the pharmacy to enroll you.",
    cap: "free medication for up to 2 cycles",
    payUpfront: false,
    url: "https://www.walgreens.com/topic/pharmacy/specialty-pharmacy/fertility-preservation.jsp",
    audience: { anatomy: ["ovaries_uterus"], stages: ["not_started"] },
    citations: [
      d4(15),
      orgSite(
        "walgreens_specialty",
        "Walgreens Specialty Pharmacy: Fertility Preservation program",
        "https://www.walgreens.com/topic/pharmacy/specialty-pharmacy/fertility-preservation.jsp"
      ),
    ],
  },
  {
    id: "worth_the_wait",
    fit: { minAge: 13, maxAge: 39 },
    name: "Worth the Wait",
    what: "Grants of $500 to $2,500 for fertility preservation before cancer treatment (Emergency Preservation Grants) and for family building after treatment, including frozen embryo transfer, egg, embryo, or semen preservation, storage fees, adoption, and surrogacy. Grants are paid directly to the clinic or agency.",
    eligibility:
      "Age 13 to 39 with a cancer diagnosis, not yet a parent, receiving care at a US facility or working with a US agency, with financial hardship shown on an IRS tax form and no fertility insurance coverage. Your oncology provider confirms the treatment is needed because of cancer therapy. Emergency preservation applications are reviewed twice a month; family building grants run in quarterly cycles. Emergency grants must be used within 60 days and family building grants within 120 days.",
    cap: "$500 to $2,500 per grant",
    payUpfront: false,
    url: "https://worththewaitcharity.com/",
    audience: {},
    citations: [
      d4(15),
      orgSite(
        "worth_the_wait",
        "Worth the Wait Charity: Request Help",
        "https://worththewaitcharity.com/request-help/"
      ),
    ],
  },
];
