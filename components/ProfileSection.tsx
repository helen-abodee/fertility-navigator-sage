"use client";

import { useEffect, useState } from "react";
import type { Answers } from "../lib/types";
import type { Journey } from "../lib/journey";
import { loadJourney } from "../lib/storage";
import { emptyJourney } from "../lib/journey";
import {
  CONSENT_VERSION,
  currentUserEmail,
  deleteAccount,
  profilesEnabled,
  requestLoginCode,
  saveProfileData,
  verifyLoginCode,
} from "../lib/profile";
import Icon from "./icons";

/**
 * Optional profile (pilot): keeps answers and progress across devices, only
 * after an explicit authorization screen. Flag-gated; absent entirely when
 * profiles are off.
 */
export default function ProfileSection({ answers }: { answers: Answers }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"signedout" | "code" | "consent" | "signedin">("signedout");

  // While waiting on the emailed link, poll for the session so signing in
  // in the other tab advances this one with zero extra taps.
  useEffect(() => {
    if (phase !== "code") return;
    const t = setInterval(() => {
      void currentUserEmail().then((e) => {
        if (e) {
          setWho(e);
          setPhase("consent");
        }
      });
    }, 2500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  const [who, setWho] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!profilesEnabled) return;
    void currentUserEmail().then((e) => {
      if (e) {
        setWho(e);
        setPhase("signedin");
      }
    });
  }, []);

  if (!profilesEnabled) return null;

  async function syncUp() {
    setBusy(true);
    const journey = loadJourney<Journey>() ?? emptyJourney();
    const ok = await saveProfileData(answers, journey, true);
    setNotice(ok ? "Saved to your profile ✓" : "Couldn't save, try again");
    setBusy(false);
    setTimeout(() => setNotice(""), 3000);
  }

  return (
    <section className="border-line bg-card rounded-2xl border p-5 print:hidden">
      <div className="flex items-center gap-2">
        <span className="bg-accent-tint text-accent-ink flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <Icon name="heart" size={20} />
        </span>
        <h2 className="text-lg leading-tight">My profile</h2>
        <span className="bg-accent-tint text-accent-ink ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold">Pilot</span>
      </div>

      {phase === "signedout" && (
        <div className="mt-3">
          <p className="text-muted text-sm">
            Optional. A profile keeps your answers and progress across devices. Without one,
            everything still works on this device.
          </p>
          <div className="mt-2 flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              inputMode="email"
              aria-label="Email for profile"
              className="border-line bg-paper min-h-11 flex-1 rounded-lg border px-3 text-sm"
            />
            <button
              type="button"
              disabled={busy || !email.includes("@")}
              onClick={async () => {
                setBusy(true);
                const ok = await requestLoginCode(email);
                setBusy(false);
                if (ok) setPhase("code");
                else setNotice("Couldn't send the email, check the address");
              }}
              className="bg-accent text-accent-contrast rounded-lg px-4 text-sm font-bold disabled:opacity-60"
            >
              {busy ? "..." : "Email me a link"}
            </button>
          </div>
        </div>
      )}

      {phase === "code" && (
        <div className="mt-3">
          <p className="text-sm">We emailed a sign-in link to {email}. Open it on this device, then come back here.</p>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const who = await currentUserEmail();
              setBusy(false);
              if (who) {
                setWho(who);
                setPhase("consent");
              } else setNotice("Not signed in yet. Open the emailed link first, then tap this again.");
            }}
            className="bg-accent text-accent-contrast mt-2 min-h-11 w-full rounded-lg px-4 text-sm font-bold disabled:opacity-60"
          >
            I opened the link
          </button>
          <p className="text-muted mt-3 text-xs">If your email shows a 6-digit code instead, enter it here.</p>
          <div className="mt-2 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              inputMode="numeric"
              aria-label="Login code"
              className="border-line bg-paper min-h-11 flex-1 rounded-lg border px-3 text-sm"
            />
            <button
              type="button"
              disabled={busy || code.trim().length < 6}
              onClick={async () => {
                setBusy(true);
                const ok = await verifyLoginCode(email, code);
                setBusy(false);
                if (ok) {
                  setWho(email);
                  setPhase("consent");
                } else setNotice("That code didn't work");
              }}
              className="bg-accent text-accent-contrast rounded-lg px-4 text-sm font-bold disabled:opacity-60"
            >
              Verify
            </button>
          </div>
        </div>
      )}

      {phase === "consent" && (
        <div className="mt-3">
          <p className="text-sm font-bold">Before anything is stored, your authorization:</p>
          <ul className="mt-1 list-disc pl-5 text-sm">
            <li>Your survey answers and progress checklist will be saved to your profile so you can pick up on any device.</li>
            <li>They are visible to you alone. We never share them with anyone, and nothing is used for advertising.</li>
            <li>Delete your profile any time with one tap below; deletion is immediate and total.</li>
          </ul>
          <p className="text-muted mt-1 text-xs">Authorization version {CONSENT_VERSION}.</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={async () => {
                setPhase("signedin");
                await syncUp();
              }}
              className="bg-accent text-accent-contrast rounded-xl px-4 py-2.5 text-sm font-bold"
            >
              I authorize this
            </button>
            <button
              type="button"
              onClick={async () => {
                const { signOut } = await import("../lib/profile");
                await signOut();
                setPhase("signedout");
              }}
              className="border-line bg-card rounded-xl border px-4 py-2.5 text-sm font-bold"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {phase === "signedin" && (
        <div className="mt-3">
          <p className="text-sm">Signed in as <strong>{who}</strong>.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={syncUp} className="bg-accent text-accent-contrast rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-60">
              Save my answers and progress
            </button>
            <button
              type="button"
              onClick={async () => {
                const { signOut } = await import("../lib/profile");
                await signOut();
                setWho(null);
                setPhase("signedout");
              }}
              className="border-line bg-card rounded-xl border px-4 py-2.5 text-sm font-bold"
            >
              Sign out
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!window.confirm("Delete your profile and everything stored in it? This cannot be undone.")) return;
                const ok = await deleteAccount();
                if (ok) {
                  setWho(null);
                  setPhase("signedout");
                  setNotice("Profile deleted");
                } else setNotice("Couldn't delete, try again");
              }}
              className="text-muted rounded-xl px-2 py-2.5 text-sm underline"
            >
              Delete my profile
            </button>
          </div>
        </div>
      )}

      {notice && <p className="text-accent-ink animate-pop mt-2 text-sm font-bold" role="status">{notice}</p>}
    </section>
  );
}
