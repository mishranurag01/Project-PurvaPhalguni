import React, { useState, useEffect } from 'react';
import { WebsiteSettings } from '../../types/practice';
import { MagneticButton } from '../MagneticButton';
import { Sparkles, Calendar, Lock, Menu, X, ArrowRight, ShieldCheck, Compass } from 'lucide-react';

interface PublicHeaderProps {
  settings: WebsiteSettings;
  activeTab: 'home' | 'services' | 'about' | 'booking';
  onNavigate: (tab: 'home' | 'services' | 'about' | 'booking') => void;
  onOpenSignIn: () => void;
  onReplayIntro?: () => void;
  reducedMotion?: boolean;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  settings,
  activeTab,
  onNavigate,
  onOpenSignIn,
  onReplayIntro,
  reducedMotion = false
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['observatory', 'medical-astrology', 'cartomancy', 'insights', 'about-section'];
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveNav(sections[i]);
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveNav('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId?: string, tabFallback: 'home' | 'services' | 'about' | 'booking' = 'home') => {
    if (sectionId) {
      setActiveNav(sectionId);
      if (activeTab !== 'home') {
        onNavigate('home');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 120);
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else {
      setActiveNav('');
      onNavigate(tabFallback);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8]">
      {/* Discreet Educational & Non-Medical Notice */}
      <div className="bg-[#FAF3E3] border-b border-[#EBDAB5]/60 py-1.5 px-4 text-center text-[11px] text-[#7A5B20] font-sans flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#C59B4B] shrink-0" />
        <span className="truncate max-w-4xl">
          <strong>Reflective & Symbolic:</strong> Services provide contemplative astronomical insight and are strictly not medical diagnosis or treatment.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: EXACT BRAND NAME — PURVAPHALGUNI */}
        <div
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer select-none group flex items-center gap-3 transition-transform duration-300 active:scale-95"
          role="button"
          aria-label="PURVAPHALGUNI Home"
        >
          {/* Subtle Astronomical Lens Emblem */}
          <div className="w-9 h-9 rounded-xl bg-white border border-[#E8E2D8] group-hover:border-[#C59B4B] flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:scale-105">
            <svg
              className="w-4.5 h-4.5 text-[#C59B4B] transition-transform duration-500 group-hover:rotate-45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="9" stroke="#E8E2D8" />
              <polygon points="12,3 21,12 12,21 3,12" stroke="#C59B4B" fill="rgba(197, 155, 75, 0.15)" />
              <circle cx="12" cy="12" r="2" fill="#0F172A" />
            </svg>
          </div>

          <div>
            <span
              className="font-serif text-xl sm:text-2xl font-light tracking-[0.16em] sm:tracking-[0.2em] text-[#0F172A] block leading-none group-hover:text-[#A87F32] transition-colors duration-200"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
            >
              PURVAPHALGUNI
            </span>
            <span className="text-[9px] uppercase tracking-[0.24em] text-[#78716C] mt-1 block font-mono">
              Medical Astrology & Cartomancy
            </span>
          </div>
        </div>

        {/* 
          Center: Minimalist Premium Navigation
          - Observatory
          - Medical Astrology
          - Cartomancy
          - Insights
          - About
        */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] font-medium text-[#526071]">
          <button
            onClick={() => handleNavClick('observatory')}
            className={`px-3.5 py-2 rounded-xl transition-all duration-300 transform cursor-pointer active:scale-95 border ${
              activeNav === 'observatory'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold border-[#C59B4B] scale-105 shadow-xs ring-1 ring-[#C59B4B]/30'
                : 'border-transparent hover:border-[#E8E2D8] hover:bg-white hover:scale-105 hover:text-[#0F172A]'
            }`}
          >
            Observatory
          </button>

          <button
            onClick={() => handleNavClick('medical-astrology')}
            className={`px-3.5 py-2 rounded-xl transition-all duration-300 transform cursor-pointer active:scale-95 border ${
              activeNav === 'medical-astrology'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold border-[#C59B4B] scale-105 shadow-xs ring-1 ring-[#C59B4B]/30'
                : 'border-transparent hover:border-[#E8E2D8] hover:bg-white hover:scale-105 hover:text-[#0F172A]'
            }`}
          >
            Medical Astrology
          </button>

          <button
            onClick={() => handleNavClick('cartomancy')}
            className={`px-3.5 py-2 rounded-xl transition-all duration-300 transform cursor-pointer active:scale-95 border ${
              activeNav === 'cartomancy'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold border-[#C59B4B] scale-105 shadow-xs ring-1 ring-[#C59B4B]/30'
                : 'border-transparent hover:border-[#E8E2D8] hover:bg-white hover:scale-105 hover:text-[#0F172A]'
            }`}
          >
            Cartomancy
          </button>

          <button
            onClick={() => handleNavClick('insights')}
            className={`px-3.5 py-2 rounded-xl transition-all duration-300 transform cursor-pointer active:scale-95 border ${
              activeNav === 'insights'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold border-[#C59B4B] scale-105 shadow-xs ring-1 ring-[#C59B4B]/30'
                : 'border-transparent hover:border-[#E8E2D8] hover:bg-white hover:scale-105 hover:text-[#0F172A]'
            }`}
          >
            Insights
          </button>

          <button
            onClick={() => handleNavClick('about-section', 'about')}
            className={`px-3.5 py-2 rounded-xl transition-all duration-300 transform cursor-pointer active:scale-95 border ${
              activeNav === 'about-section'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold border-[#C59B4B] scale-105 shadow-xs ring-1 ring-[#C59B4B]/30'
                : 'border-transparent hover:border-[#E8E2D8] hover:bg-white hover:scale-105 hover:text-[#0F172A]'
            }`}
          >
            About
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Replay Cinematic Ignition Button */}
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="text-[11px] uppercase tracking-wider text-[#78716C] hover:text-[#C59B4B] px-2.5 py-1.5 rounded-lg hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
              title="Experience Celestial Ignition again"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />
              <span className="hidden xl:inline">Ignition</span>
            </button>
          )}

          {/* Discreet Sign In Action */}
          <button
            onClick={onOpenSignIn}
            className="px-3 py-2 rounded-xl border border-[#E8E2D8] bg-white text-xs font-medium text-[#526071] hover:text-[#0F172A] hover:border-[#C59B4B] hover:scale-105 active:scale-95 flex items-center gap-1.5 transition-all duration-200 shadow-2xs cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#C59B4B]" />
            <span>Sign In</span>
          </button>

          {/* Primary CTA: Enter Observatory */}
          <MagneticButton
            variant="primary"
            onClick={() => {
              onNavigate('booking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            reducedMotion={reducedMotion}
            className="text-xs py-2.5 px-4.5 shadow-xs hover:scale-105 active:scale-95 transition-transform"
          >
            <Compass className="w-3.5 h-3.5 text-[#C59B4B]" />
            <span>Enter Observatory</span>
          </MagneticButton>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl border border-[#E8E2D8] bg-white text-[#0F172A] cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-[#E8E2D8] p-5 space-y-3 animate-fade-in-up">
          <button
            onClick={() => handleNavClick('observatory')}
            className="block w-full text-left py-2 text-sm text-[#0F172A] font-medium"
          >
            Observatory
          </button>
          <button
            onClick={() => handleNavClick('medical-astrology')}
            className="block w-full text-left py-2 text-sm text-[#0F172A] font-medium"
          >
            Medical Astrology
          </button>
          <button
            onClick={() => handleNavClick('cartomancy')}
            className="block w-full text-left py-2 text-sm text-[#0F172A] font-medium"
          >
            Cartomancy
          </button>
          <button
            onClick={() => handleNavClick('insights')}
            className="block w-full text-left py-2 text-sm text-[#0F172A] font-medium"
          >
            Insights
          </button>
          <button
            onClick={() => handleNavClick('about-section', 'about')}
            className="block w-full text-left py-2 text-sm text-[#0F172A] font-medium"
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
              className="w-full text-xs py-3"
            >
              Enter Observatory
            </MagneticButton>

            <button
              onClick={() => {
                onOpenSignIn();
                setMobileOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-medium bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl text-[#0F172A] flex items-center justify-center gap-2 hover:border-[#C59B4B]"
            >
              <Lock className="w-3.5 h-3.5 text-[#C59B4B]" />
              <span>Portal Sign In</span>
            </button>

            {onReplayIntro && (
              <button
                onClick={() => {
                  onReplayIntro();
                  setMobileOpen(false);
                }}
                className="w-full py-2 text-center text-[11px] uppercase tracking-wider text-[#78716C] hover:text-[#C59B4B] flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />
                <span>Replay Celestial Ignition</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
