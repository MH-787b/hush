"use client";

import { useState } from "react";
import { NOISE_CONFIG, type Venue, type NoiseLevel } from "@/data/venues";

interface VenuePanelProps {
  venue: Venue;
  onClose: () => void;
}

export default function VenuePanel({ venue, onClose }: VenuePanelProps) {
  const [showCheckin, setShowCheckin] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const config = NOISE_CONFIG[venue.noiseLevel];

  const handleCheckin = (level: NoiseLevel) => {
    setCheckedIn(true);
    setShowCheckin(false);
    setTimeout(() => setCheckedIn(false), 3000);
    // In production, this would POST to an API
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto md:w-[400px] z-30 animate-slide-up">
      <div className="bg-[rgba(12,12,22,0.92)] backdrop-blur-xl border border-white/[0.08] rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-5 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="flex items-start gap-3">
            <div
              className="mt-1 w-3 h-3 rounded-full shrink-0"
              style={{
                background: config.color,
                boxShadow: `0 0 8px 3px ${config.glowColor}`,
              }}
            />
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white truncate pr-8">
                {venue.name}
              </h2>
              <p className="text-sm text-white/40 mt-0.5">
                {venue.type} · {venue.address}
              </p>
            </div>
          </div>
        </div>

        {/* Noise Level Bar */}
        <div className="mx-5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{config.emoji}</span>
              <span className="text-sm font-medium" style={{ color: config.color }}>
                {config.label}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-white">
                {venue.avgDecibels}
              </span>
              <span className="text-xs text-white/30 ml-1">dB</span>
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((venue.avgDecibels / 100) * 100, 100)}%`,
                background: `linear-gradient(90deg, ${config.color}, ${config.color}aa)`,
                boxShadow: `0 0 8px ${config.glowColor}`,
              }}
            />
          </div>
          <p className="text-[11px] text-white/25 mt-1.5">
            Based on {venue.checkins} check-ins · Last: {venue.lastCheckin}
          </p>
        </div>

        {/* Amenities */}
        <div className="flex gap-2 px-5 mt-4 flex-wrap">
          {venue.wifi && (
            <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50 flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              WiFi
            </span>
          )}
          {venue.outlets && (
            <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50 flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Outlets
            </span>
          )}
          <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {venue.hours}
          </span>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 px-5 mt-3 flex-wrap">
          {venue.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-md text-[11px] text-white/30 bg-white/[0.03]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Check-in Section */}
        <div className="p-5 mt-2">
          {checkedIn ? (
            <div className="text-center py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-400 font-medium">
                Thanks for checking in!
              </p>
              <p className="text-xs text-white/30 mt-1">
                Your report helps others find their quiet.
              </p>
            </div>
          ) : showCheckin ? (
            <div>
              <p className="text-xs text-white/40 mb-3 text-center">
                How loud is it right now?
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(NOISE_CONFIG) as [NoiseLevel, typeof NOISE_CONFIG.quiet][]).map(
                  ([level, cfg]) => (
                    <button
                      key={level}
                      onClick={() => handleCheckin(level)}
                      className="group py-3 px-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15] transition-all text-center"
                    >
                      <span className="text-2xl block mb-1">{cfg.emoji}</span>
                      <span
                        className="text-xs font-medium block"
                        style={{ color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-[10px] text-white/20 block mt-0.5">
                        {cfg.dbRange}
                      </span>
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => setShowCheckin(false)}
                className="w-full mt-2 text-xs text-white/20 hover:text-white/40 transition-colors py-1"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCheckin(true)}
              className="w-full py-3 rounded-xl font-medium text-sm transition-all
                         bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.15]
                         text-white/70 hover:text-white"
            >
              Check in · Report Noise Level
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
