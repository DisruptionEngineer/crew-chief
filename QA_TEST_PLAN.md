# Crew Chief QA Test Plan — E2E Use Cases

## Test Environment
- App: Crew Chief PWA (Next.js + Clerk + Dexie/IndexedDB)
- Auth: Clerk (optional bypass when keys missing)
- Storage: IndexedDB (Dexie) + localStorage
- Deployment: Vercel

---

## TC-1: Landing Page & Marketing

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-1.1 | Landing page loads | Navigate to `/` | Hero section, feature cards, CTA buttons visible |
| TC-1.2 | Interactive setup demo | Interact with setup demo on landing | Demo responds to input changes |
| TC-1.3 | CTA → Sign Up | Click "Get Started" / sign-up CTA | Navigates to `/sign-up` |
| TC-1.4 | CTA → Sign In | Click sign-in link | Navigates to `/sign-in` |
| TC-1.5 | Mobile responsive | Resize to mobile viewport | Layout adapts, no overflow |

---

## TC-2: Account Creation (Sign Up)

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-2.1 | Sign-up page renders | Navigate to `/sign-up` | Clerk SignUp component renders with dark theme |
| TC-2.2 | Sign-up form validation | Submit empty form | Validation errors shown |
| TC-2.3 | Sign-up with email | Enter valid email + password | Account created, redirected |
| TC-2.4 | Sign-up with OAuth | Click Google/GitHub OAuth | OAuth flow initiates |
| TC-2.5 | Duplicate email | Sign up with existing email | Error: email already in use |
| TC-2.6 | Weak password | Enter short/weak password | Validation error on password strength |
| TC-2.7 | Clerk not configured fallback | Remove Clerk keys | Fallback message with link to `/dashboard` |

---

## TC-3: Sign In

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-3.1 | Sign-in page renders | Navigate to `/sign-in` | Clerk SignIn component renders |
| TC-3.2 | Valid credentials | Enter valid email + password | Authenticated, redirected to dashboard |
| TC-3.3 | Invalid credentials | Enter wrong password | Error message shown |
| TC-3.4 | Sign-in to sign-up link | Click "Don't have an account?" | Navigates to `/sign-up` |

---

## TC-4: Route Protection (Middleware)

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-4.1 | Protected route unauthenticated | Visit `/dashboard` while signed out | Redirected to `/sign-in` |
| TC-4.2 | Public routes accessible | Visit `/`, `/sign-in`, `/sign-up` | Pages load without redirect |
| TC-4.3 | Auth bypass mode | Clerk keys missing | All routes accessible |

---

## TC-5: Onboarding Wizard

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-5.1 | Redirect to onboarding | Sign in for first time (no onboarding flag) | Redirected to `/onboarding` |
| TC-5.2 | Step 1 - Driver info | Enter display name + experience level | Can proceed to next step |
| TC-5.3 | Step 1 - Validation | Leave name empty, try to proceed | Validation prevents progress |
| TC-5.4 | Step 2 - Car info | Enter year/make/model/weight/class | Can proceed to next step |
| TC-5.5 | Step 2 - Quick select Monte Carlo | Click Monte Carlo 75 preset | Fields auto-populate |
| TC-5.6 | Step 2 - Quick select Crown Vic | Click Crown Vic preset | Fields auto-populate |
| TC-5.7 | Step 3 - Track info | Enter track name/surface/length | Can proceed to confirm |
| TC-5.8 | Step 4 - Confirmation | Review all entered data | All data displayed correctly |
| TC-5.9 | Complete onboarding | Click "Let's Go" on confirmation | Car, Track, UserProfile saved to IndexedDB; localStorage flags set; redirect to `/dashboard` |
| TC-5.10 | Onboarding guard skips | Return to any app page after onboarding | No redirect to onboarding |
| TC-5.11 | Re-onboarding prevention | Visit `/onboarding` after completed | Should still work (allows re-run) |

---

## TC-6: Dashboard

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-6.1 | Dashboard loads | Navigate to `/dashboard` | Dashboard renders with car info |
| TC-6.2 | Car context active | Check car displayed | Current car from onboarding shown |
| TC-6.3 | Quick action links | Click setup/sessions/engine links | Navigate to correct pages |
| TC-6.4 | Schedule display | Check race schedule section | Painesville schedule data shown |

---

## TC-7: Setup Calculator

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-7.1 | Setup page loads | Navigate to `/setup` | Setup recommendations displayed |
| TC-7.2 | Condition selector | Change track condition | Recommendations update |
| TC-7.3 | Race type selector | Change race type | Recommendations update |
| TC-7.4 | Tire pressure steppers | Click +/- on tire pressures | Values increment/decrement |
| TC-7.5 | Car context reflected | Check car name in setup | Current car displayed |
| TC-7.6 | Switch car | Change car in sidebar selector | Setup updates for new car baseline |

---

