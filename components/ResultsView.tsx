"use client";

import { useState } from "react";
import type { Results } from "../lib/results";
import type { PreservationOption } from "../lib/content-schema";
import type { RiskAssessment } from "../lib/risk";
import type { Clinic, FeelingsAboutChildren, InsuranceType, TreatmentStage } from "../lib/types";
import Cite from "./Cite";
import ClinicsSection from "./ClinicsSection";
import CostEstimator from "./CostEstimator";
import CoverageChecker from "./CoverageChecker";
import ReflectionFlow from "./ReflectionFlow";
import JourneySection from "./JourneySection";
import OptionDetail from "./OptionDetail";
import Icon, { optionIcon } from "./icons";

type Tab = "start" | "options" | "money" | "clinics" | "health";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "start", label: "Start here", icon: "compass" },
  { id: "options", label: "Options", icon: "egg" },
  { id: "money", label: "Paying for it", icon: "dollar" },
  { id: "clinics", label: "Clinics", icon: "door" },
  { id: "health", label: "Health", icon: "sprout" },
];

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
      <span className="text-accent-ink text-xl" aria-hidden="true">&rsaquo;</span>
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
        <p key={i} className="text-sm">{c.label}: {c.range}</p>
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
  feelings,
  zip,
  browsing,
  onStartOver,
}: {
  results: Results;
  risk: RiskAssessment;
  clinics: Clinic[];
  insurance?: InsuranceType;
  stage?: TreatmentStage;
  feelings?: FeelingsAboutChildren;
  zip?: string | null;
  browsing?: boolean;
  onStartOver: () => void;
}) {
  const [openOption, setOpenOption] = useState<PreservationOption | null>(null);
  const [tab, setTab] = useState<Tab>("start");
  const [reflecting, setReflecting] = useState(false);
  const [costOption, setCostOption] = useState<PreservationOption | null>(null);
  const [visited, setVisited] = useState<Tab[]>(["start"]);
  const moneyUnlocked = browsing || feelings !== "no";
  const activeTabs = tabs.filter((t) => t.id !== "money" || moneyUnlocked);

  function goTab(next: Tab) {
    setTab(next);
    setVisited((v) => (v.includes(next) ? v : [...v, next]));
    window.scrollTo({ top: 0 });
  }
  const nextTab = activeTabs[activeTabs.findIndex((t) => t.id === tab) + 1];

  function downloadSummary() {
    setTimeout(() => window.print(), 50);
  }

  if (reflecting) {
    return (
      <div data-survey-section="2" className="bg-paper min-h-screen">
        <ReflectionFlow onDone={() => setReflecting(false)} />
      </div>
    );
  }

  if (openOption) {
    return <OptionDetail option={openOption} onClose={() => setOpenOption(null)} />;
  }

  const show = (t: Tab) => (tab === t ? "" : "hidden print:block");

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 pt-6 pb-10">
      <header>
        <h1 className="text-2xl">
          {browsing
            ? "Explore at your own pace"
            : results.survivorSpine
              ? "Where you stand, and what can help"
              : "Your results, one piece at a time"}
        </h1>
        <p className="text-muted mt-1 text-sm">
          Nothing here expires. Take the tabs in any order.
        </p>
      </header>

      <nav className="bg-paper sticky top-0 z-10 py-2 print:hidden" aria-label="Result sections">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${activeTabs.length}, 1fr)` }}>
          {activeTabs.map((t, i) => {
            const isCurrent = tab === t.id;
            const isVisited = visited.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => goTab(t.id)}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl border-[1.5px] px-1 py-1.5 ${
                  isCurrent
                    ? "border-accent bg-accent text-accent-contrast"
                    : isVisited
                      ? "border-accent/40 bg-accent-tint text-accent-ink"
                      : "border-line bg-card text-muted"
                }`}
              >
                <Icon name={t.icon} size={17} />
                <span className="text-[0.62rem] leading-tight font-bold">{t.label}</span>
                <span className="sr-only">{isVisited && !isCurrent ? " (visited)" : ""}</span>
              </button>
            );
          })}
        </div>
        <div className="bg-line mt-1.5 h-1 overflow-hidden rounded-full" aria-hidden="true">
          <div
            className="bg-accent h-full rounded-full transition-all"
            style={{ width: `${(visited.length / activeTabs.length) * 100}%` }}
          />
        </div>
      </nav>

      {/* Start here */}
      <div className={`flex flex-col gap-6 ${show("start")}`}>
        {!browsing && (
          <section className="border-line bg-card flex items-center justify-between gap-3 rounded-2xl border p-4" aria-label="Fertility risk">
            <p className="font-bold">{risk.headline}</p>
            <span className="bg-accent-tint text-accent-ink rounded-full px-3 py-0.5 text-xs font-bold whitespace-nowrap">
              {risk.label}
            </span>
          </section>
        )}

        <JourneySection />

        <button
          type="button"
          onClick={() => setReflecting(true)}
          className="border-line bg-card flex w-full items-center gap-4 rounded-2xl border p-4 text-left print:hidden"
        >
          <span className="bg-accent-tint text-accent-ink flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <Icon name="compass" size={26} />
          </span>
          <span className="flex-1">
            <span className="block text-lg font-bold">Thinking about children, someday?</span>
            <span className="text-muted block text-sm">An 8-screen walk through the decision, from published decision guides. Nothing saved.</span>
          </span>
          <span className="text-accent-ink text-xl" aria-hidden="true">&rsaquo;</span>
        </button>

        {results.doctorQuestions.length > 0 && (
          <section className="border-line bg-card rounded-2xl border p-5">
            <h2 className="text-xl">Questions you could ask your care team</h2>
            <ul className="mt-2 flex list-disc flex-col gap-2 pl-5">
              {results.doctorQuestions.map((q) => (
                <li key={q.id} className="text-[0.98rem]">{q.text}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Options */}
      <div className={`flex flex-col gap-3 ${show("options")}`}>
        {results.options.length > 0 && (
          <>
            <h2 className="text-xl">Your options</h2>
            {results.options.map((o) => (
              <div key={o.id}>
                <OptionRow option={o} onOpen={() => setOpenOption(o)} />
                <OptionPrint option={o} />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Paying for it */}
      <div className={`flex flex-col gap-6 ${moneyUnlocked ? show("money") : "hidden"}`} data-survey-section="3">
        <section className="border-line bg-card rounded-2xl border p-5">
          <h2 className="text-xl">Will insurance pay for this?</h2>
          <p className="text-muted mt-1 mb-3 text-sm">A few taps. No member IDs, ever.</p>
          <CoverageChecker insurance={insurance} stage={stage} />
        </section>

        {results.options.length > 0 && (
          <section className="border-line bg-card rounded-2xl border p-5 print:hidden">
            <h2 className="text-xl">What could an option cost?</h2>
            <p className="text-muted mt-1 mb-3 text-sm">Pick one. Coverage comes first; the full prices follow.</p>
            <div className="flex flex-wrap gap-2">
              {results.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={costOption?.id === o.id}
                  onClick={() => setCostOption(costOption?.id === o.id ? null : o)}
                  className={`rounded-full border-[1.5px] px-3.5 py-2 text-sm font-bold ${
                    costOption?.id === o.id ? "border-accent bg-accent-tint text-accent-ink" : "border-line bg-card"
                  }`}
                >
                  {o.name}
                </button>
              ))}
            </div>
            {costOption && (
              <div className="mt-3">
                <CostEstimator option={costOption} insurance={insurance} stage={stage} />
              </div>
            )}
          </section>
        )}

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
                    <a href={a.url} target="_blank" rel="noreferrer" className="underline">{a.name}</a>
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
      </div>

      {/* Clinics */}
      <div className={show("clinics")}>
        {clinics.length > 0 && <ClinicsSection clinics={clinics} zip={zip} />}
      </div>

      {/* Health */}
      <div className={show("health")}>
        {results.health.length > 0 && (
          <section>
            <h2 className="text-xl">Everyday things that affect sperm and eggs</h2>
            <p className="text-muted mt-1 text-sm">Information, not homework. Nothing here is a goal.</p>
            <div className="mt-3 flex flex-col gap-3">
              {results.health.map((h) => (
                <div key={h.id} className="border-line bg-card rounded-xl border p-4">
                  <p className="font-bold">{h.fact}</p>
                  {h.mechanism && <p className="mt-1 text-[0.95rem]">{h.mechanism}</p>}
                  {h.caveat && <p className="text-muted mt-1 text-sm">{h.caveat}</p>}
                  <Cite citations={h.citations} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {nextTab && (
        <button
          type="button"
          onClick={() => goTab(nextTab.id)}
          className="border-accent text-accent-ink flex min-h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] px-4 py-3 font-bold print:hidden"
        >
          Continue to {nextTab.label} <span aria-hidden="true">&rarr;</span>
        </button>
      )}

      <footer className="border-line mt-2 flex flex-col gap-4 border-t pt-5">
        <button
          type="button"
          onClick={downloadSummary}
          className="bg-accent text-accent-contrast min-h-12 rounded-xl px-4 py-3 font-bold print:hidden"
        >
          Download or print my summary
        </button>
        <p className="text-muted -mt-2 text-xs print:hidden">
          The summary is built by your own browser. Nothing is uploaded.
        </p>
        <button
          type="button"
          onClick={onStartOver}
          className="border-line bg-card min-h-12 rounded-xl border px-4 py-3 font-bold print:hidden"
        >
          Start over and erase everything
        </button>
        <p className="text-muted text-xs">
          Last reviewed {results.lastReviewed}.{" "}
          <a className="underline" href="/sources">All sources</a> ·{" "}
          <a className="underline" href="/privacy">Privacy policy</a>
        </p>
      </footer>
    </main>
  );
}
