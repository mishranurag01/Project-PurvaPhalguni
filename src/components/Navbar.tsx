import React, { useState } from 'react';
import { MagneticButton } from './MagneticButton';
import { Sparkles, Compass, BookOpen, User, Users, Volume2, VolumeX, Eye, Menu, X, ArrowRight } from 'lucide-react';
import { soundSynth } from '../utils/soundAmbience';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection,
  reducedMotion,
  setReducedMotion,
  isMuted,
  setIsMuted,
  onOpenBooking
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundSynth.isMuted = nextMuted;
    if (!nextMuted) {
      soundSynth.playCelestialChime();
    }
  };

  const navItems = [
    { id: 'sanctuary', label: 'Sanctuary' },
    { id: 'services', label: 'Consultations' },
    { id: 'workspace', label: 'Astrology Workspace' },
    { id: 'study', label: 'Shastras & Lore' },
    { id: 'portal', label: 'Client Enclave' },
    { id: 'affiliate', label: 'Practitioner' }
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with celestial glyph */}
        <div 
          onClick={() => handleNavClick('sanctuary')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-white border border-[#E8E2D8] group-hover:border-[#C59B4B] flex items-center justify-center transition-all shadow-xs">
            <svg className="w-5 h-5 text-[#C59B4B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" stroke="#E8E2D8" />
              <path d="M12 3a9 9 0 0 0 0 18 4.5 4.5 0 0 1 0-9 4.5 4.5 0 0 0 0-9z" fill="#C59B4B" fillOpacity="0.25" />
              <circle cx="12" cy="7.5" r="1" fill="#C59B4B" />
              <circle cx="12" cy="16.5" r="1" fill="#0F172A" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
              PurvaPhalungi
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-[#78716C] -mt-1 font-mono">
              Vedic Celestial Sanctuary
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-xs tracking-wider uppercase transition-colors relative py-1 cursor-pointer font-medium ${
                activeSection === item.id
                  ? 'text-[#0F172A] font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C59B4B] rounded-full"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Desktop Utility Toggles & Magnetic CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Celestial Chimes' : 'Mute Ambient Audio'}
            className="p-2 rounded-lg border border-[#E8E2D8] bg-white text-[#64748B] hover:text-[#0F172A] hover:border-[#C59B4B]/60 transition-colors"
            aria-label="Toggle ambient chimes"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C59B4B]" />}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            title={reducedMotion ? 'Enable Fluid Motion' : 'Enable Reduced Motion'}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${
              reducedMotion
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-[#64748B] border-[#E8E2D8] hover:text-[#0F172A]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[10px]">{reducedMotion ? 'Motion: Calm' : 'Motion: Fluid'}</span>
          </button>

          {/* Magnetic CTA for Book a Reading */}
          <MagneticButton
            variant="primary"
            onClick={onOpenBooking}
            reducedMotion={reducedMotion}
            className="text-xs py-2 px-4 ml-1"
          >
            <span>Book a Reading</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C59B4B]" />
          </MagneticButton>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg border border-[#E8E2D8] bg-white text-[#64748B]"
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C59B4B]" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-[#E8E2D8] bg-white text-[#0F172A]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-[#E8E2D8] p-5 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="block w-full text-left py-2 text-sm font-medium text-[#0F172A] border-b border-[#F5F2EB]"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2">
            <MagneticButton
              variant="primary"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              reducedMotion={reducedMotion}
              className="w-full text-xs py-2.5"
            >
              Book a Reading
            </MagneticButton>
          </div>
        </div>
      )}
    </header>
  );
};
