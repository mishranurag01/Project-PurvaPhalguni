# State Management & Pub/Sub Architecture — PURVAPHALGUNI

This document details how reactive state flows across the PURVAPHALGUNI application.

---

## ✦ Dual-Tier State Architecture

PURVAPHALGUNI combines a lightweight, decoupled **In-Memory Store with Event Bus** with a **React Context Layer**:

```
┌───────────────────────────────────────────────┐
│       Tier 1: In-Memory Store & Event Bus      │
│               (PracticeStore)                 │
│  - Independent of React render lifecycle      │
│  - Emits granular events (e.g. SETTINGS_UPD)  │
│  - Provides synchronous load/save methods     │
└───────────────────────┬───────────────────────┘
                        │ Subscribes & Dispatches
                        ▼
┌───────────────────────────────────────────────┐
│         Tier 2: React Context Layer           │
│             (PracticeProvider)                │
│  - React state hooks (useState, useCallback)   │
│  - Toast notification queue                   │
│  - Memoized active user & service selectors   │
│  - Smooth window scroll triggers              │
└───────────────────────┬───────────────────────┘
                        │ usePractice()
                        ▼
┌───────────────────────────────────────────────┐
│              UI Consumer Layer                │
│  Header · Hero · Wizard · Portals · Modals    │
└───────────────────────────────────────────────┘
```

---

## ✦ Event Bus Specification

`PracticeStore` includes a lightweight, typed Pub/Sub event dispatcher:

```typescript
type StoreEventType =
  | 'SERVICES_UPDATED'
  | 'SETTINGS_UPDATED'
  | 'USERS_UPDATED'
  | 'BOOKINGS_UPDATED'
  | 'SUMMARIES_UPDATED'
  | 'MESSAGES_UPDATED'
  | 'BULLETINS_UPDATED'
  | 'PAYOUTS_UPDATED'
  | 'AFFILIATE_STATUS_CHANGED'
  | 'STORE_RESET'
  | '*';
```

### Event Subscription Example

```typescript
// Subscribing to specific event
const unsubscribe = PracticeStore.addEventListener('SERVICES_UPDATED', (event) => {
  console.log('Services updated at', event.timestamp);
});

// Clean up on component unmount
unsubscribe();
```

---

## ✦ React Context Hook (`usePractice`)

Any component within `<PracticeProvider>` accesses state via `usePractice()`:

```tsx
import { usePractice } from '../context/PracticeContext';

export function ServicesView() {
  const { services, activeServices, selectServiceForBooking } = usePractice();

  return (
    <div>
      {activeServices.map(service => (
        <button key={service.id} onClick={() => selectServiceForBooking(service)}>
          {service.name}
        </button>
      ))}
    </div>
  );
}
```

---

## ✦ Benefits of This Architecture

1. **Eliminates Prop Drilling**: Deeply nested components (such as wizard steps and portal tabs) access state directly without passing dozens of callbacks.
2. **Predictable Data Updates**: Mutations go through documented methods (`updateSettings`, `addBooking`, `selectServiceForBooking`) which automatically dispatch events and trigger user-friendly feedback toasts.
3. **Zero Insecure Persistence**: Sensitive birth chart inquiries stay strictly in memory and are never written to unencrypted web storage.
