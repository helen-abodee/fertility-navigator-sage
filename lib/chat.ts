import type { Answers, Citation } from "./types";
import type { Audience } from "./content-schema";
import { appContent } from "../content/app/content";
import { matchesAudience } from "./results";

/**
 * The on-device "Ask" engine. No model, no server: a question is matched
 * against passages lifted verbatim from the app's cited content, and the
 * matches come back with their citations attached. Nothing typed here is
 * stored or transmitted; retrieval runs entirely in the browser.
 */

export interface ChatEntry {
  id: string;
  title: string;
  text: string;
  citations?: Citation[];
  audience?: Audience;
  /** extra matching vocabulary beyond the title/text */
  keywords: string[];
  /** where in the app this answer lives, for a one-tap jump */
  goto?: { target: string; label: string };
}

export interface ChatAnswer {
  kind: "results" | "none" | "crisis";
  entries: ChatEntry[];
}

export const CHAT_STRINGS = {
  intro:
    "Answers here come word for word from this tool's cited sources. Nothing you type is saved or sent anywhere.",
  scope:
    "Ask about the options, costs, insurance, clinics, or everyday health. For anything about your personal situation, your care team is the right place.",
  noAnswer:
    "There is no sourced answer for that in this tool, and it only repeats facts it can cite. Your care team can answer it. The question list under My progress can help you bring it up.",
  crisis:
    "If you are thinking about harming yourself, call or text 988, the Suicide and Crisis Lifeline, right now. It is free, confidential, and open around the clock.",
  placeholder: "Type a question",
} as const;

const COST_WORDS = ["cost", "price", "pay", "paying", "money", "afford", "expensive", "cheap", "fee", "fees", "bill", "storage"];
const TIME_WORDS = ["long", "time", "fast", "quick", "soon", "wait", "day", "days", "week", "weeks", "schedule", "delay", "start"];

const OPTION_KEYWORDS: Record<string, string[]> = {
  egg_freezing: ["egg", "eggs", "oocyte", "freeze", "freezing", "retrieval", "ivf"],
  embryo_freezing: ["embryo", "embryos", "ivf", "fertilize", "partner", "freeze", "freezing"],
  sperm_banking: ["sperm", "semen", "bank", "banking", "sample", "collect", "masturbation"],
  testicular_sperm_extraction: ["tese", "sperm", "testicle", "extraction", "surgery", "sample"],
  ovarian_tissue_freezing: ["ovarian", "tissue", "ovary", "surgery", "freeze", "prepubertal"],
  ovarian_suppression: ["suppression", "gnrh", "medicine", "shot", "protect", "lupron", "periods"],
  ovarian_transposition: ["transposition", "radiation", "move", "surgery", "pelvic", "ovaries"],
};

function textOfCosts(costs: { label: string; range: string; note?: string }[]): string {
  const line = (c: { label: string; range: string; note?: string }) =>
    `${c.label}: ${c.range}${c.note ? `. ${c.note.replace(/\.$/, "")}` : ""}`;
  return costs.map((c) => line(c).replace(/\.$/, "")).join(". ") + ".";
}

