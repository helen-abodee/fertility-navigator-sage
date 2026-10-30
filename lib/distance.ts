import zips from "../data/ca-zips.json";

/**
 * On-device ZIP distance. Coordinates come from the bundled US Census 2023
 * ZCTA gazetteer (public domain), California range only. The ZIP never leaves
 * the device; unknown ZIPs return null rather than a guess.
 */

export interface Coords {
  lat: number;
  lng: number;
}

const table = zips as unknown as Record<string, [number, number]>;

export function zipToCoords(zip: string): Coords | null {
  if (!/^\d{5}$/.test(zip)) return null;
  const hit = table[zip];
  if (!hit) return null;
  return { lat: hit[0], lng: hit[1] };
}

export function milesBetween(a: Coords, b: Coords): number {
  const R = 3958.8; // mean Earth radius, miles
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
