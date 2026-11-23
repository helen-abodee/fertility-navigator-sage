"use client";

import { useState } from "react";
import type { PreservationOption } from "../lib/content-schema";
import Icon, { optionIcon } from "./icons";
import Cite from "./Cite";
import ReadMore from "./ReadMore";

/**
 * Full-screen option walkthrough: swipeable step cards (scroll-snap), a
 * personal "what would this look like for me" timeline when the sources
 * support durations, and the cost estimator.
 */
export default function OptionDetail({
  option,
  onClose,
}: {
  option: PreservationOption;
  onClose: () => void;
}) {
  const [showPlan, setShowPlan] = useState(false);

  return (
    <div className="bg-paper fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label={option.name}>
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-6">
        <div className="mb-2 flex items-center justify-between">
          <button type="button" onClick={onClose} className="text-accent-ink -ml-2 rounded-lg px-2 py-2 text-sm font-bold">
            &larr; Back to results
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-accent-tint text-accent-ink animate-breathe flex h-12 w-12 items-center justify-center rounded-full">
            <Icon name={optionIcon[option.id] ?? "clipboard"} size={26} />
          </span>
          <h1 className="text-2xl">{option.name}</h1>
        </div>
        <p className="mt-2">{option.shortDescription}</p>
        <ReadMore links={option.readMore} />
        {option.statusNote && (
          <p className="bg-accent-tint text-accent-ink mt-2 rounded-xl p-3 text-sm">{option.statusNote}</p>
        )}
        <Cite citations={option.citations} />

        {/* The steps, at a glance */}
        <h2 className="mt-6 text-lg">The steps</h2>
        <ol className="mt-2 flex flex-col gap-1.5">
          {option.steps.map((st, i) => (
            <li key={i} className="border-line bg-card rounded-lg border px-3.5 py-2.5">
              <span className="flex items-center gap-2.5">
                <span className="bg-accent-tint text-accent-ink flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                  <Icon name={st.icon ?? "clipboard"} size={15} />
                </span>
                <span className="text-[0.95rem] font-bold">{st.title}</span>
                {st.duration && <span className="text-accent-ink ml-auto text-xs font-bold whitespace-nowrap">{st.duration}</span>}
              </span>
              <span className="text-muted mt-1 block pl-[38px] text-sm">{st.body}</span>
            </li>
          ))}
        </ol>
        <Cite citations={option.stepsCitations} />

        {/* Personal timeline */}
        {option.plan && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowPlan(!showPlan)}
              aria-expanded={showPlan}
              className="border-accent text-accent-ink w-full rounded-xl border-[1.5px] px-4 py-3 font-bold"
            >
              {showPlan ? "Hide my timeline" : "What would this look like for me?"}
            </button>
            {showPlan && (
              <div className="border-line bg-card mt-3 rounded-2xl border p-4">
                <ol className="stagger flex flex-col gap-0">
                  {option.plan.segments.map((seg, i) => (
                    <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
                      {i < option.plan!.segments.length - 1 && (
                        <span className="bg-line absolute top-9 left-[17px] bottom-0 w-0.5" />
                      )}
                      <span className="bg-accent-tint text-accent-ink z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                        <Icon name={seg.icon ?? "calendar"} size={20} />
                      </span>
                      <div>
                        <p className="font-bold">{seg.label}</p>
                        <p className="text-muted text-sm">
                          {seg.duration
                            ? seg.duration
                            : seg.days
                              ? seg.days[0] === seg.days[1]
                                ? `about ${seg.days[0]} ${seg.days[0] === 1 ? "day" : "days"}`
                                : `about ${seg.days[0]} to ${seg.days[1]} days`
                              : "about one visit"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                {option.plan.note && <p className="border-line mt-3 border-t pt-3 text-sm">{option.plan.note}</p>}
                <Cite citations={option.plan.citations} />
              </div>
            )}
          </div>
        )}

        <p className="text-muted mt-6 text-sm">Costs and coverage live on the "Financing" tab.</p>

        {/* Pros and cons, honest and scannable */}
        <div className="mt-6">
          {(option.pros || option.cons) && (
            <details open className="border-line bg-card rounded-2xl border px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-lg font-bold">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--cmp-good-bg)", color: "var(--cmp-good-ink)" }}>
                  <Icon name="sprout" size={16} />
                </span>
                Pros and cons <span className="text-accent-ink ml-auto">+</span>
              </summary>
              <ul className="mt-2 flex flex-col gap-1.5">
                {(option.pros ?? []).map((t, i) => (
                  <li key={`p${i}`} className="flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-sm" style={{ background: "var(--cmp-good-bg)", color: "var(--cmp-good-ink)" }}>
                    <span aria-hidden="true" className="font-bold">+</span> {t}
                  </li>
                ))}
                {(option.cons ?? []).map((t, i) => (
                  <li key={`c${i}`} className="flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-sm" style={{ background: "var(--cmp-tough-bg)", color: "var(--cmp-tough-ink)" }}>
                    <span aria-hidden="true" className="font-bold">&minus;</span> {t}
                  </li>
                ))}
              </ul>
              <Cite citations={option.expectationsCitations} />
            </details>
          )}
          {!(option.pros || option.cons) && (
            <>
              <h2 className="text-lg">Good to know</h2>
              <p className="mt-1 text-[0.95rem]">{option.expectations}</p>
              <Cite citations={option.expectationsCitations} />
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="bg-accent text-accent-contrast mt-8 min-h-12 rounded-xl px-4 py-3 font-bold"
        >
          Back to results
        </button>
      </div>
    </div>
  );
}
