# PURVAPHALGUNI — Medical Astrology & Cartomancy

> **Where celestial patterns meet the language of health and human experience.**

PURVAPHALGUNI is a specialized, modern digital sanctuary uniting classical sidereal astronomical mechanics (Parashari Jyotish, Lahiri Ayanamsha) with Hermetic symbolic cartomancy into a structured, reflective, non-diagnostic interpretive framework.

---

## ✦ Table of Contents

- [Vision & Architectural Identity](#-vision--architectural-identity)
- [Key Features](#-key-features)
- [Directory & Folder Structure](#-directory--folder-structure)
- [Architecture & State Management](#-architecture--state-management)
- [Ethical Medical Astrology Delineation](#-ethical-medical-astrology-delineation)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Environment Configuration](#-environment-configuration)
- [Design Language](#-design-language)
- [Documentation Index](#-documentation-index)

---

## ✦ Vision & Architectural Identity

PURVAPHALGUNI is purposefully crafted to depart from stereotypical commercial astrology websites:

- **Observatory Aesthetic**: Evokes an ancient astronomical manuscript translated into a contemporary luxury interface.
- **Cinematic Ignition Sequence**: Visitors experience a quiet celestial genesis where a microscopic ember of light expands to reveal the brand identity letter-by-letter (`P → U → R → V → A → P → H → A → L → G → U → N → I`).
- **Tactile Micro-Interactions**: Segmented square tabs, chart house cells, and navigation buttons respond with spring zoom elevation (`scale-105` to `scale-110`).
- **Silky Smooth Navigation**: Anchor redirects and scroll targets navigate with smooth easing curves and viewport awareness.

---

## ✦ Key Features

1. **Sidereal Observatory Instruments**:
   - High-precision calculation of Lagna (Ascendant), Moon (Janma Rasi), planetary dignities, and houses using Lahiri Ayanamsha.
   - Dual-chart rendering: North Indian Diamond Kundali and South Indian Square format with interactive house zoom.
   - 120-year Vimshottari Dasha progression and real-time Gochara transits.

2. **Humoral & Iatromathematical Framework**:
   - Triad analysis: Pitta (transformation/metabolic fire), Vata (nervous transmission/air), and Kapha (structural/cellular stability).
   - Somatic house gateways: 1st (Vitality), 6th (Daily Disciplines), 8th (Somatic Regeneration), and 12th (Restorative Haven).

3. **Hermetic Decanate Cartomancy**:
   - 10° zodiac decanate spreads that act as non-diagnostic mirrors for pacing and subconscious decompression.

4. **Private Multirole Consultation Sanctuaries**:
   - **Client Sanctuary**: View upcoming consultations, birth chart coordinates, and download confidential reading dossiers.
   - **Practitioner Enclave (Affiliate)**: Assigned client caseload, private practitioner notes, honoraria payouts, and shared summaries.
   - **Director Suite (Admin)**: Practice-wide telemetry, fee schedule management, client review moderation, audit logs, and practitioner bulletins.

5. **Confidential Booking Flow**:
   - 9-step guided consultation wizard with interactive square tab progression.

---

## ✦ Directory & Folder Structure

```
├── .env.example              # Environment variables template
├── index.html                # Application entry HTML with Google Fonts
├── metadata.json             # Applet branding and capabilities
├── package.json              # Dependencies and build scripts
├── vite.config.ts            # Vite bundler configuration
│
├── docs/                     # Detailed architectural folios
│   ├── API_SPEC.md           # API endpoints & data contracts
│   └── STATE_MANAGEMENT.md   # State architecture & event bus
│
├── src/
│   ├── config/               # Validated environment & static constants
│   │   ├── env.ts            # Safe environment parser
│   │   └── constants.ts      # Branding, routes, timings, observatory specs
│   │
│   ├── types/                # Strongly typed domain models
│   │   ├── astrology.ts      # Planets, signs, houses, nakshatras, dashas
│   │   ├── practice.ts       # Users, roles, bookings, settings, summaries
│   │   └── api.ts            # Scalable API response wrappers & query params
│   │
│   ├── errors/               # Centralized domain error handling
│   │   ├── AppError.ts       # Custom typed error hierarchy
│   │   └── errorHandler.ts   # Error normalizer and safe logger
│   │
│   ├── context/              # React Context state management
│   │   └── PracticeContext.tsx # Centralized practice provider & hooks
│   │
│   ├── hooks/                # Domain & utility hooks
│   │   ├── usePracticeStore.ts  # Generic store listener
│   │   ├── useAuth.ts           # Authentication & role management
│   │   ├── useBookings.ts       # Booking metrics & filtering
│   │   └── useScrollNavigation.ts# Viewport tracking & smooth scroll
│   │
│   ├── services/             # Business logic & data access
│   │   ├── api/              # Scalable API service layer
│   │   │   ├── apiClient.ts  # Extensible HTTP/mock client with latency
│   │   │   ├── bookingService.ts
│   │   │   ├── authService.ts
│   │   │   └── index.ts
│   │   ├── store.ts          # Central state store with Pub/Sub event bus
│   │   ├── demoData.ts       # Sanitized demonstration seed records
│   │   ├── jhoraService.ts   # Sidereal chart computation engine
│   │   └── astrologyCalculationProvider.ts
│   │
│   ├── utils/                # Pure mathematical & sensory helpers
│   │   ├── cryptoAuth.ts     # Mock PBKDF2/SHA-256 hashing
│   │   ├── soundAmbience.ts  # Web Audio synthesizers (chimes & soft taps)
│   │   ├── vedicCalculations.ts# Canonical Lahiri algorithms
│   │   └── formatters.ts     # Dates, currency, astronomical degrees
│   │
│   └── components/           # Modularized UI component hierarchy
│       ├── ui/               # Reusable primitives (Buttons, Toasts, Orbs)
│       ├── astrology/        # Reusable chart widgets (Kundali, Dasha, Matrix)
│       ├── common/           # Shared guards (ErrorBoundary, RolePreviews)
│       ├── intro/            # Celestial Ignition cinematic sequence
│       ├── public/           # Public observatory landing page & booking
│       ├── client/           # Client portal suite
│       ├── affiliate/        # Practitioner enclave
│       └── admin/            # Director suite & management modals
```

---

## ✦ Architecture & State Management

- **Single Source of Truth**: `PracticeStore` maintains state in memory with event-driven synchronization (`SERVICES_UPDATED`, `SETTINGS_UPDATED`, `BOOKINGS_UPDATED`).
- **Privacy-First Design**: To uphold client privacy during prototype evaluation, NO birth credentials, health inquiries, or notes are stored in insecure `localStorage`.
- **Reactive React Layer**: `PracticeProvider` wraps the entire app, allowing any component to subscribe via `usePractice()` without prop drilling.

---

## ✦ Ethical Medical Astrology Delineation

PURVAPHALGUNI maintains a strict, unambiguous boundary between **medical science** and **astrological interpretation**:

- **Strict Non-Diagnostic Commitment**: Astrology and cartomancy do not diagnose, treat, prevent, or cure any pathology.
- **Language Discipline**: Content is framed exclusively in *symbolic*, *exploratory*, *reflective*, and *contemplative* language.
- **Zero Medical Advice**: The application never replaces certified medical doctors, laboratory testing, or evidence-based treatments.

---

## ✦ Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Launch development observatory on port 3000
npm run dev
```

The application will run locally at `http://localhost:3000`.

---

## ✦ Available Scripts

| Script | Purpose |
| :--- | :--- |
| `npm run dev` | Starts Vite development server at `http://0.0.0.0:3000` |
| `npm run build` | Builds optimized production bundle to `dist/` |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Removes build artifacts |

---

## ✦ Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Floating role switcher panel in bottom corner (true for dev demo, false in production)
VITE_DEMO_MODE=false

# Canonical application URL
APP_URL="https://purvaphalguni.com"

# Optional development seed accounts
VITE_DEFAULT_ADMIN_EMAIL="director@purvaphalguni.com"
VITE_DEFAULT_AFFILIATE_EMAIL="practitioner@purvaphalguni.com"
VITE_DEFAULT_CLIENT_EMAIL="client@purvaphalguni.com"
```

---

## ✦ Design Language

| Element | Specification |
| :--- | :--- |
| **Wordmark Typography** | *Cormorant Garamond* (Light, tracking `0.18em` to `0.35em`) |
| **Interface Typography** | *Plus Jakarta Sans* |
| **Astronomical Code** | Monospace uppercase |
| **Primary Palette** | Soft Ivory (`#FAF8F5`), Deep Charcoal (`#0F172A`) |
| **Celestial Accents** | Antique Gold (`#C59B4B`), Champagne (`#DFBF77`), Deep Burgundy |

---

## ✦ Documentation Index

- [Architecture Reference](./ARCHITECTURE.md)
- [Security & Secrets Policy](./docs/SECURITY.md)
- [API Interface Specification](./docs/API_SPEC.md)
- [State Management & Event Bus](./docs/STATE_MANAGEMENT.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
