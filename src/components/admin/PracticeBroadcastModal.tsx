import React, { useState } from 'react';
import { UserProfile, BulletinPriority, AdminBulletin } from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { soundSynth } from '../../utils/soundAmbience';
import {
  X,
  Radio,
  Bell,
  Send,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface PracticeBroadcastModalProps {
  isOpen: boolean;
  affiliates: UserProfile[];
  onClose: () => void;
  onPublished: (bulletin: AdminBulletin) => void;
}

export const PracticeBroadcastModal: React.FC<PracticeBroadcastModalProps> = ({
  isOpen,
  affiliates,
  onClose,
  onPublished
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<BulletinPriority>('protocol');
  const [targetAffiliateId, setTargetAffiliateId] = useState<'all' | string>('all');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter an announcement title.');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('Please enter the announcement body content.');
      return;
    }

    const newBulletin = PracticeStore.addBulletin({
      title: title.trim(),
      content: content.trim(),
      priority,
      targetAffiliateId,
      authorName: 'Eleanor Vance, M.A. (Director)'
    });

    soundSynth.playCelestialChime();
    onPublished(newBulletin);
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
          <div className="w-10 h-10 rounded-xl bg-[#FAF3E3] border border-[#C59B4B]/30 flex items-center justify-center text-[#C59B4B]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              Broadcast Live Practice Update
            </h3>
            <p className="text-xs text-[#64748B]">
              Instantly push ethical guidelines, scheduling shifts, or clinical bulletins to practitioners.
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
                Target Audience
              </label>
              <select
                value={targetAffiliateId}
                onChange={(e) => setTargetAffiliateId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-medium text-xs focus:outline-none focus:border-[#C59B4B]"
              >
                <option value="all">Broadcast to All Active Practitioners</option>
                {affiliates.map((aff) => (
                  <option key={aff.id} value={aff.id}>
                    Direct to: {aff.name} ({aff.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                Priority & Category
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as BulletinPriority)}
                className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-medium text-xs focus:outline-none focus:border-[#C59B4B]"
              >
                <option value="protocol">Ethical Practice Protocol (Standard)</option>
                <option value="urgent">Urgent Ethical Standards Notice (Red Priority)</option>
                <option value="scheduling">Sanctuary Scheduling & Calendar Shifts</option>
                <option value="payout">Honoraria & Disbursement Announcement</option>
                <option value="general">General Practice Announcement</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
              Announcement Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Updated Consent Protocol v2.5 & Sidereal Bhava Observations"
              className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-semibold text-xs focus:outline-none focus:border-[#C59B4B]"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
              Detailed Bulletin Body *
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide clear procedural instructions, ethical boundaries, or scheduling updates for practitioners..."
              className="w-full p-3 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] text-xs focus:outline-none focus:border-[#C59B4B]"
            />
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] text-[11px] text-[#78716C] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              This bulletin will immediately appear in the partner portals with an unread badge and requires digital acknowledgment by practitioners.
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
              className="px-5 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-bold hover:bg-[#C59B4B] hover:text-[#0F172A] transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Live to Practitioners</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
