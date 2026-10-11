import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserRole, WebsiteSettings, ServicePlan, UserProfile, BookingSession, ReviewItem } from '../types/practice';
import { PracticeStore } from '../services/store';
import { ToastMessage, ToastContainer } from '../components/ui/Toast';
import { logError } from '../errors/errorHandler';
import { UI_TIMINGS } from '../config/constants';

interface PracticeContextType {
  currentRole: UserRole;
  currentUser: UserProfile | undefined;
  publicTab: 'home' | 'services' | 'about' | 'booking';
  settings: WebsiteSettings;
  services: ServicePlan[];
  activeServices: ServicePlan[];
  users: UserProfile[];
  reviews: ReviewItem[];
  bookings: BookingSession[];
  preselectedService: ServicePlan | null;
  reducedMotion: boolean;
  toasts: ToastMessage[];

  // Actions
  setRole: (role: UserRole) => void;
  setPublicTab: (tab: 'home' | 'services' | 'about' | 'booking') => void;
  selectServiceForBooking: (service: ServicePlan) => void;
  clearPreselectedService: () => void;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => void;
  addBooking: (booking: BookingSession) => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
  refreshState: () => void;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

export const PracticeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => PracticeStore.getActiveRole());
  const [publicTab, setPublicTabState] = useState<'home' | 'services' | 'about' | 'booking'>('home');
  const [settings, setSettings] = useState<WebsiteSettings>(() => PracticeStore.getSettings());
  const [services, setServices] = useState<ServicePlan[]>(() => PracticeStore.getServices());
  const [users, setUsers] = useState<UserProfile[]>(() => PracticeStore.getUsers());
  const [reviews, setReviews] = useState<ReviewItem[]>(() => PracticeStore.getReviews());
  const [bookings, setBookings] = useState<BookingSession[]>(() => PracticeStore.getBookings());
  const [preselectedService, setPreselectedService] = useState<ServicePlan | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state from PracticeStore event bus
  const refreshState = useCallback(() => {
    try {
      setSettings(PracticeStore.getSettings());
      setServices(PracticeStore.getServices());
      setUsers(PracticeStore.getUsers());
      setReviews(PracticeStore.getReviews());
      setBookings(PracticeStore.getBookings());
    } catch (err) {
      logError(err, 'PracticeProvider.refreshState');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setReducedMotion(true);
      }
    }

    const unsubscribe = PracticeStore.subscribe(() => {
      refreshState();
    });

    return () => unsubscribe();
  }, [refreshState]);

  // Toast dispatchers
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      dismissToast(id);
    }, UI_TIMINGS.NOTIFICATION_AUTO_DISMISS_MS);
  }, [dismissToast]);

  const setRole = useCallback((role: UserRole) => {
    PracticeStore.setActiveRole(role);
    setCurrentRole(role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setPublicTab = useCallback((tab: 'home' | 'services' | 'about' | 'booking') => {
    setPublicTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectServiceForBooking = useCallback((service: ServicePlan) => {
    setPreselectedService(service);
    setPublicTabState('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearPreselectedService = useCallback(() => {
    setPreselectedService(null);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<WebsiteSettings>) => {
    try {
      const current = PracticeStore.getSettings();
      const updated = { ...current, ...newSettings };
      PracticeStore.saveSettings(updated);
      setSettings(updated);
      showToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Sanctuary configurations have been securely synchronized.'
      });
    } catch (err) {
      logError(err, 'updateSettings');
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not record settings updates.'
      });
    }
  }, [showToast]);

  const addBooking = useCallback((booking: BookingSession) => {
    try {
      const current = PracticeStore.getBookings();
      const updated = [booking, ...current];
      PracticeStore.saveBookings(updated);
      setBookings(updated);
      showToast({
        type: 'success',
        title: 'Consultation Confirmed',
        message: `Reserved ${booking.serviceName} with ${booking.affiliateName}.`
      });
    } catch (err) {
      logError(err, 'addBooking');
      showToast({
        type: 'error',
        title: 'Booking Failure',
        message: 'Could not schedule consultation.'
      });
    }
  }, [showToast]);

  // Derived active user based on role
  const currentUser = React.useMemo(() => {
    if (currentRole === 'admin') return users.find((u) => u.role === 'admin') || users[0];
    if (currentRole === 'affiliate') return users.find((u) => u.role === 'affiliate') || users[1];
    if (currentRole === 'client') return users.find((u) => u.role === 'client') || users[3];
    return undefined;
  }, [currentRole, users]);

  const activeServices = React.useMemo(() => {
    return services.filter((s) => s.isActive);
  }, [services]);

  const value: PracticeContextType = {
    currentRole,
    currentUser,
    publicTab,
    settings,
    services,
    activeServices,
    users,
    reviews,
    bookings,
    preselectedService,
    reducedMotion,
    toasts,
    setRole,
    setPublicTab,
    selectServiceForBooking,
    clearPreselectedService,
    updateSettings,
    addBooking,
    showToast,
    dismissToast,
    refreshState
  };

  return (
    <PracticeContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </PracticeContext.Provider>
  );
};

export const usePractice = (): PracticeContextType => {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
};
