import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { soundSynth } from '../../utils/soundAmbience';
import { DEFAULT_CREDENTIALS } from '../../utils/cryptoAuth';
import {
  X,
  Lock,
  User,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Eye,
  EyeOff,
  CheckCircle2,
  Key
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
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  const [selectedRole, setSelectedRole] = useState<'client' | 'affiliate' | 'admin'>(initialRoleChoice);
  const users = PracticeStore.getUsers();

  const roleUsers = users.filter((u) => {
    if (selectedRole === 'affiliate') return u.role === 'affiliate' && u.activeStatus !== 'deactivated';
    return u.role === selectedRole;
  });

  const [selectedUserId, setSelectedUserId] = useState<string>(roleUsers[0]?.id || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Sync default credentials and selected user when role changes
  useEffect(() => {
    setAuthError(null);
    const available = users.filter((u) => {
      if (selectedRole === 'affiliate') return u.role === 'affiliate' && u.activeStatus !== 'deactivated';
      return u.role === selectedRole;
    });

    const primaryUser = available[0];
    if (primaryUser) {
      setSelectedUserId(primaryUser.id);
      setEmail(primaryUser.email);
    } else {
      setEmail(
        selectedRole === 'admin'
          ? DEFAULT_CREDENTIALS.admin.email
          : selectedRole === 'affiliate'
          ? DEFAULT_CREDENTIALS.affiliate.email
          : DEFAULT_CREDENTIALS.client.email
      );
    }

    const initialPwd =
      selectedRole === 'admin'
        ? (import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD || 'SanctuaryAdmin2026!')
        : selectedRole === 'affiliate'
        ? (import.meta.env.VITE_DEFAULT_AFFILIATE_PASSWORD || 'Practitioner2026!')
        : (import.meta.env.VITE_DEFAULT_CLIENT_PASSWORD || 'ClientPass2026!');

    setPassword(initialPwd);
  }, [selectedRole]);

  if (!isOpen) return null;

  // Handle selecting a specific account from the dropdown
  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    const found = users.find((u) => u.id === userId);
    if (found) {
      setEmail(found.email);
      setAuthError(null);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);

    try {
      const result = await PracticeStore.authenticateUser(email, password, selectedRole);

      if (!result.success || !result.user) {
        soundSynth.playSoftTap();
        setAuthError(result.error || 'Authentication failed. Please check credentials.');
        setIsAuthenticating(false);
        return;
      }

      soundSynth.playCelestialChime();
      PracticeStore.setActiveRole(selectedRole);
      onSuccess(selectedRole, result.user);
      onClose();
    } catch (err: any) {
      setAuthError(err?.message || 'Unexpected authentication error.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Instant 1-click entry for smooth navigation
  const handleQuickEnter = () => {
    soundSynth.playCelestialChime();
    const targetUser = users.find((u) => u.id === selectedUserId) || roleUsers[0];
    PracticeStore.setActiveRole(selectedRole);
    onSuccess(selectedRole, targetUser);
    onClose();
  };

  const fillDefaultPassword = () => {
    soundSynth.playSoftTap();
    if (selectedRole === 'admin') {
      setPassword(import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD || 'SanctuaryAdmin2026!');
    } else if (selectedRole === 'affiliate') {
      setPassword(import.meta.env.VITE_DEFAULT_AFFILIATE_PASSWORD || 'Practitioner2026!');
    } else {
      setPassword(import.meta.env.VITE_DEFAULT_CLIENT_PASSWORD || 'ClientPass2026!');
    }
    setAuthError(null);
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
            Access your private consultation sanctuary, practitioner caseload, or director suite.
          </p>
        </div>

        {/* Role Selector Tabs (3 Choices) */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] my-4">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('client');
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

        {/* Auth Error Banner */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{authError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSignIn} className="space-y-3.5">
          {/* Account Profile Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
              Select {selectedRole === 'admin' ? 'Administrator' : selectedRole === 'affiliate' ? 'Practitioner' : 'Client'} Profile
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => handleSelectUser(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] focus:outline-none focus:border-[#C59B4B]"
            >
              {roleUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
              Account Email or Username
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@purvaphalguni.com or admin"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] focus:outline-none focus:border-[#C59B4B]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                Password
              </label>
              <span className="text-[10px] text-emerald-800 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Salted SHA-256</span>
              </span>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isDemoMode ? "Enter password (e.g. SanctuaryAdmin2026! or admin)" : "Enter account password"}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] focus:outline-none focus:border-[#C59B4B]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Credential Hint */}
          <div className="p-2.5 rounded-xl bg-[#FCFBF9] border border-[#E8E2D8] text-[11px] text-[#64748B] flex items-center justify-between">
            <div className="truncate pr-2">
              <span className="font-semibold text-[#0F172A]">Accepted: </span>
              <code className="text-[#C59B4B] bg-[#FAF3E3] px-1.5 py-0.5 rounded font-mono text-[10px]">
                {selectedRole === 'admin'
                  ? 'admin or SanctuaryAdmin2026!'
                  : selectedRole === 'affiliate'
                  ? 'affiliate or Practitioner2026!'
                  : 'client or ClientPass2026!'}
              </code>
            </div>
            <button
              type="button"
              onClick={fillDefaultPassword}
              className="text-[#A87F32] hover:text-[#0F172A] font-semibold text-[10px] shrink-0 underline"
            >
              Auto-Fill
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0F172A] text-white text-xs font-semibold hover:bg-[#C59B4B] hover:text-[#0F172A] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <span>
              {isAuthenticating
                ? 'Verifying Hash...'
                : `Enter ${selectedRole === 'client' ? 'Client Sanctuary' : selectedRole === 'affiliate' ? 'Practitioner Desk' : 'Admin Suite'}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Direct 1-Click Entry */}
          <button
            type="button"
            onClick={handleQuickEnter}
            className="w-full py-2 px-3 rounded-xl bg-[#FAF3E3]/80 border border-[#C59B4B]/30 text-[#7A5B20] text-xs font-medium hover:bg-[#FAF3E3] transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />
            <span>⚡ Instant 1-Click Entry as {selectedRole === 'admin' ? 'Director Admin' : selectedRole === 'affiliate' ? 'Practitioner' : 'Client'}</span>
          </button>
        </form>

        <div className="pt-4 mt-5 border-t border-[#E8E2D8] text-center text-[11px] text-[#78716C] flex items-center justify-between">
          <span>Admin passwords can be changed in Admin Suite Settings.</span>
          <span className="font-mono text-[10px] text-[#A87F32]">v2.4 Cryptographic</span>
        </div>
      </div>
    </div>
  );
};
