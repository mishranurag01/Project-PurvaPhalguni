import React, { useState } from 'react';
import { UserProfile, PayoutMethod } from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { soundSynth } from '../../utils/soundAmbience';
import {
  X,
  Edit3,
  CreditCard,
  CheckCircle2,
  Sliders
} from 'lucide-react';

interface EditAffiliateModalProps {
  isOpen: boolean;
  affiliate: UserProfile | null;
  onClose: () => void;
  onUpdated: (updatedAffiliate: UserProfile) => void;
}

export const EditAffiliateModal: React.FC<EditAffiliateModalProps> = ({
  isOpen,
  affiliate,
  onClose,
  onUpdated
}) => {
  if (!isOpen || !affiliate) return null;

  const [name, setName] = useState(affiliate.name);
  const [email, setEmail] = useState(affiliate.email);
  const [phone, setPhone] = useState(affiliate.phone || '');
  const [specialty, setSpecialty] = useState(affiliate.specialty || '');
  const [bio, setBio] = useState(affiliate.bio || '');
  const [commissionRatePercent, setCommissionRatePercent] = useState(
    Math.round((affiliate.commissionRate || 0.25) * 100).toString()
  );
  const [activeStatus, setActiveStatus] = useState<UserProfile['activeStatus']>(
    affiliate.activeStatus || 'active'
  );
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>(
    affiliate.payoutMethodPreference || 'wise'
  );
  const [payoutDetails, setPayoutDetails] = useState(
    affiliate.payoutAccountDetails || ''
  );
  const [workCapacity, setWorkCapacity] = useState(
    affiliate.workCapacity || '8 sessions / week'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rate = Math.max(0.05, Math.min(0.9, (parseFloat(commissionRatePercent) || 25) / 100));

    const updated = PracticeStore.updateAffiliate(affiliate.id, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      specialty: specialty.trim(),
      bio: bio.trim(),
      commissionRate: rate,
      activeStatus,
      payoutMethodPreference: payoutMethod,
      payoutAccountDetails: payoutDetails.trim(),
      workCapacity: workCapacity.trim()
    });

    if (updated) {
      soundSynth.playSoftTap();
      onUpdated(updated);
      onClose();
    }
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

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#FAF3E3] border border-[#C59B4B]/30 flex items-center justify-center text-[#C59B4B]">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              Edit Partner Settings: {affiliate.name}
            </h3>
            <p className="text-xs text-[#64748B]">
              Update commission rate, consultation capacity, or payout credentials.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Partner Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Primary Practice Specialty
              </label>
              <input
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Status
              </label>
              <select
                value={activeStatus}
                onChange={(e) => setActiveStatus(e.target.value as UserProfile['activeStatus'])}
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
              >
                <option value="active">Active (Conducting Consultations)</option>
                <option value="pending">Pending Onboarding</option>
                <option value="suspended">Suspended / Sabbatical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E8E2D8]">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Commission Rate (%)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={commissionRatePercent}
                  onChange={(e) => setCommissionRatePercent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-mono focus:outline-none focus:border-[#C59B4B]"
                />
                <span className="text-[#64748B] font-mono font-bold">%</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Workload Capacity
              </label>
              <input
                type="text"
                value={workCapacity}
                onChange={(e) => setWorkCapacity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8E2D8]">
            <h4 className="font-semibold text-[#0F172A] text-xs mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#C59B4B]" />
              <span>Payout Method & Account Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                  Disbursement Method
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as PayoutMethod)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                >
                  <option value="wise">Wise (TransferWise)</option>
                  <option value="bank_wire">Direct Wire / ACH / SEPA</option>
                  <option value="stripe">Stripe Connect</option>
                  <option value="paypal">PayPal Mass Payouts</option>
                  <option value="crypto">USDC / Digital Dollar</option>
                  <option value="check">Certified Practice Check</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                  Account / Routing / IBAN / Email
                </label>
                <input
                  type="text"
                  value={payoutDetails}
                  onChange={(e) => setPayoutDetails(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-mono text-xs focus:outline-none focus:border-[#C59B4B]"
                />
              </div>
            </div>
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
              className="px-5 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-bold hover:bg-[#C59B4B] hover:text-[#0F172A] transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Partner Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
