import React from 'react';
import { WebsiteSettings } from '../../types/practice';
import { MagneticButton } from '../MagneticButton';
import { Sparkles, Calendar, Compass, ShieldAlert, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  settings: WebsiteSettings;
  onBookClick: () => void;
  onExploreServices: () => void;
  reducedMotion?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onBookClick,
  onExploreServices,
  reducedMotion = false
}) => {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center max-w-3xl mx-auto relative z-10">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E8E2D8] shadow-xs text-xs font-medium text-[#78716C] mb-6 backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />
          <span>Iatromathematics · Sidereal Lahiri Ephemeris · Hermetic Cartomancy</span>
        </div>

        {/* Product Brand Name */}
        <h2 className="text-xl sm:text-2xl font-serif text-[#C59B4B] tracking-widest uppercase font-medium mb-3">
          {settings.brandName}
        </h2>

        {/* Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-[#0F172A] tracking-tight leading-[1.08]">
          {settings.tagline.replace('spiritual insight.', '')}
          <span className="italic font-normal text-[#0F172A] relative inline-block">
            spiritual insight.
            <span
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C59B4B]/60 to-transparent"
              aria-hidden="true"
            />
          </span>
        </h1>

        {/* Short Introduction */}
        <p className="mt-6 text-base sm:text-lg text-[#526071] max-w-2xl mx-auto font-sans leading-relaxed">
          {settings.aboutStory}
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            variant="primary"
            onClick={onBookClick}
            reducedMotion={reducedMotion}
            className="text-sm py-3 px-6 shadow-sm"
          >
            <span>Book a Reading</span>
            <ArrowRight className="w-4 h-4 text-[#C59B4B]" />
          </MagneticButton>

          <MagneticButton
            variant="secondary"
            onClick={onExploreServices}
            reducedMotion={reducedMotion}
            className="text-sm py-3 px-6"
          >
            <Compass className="w-4 h-4 text-[#C59B4B]" />
            <span>Explore Services</span>
          </MagneticButton>
        </div>

        {/* Mandatory Non-Medical Disclaimer Card */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-white/90 border border-[#E8E2D8] shadow-xs text-left max-w-2xl mx-auto flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-[#C59B4B] shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#A87F32] font-semibold block">
              Ethical & Legal Notice
            </span>
            <p className="text-xs text-[#526071] mt-1 leading-relaxed font-sans">
              {settings.requiredDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
