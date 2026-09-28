import React, { useState } from 'react';
import {
  UserProfile,
  PayoutMethod,
  PractitionerRoleTier,
  PractitionerPermissions,
  ROLE_PERMISSION_DEFAULTS,
  PRACTITIONER_ROLE_LABELS,
  PRACTITIONER_ROLE_DESCRIPTIONS
} from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { soundSynth } from '../../utils/soundAmbience';
import {
  X,
  Edit3,
  CreditCard,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  UserCheck
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
  const [deactivationReason, setDeactivationReason] = useState(
    affiliate.deactivationReason || 'Administrative pause / Sabbatical'
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

  // Role Tier & Role-Based Permissions
  const [roleTier, setRoleTier] = useState<PractitionerRoleTier>(
    affiliate.practitionerRole || 'associate_astrologer'
  );
  const [permissions, setPermissions] = useState<PractitionerPermissions>(
    affiliate.permissions || {
      ...ROLE_PERMISSION_DEFAULTS[affiliate.practitionerRole || 'associate_astrologer']
    }
  );
  const [showPermissionsSection, setShowPermissionsSection] = useState(true);

  const handleRoleTierChange = (newTier: PractitionerRoleTier) => {
    setRoleTier(newTier);
    setPermissions({ ...ROLE_PERMISSION_DEFAULTS[newTier] });
    soundSynth.playSoftTap();
  };

  const togglePermission = (key: keyof PractitionerPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rate = Math.max(0.05, Math.min(0.9, (parseFloat(commissionRatePercent) || 25) / 100));

    const isDeactivated = activeStatus === 'deactivated' || activeStatus === 'suspended';

    const updated = PracticeStore.updateAffiliate(affiliate.id, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      specialty: specialty.trim(),
      bio: bio.trim(),
      commissionRate: rate,
      activeStatus,
      practitionerRole: roleTier,
      permissions,
      deactivationReason: isDeactivated ? deactivationReason.trim() : undefined,
      deactivatedAt: isDeactivated
        ? affiliate.deactivatedAt || new Date().toISOString()
        : undefined,
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
      <div className="bg-white rounded-3xl border border-[#E8E2D8] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
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
              Edit Practitioner Account: {affiliate.name}
            </h3>
            <p className="text-xs text-[#64748B]">
              Configure role-based permissions, account status (Active / Deactivated), and credentials.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          {/* Identity & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Partner Legal / Professional Name
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
                Account Status
              </label>
              <select
                value={activeStatus}
                onChange={(e) => setActiveStatus(e.target.value as UserProfile['activeStatus'])}
                className={`w-full p-2.5 rounded-xl border font-bold text-xs focus:outline-none ${
                  activeStatus === 'active'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : activeStatus === 'deactivated' || activeStatus === 'suspended'
                    ? 'border-red-300 bg-red-50 text-red-800'
                    : 'border-amber-300 bg-amber-50 text-amber-800'
                }`}
              >
                <option value="active">Active (Full Consultation Capacity)</option>
                <option value="deactivated">Deactivated (Booking Paused / Inactive)</option>
                <option value="suspended">Suspended (Temporary Review)</option>
                <option value="pending">Pending Onboarding</option>
              </select>
            </div>
          </div>

          {/* Deactivation Reason Warning if Deactivated */}
          {(activeStatus === 'deactivated' || activeStatus === 'suspended') && (
            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Account Deactivation Notice</span>
              </div>
              <p className="text-[11px] text-red-700">
                Deactivating pauses incoming client bookings and marks the practitioner as inactive in the public directory. Existing notes and past records remain preserved in memory.
              </p>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-red-900 mb-1 text-[10px]">
                  Reason for Deactivation / Leave
                </label>
                <input
                  type="text"
                  value={deactivationReason}
                  onChange={(e) => setDeactivationReason(e.target.value)}
                  placeholder="e.g. Sabbatical: Scholarly Research or Sabbatical Leave"
                  className="w-full p-2 rounded-xl border border-red-300 bg-white text-xs text-[#0F172A] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ROLE-BASED PERMISSION SETTINGS */}
          <div className="pt-3 border-t border-[#E8E2D8] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#0F172A] text-[10px]">
                  Role-Based Clinical Authority & Permissions
                </label>
                <p className="text-[11px] text-[#64748B]">
                  Select the practitioner tier and customize capability flags.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPermissionsSection(!showPermissionsSection)}
                className="text-[11px] text-[#C59B4B] font-semibold hover:underline flex items-center gap-1"
              >
                <span>{showPermissionsSection ? 'Collapse Matrix' : 'Expand Matrix'}</span>
                {showPermissionsSection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Role Tier Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(
                [
                  'senior_astrologer',
                  'associate_astrologer',
                  'cartomancy_specialist',
                  'apprentice_fellow'
                ] as PractitionerRoleTier[]
              ).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => handleRoleTierChange(tier)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    roleTier === tier
                      ? 'border-[#C59B4B] bg-[#FAF3E3]/60 text-[#0F172A] ring-1 ring-[#C59B4B]'
                      : 'border-[#E8E2D8] bg-[#FCFBF9] text-[#64748B] hover:bg-white'
                  }`}
                >
                  <div className="font-bold text-xs text-[#0F172A] flex items-center justify-between">
                    <span>{PRACTITIONER_ROLE_LABELS[tier]}</span>
                    {roleTier === tier && <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B4B]" />}
                  </div>
                  <div className="text-[10px] text-[#78716C] mt-0.5 line-clamp-1">
                    {PRACTITIONER_ROLE_DESCRIPTIONS[tier]}
                  </div>
                </button>
              ))}
            </div>

            {/* Granular Permission Toggles */}
            {showPermissionsSection && (
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F172A]">
                    Individual Permissions for {PRACTITIONER_ROLE_LABELS[roleTier]}
                  </span>
                  <span className="text-[10px] font-mono text-[#78716C]">
                    {Object.values(permissions).filter(Boolean).length}/8 Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8E2D8] cursor-pointer hover:border-[#C59B4B]/60">
                    <input
                      type="checkbox"
                      checked={permissions.canAccessJHoraEngine}
                      onChange={() => togglePermission('canAccessJHoraEngine')}
                      className="rounded text-[#C59B4B] focus:ring-[#C59B4B]"
                    />
                    <span className="text-[11px] text-[#0F172A]">JHora Sidereal & Varga Engine</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8E2D8] cursor-pointer hover:border-[#C59B4B]/60">
                    <input
                      type="checkbox"
                      checked={permissions.canSuggestRemedies}
                      onChange={() => togglePermission('canSuggestRemedies')}
                      className="rounded text-[#C59B4B] focus:ring-[#C59B4B]"
                    />
                    <span className="text-[11px] text-[#0F172A]">Suggest Contemplative Pacing (Upayas)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8E2D8] cursor-pointer hover:border-[#C59B4B]/60">
                    <input
                      type="checkbox"
                      checked={permissions.canDirectMessageClients}
                      onChange={() => togglePermission('canDirectMessageClients')}
                      className="rounded text-[#C59B4B] focus:ring-[#C59B4B]"
                    />
                    <span className="text-[11px] text-[#0F172A]">Direct Client Messaging</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8E2D8] cursor-pointer hover:border-[#C59B4B]/60">
                    <input
                      type="checkbox"
                      checked={permissions.canExportClientCharts}
                      onChange={() => togglePermission('canExportClientCharts')}
                      className="rounded text-[#C59B4B] focus:ring-[#C59B4B]"
                    />
                    <span className="text-[11px] text-[#0F172A]">Export Natal PDF Folios</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8E2D8] cursor-pointer hover:border-[#C59B4B]/60">
                    <input
                      type="checkbox"
                      checked={permissions.canPublishToSanctuaryNotes}
                      onChange={() => togglePermission('canPublishToSanctuaryNotes')}
                      className="rounded text-[#C59B4B] focus:ring-[#C59B4B]"
                    />
                    <span className="text-[11px] text-[#0F172A]">Publish Sanctuary Notes</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8E2D8] cursor-pointer hover:border-[#C59B4B]/60">
                    <input
                      type="checkbox"
                      checked={permissions.canViewUnassignedQueue}
                      onChange={() => togglePermission('canViewUnassignedQueue')}
                      className="rounded text-[#C59B4B] focus:ring-[#C59B4B]"
                    />
                    <span className="text-[11px] text-[#0F172A]">Claim from Intake Triage</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8E2D8] cursor-pointer hover:border-[#C59B4B]/60">
                    <input
                      type="checkbox"
                      checked={permissions.canModifyConsultationFees}
                      onChange={() => togglePermission('canModifyConsultationFees')}
                      className="rounded text-[#C59B4B] focus:ring-[#C59B4B]"
                    />
                    <span className="text-[11px] text-[#0F172A]">Modify Consultation Fees</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8E2D8] cursor-pointer hover:border-[#C59B4B]/60">
                    <input
                      type="checkbox"
                      checked={permissions.requireAdminSummaryReview}
                      onChange={() => togglePermission('requireAdminSummaryReview')}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-[#0F172A]">Require Admin Summary Review</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Commission & Capacity */}
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

          {/* Payout Banking */}
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
                  Demonstration Payout Reference (Fictional)
                </label>
                <input
                  type="text"
                  value={payoutDetails}
                  onChange={(e) => setPayoutDetails(e.target.value)}
                  placeholder="e.g. Demo Payout Reference (Fictional)"
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
              <span>Save Changes & Role Permissions</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
