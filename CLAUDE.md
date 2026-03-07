# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tenths** is a short track racing crew chief app (PWA) for setup calculation, engine simulation, session logging, and diagnostics. Built for Painesville Speedway divisions (Ironman F8, Old School F8, Street Stock, Compacts, Juicebox). The product name is "Tenths" (npm package name: `tenths`).

## Commands

- `npm run dev` — Start dev server (Next.js 16, port 3000)
- `npm run build` — Production build
- `npm run lint` — ESLint (flat config, core-web-vitals + typescript)
- No test framework is configured

## Tech Stack

- **Next.js 16** with App Router, React 19, TypeScript (strict)
- **Tailwind v4** via `@tailwindcss/postcss`
- **shadcn/ui** (new-york style, RSC-enabled, lucide icons). Add components via `npx shadcn add <component>`
- **Supabase** for auth (SSR cookie-based) and server-side data (tracks, cars tables)
- **Dexie (IndexedDB)** for client-side persistence (cars, setups, sessions, engine builds, user profiles) — see `src/data/db.ts` for schema versions
- **Stripe** for Pro subscriptions ($9.99/mo)
- **Anthropic Claude API** for AI setup recommendations (`src/app/api/setup/recommend/route.ts`)
- **Recharts** for power curve charts
- **Plausible** for analytics

## Architecture

### Route Groups (App Router)

- `(marketing)` — Landing page, brand, privacy, terms, promo codes. Public, no auth.
- `(auth)` — Sign-in/sign-up pages (Supabase Auth).
- `(app)` — Authenticated app routes. Wrapped in `AppShell` which provides `CarProvider`, `SubscriptionProvider`, `TooltipProvider`, and onboarding guard.
- `onboarding` — Post-signup flow (driver → car → track → confirm).

### Data Layer — Registry Pattern

Domain data uses a registry pattern: individual files export typed objects, a `registry.ts` aggregates them into arrays/maps with lookup functions.

- **Cars**: `src/data/cars/` — Each car is a file (e.g., `monte-carlo-75.ts`). `registry.ts` provides `getCarById()`, `getCarsForDivision()`, `getBaselineForCar()`.
- **Divisions**: `src/data/divisions/` — Each division defines rules, eligible makes, engine rules. `registry.ts` provides `getDivisionById()`, `getEngineRulesForDivision()`.
- **Engine Families**: `src/data/engine/families/` — GM SBC 350, Ford 351W, Mopar 360, Ford 4.6 SOHC. Each family has `heads.ts`, `cams.ts`, `index.ts`. `registry.ts` provides `getEngineFamilyById()`, `findHeadById()`, `findCamById()`.
- **Rules**: `src/data/rules/` — Per-division rules for 2026 season.
- **Tracks**: `src/data/tracks/` — Track profiles (Mansfield, Painesville).
- **Calculators**: `src/data/calculators/` — Pure functions for corner weight, gear ratio, rim offset, transmission scoring.

To add a new car/division/engine family: create the data file, then register it in the corresponding `registry.ts`.

### Engine Simulator

`src/data/engine/simulate.ts` implements an airflow-based volumetric efficiency model that produces torque/HP curves (800–6500 RPM). It uses head flow data, cam profiles, and compression ratio. `compliance.ts` checks builds against division engine rules.

### Type System

All domain types are in `src/lib/types/` with a barrel export at `index.ts`. Types are organized by domain: `car.ts`, `division.ts`, `engine.ts`, `session.ts`, `calculators.ts`, `setup.ts`, `troubleshoot.ts`, `rules.ts`, `common.ts`, `subscription.ts`.

### Auth & Middleware

`src/middleware.ts` calls `updateSession()` from `src/lib/supabase/middleware.ts`. Public routes (landing, auth, promo, legal) bypass auth. All `(app)` routes require authentication.

### Subscription Gating

Pro features (engine simulator, session logging, multi-car, engine compare) are defined in `src/lib/stripe/config.ts`. `ProGate` component and `SubscriptionProvider` context gate UI access. Stripe webhooks at `src/app/api/webhooks/stripe/route.ts`.

### Dual Storage Model

- **Supabase (server)**: Auth, tracks, cars (shared/reference data), subscriptions
- **Dexie/IndexedDB (client)**: User's garage, setups, sessions, engine builds, user profiles — offline-capable

### Design System

- Fonts: Chakra Petch (headings), Outfit (body), Victor Mono (mono)
- Dark theme with "Carbon Fiber" design system, telemetry blue palette
- Theme color: `#0A0A0F`
- Path alias: `@/*` maps to `./src/*`

### Hooks

Located in `src/hooks/`: `useCar` (garage context), `useAuth`, `useGarage`, `useMyTracks`, `useOnboardingGuard`, `useSubscription`, `useTrackDivisions`.

## Environment Variables

Required (in `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PRICE_ID`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `ANTHROPIC_API_KEY`
