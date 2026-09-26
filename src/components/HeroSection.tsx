import React from 'react';
import { MagneticButton } from './MagneticButton';
import { Sparkles, Compass, ShieldCheck, ArrowRight, Sun, Moon } from 'lucide-react';

interface HeroSectionProps {
  onExploreServices: () => void;
  onOpenWorkspace: () => void;
  reducedMotion?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreServices,
  onOpenWorkspace,
  reducedMotion = false
}) => {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Central Content Column */}
      <div className="text-center max-w-3xl mx-auto relative z-10">
        {/* Subtle Celestial Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E8E2D8] shadow-xs text-xs font-medium text-[#78716C] mb-6 backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />
          <span>Vedic Parashari Precision · Sidereal Lahiri Ephemeris</span>
        </div>

        {/* Large Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-[#0F172A] tracking-tight leading-[1.08]">
          Where celestial precision meets{' '}
          <span className="italic font-normal text-[#0F172A] relative inline-block">
            quiet contemplation
            <span
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C59B4B]/60 to-transparent"
              aria-hidden="true"
            />
          </span>
          .
        </h1>

        {/* Philosophy Prose */}
        <p className="mt-6 text-base sm:text-lg text-[#526071] max-w-2xl mx-auto font-sans leading-relaxed">
          PurvaPhalungi is a modern celestial sanctuary and Vedic astrology workspace. We distill ancient sidereal mechanics into luminous clarity—free from superstition, fatalism, or outdated melodrama.
        </p>

        {/* Magnetic CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            variant="primary"
            onClick={onExploreServices}
            reducedMotion={reducedMotion}
            className="text-sm py-3 px-6 shadow-sm"
          >
            <span>Book a Reading</span>
            <ArrowRight className="w-4 h-4 text-[#C59B4B]" />
          </MagneticButton>

          <MagneticButton
            variant="secondary"
            onClick={onOpenWorkspace}
            reducedMotion={reducedMotion}
            className="text-sm py-3 px-6"
          >
            <Compass className="w-4 h-4 text-[#C59B4B]" />
            <span>Explore Astrology Workspace</span>
          </MagneticButton>
        </div>

        {/* Trust & Craft Indicators */}
        <div className="mt-14 pt-8 border-t border-[#E8E2D8]/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-3 rounded-xl bg-white/50 border border-[#E8E2D8]/60 backdrop-blur-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#A87F32] font-semibold block">
              01. Mathematical Rigor
            </span>
            <h4 className="text-sm font-serif font-bold text-[#0F172A] mt-0.5">
              Exact Sidereal Calculations
            </h4>
            <p className="text-xs text-[#64748B] mt-1">
              JHora & Parashari coordinate algorithms mapping genuine celestial bodies.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/50 border border-[#E8E2D8]/60 backdrop-blur-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#8E7CC3] font-semibold block">
              02. Psychological Dignity
            </span>
            <h4 className="text-sm font-serif font-bold text-[#0F172A] mt-0.5">
              Zero-Superstition Dialogue
            </h4>
            <p className="text-xs text-[#64748B] mt-1">
              Treating astrological archetypes as profound lenses for human agency.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/50 border border-[#E8E2D8]/60 backdrop-blur-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#15803D] font-semibold block">
              03. Private Sanctuary
            </span>
            <h4 className="text-sm font-serif font-bold text-[#0F172A] mt-0.5">
              Absolute Confidentiality
            </h4>
            <p className="text-xs text-[#64748B] mt-1">
              Bespoke consultations conducted within a discreet, encrypted haven.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
