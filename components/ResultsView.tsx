"use client";

import { useEffect, useState } from "react";
import type { Results } from "../lib/results";
import type { PreservationOption } from "../lib/content-schema";
import type { RiskAssessment } from "../lib/risk";
import type { Clinic, FeelingsAboutChildren, InsuranceType, TreatmentStage } from "../lib/types";
import AskTeam from "./AskTeam";
import Cite from "./Cite";
import { honestCaveat } from "../content/app/options";
import { aidFit } from "../lib/aid-fit";
import type { Answers } from "../lib/types";
import ClinicsSection from "./ClinicsSection";
import CostEstimator from "./CostEstimator";
import CompareTab from "./CompareTab";
import CoverageChecker from "./CoverageChecker";
import ReadMore from "./ReadMore";
import ReachOut from "./ReachOut";
import AskSection from "./AskSection";
import ParenthoodSection from "./ParenthoodSection";
import PathHome from "./PathHome";
import CheckinCard from "./CheckinCard";
import NudgeCard from "./NudgeCard";
import { noteTopic } from "../lib/checkin";
import { cashRange } from "./CostEstimator";
import { loadJourney } from "../lib/storage";
import type { Journey } from "../lib/journey";
import type { RoadGo } from "../lib/road";
import { track } from "../lib/analytics";
import ReflectionFlow from "./ReflectionFlow";
import JourneySection from "./JourneySection";
import OptionDetail from "./OptionDetail";
import ProfileSection from "./ProfileSection";
import ProfileNudge from "./ProfileNudge";
import Icon, { optionIcon } from "./icons";

type Tab = "path" | "options" | "parenthood" | "compare" | "money" | "clinics" | "health";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "path", label: "Road", icon: "compass" },
  { id: "options", label: "Options", icon: "egg" },
  { id: "parenthood", label: "Family", icon: "heart" },
  { id: "money", label: "Financing", icon: "dollar" },
  { id: "compare", label: "Compare", icon: "clipboard" },
  { id: "clinics", label: "Clinics", icon: "door" },
  { id: "health", label: "Health", icon: "sprout" },
];

