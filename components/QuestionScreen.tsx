"use client";

import { useEffect, useState } from "react";
import type { QuestionDef } from "../lib/questions";
import Icon from "./icons";

interface Props {
  def: QuestionDef;
  stepIndex: number;
  stepCount: number;
  /** survey section 1-3, drives the stepper */
  section?: number;
  /** 0..1 progress through each of the three sections, for the stepper fill */
  sectionFill?: number[];
  /** tap a reached section's name to jump back to its first question */
  onJumpSection?: (section: number) => void;
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
  onJumpSection,
  initialValue,
  onAnswer,
  onSkip,
  onBack,
}: Props) {
  const [text, setText] = useState<string>(
    typeof initialValue === "string" || typeof initialValue === "number" ? String(initialValue) : "",
  );
  const [multi, setMulti] = useState<string[]>(Array.isArray(initialValue) ? (initialValue as string[]) : []);
  const [query, setQuery] = useState("");
  const LONG = (def.options?.length ?? 0) > 5;
  const shownOptions = LONG && query.trim()
    ? (def.options ?? []).filter(
        (o) => o.label.toLowerCase().includes(query.trim().toLowerCase()) || o.notSure,
      )
    : def.options ?? [];

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
    { n: 1, label: "Risk assessment" },
    { n: 2, label: "Children" },
    { n: 3, label: "Insurance" },
  ];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-8">
      <div className="mb-3 flex items-center justify-between">
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
        <span className="num text-muted text-xs" aria-label={`Question ${stepIndex + 1} of ${stepCount}`}>
          {stepIndex + 1} of {stepCount}
        </span>
      </div>

      {/* Full-width section stepper: names you can read, bars that fill as you
          answer, and reached sections are tappable to go back. */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        {SECTIONS.map((sec) => {
          const reached = sec.n <= section;
          const fill = sec.n < section ? 1 : sec.n === section ? (sectionFill[sec.n - 1] ?? 0) : 0;
          return (
            <button
              key={sec.n}
              type="button"
              disabled={!reached || !onJumpSection}
              onClick={() => onJumpSection?.(sec.n)}
              aria-label={`Section ${sec.n}: ${sec.label}${reached ? "" : ", not reached yet"}`}
              className="text-left disabled:cursor-default"
            >
              <span
                className={`block truncate text-[0.7rem] font-bold tracking-wide ${
                  sec.n === section ? "text-accent-ink" : reached ? "text-ink underline decoration-dotted" : "text-muted"
                }`}
              >
                {sec.n < section ? "\u2713 " : ""}{sec.label}
              </span>
              <span className="bg-line relative mt-1 block h-1.5 overflow-hidden rounded-full">
                <span
                  className="bg-accent absolute top-0 left-0 h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: `${Math.round(fill * 100)}%` }}
                />
              </span>
            </button>
          );
        })}
      </div>

      <h1 className="text-2xl">
        {def.heading}
        {def.optional && <span className="text-muted ml-2 align-middle text-sm font-normal">optional</span>}
      </h1>

      <div className="mt-6 flex flex-col gap-3">
        {LONG && (
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to find it faster (names or abbreviations)"
            aria-label="Filter the list"
            className="border-line bg-card min-h-12 w-full rounded-xl border-[1.5px] px-4 text-sm"
          />
        )}
        {def.kind === "single" &&
          shownOptions.map((opt) => (
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
            {shownOptions.map((opt) => {
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
  );
}
