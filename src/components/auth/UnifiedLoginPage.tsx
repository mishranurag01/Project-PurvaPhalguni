import React, { useState } from 'react';
import { usePractice } from '../../context/PracticeContext';
import { isDemoModeEnabled, getDemoCredentials, isProductionEnvironment } from '../../utils/cryptoAuth';
import { soundSynth } from '../../utils/soundAmbience';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  User,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Compass,
  Phone
} from 'lucide-react';
import { MagneticButton } from '../MagneticButton';

interface UnifiedLoginPageProps {
  onSuccessRedirect?: (role: string) => void;
  onCancel?: () => void;
}

export const UnifiedLoginPage: React.FC<UnifiedLoginPageProps> = ({
  onSuccessRedirect,
  onCancel
}) => {
  const { signIn, registerClient, navigateTo } = usePractice();
  const isDemo = isDemoModeEnabled();
  const isProd = isProductionEnvironment();

  // Mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status & feedback state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Demo helper state (only visible in dev demo mode)
  const [showDemoHelper, setShowDemoHelper] = useState(false);

  // Handle Unified Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await signIn(cleanEmail, cleanPassword);
      soundSynth.playCelestialChime();
      setSuccessNotice(`Authentication verified. Entering ${user.role} portal...`);
      if (onSuccessRedirect) {
        onSuccessRedirect(user.role);
      }
    } catch (err: any) {
      soundSynth.playSoftTap();
      const message = err?.message || 'Invalid email or password. Please verify your credentials.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Client Self-Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const cleanName = regName.trim();
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanPassword = regPassword.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!cleanPassword || cleanPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await registerClient({
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        phone: regPhone.trim() || undefined
      });
      soundSynth.playCelestialChime();
      setSuccessNotice(`Client sanctuary established for ${user.name}. Entering portal...`);
      if (onSuccessRedirect) {
        onSuccessRedirect('client');
      }
    } catch (err: any) {
      soundSynth.playSoftTap();
      setErrorMessage(err?.message || 'Could not complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill for development demo credentials
  const fillCredential = (targetEmail: string, targetPass: string) => {
    if (!isDemo) return;
    soundSynth.playSoftTap();
    setEmail(targetEmail);
    setPassword(targetPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-md w-full space-y-6">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-[#E8E2D8] p-8 sm:p-10 shadow-xl shadow-slate-900/5 relative overflow-hidden">
          {/* Subtle Top Celestial Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C59B4B]/30 via-[#C59B4B] to-[#C59B4B]/30" />

          {/* Header & Emblem */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF3E3] border border-[#C59B4B]/40 flex items-center justify-center mx-auto shadow-2xs group">
              <svg
                className="w-7 h-7 text-[#C59B4B]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="9" stroke="#E8E2D8" />
                <polygon points="12,3 21,12 12,21 3,12" stroke="#C59B4B" fill="rgba(197, 155, 75, 0.2)" />
                <circle cx="12" cy="12" r="2" fill="#0F172A" />
              </svg>
            </div>

            <div>
              <span
                className="font-serif text-2xl sm:text-3xl font-light tracking-[0.18em] text-[#0F172A] block leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
              >
                PURVAPHALGUNI
              </span>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#78716C] font-mono mt-1">
                Sanctuary Gateway — Unified Access
              </p>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed max-w-sm mx-auto">
              {authMode === 'login'
                ? 'Sign in with your registered credentials. Access will be directed to your verified portal.'
                : 'Create your private client sanctuary to book consultations and review astrological folios.'}
            </p>
          </div>

          {/* Validation / Error Message Area */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Success Notice Area */}
          {successNotice && (
            <div
              role="status"
              className="mb-6 p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">{successNotice}</div>
            </div>
          )}

          {/* Mode Switch Tabs (Sign In vs Register Client) */}
          <div className="flex rounded-xl bg-[#FAF8F5] p-1 border border-[#E8E2D8] mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                authMode === 'login'
                  ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                authMode === 'register'
                  ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              New Client Account
            </button>
          </div>

          {/* 1. UNIFIED LOGIN FORM (Used for Client, Affiliated, and Admin) */}
          {authMode === 'login' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4" noValidate>
              {/* Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#475569]"
                >
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@purvaphalguni.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B4B] focus:border-[#C59B4B] transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Input with Show/Hide Control */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#475569]"
                  >
                    Account Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    disabled={isSubmitting}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B4B] focus:border-[#C59B4B] transition-all disabled:opacity-50 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#0F172A] focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim() || !password.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C59B4B] focus:ring-offset-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Sanctuary</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C59B4B]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* 2. CLIENT REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5" noValidate>
              <div className="space-y-1">
                <label
                  htmlFor="reg-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#475569]"
                >
                  Full Legal Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B4B] transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#475569]"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="client@purvaphalguni.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B4B] transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="reg-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#475569]"
                >
                  Create Secure Password (8+ chars)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-password"
                    name="password"
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    disabled={isSubmitting}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B4B] transition-all disabled:opacity-50 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    disabled={isSubmitting}
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#0F172A] focus:outline-none transition-colors"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="reg-phone"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#475569]"
                >
                  Contact Telephone (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    disabled={isSubmitting}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (555) 010-0099"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B4B] transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF3E3] border border-[#EBDAB5]/60 text-[11px] text-[#7A5B20] leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C59B4B] shrink-0 mt-0.5" />
                <span>
                  By registering, you consent to encrypted storage of your consultation history and agree to PurvaPhalguni non-medical terms.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !regName.trim() || !regEmail.trim() || regPassword.length < 8}
                  className="w-full py-3 px-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C59B4B]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Establishing Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C59B4B]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Discreet Return to Sanctuary Link */}
          <div className="mt-6 pt-4 border-t border-[#E8E2D8] text-center">
            <button
              type="button"
              onClick={() => {
                if (onCancel) onCancel();
                else navigateTo('/');
              }}
              className="text-xs text-[#78716C] hover:text-[#0F172A] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#C59B4B]" />
              <span>Return to Public Observatory</span>
            </button>
          </div>
        </div>

        {/* Development Environment Helper: STRICTLY HIDDEN IN PRODUCTION */}
        {isDemo && !isProd && (
          <div className="bg-[#0F172A]/95 text-white rounded-2xl border border-[#C59B4B]/40 p-4 shadow-lg backdrop-blur-md">
            <button
              type="button"
              onClick={() => setShowDemoHelper(!showDemoHelper)}
              className="w-full flex items-center justify-between text-xs text-[#CBD5E1] hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono uppercase tracking-wider text-[11px] text-[#C59B4B] font-semibold">
                  Development Demo Accounts (Dev Only)
                </span>
              </div>
              {showDemoHelper ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDemoHelper && (
              <div className="mt-3 pt-3 border-t border-[#334155] space-y-2 text-xs">
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Click any account below to autofill demonstration credentials into the single unified login form:
                </p>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {/* Admin Account */}
                  <button
                    type="button"
                    onClick={() => fillCredential('mishranurag01@gmail.com', 'SanctuaryAdmin2026!')}
                    className="p-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-left border border-white/5 hover:border-[#C59B4B]/50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 uppercase font-mono">
                          Admin
                        </span>
                        <span>Anurag Mishra (Lead Administrator)</span>
                      </div>
                      <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
                        mishranurag01@gmail.com
                      </div>
                    </div>
                    <span className="text-[10px] text-[#C59B4B] underline">Fill</span>
                  </button>

                  {/* Affiliate Account */}
                  <button
                    type="button"
                    onClick={() => fillCredential('affiliate@purvaphalguni.com', 'Practitioner2026!')}
                    className="p-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-left border border-white/5 hover:border-[#C59B4B]/50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200 uppercase font-mono">
                          Affiliate
                        </span>
                        <span>Dr. Jyotish Patel (Practitioner)</span>
                      </div>
                      <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
                        affiliate@purvaphalguni.com
                      </div>
                    </div>
                    <span className="text-[10px] text-[#C59B4B] underline">Fill</span>
                  </button>

                  {/* Client Account */}
                  <button
                    type="button"
                    onClick={() => fillCredential('client@purvaphalguni.com', 'ClientPass2026!')}
                    className="p-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-left border border-white/5 hover:border-[#C59B4B]/50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 uppercase font-mono">
                          Client
                        </span>
                        <span>Elena Rostova (Client)</span>
                      </div>
                      <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
                        client@purvaphalguni.com
                      </div>
                    </div>
                    <span className="text-[10px] text-[#C59B4B] underline">Fill</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
