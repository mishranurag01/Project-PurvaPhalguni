import React from 'react';
import { Sparkles } from 'lucide-react';

interface FooterProps {
  onNavClick: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-[#0F172A] text-[#FAF8F5] pt-16 pb-12 mt-24 border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1E293B]">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C59B4B]" />
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                PurvaPhalungi
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] max-w-md leading-relaxed">
              A luminous Vedic astrology workspace and private celestial sanctuary. Classical Parashari algorithms, Sidereal Lahiri ephemeris, and refined psychological inquiry designed for sovereign thinkers.
            </p>
            <div className="pt-2 text-[11px] text-[#64748B]">
              Sidereal Precision · 27 Lunar Mansions · Zero Fatalism
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#C59B4B] mb-3">
              Sanctuary Gates
            </h5>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>
                <button onClick={() => onNavClick('sanctuary')} className="hover:text-white transition-colors">
                  Overview & Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('services')} className="hover:text-white transition-colors">
                  Curated Consultations
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('workspace')} className="hover:text-white transition-colors">
                  Sidereal Kundali Workspace
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('reviews')} className="hover:text-white transition-colors">
                  Client Testimonials
                </button>
              </li>
            </ul>
          </div>

          {/* Study & Shastras */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#C59B4B] mb-3">
              Shastric Studies
            </h5>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>
                <button onClick={() => onNavClick('study')} className="hover:text-white transition-colors">
                  Purva Phalguni Lore
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('study')} className="hover:text-white transition-colors">
                  27 Nakshatras Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('portal')} className="hover:text-white transition-colors">
                  Client Enclave & Journal
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('affiliate')} className="hover:text-white transition-colors">
                  Practitioner & Partner Desk
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <p>© {new Date().getFullYear()} PurvaPhalungi Celestial Sanctuary. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Private Client Enclave (Demo)</span>
            <span>·</span>
            <span>Parashari Jyotish Standard</span>
            <span>·</span>
            <span>Equinoctial Precession (Lahiri)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
