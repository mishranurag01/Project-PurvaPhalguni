import React, { useState } from 'react';
import { UserProfile, PayoutMethod } from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { soundSynth } from '../../utils/soundAmbience';
import {
  X,
  UserPlus,
  Sparkles,
  CreditCard,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface AddAffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (newAffiliate: UserProfile) => void;
}

export const AddAffiliateModal: React.FC<AddAffiliateModalProps> = ({
  isOpen,
  onClose,
  onAdded
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('Sidereal Parashari & Constitutional Chronobiology');
  const [bio, setBio] = useState('');
  const [affiliateCode, setAffiliateCode] = useState('');
  const [commissionRatePercent, setCommissionRatePercent] = useState('25');
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('wise');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [workCapacity, setWorkCapacity] = useState('8 sessions / week');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!affiliateCode) {
      // Suggest code based on name
      const code = val
        .replace(/[^a-zA-Z]/g, '')
        .toUpperCase()
        .slice(0, 8);
      if (code) setAffiliateCode(code + '20');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please specify the partner practitioner\'s full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid professional email address.');
      return;
    }
    if (!affiliateCode.trim()) {
      setErrorMsg('Please enter a unique tracking code.');
      return;
    }

    const rate = Math.max(0.05, Math.min(0.9, (parseFloat(commissionRatePercent) || 25) / 100));

    const newPartner = PracticeStore.addAffiliate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || '+1 (555) 000-0000',
      specialty: specialty.trim(),
      bio: bio.trim() || 'Accredited Medical Astrology and contemplative Cartomancy practitioner.',
      affiliateCode: affiliateCode.trim().toUpperCase(),
      commissionRate: rate,
      activeStatus: 'active',
      payoutMethodPreference: payoutMethod,
      payoutAccountDetails: payoutDetails.trim() || `${email.trim()} (${payoutMethod})`,
      workCapacity: workCapacity.trim()
    });

    soundSynth.playCelestialChime();
    onAdded(newPartner);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E8E2D8] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAF8F5] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#FAF3E3] border border-[#C59B4B]/30 flex items-center justify-center text-[#C59B4B]">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              Add New Affiliate Partner
            </h3>
            <p className="text-xs text-[#64748B]">
              Onboard a licensed Medical Astrologer or Cartomancer to your practice roster.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Full Legal / Professional Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Dr. Helena Rostova"
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Professional Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. helena.rostova@practice.org"
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Direct Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (415) 555-0182"
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Primary Practice Specialty *
              </label>
              <input
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Sidereal Parashari & Somatic Chronobiology"
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
              Clinical / Contemplative Bio & Credentials
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Summary of contemplative background, JHora sidereal mastery, or hermetic cartomancy linchpins..."
              className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E8E2D8]">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Affiliate Code *
              </label>
              <input
                type="text"
                required
                value={affiliateCode}
                onChange={(e) => setAffiliateCode(e.target.value.toUpperCase())}
                placeholder="ROSTOVA20"
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-mono font-bold focus:outline-none focus:border-[#C59B4B]"
              />
            </div>

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
                Weekly Capacity
              </label>
              <input
                type="text"
                value={workCapacity}
                onChange={(e) => setWorkCapacity(e.target.value)}
                placeholder="8 sessions / week"
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8E2D8]">
            <h4 className="font-semibold text-[#0F172A] text-xs mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#C59B4B]" />
              <span>Preferred Payout Method & Banking Details</span>
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
                  <option value="wise">Wise (TransferWise - Recommended for Multi-currency)</option>
                  <option value="bank_wire">Direct Bank Wire / ACH / SEPA</option>
                  <option value="stripe">Stripe Connect Instant</option>
                  <option value="paypal">PayPal Mass Payouts</option>
                  <option value="crypto">USDC / Crypto Escrow (Base/ETH)</option>
                  <option value="check">Official Practice Check</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                  Account / Routing / IBAN / Email Details
                </label>
                <input
                  type="text"
                  value={payoutDetails}
                  onChange={(e) => setPayoutDetails(e.target.value)}
                  placeholder="e.g. IBAN CH93... or wise-email@domain.com"
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-mono text-xs focus:outline-none focus:border-[#C59B4B]"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] text-[11px] text-[#78716C] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Onboarding automatically syncs to the global practitioner directory, provisions JHora sidereal calculation access, generates encrypted consultation room keys, and notifies all partners via live broadcast.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
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
              <span>Confirm & Onboard Partner</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
