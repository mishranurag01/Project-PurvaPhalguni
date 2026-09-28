/**
 * Prototype Bookings Service Placeholder
 *
 * Status: NOT CONNECTED TO LIVE BACKEND.
 * Manages appointment scheduling and status records in memory.
 */

import { BookingSession } from '../../types/practice';
import { PracticeStore } from '../store';

export const bookingService = {
  status: 'Prototype placeholder — in-memory bookings only',

  async listBookings(userRole: string, userId: string): Promise<BookingSession[]> {
    const all = PracticeStore.getBookings();
    if (userRole === 'admin') return all;
    if (userRole === 'affiliate') return all.filter((b) => b.affiliateId === userId);
    if (userRole === 'client') return all.filter((b) => b.clientId === userId);
    return [];
  },

  async createBooking(booking: BookingSession): Promise<BookingSession> {
    const all = PracticeStore.getBookings();
    const updated = [booking, ...all];
    PracticeStore.saveBookings(updated);
    return booking;
  },

  async updateBookingStatus(
    bookingId: string,
    status: BookingSession['status']
  ): Promise<BookingSession | null> {
    const all = PracticeStore.getBookings();
    let updatedBooking: BookingSession | null = null;
    const updated = all.map((b) => {
      if (b.id === bookingId) {
        updatedBooking = { ...b, status };
        return updatedBooking;
      }
      return b;
    });
    PracticeStore.saveBookings(updated);
    return updatedBooking;
  }
};
