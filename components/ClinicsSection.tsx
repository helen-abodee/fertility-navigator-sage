"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Clinic, SourcedField } from "../lib/types";
import { milesBetween, zipToCoords } from "../lib/distance";
import Cite from "./Cite";

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

export default function ClinicsSection({ clinics, zip }: { clinics: Clinic[]; zip?: string | null }) {
  const [filters, setFilters] = useState<ServiceFilter[]>([]);
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
    withDistance.sort((a, b) => {
      if (a.miles === null && b.miles === null) return a.clinic.name.localeCompare(b.clinic.name);
      if (a.miles === null) return 1;
      if (b.miles === null) return -1;
      return a.miles - b.miles;
    });
    return withDistance;
  }, [clinics, filters, home]);

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

      <div className="print:hidden">
        <ClinicMap clinics={rows.map((r) => r.clinic)} home={home} />
        {zip && !home && (
          <p className="text-muted mt-1 text-xs">
            We couldn't place that ZIP code, so distances are hidden. The map still shows every
            clinic.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {rows.map(({ clinic, miles }) => (
          <article key={clinic.id} className="border-line bg-card rounded-2xl border p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-lg">{clinic.name}</h3>
              {miles !== null && (
                <span className="text-muted text-sm whitespace-nowrap">{Math.round(miles)} mi</span>
              )}
            </div>
            {clinic.recommendedBy && (
              <>
                <p className="text-muted mt-1 text-sm italic">"{clinic.recommendedBy.value}"</p>
                <Cite citations={clinic.recommendedBy.citations} />
              </>
            )}
            <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 text-sm">
              <div>
                <dt className="inline font-bold">Services: </dt>
                <dd className="inline">{show(clinic.services)}</dd>
              </div>
              <div>
                <dt className="inline font-bold">Published prices: </dt>
                <dd className="inline">{show(clinic.publishedPrices)}</dd>
              </div>
              <div>
                <dt className="inline font-bold">Consult cost: </dt>
                <dd className="inline">{show(clinic.consultCost)}</dd>
              </div>
              <div>
                <dt className="inline font-bold">Insurance and financing: </dt>
                <dd className="inline">
                  {show(clinic.insuranceAccepted)}
                  {clinic.financing && clinic.financing.value !== "not_published"
                    ? `; ${show(clinic.financing)}`
                    : ""}
                </dd>
              </div>
            </dl>
            <p className="mt-2 text-sm">
              <a className="text-accent-ink font-bold underline" href={clinic.website} target="_blank" rel="noreferrer">
                Website
              </a>
              {clinic.phone && <span className="text-muted"> · {clinic.phone}</span>}
            </p>
          </article>
        ))}
        {rows.length === 0 && (
          <p className="text-muted text-sm">
            No listed clinic publishes that combination of services. Try removing a filter.
          </p>
        )}
      </div>
    </section>
  );
}
