"use client";

import { useEffect, useState } from "react";
import type { QuestionDef } from "../lib/questions";
import Icon from "./icons";

interface Props {
  def: QuestionDef;
  stepIndex: number;
  stepCount: number;
  /** survey section 1-3, drives the left rail */
  section?: number;
  /** 0..1 progress through each of the three sections, for the rail fill */
  sectionFill?: number[];
  initialValue?: unknown;
  onAnswer: (value: unknown) => void;
  onSkip?: () => void;
  onBack: (() => void) | null;
}

export default function QuestionScreen({
  def,
  stepIndex,
  stepCount,
  section = 1,
  sectionFill = [0, 0, 0],
  initialValue,
  onAnswer,
  onSkip,
  onBack,
}: Props) {
  const [text, setText] = useState<string>(
    typeof initialValue === "string" || typeof initialValue === "number" ? String(initialValue) : "",
  );
  const [multi, setMulti] = useState<string[]>(Array.isArray(initialValue) ? (initialValue as string[]) : []);

  useEffect(() => {
    setText(typeof initialValue === "string" || typeof initialValue === "number" ? String(initialValue) : "");
    setMulti(Array.isArray(initialValue) ? (initialValue as string[]) : []);
  }, [def.id, initialValue]);

  function toggleMulti(value: string) {
    setMulti((prev) => {
      // "not sure" clears specific picks, and picking something clears "not sure"
      if (value === "not_sure") return prev.includes("not_sure") ? [] : ["not_sure"];
      const without = prev.filter((v) => v !== value && v !== "not_sure");
      return prev.includes(value) ? without : [...without, value];
    });
  }

  function submitText() {
    if (def.kind === "number") {
      const n = parseInt(text, 10);
      onAnswer(Number.isFinite(n) ? n : undefined);
    } else {
      onAnswer(text.trim() === "" ? null : text.trim());
    }
  }

  const SECTIONS = [
    { n: 1, label: "Facts" },
    { n: 2, label: "You" },
    { n: 3, label: "Plans" },
  ];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md gap-4 px-5 py-8">
      {/* Left progress rail: where you are, and how much is left. */}
      <aside
        className="flex w-11 shrink-0 flex-col items-center pt-12"
        aria-label={`Question ${stepIndex + 1} of ${stepCount}, section ${section} of 3`}
      >
        {SECTIONS.map((sec, i) => (
          <div key={sec.n} className="flex flex-col items-center">
            {i > 0 && (
              <span className="bg-line relative my-1 h-9 w-1 overflow-hidden rounded-full">
                <span
                  className="bg-accent absolute top-0 left-0 w-full rounded-full transition-[height] duration-500 ease-out"
                  style={{ height: `${Math.round((sectionFill[i - 1] ?? 0) * 100)}%` }}
                />
              </span>
            )}
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] text-xs font-bold ${
                section > sec.n
                  ? "bg-accent text-accent-contrast border-accent"
                  : section === sec.n
                    ? "border-accent text-accent-ink bg-accent-tint"
                    : "border-line text-muted bg-card"
              }`}
            >
              {section > sec.n ? "\u2713" : sec.n}
            </span>
            <span className={`mt-1 text-[0.6rem] font-bold ${section === sec.n ? "text-accent-ink" : "text-muted"}`}>
              {sec.label}
            </span>
          </div>
        ))}
        <span className="num text-muted mt-4 text-xs whitespace-nowrap">
          {stepIndex + 1}/{stepCount}
        </span>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
      <div className="mb-4 flex items-center">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-accent-ink -ml-2 rounded-lg px-2 py-2 text-sm font-bold"
          >
            &larr; Back
          </button>
        ) : (
          <span className="py-2 text-sm">&nbsp;</span>
        )}
      </div>

      <h1 className="text-2xl">
        {def.heading}
        {def.optional && <span className="text-muted ml-2 align-middle text-sm font-normal">optional</span>}
      </h1>

      <div className="mt-6 flex flex-col gap-3">
        {def.kind === "single" &&
          def.options?.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onAnswer(opt.value)}
              className={`flex min-h-14 items-center gap-3 rounded-xl border-[1.5px] px-4 py-4 text-left text-[1.02rem] font-bold ${
                initialValue === opt.value
                  ? "border-accent bg-accent-tint"
                  : "border-line bg-card"
              } ${opt.notSure ? "border-dashed font-normal" : ""}`}
            >
              {opt.icon && (
                <span className="bg-accent-tint text-accent-ink flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                  <Icon name={opt.icon} size={20} />
                </span>
              )}
              <span>{opt.label}</span>
            </button>
          ))}

        {def.kind === "multi" && (
          <>
            {def.options?.map((opt) => {
              const on = multi.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleMulti(opt.value)}
                  className={`flex min-h-14 items-center gap-3 rounded-xl border-[1.5px] px-4 py-4 text-left text-[1.02rem] font-bold ${
                    on ? "border-accent bg-accent-tint" : "border-line bg-card"
                  } ${opt.notSure ? "border-dashed font-normal" : ""}`}
                >
                  {opt.icon && (
                    <span className="bg-accent-tint text-accent-ink flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                      <Icon name={opt.icon} size={20} />
                    </span>
                  )}
                  <span>
                    {on ? "✓ " : ""}
                    {opt.label}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => onAnswer(multi)}
              className="bg-accent text-accent-contrast mt-2 min-h-14 rounded-xl px-4 py-4 text-lg font-bold"
            >
              Continue
            </button>
          </>
        )}

        {(def.kind === "number" || def.kind === "text") && (
          <>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitText()}
              inputMode={def.inputMode}
              placeholder={def.placeholder}
              aria-label={def.heading}
              className="border-line bg-card min-h-14 rounded-xl border-[1.5px] px-4 py-4 text-[1.1rem]"
            />
            <button
              type="button"
              onClick={submitText}
              className="bg-accent text-accent-contrast min-h-14 rounded-xl px-4 py-4 text-lg font-bold"
            >
              Continue
            </button>
          </>
        )}

        {def.skippable && onSkip && (
          <button type="button" onClick={onSkip} className="text-muted mt-1 py-2 text-sm underline">
            Skip this question
          </button>
        )}
      </div>

    </div>
    </div>
  );
}
