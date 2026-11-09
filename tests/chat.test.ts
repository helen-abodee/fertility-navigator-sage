import { describe, it, expect } from "vitest";
import { buildCorpus, askCorpus, CHAT_STRINGS, cannedQuestions } from "../lib/chat";
import type { Answers } from "../lib/types";

const anyone: Answers = {};
const ovaries: Answers = { anatomy: "ovaries_uterus" };
const testes: Answers = { anatomy: "testes" };

describe("chat corpus", () => {
  const corpus = buildCorpus();

  it("is substantial", () => {
    expect(corpus.length).toBeGreaterThan(30);
  });

  it("every entry either cites sources or is a pointer into the app", () => {
    for (const e of corpus) {
      expect(
        (e.citations && e.citations.length > 0) || e.goto !== undefined,
        `${e.id} has neither citations nor a goto target`,
      ).toBe(true);
    }
  });

  it("never contains personal probability language", () => {
    for (const e of corpus) {
      expect(e.text).not.toMatch(/your risk is \d/i);
    }
  });
});

describe("retrieval", () => {
  it("finds egg freezing costs for a cost question", () => {
    const a = askCorpus("how much does egg freezing cost", ovaries);
    expect(a.kind).toBe("results");
    expect(a.entries.map((e) => e.id)).toContain("egg_freezing.cost");
  });

  it("finds the coverage law for an insurance question", () => {
    const a = askCorpus("will my insurance pay for this", anyone);
    const ids = a.entries.map((e) => e.id).join(",");
    expect(ids).toMatch(/sb600_coverage|coverage|insurance/);
  });

  it("answers the sperm banking timing question for testes users", () => {
    const a = askCorpus("can I still bank sperm during treatment", testes);
    expect(a.entries.map((e) => e.id).some((id) => id.startsWith("sperm_banking"))).toBe(true);
  });

  it("does not surface sperm banking to ovaries users", () => {
    const a = askCorpus("can I still bank sperm during treatment", ovaries);
    expect(a.entries.every((e) => !e.id.startsWith("sperm_banking"))).toBe(true);
  });

  it("finds the hormone safety answer", () => {
    const a = askCorpus("will the hormone shots feed my cancer", ovaries);
    expect(a.entries.map((e) => e.id)).toContain("faq.hormone_shots_cancer_safety");
  });

  it("routes personal risk questions to the risk pointer, never a number", () => {
    const a = askCorpus("what are my chances of being infertile", anyone);
    expect(a.entries.map((e) => e.id)).toContain("pointer.risk");
    for (const e of a.entries) expect(e.text).not.toMatch(/\d+\s*(%|percent)/);
  });

  it("returns nothing for gibberish", () => {
    const a = askCorpus("zxcvb qwerty plugh", anyone);
    expect(a.kind).toBe("none");
    expect(a.entries.length).toBe(0);
  });

  it("shows the crisis line for self-harm language", () => {
    const a = askCorpus("I want to kill myself", anyone);
    expect(a.kind).toBe("crisis");
    expect(CHAT_STRINGS.crisis).toContain("988");
  });
});

describe("canned questions", () => {
  it("respect anatomy", () => {
    const t = cannedQuestions(testes).join(" ");
    const o = cannedQuestions(ovaries).join(" ");
    expect(t).toMatch(/sperm/i);
    expect(t).not.toMatch(/egg freezing/i);
    expect(o).toMatch(/egg/i);
    expect(o).not.toMatch(/sperm banking/i);
  });

  it("each canned question retrieves at least one entry", () => {
    for (const answers of [anyone, ovaries, testes]) {
      for (const q of cannedQuestions(answers)) {
        const a = askCorpus(q, answers);
        expect(a.entries.length, `no answer for canned question "${q}"`).toBeGreaterThan(0);
      }
    }
  });
});
