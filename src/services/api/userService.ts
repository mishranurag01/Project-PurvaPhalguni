/**
 * Prototype User & Role Management Service Placeholder
 *
 * Status: NOT CONNECTED TO LIVE BACKEND.
 * Manages user accounts and role allocations in memory for the prototype.
 */

import { UserProfile, UserRole } from '../../types/practice';
import { PracticeStore } from '../store';

export const userService = {
  status: 'Prototype placeholder — in-memory records only',

  async listUsers(filterRole?: UserRole): Promise<UserProfile[]> {
    const all = PracticeStore.getUsers();
    if (filterRole) {
      return all.filter((u) => u.role === filterRole);
    }
    return all;
  },

  async getUserById(id: string): Promise<UserProfile | null> {
    const user = PracticeStore.getUsers().find((u) => u.id === id);
    return user || null;
  },

  async updateUser(id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const updated = PracticeStore.updateAffiliate(id, updates);
    return updated;
  }
};