export function buildCorpus(): ChatEntry[] {
  const entries: ChatEntry[] = [];

  for (const o of appContent.options) {
    const kw = OPTION_KEYWORDS[o.id] ?? [];
    entries.push({
      id: `${o.id}.what`,
      title: o.name,
      text: [o.shortDescription, o.statusNote ?? "", o.expectations].filter(Boolean).join(" "),
      citations: [...o.citations, ...o.expectationsCitations],
      audience: o.audience,
      keywords: [...kw, "option", "work", "works", "safe", "guarantee", "treatment", "during"],
      goto: { target: "options", label: "Open Options" },
    });
    if (o.timeline) {
      entries.push({
        id: `${o.id}.time`,
        title: `${o.name}: how long it takes`,
        text: `${o.timeline}${o.plan?.note ? ` ${o.plan.note}` : ""}`,
        citations: o.stepsCitations,
        audience: o.audience,
        keywords: [...kw, ...TIME_WORDS],
        goto: { target: "options", label: "Open Options" },
      });
    }
    if (o.costs.length > 0) {
      entries.push({
        id: `${o.id}.cost`,
        title: `${o.name}: what it costs`,
        text: textOfCosts(o.costs),
        citations: o.costs.flatMap((c) => c.citations),
        audience: o.audience,
        keywords: [...kw, ...COST_WORDS],
        goto: { target: "money", label: "Open Financing" },
      });
    }
  }

  for (const g of appContent.guidance) {
    const aboutCoverage =
      g.id.includes("coverage") || g.id.includes("medi_cal") || g.id.includes("insurance") || g.id.includes("partner");
    entries.push({
      id: `faq.${g.id}`,
      title: g.heading,
      text: g.paragraphs.map((p) => p.text).join(" "),
      citations: g.paragraphs.flatMap((p) => p.citations),
      audience: g.audience,
      keywords: aboutCoverage ? ["insurance", "covered", "coverage", "plan", "law", ...COST_WORDS] : [],
      goto: aboutCoverage ? { target: "money", label: "Open Financing" } : undefined,
    });
  }

  for (const h of appContent.health) {
    entries.push({
      id: `health.${h.id}`,
      title: h.fact,
      text: [h.mechanism ?? "", h.caveat ?? ""].filter(Boolean).join(" ") || h.fact,
      citations: h.citations,
      audience: h.audience,
      keywords: ["health", "healthy", "habit", "everyday", "lifestyle", "improve", "quality"],
      goto: { target: "health", label: "Open Health" },
    });
  }

  for (const a of appContent.aid) {
    entries.push({
      id: `aid.${a.id}`,
      title: a.name,
      text: `${a.what} ${a.eligibility} ${a.cap}`,
      citations: a.citations,
      audience: a.audience,
      keywords: ["grant", "aid", "discount", "free", "help", "program", "financial", ...COST_WORDS],
      goto: { target: "money", label: "Open Financing" },
    });
  }

  entries.push({
    id: "askteam",
    title: "Questions to bring your care team",
    text: appContent.doctorQuestions
      .slice(0, 6)
      .map((q) => q.text)
      .join(" "),
    keywords: ["ask", "doctor", "oncologist", "question", "questions", "appointment", "team", "referral", "specialist"],
    goto: { target: "progress", label: "Open My progress" },
  });

  entries.push({
    id: "pointer.risk",
    title: "Your risk group",
    text: "This tool shows a guideline risk group, not a personal prediction, and it never turns your answers into a number. Your group is on the My progress screen, and your care team can confirm what it means for you.",
    keywords: ["risk", "risky", "chance", "chances", "odds", "likely", "probability", "infertile", "infertility", "sterile", "percent", "number"],
    goto: { target: "progress", label: "See my risk group" },
  });
  entries.push({
    id: "pointer.compare",
    title: "Compare options side by side",
    text: "The Compare tab grades every option in words across six considerations, like time it takes, money, and what the procedure involves.",
    keywords: ["compare", "comparison", "difference", "versus", "better", "best", "which", "choose", "right"],
    goto: { target: "compare", label: "Open Compare" },
  });
  entries.push({
    id: "pointer.reflect",
    title: "Not sure about children? There's a path for that",
    text: "An 8-screen walk through the decision, built from published decision guides. Being unsure is a real answer here, and nothing you tap is saved.",
    keywords: ["unsure", "sure", "decide", "decision", "deciding", "kids", "children", "child", "want", "someday", "torn", "maybe"],
    goto: { target: "reflect", label: "Walk me through it" },
  });
  entries.push({
    id: "pointer.clinics",
    title: "Fertility clinics near you",
    text: "The Clinics tab maps fertility clinics with distances from your area, and Reach out drafts the first message to send one.",
    keywords: ["clinic", "clinics", "near", "nearby", "where", "location", "map", "appointment", "call", "contact"],
    goto: { target: "clinics", label: "Open Clinics" },
  });
  entries.push({
    id: "pointer.sources",
    title: "Where this information comes from",
    text: "Every fact in this tool is cited to a published source, like the ASCO 2025 guideline, and every card shows its sources under Where this comes from. The full list is on the Sources page.",
    keywords: ["source", "sources", "cite", "cited", "evidence", "trust", "reliable", "information", "asco", "guideline"],
    goto: { target: "sources", label: "All sources" },
  });

  return entries;
}

const STOP = new Set([
  "the", "a", "an", "is", "are", "was", "be", "been", "it", "its", "i", "im", "my", "me", "we", "our", "you", "your",
  "do", "does", "did", "can", "could", "will", "would", "should", "what", "whats", "when", "where", "who", "why",
  "how", "much", "many", "any", "some", "this", "that", "these", "those", "to", "of", "for", "in", "on", "at", "and",
  "or", "if", "with", "about", "get", "have", "has", "had", "there", "here", "still", "like", "want", "need",
]);

