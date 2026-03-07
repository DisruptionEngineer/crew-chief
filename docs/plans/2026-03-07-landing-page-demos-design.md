# Landing Page Interactive Demos — Design

## Goal

Replace static mockups with 3 fully-functional calculator demos on the landing page to let visitors experience the app before signing up. Only saving/persistence is gated behind auth.

## Page Flow

Hero → Setup Demo (existing) → **Gear Ratio Calculator** → **Corner Weight Calculator** → **Diagnostic Troubleshooter** → Tool Showcase (condensed to 4 mini cards) → Pricing → Footer

Each demo is a full-width section with a consistent pattern:
- Section header with icon + title + one-line description
- Interactive calculator content
- CTA banner at the bottom: "Sign up free to save [results] to your garage."

---

## Section 1: Gear Ratio Calculator

**Layout**: Two columns on desktop, stacked on mobile.

**Left column — Inputs**:
- Tire diameter (inches, number input, default 26")
- Rear gear ratio (number input, default 3.73)
- Transmission preset dropdown with 7 options:
  - Muncie M20, Muncie M21, Muncie M22, Saginaw 4-speed, TH350, TH400, Powerglide
- Each preset auto-fills gear ratios for all forward gears
- Manual override: individual gear ratio inputs appear below preset

**Right column — Results**:
- RPM-at-speed table: rows = speed (10–80 mph, 5 mph increments), columns = gears
- Cells color-coded by power band zones:
  - Below power band → blue/cool
  - In power band (e.g., 4000–5500) → green
  - Above safe RPM → red
- Final drive ratio and overall ratio displayed above table

**Calculator**: Uses existing `calculateGearRatios()` from `src/data/calculators/gear-ratio.ts`.

**CTA**: "Sign up free to save gear setups to your garage."

---

## Section 2: Corner Weight Calculator

**Layout**: Two columns on desktop, stacked on mobile.

**Left column — Inputs**:
- 2x2 grid of corner weight inputs (LF, RF, LR, RR) in pounds
- Defaults: LF 825, RF 825, LR 575, RR 575 (2800 lb car, 53% front)
- Target cross-weight % input (default 50%)
- "Calculate" button

**Right column — Results**:
- Total weight, front %, left %, cross-weight %
- Visual 2x2 grid showing each corner's weight with color coding:
  - Green = within 5 lbs of ideal
  - Yellow = 5–15 lbs off
  - Red = >15 lbs off
- Jack bolt adjustment recommendations:
  - Which corners to adjust
  - Turn counts (assuming 5 lbs per turn)
  - Direction (raise/lower)

**Calculator**: Uses existing `calculateCornerWeights()` from `src/data/calculators/corner-weight.ts`.

**CTA**: "Sign up free to save corner weight sheets to your garage."

---

## Section 3: Diagnostic Troubleshooter

**Layout**: Single column, decision-tree flow.

**Step 1 — Symptom Selection**:
- Pill/chip buttons for common symptoms:
  - "Pushes in center", "Loose off corner", "Tight on entry", "No forward bite", "Loose on entry", "Burns RR tire", "Car rolls too much", "Vibration at speed"

**Step 2 — Optional Refinement** (appears after symptom selection):
- Follow-up question specific to the symptom (e.g., "Does it get worse as the track dries?" → yes/no)
- Not all symptoms have refinement; some go straight to results

**Step 3 — Fix List**:
- Prioritized list of 3–5 fixes
- Each fix shows:
  - Category badge (Springs, Tires, Alignment, Weight, Shocks)
  - Fix description
  - Difficulty rating (Easy / Medium / Hard)
- Fixes ordered by impact (highest first)
- "Reset" button to start over

**Data**: Static decision tree defined in a TypeScript data file. No API calls.

**CTA**: "Sign up free to log fixes and track what works."

---

## Shared Design Patterns

- Dark theme consistent with app (#0A0A0F background, cyan #00B4FF accent, orange #FF6B00 for warnings)
- Chakra Petch headings, Outfit body text
- All calculations run client-side in real-time (no server calls)
- Responsive: 2-col → 1-col at md breakpoint
- Each section has `id` for anchor navigation from the nav bar
