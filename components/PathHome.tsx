import { useMemo } from "react";
import type { Answers } from "../lib/types";
import type { Journey } from "../lib/journey";
import { buildRoad, type RoadGo } from "../lib/road";
import Icon from "./icons";

/**
 * The winding road home: everyone's journey drawn as its own path, not a
 * checklist. Main places sit on an S-curve; side places hang off it. Tapping
 * a place navigates; nothing is locked and the outcome place says out loud
 * that minds are allowed to change.
 */
export default function PathHome({
  answers,
  journey,
  riskLabel,
  visited,
  onGo,
}: {
  answers: Answers;
  journey: Journey | null;
  riskLabel?: string;
  visited: string[];
  onGo: (go: RoadGo) => void;
}) {
  const { places, now } = useMemo(() => buildRoad(answers, journey, riskLabel), [answers, journey, riskLabel]);
  const main = places.filter((p) => !p.side);
  const side = places.filter((p) => p.side);

  // An S-curve with one bend per main place; side places branch off mid-road.
  const W = 340;
  const rowH = 86;
  const H = main.length * rowH + 30;
  const xAt = (i: number) => (i % 2 === 0 ? 72 : W - 72);
  const yAt = (i: number) => 44 + i * rowH;
  let d = `M ${xAt(0)} ${yAt(0)}`;
  for (let i = 1; i < main.length; i++) {
    const x0 = xAt(i - 1), y0 = yAt(i - 1), x1 = xAt(i), y1 = yAt(i);
    d += ` C ${x0} ${y0 + rowH * 0.62}, ${x1} ${y1 - rowH * 0.62}, ${x1} ${y1}`;
  }
  const doneCount = main.filter((p) => p.state === "done").length;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-myth text-[1.7rem] leading-tight">Your road</h2>
        <p className="text-muted mt-0.5 text-sm">No two run the same, and this one runs both ways.</p>
      </div>

      <div className="relative" style={{ height: H }} role="list" aria-label="Your journey places">
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0" aria-hidden="true" preserveAspectRatio="xMidYMin meet">
          <path d={d} fill="none" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 9" pathLength={1} className="road-draw" />
          {doneCount > 1 && (
            <path
              d={`M ${xAt(0)} ${yAt(0)}` + Array.from({ length: doneCount - 1 }, (_, k) => {
                const i = k + 1;
                return ` C ${xAt(i - 1)} ${yAt(i - 1) + rowH * 0.62}, ${xAt(i)} ${yAt(i) - rowH * 0.62}, ${xAt(i)} ${yAt(i)}`;
              }).join("")}
              fill="none" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 9"
            />
          )}
        </svg>
        {main.map((p, i) => {
          const left = xAt(i) < W / 2;
          const seen = p.go.kind === "tab" && visited.includes(p.go.tab);
          return (
            <button
              key={p.id}
              type="button"
              role="listitem"
              disabled={p.go.kind === "none"}
              onClick={() => onGo(p.go)}
              className="road-place absolute flex w-[46%] items-start gap-2.5 text-left disabled:cursor-default"
              style={{
                animationDelay: `${0.12 + i * 0.09}s`,
                top: yAt(i) - 14,
                left: left ? `calc(${(xAt(i) / W) * 100}% - 13px)` : undefined,
                right: !left ? `calc(${((W - xAt(i)) / W) * 100}% - 13px)` : undefined,
                flexDirection: left ? "row" : "row-reverse",
              }}
            >
              <span
                className={`mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-2 text-[0.7rem] font-bold ${
                  p.state === "done"
                    ? "border-accent bg-accent-tint text-accent-ink"
                    : p.state === "here"
                      ? "border-[var(--warn-ink,#A8653A)] text-[var(--warn-ink,#A8653A)] bg-card shadow-[0_0_0_5px_var(--accent-tint)]"
                      : p.state === "far"
                        ? "border-line text-muted bg-paper"
                        : "border-line bg-card text-muted"
                }`}
              >
                {p.state === "done" ? "✓" : p.state === "here" ? "•" : ""}
              </span>
              <span className={left ? "" : "text-right"}>
                <span className={`block text-[0.92rem] leading-tight font-bold ${p.state === "far" ? "text-muted" : p.state === "here" ? "text-accent-ink" : ""}`}>
                  {p.label}{seen && p.state !== "done" ? " · visited" : ""}
                </span>
                <span className="text-muted block text-xs leading-snug">{p.sub}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        {side.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onGo(p.go)}
            className="border-line bg-card flex-1 rounded-2xl border border-dashed p-3 text-left"
          >
            <span className="flex items-center gap-2">
              <span className="bg-accent-tint text-accent-ink flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <Icon name={p.id === "reflect" ? "compass" : "heart"} size={16} />
              </span>
              <span>
                <span className="block text-sm leading-tight font-bold">{p.label}</span>
                <span className="text-muted block text-[0.7rem]">{p.sub}</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      <section className="border-line bg-card rounded-2xl border p-4">
        <p className="text-accent-ink text-[0.68rem] font-bold tracking-[0.08em] uppercase">Right now</p>
        <h3 className="mt-1 text-lg leading-tight font-bold">{now.heading}</h3>
        <p className="text-muted mt-1 text-sm">{now.body}</p>
        <button
          type="button"
          onClick={() => onGo(now.go)}
          className="bg-accent text-accent-contrast mt-3 min-h-12 w-full rounded-xl px-4 font-bold"
        >
          {now.cta}
        </button>
      </section>
    </div>
  );
}
