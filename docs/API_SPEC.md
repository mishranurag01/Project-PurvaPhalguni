# API Specification & Data Contracts — PURVAPHALGUNI

This document outlines the service contracts, request/response models, and error structures utilized across the PURVAPHALGUNI application layer (`src/services/api/`).

---

## ✦ Standard Response Envelope

All API endpoints return responses encapsulated in the standard `ApiResponse<T>` envelope:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: number;
}
```

In the event of an error:

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: number;
}
```

---

## ✦ Core Service Interfaces

### 1. Booking Service (`bookingService.ts`)

#### `listBookings(userRole: string, userId: string): Promise<BookingSession[]>`
Retrieves bookings scoped to the requesting role:
- `admin`: All platform bookings.
- `affiliate`: Bookings assigned to `userId`.
- `client`: Bookings booked by `userId`.

#### `createBooking(booking: BookingSession): Promise<BookingSession>`
Validates required client parameters (`serviceId`, `clientName`, `clientEmail`), persists the session, and triggers an audit log event.

#### `updateBookingStatus(bookingId: string, status: BookingStatus): Promise<BookingSession | null>`
Transitions session status (`confirmed`, `completed`, `cancelled`).

---

### 2. Authentication Service (`authService.ts`)

#### `getCurrentSession(): Promise<AuthSession>`
Returns the active authenticated principal, associated user profile, and permission tier.

#### `signInAsRole(role: UserRole, specificUserId?: string): Promise<AuthSession>`
Demonstration role switch for prototype evaluation.

#### `signOut(): Promise<void>`
Clears current active credentials and reverts the session to `public`.

---

### 3. Chart Calculation Service (`chartService.ts`)

#### `calculateChart(birthDetails: BirthCoordinates): Promise<ChartCalculationResult>`
Executes sidereal calculation pipeline:
- Input: Date, Time, Latitude, Longitude, Ayanamsha (Default: Lahiri).
- Output: Ascendant, 9 Planetary Positions, Nakshatras, Pada, Dignities, and Vimshottari Dasha periods.

---

### 4. Practice Settings Service (`practiceSettingsService`)

#### `getSettings(): Promise<WebsiteSettings>`
Fetches brand metadata, hourly fee schedules, and required legal disclaimers.

#### `updateSettings(updates: Partial<WebsiteSettings>): Promise<WebsiteSettings>`
Restricted to Director Suite (`admin` role). Emits `SETTINGS_UPDATED` event to all active subscribers.

---

## ✦ Error Codes

| Error Code | HTTP Equivalent | Description |
| :--- | :--- | :--- |
| `VALIDATION_ERROR` | 400 | Required fields omitted or coordinates out of valid range |
| `AUTHENTICATION_REQUIRED`| 401 | Operation attempted without valid identity |
| `PERMISSION_DENIED` | 403 | Role lacks required authorization tier |
| `RESOURCE_NOT_FOUND` | 404 | Booking, client, or monograph folio not found |
| `NETWORK_UNAVAILABLE` | 503 | Server disconnected or timeout exceeded |
