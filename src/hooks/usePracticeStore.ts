import { useState, useEffect, useCallback } from 'react';
import { PracticeStore, StoreEventType, StoreSyncEvent } from '../services/store';
import { ServicePlan } from '../types/practice';

/**
 * Reusable React Hook: Automatically subscribes to PracticeStore services configuration.
 * Whenever an Admin alters service pricing, duration, or active status,
 * any component using this hook re-renders automatically with the fresh data.
 */
export function usePracticeServices(): {
  services: ServicePlan[];
  activeServices: ServicePlan[];
  lastUpdated: number;
  refresh: () => void;
} {
  const [services, setServices] = useState<ServicePlan[]>(() => PracticeStore.getServices());
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  const refresh = useCallback(() => {
    setServices(PracticeStore.getServices());
    setLastUpdated(Date.now());
  }, []);

  useEffect(() => {
    // Sync initial state
    setServices(PracticeStore.getServices());

    // Register event listener specifically for SERVICES_UPDATED
    const unsubscribe = PracticeStore.addEventListener('SERVICES_UPDATED', (e: StoreSyncEvent) => {
      setServices(PracticeStore.getServices());
      setLastUpdated(e.timestamp);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const activeServices = services.filter((s) => s.isActive);

  return { services, activeServices, lastUpdated, refresh };
}

/**
 * Generic Hook: Subscribe to any PracticeStore event type or list of event types.
 */
export function usePracticeStoreListener(
  eventTypes: StoreEventType | StoreEventType[],
  onEvent: (event: StoreSyncEvent) => void
): void {
  useEffect(() => {
    const types = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
    const unsubs = types.map((type) => PracticeStore.addEventListener(type, onEvent));
    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [eventTypes, onEvent]);
}
