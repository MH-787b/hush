# Hush — Find Your Quiet

Real-time noise-level map for finding quiet places. The "Waze for silence."

## Project Overview

Hush maps the *auditory environment* of venues — not foot traffic. A busy library is quiet; a half-empty bar with a bad sound system is loud. We solve for sound.

- **Brand:** "hush" — lowercase, minimal. Tagline: "Find your quiet."
- **Target:** NYC first, one city owned completely before expanding.
- **Audience:** Remote workers, neurodivergent users, anyone who needs to know how a place *sounds* before going.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Map:** Mapbox GL JS (dark-v11 style, 3D buildings, pitch/bearing)
- **Package manager:** npm

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Architecture

- `src/app/` — Next.js App Router pages
- `src/components/` — React components (Map, Header, Legend, VenuePanel)
- `src/data/` — Venue data and noise level config

## Key Design Decisions

- **Dark theme everywhere** — the brand is about calm. No bright UI.
- **Data strategy: prediction-first, not crowdsource-first.** Seed noise levels from venue type + time-of-day + Google busyness data. Refine with passive mic sampling. Manual check-ins are a bonus, not the foundation.
- **All UI overlays the map** — no separate pages. Single full-screen map experience.
- **Noise levels:** Green/Whisper (<50dB), Amber/Hum (50-70dB), Red/Loud (>70dB)

## Environment

Requires `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local` (get from https://account.mapbox.com/access-tokens/)
