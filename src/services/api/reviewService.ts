/**
 * Prototype Reviews Service Placeholder
 *
 * Status: NOT CONNECTED TO LIVE BACKEND.
 * Manages client testimonials with non-medical claim verification.
 */

import { ReviewItem } from '../../types/practice';
import { PracticeStore } from '../store';

export const reviewService = {
  status: 'Prototype review store — in-memory only',

  async getPublicReviews(): Promise<ReviewItem[]> {
    return PracticeStore.getReviews()
      .filter((r) => r.isApproved && !r.hasMedicalClaims)
      .sort((a, b) => a.order - b.order);
  },

  async getAllReviewsForAdmin(): Promise<ReviewItem[]> {
    return PracticeStore.getReviews().sort((a, b) => a.order - b.order);
  },

  async updateReview(reviewId: string, updates: Partial<ReviewItem>): Promise<ReviewItem | null> {
    const all = PracticeStore.getReviews();
    let updatedReview: ReviewItem | null = null;
    const updated = all.map((r) => {
      if (r.id === reviewId) {
        updatedReview = { ...r, ...updates };
        return updatedReview;
      }
      return r;
    });
    PracticeStore.saveReviews(updated);
    return updatedReview;
  }
};
