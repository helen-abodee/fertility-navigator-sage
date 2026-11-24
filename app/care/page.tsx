"use client";

import { useEffect, useState } from "react";
import { journeyStages } from "../../lib/journey";
import {
  currentUserEmail,
  requestLoginCode,
  supabase,
  verifyLoginCode,
  signOut,
} from "../../lib/profile";

/**
 * The care-team dashboard: clinicians sign in with their email (one-time
 * code), appear in the patient-side picker, and see only the patients who
 * chose to share with them. No patient codes anywhere.
 */

interface ShareRow {
  id: string;
  nickname: string;
  journey: { done?: string[]; outcome?: string | null } | null;
  checkin: "steady" | "wobbly" | "rough" | null;
  checkin_date: string | null;
  topics: string[];
  risk_label: string | null;
  updated_at: string;
}

const OUTCOME_LABEL: Record<string, string> = {
  completed: "Preserved",
  decided_not_to: "Not preserving, on purpose",
  still_deciding: "Still deciding",
};

const CHECKIN_STYLE: Record<string, string> = {
  steady: "bg-accent-tint text-accent-ink",
  wobbly: "bg-[var(--warn-bg)] text-[var(--warn-ink)]",
  rough: "bg-[var(--cmp-tough-bg)] text-[var(--cmp-tough-ink)]",
};

