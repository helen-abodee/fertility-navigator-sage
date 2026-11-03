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

const RADII = [
  { label: "Within 15 mi", miles: 15 },
  { label: "Within 40 mi", miles: 40 },
  { label: "Any distance", miles: Infinity },
];

const BUDGETS = [
  { label: "Under $2,000", max: 2000 },
  { label: "Under $15,000", max: 15000 },
  { label: "Any budget", max: Infinity },
];

function minPublishedPrice(c: Clinic): number | null {
  const field = c.publishedPrices;
  if (!field || field.value === "not_published" || !Array.isArray(field.value)) return null;
  const nums = field.value
    .map((p) => {
      const m = String(p).replace(/,/g, "").match(/\$(\d{2,6})/);
      return m ? parseInt(m[1], 10) : null;
    })
    .filter((n): n is number => n !== null);
  return nums.length ? Math.min(...nums) : null;
}

export default function ClinicsSection({ clinics, zip }: { clinics: Clinic[]; zip?: string | null }) {
  const [filters, setFilters] = useState<ServiceFilter[]>([]);
  const [radius, setRadius] = useState<number>(Infinity);
  const [budget, setBudget] = useState<number>(Infinity);
  const [showMap, setShowMap] = useState(false);
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
    // Budget keeps clinics whose cheapest published price fits, and keeps
    // unpublished-price clinics honestly labeled rather than hiding them.
    const inBudget = inRadius.filter((r) => {
      if (budget === Infinity) return true;
      const min = minPublishedPrice(r.clinic);
      return min === null || min <= budget;
    });
    inBudget.sort((a, b) => {
      if (a.miles === null && b.miles === null) return a.clinic.name.localeCompare(b.clinic.name);
      if (a.miles === null) return 1;
      if (b.miles === null) return -1;
      return a.miles - b.miles;
    });
    return inBudget;
  }, [clinics, filters, home, radius, budget]);

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
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <span className="text-muted text-sm font-bold">My budget:</span>
        {BUDGETS.map((b) => (
          <button
            key={b.label}
            type="button"
            aria-pressed={budget === b.max}
            onClick={() => setBudget(b.max)}
            className={`rounded-full border px-3 py-1.5 text-sm font-bold ${
              budget === b.max ? "border-accent bg-accent-tint text-accent-ink" : "border-line bg-card"
            }`}
          >
            {b.label}
          </button>
        ))}
        {budget !== Infinity && (
          <span className="text-muted w-full text-xs">
            Clinics without published prices stay listed, marked "not published", because unlisted
            is not the same as unaffordable. Aid programs can also change the math.
          </span>
        )}
      </div>

      <div className="print:hidden">
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          aria-expanded={showMap}
          className="border-accent text-accent-ink w-full rounded-xl border-[1.5px] px-4 py-3 font-bold"
        >
          {showMap ? "Hide the map" : "Show these on a map"}
        </button>
        {showMap && (
          <div className="mt-3">
            <ClinicMap clinics={rows.map((r) => r.clinic)} home={home} />
          </div>
        )}
        {zip && !home && (
          <p className="text-muted mt-1 text-xs">
            We couldn't place that ZIP code, so distances are hidden.
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
