"use client";

import type { Clinic, SourcedField } from "../lib/types";
import Cite from "./Cite";
import Icon from "./icons";

function val<T>(f?: SourcedField<T>): string {
  if (!f || f.value === "not_published") return "not published";
  if (Array.isArray(f.value)) return (f.value as unknown as string[]).join("; ");
  return String(f.value);
}

function isFreeConsult(clinic: Clinic): boolean {
  return /free/i.test(val(clinic.consultCost));
}

/** "Label: $1,234 per vial (vial-pricing page)" -> { label, num } for clean rows. */
function parsePrice(line: string): { label: string; num: string } {
  const noSuffix = line.replace(/\s*\([^)]*page[^)]*\)\s*$/i, "");
  const m = noSuffix.match(/^(.*?):\s*(\$[\d,.]+.*)$/);
  if (m) return { label: m[1], num: m[2] };
  return { label: noSuffix, num: "" };
}

/** Long lists compress to "A, B, C +4 more". */
function shortList(f?: SourcedField<unknown>): string {
  if (!f || f.value === "not_published") return "Not published";
  if (Array.isArray(f.value)) {
    const arr = f.value as unknown as string[];
    return arr.slice(0, 3).join(", ") + (arr.length > 3 ? ` +${arr.length - 3} more` : "");
  }
  return String(f.value);
}

/** One clinic, one screen: the digestible version of a directory row. */
export default function ClinicDetail({ clinic, miles, onClose }: { clinic: Clinic; miles: number | null; onClose: () => void }) {
  const fields: { label: string; f?: SourcedField<unknown> }[] = [
    { label: "Services", f: clinic.services },
    { label: "Published prices", f: clinic.publishedPrices },
    { label: "Consult cost", f: clinic.consultCost },
    { label: "Insurance accepted", f: clinic.insuranceAccepted },
    { label: "Financing", f: clinic.financing },
  ];
  return (
    <div className="bg-paper fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label={clinic.name}>
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-6">
        <button type="button" onClick={onClose} className="text-accent-ink -ml-2 self-start rounded-lg px-2 py-2 text-sm font-bold">
          &larr; Back to clinics
        </button>

        <div className="mt-2 flex items-center gap-3">
          <span className="bg-accent-tint text-accent-ink flex h-12 w-12 items-center justify-center rounded-full">
            <Icon name="door" size={24} />
          </span>
          <div>
            <h1 className="text-2xl">{clinic.name}</h1>
            {miles !== null && <p className="text-muted text-sm">{Math.round(miles)} miles from your ZIP</p>}
          </div>
        </div>

        {clinic.recommendedBy && (
          <div className="border-line bg-card mt-4 rounded-xl border p-3">
            <p className="text-muted text-sm italic">"{clinic.recommendedBy.value}"</p>
            <Cite citations={clinic.recommendedBy.citations} />
          </div>
        )}

        {isFreeConsult(clinic) && (
          <div className="mt-4 rounded-t-xl px-4 py-1.5 text-xs font-bold tracking-wide text-white uppercase" style={{ background: "var(--cmp-good-ink)" }}>
            Free consultation
          </div>
        )}
        <div className={`border-line bg-card border p-4 ${isFreeConsult(clinic) ? "rounded-b-xl" : "mt-4 rounded-xl"}`}>
          <div className="flex flex-col">
            <div className="border-line flex justify-between gap-3 border-b py-2 text-sm">
              <span className="text-muted shrink-0">Consult</span>
              <span className={`text-right font-bold ${isFreeConsult(clinic) ? "" : val(clinic.consultCost) === "not published" ? "text-muted font-normal" : ""}`} style={isFreeConsult(clinic) ? { color: "var(--cmp-good-ink)" } : undefined}>
                {isFreeConsult(clinic) ? "Free" : val(clinic.consultCost) === "not published" ? "Not published" : val(clinic.consultCost)}
              </span>
            </div>
            <div className="border-line flex justify-between gap-3 border-b py-2 text-sm">
              <span className="text-muted shrink-0">Insurance</span>
              <span className={`text-right ${shortList(clinic.insuranceAccepted) === "Not published" ? "text-muted" : "font-bold"}`}>{shortList(clinic.insuranceAccepted)}</span>
            </div>
            <div className="border-line flex justify-between gap-3 border-b py-2 text-sm">
              <span className="text-muted shrink-0">Financing</span>
              <span className={`text-right ${shortList(clinic.financing) === "Not published" ? "text-muted" : "font-bold"}`}>{shortList(clinic.financing)}</span>
            </div>
            <div className="flex justify-between gap-3 py-2 text-sm">
              <span className="text-muted shrink-0">Services</span>
              <span className={`text-right ${shortList(clinic.services) === "Not published" ? "text-muted" : ""}`}>{shortList(clinic.services)}</span>
            </div>
          </div>
        </div>

        {clinic.publishedPrices && clinic.publishedPrices.value !== "not_published" && Array.isArray(clinic.publishedPrices.value) && (
          <div className="border-line bg-card mt-3 rounded-xl border p-4">
            <p className="text-muted text-xs font-bold tracking-widest uppercase">Published prices</p>
            <div className="mt-1 flex flex-col">
              {(clinic.publishedPrices.value as unknown as string[]).map((line) => {
                const { label, num } = parsePrice(line);
                return (
                  <div key={line} className="border-line flex justify-between gap-3 border-b py-2 text-sm last:border-b-0">
                    <span>{label}</span>
                    <span className="num shrink-0 font-bold">{num}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {clinic.locations.length > 0 && (
          <div className="border-line bg-card mt-3 rounded-xl border p-4">
            <p className="text-muted text-xs font-bold tracking-widest uppercase">Locations</p>
            {clinic.locations.map((l) => (
              <p key={l.label} className="mt-0.5 text-sm">{l.label}: {l.address}</p>
            ))}
          </div>
        )}

        <p className="text-muted mt-2 text-xs">
          Source: the clinic's own site, checked {String((clinic.services as { retrieved?: string } | undefined)?.retrieved ?? "Oct 2026")}
        </p>

        <div className="mt-5 flex gap-2">
          <a
            href={clinic.website}
            target="_blank"
            rel="noreferrer"
            className="bg-accent text-accent-contrast flex-1 rounded-xl px-4 py-3 text-center font-bold"
          >
            Website
          </a>
          {clinic.phone && (
            <a href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`} className="border-accent text-accent-ink flex-1 rounded-xl border-[1.5px] px-4 py-3 text-center font-bold">
              Call {clinic.phone}
            </a>
          )}
        </div>

        <button type="button" onClick={onClose} className="border-line bg-card mt-4 min-h-12 rounded-xl border px-4 py-3 font-bold">
          Back to clinics
        </button>
      </div>
    </div>
  );
}
