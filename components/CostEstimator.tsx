"use client";

import { useState } from "react";
import type { PreservationOption } from "../lib/content-schema";
import type { InsuranceType, TreatmentStage } from "../lib/types";
import Cite from "./Cite";

/**
 * On-device cost estimate from PUBLISHED numbers only. Adds the option's
 * published once-off ranges plus a storage-years slider; never invents a
 * price. Insurance changes the framing, not the math: plan-specific costs
 * (deductibles, copays) are unknowable here and said so.
 */

export function cashRange(
  option: PreservationOption,
  storageYears: number,
): { min: number; max: number; unpublished: string[] } {
  let min = 0;
  let max = 0;
  const unpublished: string[] = [];
  for (const c of option.costs) {
    if (!c.amount) {
      if (c.range === "not published") unpublished.push(c.label);
      continue;
    }
    if (c.label.toLowerCase().includes("package")) continue; // example price, not additive
    const years = c.amount.per === "year" ? storageYears : 1;
    min += c.amount.min * years;
    max += c.amount.max * years;
  }
  return { min, max, unpublished };
}

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

export default function CostEstimator({
  option,
  insurance,
  stage,
}: {
  option: PreservationOption;
  insurance?: InsuranceType;
  stage?: TreatmentStage;
}) {
  const [years, setYears] = useState(5);
  const { min, max, unpublished } = cashRange(option, years);
  const hasNumbers = max > 0;
  const preTreatment = stage === "not_started" || stage === "in_treatment";

  return (
    <div className="bg-paper rounded-xl p-4">
      <p className="font-bold">What could this cost you?</p>

      {hasNumbers && (
        <>
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <span className="text-sm">If you paid the published prices yourself</span>
            <span className="text-lg font-bold whitespace-nowrap">
              {min === max ? fmt(min) : `${fmt(min)} to ${fmt(max)}`}
            </span>
          </div>
          <label className="mt-3 block text-sm">
            Years of storage: <strong>{years}</strong>
            <input
              type="range"
              min={1}
              max={15}
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value, 10))}
              className="accent-[var(--accent)] mt-1 w-full"
              aria-label="Years of storage"
            />
          </label>
        </>
      )}
      {!hasNumbers && (
        <p className="mt-2 text-sm">
          No published prices for this one. Clinics quote it case by case, and storage runs $200 to
          $500 per year.
        </p>
      )}
      {unpublished.length > 0 && hasNumbers && (
        <p className="text-muted mt-2 text-xs">Not included (no published price): {unpublished.join("; ")}.</p>
      )}

      <div className="border-line mt-3 border-t pt-3 text-sm">
        {insurance === "ca_commercial" && preTreatment && (
          <p>
            Your California plan should cover fertility preservation before cancer treatment (SB 600), so
            your cost may be your plan's usual deductible and copays instead of the prices above.
            Ask your plan what you would owe, and whether storage is covered and for how long.
          </p>
        )}
        {insurance === "ca_commercial" && stage === "finished" && (
          <p>
            For plans renewing from January 1, 2026, large-group California plans must cover
            infertility treatment including IVF (SB 729). Ask your plan what you would owe, and
            whether storage is covered.
          </p>
        )}
        {insurance === "medi_cal" && (
          <p>
            Medi-Cal does not cover fertility preservation right now, so the prices above are what
            to plan around. The financial aid programs below exist for exactly this.
          </p>
        )}
        {(insurance === "none" || insurance === "other" || insurance === "unknown" || !insurance) && (
          <p>
            If insurance doesn't cover this, the prices above are what to plan around. The aid
            programs below can help, and many clinics have payment plans. If you're not sure what
            your plan covers, the coverage section below shows exactly what to ask.
          </p>
        )}
      </div>

      <p className="text-muted mt-2 text-xs">
        A rough range from published prices, not a quote. Your clinic's prices and your plan's
        share can differ.
      </p>
      <Cite citations={option.costs.flatMap((c) => c.citations)} />
    </div>
  );
}
