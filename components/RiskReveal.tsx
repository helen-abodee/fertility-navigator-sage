"use client";

import type { RiskAssessment } from "../lib/risk";
import Cite from "./Cite";

/** The dedicated risk screen between the questions and the options. */
export default function RiskReveal({
  risk,
  onContinue,
}: {
  risk: RiskAssessment;
  onContinue: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-5 px-6 py-12">
      <span className="bg-accent-tint text-accent-ink animate-pop self-start rounded-full px-4 py-1.5 text-sm font-bold">
        {risk.label}
      </span>
      <h1 className="text-3xl">{risk.headline}</h1>
      <p className="text-[1.02rem]">{risk.body}</p>
      <p className="text-muted text-sm">{risk.askTeam}</p>
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
