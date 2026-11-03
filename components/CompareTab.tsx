"use client";

import { useState } from "react";
import type { PreservationOption } from "../lib/content-schema";
import { compare, considerations, type Grade } from "../content/app/compare";
import Cite from "./Cite";
import Icon, { optionIcon } from "./icons";

const gradeStyle: Record<Grade, { bg: string; ink: string; word: string }> = {
  good: { bg: "var(--cmp-good-bg)", ink: "var(--cmp-good-ink)", word: "easier" },
  mid: { bg: "var(--cmp-mid-bg)", ink: "var(--cmp-mid-ink)", word: "in between" },
  tough: { bg: "var(--cmp-tough-bg)", ink: "var(--cmp-tough-ink)", word: "bigger lift" },
  unknown: { bg: "var(--line)", ink: "var(--muted)", word: "unknown" },
};

/** Side-by-side comparison with words in every cell, never color alone. */
export default function CompareTab({ options }: { options: PreservationOption[] }) {
  const comparable = options.filter((o) => compare.some((c) => c.optionId === o.id));
  const [picked, setPicked] = useState<string[]>(comparable.slice(0, 2).map((o) => o.id));

  function toggle(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 3 ? [...p.slice(1), id] : [...p, id]));
  }

  const cols = comparable.filter((o) => picked.includes(o.id));

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl">Compare options side by side</h2>
        <p className="text-muted mt-1 text-sm">Pick up to 3. Every cell says it in words, not just color.</p>
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        {comparable.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={picked.includes(o.id)}
            onClick={() => toggle(o.id)}
            className={`flex items-center gap-1.5 rounded-full border-[1.5px] px-3 py-1.5 text-sm font-bold ${
              picked.includes(o.id) ? "border-accent bg-accent-tint text-accent-ink" : "border-line bg-card"
            }`}
          >
            <Icon name={optionIcon[o.id] ?? "clipboard"} size={14} />
            {o.name}
          </button>
        ))}
      </div>

      {cols.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm" style={{ minWidth: cols.length > 2 ? 560 : 0 }}>
            <thead>
              <tr>
                <th className="text-muted p-2 text-left text-xs font-bold tracking-widest uppercase">At a glance</th>
                {cols.map((o) => (
                  <th key={o.id} className="p-2 text-left font-bold">{o.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {considerations.map((c) => (
                <tr key={c.id}>
                  <td className="border-line text-muted border-t p-2 align-top text-xs font-bold">{c.label}</td>
                  {cols.map((o) => {
                    const cell = compare.find((x) => x.optionId === o.id)!.cells[c.id];
                    const st = gradeStyle[cell.grade];
                    return (
                      <td key={o.id} className="border-line border-t p-1.5 align-top">
                        <div className="rounded-lg px-2.5 py-2" style={{ background: st.bg, color: st.ink }}>
                          <span className="block text-[0.68rem] font-bold tracking-wide uppercase">{st.word}</span>
                          <span className="block text-[0.85rem] leading-snug">{cell.note}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {cols.map((o) => {
          const entry = compare.find((x) => x.optionId === o.id)!;
          return (
            <div key={o.id} className="border-line bg-card rounded-xl border p-3">
              <p className="text-sm">
                <strong>{o.name}:</strong> {entry.summary}
              </p>
              <Cite citations={entry.citations} />
            </div>
          );
        })}
      </div>
      <p className="text-muted text-xs">
        Simplified on purpose. Each option's own page has the full steps, costs, and sources.
      </p>
    </section>
  );
}
