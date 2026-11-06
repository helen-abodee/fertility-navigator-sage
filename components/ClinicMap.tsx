"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Clinic } from "../lib/types";
import type { Coords } from "../lib/distance";

interface Props {
  clinics: Clinic[];
  home: Coords | null;
}

/**
 * Leaflet + OpenStreetMap tiles: no API key, no tracking. Circle markers avoid
 * Leaflet's bundler-broken default icon images.
 */
export default function ClinicMap({ clinics, home }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!el.current || mapRef.current) return;
    const map = L.map(el.current, { scrollWheelZoom: false });
    mapRef.current = map;
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    // The map can mount inside a hidden tab; Leaflet then sizes to zero and
    // renders blank. Re-measure whenever the container becomes visible.
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(el.current);
    setTimeout(() => map.invalidateSize(), 50);
    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    const points: L.LatLngExpression[] = [];
    for (const clinic of clinics) {
      for (const loc of clinic.locations) {
        points.push([loc.lat, loc.lng]);
        L.circleMarker([loc.lat, loc.lng], {
          radius: 8,
          color: "#125a69",
          fillColor: "#16697a",
          fillOpacity: 0.85,
          weight: 2,
        })
          .bindPopup(`<strong>${clinic.name}</strong><br>${loc.label}`)
          .addTo(layer);
      }
    }
    if (home) {
      points.push([home.lat, home.lng]);
      L.circleMarker([home.lat, home.lng], {
        radius: 7,
        color: "#a8653a",
        fillColor: "#c17d4e",
        fillOpacity: 0.9,
        weight: 2,
      })
        .bindPopup("Your area")
        .addTo(layer);
    }
    if (home) {
      // Zoom to the user's area: home plus clinics within roughly 40 miles.
      const near = points.filter((pt) => {
        const [lat, lng] = pt as [number, number];
        return Math.abs(lat - home.lat) < 0.6 && Math.abs(lng - home.lng) < 0.7;
      });
      map.fitBounds(L.latLngBounds(near.length > 1 ? near : points).pad(0.12), { maxZoom: 11 });
    } else if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points).pad(0.1), { maxZoom: 9 });
    }
    return () => {
      layer.remove();
    };
  }, [clinics, home]);

  return (
    <div
      ref={el}
      className="border-line relative z-0 h-72 w-full overflow-hidden rounded-2xl border"
      style={{ isolation: "isolate" }}
      role="region"
      aria-label="Map of fertility clinics"
    />
  );
}
