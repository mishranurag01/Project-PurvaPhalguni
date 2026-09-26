import React, { useState } from 'react';
import { WebsiteSettings, UserRole } from '../../types/practice';
import { MagneticButton } from '../MagneticButton';
import { Sparkles, Calendar, Shield, Lock, Menu, X, ArrowRight, HeartPulse } from 'lucide-react';

interface PublicHeaderProps {
  settings: WebsiteSettings;
  activeTab: 'home' | 'services' | 'about' | 'booking';
  onNavigate: (tab: 'home' | 'services' | 'about' | 'booking') => void;
  onOpenPortal: (role: UserRole) => void;
  reducedMotion?: boolean;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  settings,
  activeTab,
  onNavigate,
  onOpenPortal,
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
          onClick={() => onNavigate('home')}
          className="cursor-pointer select-none group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D8] group-hover:border-[#C59B4B] flex items-center justify-center transition-all shadow-xs">
            <svg className="w-5 h-5 text-[#C59B4B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" stroke="#E8E2D8" />
              <path d="M12 3a9 9 0 0 0 0 18 4.5 4.5 0 0 1 0-9 4.5 4.5 0 0 0 0-9z" fill="#C59B4B" fillOpacity="0.25" />
              <circle cx="12" cy="7.5" r="1.2" fill="#C59B4B" />
              <circle cx="12" cy="16.5" r="1.2" fill="#0F172A" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#0F172A] block leading-none">
              {settings.brandName}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#78716C] mt-1 block font-mono">
              Medical Astrology & Cartomancy
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-wider font-medium">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors py-1 relative ${
              activeTab === 'home' ? 'text-[#0F172A] font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Home
            {activeTab === 'home' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C59B4B]" />}
          </button>

          <button
            onClick={() => onNavigate('services')}
            className={`transition-colors py-1 relative ${
              activeTab === 'services' ? 'text-[#0F172A] font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Services & Plans
            {activeTab === 'services' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C59B4B]" />}
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors py-1 relative ${
              activeTab === 'about' ? 'text-[#0F172A] font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            About & Ethics
            {activeTab === 'about' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C59B4B]" />}
          </button>

          <a
            href="#how-it-works"
            onClick={(e) => {
              if (activeTab !== 'home') {
                e.preventDefault();
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="text-[#64748B] hover:text-[#0F172A] transition-colors py-1"
          >
            How It Works
          </a>

          <a
            href="#reviews"
            onClick={(e) => {
              if (activeTab !== 'home') {
                e.preventDefault();
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="text-[#64748B] hover:text-[#0F172A] transition-colors py-1"
          >
            Client Reviews
          </a>

          <a
            href="#faq"
            onClick={(e) => {
              if (activeTab !== 'home') {
                e.preventDefault();
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="text-[#64748B] hover:text-[#0F172A] transition-colors py-1"
          >
            FAQ
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Sign In Dropdown / Portals */}
          <div className="relative group">
            <button className="px-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-white text-xs text-[#0F172A] hover:border-[#C59B4B] flex items-center gap-1.5 transition-colors">
              <Lock className="w-3.5 h-3.5 text-[#C59B4B]" />
              <span>Portal Sign In</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-[#E8E2D8] py-2 hidden group-hover:block z-50">
              <button
                onClick={() => onOpenPortal('client')}
                className="w-full text-left px-4 py-2 text-xs text-[#0F172A] hover:bg-[#FAF8F5] transition-colors"
              >
                Client Portal
              </button>
              <button
                onClick={() => onOpenPortal('affiliate')}
                className="w-full text-left px-4 py-2 text-xs text-[#0F172A] hover:bg-[#FAF8F5] transition-colors"
              >
                Affiliate Practitioner Portal
              </button>
              <button
                onClick={() => onOpenPortal('admin')}
                className="w-full text-left px-4 py-2 text-xs text-[#0F172A] hover:bg-[#FAF8F5] transition-colors border-t border-[#E8E2D8]/60 font-semibold"
              >
                Admin Suite
              </button>
            </div>
          </div>

          {/* Book a Reading Magnetic CTA */}
          <MagneticButton
            variant="primary"
            onClick={() => onNavigate('booking')}
            reducedMotion={reducedMotion}
            className="text-xs py-2 px-4 shadow-xs"
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
            <div className="grid grid-cols-3 gap-1 pt-2">
              <button
                onClick={() => {
                  onOpenPortal('client');
                  setMobileOpen(false);
                }}
                className="py-1.5 text-center text-[10px] bg-[#FAF8F5] border border-[#E8E2D8] rounded text-[#0F172A]"
              >
                Client
              </button>
              <button
                onClick={() => {
                  onOpenPortal('affiliate');
                  setMobileOpen(false);
                }}
                className="py-1.5 text-center text-[10px] bg-[#FAF8F5] border border-[#E8E2D8] rounded text-[#0F172A]"
              >
                Affiliate
              </button>
              <button
                onClick={() => {
                  onOpenPortal('admin');
                  setMobileOpen(false);
                }}
                className="py-1.5 text-center text-[10px] bg-[#FAF8F5] border border-[#E8E2D8] rounded text-[#0F172A] font-semibold"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
