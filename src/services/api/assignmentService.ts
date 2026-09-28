/**
 * Prototype Client-Affiliate Assignment Service Placeholder
 *
 * Status: NOT CONNECTED TO LIVE BACKEND.
 * Enforces role access boundaries: Affiliates can only access clients assigned to them.
 */

import { UserProfile } from '../../types/practice';
import { PracticeStore } from '../store';

export const assignmentService = {
  status: 'Prototype placeholder — in-memory assignments only',

  async getAssignedClients(affiliateId: string): Promise<UserProfile[]> {
    const users = PracticeStore.getUsers();
    return users.filter((u) => u.role === 'client' && u.assignedAffiliateId === affiliateId);
  },

  async assignClientToAffiliate(clientId: string, affiliateId: string): Promise<void> {
    const users = PracticeStore.getUsers();
    const updated = users.map((u) => (u.id === clientId ? { ...u, assignedAffiliateId: affiliateId } : u));
    PracticeStore.saveUsers(updated);
  }
};
