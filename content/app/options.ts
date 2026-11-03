import type { PreservationOption } from "../../lib/content-schema";
import {
  acsTeens,
  asco,
  asrmJourney,
  asrmSperm,
  cogTesticular,
  d4,
  mskAfterTreatment,
  mskBuildingFamily,
  mskPreTreatment,
  mskSpermBanking,
  nciFemale,
} from "./citations";

export const options: PreservationOption[] = [
  {
    id: "egg_freezing",
    name: "Egg freezing",
    shortDescription:
      "Mature eggs are collected from your ovaries and frozen, unfertilized, for possible use in the future.",
    status: "established",
    citations: [asco("4.2")],
    audience: {
      anatomy: ["ovaries_uterus"],
      stages: ["not_started", "finished"],
    },
    audienceCitations: [asco("4.2"), asco("4.3")],
    steps: [
      {
        title: "Consult and baseline tests",
        icon: "clipboard",
        body: "You meet a fertility doctor (a reproductive endocrinologist). They do a transvaginal ultrasound to look at your ovaries and count growing follicles. Blood tests check hormones related to fertility, including FSH and AMH.",
      },
      {
        title: "Hormone injections",
        icon: "syringe",
        body: "You give yourself hormone shots each day to help a group of eggs mature. During this time you visit the clinic almost every other day for blood tests and ultrasounds.",
        duration: "about 10 to 12 days",
      },
      {
        title: "Egg retrieval",
        icon: "rest",
        body: "You get medicine so you sleep through it. The doctor uses an ultrasound wand and a very thin needle, passed through the wall of the vagina, to collect the mature eggs. Most people go home within an hour.",
        duration: "about 20 to 30 minutes",
      },
      {
        title: "Freezing and storage",
        icon: "snowflake",
        body: "The mature eggs are frozen and stored. They can stay frozen for as long as you want. Storage is billed every year.",
      },
    ],
    stepsCitations: [mskPreTreatment(), asrmJourney(), asco("4.2")],
    timeline:
      "The timing of the shots no longer depends on your menstrual cycle in most cases, so the process can usually start right away. From first visit to freezing is often about 2 to 3 weeks.",
    plan: {
      segments: [
        { label: "First visit and tests", icon: "clipboard", days: [1, 3] },
        { label: "Hormone shots with check-ins", icon: "syringe", days: [10, 12] },
        { label: "Egg retrieval, asleep for it", icon: "rest" },
        { label: "Freezing", icon: "snowflake" },
      ],
      note: "First visit to freezing is often about 2 to 3 weeks, and it usually does not have to wait for your cycle.",
      citations: [mskPreTreatment(), asrmJourney()],
    },

    expectations:
      "Not every egg collected will be mature enough to freeze, and frozen eggs do not guarantee a pregnancy later. Results vary from person to person. Storage is billed every year, and there are added costs later if you thaw and use the eggs.",
    expectationsCitations: [asrmJourney(), mskPreTreatment()],
    costs: [
      {
        label: "One egg freezing cycle",
        range: "$12,400 on average (US)",
        amount: { min: 12400, max: 12400, per: "once" },
        note: "Does not include medicines.",
        citations: [d4(3)],
      },
      {
        label: "Fertility medicines",
        range: "about $5,000",
        amount: { min: 5000, max: 5000, per: "once" },
        citations: [d4(3)],
      },
      {
        label: "Storage",
        range: "$200 to $500 per year",
        amount: { min: 200, max: 500, per: "year" },
        citations: [d4(3)],
      },
      {
        label: "Thawing and using your eggs later",
        range: "not published",
        note: "There are added costs when you are ready to thaw and use the eggs to attempt pregnancy.",
        citations: [mskPreTreatment()],
      },
    ],
  },
  {
    id: "embryo_freezing",
    name: "Embryo freezing",
    shortDescription:
      "Eggs are collected from your ovaries, fertilized with sperm in the lab to create embryos, and the embryos are frozen for possible use in the future.",
    status: "established",
    citations: [asco("4.1")],
    audience: {
      anatomy: ["ovaries_uterus"],
      stages: ["not_started", "finished"],
    },
    audienceCitations: [asco("4.1"), asco("4.3")],
    steps: [
      {
        title: "Consult and baseline tests",
        icon: "clipboard",
        body: "You meet a fertility doctor. They do a transvaginal ultrasound and blood tests for hormones related to fertility, including FSH and AMH.",
      },
      {
        title: "Hormone injections",
        icon: "syringe",
        body: "You give yourself hormone shots each day to help a group of eggs mature, with clinic visits almost every other day for blood tests and ultrasounds.",
        duration: "about 10 to 12 days",
      },
      {
        title: "Egg retrieval",
        icon: "rest",
        body: "You get medicine so you sleep through it. The doctor collects the mature eggs with a thin needle guided by ultrasound. Most people go home within an hour.",
        duration: "about 20 to 30 minutes",
      },
      {
        title: "Fertilization and freezing",
        icon: "flask",
        body: "In the lab, the eggs are fertilized with sperm from your partner or a donor to create embryos (this is in vitro fertilization, or IVF). The embryos are frozen and stored. Storage is billed every year.",
      },
    ],
    stepsCitations: [mskPreTreatment(), mskAfterTreatment(), asrmJourney()],
    timeline: "The whole process takes about 2 to 3 weeks.",
    plan: {
      segments: [
        { label: "First visit and tests", icon: "clipboard", days: [1, 3] },
        { label: "Hormone shots with check-ins", icon: "syringe", days: [10, 12] },
        { label: "Egg retrieval, asleep for it", icon: "rest" },
        { label: "Fertilization in the lab, then freezing", icon: "flask", days: [5, 6] },
      ],
      note: "The whole process takes about 2 to 3 weeks.",
      citations: [mskPreTreatment(), asrmJourney()],
    },

    expectations:
      "Not every egg collected will become an embryo, and frozen embryos do not guarantee a pregnancy later. Results vary from person to person. Storage is billed every year, and there are added costs later if you thaw and use the embryos.",
    expectationsCitations: [asrmJourney(), mskPreTreatment()],
    costs: [
      {
        label: "Egg collection cycle",
        range: "$12,400 on average (US)",
        amount: { min: 12400, max: 12400, per: "once" },
        note: "Published average is for one egg freezing cycle, which uses the same collection steps. Lab work to create embryos adds costs that are not published.",
        citations: [d4(3), d4(9)],
      },
      {
        label: "Fertility medicines",
        range: "about $5,000",
        amount: { min: 5000, max: 5000, per: "once" },
        citations: [d4(3)],
      },
      {
        label: "Storage",
        range: "$200 to $500 per year",
        amount: { min: 200, max: 500, per: "year" },
        citations: [d4(3)],
      },
    ],
  },
  {
    id: "sperm_banking",
    name: "Sperm banking",
    shortDescription:
      "You collect semen samples, and the sperm are frozen and stored for possible use in the future.",
    status: "established",
    citations: [asco("3.1")],
    audience: {
      anatomy: ["testes"],
      stages: ["not_started"],
    },
    audienceCitations: [asco("3.1"), asco("3.5")],
    steps: [
      {
        title: "Set up with a sperm bank",
        icon: "clipboard",
        body: "Your care team refers you to a sperm bank or clinic lab. The bank may require blood tests for infectious diseases before you bank your sperm.",
      },
      {
        title: "Before the first collection",
        icon: "calendar",
        body: "It is best not to ejaculate, during sex or masturbation, for 2 to 5 days before the first collection and between collections.",
      },
      {
        title: "Collection",
        icon: "door",
        body: "At the sperm bank, a staff member brings you to a small private room to collect the sample. Some banks let you collect at home. If you are in the hospital, you can collect the sample in your hospital room.",
      },
      {
        title: "More samples if time allows",
        icon: "calendar",
        body: "Banks usually suggest 3 samples, scheduled 2 to 3 days apart. If treatment starts soon, you can collect with only 1 day between samples. Even 1 or 2 samples is helpful.",
      },
      {
        title: "Freezing and storage",
        icon: "snowflake",
        body: "The sperm are frozen and stored. You pay a yearly storage fee for as long as the bank holds your samples.",
      },
    ],
    stepsCitations: [mskSpermBanking()],
    timeline:
      "Collection itself is quick. With 3 samples spaced 2 to 3 days apart, banking usually takes about a week. It can be compressed into a few days if treatment starts soon.",
    plan: {
      segments: [
        { label: "Set up and blood tests", icon: "clipboard", days: [1, 2] },
        { label: "Up to 3 collections, 2 to 3 days apart", icon: "door", days: [5, 7] },
        { label: "Freezing and storage", icon: "snowflake" },
      ],
      note: "Usually about a week. If treatment starts soon, it can be compressed into a few days, and even 1 sample helps.",
      citations: [mskSpermBanking()],
    },

    expectations:
      "Any banked sperm can offer a chance at biological parenthood later, and a low sperm count should not stop you from banking. A lab method called ICSI can use a very small amount of sperm. Frozen sperm can be stored indefinitely; sperm frozen for over 20 years have been used to create pregnancies. Storage is billed every year. Banking does not guarantee a pregnancy later.",
    expectationsCitations: [asco("3.1"), asco("3.5"), asrmSperm(), mskSpermBanking()],
    costs: [
      {
        label: "Testing, analyzing, and freezing sperm",
        range: "$500 to $1,000",
        amount: { min: 500, max: 1000, per: "once" },
        citations: [d4(3), acsTeens()],
      },
      {
        label: "Storage",
        range: "$200 to $500 per year",
        amount: { min: 200, max: 500, per: "year" },
        citations: [d4(3), acsTeens()],
      },
      {
        label: "Example package price",
        range: "about $800 to $1,000",
        note: "One large New York program's price for 3 collections, including the first year of storage. Prices vary by clinic.",
        citations: [mskSpermBanking()],
      },
    ],
  },
  {
    id: "testicular_sperm_extraction",
    name: "Testicular sperm extraction (TESE)",
    shortDescription:
      "A surgeon collects sperm directly from the testicle for people who cannot provide a semen sample.",
    status: "established",
    citations: [asco("3.2")],
    audience: {
      anatomy: ["testes"],
      stages: ["not_started"],
    },
    audienceCitations: [asco("3.2")],
    steps: [
      {
        title: "Consult",
        icon: "clipboard",
        body: "A fertility specialist reviews your medical history and talks through whether this fits your situation and your treatment schedule.",
      },
      {
        title: "Sperm retrieval",
        icon: "scalpel",
        body: "A surgeon removes sperm directly from the testicle. This is an option when a semen sample is not possible.",
      },
      {
        title: "Freezing and storage",
        icon: "snowflake",
        body: "The sperm are frozen and stored. Storage is billed every year.",
      },
    ],
    stepsCitations: [asrmSperm(), asrmJourney(), d4(9)],
    expectations:
      "Sperm collected this way can later be injected directly into an egg in a lab process called ICSI, which can work with a very small amount of sperm. Results vary from person to person, and this does not guarantee a pregnancy later. Storage is billed every year.",
    expectationsCitations: [asrmSperm(), asco("3.5")],
    costs: [
      {
        label: "Surgical sperm retrieval",
        range: "not published",
        citations: [d4(9)],
      },
      {
        label: "Storage",
        range: "$200 to $500 per year",
        amount: { min: 200, max: 500, per: "year" },
        citations: [d4(3)],
      },
    ],
  },
  {
    id: "ovarian_tissue_freezing",
    name: "Ovarian tissue freezing",
    shortDescription:
      "Part or all of an ovary is removed in surgery and the egg-holding tissue is frozen, with no hormone shots needed first.",
    status: "established",
    citations: [asco("4.10")],
    audience: {
      anatomy: ["ovaries_uterus"],
      stages: ["not_started"],
    },
    audienceCitations: [asco("4.10"), asco("5.1")],
    steps: [
      {
        title: "Consult",
        icon: "clipboard",
        body: "You meet a fertility doctor. Because this method does not need ovarian stimulation, it can be done right away if chemotherapy cannot wait. It also does not require having gone through puberty, so it may be the only option for young children.",
      },
      {
        title: "Surgery",
        icon: "scalpel",
        body: "An entire ovary, or pieces of an ovary, are removed during a surgery.",
      },
      {
        title: "Lab processing and freezing",
        icon: "flask",
        body: "The tissue goes to a special laboratory. The outer layer of the ovary, which holds the eggs, is removed, cut into small pieces, and frozen.",
      },
      {
        title: "Possible future use",
        icon: "sprout",
        body: "Later, doctors can re-implant the tissue into your body, with the hope that eggs in the tissue will mature and be released with ovulation. Another option is to mature eggs from the tissue in the laboratory.",
      },
    ],
    stepsCitations: [mskPreTreatment(), asco("4.10")],
    timeline:
      "No hormone shots are needed first, so this can be scheduled without delaying chemotherapy.",
    expectations:
      "Results vary from person to person, and frozen tissue does not guarantee a pregnancy later. Before tissue is placed back, doctors check it carefully because there is a theoretical risk of reintroducing cancer cells, and the importance of that risk is unknown. Re-implanting the tissue means another surgery. Storage is billed every year.",
    expectationsCitations: [asco("4.10"), mskPreTreatment()],
    costs: [
      {
        label: "Surgery, processing, and freezing",
        range: "not published",
        citations: [d4(9)],
      },
      {
        label: "Storage",
        range: "$200 to $500 per year",
        amount: { min: 200, max: 500, per: "year" },
        note: "Published range is for storing eggs or sperm. Tissue storage fees may differ by clinic.",
        citations: [d4(3)],
      },
    ],
  },
  {
    id: "ovarian_suppression",
    name: "Ovarian suppression (GnRH agonist)",
    shortDescription:
      "A medicine that quiets the ovaries during chemotherapy. You may hear it offered alongside, not instead of, freezing eggs, embryos, or ovarian tissue.",
    status: "adjunct",
    statusNote:
      "ASCO says this medicine should not be used in place of established methods like egg, embryo, or ovarian tissue freezing. It may be offered as an add-on for people with breast cancer. For other cancers, its benefits and risks still need more study.",
    citations: [asco("4.8")],
    audience: {
      anatomy: ["ovaries_uterus"],
      stages: ["not_started"],
      treatments: ["chemo"],
    },
    audienceCitations: [asco("4.8"), asco("4.9")],
    steps: [
      {
        title: "Medicine during chemotherapy",
        icon: "syringe",
        body: "A GnRH agonist is a medicine that causes the ovaries to shut down and stop making estradiol, a form of estrogen, while you get chemotherapy. If chemotherapy must start urgently, this medicine can still be offered and can help in other ways, such as stopping periods during treatment.",
      },
    ],
    stepsCitations: [nciFemale(), asco("4.9")],
    expectations:
      "This is not a replacement for freezing eggs, embryos, or ovarian tissue. It may be offered as an add-on in breast cancer. One clear use is stopping periods during urgent chemotherapy. It does not guarantee your ovaries will work normally after treatment.",
    expectationsCitations: [asco("4.8"), asco("4.9")],
    costs: [
      {
        label: "GnRH agonist medicine",
        range: "not published",
        citations: [asco("4.8")],
      },
    ],
  },
  {
    id: "ovarian_transposition",
    name: "Ovarian transposition",
    shortDescription:
      "A surgery that moves the ovaries, and sometimes the fallopian tubes, away from the area that will receive radiation.",
    status: "established",
    citations: [asco("4.5")],
    audience: {
      anatomy: ["ovaries_uterus"],
      stages: ["not_started"],
      treatments: ["radiation"],
    },
    audienceCitations: [asco("4.5")],
    steps: [
      {
        title: "Planning with your team",
        icon: "clipboard",
        body: "This is for people who need radiation to the pelvis. Because the ovaries can drift back over time, the surgery is done as close to the start of radiation as possible.",
      },
      {
        title: "Surgery",
        icon: "scalpel",
        body: "A surgeon moves the ovaries, and sometimes the fallopian tubes, away from the area receiving radiation. It may be done during the same surgery that removes the cancer.",
      },
    ],
    stepsCitations: [asco("4.5"), nciFemale()],
    expectations:
      "Because radiation can scatter, the ovaries are not always protected, and this technique is not always successful. It is not suitable for people with a moderate or high risk of cancer in the ovaries, or for people getting chemotherapy that harms the ovaries at the same time.",
    expectationsCitations: [asco("4.5")],
    costs: [
      {
        label: "Surgery",
        range: "not published",
        citations: [asco("4.5")],
      },
    ],
  },
];

/** The standing honesty line shown above the options and on the health tab. */
export const honestCaveat = {
  text: "Honest first: preservation keeps a possibility open. Frozen eggs, sperm, and embryos do not guarantee a child later, and results vary from person to person.",
  citations: [asrmJourney(), mskPreTreatment(), mskSpermBanking()],
};
