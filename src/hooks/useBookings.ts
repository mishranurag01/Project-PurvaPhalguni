import { useMemo, useCallback } from 'react';
import { usePractice } from '../context/PracticeContext';
import { BookingSession } from '../types/practice';

export function useBookings() {
  const { bookings, currentRole, currentUser, addBooking } = usePractice();

  const userBookings = useMemo(() => {
    if (currentRole === 'admin') return bookings;
    if (currentRole === 'affiliate' && currentUser) {
      return bookings.filter((b) => b.affiliateId === currentUser.id);
    }
    if (currentRole === 'client' && currentUser) {
      return bookings.filter((b) => b.clientId === currentUser.id);
    }
    return bookings;
  }, [bookings, currentRole, currentUser]);

  const upcomingBookings = useMemo(() => {
    return userBookings.filter((b) => b.status === 'confirmed');
  }, [userBookings]);

  const completedBookings = useMemo(() => {
    return userBookings.filter((b) => b.status === 'completed');
  }, [userBookings]);

  const nextUpcoming = useMemo(() => {
    return upcomingBookings[0] || null;
  }, [upcomingBookings]);

  const totalRevenue = useMemo(() => {
    return bookings
      .filter((b) => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.amount || 0), 0);
  }, [bookings]);

  return {
    allBookings: bookings,
    userBookings,
    upcomingBookings,
    completedBookings,
    nextUpcoming,
    totalRevenue,
    addBooking
  };
}
