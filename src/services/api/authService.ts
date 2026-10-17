/**
 * Authentication Service
 *
 * Status: NOT CONNECTED TO LIVE PRODUCTION IDENTITY PROVIDER.
 * In production, this service must communicate with an external Identity Provider (e.g. Firebase Auth / OpenID Connect / OAuth).
 * Production authentication is NOT complete until a real identity provider or secure backend authentication flow is integrated.
 * In non-production development environments, demo authentication is only available when explicitly enabled.
 */

import { UserProfile, UserRole } from '../../types/practice';
import { PracticeStore } from '../store';
import { isDemoModeEnabled, getDemoCredentials, isProductionEnvironment } from '../../utils/cryptoAuth';

export interface AuthSession {
  user: UserProfile | null;
  isAuthenticated: boolean;
  role: UserRole;
  isPrototypeSession: boolean;
}

export const authService = {
  status: 'In-development authentication service — requires real identity provider for production',

  async getCurrentSession(): Promise<AuthSession> {
    const role = PracticeStore.getActiveRole();
    const user = PracticeStore.getCurrentUser() || null;

    return {
      user,
      isAuthenticated: role !== 'public' && user !== null,
      role,
      isPrototypeSession: true
    };
  },

  /**
   * Authenticate with email and password credentials through the unified login portal.
   * Resolves user identity and verified role from the backend / store.
   * Fails closed on invalid credentials, suspended accounts, or crypto failure.
   * In production, strictly requires a configured Identity Provider or secure backend endpoint.
   */
  async signInWithCredentials(
    email: string,
    passwordCandidate: string,
    expectedRole?: UserRole
  ): Promise<AuthSession> {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (passwordCandidate || '').trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Email and password are required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) && !(isDemoModeEnabled() && ['admin', 'affiliate', 'client'].includes(cleanEmail))) {
      throw new Error('Please enter a valid email address.');
    }

    if (isProductionEnvironment()) {
      throw new Error(
        'Production authentication rejected: Identity Provider or backend authentication service is not configured. Production deployment requires integration with a trusted identity provider (such as Firebase Authentication or OpenID Connect / OAuth) or a secure backend API endpoint. Local credential evaluation is prohibited in production.'
      );
    }

    const result = await PracticeStore.authenticateUser(cleanEmail, cleanPassword, expectedRole);
    if (!result.success || !result.user) {
      throw new Error(result.error || 'Authentication rejected: Invalid credentials.');
    }

    PracticeStore.setSession(result.user.id, result.user.role);
    PracticeStore.logAction(
      result.user.id,
      result.user.name,
      result.user.role,
      'LOGIN',
      `Authenticated session for ${result.user.email} (${result.user.role}).`
    );

    return {
      user: result.user,
      isAuthenticated: true,
      role: result.user.role,
      isPrototypeSession: true
    };
  },

  /**
   * Secure Client Self-Registration.
   * Registers a client with scrypt password hashing and immediately establishes authenticated session.
   */
  async registerClient(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    birthDate?: string;
    birthTime?: string;
    birthCity?: string;
    primaryIntention?: string;
  }): Promise<AuthSession> {
    if (isProductionEnvironment()) {
      throw new Error(
        'Production registration rejected: Backend Identity Provider is not configured.'
      );
    }

    const result = await PracticeStore.registerClient(data);
    if (!result.success || !result.user) {
      throw new Error(result.error || 'Client registration failed.');
    }

    PracticeStore.setSession(result.user.id, 'client');
    return {
      user: result.user,
      isAuthenticated: true,
      role: 'client',
      isPrototypeSession: true
    };
  },

  /**
   * Direct role switching simulator.
   * STRICTLY RESTRICTED TO NON-PRODUCTION DEMO ENVIRONMENTS.
   * In production, this method throws and fails closed.
   */
  async signInAsRole(role: UserRole, specificUserId?: string): Promise<AuthSession> {
    if (!isDemoModeEnabled()) {
      throw new Error(
        'Authentication bypass rejected: Direct role-based sign-in is disabled in production. Valid credentials are required.'
      );
    }

    if (role === 'public') {
      await this.signOut();
      return {
        user: null,
        isAuthenticated: false,
        role: 'public',
        isPrototypeSession: true
      };
    }

    const demoCreds = getDemoCredentials();
    if (!demoCreds) {
      throw new Error('Demo credentials unavailable.');
    }

    const cred = role === 'admin' ? demoCreds.admin : role === 'affiliate' ? demoCreds.affiliate : demoCreds.client;
    // Authenticate through real credential verification rather than bypassing
    const authResult = await PracticeStore.authenticateUser(cred.email, cred.password, role);
    if (!authResult.success || !authResult.user) {
      throw new Error('Demo authentication failed closed.');
    }

    let finalUser = authResult.user;
    if (specificUserId) {
      const specific = PracticeStore.getUsers().find((u) => u.id === specificUserId && u.role === role);
      if (specific) finalUser = specific;
    }

    PracticeStore.setSession(finalUser.id, role);
    PracticeStore.logAction(
      finalUser.id,
      finalUser.name,
      role,
      'LOGIN',
      `Demonstration sign-in as ${role} (${finalUser.name}).`
    );

    return {
      user: finalUser,
      isAuthenticated: true,
      role,
      isPrototypeSession: true
    };
  },

  async signOut(): Promise<void> {
    PracticeStore.clearSession();
  }
};

