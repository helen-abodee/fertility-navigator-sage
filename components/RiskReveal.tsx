"use client";

import type { RiskAssessment } from "../lib/risk";
import AskTeam from "./AskTeam";
import Cite from "./Cite";

/** The dedicated risk screen between the questions and the options. */
export default function RiskReveal({
  risk,
  onContinue, onBack,
}: {
  risk: RiskAssessment;
  onContinue: () => void; onBack?: () => void;
}) {
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
      <span className="bg-accent-tint text-accent-ink animate-pop self-start rounded-full px-4 py-1.5 text-sm font-bold">
        {risk.label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {Array.from(
          new Set(
            risk.citations.map((c) => {
              const n = c.sourceName;
              if (n.toLowerCase().startsWith("study behind") || n.toLowerCase().startsWith("studies behind")) {
                return n.split(":")[1]?.split(",")[0]?.trim() ?? n;
              }
              return n.split(" (")[0].split(":")[0];
            }),
          ),
        ).slice(0, 2).map((name) => (
          <span key={name} className="border-line bg-card text-muted rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wide uppercase">
            Evidence: {name}
          </span>
        ))}
      </div>
      <h1 className="text-3xl">{risk.headline}</h1>
      <p className="text-[1.02rem]">{risk.body}</p>
      <AskTeam text={risk.askTeam} />
      <p className="text-muted text-sm">
        If this differs from what your doctor told you, bring both to your next appointment. Treatment plans and histories differ in ways this tool cannot see.
      </p>
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
