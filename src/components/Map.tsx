"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { venues, NOISE_CONFIG, type Venue, type NoiseLevel } from "@/data/venues";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapProps {
  filter: NoiseLevel | "all";
  onVenueSelect: (venue: Venue | null) => void;
  selectedVenue: Venue | null;
}

export default function Map({ filter, onVenueSelect, selectedVenue }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const createMarkerElement = useCallback(
    (venue: Venue, isSelected: boolean) => {
      const config = NOISE_CONFIG[venue.noiseLevel];
      const el = document.createElement("div");
      el.className = "hush-marker";

      const size = isSelected ? 28 : 20;
      const glowSize = isSelected ? 48 : 36;

      el.style.cssText = `
      width: ${glowSize}px;
      height: ${glowSize}px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s ease;
    `;

      el.innerHTML = `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${config.color};
        box-shadow: 0 0 ${isSelected ? 20 : 12}px ${isSelected ? 8 : 4}px ${config.glowColor},
                    0 0 ${isSelected ? 40 : 24}px ${isSelected ? 16 : 8}px ${config.glowColor};
        border: 2px solid rgba(255,255,255,${isSelected ? 0.9 : 0.3});
        transition: all 0.3s ease;
        ${isSelected ? "animation: pulse-glow 2s ease-in-out infinite;" : ""}
      "></div>
    `;

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.3)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      return el;
    },
    []
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-73.98, 40.74],
      zoom: 12.5,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "bottom-right"
    );

    map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");

    map.current.on("load", () => {
      const m = map.current!;

      // Add 3D building layer
      const layers = m.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === "symbol" && (layer.layout as Record<string, unknown>)?.["text-field"]
      )?.id;

      m.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 12,
          paint: {
            "fill-extrusion-color": "#1a1a2e",
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "min_height"],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );

      // Add a subtle fog
      m.setFog({
        color: "rgb(10, 10, 20)",
        "high-color": "rgb(20, 20, 40)",
        "horizon-blend": 0.08,
        "space-color": "rgb(8, 8, 18)",
        "star-intensity": 0.15,
      });

      setMapLoaded(true);
    });

    // Click on map background to deselect
    map.current.on("click", (e) => {
      const target = e.originalEvent.target as HTMLElement;
      if (!target.closest(".hush-marker")) {
        onVenueSelect(null);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered =
      filter === "all"
        ? venues
        : venues.filter((v) => v.noiseLevel === filter);

    filtered.forEach((venue) => {
      const isSelected = selectedVenue?.id === venue.id;
      const el = createMarkerElement(venue, isSelected);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onVenueSelect(venue);
        map.current?.flyTo({
          center: [venue.lng, venue.lat],
          zoom: 15,
          pitch: 50,
          duration: 1200,
          essential: true,
        });
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([venue.lng, venue.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [mapLoaded, filter, selectedVenue, onVenueSelect, createMarkerElement]);

  return (
    <div ref={mapContainer} className="absolute inset-0">
      <style jsx global>{`
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .mapboxgl-ctrl-bottom-right {
          bottom: 24px !important;
          right: 12px !important;
        }
        .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl-group {
          background: rgba(15, 15, 25, 0.85) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl-group button {
          border-color: rgba(255, 255, 255, 0.06) !important;
        }
        .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl-group button span {
          filter: invert(1) !important;
        }
        .mapboxgl-ctrl-attrib {
          background: transparent !important;
          font-size: 10px !important;
          opacity: 0.4;
        }
        .mapboxgl-ctrl-attrib a {
          color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>
    </div>
  );
}
