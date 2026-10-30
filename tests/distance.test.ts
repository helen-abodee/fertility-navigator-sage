import { describe, it, expect } from "vitest";
import { milesBetween, zipToCoords } from "../lib/distance";

describe("zipToCoords", () => {
  it("resolves a known California ZIP (Pasadena 91101)", () => {
    const c = zipToCoords("91101");
    expect(c).not.toBeNull();
    expect(c!.lat).toBeGreaterThan(33.5);
    expect(c!.lat).toBeLessThan(34.5);
    expect(c!.lng).toBeLessThan(-117);
  });

  it("returns null for unknown or malformed ZIPs instead of guessing", () => {
    expect(zipToCoords("00000")).toBeNull();
    expect(zipToCoords("1234")).toBeNull();
    expect(zipToCoords("abcde")).toBeNull();
  });
});

describe("milesBetween", () => {
  it("measures Pasadena to San Diego at roughly 110 to 130 miles", () => {
    const pasadena = { lat: 34.1478, lng: -118.1445 };
    const sanDiego = { lat: 32.7157, lng: -117.1611 };
    const miles = milesBetween(pasadena, sanDiego);
    expect(miles).toBeGreaterThan(100);
    expect(miles).toBeLessThan(135);
  });

  it("is zero for the same point", () => {
    const p = { lat: 34, lng: -118 };
    expect(milesBetween(p, p)).toBe(0);
  });
});
