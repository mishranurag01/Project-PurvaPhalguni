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
  ArrowRight,
  PauseCircle,
  Trash2
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
  const [actionType, setActionType] = useState<'deactivate' | 'permanent'>('deactivate');
  const [deactivationReason, setDeactivationReason] = useState('Sabbatical / Temporary Leave of Absence');
  const [customReason, setCustomReason] = useState('');
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

  const availablePartners = activeAffiliates.filter(
    (a) => a.id !== affiliate.id && (a.activeStatus === 'active' || !a.activeStatus)
  );

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (actionType === 'permanent' && confirmText.trim().toLowerCase() !== affiliate.name.toLowerCase()) {
      setErrorMsg(`Please type "${affiliate.name}" to confirm permanent removal.`);
      return;
    }

    const finalReason =
      deactivationReason === 'Other (Custom reason)'
        ? customReason.trim() || 'Administrative pause'
        : deactivationReason;

    if (actionType === 'deactivate') {
      const res = PracticeStore.deactivateAffiliate(
        affiliate.id,
        finalReason,
        reassignToId || undefined
      );
      soundSynth.playSoftTap();
      onRemoved(res);
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
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <PauseCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              Deactivate Practitioner Account
            </h3>
            <p className="text-xs text-[#64748B]">
              Safely pause or remove {affiliate.name} from active clinical practice.
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
                <div className="text-[10px] text-[#64748B]">Active Assigned Clients</div>
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
              Select Action
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActionType('deactivate')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  actionType === 'deactivate'
                    ? 'border-amber-400 bg-amber-50/70 text-[#0F172A] ring-1 ring-amber-400'
                    : 'border-[#E8E2D8] bg-white text-[#64748B] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <PauseCircle className="w-4 h-4 text-amber-700" />
                  <span>Deactivate / Sabbatical</span>
                </div>
                <div className="text-[11px] text-[#78716C] mt-1">
                  Pauses active bookings & public listings. Preserves all natal charts and clinical notes. Account can be reactivated with 1 click.
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
                <div className="font-bold text-xs text-red-700 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>Permanent Purge</span>
                </div>
                <div className="text-[11px] text-[#78716C] mt-1">
                  Permanently deletes practitioner credentials and safely reassigns all active clients to another partner.
                </div>
              </button>
            </div>
          </div>

          {/* Reason for Deactivation */}
          {actionType === 'deactivate' && (
            <div className="space-y-2">
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] text-[10px]">
                Reason for Deactivation
              </label>
              <select
                value={deactivationReason}
                onChange={(e) => setDeactivationReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] text-xs focus:outline-none focus:border-[#C59B4B]"
              >
                <option value="Sabbatical / Temporary Leave of Absence">
                  Sabbatical / Temporary Leave of Absence
                </option>
                <option value="Scholarly Research & Fieldwork">
                  Scholarly Research & Fieldwork
                </option>
                <option value="Caseload Reached Maximum Capacity">
                  Caseload Reached Maximum Capacity
                </option>
                <option value="Practice Standards Review">
                  Practice Standards Review
                </option>
                <option value="Contract Inactive">Contract Inactive</option>
                <option value="Other (Custom reason)">Other (Custom reason)...</option>
              </select>

              {deactivationReason === 'Other (Custom reason)' && (
                <input
                  type="text"
                  required
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Specify custom reason..."
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-white text-xs focus:outline-none focus:border-[#C59B4B]"
                />
              )}
            </div>
          )}

          {/* Reassignment Dropdown if clients exist */}
          {assignedClients.length > 0 && (
            <div className="pt-2">
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Reassign {assignedClients.length} Active Client(s) To:
              </label>
              <select
                value={reassignToId}
                onChange={(e) => setReassignToId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-medium text-xs focus:outline-none focus:border-[#C59B4B]"
              >
                <option value="">
                  {actionType === 'deactivate'
                    ? '-- Keep assigned to practitioner during pause --'
                    : '-- Sanctuary Executive Roster (Unassigned) --'}
                </option>
                {availablePartners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.specialty})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#78716C] mt-1">
                {reassignToId
                  ? 'Selected partner will receive caseload and consultation files immediately.'
                  : 'Clients will remain associated or route to the Sanctuary Executive triage queue.'}
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
                  : 'bg-amber-800 hover:bg-amber-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {actionType === 'permanent' ? 'Execute Permanent Purge' : 'Confirm Account Deactivation'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
