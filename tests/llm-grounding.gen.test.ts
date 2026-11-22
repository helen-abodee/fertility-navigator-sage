import { describe, it, expect } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { appContent } from "../content/app/content";
import { compare, considerations } from "../content/app/compare";
import { reflectionIntro, reflectionSteps } from "../content/app/reflection";
import type { Citation } from "../lib/types";
import { parenthoodIntro, parenthoodPaths } from "../content/app/parenthood";
import { stateCoverage, PLAN_LABELS, SERVICE_LABELS } from "../content/app/state-coverage";

/**
 * Generates content/llm/grounding.md when WRITE_LLM_GROUNDING=1: the complete
 * cited corpus the future LLM answer service may draw on, plus the hard answer
 * rules at the top. This file IS the model's entire world: anything not in it
 * is out of bounds, and regimen-level risk is deliberately excluded (the
 * deterministic risk module owns that; the model must never discuss personal
 * risk beyond pointing at it). Version the file with the commit that built it.
 */

const cite = (cs: Citation[]) =>
  Array.from(new Set(cs.map((c) => c.sourceName + (c.sourceDate ? ` (${c.sourceDate})` : "")))).join("; ");

function build(): string {
  const L: string[] = [];
  L.push("# What the Fertility Preservation Navigator knows");
  L.push("");
  L.push("Generated from the app content on " + new Date().toISOString().slice(0, 10) + ". Regenerate: WRITE_LLM_GROUNDING=1 npx vitest run tests/llm-grounding.gen.test.ts");
  L.push("");
  L.push("## ANSWER RULES (non-negotiable, enforced again by the output filter)");
  L.push("");
  L.push("0. VOICE: Answer like a kind, plainspoken nurse texting a patient, not a document. 2 to 4 short sentences, about 60 words, 90 at most. One idea per sentence. Simple words. Give the single most useful fact first; do not try to be complete. Mention at most ONE source name, in parentheses at the end, and only when it adds trust; for simple practical answers skip it. Never mention this document, a corpus, instructions, rules, or that you are reading anything; if asked where information comes from, just name the source naturally.");
  L.push("1. Answer ONLY from the facts in this document. If the answer is not here, say so in one sentence and point the person to their care team and the question list under My progress. Never answer from general knowledge.");
  L.push("2. Never state or estimate anyone's personal risk, chance, probability, or any percentage about fertility. If asked, say the tool shows a guideline risk group on the My progress screen and their care team can confirm what it means for them.");
  L.push("3. Never recommend one option over another, and never advise for or against preserving. Describe; compare in the sourced words; the decision belongs to the person and their care team.");
  L.push("4. Never claim any option or habit makes fertility better or raises anyone's chances. The sourced caveat is: preservation keeps a possibility open and does not guarantee a child later.");
  L.push("5. No diagnosis, no interpretation of symptoms, labs, or personal medical details. Those go to the care team.");
  L.push("6. Write at a 6th to 8th grade reading level, in short sentences. Durations always carry the word \"about\". No em dashes. No wellness platitudes, no urgency, no guilt.");
  L.push("7. Name the source of each fact when asked where it comes from, as this document does.");
  L.push("8. If the person mentions wanting to harm themselves, respond only with: call or text 988, the Suicide and Crisis Lifeline, free, confidential, around the clock. (The client also filters this before the model is called.)");
  L.push("");

  L.push("## Preservation options");
  for (const o of appContent.options) {
    L.push("");
    L.push(`### ${o.name} (${o.status})`);
    L.push(`${o.shortDescription}${o.statusNote ? " " + o.statusNote : ""}`);
    L.push(`Who it applies to: anatomy ${o.audience.anatomy?.join("/") ?? "any"}; stage ${o.audience.stages?.join("/") ?? "any"}${o.audience.treatments ? "; treatments " + o.audience.treatments.join("/") : ""}.`);
    for (const s of o.steps) L.push(`- ${s.title}: ${s.body}`);
    if (o.timeline) L.push(`Timeline: ${o.timeline}`);
    L.push(`What to expect: ${o.expectations}`);
    for (const c of o.costs) L.push(`Cost, ${c.label}: ${c.range}${c.note ? ` (${c.note})` : ""} [${cite(c.citations)}]`);
    L.push(`[Sources: ${cite([...o.citations, ...o.stepsCitations, ...o.expectationsCitations])}]`);
  }

  L.push("");
  L.push("## Insurance, coverage, and common questions");
  for (const g of appContent.guidance) {
    L.push("");
    L.push(`### ${g.heading}`);
    for (const p of g.paragraphs) L.push(`${p.text} [${cite(p.citations)}]`);
    for (const a of g.actions ?? []) L.push(`- ${a.label}: ${a.detail}`);
  }

  L.push("");
  L.push("## Financial aid programs");
  for (const a of appContent.aid) {
    L.push(`- ${a.name}: ${a.what} Eligibility: ${a.eligibility} Amount: ${a.cap}. [${cite(a.citations)}]`);
  }

  L.push("");
  L.push("## Everyday health facts");
  for (const h of appContent.health) {
    L.push(`- ${h.fact}${h.mechanism ? " " + h.mechanism : ""}${h.caveat ? " Caveat: " + h.caveat : ""} [${cite(h.citations)}]`);
  }

  L.push("");
  L.push("## Comparing options (worded grades, no rankings)");
  L.push(`Considerations: ${considerations.map((c) => c.label).join("; ")}.`);
  for (const e of compare) {
    const cells = Object.entries(e.cells)
      .map(([k, c]) => `${k}: ${c.note}`)
      .join("; ");
    L.push(`- ${e.optionId}: ${e.summary} ${cells}. [${cite(e.citations)}]`);
  }

  L.push("");
  L.push("## Thinking it through (the reflection path, for people unsure about children)");
  L.push(reflectionIntro.body);
  for (const r of reflectionSteps) {
    L.push(`- ${r.heading}: ${r.body} [${cite(r.citations)}]`);
  }

  L.push("");
  L.push("## Family building after treatment (Paths to Parenthood)");
  L.push(parenthoodIntro.text);
  for (const pp of parenthoodPaths) {
    L.push("");
    L.push(`### ${pp.name}`);
    L.push(pp.short);
    for (const para of pp.paragraphs) L.push(`${para.text} [${cite(para.citations)}]`);
  }

  L.push("");
  L.push("## Questions worth bringing to the care team");
  for (const q of appContent.doctorQuestions) L.push(`- (${q.category}) ${q.text}`);

  L.push("");
  L.push("## ASCO 2025 guideline, the recommendations in brief");
  L.push("Source for this whole section: Fertility Preservation in People With Cancer: ASCO Guideline Update (Su et al., J Clin Oncol 2025), recommendations read verbatim via the Children's Oncology Group endorsement. Use these as the guideline backbone; the option sections above carry the patient-level detail.");
  L.push("- Clinicians should discuss possible infertility as early as possible before treatment starts, with ALL patients, regardless of prognosis, finances, orientation, or family size (Rec 1.1, 1.3-1.4 QS).");
  L.push("- Patients who are interested OR unsure should be referred to reproductive specialists (Rec 1.2); discussing fertility can reduce distress even if the person never preserves (Rec 1.3).");
  L.push("- Fertility should be revisited yearly through the years after treatment (Rec 1.4).");
  L.push("- Established methods: sperm banking and TESE for males (Rec 3.1, 3.2); embryo, egg, and ovarian tissue freezing for females (Rec 4.1, 4.2, 4.10). Ovarian tissue freezing needs no hormone stimulation and can happen without delaying chemotherapy.");
  L.push("- Hormone suppression does NOT preserve fertility in males and should not be offered for that (Rec 3.3). GnRH agonists must never replace established methods for females; they may be offered as an add-on in breast cancer (Rec 4.8), and can help stop periods during urgent chemotherapy (Rec 4.9).");
  L.push("- Males should bank before the first dose when possible: even a single treatment can affect sperm DNA (Rec 3.5). At least 3 samples are suggested, and any banked sperm offers a chance at biological parenthood (Rec 3.1 QS).");
  L.push("- Egg and embryo freezing no longer wait for a menstrual cycle, and for hormone-sensitive cancers, aromatase-inhibitor stimulation protocols have not shown added recurrence risk (Rec 4.1/4.2 QS).");
  L.push("- Post-treatment egg or embryo freezing may be offered to survivors; there may be no egg yield within about 3 months of the last chemotherapy dose (Rec 4.3).");
  L.push("- Ovarian transposition may be offered when pelvic radiation is planned, done as close to radiation as possible; scatter means it is not always successful (Rec 4.5).");
  L.push("");
  L.push("## State fertility preservation insurance laws (per the Alliance for Fertility Preservation's tracking, 2026-11-10)");
  L.push("California is covered in detail in the insurance section above (SB 600, SB 729). Other jurisdictions with laws, with what their law reaches:");
  for (const sc of stateCoverage) {
    L.push(`- ${sc.name}: plans ${sc.plans.map((x) => PLAN_LABELS[x]).join(", ") || "see AFP"}; covers ${sc.services.map((x) => SERVICE_LABELS[x]).join(", ")}${sc.notes.length ? "; notes: " + sc.notes.join(", ").replace(/_/g, " ") : ""}.`);
  }
  L.push("States not listed have no fertility preservation insurance law per AFP's tracking. Self-funded employer plans are exempt from every state mandate (federal ERISA rule). Always verify with the plan.");
  L.push("");
  L.push("## Bibliography (the only universe of sources; cite these names)");
  L.push("- Fertility Preservation in People With Cancer: ASCO Guideline Update, Su et al., J Clin Oncol 2025 (PMID 40106739)");
  L.push("- UCSD CRISP tool (oncofertilityrisk.com): the app's risk engine; the model never quotes its numbers");
  L.push("- POSITIVE trial: Partridge et al., N Engl J Med 2023;388:1645-56 (PMID 37133584)");
  L.push("- American Cancer Society: Fertility Assistance After Cancer (2025); Having a Baby After Cancer: Pregnancy (2024)");
  L.push("- Memorial Sloan Kettering patient education: pre-treatment and post-treatment fertility pages, sperm banking, building a family");
  L.push("- ASRM patient resources; NCI patient pages; Children's Oncology Group guidance");
  L.push("- Alliance for Fertility Preservation: coverage map, post-treatment family building, UCSD/AFP insurance toolkit (D4)");
  L.push("- California SB 600 (2019) and SB 729 (2024, plan years 2026) bill texts");
  L.push("- Ottawa Personal Decision Guide; BEFORE decision aid; CDC reproductive life plan (the reflection path's sources)");
  L.push("- Benedict et al., Roadmap to Parenthood decision aid studies (JMIR 2021, 2022; pilot 2024): the family-building model");
  L.push("- The 12 financial aid organizations' own published program pages (re-verified 2026-11)");
  L.push("");
  L.push("## What is deliberately NOT in this corpus");
  L.push("- Regimen-level or personal infertility risk of any kind. The app's deterministic risk module (UCSD CRISP categories) owns that; the model only points to the My progress screen.");
  L.push("- Anything about specific clinics beyond the fact that the Clinics tab maps them with distances.");
  L.push("- Medical advice, dosing, scheduling, or interpretation of anyone's labs, pathology, or prognosis.");
  L.push("");
  return L.join("\n");
}

describe("llm grounding corpus", () => {
  it("builds with every section present", () => {
    const md = build();
    for (const h of ["ANSWER RULES", "Preservation options", "Financial aid", "Everyday health", "reflection path", "NOT in this corpus"]) {
      expect(md).toContain(h);
    }
    expect(md).not.toMatch(/\bimproves fertility\b/i);
    if (process.env.WRITE_LLM_GROUNDING === "1") {
      mkdirSync("content/llm", { recursive: true });
      writeFileSync("content/llm/grounding.md", md);
    }
  });
});
