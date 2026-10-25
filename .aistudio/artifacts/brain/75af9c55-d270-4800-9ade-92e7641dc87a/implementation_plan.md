# Glow Up Lab — Visual Redesign & Aesthetic Evolution

This plan updates **Glow Up Lab** to align with the three reference boards provided, transforming the interface with a warm cream and stone canvas, vibrant orchid pink surfaces, deep plum high-contrast cards, bold geometric sans-serif typography, oversized numeric readouts, and interactive sparkline bento cards—while preserving every functional workout, exercise, planning, measurement, and Firebase feature.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions were confirmed from your inspiration boards:

- **Color Palette & Surface Contrast**: Warm cream/stone background (`#EFECE6` / `#FAF8F5`) paired with crisp off-white cards (`#FCFBF9`), vibrant orchid/bubblegum pink accents (`#F8A5F8` / `#F472B6`), soft lilac surfaces (`#F3E3F5`), and deep plum (`#3B0726` / `#2E051E`) & jet black (`#141414`) high-contrast cards and segmented controls.
- **Typography & Oversized Readouts**: Replace all serif headings with clean, modern geometric sans-serif typography (`Plus Jakarta Sans` & `Outfit`) featuring tight tracking, bold display headers, and oversized tabular numeric readouts (`text-4xl` to `text-5xl` in deep plum `#3B0726`) divided by delicate orchid hairlines.
- **Bento Cards, Dark Plum Summaries & Sparkline Charts**: Integrate dark plum summary cards (inspired by the "Transaction Successful" card in Image 2), sleek black pill segmented toggles (`bg-[#141414]` with white active indicator), circular arrow action buttons (`border border-current rounded-full`), and smooth SVG sparkline trend curves (inspired by Image 3) across Home, Active Workout, Progression, and Measurements.

---

### 1. Overview & Core Concept

- **What It Does**: Elevates the entire **Glow Up Lab** UI to match the contemporary editorial-fintech & lifestyle aesthetic of the 3 reference images while keeping all gym ergonomics, Firebase persistence, PWA installability, and workout intelligence intact.
- **Key Value**: Combines the visual sophistication of modern design studios (oversized numbers, deep plum/orchid contrast, tactile pill toggles, and soft cream surfaces) with effortless one-handed gym logging.

---

### 2. User Experience & Visual Design

#### Visual Identity & Color Tokens
- **Dominant Canvas (60%)**: Warm Cream & Alabaster (`#F4F1EA` outer canvas, `#FCFBF9` primary card surface, `#F2EFE9` recessed inner wells).
- **Structural & High-Contrast Surfaces (30%)**:
  - **Deep Plum Card (`#3B0726`)**: Used for hero workout status, active rest timer, and milestone celebration cards with soft cream text (`#FCFBF9`) and orchid pink action buttons.
  - **Soft Lilac & Pastel Orchid (`#F3E3F5` / `#FCE7F9`)**: Used for affirmation banners and category bento cards.
  - **Jet Black Pill Controls (`#141414`)**: Used for primary segmented switches (e.g., `Routines | Historique`) and primary CTAs with crisp white pill indicators.
- **Accent Budget (10%)**: Vibrant Orchid Pink (`#F687EA` / `#EC4899`) for primary interactive highlights, quick-select percentage/weight pills, sparkline curves with glowing endpoints, and progress bars.

#### Typography & Numeric Hierarchy
- **Display & Headings**: `Outfit` / `Plus Jakarta Sans` in Medium/SemiBold (`font-semibold tracking-tight`), replacing all serif fonts.
- **Oversized Numeric Readouts**: Weight inputs, total volume lifted, PR weights, rest countdowns, and body measurements rendered in large `tabular-nums` (`text-3xl` to `text-5xl font-medium text-[#3B0726]`) with thin pink horizontal dividers (`border-[#F5B8EE]`).

#### Component Transformations Across Views
1. **Top Header & Navigation**:
   - Pill-shaped header brand lockup (circular lilac icon + `Glow Up Lab` pill badge) and right-aligned pill action buttons + circular icon buttons, directly inspired by Image 1.
   - Bottom navigation bar styled as a floating or crisp cream dock with black/orchid active states and smooth transitions.
2. **Accueil (Home)**:
   - Editorial hero greeting + soft lilac bento card (`#F3E3F5`) for the daily English affirmation (`✨ ... ✨`).
   - 3 single-line muscle group bento cards (`🍑 Bas du corps`, `🦋 Dos`, `💪🏻 Bras`) with circular arrow affordances (`→`).
   - 2 prominent tracking cards (`🏋🏼‍♀️ Séance` in Deep Plum `#3B0726` and `👙 Mensurations` with a live SVG sparkline curve).
   - Recessed cream container (`#F2EFE9`) for the 7-day weekly schedule with quick status pills and one-tap launch.
3. **Mode Séance Active (Live Gym Mode)**:
   - Styled after the "Request Withdrawal" card in Image 2: crisp `#FCFBF9` card framed by an orchid glow, oversized numeric readouts for target/actual weight (`kg`) and reps, quick-adjust weight pills (`-2.5kg`, `+2.5kg`, `+5kg`, `Max`), and a Deep Plum (`#3B0726`) rest timer & completion card with geometric decorative rings.
4. **Progression & Mensurations**:
   - Bento stat cards with smooth SVG sparkline curves and `+Δ%` badges (inspired by Image 3's "Task analytics" and "Completed Tasks" cards).
   - High-contrast black segmented switcher and oversized tabular PR readouts.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Preservation of Features & Firebase Architecture**
  - *Chosen Approach*: All existing Firestore collections, authentication flows, exercise catalog, Leg Press foot placement guide, workout generator, audio rest timer, and JSON/CSV export remain 100% functional; changes focus strictly on the design system, component layouts, and visual presentation.
  - *Why*: Ensures zero regression in data integrity or gym functionality while delivering the exact visual aesthetic requested.
- **Decision 2: Native SVG Sparklines & Geometric Motifs**
  - *Chosen Approach*: Build lightweight, responsive SVG sparkline curves with gradient fills and active dot indicators, plus the overlapping geometric circle/crescent motif (`◯☽☽☽`) from Image 2 on completion and summary cards.
  - *Why*: Zero external chart bundle overhead, instant rendering, and faithful reproduction of the inspiration boards.

---

### 4. Technical Architecture & Component Mapping

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   Glow Up Lab — Visual Design System                     │
│  Canvas: #F4F1EA · Surface: #FCFBF9 · Recessed: #F2EFE9                  │
│  Deep Plum: #3B0726 · Orchid Pink: #F687EA · Lilac: #F3E3F5 · Ink: #141414│
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
       ┌─────────────────────────────┼─────────────────────────────┐
       ▼                             ▼                             ▼
┌─────────────────────┐   ┌───────────────────────┐   ┌────────────────────┐
│  Editorial Header   │   │  Bento & Sparklines   │   │  Aztec-Style Forms │
│  & Pill Navigation  │   │  (Home & Progress)    │   │  (Active Workout)  │
│  - Lilac emblem     │   │  - Deep Plum hero card│   │  - Oversized nums  │
│  - Pill tag lockup  │   │  - SVG sparkline curve│   │  - Quick step pills│
│  - Black pill tabs  │   │  - Circular arrows →  │   │  - Plum timer card │
└─────────────────────┘   └───────────────────────┘   └────────────────────┘
```
