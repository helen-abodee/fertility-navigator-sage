import type { GuidanceSection } from "../../lib/content-schema";
import {
  acsTeens,
  asco,
  asrmSperm,
  cogOvarian,
  cogTesticular,
  d4,
  mskAfterTreatment,
  mskBuildingFamily,
  mskSpermBanking,
  sb729,
} from "./citations";

/** Recurring SB 729 / SB 600 citations (see content/sources/ca-ivf-law-2026.md). */
const calmattersSb729 = () =>
  sb729(
    "SB 729 chaptered text (2024), via CalMatters Digital Democracy",
    "https://calmatters.digitaldemocracy.org/bills/ca_202320240sb729"
  );
const calmattersSb600 = () =>
  sb729(
    "SB 600 (2019), via CalMatters Digital Democracy",
    "https://calmatters.digitaldemocracy.org/bills/ca_201920200sb600"
  );
const resolveFaq = () =>
  sb729(
    "RESOLVE: Understanding California's IVF insurance law",
    "https://resolve.org/learn/financial-resources/insurance-coverage/understanding-californias-ivf-insurance-law/"
  );
const menjivarDelay = () =>
  sb729(
    "Sen. Menjivar's office: California State Budget Delays Implementation of SB 729",
    "https://sd20.senate.ca.gov/news/california-state-budget-delays-implementation-sb-729-infertility-treatment-health-care"
  );

