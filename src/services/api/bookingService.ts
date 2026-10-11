/**
 * Prototype Bookings Service Placeholder
 *
 * Status: NOT CONNECTED TO LIVE BACKEND.
 * Manages appointment scheduling and status records in memory.
 */

import { BookingSession } from '../../types/practice';
import { PracticeStore } from '../store';
import { apiClient } from './apiClient';
import { ValidationError } from '../../errors/AppError';

export const bookingService = {
  status: 'Scalable service layer — backed by in-memory practice store',

  async listBookings(userRole: string, userId: string): Promise<BookingSession[]> {
    const res = await apiClient.executeMock(() => {
      const all = PracticeStore.getBookings();
      if (userRole === 'admin') return all;
      if (userRole === 'affiliate') return all.filter((b) => b.affiliateId === userId);
      if (userRole === 'client') return all.filter((b) => b.clientId === userId);
      return [];
    });
    return res.data;
  },

  async createBooking(booking: BookingSession): Promise<BookingSession> {
    if (!booking.serviceId || !booking.clientName || !booking.clientEmail) {
      throw new ValidationError('Incomplete booking details: service, name, and email are required.');
    }

    const res = await apiClient.executeMock(() => {
      const all = PracticeStore.getBookings();
      const updated = [booking, ...all];
      PracticeStore.saveBookings(updated);
      return booking;
    });
    return res.data;
  },

  async updateBookingStatus(
    bookingId: string,
    status: BookingSession['status']
  ): Promise<BookingSession | null> {
    const res = await apiClient.executeMock(() => {
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
    });
    return res.data;
  }
};
