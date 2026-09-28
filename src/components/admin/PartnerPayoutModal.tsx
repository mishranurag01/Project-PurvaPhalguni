import React, { useState, useEffect } from 'react';
import { UserProfile, PayoutMethod, PartnerPayout } from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { soundSynth } from '../../utils/soundAmbience';
import {
  X,
  CreditCard,
  DollarSign,
  Building,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Send,
  Wallet
} from 'lucide-react';

interface PartnerPayoutModalProps {
  isOpen: boolean;
  affiliates: UserProfile[];
  preselectedAffiliateId?: string;
  onClose: () => void;
  onPayoutProcessed: (payout: PartnerPayout) => void;
}

export const PartnerPayoutModal: React.FC<PartnerPayoutModalProps> = ({
  isOpen,
  affiliates,
  preselectedAffiliateId,
  onClose,
  onPayoutProcessed
}) => {
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<string>('');
  const [amount, setAmount] = useState<string>('200');
  const [method, setMethod] = useState<PayoutMethod>('wise');
  const [methodDetails, setMethodDetails] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch pending balances
  const workloadSummary = PracticeStore.getAffiliateWorkloadSummary();

  useEffect(() => {
    if (preselectedAffiliateId) {
      setSelectedAffiliateId(preselectedAffiliateId);
    } else if (affiliates.length > 0 && !selectedAffiliateId) {
      setSelectedAffiliateId(affiliates[0].id);
    }
  }, [preselectedAffiliateId, affiliates]);

  // When selected affiliate changes, autofill details & pending balance
  useEffect(() => {
    if (!selectedAffiliateId) return;
    const partner = affiliates.find((a) => a.id === selectedAffiliateId);
    if (partner) {
      const metric = workloadSummary.affiliateMetrics.find(
        (m) => m.affiliate.id === selectedAffiliateId
      );
      if (metric && metric.pendingPayout > 0) {
        setAmount(metric.pendingPayout.toString());
      } else {
        setAmount('250');
      }

      setMethod(partner.payoutMethodPreference || 'wise');
      setMethodDetails(
        partner.payoutAccountDetails || `${partner.email} (${partner.payoutMethodPreference || 'wise'})`
      );

      // Auto generate reference id
      const prefix = (partner.payoutMethodPreference || 'wise').toUpperCase().slice(0, 4);
      const rand = Math.floor(1000 + Math.random() * 9000);
      setReferenceId(`${prefix}-${new Date().getFullYear()}-${rand}`);

      setNotes(`Honoraria disbursement for completed consultations and reading folios.`);
    }
  }, [selectedAffiliateId]);

  if (!isOpen) return null;

  const currentPartner = affiliates.find((a) => a.id === selectedAffiliateId);
  const currentMetric = workloadSummary.affiliateMetrics.find(
    (m) => m.affiliate.id === selectedAffiliateId
  );

  const handleGenerateNewRef = () => {
    const prefix = method.toUpperCase().slice(0, 4);
    const rand = Math.floor(1000 + Math.random() * 9000);
    setReferenceId(`${prefix}-${new Date().getFullYear()}-${rand}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentPartner) {
      setErrorMsg('Please select a partner practitioner.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setErrorMsg('Please enter a valid disbursement amount greater than $0.');
      return;
    }

    if (!referenceId.trim()) {
      setErrorMsg('Please enter a transaction reference or transfer ID.');
      return;
    }

    const newPayout = PracticeStore.sendPayout({
      affiliateId: currentPartner.id,
      affiliateName: currentPartner.name,
      affiliateEmail: currentPartner.email,
      amount: numericAmount,
      currency: 'USD',
      method,
      methodDetails: methodDetails.trim() || `${currentPartner.name} Account`,
      referenceId: referenceId.trim(),
      notes: notes.trim(),
      processedBy: 'Eleanor Vance, M.A. (Director)'
    });

    soundSynth.playCelestialChime();
    onPayoutProcessed(newPayout);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E8E2D8] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAF8F5] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              Disburse Partner Honoraria & Payout
            </h3>
            <p className="text-xs text-[#64748B]">
              Execute direct payment to affiliated practitioners via verified financial rails.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          {/* Partner Selector */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
              Select Partner Practitioner *
            </label>
            <select
              value={selectedAffiliateId}
              onChange={(e) => setSelectedAffiliateId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-medium text-xs focus:outline-none focus:border-[#C59B4B]"
            >
              {affiliates.map((aff) => {
                const metric = workloadSummary.affiliateMetrics.find(
                  (m) => m.affiliate.id === aff.id
                );
                return (
                  <option key={aff.id} value={aff.id}>
                    {aff.name} ({aff.specialty}) — Pending Due: ${metric?.pendingPayout || 0} USD
                  </option>
                );
              })}
            </select>
          </div>

          {/* Pending Balance Snapshot */}
          {currentMetric && (
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#64748B]">Current Unpaid Liability:</span>
                <span className="ml-1.5 font-mono font-bold text-[#0F172A] text-sm">
                  ${currentMetric.pendingPayout.toLocaleString()} USD
                </span>
              </div>
              <div className="text-[11px] text-[#78716C]">
                Total Earned: ${currentMetric.earnedCommission} · Disbursed: ${currentMetric.paidOut}
              </div>
            </div>
          )}

          {/* Amount & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Disbursement Amount (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-[#64748B]">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-mono font-bold text-sm focus:outline-none focus:border-[#C59B4B]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Payout Method / Rail *
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PayoutMethod)}
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
              >
                <option value="wise">Wise (TransferWise - Fast International)</option>
                <option value="bank_wire">Direct Wire / ACH / SEPA Bank Transfer</option>
                <option value="stripe">Stripe Connect Instant Payout</option>
                <option value="paypal">PayPal Mass Payouts / Business</option>
                <option value="crypto">USDC / Digital Dollar Escrow</option>
                <option value="check">Certified Practice Check</option>
              </select>
            </div>
          </div>

          {/* Account / Routing / IBAN Details */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
              Recipient Account / IBAN / Email Details *
            </label>
            <input
              type="text"
              required
              value={methodDetails}
              onChange={(e) => setMethodDetails(e.target.value)}
              placeholder="e.g. IBAN CH93 0024... or wise-email@domain.com"
              className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-mono text-xs focus:outline-none focus:border-[#C59B4B]"
            />
          </div>

          {/* Reference ID */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] text-[10px]">
                Transaction Reference / Batch ID *
              </label>
              <button
                type="button"
                onClick={handleGenerateNewRef}
                className="text-[10px] text-[#C59B4B] hover:underline"
              >
                Regenerate ID
              </button>
            </div>
            <input
              type="text"
              required
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              placeholder="WISE-2026-9812"
              className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-mono text-xs focus:outline-none focus:border-[#C59B4B]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
              Disbursement Notes & Covered Sessions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Honoraria settlement for September 2026 completed consultations."
              className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
            />
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Processing records a demonstration payout receipt to {currentPartner?.name}'s portal, updates the session ledger, and logs an activity record.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E8E2D8] text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Send ${amount} USD Payout</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
