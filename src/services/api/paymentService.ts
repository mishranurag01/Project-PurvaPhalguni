/**
 * Prototype Payment Service Placeholder
 *
 * Status: NOT CONNECTED TO LIVE PAYMENT GATEWAY (Stripe / PayPal / Wise).
 * Simulates checkout and partner disbursement recording in memory.
 * No real credit cards or bank accounts are debited.
 */

import { PartnerPayout } from '../../types/practice';
import { PracticeStore } from '../store';

export interface PaymentIntentResponse {
  paymentIntentId: string;
  status: 'simulated_success';
  amount: number;
  currency: string;
  isMock: boolean;
}

export const paymentService = {
  status: 'Prototype placeholder — payment gateway not connected',

  async createPaymentIntent(amount: number, currency = 'USD'): Promise<PaymentIntentResponse> {
    return {
      paymentIntentId: `mock_pi_${Date.now()}`,
      status: 'simulated_success',
      amount,
      currency,
      isMock: true
    };
  },

  async recordPartnerPayout(payoutData: Omit<PartnerPayout, 'id' | 'createdAt' | 'status'>): Promise<PartnerPayout> {
    return PracticeStore.sendPayout(payoutData);
  },

  async getPayoutHistory(affiliateId?: string): Promise<PartnerPayout[]> {
    const all = PracticeStore.getPayouts();
    if (affiliateId) {
      return all.filter((p) => p.affiliateId === affiliateId);
    }
    return all;
  }
};