const SYNONYMS: Record<string, string[]> = {
  pregnant: ["pregnancy", "conceive"],
  pregnancy: ["pregnant", "conceive"],
  insurance: ["covered", "coverage", "plan"],
  covered: ["insurance", "coverage"],
  cover: ["insurance", "coverage", "covered"],
  cost: COST_WORDS,
  price: COST_WORDS,
  pay: COST_WORDS,
  afford: [...COST_WORDS, "aid", "grant"],
  cheap: [...COST_WORDS, "aid", "grant"],
  freeze: ["freezing", "frozen", "bank", "banking"],
  frozen: ["freezing", "freeze"],
  kid: ["children", "child", "kids"],
  kids: ["children", "child"],
  child: ["children", "kids"],
  children: ["child", "kids"],
  baby: ["children", "child", "pregnancy"],
  doctor: ["team", "oncologist", "question"],
  hurt: ["pain", "surgery", "anesthesia", "needle"],
  pain: ["hurt", "surgery", "needle"],
  shot: ["shots", "injection", "hormone", "syringe"],
  shots: ["shot", "injection", "hormone"],
  hormone: ["hormones", "shot", "shots", "stimulation", "estrogen"],
  hormones: ["hormone", "shot", "shots", "estrogen"],
  chemo: ["chemotherapy", "treatment"],
  chemotherapy: ["chemo", "treatment"],
  medicaid: ["medi", "cal"],
  gay: ["lgbtq"],
  lesbian: ["lgbtq"],
  trans: ["lgbtq", "transgender"],
  queer: ["lgbtq"],
  smoking: ["smoke", "health"],
  smoke: ["smoking", "health"],
  adoption: ["parenthood", "road", "surrogacy"],
  surrogacy: ["parenthood", "road", "adoption"],
};

function stem(w: string): string {
  let t = w.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (t.length > 4 && t.endsWith("ing")) t = t.slice(0, -3);
  else if (t.length > 3 && t.endsWith("es")) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith("s")) t = t.slice(0, -1);
  return t;
}

function tokens(s: string): string[] {
  return s
    .split(/\s+/)
    .map(stem)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

interface Indexed {
  entry: ChatEntry;
  title: Set<string>;
  kw: Set<string>;
  body: Set<string>;
}

let INDEX: Indexed[] | null = null;
function index(): Indexed[] {
  if (!INDEX) {
    INDEX = buildCorpus().map((entry) => ({
      entry,
      title: new Set(tokens(entry.title)),
      kw: new Set(entry.keywords.map(stem)),
      body: new Set(tokens(entry.text)),
    }));
  }
  return INDEX;
}

const CRISIS = /suicid|kill (myself|me)|end my life|hurt myself|harm myself|don'?t want to (live|be alive)/i;

export function askCorpus(query: string, answers: Answers): ChatAnswer {
  if (CRISIS.test(query)) return { kind: "crisis", entries: [] };

  const qTokens = new Set(tokens(query));
  for (const t of Array.from(qTokens)) {
    for (const syn of SYNONYMS[t] ?? []) qTokens.add(stem(syn));
  }
  if (qTokens.size === 0) return { kind: "none", entries: [] };

  const scored = index()
    .filter((ix) => matchesAudience(ix.entry.audience ?? {}, answers))
    .map((ix) => {
      let score = 0;
      for (const t of qTokens) {
        if (ix.title.has(t)) score += 3;
        else if (ix.kw.has(t)) score += 2.5;
        else if (ix.body.has(t)) score += 1;
      }
      return { ix, score };
    })
    .filter((s) => s.score >= 3)
    .sort((a, b) => b.score - a.score);

  const entries = scored.slice(0, 3).map((s) => s.ix.entry);
  return entries.length > 0 ? { kind: "results", entries } : { kind: "none", entries: [] };
}

/** Starter questions, filtered to who is asking. */
export function cannedQuestions(answers: Answers): string[] {
  const qs: { q: string; audience?: Audience }[] = [
    { q: "What will this cost?" },
    { q: "Will insurance cover it?" },
    { q: "How long does egg freezing take?", audience: { anatomy: ["ovaries_uterus"] } },
    { q: "Do the hormone shots feed hormone-sensitive cancers?", audience: { anatomy: ["ovaries_uterus"] } },
    { q: "Is sperm banking possible once treatment has started?", audience: { anatomy: ["testes"] } },
    { q: "Is there a medicine that protects sperm?", audience: { anatomy: ["testes"] } },
    { q: "What if I'm not sure about children?" },
    { q: "Where does this information come from?" },
  ];
  return qs.filter((c) => matchesAudience(c.audience ?? {}, answers)).map((c) => c.q);
}
