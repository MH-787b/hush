"use client";

import { useState, useRef, useEffect } from "react";
import { venues, type Venue } from "@/data/venues";

interface HeaderProps {
  onVenueSelect: (venue: Venue) => void;
}

export default function Header({ onVenueSelect }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Venue[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      venues.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.type.toLowerCase().includes(q) ||
          v.address.toLowerCase().includes(q) ||
          v.tags.some((t) => t.includes(q))
      ).slice(0, 6)
    );
  }, [query]);

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="flex items-center gap-3 p-4 md:p-6">
        {/* Logo */}
        <div className="pointer-events-auto flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 9C18 9 19.5 11 19.5 13.5C19.5 16 18 18 18 18"
                stroke="#22c55e"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15 10.5C15 10.5 16 11.5 16 13.5C16 15.5 15 16.5 15 16.5"
                stroke="#22c55e"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M4 15V12C4 8.68629 6.68629 6 10 6H11C11.5523 6 12 6.44772 12 7V20C12 20.5523 11.5523 21 11 21H10C6.68629 21 4 18.3137 4 15Z"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
              <line x1="8" y1="3" x2="8" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-base font-bold tracking-tight leading-none">
              hush
            </h1>
            <p className="text-[10px] text-white/25 tracking-widest uppercase">
              find your quiet
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md pointer-events-auto relative">
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
              open
                ? "bg-[rgba(12,12,22,0.95)] backdrop-blur-xl border-white/[0.15] shadow-lg shadow-black/30"
                : "bg-white/[0.06] backdrop-blur-xl border-white/[0.08] hover:bg-white/[0.08]"
            }`}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
              placeholder="Search venues, neighborhoods..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
            />
            {query && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="text-white/20 hover:text-white/50 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Results Dropdown */}
          {open && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 py-1 rounded-xl bg-[rgba(12,12,22,0.95)] backdrop-blur-xl border border-white/[0.08] shadow-xl shadow-black/40 overflow-hidden">
              {results.map((venue) => (
                <button
                  key={venue.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onVenueSelect(venue);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/[0.05] transition-colors text-left"
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background:
                        venue.noiseLevel === "quiet"
                          ? "#22c55e"
                          : venue.noiseLevel === "moderate"
                          ? "#f59e0b"
                          : "#ef4444",
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-white/80 truncate">{venue.name}</p>
                    <p className="text-[11px] text-white/25 truncate">
                      {venue.type} · {venue.address}
                    </p>
                  </div>
                  <span className="ml-auto text-[11px] text-white/20 shrink-0">
                    {venue.avgDecibels} dB
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