## TC-8: Engine Build Simulator (Full CRUD)

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-8.1 | Engine page loads | Navigate to `/engine` | Engine builder form renders |
| TC-8.2 | Select engine family | Choose GM SBC 350 | Parts options update for family |
| TC-8.3 | Select division | Choose Ironman F8 | Compliance checking activates |
| TC-8.4 | Configure full build | Select heads/cam/intake/carb/exhaust | All selections reflected |
| TC-8.5 | Run simulation | Click simulate/calculate | Power curve chart + specs displayed |
| TC-8.6 | Compliance pass | Configure legal build | Green compliance badge |
| TC-8.7 | Compliance fail | Exceed cam lift limit | Red violation warnings |
| TC-8.8 | Save build | Enter name + click save | Build saved to IndexedDB |
| TC-8.9 | Open saved builds drawer | Click saved builds button | Drawer opens with saved builds list |
| TC-8.10 | Load saved build | Click a saved build | Form populates with saved config |
| TC-8.11 | Delete saved build | Click delete on a build | Build removed from list and IndexedDB |
| TC-8.12 | Compare two builds | Select 2 builds + compare | Navigate to `/engine/compare` with overlay chart |
| TC-8.13 | Compare page loads | Navigate directly to compare URL | Both builds loaded and compared |
| TC-8.14 | Multiple engine families | Switch between GM/Ford/Mopar | Parts options change correctly |

---

## TC-9: Session Logs

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-9.1 | Sessions list page | Navigate to `/sessions` | Page renders (empty state) |
| TC-9.2 | Empty state display | Check with no sessions | "No sessions" or empty message |
| TC-9.3 | New session form | Navigate to `/sessions/new` | Form renders with all fields |
| TC-9.4 | Fill session form | Enter event type, weather, handling, laps | All fields accept input |
| TC-9.5 | Save session (current: alert) | Click save | Alert fires (stub behavior) |
| TC-9.6 | Session save redirect | After alert | Redirects to `/sessions` |

---

## TC-10: Calculators

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-10.1 | Calculator hub | Navigate to `/calculators` | All calculator links displayed |
| TC-10.2 | Corner weight calc | Enter 4 scale readings | Cross-weight %, left %, rear % calculated |
| TC-10.3 | Corner weight adjustments | Enter target cross-weight | Bolt adjustment instructions shown |
| TC-10.4 | Rim offset calc | Enter backspacing value | Offset computed correctly |
| TC-10.5 | Transmission advisor | Select options | Transmission scored and ranked |
| TC-10.6 | Gear ratio calc | Enter tire size + gear | RPM vs speed chart rendered |

---

## TC-11: Troubleshooter

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-11.1 | Troubleshooter loads | Navigate to `/troubleshoot` | Symptom selection displayed |
| TC-11.2 | Full diagnostic flow | Select symptom → when → conditions | Recommendations displayed |
| TC-11.3 | All symptom paths | Test Pushing/Loose/No Bite/Inconsistent | Each path gives distinct recommendations |

---

## TC-12: Rules & Tech Inspection

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-12.1 | Rules page loads | Navigate to `/rules` | Division tabs displayed |
| TC-12.2 | Division switching | Click each division tab | Rules change per division |
| TC-12.3 | Rule search | Search for "weight" | Matching rules filtered |
| TC-12.4 | Rule expansion | Click a rule category | Rules expand/collapse |
| TC-12.5 | Tech checklist | Toggle checklist items | Checkboxes respond |

---

## TC-13: Navigation & Shell

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-13.1 | Desktop sidebar | View on desktop width | Sidebar with all nav items |
| TC-13.2 | Mobile bottom tabs | View on mobile width | Bottom tab bar displayed |
| TC-13.3 | Car selector (sidebar) | Change car in dropdown | Car context updates app-wide |
| TC-13.4 | All nav links work | Click each nav item | Correct page loads |
| TC-13.5 | User button (Clerk) | Check user avatar/button | Clerk UserButton renders |
| TC-13.6 | Sign out | Click sign out in user menu | Signed out, redirected |

---

## TC-14: PWA Behavior

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-14.1 | Manifest loads | Check manifest.json | Valid PWA manifest |
| TC-14.2 | Add to home screen | Check installability | App installable as PWA |
| TC-14.3 | Standalone display | Open as installed PWA | No browser chrome |

---

## TC-15: Data Persistence (IndexedDB)

| ID | Use Case | Steps | Expected |
|----|----------|-------|----------|
| TC-15.1 | Onboarding data persists | Complete onboarding, refresh page | Data retained |
| TC-15.2 | Engine builds persist | Save build, refresh page | Build appears in saved list |
| TC-15.3 | Car selection persists | Select car, refresh | Same car selected |
| TC-15.4 | Clear storage | Clear IndexedDB | App resets to pre-onboarding state |

---

## Bug Tracking

| Bug ID | Test Case | Description | Severity | Status |
|--------|-----------|-------------|----------|--------|
| (filled during testing) | | | | |
