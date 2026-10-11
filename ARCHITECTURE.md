# Architecture Documentation — PURVAPHALGUNI

This document details the architectural principles, data flow, design patterns, and domain constraints governing the PURVAPHALGUNI application.

---

## ✦ Architectural Principles

### 1. Separation of Concerns (SoC)

The codebase strictly decouples:
- **Presentation Layer (`src/components/`)**: Pure UI rendering, motion orchestration, and user interaction capture.
- **State & Context (`src/context/`, `src/hooks/`)**: Reactive subscriptions, role switching, notification queues, and action dispatchers.
- **Business Logic & Computation (`src/utils/`, `src/services/`)**: Pure mathematical Ephemeris calculations, humor modeling, and dasha time progressions.
- **Data Access & API Layer (`src/services/api/`)**: Abstracted request execution, query parametrization, and error normalization.
- **Configuration & Environment (`src/config/`)**: Static constants, route definitions, and validated environment variables.

### 2. Privacy-First Data Architecture

Because this platform models sensitive client information (exact birth dates, times, geographic coordinates, somatic concerns, and private practitioner session reflections):
- **Zero LocalStorage Leakage**: Client birth details and session notes are never stored in browser `localStorage`.
- **Ephemeral Session Model**: Prototype state runs in protected in-memory stores (`PracticeStore.memoryStore`) that cleanly refresh on session termination.
- **Strict Role-Based Access Control (RBAC)**:
  - `public`: Accesses landing page, educational folios, and booking wizard.
  - `client`: Restricted exclusively to their own bookings and released summaries.
  - `affiliate`: Restricted to assigned clients only; cannot view clients assigned to other practitioners. Private notes written by an affiliate are never visible to clients.
  - `admin`: Has practice oversight, billing audit trails, and platform configurations.

---

## ✦ System Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Root                        │
│             (ErrorBoundary + PracticeProvider)              │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  Public Web  │       │ Client Portal│       │ Practitioner │
│  Sanctuary   │       │   Enclave    │       │  & Admin     │
└──────┬───────┘       └──────┬───────┘       └──────┬───────┘
       │                      │                      │
       └──────────────────────┼──────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│             Domain Hooks & Context Abstraction             │
│    usePractice() · useAuth() · useBookings() · useScroll()  │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Scalable API Client Layer                   │
│        apiClient.executeMock() / apiClient.request()        │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            PracticeStore (In-Memory Pub/Sub)                │
│       addEventListener() · logAction() · notify()           │
└─────────────────────────────────────────────────────────────┘
```

---

## ✦ Astronomical Computation Pipeline

Calculations in `src/utils/vedicCalculations.ts` follow classical Parashari Jyotish guidelines:

1. **Ayanamsha Correction**:
   - The tropical zodiac coordinates are converted into the fixed sidereal zodiac using the **Lahiri (Chitra Paksha) Ayanamsha** (~24° offset).
2. **Ascendant & House Cusps (Bhavas)**:
   - Houses are projected according to the Whole Sign (Rasi-as-House) system standard in classical Vedic astrology.
3. **Planetary Dignities**:
   - Dignities are derived using canonical exaltation (*Ucha*), debilitation (*Neecha*), own sign (*Swakshetra*), and moolatrikona tables.
4. **Vimshottari Dasha Allocation**:
   - The 120-year planetary progression sequence (Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury) is calculated based on the exact Pada degree of the natal Moon.

---

## ✦ Error Handling Strategy

1. **Hierarchical Error Classes (`src/errors/AppError.ts`)**:
   - `ValidationError` (HTTP 400 equivalent)
   - `AuthenticationError` (HTTP 401 equivalent)
   - `AuthorizationError` (HTTP 403 equivalent)
   - `NotFoundError` (HTTP 404 equivalent)
   - `NetworkError` (HTTP 503 equivalent)

2. **Error Normalization (`src/errors/errorHandler.ts`)**:
   - Any unknown exception caught in a try/catch block is safely normalized into a `UserFacingError` object containing user-friendly messaging and a retry flag.

3. **Multi-Level Error Boundaries**:
   - The global `ErrorBoundary` catches unexpected fatal render errors.
   - Child components receive fallback states without unmounting the entire application.

---

## ✦ Motion & Micro-Interaction Constitution

1. **Zero-Pill Discipline & Instrument Metaphor**:
   - Buttons, controls, and selectors resemble components of a precision scientific optical instrument rather than casual SaaS pill shapes.
2. **Spring Zoom Elevation**:
   - All square navigation tabs and chart boxes use subtle, physically plausible spring zoom transitions (`transform: scale(1.05)` with `cubic-bezier(0.34, 1.56, 0.64, 1)`).
3. **Accessibility**:
   - Users with `prefers-reduced-motion` have all ambient canvas rotations, cinematic ignition sequences, and auto-zooms disabled gracefully.
