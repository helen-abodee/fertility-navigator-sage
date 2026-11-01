"use client";

import { useState } from "react";
import type { Results } from "../lib/results";
import type { PreservationOption } from "../lib/content-schema";
import type { RiskAssessment } from "../lib/risk";
import type { Clinic, InsuranceType, TreatmentStage } from "../lib/types";
import Cite from "./Cite";
import ClinicsSection from "./ClinicsSection";
import CoverageChecker from "./CoverageChecker";
import OptionDetail from "./OptionDetail";
import Icon, { optionIcon } from "./icons";

function OptionRow({ option, onOpen }: { option: PreservationOption; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="border-line bg-card flex w-full items-center gap-4 rounded-2xl border p-4 text-left"
    >
      <span className="bg-accent-tint text-accent-ink flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
        <Icon name={optionIcon[option.id] ?? "clipboard"} size={26} />
      </span>
      <span className="flex-1">
        <span className="block text-lg font-bold">{option.name}</span>
        <span className="text-muted block text-sm">{option.shortDescription}</span>
      </span>
      <span className="text-accent-ink text-xl" aria-hidden="true">
        &rsaquo;
      </span>
    </button>
  );
}

/** Print-only expansion so the on-device summary still carries the details. */
function OptionPrint({ option }: { option: PreservationOption }) {
  return (
    <div className="hidden print:block">
      <ol className="mt-2 pl-5">
        {option.steps.map((s, i) => (
          <li key={i} className="text-sm">
            <strong>{s.title}</strong>
            {s.duration ? ` (${s.duration})` : ""}: {s.body}
          </li>
        ))}
      </ol>
      {option.costs.map((c, i) => (
        <p key={i} className="text-sm">
          {c.label}: {c.range}
        </p>
      ))}
      <p className="text-sm">{option.expectations}</p>
    </div>
  );
}

export default function ResultsView({
  results,
  risk,
  clinics,
  insurance,
  stage,
  zip,
  onStartOver,
}: {
  results: Results;
  risk: RiskAssessment;
  clinics: Clinic[];
  insurance?: InsuranceType;
  stage?: TreatmentStage;
  zip?: string | null;
  onStartOver: () => void;
}) {
  const [openOption, setOpenOption] = useState<PreservationOption | null>(null);

  function downloadSummary() {
    setTimeout(() => window.print(), 50);
  }

  if (openOption) {
    return (
      <OptionDetail
        option={openOption}
        insurance={insurance}
        stage={stage}
        onClose={() => setOpenOption(null)}
      />
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-8 px-6 py-10">
      <header>
        <h1 className="text-3xl">
          {results.survivorSpine ? "Where you stand now, and what can help" : "Options that may fit your situation"}
        </h1>
      </header>

      <section className="border-line bg-card flex items-center justify-between gap-3 rounded-2xl border p-4" aria-label="Fertility risk">
        <p className="font-bold">{risk.headline}</p>
        <span className="bg-accent-tint text-accent-ink rounded-full px-3 py-0.5 text-xs font-bold whitespace-nowrap">
          {risk.label}
        </span>
      </section>

      {results.options.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl">Your options</h2>
          {results.options.map((o) => (
            <div key={o.id}>
              <OptionRow option={o} onOpen={() => setOpenOption(o)} />
              <OptionPrint option={o} />
            </div>
          ))}
        </section>
      )}

      <section className="border-line bg-card rounded-2xl border p-5">
        <h2 className="text-xl">Will insurance pay for this?</h2>
        <p className="text-muted mt-1 mb-3 text-sm">A few taps. No member IDs, ever.</p>
        <CoverageChecker insurance={insurance} stage={stage} />
      </section>

      {results.guidance.map((g) => (
        <details key={g.id} className="border-line bg-card rounded-2xl border p-5 print:hidden">
          <summary className="cursor-pointer list-none">
            <span className="font-heading text-xl font-semibold">{g.heading}</span>
            <span className="text-accent-ink float-right" aria-hidden="true">+</span>
          </summary>
          {g.paragraphs.map((p, i) => (
            <div key={i} className="mt-2">
              <p className="text-[0.98rem]">{p.text}</p>
              <Cite citations={p.citations} />
            </div>
          ))}
          {g.actions?.map((a, i) => (
            <div key={i} className="border-line mt-3 border-t pt-3">
              <p className="font-bold">{a.label}</p>
              <p className="text-[0.95rem]">{a.detail}</p>
              <Cite citations={a.citations} />
            </div>
          ))}
        </details>
      ))}

      <div className="hidden print:block">
        {results.guidance.map((g) => (
          <section key={g.id}>
            <h2 className="text-lg">{g.heading}</h2>
            {g.paragraphs.map((p, i) => (
              <p key={i} className="text-sm">{p.text}</p>
            ))}
            {g.actions?.map((a, i) => (
              <p key={i} className="text-sm"><strong>{a.label}.</strong> {a.detail}</p>
            ))}
          </section>
        ))}
      </div>

      {results.aid.length > 0 && (
        <section>
          <h2 className="text-xl">Help paying for it</h2>
          <p className="text-muted mt-1 text-sm">
            Many of these programs reimburse you after you pay, so ask each one about timing.
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {results.aid.map((a) => (
              <div key={a.id} className="border-line bg-card rounded-xl border p-4">
                <p className="font-bold">
                  <a href={a.url} target="_blank" rel="noreferrer" className="underline">
                    {a.name}
                  </a>
                </p>
                <p className="text-[0.95rem]">{a.what}</p>
                <p className="text-muted text-sm">Who it's for: {a.eligibility}</p>
                <p className="text-muted text-sm">Amount: {a.cap}</p>
                {a.payUpfront && (
                  <p className="text-muted text-sm">You may need to pay first and be paid back.</p>
                )}
                <Cite citations={a.citations} />
              </div>
            ))}
          </div>
        </section>
      )}

      {results.doctorQuestions.length > 0 && (
        <section className="border-line bg-card rounded-2xl border p-5">
          <h2 className="text-xl">Questions you could ask your care team</h2>
          <ul className="mt-2 flex list-disc flex-col gap-2 pl-5">
            {results.doctorQuestions.map((q) => (
              <li key={q.id} className="text-[0.98rem]">
                {q.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {clinics.length > 0 && <ClinicsSection clinics={clinics} zip={zip} />}

      <footer className="border-line mt-2 flex flex-col gap-4 border-t pt-5">
        <button
          type="button"
          onClick={downloadSummary}
          className="bg-accent text-accent-contrast min-h-12 rounded-xl px-4 py-3 font-bold print:hidden"
        >
          Download or print my summary
        </button>
        <p className="text-muted -mt-2 text-xs print:hidden">
          The summary is built by your own browser. Nothing is uploaded. You can save it as a PDF
          or hand it to your care team.
        </p>
        <button
          type="button"
          onClick={onStartOver}
          className="border-line bg-card min-h-12 rounded-xl border px-4 py-3 font-bold print:hidden"
        >
          Start over and erase everything
        </button>
        <p className="text-muted text-xs">
          Last reviewed {results.lastReviewed}. Every fact above shows its source and date.{" "}
          <a className="underline" href="/sources">All sources</a> ·{" "}
          <a className="underline" href="/privacy">Privacy policy</a>
        </p>
      </footer>
    </main>
  );
}
