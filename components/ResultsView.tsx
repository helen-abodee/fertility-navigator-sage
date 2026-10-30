"use client";

import { useState } from "react";
import type { Results } from "../lib/results";
import type { PreservationOption } from "../lib/content-schema";
import Cite from "./Cite";

function StatusBadge({ option }: { option: PreservationOption }) {
  const label =
    option.status === "established"
      ? "Established"
      : option.status === "adjunct"
        ? "Sometimes added on"
        : "Still being studied";
  return (
    <span className="bg-accent-tint text-accent-ink rounded-full px-3 py-0.5 text-xs font-bold">
      {label}
    </span>
  );
}

function OptionCard({ option }: { option: PreservationOption }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="border-line bg-card rounded-2xl border p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl">{option.name}</h3>
        <StatusBadge option={option} />
      </div>
      <p className="mt-2">{option.shortDescription}</p>
      {option.statusNote && <p className="text-muted mt-1 text-sm">{option.statusNote}</p>}
      <Cite citations={option.citations} />

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="text-accent-ink mt-3 text-sm font-bold underline"
      >
        {open ? "Hide the steps" : "What actually happens, step by step"}
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-3">
          <ol className="flex flex-col gap-3">
            {option.steps.map((step, i) => (
              <li key={i} className="border-line border-l-2 pl-3">
                <p className="font-bold">
                  {i + 1}. {step.title}
                  {step.duration && <span className="text-muted font-normal"> · {step.duration}</span>}
                </p>
                <p className="text-[0.95rem]">{step.body}</p>
              </li>
            ))}
          </ol>
          <Cite citations={option.stepsCitations} />
          {option.timeline && <p className="text-sm font-bold">{option.timeline}</p>}
          <p className="text-[0.95rem]">{option.expectations}</p>
          <Cite citations={option.expectationsCitations} />
          {option.costs.length > 0 && (
            <div className="bg-paper rounded-xl p-3">
              <p className="text-sm font-bold">What it can cost</p>
              {option.costs.map((c, i) => (
                <div key={i} className="mt-2">
                  <p className="text-[0.95rem]">
                    {c.label}: <strong>{c.range}</strong>
                  </p>
                  {c.note && <p className="text-muted text-sm">{c.note}</p>}
                  <Cite citations={c.citations} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default function ResultsView({
  results,
  onStartOver,
}: {
  results: Results;
  onStartOver: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-8 px-6 py-10">
      <header>
        <h1 className="text-3xl">
          {results.survivorSpine ? "Where you stand now, and what can help" : "Options that may fit your situation"}
        </h1>
        <p className="text-muted mt-2">
          This is information, not advice. Decisions about fertility preservation belong with you
          and your care team, at your pace.
        </p>
      </header>

      {results.options.length > 0 && (
        <div className="flex flex-col gap-4">
          {!results.survivorSpine && <h2 className="text-xl">Your options</h2>}
          {results.options.map((o) => (
            <OptionCard key={o.id} option={o} />
          ))}
        </div>
      )}

      {results.guidance.map((g) => (
        <section key={g.id} className="border-line bg-card rounded-2xl border p-5">
          <h2 className="text-xl">{g.heading}</h2>
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
        </section>
      ))}

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

      <footer className="border-line mt-2 flex flex-col gap-4 border-t pt-5">
        <button
          type="button"
          onClick={onStartOver}
          className="border-line bg-card min-h-12 rounded-xl border px-4 py-3 font-bold"
        >
          Start over and erase everything
        </button>
        <p className="text-muted text-xs">
          Your answers never left this device. Last reviewed {results.lastReviewed}. Every fact
          above shows its source and date.
        </p>
      </footer>
    </main>
  );
}
