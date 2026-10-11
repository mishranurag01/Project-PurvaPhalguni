# Contributing Guidelines — PURVAPHALGUNI

Thank you for contributing to the PURVAPHALGUNI codebase. Please adhere to the following standards to ensure consistency, type safety, and architectural integrity.

---

## ✦ Code Organization Standards

1. **Folder Placement**:
   - `src/components/ui/`: Reusable UI primitives with zero domain knowledge (buttons, toasts, modals).
   - `src/components/astrology/`: Reusable astronomical instruments (kundali, dasha charts, planetary matrices).
   - `src/components/public/`: Landing page sections, informational folios, and public reservation wizards.
   - `src/components/client/`: Client-specific portal modules.
   - `src/components/affiliate/`: Practitioner enclave modules.
   - `src/components/admin/`: Director suite administrative tools.
   - `src/services/api/`: Pluggable API service modules.
   - `src/hooks/`: Reusable React hooks.

2. **File Naming Conventions**:
   - **Components**: `PascalCase.tsx` (e.g., `HeroSection.tsx`, `InteractiveKundali.tsx`)
   - **Hooks**: `camelCase.ts` prefixed with `use` (e.g., `usePractice.ts`, `useBookings.ts`)
   - **Services & Utils**: `camelCase.ts` (e.g., `bookingService.ts`, `cryptoAuth.ts`)
   - **Types**: `camelCase.ts` or descriptive nouns (e.g., `practice.ts`, `astrology.ts`)

---

## ✦ TypeScript Discipline

- **Strict Type Checking**: No `any` types in new modules. Use generics, union types, or `unknown` with type guards.
- **Top-Level Imports**: Place standard React hooks first, followed by third-party packages, types, services, and local components.
- **Explicit Interfaces**: All component props must have an explicit interface defined directly above the component.

```typescript
// Good
interface PlanetaryCardProps {
  planet: PlanetName;
  degree: number;
  isRetrograde: boolean;
  onSelect?: (planet: PlanetName) => void;
}

export const PlanetaryCard: React.FC<PlanetaryCardProps> = ({ ... }) => { ... };
```

---

## ✦ Ethical Medical Astrology Guidelines

When writing copy or developing user-facing text:
- **Never claim diagnostic efficacy**: Do not write "Jupiter indicates liver infection" or "Saturn diagnoses bone fractures".
- **Use reflective framing**: Write "Jupiter is symbolically associated with metabolic expansion and hepatic pacing; in contemplative reflection, consider cooling daily rhythms."
- **Prominently maintain the disclaimer**: All health-adjacent views must be labeled with the non-diagnostic notice.

---

## ✦ Verification Checklist Before Committing

- [ ] Run `npm run lint` (`tsc --noEmit`) to verify zero type errors.
- [ ] Run `npm run build` to ensure the Vite production bundle builds cleanly.
- [ ] Ensure all brand instances use **Purva Phalguni** (or **PURVAPHALGUNI** for wordmark headings).
- [ ] Check responsive behavior on mobile (375px), tablet (768px), and desktop (1280px+).