export default function CarePage() {
  const [phase, setPhase] = useState<"loading" | "signedout" | "code" | "profile" | "dash">("loading");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [rows, setRows] = useState<ShareRow[]>([]);

  async function loadDash() {
    const sb = supabase();
    if (!sb) return;
    const { data: u } = await sb.auth.getUser();
    if (!u.user) {
      setPhase("signedout");
      return;
    }
    const { data: me } = await sb.from("clinicians").select("display_name").eq("user_id", u.user.id).maybeSingle();
    if (!me) {
      setPhase("profile");
      return;
    }
    const { data } = await sb
      .from("care_shares")
      .select("id,nickname,journey,checkin,checkin_date,topics,risk_label,updated_at")
      .order("updated_at", { ascending: true });
    const list = (data ?? []) as ShareRow[];
    list.sort((a, b) => (a.checkin === "rough" ? -1 : 0) - (b.checkin === "rough" ? -1 : 0));
    setRows(list);
    setPhase("dash");
  }

  useEffect(() => {
    void loadDash();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Waiting on the emailed link: poll so the dashboard appears by itself.
  useEffect(() => {
    if (phase !== "code") return;
    const t = setInterval(() => void loadDash(), 2500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-5 px-6 py-10">
      <h1 className="font-myth text-3xl">Care team</h1>
      <p className="text-muted -mt-3 text-sm">
        For social workers and clinicians. Patients choose to share; you see only yours.
      </p>

      {phase === "loading" && <p className="text-muted text-sm">One moment&hellip;</p>}

      {phase === "signedout" && (
        <section className="border-line bg-card max-w-md rounded-2xl border p-5">
          <p className="font-bold">Sign in with your work email</p>
          <div className="mt-3 flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@hospital.org"
              type="email"
              className="border-line bg-paper min-h-12 flex-1 rounded-xl border px-3 text-sm"
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
              className="bg-accent text-accent-contrast rounded-xl px-4 font-bold disabled:opacity-60"
            >
              {busy ? "..." : "Email me"}
            </button>
          </div>
          {notice && <p className="text-muted mt-2 text-sm">{notice}</p>}
        </section>
      )}

      {phase === "code" && (
        <section className="border-line bg-card max-w-md rounded-2xl border p-5">
          <p className="text-sm">We emailed a sign-in link to {email}. Open it on this device, then tap below. If it shows a 6-digit code, enter it instead.</p>
          <button
            type="button"
            onClick={() => void loadDash()}
            className="bg-accent text-accent-contrast mt-3 min-h-11 w-full rounded-xl font-bold"
          >
            I opened the link
          </button>
          <div className="mt-3 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              inputMode="numeric"
              className="border-line bg-paper min-h-11 flex-1 rounded-lg border px-3 text-sm"
            />
            <button
              type="button"
              disabled={busy || code.trim().length < 6}
              onClick={async () => {
                setBusy(true);
                const ok = await verifyLoginCode(email, code);
                setBusy(false);
                if (ok) void loadDash();
                else setNotice("That code didn't work");
              }}
              className="border-line bg-card rounded-lg border px-4 text-sm font-bold"
            >
              Verify
            </button>
          </div>
          {notice && <p className="text-muted mt-2 text-sm">{notice}</p>}
        </section>
      )}

      {phase === "profile" && (
        <section className="border-line bg-card max-w-md rounded-2xl border p-5">
          <p className="font-bold">One-time setup</p>
          <p className="text-muted mt-1 text-sm">This is the name patients will pick from inside the app.</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (e.g., Estella B., LCSW)"
            className="border-line bg-paper mt-3 min-h-12 w-full rounded-xl border px-3 text-sm"
          />
          <input
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="Team or clinic label (optional)"
            className="border-line bg-paper mt-2 min-h-12 w-full rounded-xl border px-3 text-sm"
          />
          <button
            type="button"
            disabled={busy || name.trim().length < 2}
            onClick={async () => {
              const sb = supabase();
              if (!sb) return;
              setBusy(true);
              const { data: u } = await sb.auth.getUser();
              if (u.user) {
                await sb.from("clinicians").insert({ user_id: u.user.id, display_name: name.trim(), org_label: org.trim() });
              }
              setBusy(false);
              void loadDash();
            }}
            className="bg-accent text-accent-contrast mt-3 min-h-12 w-full rounded-xl font-bold disabled:opacity-60"
          >
            Appear in the patient picker
          </button>
        </section>
      )}

      {phase === "dash" && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">{rows.length} patient{rows.length === 1 ? "" : "s"} sharing with you</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => void loadDash()} className="text-accent-ink text-sm font-bold underline">Refresh</button>
              <button type="button" onClick={async () => { await signOut(); setPhase("signedout"); }} className="text-muted text-sm underline">Sign out</button>
            </div>
          </div>
          {rows.length === 0 && (
            <section className="border-line bg-card rounded-2xl border p-5">
              <p className="text-sm">No one yet. Patients connect from My progress, by picking your name and agreeing to share. What arrives: their checklist, their latest check-in word, and which sections they have read. Never their answers, age, or diagnosis.</p>
            </section>
          )}
          {rows.map((r) => (
            <section key={r.id} className="border-line bg-card rounded-2xl border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-bold">{r.nickname || "Unnamed patient"}</p>
                {r.checkin && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${CHECKIN_STYLE[r.checkin]}`}>
                    {r.checkin}{r.checkin_date ? ` · ${r.checkin_date}` : ""}
                  </span>
                )}
                {r.journey?.outcome && (
                  <span className="bg-accent-tint text-accent-ink rounded-full px-2.5 py-0.5 text-xs font-bold">
                    {OUTCOME_LABEL[r.journey.outcome] ?? r.journey.outcome}
                  </span>
                )}
                {r.journey?.done?.includes("contacted_clinic") &&
                  !r.journey?.done?.includes("clinic_replied") &&
                  Date.now() - new Date(r.updated_at).getTime() > 5 * 864e5 && (
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: "var(--cmp-tough-bg)", color: "var(--cmp-tough-ink)" }}>
                      waiting on clinic {Math.floor((Date.now() - new Date(r.updated_at).getTime()) / 864e5)}d
                    </span>
                  )}
                {r.risk_label && (
                  <span className="border-line rounded-full border px-2.5 py-0.5 text-xs font-bold">{r.risk_label}</span>
                )}
                <span className="num text-muted ml-auto text-xs">{r.updated_at.slice(0, 10)}</span>
              </div>
              <p className="text-muted mt-2 text-sm">
                {journeyStages
                  .filter((s) => r.journey?.done?.includes(s.id))
                  .map((s) => s.label)
                  .join(" · ") || "No steps checked yet"}
              </p>
              {r.topics.length > 0 && (
                <p className="text-muted mt-1 text-xs">Read: {r.topics.join(", ")}</p>
              )}
            </section>
          ))}
          <p className="text-muted text-xs">
            Pilot tool. Patients share voluntarily and can stop any time; payloads carry no diagnosis, answers, age, or ZIP.
          </p>
        </>
      )}
    </main>
  );
}
