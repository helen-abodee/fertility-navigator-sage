"use client";

import { useEffect, useRef, useState } from "react";
import type { PreservationOption } from "../lib/content-schema";
import type { InsuranceType, TreatmentStage } from "../lib/types";
import Icon, { optionIcon } from "./icons";
import Cite from "./Cite";
import CostEstimator from "./CostEstimator";

/**
 * Full-screen option walkthrough: swipeable step cards (scroll-snap), a
 * personal "what would this look like for me" timeline when the sources
 * support durations, and the cost estimator.
 */
export default function OptionDetail({
  option,
  insurance,
  stage,
  onClose,
}: {
  option: PreservationOption;
  insurance?: InsuranceType;
  stage?: TreatmentStage;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [showPlan, setShowPlan] = useState(false);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setStep(Math.min(option.steps.length - 1, Math.max(0, i)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [option.steps.length]);

  function goTo(i: number) {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="bg-paper fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label={option.name}>
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-6">
        <div className="mb-2 flex items-center justify-between">
          <button type="button" onClick={onClose} className="text-accent-ink -ml-2 rounded-lg px-2 py-2 text-sm font-bold">
            &larr; Back to results
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-accent-tint text-accent-ink flex h-12 w-12 items-center justify-center rounded-full">
            <Icon name={optionIcon[option.id] ?? "clipboard"} size={26} />
          </span>
          <h1 className="text-2xl">{option.name}</h1>
        </div>
        <p className="mt-2">{option.shortDescription}</p>
        {option.statusNote && (
          <p className="bg-accent-tint text-accent-ink mt-2 rounded-xl p-3 text-sm">{option.statusNote}</p>
        )}
        <Cite citations={option.citations} />

        {/* Swipeable steps */}
        <h2 className="mt-6 text-lg">The steps, one swipe at a time</h2>
        <div
          ref={track}
          className="mt-2 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {option.steps.map((s, i) => (
            <div
              key={i}
              className="border-line bg-card flex w-full shrink-0 snap-center flex-col items-center rounded-2xl border p-6 text-center"
            >
              <span className="bg-accent-tint text-accent-ink flex h-14 w-14 items-center justify-center rounded-full">
                <Icon name={s.icon ?? "clipboard"} size={30} />
              </span>
              <p className="text-muted mt-3 text-xs font-bold tracking-widest uppercase">
                Step {i + 1} of {option.steps.length}
              </p>
              <p className="mt-1 font-bold">{s.title}</p>
              {s.duration && <p className="text-accent-ink text-sm font-bold">{s.duration}</p>}
              <p className="mt-2 text-[0.95rem]">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            disabled={step === 0}
            aria-label="Previous step"
            className="text-accent-ink disabled:text-line px-2 text-xl font-bold"
          >
            &larr;
          </button>
          <div className="flex gap-1.5">
            {option.steps.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to step ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full ${i === step ? "bg-accent" : "bg-line"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(step + 1)}
            disabled={step === option.steps.length - 1}
            aria-label="Next step"
            className="text-accent-ink disabled:text-line px-2 text-xl font-bold"
          >
            &rarr;
          </button>
        </div>
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
                <ol className="flex flex-col gap-0">
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
                          {seg.days
                            ? seg.days[0] === seg.days[1]
                              ? `about ${seg.days[0]} ${seg.days[0] === 1 ? "day" : "days"}`
                              : `about ${seg.days[0]} to ${seg.days[1]} days`
                            : "one visit"}
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

        {/* Cost */}
        <div className="mt-6">
          <CostEstimator option={option} insurance={insurance} stage={stage} />
        </div>

        {/* Honest expectations */}
        <div className="mt-6">
          <h2 className="text-lg">Good to know</h2>
          <p className="mt-1 text-[0.95rem]">{option.expectations}</p>
          <Cite citations={option.expectationsCitations} />
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
