"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Legend from "@/components/Legend";
import VenuePanel from "@/components/VenuePanel";
import type { Venue, NoiseLevel } from "@/data/venues";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [filter, setFilter] = useState<NoiseLevel | "all">("all");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const handleVenueSelect = useCallback((venue: Venue | null) => {
    setSelectedVenue(venue);
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0a0a14]">
      {/* Map */}
      <Map
        filter={filter}
        onVenueSelect={handleVenueSelect}
        selectedVenue={selectedVenue}
      />

      {/* UI Overlays */}
      <Header onVenueSelect={handleVenueSelect} />
      <Legend filter={filter} onFilterChange={setFilter} />

      {/* Venue Detail Panel */}
      {selectedVenue && (
        <VenuePanel
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
        />
      )}

      {/* Gradient Overlays for visual depth */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[rgba(10,10,20,0.7)] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[rgba(10,10,20,0.5)] to-transparent pointer-events-none z-10" />
    </main>
  );
}
