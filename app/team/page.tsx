"use client";

import { useEffect, useState } from "react";
import type { TeamEntry } from "../../lib/share";
import { decodeShareCode, prioritize } from "../../lib/share";
import { fetchInbox, fetchJourney, isLinkCode, syncEnabled } from "../../lib/sync";

const INBOX_KEY = "navigator.team-own-inbox.v1";
import { journeyStages } from "../../lib/journey";
import Icon from "../../components/icons";

/**
 * The care-team board. Patients text or email their progress code (made on
 * their own device, containing only checklist stages); the clinician pastes
 * codes here. Everything stays in this browser: there is no server, no
 * account, and nothing a patient didn't choose to send.
 */

const BOARD_KEY = "navigator.team-board.v1";

function loadBoard(): TeamEntry[] {
  try {
    const raw = localStorage.getItem(BOARD_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBoard(entries: TeamEntry[]) {
  try {
    localStorage.setItem(BOARD_KEY, JSON.stringify(entries));
  } catch {
    /* board stays in memory */
  }
}

export default function TeamPage() {
  const [entries, setEntries] = useState<TeamEntry[]>([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [ownInbox, setOwnInbox] = useState("");
  const [inboxInput, setInboxInput] = useState("");

  useEffect(() => {
    setEntries(loadBoard());
    try {
      const ib = localStorage.getItem(INBOX_KEY);
      if (ib) setOwnInbox(ib);
    } catch {
      /* fine */
    }
  }, []);

  async function pullInbox(inbox: string) {
    const live = await fetchInbox(inbox);
    if (live.length === 0) return 0;
    setEntries((prev) => {
      const byCode = new Map(prev.map((e) => [e.addedAt, e]));
      for (const row of live) {
        const existing = byCode.get(row.code);
        byCode.set(row.code, {
          label: existing?.label || row.nickname || row.code,
          journey: row.journey,
          addedAt: row.code,
        });
      }
      const next = Array.from(byCode.values());
      saveBoard(next);
      return next;
    });
    return live.length;
  }

  async function connectInbox() {
    const code = inboxInput.trim().toUpperCase();
    if (!isLinkCode(code)) {
      setError("Team codes look like ABC-123.");
      return;
    }
    setError("");
    setOwnInbox(code);
    try {
      localStorage.setItem(INBOX_KEY, code);
    } catch {
      /* fine */
    }
    await pullInbox(code);
  }

  async function addCode() {
    // A short link code (ABC-123) pulls live from the sync service; a long
    // FPN1 code decodes locally. Same board either way.
    if (syncEnabled && isLinkCode(code)) {
      const live = await fetchJourney(code);
      if (!live) {
        setError("No patient found under that code yet. Ask them to tap Send first.");
        return;
      }
      setError("");
      const next = [...entries, { label: live.nickname || code.toUpperCase(), journey: live.journey, addedAt: code.toUpperCase() }];
      setEntries(next);
      saveBoard(next);
      setCode("");
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      return;
    }
    const decoded = decodeShareCode(code);
    if (!decoded) {
      setError(syncEnabled ? "Enter a patient's link code (ABC-123) or a progress code (FPN1...)." : "That doesn't look like a progress code. They start with FPN1.");
      return;
    }
    setError("");
    const label = decoded.nickname || `Patient ${entries.length + 1}`;
    const next = [...entries, { label, journey: decoded.journey, addedAt: new Date().toISOString().slice(0, 10) }];
    setEntries(next);
    saveBoard(next);
    setCode("");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function rename(i: number, label: string) {
    const next = entries.map((e, j) => (j === i ? { ...e, label } : e));
    setEntries(next);
    saveBoard(next);
  }

  function remove(i: number) {
    const next = entries.filter((_, j) => j !== i);
    setEntries(next);
    saveBoard(next);
  }

  async function refreshAll() {
    if (!syncEnabled) return;
    if (ownInbox) await pullInbox(ownInbox);
    const next = await Promise.all(
      entries.map(async (e) => {
        if (!isLinkCode(e.addedAt)) return e;
        const live = await fetchJourney(e.addedAt);
        return live ? { ...e, journey: live.journey } : e;
      }),
    );
    setEntries((prev) => {
      const byKey = new Map(prev.map((e) => [e.addedAt + e.label, e]));
      for (const e of next) byKey.set(e.addedAt + e.label, e);
      const merged = Array.from(byKey.values());
      saveBoard(merged);
      return merged;
    });
  }

  const ordered = prioritize(entries);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-3xl">Care team board</h1>
      <p className="text-muted mt-2 max-w-[62ch]">
        Patients share a progress code from their "Where I am with this" checklist. Paste codes
        here to see where each person is. Codes contain only checklist stages, a date, and a
        nickname the patient chose: no answers, no diagnosis, nothing they didn't send. This board
        lives only in your browser.
      </p>

      {syncEnabled && (
        <div className="border-accent/40 bg-accent-tint/40 mt-6 rounded-xl border-[1.5px] p-4">
          <p className="text-sm font-bold">Your team code</p>
          <p className="text-muted text-xs">
            Enter it once. Every patient who picked you in the app shows up here automatically on
            each refresh; no per-patient codes needed.
          </p>
          {ownInbox ? (
            <p className="mt-2 text-sm">
              Connected as <strong>{ownInbox}</strong>{" "}
              <button type="button" className="text-muted ml-2 text-xs underline" onClick={() => { setOwnInbox(""); try { localStorage.removeItem(INBOX_KEY); } catch {} }}>
                change
              </button>
            </p>
          ) : (
            <div className="mt-2 flex gap-2">
              <input
                value={inboxInput}
                onChange={(e) => setInboxInput(e.target.value)}
                placeholder="ABC-123"
                aria-label="Team code"
                className="border-line bg-card min-h-10 flex-1 rounded-lg border px-3 text-sm"
                onKeyDown={(e) => e.key === "Enter" && connectInbox()}
              />
              <button type="button" onClick={connectInbox} className="border-accent text-accent-ink rounded-lg border-[1.5px] px-3 text-sm font-bold">
                Connect
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste a code (FPN1....)"
          aria-label="Progress code"
          className="border-line bg-card min-h-12 flex-1 rounded-xl border-[1.5px] px-4"
          onKeyDown={(e) => e.key === "Enter" && addCode()}
        />
        <button
          type="button"
          onClick={addCode}
          className="bg-accent text-accent-contrast rounded-xl px-5 font-bold"
        >
          Add
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-bold" role="alert">{error}</p>}
      {entries.length === 0 && (
        <button
          type="button"
          onClick={() => {
            const demo: TeamEntry[] = [
              { label: "Demo: J.R.", journey: { done: ["learned_risk"], outcome: null, updated: "2026-10-18" }, addedAt: "demo" },
              { label: "Demo: A.M.", journey: { done: ["learned_risk", "talked_care_team", "checked_coverage", "contacted_clinic"], outcome: null, updated: "2026-11-01" }, addedAt: "demo" },
              { label: "Demo: K.T.", journey: { done: ["learned_risk", "talked_care_team"], outcome: "still_deciding", updated: "2026-10-26" }, addedAt: "demo" },
              { label: "Demo: S.B.", journey: { done: ["learned_risk", "talked_care_team", "checked_coverage", "contacted_clinic", "had_consult", "started_preservation"], outcome: "completed", updated: "2026-10-29" }, addedAt: "demo" },
              { label: "Demo: L.P.", journey: { done: ["learned_risk", "talked_care_team"], outcome: "decided_not_to", updated: "2026-10-22" }, addedAt: "demo" },
            ];
            setEntries(demo);
            saveBoard(demo);
          }}
          className="border-accent text-accent-ink mt-3 rounded-xl border-[1.5px] px-4 py-2.5 text-sm font-bold"
        >
          Load 5 sample patients (demo)
        </button>
      )}
      {added && <p className="text-accent-ink animate-pop mt-2 text-sm font-bold" role="status">Added ✓</p>}
      {syncEnabled && entries.length > 0 && (
        <button type="button" onClick={refreshAll} className="border-accent text-accent-ink mt-3 rounded-xl border-[1.5px] px-4 py-2 text-sm font-bold">
          Refresh all connected patients
        </button>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {ordered.length === 0 && (
          <p className="text-muted text-sm">No codes yet. Ask patients to tap "Share my progress" in the app.</p>
        )}
        {ordered.map((e) => {
          const i = entries.indexOf(e);
          const doneCount = e.journey.done.length;
          const finished = e.journey.outcome !== null;
          return (
            <article key={`${e.label}-${i}`} className="border-line bg-card rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <input
                  value={e.label}
                  onChange={(ev) => rename(i, ev.target.value)}
                  aria-label="Patient label"
                  className="min-w-0 flex-1 rounded-lg bg-transparent text-lg font-bold"
                />
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-bold whitespace-nowrap ${
                    finished ? "bg-line" : "bg-accent-tint text-accent-ink"
                  }`}
                >
                  {e.journey.outcome === "completed"
                    ? "Completed preservation"
                    : e.journey.outcome === "decided_not_to"
                      ? "Decided not to"
                      : e.journey.outcome === "still_deciding"
                        ? "Still deciding, on purpose"
                        : doneCount === 0
                          ? "Just started"
                          : "In motion"}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5" aria-label={`${doneCount} of ${journeyStages.length} steps`}>
                {journeyStages.map((s) => {
                  const on = e.journey.done.includes(s.id);
                  return (
                    <span
                      key={s.id}
                      title={s.label}
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        on ? "bg-accent text-accent-contrast" : "bg-line text-muted"
                      }`}
                    >
                      <Icon name={on ? "sprout" : "door"} size={14} />
                    </span>
                  );
                })}
                <span className="text-muted ml-2 text-xs">
                  {doneCount}/{journeyStages.length} · as of {e.journey.updated}
                </span>
              </div>
              {"riskLabel" in e && (e as TeamEntry & { riskLabel?: string }).riskLabel && (
                <p className="text-muted mt-1 text-xs">Shared risk group: {(e as TeamEntry & { riskLabel?: string }).riskLabel}</p>
              )}
              <div className="mt-2 text-sm">
                {e.journey.done.length > 0 ? (
                  <span>
                    Latest: {journeyStages.filter((s) => e.journey.done.includes(s.id)).map((s) => s.label).slice(-1)[0]}
                  </span>
                ) : (
                  <span className="text-muted">No steps checked yet; a good first call.</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-muted mt-2 text-xs underline"
              >
                Remove
              </button>
            </article>
          );
        })}
      </div>

      <p className="text-muted mt-10 text-xs">
        Follow-up order: people still deciding float to the top, least recent first. Finished
        journeys, either outcome, settle to the bottom.
      </p>
    </main>
  );
}
