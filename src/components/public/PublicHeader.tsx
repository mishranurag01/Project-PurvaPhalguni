import React, { useState } from 'react';
import { WebsiteSettings, UserRole } from '../../types/practice';
import { MagneticButton } from '../MagneticButton';
import { Sparkles, Calendar, Shield, Lock, Menu, X, ArrowRight, HeartPulse } from 'lucide-react';

interface PublicHeaderProps {
  settings: WebsiteSettings;
  activeTab: 'home' | 'services' | 'about' | 'booking';
  onNavigate: (tab: 'home' | 'services' | 'about' | 'booking') => void;
  onOpenSignIn: () => void;
  reducedMotion?: boolean;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  settings,
  activeTab,
  onNavigate,
  onOpenSignIn,
  reducedMotion = false
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D8]">
      {/* Disclaimer Top Bar */}
      <div className="bg-[#FAF3E3] border-b border-[#EBDAB5] py-1.5 px-4 text-center text-[11px] text-[#7A5B20] font-sans flex items-center justify-center gap-2">
        <HeartPulse className="w-3.5 h-3.5 text-[#C59B4B] shrink-0" />
        <span className="truncate max-w-4xl">
          <strong>Non-Medical Disclaimer:</strong> Services are offered for reflective spiritual & educational insight only; not medical advice or diagnosis.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Name & Tagline */}
        <div
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer select-none group flex items-center gap-3 transition-transform duration-300 active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D8] group-hover:border-[#C59B4B] group-hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-xs">
            <svg className="w-5 h-5 text-[#C59B4B] transition-transform duration-500 group-hover:rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" stroke="#E8E2D8" />
              <path d="M12 3a9 9 0 0 0 0 18 4.5 4.5 0 0 1 0-9 4.5 4.5 0 0 0 0-9z" fill="#C59B4B" fillOpacity="0.25" />
              <circle cx="12" cy="7.5" r="1.2" fill="#C59B4B" />
              <circle cx="12" cy="16.5" r="1.2" fill="#0F172A" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#0F172A] block leading-none group-hover:text-[#A87F32] transition-colors duration-200">
              {settings.brandName || 'Purva Phalguni'}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#78716C] mt-1 block font-mono">
              Medical Astrology & Cartomancy
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs with Zoom Animations */}
        <nav className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-wider font-medium">
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 transform active:scale-95 ${
              activeTab === 'home'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-semibold scale-105 shadow-xs border border-[#C59B4B]/30'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white hover:scale-105 border border-transparent'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => {
              onNavigate('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 transform active:scale-95 ${
              activeTab === 'services'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-semibold scale-105 shadow-xs border border-[#C59B4B]/30'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white hover:scale-105 border border-transparent'
            }`}
          >
            Services & Plans
          </button>

          <button
            onClick={() => {
              onNavigate('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 transform active:scale-95 ${
              activeTab === 'about'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-semibold scale-105 shadow-xs border border-[#C59B4B]/30'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white hover:scale-105 border border-transparent'
            }`}
          >
            About & Ethics
          </button>

          <button
            onClick={() => {
              if (activeTab !== 'home') {
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              } else {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="px-3 py-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-white hover:scale-105 transition-all duration-200 transform active:scale-95 border border-transparent"
          >
            How It Works
          </button>

          <button
            onClick={() => {
              if (activeTab !== 'home') {
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              } else {
                document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="px-3 py-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-white hover:scale-105 transition-all duration-200 transform active:scale-95 border border-transparent"
          >
            Client Reviews
          </button>

          <button
            onClick={() => {
              if (activeTab !== 'home') {
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              } else {
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="px-3 py-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-white hover:scale-105 transition-all duration-200 transform active:scale-95 border border-transparent"
          >
            FAQ
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Sign In Action */}
          <button
            onClick={onOpenSignIn}
            className="px-3.5 py-2 rounded-xl border border-[#E8E2D8] bg-white text-xs font-semibold text-[#0F172A] hover:border-[#C59B4B] hover:text-[#C59B4B] hover:scale-105 active:scale-95 flex items-center gap-1.5 transition-all duration-200 shadow-2xs cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#C59B4B]" />
            <span>Sign In</span>
          </button>

          {/* Book a Reading Magnetic CTA */}
          <MagneticButton
            variant="primary"
            onClick={() => {
              onNavigate('booking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            reducedMotion={reducedMotion}
            className="text-xs py-2 px-4 shadow-xs hover:scale-105 active:scale-95 transition-transform"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C59B4B]" />
            <span>Book a Reading</span>
          </MagneticButton>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 rounded-lg border border-[#E8E2D8] bg-white text-[#0F172A]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-b border-[#E8E2D8] p-5 space-y-3">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-[#0F172A]"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('services');
              setMobileOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-[#0F172A]"
          >
            Services & Plans
          </button>
          <button
            onClick={() => {
              onNavigate('about');
              setMobileOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-[#0F172A]"
          >
            About & Ethics
          </button>
          <div className="pt-3 border-t border-[#E8E2D8] space-y-2">
            <MagneticButton
              variant="primary"
              onClick={() => {
                onNavigate('booking');
                setMobileOpen(false);
              }}
              className="w-full text-xs py-2.5"
            >
              Book a Reading
            </MagneticButton>
            <button
              onClick={() => {
                onOpenSignIn();
                setMobileOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-semibold bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl text-[#0F172A] flex items-center justify-center gap-2 hover:border-[#C59B4B]"
            >
              <Lock className="w-3.5 h-3.5 text-[#C59B4B]" />
              <span>Portal Sign In</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
