/**
 * Prototype Client Profile Service Placeholder
 *
 * Status: NOT CONNECTED TO LIVE BACKEND.
 * Manages client birth details, consultation intentions, and intake information in memory.
 */

import { UserProfile } from '../../types/practice';
import { PracticeStore } from '../store';

export const clientProfileService = {
  status: 'Prototype placeholder — in-memory records only',

  async getProfile(clientId: string): Promise<UserProfile | null> {
    const users = PracticeStore.getUsers();
    return users.find((u) => u.id === clientId && u.role === 'client') || null;
  },

  async updateProfile(clientId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const users = PracticeStore.getUsers();
    let updated: UserProfile | null = null;
    const newList = users.map((u) => {
      if (u.id === clientId) {
        updated = { ...u, ...profileData };
        return updated;
      }
      return u;
    });
    PracticeStore.saveUsers(newList);
    if (!updated) throw new Error('Client profile not found');
    return updated;
  }
};

export const clientService = clientProfileService;
