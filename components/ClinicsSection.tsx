"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Anatomy, Clinic, SourcedField } from "../lib/types";
import { milesBetween, zipToCoords } from "../lib/distance";
import { clinicFitsAnatomy } from "../lib/clinic-fit";
import ClinicDetail from "./ClinicDetail";
import { track } from "../lib/analytics";

/** Slippy-map tile coordinates for a small location thumbnail. */
function tileFor(lat: number, lng: number, z = 11): { x: number; y: number } {
  const x = Math.floor(((lng + 180) / 360) * 2 ** z);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * 2 ** z);
  return { x, y };
}

function monogram(name: string): string {
  const words = name.replace(/\(.*\)/, "").trim().split(/\s+/);
  return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
}

const ClinicMap = dynamic(() => import("./ClinicMap"), { ssr: false });

type ClinicFilter =
  | "all"
  | "oncofertility"
  | "freeConsult"
  | "publishesPrices"
  | "spermBanking"
  | "ovarianTissueFreezing";

const FILTER_OPTIONS: { value: ClinicFilter; label: string }[] = [
  { value: "all", label: "All clinics" },
  { value: "oncofertility", label: "Works with cancer patients" },
  { value: "freeConsult", label: "Free consultation" },
  { value: "publishesPrices", label: "Publishes prices" },
  { value: "spermBanking", label: "Sperm banking" },
  { value: "ovarianTissueFreezing", label: "Ovarian tissue freezing" },
];

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

export default function ClinicsSection({ clinics, zip, anatomy }: { clinics: Clinic[]; zip?: string | null; anatomy?: Anatomy }) {
  const [filter, setFilter] = useState<ClinicFilter>("all");
  const [radius, setRadius] = useState<number>(Infinity);
  const [open, setOpen] = useState<{ clinic: Clinic; miles: number | null } | null>(null);
  const home = zip ? zipToCoords(zip) : null;

  const rows = useMemo(() => {
    const filtered = clinics.filter((c) => clinicFitsAnatomy(c, anatomy)).filter((c) => {
      if (filter === "all") return true;
      if (filter === "oncofertility") return fieldTrue(c.oncofertility);
      if (filter === "spermBanking") return fieldTrue(c.spermBanking);
      if (filter === "ovarianTissueFreezing") return fieldTrue(c.ovarianTissueFreezing);
      if (filter === "freeConsult") return /free/i.test(String(c.consultCost?.value ?? ""));
      if (filter === "publishesPrices") return Array.isArray(c.publishedPrices?.value);
      return true;
    });
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
  }, [clinics, filter, home, radius, anatomy]);


  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg">Fertility clinics</h2>
        <p className="text-muted mt-1 text-sm">
          These clinics appear on resource lists used by cancer-center social workers. Being listed
          is not an endorsement. Prices shown are only what each clinic publishes itself.
        </p>
      </div>

      <div className="print:hidden">
        <ClinicMap
          clinics={rows.map((r) => r.clinic)}
          home={home}
          onOpenClinic={(id) => {
            const row = rows.find((r) => r.clinic.id === id);
            if (row) {
              track("clinic_detail_opened");
              setOpen({ clinic: row.clinic, miles: row.miles });
            }
          }}
        />
        {zip && !home && (
          <p className="text-muted mt-1 text-xs">We couldn't place that ZIP code, so distances are hidden.</p>
        )}
      </div>

      <select
        aria-label="Filter clinics"
        value={filter}
        onChange={(e) => setFilter(e.target.value as ClinicFilter)}
        className="border-line bg-card min-h-12 w-full rounded-xl border-[1.5px] px-3 text-sm font-bold print:hidden"
      >
        {FILTER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

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
        {rows.map(({ clinic, miles }) => {
          const loc = clinic.locations[0];
          const tile = loc ? tileFor(loc.lat, loc.lng) : null;
          return (
            <button
              key={clinic.id}
              type="button"
              onClick={() => { track("clinic_detail_opened"); setOpen({ clinic, miles }); }}
              className="border-line bg-card flex w-full items-center gap-3 rounded-2xl border p-3 text-left"
            >
              {tile ? (
                <span className="border-line relative block h-14 w-14 shrink-0 overflow-hidden rounded-xl border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://tile.openstreetmap.org/11/${tile.x}/${tile.y}.png`}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90"
                  />
                  <span className="bg-accent absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white" />
                </span>
              ) : (
                <span className="bg-accent-tint text-accent-ink flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold">
                  {monogram(clinic.name)}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{clinic.name}</span>
                <span className="text-muted block truncate text-sm">
                  {loc?.address ?? "Address on their site"}
                </span>
                <span className="mt-1 flex flex-wrap gap-1">
                  {fieldTrue(clinic.oncofertility) && (
                    <span className="bg-accent-tint text-accent-ink inline-block rounded-full px-2 py-0.5 text-[0.65rem] font-bold">
                      oncofertility
                    </span>
                  )}
                  {/free/i.test(String(clinic.consultCost?.value ?? "")) && (
                    <span className="inline-block rounded-full px-2 py-0.5 text-[0.65rem] font-bold" style={{ background: "var(--cmp-good-bg)", color: "var(--cmp-good-ink)" }}>
                      free consult
                    </span>
                  )}
                </span>
              </span>
              <span className="flex flex-col items-end gap-0.5">
                {miles !== null && (
                  <span className="num text-muted text-sm whitespace-nowrap">{Math.round(miles)} mi</span>
                )}
                <span className="text-accent-ink text-xl" aria-hidden="true">&rsaquo;</span>
              </span>
            </button>
          );
        })}
        {rows.length === 0 && (
          <p className="text-muted text-sm">
            No listed clinic matches those filters. Try widening the distance or changing the filter
            filter.
          </p>
        )}
      </div>

      <p className="text-muted text-xs print:hidden">Map and thumbnails &copy; OpenStreetMap contributors.</p>

      {open && <ClinicDetail clinic={open.clinic} miles={open.miles} onClose={() => setOpen(null)} />}
    </section>
  );
}
