"use client";

import type { RiskAssessment } from "../lib/risk";
import type { Answers } from "../lib/types";
import Cite from "./Cite";
import Icon from "./icons";
import { withGlossary } from "./Term";

const SIZE_WORD: Record<string, string> = { one: "one child", two: "two children", three_plus: "three or more children" };
const WHEN_WORD: Record<string, string> = {
  within_year: "within about a year",
  one_to_three: "in about 1 to 3 years",
  three_plus_years: "in 3 or more years",
};

/**
 * The risk screen, kept spare on purpose: one headline, one explanation,
 * your own timeline if you gave one, and everything else folded away.
 */
export default function RiskReveal({
  risk,
  answers,
  onContinue,
  onBack,
}: {
  risk: RiskAssessment;
  answers?: Answers;
  onContinue: () => void;
  onBack?: () => void;
}) {
  const size = answers?.familySize ? SIZE_WORD[answers.familySize] : undefined;
  const when = answers?.familyTimeline ? WHEN_WORD[answers.familyTimeline] : undefined;

  return (
    <main className="wash relative mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-5 px-6 py-12">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-accent-ink absolute top-6 left-4 rounded-lg px-2 py-2 text-sm font-bold"
        >
          &larr; Back
        </button>
      )}
      <h1 className="animate-pop text-3xl">{risk.headline}</h1>
      <p className="text-[1.02rem]">{withGlossary(risk.body)}</p>

      {/amenorrhea/i.test(risk.body) && (
        <details className="border-line bg-card rounded-xl border px-4 py-2.5">
          <summary className="text-muted cursor-pointer list-none text-sm">
            Why do studies measure amenorrhea? <span className="text-accent-ink float-right">+</span>
          </summary>
          <p className="mt-2 text-sm">
            Periods stopping is the clearest outward sign that treatment affected the ovaries, so
            studies count it as the stand-in for fertility risk. It is a signal, not a verdict either way.
          </p>
        </details>
      )}

      {(size || when) && (
        <div className="border-line bg-card rounded-2xl border p-4">
          <p className="text-accent-ink text-[0.68rem] font-bold tracking-[0.08em] uppercase">Your timeline</p>
          <p className="mt-1 text-sm">
            You hoped for {size ?? "children"}{when ? `, starting ${when}` : ""}. That is exactly what a
            fertility specialist plans cycles and timing around, so say it at the consult.
          </p>
        </div>
      )}

      <details className="border-line bg-card rounded-2xl border px-4 py-3">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold">
          <span className="bg-accent-tint text-accent-ink flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
            <Icon name="stethoscope" size={15} />
          </span>
          For your care team <span className="text-accent-ink ml-auto">+</span>
        </summary>
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm">
          <li>{risk.askTeam}</li>
          <li>Does this match what you have told me so far?</li>
          <li>Have I had fertility counseling yet, and if not, can we schedule it?</li>
        </ul>
      </details>

      <Cite citations={risk.citations} />
      <button
        type="button"
        onClick={onContinue}
        className="bg-accent text-accent-contrast mt-4 min-h-14 rounded-xl px-6 py-4 text-lg font-bold"
      >
        See my options
      </button>
    </main>
  );
}
