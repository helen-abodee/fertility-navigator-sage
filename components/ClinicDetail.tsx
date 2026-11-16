"use client";

import type { Clinic, SourcedField } from "../lib/types";
import Cite from "./Cite";
import Icon from "./icons";

function val<T>(f?: SourcedField<T>): string {
  if (!f || f.value === "not_published") return "not published";
  if (Array.isArray(f.value)) return (f.value as unknown as string[]).join("; ");
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

        <div className="mt-4 flex flex-col gap-3">
          {fields.map(({ label, f }) => (
            <div key={label} className="border-line bg-card rounded-xl border p-3">
              <p className="text-muted text-xs font-bold tracking-widest uppercase">{label}</p>
              <p className={`mt-0.5 text-[0.95rem] ${val(f) === "not published" ? "text-muted" : ""}`}>{val(f)}</p>
              {f && "sourceUrl" in f && (
                <p className="text-muted mt-1 text-xs">
                  Checked {String((f as { retrieved?: string }).retrieved ?? "")}
                </p>
              )}
            </div>
          ))}
          {clinic.locations.length > 0 && (
            <div className="border-line bg-card rounded-xl border p-3">
              <p className="text-muted text-xs font-bold tracking-widest uppercase">Locations</p>
              {clinic.locations.map((l) => (
                <p key={l.label} className="mt-0.5 text-[0.95rem]">{l.label}: {l.address}</p>
              ))}
            </div>
          )}
        </div>

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
