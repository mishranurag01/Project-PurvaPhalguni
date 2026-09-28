import React, { useState } from 'react';
import { UserRole, UserProfile } from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { soundSynth } from '../../utils/soundAmbience';
import {
  X,
  Lock,
  User,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Briefcase
} from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole, user?: UserProfile) => void;
  initialRoleChoice?: 'client' | 'affiliate' | 'admin';
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialRoleChoice = 'client'
}) => {
  const [selectedRole, setSelectedRole] = useState<'client' | 'affiliate' | 'admin'>(initialRoleChoice);
  const users = PracticeStore.getUsers();

  const clientUsers = users.filter((u) => u.role === 'client');
  const affiliateUsers = users.filter((u) => u.role === 'affiliate' && u.activeStatus !== 'deactivated');
  const adminUsers = users.filter((u) => u.role === 'admin');

  const [selectedUserId, setSelectedUserId] = useState<string>('');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    soundSynth.playCelestialChime();

    let targetUser: UserProfile | undefined;
    if (selectedUserId) {
      targetUser = users.find((u) => u.id === selectedUserId);
    } else {
      if (selectedRole === 'client') targetUser = clientUsers[0];
      if (selectedRole === 'affiliate') targetUser = affiliateUsers[0];
      if (selectedRole === 'admin') targetUser = adminUsers[0];
    }

    PracticeStore.setActiveRole(selectedRole);
    onSuccess(selectedRole, targetUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E8E2D8] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAF8F5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pb-5 border-b border-[#E8E2D8]">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF3E3] border border-[#C59B4B]/30 flex items-center justify-center mx-auto text-[#C59B4B] shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#0F172A]">Practice Sign In</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Select your account type to access your private consultation sanctuary or practice desk.
          </p>
        </div>

        {/* Prototype Truthfulness Notice */}
        <div className="my-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-semibold">Demonstration Authentication Screen</strong>
            This is a prototype authentication view. A real authentication provider (e.g. OAuth / Identity Provider) is not yet connected. Do not enter real passwords or personal credentials.
          </div>
        </div>

        {/* Role Selector Tabs (3 Choices) */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] mb-5">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('client');
              setSelectedUserId(clientUsers[0]?.id || '');
              soundSynth.playSoftTap();
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              selectedRole === 'client'
                ? 'bg-white text-[#0F172A] shadow-sm border border-[#E8E2D8]'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <User className="w-4 h-4 text-[#C59B4B]" />
            <span>Client</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('affiliate');
              setSelectedUserId(affiliateUsers[0]?.id || '');
              soundSynth.playSoftTap();
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              selectedRole === 'affiliate'
                ? 'bg-white text-[#0F172A] shadow-sm border border-[#E8E2D8]'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Briefcase className="w-4 h-4 text-[#C59B4B]" />
            <span>Affiliate</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setSelectedUserId(adminUsers[0]?.id || '');
              soundSynth.playSoftTap();
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              selectedRole === 'admin'
                ? 'bg-white text-[#0F172A] shadow-sm border border-[#E8E2D8]'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#C59B4B]" />
            <span>Admin</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
              Select Demo Profile
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] focus:outline-none focus:border-[#C59B4B]"
            >
              {selectedRole === 'client' &&
                clientUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.email}
                  </option>
                ))}

              {selectedRole === 'affiliate' &&
                affiliateUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.specialty}) — {u.email}
                  </option>
                ))}

              {selectedRole === 'admin' &&
                adminUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.email} (Full Platform Access)
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
              Demo Password
            </label>
            <input
              type="password"
              value="••••••••••••"
              disabled
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5]/60 text-xs text-[#94A3B8] cursor-not-allowed"
            />
            <span className="text-[10px] text-[#94A3B8] block">
              Pre-filled demo credentials for session evaluation.
            </span>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0F172A] text-white text-xs font-semibold hover:bg-[#C59B4B] hover:text-[#0F172A] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Enter {selectedRole === 'client' ? 'Client Sanctuary' : selectedRole === 'affiliate' ? 'Practitioner Desk' : 'Admin Suite'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 mt-5 border-t border-[#E8E2D8] text-center text-[11px] text-[#78716C]">
          <span>Need help? Contact practice administration at </span>
          <a href="mailto:demo@example.com" className="text-[#C59B4B] hover:underline font-mono">
            demo@example.com
          </a>
        </div>
      </div>
    </div>
  );
};
