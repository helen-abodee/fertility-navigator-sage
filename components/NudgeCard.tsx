import { useEffect, useState } from "react";
import { disableNudges, enableNudges, nudgesOn, pushSupported, type NudgeMode } from "../lib/push";

/**
 * The retention promise, done gently: an occasional quiet note, cadence set
 * by where they are. One toggle, honest copy, off is always one tap away.
 */
export default function NudgeCard({ mode }: { mode: NudgeMode }) {
  const [state, setState] = useState<"unsupported" | "off" | "on" | "denied" | "busy">("unsupported");

  useEffect(() => {
    if (!pushSupported()) return;
    void nudgesOn().then((on) => setState(on ? "on" : "off"));
  }, []);

  if (state === "unsupported") return null;

  const cadence =
    mode === "during"
      ? "about once a week during treatment, just a small thought to sit with"
      : mode === "after"
        ? "every week or two, one next step at a time"
        : mode === "waiting"
          ? "about once a month, so this never falls through the cracks"
          : "every few days while you're deciding";

  return (
    <section className="border-line bg-card rounded-2xl border p-4 print:hidden">
      <p className="text-sm font-bold">Quiet nudges</p>
      <p className="text-muted mt-1 text-sm">
        A notification {cadence}. No account, no tracking, and the off switch is right here.
      </p>
      {state === "denied" && (
        <p className="text-muted mt-2 text-xs">Notifications are blocked in your browser settings for this site.</p>
      )}
      <button
        type="button"
        disabled={state === "busy"}
        onClick={async () => {
          if (state === "on") {
            setState("busy");
            await disableNudges();
            setState("off");
          } else {
            setState("busy");
            const r = await enableNudges(mode);
            setState(r === "on" ? "on" : r === "denied" ? "denied" : "off");
          }
        }}
        className={`mt-2 min-h-11 w-full rounded-xl border-[1.5px] px-4 text-sm font-bold ${
          state === "on" ? "border-accent bg-accent-tint text-accent-ink" : "border-line bg-card"
        }`}
      >
        {state === "busy" ? "..." : state === "on" ? "Nudges are on · turn off" : "Turn on quiet nudges"}
      </button>
    </section>
  );
}
