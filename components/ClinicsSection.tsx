"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Clinic, SourcedField } from "../lib/types";
import { milesBetween, zipToCoords } from "../lib/distance";
import ClinicDetail from "./ClinicDetail";

const ClinicMap = dynamic(() => import("./ClinicMap"), { ssr: false });

type ServiceFilter = "oncofertility" | "spermBanking" | "ovarianTissueFreezing";

const filterLabels: Record<ServiceFilter, string> = {
  oncofertility: "Works with cancer patients",
  spermBanking: "Sperm banking",
  ovarianTissueFreezing: "Ovarian tissue freezing",
};

function fieldTrue(f?: SourcedField<boolean>): boolean {
  return !!f && f.value === true;
}

function show<T>(f?: SourcedField<T>): string {
  if (!f) return "not published";
  if (f.value === "not_published") return "not published";
  if (Array.isArray(f.value)) return (f.value as unknown as string[]).join(", ");
  return String(f.value);
}

const RADII = [
  { label: "Within 15 mi", miles: 15 },
  { label: "Within 40 mi", miles: 40 },
  { label: "Any distance", miles: Infinity },
];

export default function ClinicsSection({ clinics, zip }: { clinics: Clinic[]; zip?: string | null }) {
  const [filters, setFilters] = useState<ServiceFilter[]>([]);
  const [radius, setRadius] = useState<number>(Infinity);
  const [open, setOpen] = useState<{ clinic: Clinic; miles: number | null } | null>(null);
  const home = zip ? zipToCoords(zip) : null;

  const rows = useMemo(() => {
    const filtered = clinics.filter((c) =>
      filters.every((f) =>
        f === "oncofertility" ? fieldTrue(c.oncofertility) :
        f === "spermBanking" ? fieldTrue(c.spermBanking) :
        fieldTrue(c.ovarianTissueFreezing),
      ),
    );
    const withDistance = filtered.map((c) => {
      let miles: number | null = null;
      if (home && c.locations.length > 0) {
        miles = Math.min(...c.locations.map((l) => milesBetween(home, l)));
      }
      return { clinic: c, miles };
    });
    const inRadius = withDistance.filter(
      (r) => radius === Infinity || r.miles === null || r.miles <= radius,
    );
    inRadius.sort((a, b) => {
      if (a.miles === null && b.miles === null) return a.clinic.name.localeCompare(b.clinic.name);
      if (a.miles === null) return 1;
      if (b.miles === null) return -1;
      return a.miles - b.miles;
    });
    return inRadius;
  }, [clinics, filters, home, radius]);

  function toggle(f: ServiceFilter) {
    setFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl">Fertility clinics</h2>
        <p className="text-muted mt-1 text-sm">
          These clinics appear on resource lists used by cancer-center social workers. Being listed
          is not an endorsement. Prices shown are only what each clinic publishes itself.
        </p>
      </div>

      <div className="print:hidden">
        <ClinicMap clinics={rows.map((r) => r.clinic)} home={home} />
        {zip && !home && (
          <p className="text-muted mt-1 text-xs">We couldn't place that ZIP code, so distances are hidden.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        {(Object.keys(filterLabels) as ServiceFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filters.includes(f)}
            onClick={() => toggle(f)}
            className={`rounded-full border px-3 py-1.5 text-sm font-bold ${
              filters.includes(f) ? "border-accent bg-accent-tint text-accent-ink" : "border-line bg-card"
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {home && (
        <div className="flex flex-wrap gap-2 print:hidden">
          {RADII.map((r) => (
            <button
              key={r.label}
              type="button"
              aria-pressed={radius === r.miles}
              onClick={() => setRadius(r.miles)}
              className={`rounded-full border px-3 py-1.5 text-sm font-bold ${
                radius === r.miles ? "border-accent bg-accent-tint text-accent-ink" : "border-line bg-card"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {rows.map(({ clinic, miles }) => (
          <button
            key={clinic.id}
            type="button"
            onClick={() => setOpen({ clinic, miles })}
            className="border-line bg-card flex w-full items-center gap-3 rounded-2xl border p-4 text-left"
          >
            <span className="flex-1">
              <span className="block font-bold">{clinic.name}</span>
              <span className="text-muted block text-sm">
                {clinic.locations[0]?.address ?? "Address on their site"}
              </span>
            </span>
            {miles !== null && (
              <span className="text-muted text-sm whitespace-nowrap">{Math.round(miles)} mi</span>
            )}
            <span className="text-accent-ink text-xl" aria-hidden="true">&rsaquo;</span>
          </button>
        ))}
        {rows.length === 0 && (
          <p className="text-muted text-sm">
            No listed clinic matches those filters. Try widening the distance or removing a service
            filter.
          </p>
        )}
      </div>

      {open && <ClinicDetail clinic={open.clinic} miles={open.miles} onClose={() => setOpen(null)} />}
    </section>
  );
}