export const guidance: GuidanceSection[] = [
  {
    id: "insurance_ca_commercial_pre",
    audience: {
      insurance: ["ca_commercial"],
      stages: ["not_started", "in_treatment", "not_sure"],
    },
    heading: "Your California plan should cover fertility preservation",
    paragraphs: [
      {
        text: "California recognizes fertility preservation as a covered basic benefit when a medical treatment, like chemotherapy or radiation, could cause infertility. The state's health plan regulator, the Department of Managed Health Care (DMHC), recognizes this under the Knox-Keene Act, and it was spelled out by Senate Bill 600 in 2019. This applies to state-regulated commercial plans, which are most job-based and marketplace plans in California.",
        citations: [d4(36), calmattersSb600()],
      },
      {
        text: "When you call your plan, the words matter. Ask about coverage for medically indicated fertility preservation, also called iatrogenic infertility. Say clearly that this is not the same as general infertility benefits. You are asking about preserving fertility before a medical treatment that can harm it.",
        citations: [d4(22)],
      },
      {
        text: "One exception: if your employer's plan is self-funded (the employer pays claims itself), state law does not apply to it. You can ask your plan or HR whether your plan is self-funded or fully insured.",
        citations: [d4(8), d4(23)],
      },
      {
        text: "If your plan says no, you can appeal, and your doctor can submit the appeal for you. Appeals usually take 30 to 60 days, but urgent cases are decided in 4 days. In California, published Independent Medical Reviews have sided with patients in this situation.",
        citations: [d4(35), d4(36)],
      },
    ],
    actions: [
      {
        label: "Call member services",
        detail:
          "Use the number on the back of your insurance card. Say: I have been diagnosed with (your condition), and my planned treatment can harm my future fertility. I am calling to verify coverage for medically indicated fertility preservation, also known as iatrogenic infertility. This is not the same as general infertility benefits.",
        citations: [d4(22)],
      },
      {
        label: "Write down the call details",
        detail:
          "Ask for the agent's name and a reference number, and note the date. You will want these if you need to appeal.",
        citations: [d4(24)],
      },
      {
        label: "If denied, ask your doctor to file an urgent appeal",
        detail:
          "A physician can submit the appeal on your behalf. Urgent appeals are typically decided in 4 days. If the plan still says no, you can contact California's health plan regulator, the DMHC.",
        citations: [d4(35), d4(36), d4(8)],
      },
    ],
  },
  {
    id: "insurance_ca_commercial_survivor",
    audience: {
      insurance: ["ca_commercial"],
      stages: ["finished"],
    },
    heading: "A newer California law may cover fertility treatment, including IVF",
    paragraphs: [
      {
        text: "California passed a law called SB 729 in September 2024. It applies to plan contracts issued, amended, or renewed on or after January 1, 2026. If your plan renews mid-year, the benefit starts at renewal.",
        citations: [calmattersSb729(), menjivarDelay(), resolveFaq()],
      },
      {
        text: "If you are in a large-group, fully insured plan, it must cover the diagnosis and treatment of infertility and fertility services, including IVF: up to 3 completed egg retrievals with unlimited embryo transfers. Small-group plans only have to offer this coverage, and your employer decides whether to buy it. Self-funded employer plans and Medi-Cal are not included, and religious employers are exempt. CalPERS plans start July 1, 2027.",
        citations: [calmattersSb729(), resolveFaq()],
      },
      {
        text: "The law's definition of infertility is broad. It includes a doctor's findings based on your medical history and testing, and it includes not being able to have a child, on your own or with your partner, without medical help. You do not have to be married or have a partner, and there is no required months-of-trying clock when a doctor's findings establish it.",
        citations: [calmattersSb729()],
      },
    ],
    actions: [
      {
        label: "Ask HR two questions",
        detail:
          "Is our plan fully insured or self-funded? And is it a large-group plan? The SB 729 requirement applies to large-group, fully insured plans.",
        citations: [calmattersSb729(), resolveFaq()],
      },
      {
        label: "Ask when your plan year renews",
        detail:
          "The benefit applies to plans issued, amended, or renewed on or after January 1, 2026. If your plan has not renewed yet, the benefit may not have started.",
        citations: [resolveFaq()],
      },
    ],
  },
  {
    id: "insurance_medi_cal",
    audience: {
      insurance: ["medi_cal"],
    },
    heading: "Medi-Cal does not cover fertility preservation right now",
    paragraphs: [
      {
        text: "We want to be straight with you: as of the dates our sources were checked (toolkit dated July 31, 2025, and re-verified October 30, 2026), Medi-Cal does not cover fertility preservation. California's new IVF law (SB 729) and the 2019 preservation law (SB 600) both leave out Medi-Cal managed care plans.",
        citations: [d4(12), d4(33), calmattersSb729(), calmattersSb600()],
      },
      {
        text: "This is a gap in the law, not something you did. It also does not mean preservation is out of reach. Several programs help pay for these services, and some clinics offer reduced prices. The financial aid list on this page is a good place to start, and a clinic's financial counselor or your hospital social worker can help you apply.",
        citations: [d4(14), d4(15), d4(16)],
      },
    ],
    actions: [
      {
        label: "Look at the financial aid programs",
        detail:
          "Programs like Livestrong Fertility and others fund preservation for people with a cancer diagnosis. Each one lists who qualifies.",
        citations: [d4(14), d4(15), d4(16)],
      },
    ],
  },
  {
    id: "insurance_none_unknown",
    audience: {
      insurance: ["none", "unknown"],
    },
    heading: "How to find out what coverage you have",
    paragraphs: [
      {
        text: "If you are not sure what insurance you have, or what it covers, that is a normal place to start. A short phone call can usually settle it, and there is a script below. Some health plans also have a nurse navigator who can help you verify benefits.",
        citations: [d4(20)],
      },
      {
        text: "Before you call, gather a few things: your insurance card, the name of your condition, and its ICD-10 diagnosis code. Your doctor's office can give you that code. Your clinic can also give you the list of procedure codes (CPT codes) for the services you may need.",
        citations: [d4(20), d4(22)],
      },
      {
        text: "On the call, the key phrase is: medically indicated fertility preservation, also known as iatrogenic infertility. Say this is not the same as general infertility benefits. You are asking about fertility preservation for medical reasons, before a treatment that can cause infertility.",
        citations: [d4(22)],
      },
      {
        text: "Also ask whether your plan is self-funded or fully funded. Fully insured plans based in California must follow the state's preservation law. Self-funded plans do not have to, and appeals to them rarely succeed.",
        citations: [d4(23), d4(8)],
      },
      {
        text: "If you have no insurance, the financial aid programs on this page fund preservation for people with a cancer diagnosis, and a clinic's financial counselor or your social worker can help you apply.",
        citations: [d4(14), d4(15), d4(16)],
      },
    ],
    actions: [
      {
        label: "Call member services",
        detail:
          "Use the number on the back of your insurance card. If you reach a menu, try saying Representative, pressing 0, or staying on the line.",
        citations: [d4(22)],
      },
      {
        label: "Ask about each procedure code",
        detail:
          "Ask: Can you tell me if these CPT codes are billable for my plan? Also ask about copays, co-insurance, any lifetime maximum, and how long storage is covered.",
        citations: [d4(22), d4(23), d4(25)],
      },
      {
        label: "Write down the call details",
        detail:
          "Note the date, the agent's name, and a reference number for the call.",
        citations: [d4(29)],
      },
    ],
  },
  {
    id: "survivor_testing_ovaries",
    audience: {
      anatomy: ["ovaries_uterus"],
      stages: ["finished"],
    },
    heading: "Finding out where your fertility stands now",
    paragraphs: [
      {
        text: "If your treatment could affect the ovaries, a yearly check-up is recommended. It covers your periods, pregnancy history, and sexual health, and blood may be tested for hormone levels (FSH, LH, and estradiol) if a problem is suspected. Regular monthly periods with normal hormone levels are a good sign for fertility.",
        citations: [cogOvarian()],
      },
      {
        text: "A fertility evaluation can tell you more. It usually includes blood tests for hormones related to fertility, including FSH and AMH, and a transvaginal ultrasound to count growing follicles in the ovaries (the antral follicle count).",
        citations: [mskAfterTreatment()],
      },
      {
        text: "Timing matters, and waiting is normal. Memorial Sloan Kettering generally recommends waiting at least 1 year after completing cancer treatment before having your fertility evaluated. Also, because of how eggs develop, there may be no egg yield within 3 months of the last chemotherapy dose, and doctors counsel that eggs collected close to treatment carry unknowns.",
        citations: [mskAfterTreatment(), asco("4.3")],
      },
      {
        text: "If you did not freeze eggs or embryos before treatment, that door is not closed. ASCO says egg or embryo freezing may still be offered after treatment to people at risk of early ovarian insufficiency or infertility.",
        citations: [asco("4.3")],
      },
    ],
    actions: [
      {
        label: "Ask for a referral to a fertility specialist",
        detail:
          "ASCO recommends ongoing fertility discussions and referrals during survivorship, including when you are thinking about pregnancy. You do not have to be sure about wanting children to ask.",
        citations: [asco("1.4"), asco("1.2")],
      },
    ],
  },
  {
    id: "survivor_testing_testes",
    audience: {
      anatomy: ["testes"],
      stages: ["finished"],
    },
    heading: "Finding out where your fertility stands now",
    paragraphs: [
      {
        text: "If your treatment could affect the testes, a yearly check-up is recommended. Blood may be tested for hormone levels: a morning (AM) testosterone, LH, FSH, and inhibin.",
        citations: [cogTesticular()],
      },
      {
        text: "The best way to assess the ability to make sperm is a semen analysis. It measures how many sperm there are, how they move, and how they look. The sample is given after several days without ejaculating. If giving a sample is not possible, or you would rather not, FSH and inhibin blood levels can give some insight.",
        citations: [cogTesticular()],
      },
      {
        text: "Timing matters, and waiting is normal. Memorial Sloan Kettering says you can have a semen analysis done at least 1 year after your cancer treatment is complete, and that full recovery can take up to 5 years. When sperm production recovers, it usually happens in the first few years after treatment ends.",
        citations: [mskBuildingFamily(), cogTesticular()],
      },
      {
        text: "One result does not settle it. No sperm on a single sample is not a final answer; it takes more than one sample to point to infertility. A low sperm count does not rule out having children, since fertility specialists have ways to work with small numbers of sperm.",
        citations: [cogTesticular()],
      },
    ],
    actions: [
      {
        label: "Ask for a referral to a fertility specialist",
        detail:
          "ASCO recommends ongoing fertility discussions and referrals during survivorship. If you banked sperm before treatment, a fertility specialist can review your options for using it.",
        citations: [asco("1.4"), cogTesticular()],
      },
    ],
  },
  {
    id: "semen_collection_prep",
    audience: {
      anatomy: ["testes"],
    },
    heading: "What giving a sample is actually like",
    paragraphs: [
      {
        text: "Here is the plain version. At the sperm bank, a staff member brings you to a small private room, you masturbate, and you collect the semen in a sterile cup. That is the whole procedure. Some banks let you collect at home instead. If you are in the hospital, you can collect the sample in your hospital room.",
        citations: [mskSpermBanking()],
      },
      {
        text: "To prepare: do not ejaculate, during sex or masturbation, for 2 to 5 days before the first collection and between collections. Do not use saliva or lubricants, because these can destroy sperm. You can ask for mineral oil if it helps, but use it only at the base of the penis.",
        citations: [mskSpermBanking()],
      },
      {
        text: "If there is time, banks usually suggest 3 samples with 2 to 3 days between them. If treatment starts soon, you can collect with only 1 day between samples. Even 1 or 2 samples is helpful. The bank may also require blood tests for infectious diseases before banking.",
        citations: [mskSpermBanking()],
      },
      {
        text: "Feeling awkward about this is common, and it is nothing to apologize for. Many teens are not comfortable masturbating to produce a sample, especially if parents are part of the conversation. You can ask for privacy, and if collecting this way is not possible for any reason, tell your doctor or nurse. There are other ways to collect sperm, including collection condoms used during sex and procedures that take sperm directly from the testicle.",
        citations: [acsTeens(), mskSpermBanking(), asrmSperm()],
      },
    ],
  },
  {
    id: "partner_insurance",
    audience: {
      partnered: true,
    },
    heading: "Check your partner's plan too",
    paragraphs: [
      {
        text: "Fertility benefits come from the plan, not from who carries the card. People are often covered as a spouse or dependent on someone else's employer plan, and benefit checks work the same way; you just also need the policyholder's name and date of birth when you call.",
        citations: [d4(20)],
      },
      {
        text: "If you and your partner each have coverage, it is worth checking both plans with the same questions: is the plan fully insured or self-funded, what state is it based in, and are fertility preservation codes billable? Plans differ, and one may cover what the other does not.",
        citations: [d4(20), d4(22), d4(23)],
      },
    ],
  },
];
