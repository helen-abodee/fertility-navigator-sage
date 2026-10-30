import type { AidOrg } from "../../lib/content-schema";
import { d4 } from "./citations";

/**
 * Financial aid directory, from the UCSD/AFP toolkit's philanthropic
 * resources table (D4, pp.14-16, fertility preservation section).
 * Age ranges and medical criteria stay in `eligibility` as text; `audience`
 * is used only for coarse filters (treatment stage, anatomy, treatment type).
 * Dollar caps appear only where D4 publishes them.
 */
export const aid: AidOrg[] = [
  {
    id: "allyson_whitney",
    name: "Allyson Whitney Foundation",
    what: "Grants for young adults diagnosed with rare cancers. Covers egg retrieval and sperm banking.",
    eligibility:
      "US citizen, age 16 to 36, with a rare cancer diagnosis, in active treatment (see their website for definitions). Applications must be requested by a facility, such as an oncology social worker, doctor's office, or patient navigator.",
    cap: "not published",
    url: "https://allysonwhitney.org/grants/",
    audience: {},
    citations: [d4(14)],
  },
  {
    id: "chick_mission",
    name: "Chick Mission",
    what: "Grants for cancer patients seeking to preserve their fertility ahead of treatment.",
    eligibility:
      "Available only in California, Colorado, Illinois, New Jersey, New York, and Texas. You submit screening information first, and they contact you with the grant application.",
    cap: "not published",
    url: "https://www.thechickmission.org/hope-grants/",
    audience: { stages: ["not_started"] },
    citations: [d4(14)],
  },
  {
    id: "expect_miracles_samfund",
    name: "Expect Miracles Foundation SAMFund",
    what: "Financial assistance for young adult cancer survivors.",
    eligibility:
      "US resident, age 21 to 39; more criteria on their site. You hear back 10 to 11 weeks after the application deadline.",
    cap: "not published",
    url: "https://expectmiraclesfoundation.org/get-help/",
    audience: { stages: ["finished"] },
    citations: [d4(14)],
  },
  {
    id: "fertility_within_reach",
    name: "Fertility Within Reach",
    what: "Educational resources for getting access to fertility treatment and fertility preservation.",
    eligibility: "You and your clinic complete the application together.",
    cap: "not published",
    url: "https://fertilitywithinreach.org/fertility-preservation",
    audience: {},
    citations: [d4(14)],
  },
  {
    id: "livestrong_fertility",
    name: "Livestrong Fertility",
    what: "Reproductive information, resources, and financial support for people whose cancer and its treatment present risks to their fertility.",
    eligibility:
      "Present in the US, with a cancer diagnosis; your oncologist has determined that treatment poses a risk to fertility, and your oncologist or reproductive endocrinologist has determined the preservation treatment is appropriate.",
    cap: "not published",
    url: "https://livestrong.org/how-we-help/livestrong-fertility/",
    audience: {},
    citations: [d4(14)],
  },
  {
    id: "nmdp",
    name: "NMDP (formerly Be The Match)",
    what: "Fertility preservation grants for patients with sickle cell disease. Covers egg retrieval and freezing, embryo work, ovarian tissue freezing, sperm banking, testicular sperm extraction, storage fees, and medication.",
    eligibility: "Diagnosis of sickle cell disease, before transplant; more criteria on their site.",
    cap: "not published",
    url: "https://www.sicklecellconnect.com/",
    audience: { stages: ["not_started"], treatments: ["transplant"] },
    citations: [d4(14)],
  },
  {
    id: "reunite_oncofertility",
    name: "ReUnite Oncofertility",
    what: "Discounted medications for oncology patients undergoing fertility preservation.",
    eligibility:
      "Eligible medications are Follistim AQ cartridge, ganirelix acetate injection, and Pregnyl.",
    cap: "not published",
    url: "https://reuniterx.com/discount-programs/",
    audience: {},
    citations: [d4(14)],
  },
  {
    id: "team_maggies_dream",
    name: "Team Maggie's Dream",
    what: "Support, education, and financial assistance for teens and young adults with cancer seeking fertility preservation.",
    eligibility: "US citizen, age 15 to 37; more criteria on their site.",
    cap: "not published",
    url: "https://www.teammaggiesdream.org/grants",
    audience: {},
    citations: [d4(14), d4(15)],
  },
  {
    id: "vernas_purse",
    name: "Verna's Purse (ReproTech)",
    what: "Discounted long-term storage for eggs, semen, ovarian tissue, or testicular tissue.",
    eligibility: "Requires blood testing for infectious disease.",
    cap: "not published",
    url: "https://reprotech.com/vernas-purse/",
    audience: {},
    citations: [d4(15)],
  },
  {
    id: "walgreens_specialty",
    name: "Walgreens Specialty Pharmacy fertility preservation program",
    what: "Select fertility medicines donated by Ferring Pharmaceuticals for patients going through fertility preservation treatment. Covers 2 preservation cycles.",
    eligibility: "New diagnosis of cancer; female patients; more criteria on their site.",
    cap: "not published",
    url: "https://www.walgreens.com/topic/pharmacy/specialty-pharmacy/fertility-preservation.jsp",
    audience: { anatomy: ["ovaries_uterus"] },
    citations: [d4(15)],
  },
  {
    id: "worth_the_wait",
    name: "Worth the Wait",
    what: "Financial support and education for fertility treatments, adoption, and surrogacy. Covers egg, embryo, or sperm preservation, frozen embryo transfer, storage fees, adoption, and surrogacy.",
    eligibility: "Diagnosis of cancer, age 13 to 39, not yet a parent; more criteria on their site.",
    cap: "$500 to $2,500 per grant",
    url: "https://worththewaitcharity.com/",
    audience: {},
    citations: [d4(15)],
  },
];
