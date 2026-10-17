import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserRole, WebsiteSettings, ServicePlan, UserProfile, BookingSession, ReviewItem } from '../types/practice';
import { PracticeStore } from '../services/store';
import { authService } from '../services/api/authService';
import { ToastMessage, ToastContainer } from '../components/ui/Toast';
import { logError } from '../errors/errorHandler';
import { UI_TIMINGS } from '../config/constants';

interface PracticeContextType {
  currentRole: UserRole;
  currentUser: UserProfile | undefined;
  activeUserId: string | null;
  isAuthenticated: boolean;
  currentRoute: string;
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

  // Actions & Routing
  navigateTo: (path: string) => void;
  signIn: (email: string, passwordCandidate: string) => Promise<UserProfile>;
  registerClient: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    birthDate?: string;
    birthTime?: string;
    birthCity?: string;
    primaryIntention?: string;
  }) => Promise<UserProfile>;
  setRole: (role: UserRole) => void;
  setSession: (userId: string | null, role: UserRole) => void;
  signOut: () => void;
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
  const [activeUserId, setActiveUserId] = useState<string | null>(() => PracticeStore.getActiveUserId());
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location?.pathname) {
      const p = window.location.pathname;
      if (p.startsWith('/login')) return '/login';
      if (p.startsWith('/client')) return '/client';
      if (p.startsWith('/affiliate') || p.startsWith('/affiliated')) return '/affiliate';
      if (p.startsWith('/admin')) return '/admin';
      return '/';
    }
    return '/';
  });
  const [publicTab, setPublicTabState] = useState<'home' | 'services' | 'about' | 'booking'>('home');
  const [settings, setSettings] = useState<WebsiteSettings>(() => PracticeStore.getSettings());
  const [services, setServices] = useState<ServicePlan[]>(() => PracticeStore.getServices());
  const [users, setUsers] = useState<UserProfile[]>(() => PracticeStore.getUsers());
  const [reviews, setReviews] = useState<ReviewItem[]>(() => PracticeStore.getReviews());
  const [bookings, setBookings] = useState<BookingSession[]>(() => PracticeStore.getBookings());
  const [preselectedService, setPreselectedService] = useState<ServicePlan | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Browser navigation and URL synchronization
  const navigateTo = useCallback((path: string) => {
    let target = path;
    if (target.startsWith('/affiliated')) target = '/affiliate';

    if (target === '/services' || target === '/about' || target === '/booking') {
      const tab = target.substring(1) as 'services' | 'about' | 'booking';
      setPublicTabState(tab);
      target = '/';
    } else if (target === '/' || target === '') {
      setPublicTabState('home');
      target = '/';
    }

    setCurrentRoute(target);
    if (typeof window !== 'undefined' && window.history?.pushState) {
      const browserUrl = target === '/' ? '/' : target;
      if (window.location.pathname !== browserUrl) {
        window.history.pushState(null, '', browserUrl);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined' && window.location?.pathname) {
        const p = window.location.pathname;
        if (p.startsWith('/login')) setCurrentRoute('/login');
        else if (p.startsWith('/client')) setCurrentRoute('/client');
        else if (p.startsWith('/affiliate') || p.startsWith('/affiliated')) setCurrentRoute('/affiliate');
        else if (p.startsWith('/admin')) setCurrentRoute('/admin');
        else setCurrentRoute('/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync state from PracticeStore event bus
  const refreshState = useCallback(() => {
    try {
      setSettings(PracticeStore.getSettings());
      setServices(PracticeStore.getServices());
      setUsers(PracticeStore.getUsers());
      setReviews(PracticeStore.getReviews());
      setBookings(PracticeStore.getBookings());
      setCurrentRole(PracticeStore.getActiveRole());
      setActiveUserId(PracticeStore.getActiveUserId());
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

  /**
   * Unified Authentication Action:
   * Authenticates with email and password, resolves verified identity & role from backend,
   * establishes session, and redirects to verified destination route.
   */
  const signIn = useCallback(
    async (email: string, passwordCandidate: string): Promise<UserProfile> => {
      const session = await authService.signInWithCredentials(email, passwordCandidate);
      if (!session.user) {
        throw new Error('Authentication succeeded but user identity could not be resolved.');
      }
      PracticeStore.setSession(session.user.id, session.user.role);
      setCurrentRole(session.user.role);
      setActiveUserId(session.user.id);
      showToast({
        type: 'success',
        title: 'Authentication Granted',
        message: `Welcome, ${session.user.name}. Redirecting to your sanctuary portal.`
      });

      // Role-based redirection to existing destination routes
      if (session.user.role === 'client') {
        navigateTo('/client');
      } else if (session.user.role === 'affiliate') {
        navigateTo('/affiliate');
      } else if (session.user.role === 'admin') {
        navigateTo('/admin');
      }

      return session.user;
    },
    [navigateTo, showToast]
  );

  /**
   * Client Self-Registration Action:
   * Creates an account with scrypt password hash, sets session, and routes to /client.
   */
  const registerClient = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      birthDate?: string;
      birthTime?: string;
      birthCity?: string;
      primaryIntention?: string;
    }): Promise<UserProfile> => {
      const session = await authService.registerClient(data);
      if (!session.user) {
        throw new Error('Registration failed.');
      }
      PracticeStore.setSession(session.user.id, 'client');
      setCurrentRole('client');
      setActiveUserId(session.user.id);
      showToast({
        type: 'success',
        title: 'Client Sanctuary Established',
        message: `Welcome to PurvaPhalguni, ${session.user.name}. Entering client portal.`
      });
      navigateTo('/client');
      return session.user;
    },
    [navigateTo, showToast]
  );

  /**
   * Role change:
   * CRITICAL SECURITY PRINCIPLE: Role changes must not establish authentication.
   * If a user was authenticated, changing to an unauthenticated role clears activeUserId.
   */
  const setRole = useCallback(
    (role: UserRole) => {
      PracticeStore.setActiveRole(role);
      setCurrentRole(role);
      setActiveUserId(PracticeStore.getActiveUserId());
      if (role === 'public') navigateTo('/');
      else if (role === 'client') navigateTo('/client');
      else if (role === 'affiliate') navigateTo('/affiliate');
      else if (role === 'admin') navigateTo('/admin');
    },
    [navigateTo]
  );

  /**
   * Explicit Session Establishment:
   * Sets the authenticated session with verified user ID and role.
   */
  const setSession = useCallback(
    (userId: string | null, role: UserRole) => {
      PracticeStore.setSession(userId, role);
      setCurrentRole(role);
      setActiveUserId(userId);
      if (role === 'public') navigateTo('/');
      else if (role === 'client') navigateTo('/client');
      else if (role === 'affiliate') navigateTo('/affiliate');
      else if (role === 'admin') navigateTo('/admin');
    },
    [navigateTo]
  );

  /**
   * Terminate Session:
   * Clears authenticated session and returns to public role.
   */
  const signOut = useCallback(() => {
    authService.signOut();
    PracticeStore.clearSession();
    setCurrentRole('public');
    setActiveUserId(null);
    setPublicTabState('home');
    navigateTo('/');
  }, [navigateTo]);

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

  /**
   * Identity-Based User Resolution:
   * Resolves currentUser strictly using the authenticated session's unique user ID.
   * Never infers or falls back based on role (users[0], users[1], etc.).
   * Fails closed (returns undefined) if:
   * - Session is missing (activeUserId is null or role is 'public')
   * - activeUserId is not found in users list (missing user)
   * - User's role does not match currentRole (inconsistent session / cross-role attempt)
   * - User's account is deactivated or suspended (permission/status check)
   */
  const currentUser = React.useMemo(() => {
    if (currentRole === 'public' || !activeUserId) {
      return undefined;
    }

    const matchedUser = users.find((u) => u.id === activeUserId);
    if (!matchedUser) {
      // Missing user: NEVER silently fallback to another user with the same role
      return undefined;
    }

    if (matchedUser.role !== currentRole) {
      // Inconsistent session: user role mismatch
      return undefined;
    }

    if (matchedUser.activeStatus === 'deactivated' || matchedUser.activeStatus === 'suspended') {
      // Account suspended or deactivated
      return undefined;
    }

    return matchedUser;
  }, [currentRole, activeUserId, users]);

  const isAuthenticated = Boolean(currentUser && currentRole !== 'public');

  const activeServices = React.useMemo(() => {
    return services.filter((s) => s.isActive);
  }, [services]);

  const value: PracticeContextType = {
    currentRole,
    currentUser,
    activeUserId,
    isAuthenticated,
    currentRoute,
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
    navigateTo,
    signIn,
    registerClient,
    setRole,
    setSession,
    signOut,
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
