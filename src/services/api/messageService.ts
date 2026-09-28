/**
 * Prototype Messaging Service Placeholder
 *
 * Status: NOT CONNECTED TO PRODUCTION WEBSOCKET OR SERVER MESSAGING.
 * Prototype direct message view — messages are kept in memory for the active session.
 */

import { DirectMessage } from '../../types/practice';
import { PracticeStore } from '../store';

export const messageService = {
  status: 'Prototype message view — server messaging not connected',

  async getConversation(user1Id: string, user2Id: string): Promise<DirectMessage[]> {
    const all = PracticeStore.getMessages();
    return all.filter(
      (m) =>
        (m.senderId === user1Id && m.recipientId === user2Id) ||
        (m.senderId === user2Id && m.recipientId === user1Id)
    );
  },

  async sendMessage(message: Omit<DirectMessage, 'id' | 'timestamp' | 'isRead'>): Promise<DirectMessage> {
    const all = PracticeStore.getMessages();
    const newMsg: DirectMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    PracticeStore.saveMessages([...all, newMsg]);
    return newMsg;
  }
};
