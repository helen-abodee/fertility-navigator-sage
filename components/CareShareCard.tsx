import { useEffect, useState } from "react";
import type { Journey } from "../lib/journey";
import {
  careEnabled,
  linkedClinician,
  listClinicians,
  rememberClinician,
  sendCareShare,
  stopCareShare,
  type ClinicianListing,
} from "../lib/care";
import { loadCheckin, loadTopics } from "../lib/checkin";
import { track } from "../lib/analytics";

/**
 * Share with a named care-team member: pick them from a list, agree to what
 * travels, done. No codes on either side. Patients can stop any time.
 */
export default function CareShareCard({ journey, riskLabel }: { journey: Journey; riskLabel?: string }) {
  const [directory, setDirectory] = useState<ClinicianListing[] | null>(null);
  const [linked, setLinked] = useState<ClinicianListing | null>(null);
  const [picking, setPicking] = useState(false);
  const [nickname, setNickname] = useState("");
  const [consent, setConsent] = useState(false);
  const [shareRisk, setShareRisk] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  useEffect(() => {
    setLinked(linkedClinician());
    if (careEnabled) void listClinicians().then(setDirectory);
  }, []);

  if (!careEnabled || directory === null || directory.length === 0) return null;

  async function send(c: ClinicianListing) {
    setState("sending");
    const ok = await sendCareShare({
      clinicianId: c.id,
      nickname,
      journey,
      checkin: loadCheckin(),
      topics: loadTopics(),
      riskLabel: shareRisk ? riskLabel : undefined,
    });
    if (ok) {
      rememberClinician(c);
      setLinked(c);
      setPicking(false);
      track("care_share_created");
    }
    setState(ok ? "sent" : "failed");
    setTimeout(() => setState("idle"), 2500);
  }

  return (
    <div className="mb-3">
      {linked && !picking ? (
        <>
          <p className="text-sm">
            Connected to <b>{linked.display_name}</b>
            {linked.org_label ? <span className="text-muted"> · {linked.org_label}</span> : null}
          </p>
          {riskLabel && (
            <label className="text-muted mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={shareRisk} onChange={(e) => setShareRisk(e.target.checked)} />
              Also include my risk group ({riskLabel})
            </label>
          )}
          <button
            type="button"
            disabled={state === "sending"}
            onClick={() => void send(linked)}
            className="bg-accent text-accent-contrast mt-2 w-full rounded-xl px-4 py-3 font-bold disabled:opacity-60"
          >
            {state === "sending" ? "Sending..." : state === "sent" ? "Sent \u2713" : state === "failed" ? "Couldn't send, tap to retry" : `Send my update to ${linked.display_name.split(" (")[0]}`}
          </button>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-muted text-xs">Checklist, latest check-in word, and sections read. Nothing else.</p>
            <button
              type="button"
              onClick={async () => { await stopCareShare(); setLinked(null); }}
              className="text-muted text-xs underline"
            >
              Stop sharing
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-bold">Share with your care team</p>
          <p className="text-muted mt-1 text-xs">Pick your social worker or care-team member. They see updates on their own dashboard; there are no codes to exchange.</p>
          <div className="mt-2 flex flex-col gap-2">
            {directory.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={picking && linked?.id === c.id}
                onClick={() => { setLinked(c); setPicking(true); }}
                className={`min-h-12 rounded-xl border-[1.5px] px-4 text-left text-sm font-bold ${picking && linked?.id === c.id ? "border-accent bg-accent-tint" : "border-line bg-card"}`}
              >
                {c.display_name}
                {c.org_label ? <span className="text-muted font-normal"> · {c.org_label}</span> : null}
              </button>
            ))}
          </div>
          {picking && linked && (
            <div className="mt-2">
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="The name they know you by"
                className="border-line bg-paper min-h-11 w-full rounded-lg border px-3 text-sm"
              />
              <label className="mt-2 flex items-start gap-2 text-sm">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
                <span>
                  Share my checklist, my latest check-in word, and which sections I've read with {linked.display_name}, updated each time I tap send. Never my answers, age, ZIP, or diagnosis. I can stop any time.
                </span>
              </label>
              {riskLabel && (
                <label className="text-muted mt-2 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={shareRisk} onChange={(e) => setShareRisk(e.target.checked)} />
                  Also include my risk group ({riskLabel})
                </label>
              )}
              <button
                type="button"
                disabled={!consent || state === "sending"}
                onClick={() => void send(linked)}
                className="bg-accent text-accent-contrast mt-2 w-full rounded-xl px-4 py-3 font-bold disabled:opacity-60"
              >
                {state === "sending" ? "Sending..." : state === "failed" ? "Couldn't send, tap to retry" : "Connect and send"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
