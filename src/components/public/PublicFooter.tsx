import React, { useState } from 'react';
import { WebsiteSettings, UserRole } from '../../types/practice';
import { Sparkles, Shield, HeartPulse, Lock, Mail, Phone, MapPin, X } from 'lucide-react';

interface PublicFooterProps {
  settings: WebsiteSettings;
  onOpenSignIn: () => void;
  onNavigate: (tab: 'home' | 'services' | 'about' | 'booking') => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  settings,
  onOpenSignIn,
  onNavigate
}) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'consent' | 'disclaimer' | null>(null);

  return (
    <footer className="bg-[#0F172A] text-[#FAF8F5] pt-16 pb-12 border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1E293B]">
          {/* Brand & Purpose Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C59B4B]" />
              <span className="font-serif text-2xl font-light tracking-[0.16em] text-white">
                PURVAPHALGUNI
              </span>
            </div>

            <p className="text-xs text-[#C59B4B] uppercase tracking-[0.2em] font-mono">
              Medical Astrology & Cartomancy
            </p>

            <p className="text-xs text-[#94A3B8] max-w-md leading-relaxed">
              Where celestial patterns meet the language of health and human experience. An intellectual observatory combining classical sidereal mechanics with hermetic symbolic cartomancy.
            </p>

            <div className="p-3.5 rounded-xl bg-[#1E293B]/70 border border-[#334155] text-xs text-[#CBD5E1] space-y-1.5 max-w-md">
              <div className="flex items-center gap-2 text-[#C59B4B] font-semibold text-[11px] uppercase tracking-wider">
                <HeartPulse className="w-4 h-4" />
                <span>Mandatory Non-Medical Disclaimer</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#94A3B8]">
                {settings.requiredDisclaimer}
              </p>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#C59B4B] mb-3">
              Practice Navigation
            </h5>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Home Sanctuary
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Services & Plans (M+A, M+C, M+A+C)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  About & Ethical Code
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Book a Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Portals */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#C59B4B] mb-3">
              Sanctuary Gates
            </h5>
            <div className="space-y-2 text-xs text-[#94A3B8] mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C59B4B]" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C59B4B]" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C59B4B] shrink-0 mt-0.5" />
                <span>{settings.officeLocation}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1E293B] space-y-2 text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#64748B] block font-mono">
                Practice Access:
              </span>
              <div>
                <button
                  onClick={onOpenSignIn}
                  className="px-3 py-1.5 rounded-lg bg-[#1E293B] text-white hover:bg-[#334155] text-xs transition-colors inline-flex items-center gap-1.5 border border-white/10"
                >
                  <Lock className="w-3 h-3 text-[#C59B4B]" />
                  <span>Portal Sign In</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <p>© {new Date().getFullYear()} PURVAPHALGUNI. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-[#CBD5E1] transition-colors">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => setActiveModal('terms')} className="hover:text-[#CBD5E1] transition-colors">
              Terms of Service
            </button>
            <span>·</span>
            <button onClick={() => setActiveModal('consent')} className="hover:text-[#CBD5E1] transition-colors">
              Consent Policy
            </button>
            <span>·</span>
            <button onClick={() => setActiveModal('disclaimer')} className="hover:text-[#CBD5E1] transition-colors">
              Legal Disclaimer
            </button>
          </div>
        </div>
      </div>

      {/* Policy Dialog Modals */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 text-[#0F172A] relative shadow-2xl border border-[#E8E2D8]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <h4 className="font-serif text-xl font-bold text-[#0F172A] capitalize">
                {activeModal} Document
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#94A3B8] hover:text-[#0F172A] text-lg font-mono p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 text-xs text-[#526071] leading-relaxed max-h-80 overflow-y-auto space-y-3">
              {activeModal === 'privacy' && <p>{settings.privacyPolicyText}</p>}
              {activeModal === 'terms' && <p>{settings.termsText}</p>}
              {activeModal === 'consent' && <p>{settings.consentPolicyText}</p>}
              {activeModal === 'disclaimer' && (
                <div className="space-y-2">
                  <p className="font-semibold text-[#0F172A]">{settings.requiredDisclaimer}</p>
                  <p>
                    All cartomancy readings, astrological charts, transit evaluations, and practitioner notes reflect symbolic archetypes and spiritual philosophies. Clients retain full autonomy and are advised to maintain active relationships with board-certified physicians, therapists, and healthcare specialists.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#E8E2D8] text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#0F172A] text-white rounded-lg text-xs font-medium hover:bg-[#1E293B]"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
