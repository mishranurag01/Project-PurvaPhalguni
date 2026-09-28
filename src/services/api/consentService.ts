/**
 * Prototype Consent Management Service Placeholder
 *
 * Status: NOT CONNECTED TO PRODUCTION DATABASE.
 * Records informed consent and withdrawal status in memory for the active session.
 */

import { PracticeStore } from '../store';

export interface ConsentRecord {
  clientId: string;
  consentGiven: boolean;
  consentDate: string;
  consentVersion: string;
  withdrawn: boolean;
  withdrawnAt?: string;
}

export const consentService = {
  status: 'Prototype consent store — in-memory only',

  async getConsent(clientId: string): Promise<ConsentRecord | null> {
    const user = PracticeStore.getUsers().find((u) => u.id === clientId);
    if (!user) return null;
    return {
      clientId,
      consentGiven: !!user.consentGiven,
      consentDate: user.consentDate || '',
      consentVersion: user.consentVersion || 'v2.4',
      withdrawn: !!user.consentWithdrawn
    };
  },

  async recordConsent(clientId: string, version = 'v2.4'): Promise<void> {
    const users = PracticeStore.getUsers();
    const updated = users.map((u) =>
      u.id === clientId
        ? {
            ...u,
            consentGiven: true,
            consentDate: new Date().toISOString().split('T')[0],
            consentVersion: version,
            consentWithdrawn: false
          }
        : u
    );
    PracticeStore.saveUsers(updated);
  },

  async withdrawConsent(clientId: string): Promise<void> {
    const users = PracticeStore.getUsers();
    const updated = users.map((u) =>
      u.id === clientId
        ? {
            ...u,
            consentGiven: false,
            consentWithdrawn: true
          }
        : u
    );
    PracticeStore.saveUsers(updated);
  }
};
