import { describe, it, expect } from "vitest";
import { regimensFor, crispLookup, crispBandToCategory } from "../lib/crisp";

describe("CRISP table (recovered from UCSD's public tool)", () => {
  it("lists regimens for cancers the table covers, none for others", () => {
    expect(regimensFor("breast").length).toBeGreaterThan(10);
    expect(regimensFor("thyroid")).toEqual([]);
    expect(regimensFor(undefined)).toEqual([]);
  });

  it("looks up breast CMF with CRISP's age dependence", () => {
    const young = crispLookup("breast", "CMF (Cyclophosphamide, Methotrexate, Fluorouracil)", 24);
    expect(young?.band).toBe("LOW");
    const older = crispLookup("breast", "CMF (Cyclophosphamide, Methotrexate, Fluorouracil)", 44);
    expect(older?.band).toBe("MODERATE");
    expect(older?.refs).toContain("Sukumvanich");
  });

  it("returns null for unknown regimens instead of guessing", () => {
    expect(crispLookup("breast", "MADE-UP-REGIMEN", 24)).toBeNull();
    expect(crispLookup("breast", "CMF (Cyclophosphamide, Methotrexate, Fluorouracil)", undefined)).toBeNull();
  });

  it("maps CRISP bands to our categories, with UNKNOWN as honest variable", () => {
    expect(crispBandToCategory("LOW")).toBe("lower");
    expect(crispBandToCategory("MODERATE")).toBe("intermediate");
    expect(crispBandToCategory("HIGH")).toBe("high");
    expect(crispBandToCategory("UNKNOWN")).toBe("variable");
  });
});
