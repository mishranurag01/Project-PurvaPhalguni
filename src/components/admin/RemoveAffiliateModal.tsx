import React, { useState } from 'react';
import { UserProfile } from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { soundSynth } from '../../utils/soundAmbience';
import {
  X,
  AlertTriangle,
  UserMinus,
  Users,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface RemoveAffiliateModalProps {
  isOpen: boolean;
  affiliate: UserProfile | null;
  activeAffiliates: UserProfile[];
  onClose: () => void;
  onRemoved: (result: { success: boolean; reassignedCount: number }) => void;
}

export const RemoveAffiliateModal: React.FC<RemoveAffiliateModalProps> = ({
  isOpen,
  affiliate,
  activeAffiliates,
  onClose,
  onRemoved
}) => {
  const [reassignToId, setReassignToId] = useState<string>('');
  const [actionType, setActionType] = useState<'suspend' | 'permanent'>('suspend');
  const [confirmText, setConfirmText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !affiliate) return null;

  // Calculate affected clients & bookings
  const allUsers = PracticeStore.getUsers();
  const assignedClients = allUsers.filter(
    (u) => u.role === 'client' && u.assignedAffiliateId === affiliate.id
  );
  const allBookings = PracticeStore.getBookings();
  const upcomingBookings = allBookings.filter(
    (b) => b.affiliateId === affiliate.id && b.status === 'confirmed'
  );

  const availablePartners = activeAffiliates.filter((a) => a.id !== affiliate.id);

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (actionType === 'permanent' && confirmText.trim().toLowerCase() !== affiliate.name.toLowerCase()) {
      setErrorMsg(`Please type "${affiliate.name}" to verify permanent removal.`);
      return;
    }

    if (actionType === 'suspend') {
      // Just toggle activeStatus to 'suspended'
      PracticeStore.updateAffiliate(affiliate.id, { activeStatus: 'suspended' });
      soundSynth.playSoftTap();
      onRemoved({ success: true, reassignedCount: 0 });
      onClose();
      return;
    }

    // Permanent removal & reassignment
    const res = PracticeStore.removeAffiliate(affiliate.id, reassignToId || undefined);
    soundSynth.playSoftTap();
    onRemoved(res);
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
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <UserMinus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              Manage Partner Status / Remove
            </h3>
            <p className="text-xs text-[#64748B]">
              Safely deactivate or permanently remove {affiliate.name} from practice.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMsg}
          </div>
        )}

        <div className="mt-5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#0F172A] text-sm">{affiliate.name}</span>
            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#E8E2D8] text-[#0F172A]">
              Code: {affiliate.affiliateCode}
            </span>
          </div>
          <div className="text-[#64748B]">{affiliate.email} · {affiliate.specialty}</div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8E2D8]">
            <div className="p-2.5 rounded-xl bg-white border border-[#E8E2D8] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C59B4B]" />
              <div>
                <div className="font-bold text-[#0F172A]">{assignedClients.length}</div>
                <div className="text-[10px] text-[#64748B]">Assigned Clients</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#E8E2D8] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <div>
                <div className="font-bold text-[#0F172A]">{upcomingBookings.length}</div>
                <div className="text-[10px] text-[#64748B]">Upcoming Consultations</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleExecute} className="mt-6 space-y-4 text-xs">
          {/* Action Choice */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-2 text-[10px]">
              Select Action Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActionType('suspend')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  actionType === 'suspend'
                    ? 'border-[#C59B4B] bg-[#FAF3E3]/60 text-[#0F172A] ring-1 ring-[#C59B4B]'
                    : 'border-[#E8E2D8] bg-white text-[#64748B] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="font-bold text-xs">Suspend Partner Account</div>
                <div className="text-[11px] text-[#78716C] mt-1">
                  Keeps consultation history and notes intact. Prevents new booking bookings. Can be reactivated anytime.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActionType('permanent')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  actionType === 'permanent'
                    ? 'border-red-400 bg-red-50/60 text-red-900 ring-1 ring-red-400'
                    : 'border-[#E8E2D8] bg-white text-[#64748B] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="font-bold text-xs text-red-700">Permanent Removal</div>
                <div className="text-[11px] text-[#78716C] mt-1">
                  Removes partner from roster and reassigns all active clients and bookings to another partner.
                </div>
              </button>
            </div>
          </div>

          {/* Reassignment Dropdown (Mandatory or recommended if clients exist) */}
          {assignedClients.length > 0 && (
            <div className="pt-2">
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Reassign {assignedClients.length} Client(s) & Bookings To:
              </label>
              <select
                value={reassignToId}
                onChange={(e) => setReassignToId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-medium text-xs focus:outline-none focus:border-[#C59B4B]"
              >
                <option value="">-- Sanctuary Executive Roster (Unassigned) --</option>
                {availablePartners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.specialty})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#78716C] mt-1">
                Clients will immediately be visible in the selected practitioner's private enclave without disruption.
              </p>
            </div>
          )}

          {actionType === 'permanent' && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-2">
              <label className="block font-semibold text-red-800 text-xs">
                To confirm permanent removal, please type: <strong>{affiliate.name}</strong>
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={affiliate.name}
                className="w-full p-2.5 rounded-xl border border-red-300 bg-white font-medium text-xs focus:outline-none"
              />
            </div>
          )}

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
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-colors flex items-center gap-2 ${
                actionType === 'permanent'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#0F172A] hover:bg-[#C59B4B] hover:text-[#0F172A]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {actionType === 'permanent' ? 'Execute Permanent Removal' : 'Confirm Suspension'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
