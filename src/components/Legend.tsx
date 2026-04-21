"use client";

import { NOISE_CONFIG, type NoiseLevel } from "@/data/venues";

interface LegendProps {
  filter: NoiseLevel | "all";
  onFilterChange: (filter: NoiseLevel | "all") => void;
}

export default function Legend({ filter, onFilterChange }: LegendProps) {
  return (
    <div className="absolute top-20 md:top-6 right-4 md:right-6 z-20">
      <div className="bg-[rgba(12,12,22,0.85)] backdrop-blur-xl border border-white/[0.08] rounded-xl p-1 flex flex-col gap-0.5">
        {/* All filter */}
        <button
          onClick={() => onFilterChange("all")}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            filter === "all"
              ? "bg-white/[0.1] text-white"
              : "text-white/35 hover:text-white/60 hover:bg-white/[0.04]"
          }`}
        >
          All
        </button>

        {(Object.entries(NOISE_CONFIG) as [NoiseLevel, typeof NOISE_CONFIG.quiet][]).map(
          ([level, cfg]) => (
            <button
              key={level}
              onClick={() => onFilterChange(level)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filter === level
                  ? "bg-white/[0.1] text-white"
                  : "text-white/35 hover:text-white/60 hover:bg-white/[0.04]"
              }`}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: cfg.color,
                  boxShadow: `0 0 6px 2px ${cfg.glowColor}`,
                }}
              />
              {cfg.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