/** One header pattern for every card: same circle, same icon size, same type size. */
function CardHeader({ icon, title, badge }: { icon: string; title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="bg-accent-tint text-accent-ink flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        <Icon name={icon} size={20} />
      </span>
      <h2 className="text-lg leading-tight">{title}</h2>
      {badge && (
        <span className="bg-accent-tint text-accent-ink ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap">
          {badge}
        </span>
      )}
    </div>
  );
}

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
  fertilityPosition,
  familySize,
  age,
  anatomy,
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
  fertilityPosition?: Answers["fertilityPosition"];
  familySize?: Answers["familySize"];
  age?: number;
  anatomy?: Answers["anatomy"];
  zip?: string | null;
  browsing?: boolean;
  onStartOver: () => void;
}) {
  const [openOption, setOpenOption] = useState<PreservationOption | null>(null);
  const [tab, setTab] = useState<Tab>("path");
  const [reflecting, setReflecting] = useState(false);
  const [costOption, setCostOption] = useState<PreservationOption | null>(null);
  const [visited, setVisited] = useState<Tab[]>(["path"]);
  const [panel, setPanel] = useState<"progress" | "reach" | "ask" | "checkin" | null>(null);
  const [roadJourney, setRoadJourney] = useState<Journey | null>(null);
  const [verdict, setVerdict] = useState<"likely_covered" | "likely_not_covered" | "depends" | null>(null);
  useEffect(() => {
    // Journey lives in localStorage; read it after mount so server and
    // client render the same first frame.
    setRoadJourney(loadJourney());
  }, [panel, tab]);
  const answersForProfile: Answers = { age, stage, anatomy, insurance, feelings, zip, fertilityPosition, familySize };
  const moneyUnlocked = browsing || feelings !== "no";
  // The health tab is for after treatment: at diagnosis it reads as homework
  // (care-team feedback), so lanes still facing treatment don't see it.
  const healthUnlocked = stage !== "not_started" && stage !== "in_treatment";
  // Family building is the after-treatment path (Benedict's Roadmap model);
  // people still facing treatment see preservation options instead.
  const activeTabs = tabs.filter(
    (t) =>
      (t.id !== "money" || moneyUnlocked) &&
      ((t.id !== "health" && t.id !== "parenthood") || healthUnlocked),
  );

  function goTab(next: Tab) {
    track("tab_viewed");
    noteTopic(next);
    if (next === "money" && !costOption && results.options.length > 0) {
      setCostOption(results.options[0]);
    }
    if (next === "compare") track("compare_used");
    setTab(next);
    setVisited((v) => (v.includes(next) ? v : [...v, next]));
    window.scrollTo({ top: 0 });
  }
  const nextTab = activeTabs[activeTabs.findIndex((t) => t.id === tab) + 1];

  function downloadSummary() {
    track("summary_downloaded");
    setTimeout(() => window.print(), 50);
  }

  if (reflecting) {
    return (
      <div data-survey-section="2" className="bg-paper min-h-dvh">
        <ReflectionFlow onDone={() => setReflecting(false)} />
      </div>
    );
  }

  if (openOption) {
    return <OptionDetail option={openOption} onClose={() => setOpenOption(null)} />;
  }

  if (panel === "ask") {
    return (
      <AskSection
        answers={answersForProfile}
        guidance={results.guidance}
        onClose={() => setPanel(null)}
        onNavigate={(target) => {
          if (target === "progress") {
            setPanel("progress");
          } else if (target === "reflect") {
            setPanel(null);
            setReflecting(true);
          } else {
            setPanel(null);
            goTab(target as Tab);
          }
        }}
      />
    );
  }

  if (panel === "checkin") {
    return (
      <div className="bg-paper fixed inset-0 z-50 overflow-y-auto">
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-6 py-6">
          <button type="button" onClick={() => setPanel(null)} className="text-accent-ink -ml-2 self-start rounded-lg px-2 py-2 text-sm font-bold">
            &larr; Back
          </button>
          <CheckinCard onReachOut={() => setPanel("reach")} />
        </div>
      </div>
    );
  }

  if (panel === "reach") {
    return (
      <ReachOut
        clinics={clinics}
        anatomy={anatomy}
        zip={zip}
        stage={stage}
        guidance={results.guidance}
        onClose={() => setPanel(null)}
      />
    );
  }

  if (panel === "progress") {
    return (
      <div className="bg-paper fixed inset-0 z-50 overflow-y-auto">
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-6 py-6">
          <button type="button" onClick={() => setPanel(null)} className="text-accent-ink -ml-2 self-start rounded-lg px-2 py-2 text-sm font-bold">
            &larr; Back
          </button>
          {!browsing && (
            <section className="border-line bg-card flex items-center justify-between gap-3 rounded-2xl border p-4" aria-label="Fertility risk">
              <p className="text-lg leading-tight font-bold">{risk.headline}</p>
              <span className="bg-accent-tint text-accent-ink rounded-full px-3 py-0.5 text-xs font-bold whitespace-nowrap">
                {risk.label}
              </span>
            </section>
          )}

          <JourneySection riskLabel={browsing ? undefined : risk.label} />

          <NudgeCard
            mode={
              stage === "in_treatment"
                ? "during"
                : stage === "finished"
                  ? "after"
                  : fertilityPosition === "not_pursuing" || fertilityPosition === "preserved"
                    ? "waiting"
                    : "deciding"
            }
          />

          <button
            type="button"
            onClick={() => { setPanel(null); setReflecting(true); }}
            className="border-line bg-card flex w-full items-center gap-2.5 rounded-2xl border p-4 text-left print:hidden"
          >
            <span className="bg-accent-tint text-accent-ink flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Icon name="compass" size={20} />
            </span>
            <span className="flex-1">
              <span className="block text-lg leading-tight font-bold">Thinking about children, someday?</span>
              <span className="text-muted block text-sm">An 8-screen walk, from published decision guides. Nothing saved.</span>
            </span>
            <span className="text-accent-ink text-xl" aria-hidden="true">&rsaquo;</span>
          </button>

          {results.doctorQuestions.length > 0 && (
            <section className="border-line bg-card rounded-2xl border p-5">
              <CardHeader icon="stethoscope" title="Questions for your care team" />
              <p className="text-muted mt-1 text-sm">Tap a topic. Bring the ones that fit.</p>
              <div className="mt-3 flex flex-col gap-2">
                {Array.from(new Set(results.doctorQuestions.map((q) => q.category))).map((cat) => {
                  const qs = results.doctorQuestions.filter((q) => q.category === cat);
                  return (
                    <details key={cat} className="border-line rounded-lg border px-4 py-3 print:hidden">
                      <summary className="cursor-pointer list-none font-bold">
                        {cat} <span className="text-muted text-sm font-normal">({qs.length})</span>
                        <span className="text-accent-ink float-right" aria-hidden="true">+</span>
                      </summary>
                      <ul className="mt-2 flex list-disc flex-col gap-2 pl-5">
                        {qs.map((q) => (
                          <li key={q.id} className="text-[0.95rem]">{q.text}</li>
                        ))}
                      </ul>
                    </details>
                  );
                })}
              </div>
              <ul className="mt-2 hidden list-disc flex-col gap-2 pl-5 print:flex">
                {results.doctorQuestions.map((q) => (
                  <li key={q.id} className="text-sm">{q.text}</li>
                ))}
              </ul>
            </section>
          )}

          <ProfileSection answers={answersForProfile} />
          <button type="button" onClick={() => setPanel(null)} className="border-line bg-card min-h-12 rounded-xl border px-4 py-3 font-bold">
            Back
          </button>
        </div>
      </div>
    );
  }

  const show = (t: Tab) => (tab === t ? "" : "hidden print:block");

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 pt-6 pb-28">
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

      {/* Options */}
      <div className={`flex flex-col gap-3 ${show("options")}`}>
        <div className="border-line bg-card rounded-xl border p-3">
          <p className="text-[0.92rem]">{honestCaveat.text}</p>
          <Cite citations={honestCaveat.citations} />
        </div>
        {results.options.length > 0 && (
          <>
            <h2 className="text-lg">Your options</h2>
            <p className="text-muted mt-1 text-sm">
              Which method fits you is decided with a fertility specialist at your consult. This list is so you arrive knowing the landscape.
            </p>
            {results.options.map((o) => (
              <div key={o.id}>
                <OptionRow option={o} onOpen={() => { track("option_opened"); setOpenOption(o); }} />
                <OptionPrint option={o} />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Compare */}
      <div className={show("compare")}>
        <CompareTab options={results.options} />
      </div>

      {/* The road */}
      <div className={`flex flex-col gap-6 ${show("path")}`}>
        <ProfileNudge answers={answersForProfile} />
        <PathHome
          answers={answersForProfile}
          journey={roadJourney}
          riskLabel={browsing ? undefined : risk.label}
          visited={visited}
          onGo={(go: RoadGo) => {
            if (go.kind === "tab") goTab(go.tab as Tab);
            else if (go.kind === "reach") { track("reach_out_opened"); setPanel("reach"); }
            else if (go.kind === "progress") setPanel("progress");
            else if (go.kind === "reflect") setReflecting(true);
            else if (go.kind === "checkin") setPanel("checkin");
          }}
        />
      </div>

      {/* Family building (after treatment) */}
      <div className={`flex flex-col gap-6 ${show("parenthood")}`}>
        <ParenthoodSection />
      </div>

      {/* Financing */}
      <div className={`flex flex-col gap-6 ${moneyUnlocked ? show("money") : "hidden"}`} data-survey-section="3">
        {verdict && costOption && (() => {
          const { min, max } = cashRange(costOption, 1);
          const cash = min > 0 ? `about $${min.toLocaleString()} to $${max.toLocaleString()}` : null;
          return (
            <section className="border-accent bg-accent-tint rounded-2xl border-[1.5px] p-4">
              <p className="text-accent-ink text-[0.68rem] font-bold tracking-[0.08em] uppercase">Your ballpark · {costOption.name}</p>
              <p className="mt-1 text-sm font-bold">
                {verdict === "likely_covered"
                  ? `Likely your plan's usual share, not the ${cash ? `${cash} ` : ""}cash price. One call verifies it.`
                  : verdict === "likely_not_covered"
                    ? `Likely ${cash ?? "the clinic's quoted price"} out of pocket, before the aid in step 3.`
                    : `The cash price runs ${cash ?? "by clinic quote"}; step 1 decides who pays it.`}
              </p>
            </section>
          );
        })()}

        <section className="border-line bg-card rounded-2xl border p-5">
          <p className="text-accent-ink text-[0.68rem] font-bold tracking-[0.08em] uppercase">Step 1 · Where you stand</p>
          <h2 className="text-lg">Will insurance pay for this?</h2>
          <CoverageChecker insurance={insurance} stage={stage} onVerdict={setVerdict} />
        </section>

        {results.options.length > 0 && (
          <section className="border-line bg-card rounded-2xl border p-5 print:hidden">
            <p className="text-accent-ink text-[0.68rem] font-bold tracking-[0.08em] uppercase">Step 2 · What it costs</p>
            <h2 className="text-lg">What could an option cost?</h2>
            <select
              aria-label="Cost option"
              value={costOption?.id ?? ""}
              onChange={(e) => setCostOption(results.options.find((o) => o.id === e.target.value) ?? null)}
              className="border-line bg-card min-h-12 w-full rounded-xl border-[1.5px] px-3 text-sm font-bold"
            >
              <option value="">Pick an option</option>
              {results.options.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
            {costOption && (
              <div className="mt-3">
                <CostEstimator option={costOption} insurance={insurance} stage={stage} />
              </div>
            )}
          </section>
        )}

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

        {results.aid.length > 0 && (() => {
          const answersForFit: Answers = { age, stage, anatomy };
          const checked = results.aid.map((a) => ({ a, r: aidFit(a, { ...answersForFit }) }));
          const mayFit = checked.filter((x) => x.r.fit === "may_fit");
          const unlikely = checked.filter((x) => x.r.fit === "unlikely");
          return (
            <section>
              <div><p className="text-accent-ink text-[0.68rem] font-bold tracking-[0.08em] uppercase">Step 3 · Aid that can cut it</p>
            <h2 className="text-lg">Financial aid programs</h2></div>
              <div className="mt-2">
                <AskTeam text="You don't have to sort these alone. Social workers connect patients to these programs every week; ask yours to help you apply." />
              </div>
              <p className="text-muted mt-2 text-sm">
                Checked against your age and treatment stage. The final word always belongs to the
                program, so "unlikely" is worth confirming, not a closed door.
              </p>
              <div className="mt-3 flex flex-col gap-3">
                {mayFit.map(({ a }) => (
                  <div key={a.id} className="border-line bg-card rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold">
                        <a href={a.url} target="_blank" rel="noreferrer" className="underline">{a.name}</a>
                      </p>
                      <p className="num text-accent-ink max-w-[45%] text-right text-sm leading-tight font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {a.cap === "not published" ? "amount varies" : a.cap.length <= 26 ? a.cap : ""}
                      </p>
                    </div>
                    {a.cap !== "not published" && a.cap.length > 26 && (
                      <p className="text-accent-ink text-sm font-bold">{a.cap}</p>
                    )}
                    <p className="text-[0.95rem]">{a.what}</p>
                    <p className="text-muted text-sm">Who it's for: {a.eligibility}</p>
                    {a.payUpfront && (
                      <p className="text-muted text-sm">You may need to pay first and be paid back.</p>
                    )}
                    <Cite citations={a.citations} />
                  </div>
                ))}
              </div>
              {unlikely.length > 0 && (
                <details className="border-line bg-card mt-3 rounded-xl border p-4 print:hidden">
                  <summary className="text-muted cursor-pointer list-none text-sm font-bold">
                    Probably not a fit for you ({unlikely.length}), and why
                    <span className="text-accent-ink float-right" aria-hidden="true">+</span>
                  </summary>
                  <div className="mt-2 flex flex-col gap-3">
                    {unlikely.map(({ a, r }) => (
                      <div key={a.id} className="border-line border-t pt-2">
                        <p className="text-sm font-bold">{a.name}</p>
                        <p className="text-muted text-sm">Why: {r.reasons.join("; ")}.</p>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </section>
          );
        })()}
      </div>

      {/* Clinics */}
      <div className={show("clinics")}>
        {clinics.length > 0 && <ClinicsSection clinics={clinics} zip={zip} anatomy={anatomy} />}
      </div>

      {/* Health */}
      <div className={`flex flex-col gap-6 ${show("health")}`}>
        <p className="text-muted text-sm">
          For the stretch after treatment: everyday factors tied to sperm and egg health. Nothing here is urgent, and none of it is a guarantee.
        </p>
        <div className="border-line bg-card rounded-xl border p-3">
          <p className="text-[0.92rem]">{honestCaveat.text}</p>
          <Cite citations={honestCaveat.citations} />
        </div>
        {results.health.some((h) => h.group === "prep") && (
          <section>
            <h2 className="text-lg">Getting ready to preserve</h2>
            <p className="text-muted mt-1 text-sm">
              These everyday things affect sperm and egg quality going into preservation. Information,
              not homework; your care team can say which matter for your timeline.
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {results.health.filter((h) => h.group === "prep").map((h) => (
                <div key={h.id} className="border-line bg-card flex gap-3 rounded-xl border p-4">
                  <span className="bg-accent-tint text-accent-ink flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <Icon name={h.icon ?? "sprout"} size={20} />
                  </span>
                  <div>
                    <p className="font-bold">{h.fact}</p>
                    {h.mechanism && <p className="mt-1 text-[0.95rem]">{h.mechanism}</p>}
                    {h.caveat && <p className="text-muted mt-1 text-sm">{h.caveat}</p>}
                    <ReadMore links={h.readMore} />
                    {h.readMore && h.readMore.length > 0 ? (
                      <div className="hidden print:block">
                        <Cite citations={h.citations} />
                      </div>
                    ) : (
                      <Cite citations={h.citations} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {results.health.some((h) => h.group !== "prep") && (
          <section>
            <h2 className="text-lg">Also good to know</h2>
            <div className="mt-3 flex flex-col gap-3">
              {results.health.filter((h) => h.group !== "prep").map((h) => (
                <div key={h.id} className="border-line bg-card flex gap-3 rounded-xl border p-4">
                  <span className="bg-accent-tint text-accent-ink flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <Icon name={h.icon ?? "sprout"} size={20} />
                  </span>
                  <div>
                    <p className="font-bold">{h.fact}</p>
                    {h.mechanism && <p className="mt-1 text-[0.95rem]">{h.mechanism}</p>}
                    {h.caveat && <p className="text-muted mt-1 text-sm">{h.caveat}</p>}
                    <ReadMore links={h.readMore} />
                    {h.readMore && h.readMore.length > 0 ? (
                      <div className="hidden print:block">
                        <Cite citations={h.citations} />
                      </div>
                    ) : (
                      <Cite citations={h.citations} />
                    )}
                  </div>
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

      <div className="hidden print:block">
        <JourneySection riskLabel={browsing ? undefined : risk.label} />
      </div>

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
      <nav
        className="border-line bg-card fixed right-0 bottom-0 left-0 z-20 border-t print:hidden"
        aria-label="Quick actions"
      >
        <div className="mx-auto grid max-w-md grid-cols-3">
          <button type="button" onClick={() => setPanel("progress")} className="flex flex-col items-center gap-0.5 py-2.5">
            <span className="text-accent-ink"><Icon name="sprout" size={20} /></span>
            <span className="text-[0.68rem] font-bold">My progress</span>
          </button>
          <button type="button" onClick={() => { track("reach_out_opened"); setPanel("reach"); }} className="flex flex-col items-center gap-0.5 py-2.5">
            <span className="text-accent-ink"><Icon name="heart" size={20} /></span>
            <span className="text-[0.68rem] font-bold">Reach out</span>
          </button>
          <button type="button" onClick={() => { track("chat_opened"); setPanel("ask"); }} className="flex flex-col items-center gap-0.5 py-2.5">
            <span className="text-accent-ink"><Icon name="chat" size={20} /></span>
            <span className="text-[0.68rem] font-bold">Ask</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
