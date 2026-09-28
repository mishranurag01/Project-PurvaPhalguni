/**
 * Prototype Authentication Service Placeholder
 *
 * Status: NOT CONNECTED TO LIVE BACKEND.
 * In production, this service will communicate with an OAuth / Identity Provider (e.g. Firebase Auth / OpenID Connect).
 * In this prototype, mock authentication is provided for demonstration purposes only.
 */

import { UserProfile, UserRole } from '../../types/practice';
import { PracticeStore } from '../store';

export interface AuthSession {
  user: UserProfile | null;
  isAuthenticated: boolean;
  role: UserRole;
  isPrototypeSession: boolean;
}

export const authService = {
  status: 'Prototype placeholder — not connected to production auth',

  async getCurrentSession(): Promise<AuthSession> {
    const role = PracticeStore.getActiveRole();
    const userId = PracticeStore.getActiveUserId();
    const user = PracticeStore.getUsers().find((u) => u.id === userId) || null;

    return {
      user,
      isAuthenticated: role !== 'public',
      role,
      isPrototypeSession: true
    };
  },

  async signInAsRole(role: UserRole, specificUserId?: string): Promise<AuthSession> {
    PracticeStore.setActiveRole(role);
    const users = PracticeStore.getUsers();
    let user = specificUserId ? users.find((u) => u.id === specificUserId) || null : null;
    if (!user && role !== 'public') {
      user = users.find((u) => u.role === role) || null;
    }

    PracticeStore.logAction(
      user?.id || 'anonymous',
      user?.name || 'Anonymous User',
      role,
      'LOGIN',
      `Demonstration sign-in as ${role} (${user?.name || 'Generic'}).`
    );

    return {
      user,
      isAuthenticated: role !== 'public',
      role,
      isPrototypeSession: true
    };
  },

  async signOut(): Promise<void> {
    PracticeStore.setActiveRole('public');
  }
};
