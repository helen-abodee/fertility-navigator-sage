import { useEffect, useState } from "react";
import type { Answers } from "../lib/types";
import { loadJourney } from "../lib/storage";
import { emptyJourney } from "../lib/journey";
import {
  currentUserEmail,
  profilesEnabled,
  requestLoginCode,
  saveProfileData,
} from "../lib/profile";

/**
 * The save-your-road card: email in, link tapped, consent, saved. Sits on
 * the road so saving is the default thing to do, not a buried option.
 */
export default function ProfileNudge({ answers, onSaved }: { answers: Answers; onSaved?: () => void }) {
  const [phase, setPhase] = useState<"hidden" | "email" | "waiting" | "consent" | "saved">("hidden");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (!profilesEnabled) return;
    void currentUserEmail().then((e) => setPhase(e ? "consent" : "email"));
  }, []);

  useEffect(() => {
    if (phase !== "waiting") return;
    const t = setInterval(() => {
      void currentUserEmail().then((e) => {
        if (e) setPhase("consent");
      });
    }, 2500);
    return () => clearInterval(t);
  }, [phase]);

  if (phase === "hidden") return null;
  if (phase === "saved")
    return (
      <p className="text-muted text-center text-xs print:hidden">Road saved to your profile. It updates when you come back.</p>
    );

  return (
    <section className="border-line bg-card rounded-2xl border p-4 print:hidden">
      {phase === "email" && (
        <>
          <p className="text-sm font-bold">Save your road</p>
          <p className="text-muted mt-1 text-xs">Pick up on any device, and let the quiet nudges find you.</p>
          <div className="mt-2 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="border-line bg-paper min-h-11 flex-1 rounded-lg border px-3 text-sm"
            />
            <button
              type="button"
              disabled={busy || !email.includes("@")}
              onClick={async () => {
                setBusy(true);
                const ok = await requestLoginCode(email);
                setBusy(false);
                if (ok) setPhase("waiting");
              }}
              className="bg-accent text-accent-contrast rounded-lg px-4 text-sm font-bold disabled:opacity-60"
            >
              {busy ? "..." : "Save"}
            </button>
          </div>
        </>
      )}
      {phase === "waiting" && (
        <p className="text-sm">
          Open the link we emailed you. This page will notice by itself.
        </p>
      )}
      {phase === "consent" && (
        <>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
            <span>Save my answers to my profile. Delete anytime.</span>
          </label>
          <button
            type="button"
            disabled={!consent || busy}
            onClick={async () => {
              setBusy(true);
              const ok = await saveProfileData(answers, loadJourney() ?? emptyJourney(), true);
              setBusy(false);
              if (ok) { setPhase("saved"); onSaved?.(); }
            }}
            className="bg-accent text-accent-contrast mt-2 min-h-11 w-full rounded-xl font-bold disabled:opacity-60"
          >
            Save my road
          </button>
        </>
      )}
    </section>
  );
}
