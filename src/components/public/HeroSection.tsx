import React from 'react';
import { WebsiteSettings } from '../../types/practice';
import { MagneticButton } from '../MagneticButton';
import { Compass, ShieldAlert, ArrowRight, Activity, Orbit, Sparkles } from 'lucide-react';

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
    <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden animate-fade-in-up">
      {/* Background subtle orbital geometry */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-25">
        <svg className="w-full h-full text-[#C59B4B] animate-celestial-spin" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="195" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 6" />
          <circle cx="200" cy="200" r="145" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="200" cy="200" r="95" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 4" />
        </svg>
      </div>

      <div className="text-center max-w-4xl mx-auto relative z-10">
        {/* Eyebrow — Mandated by Directive: MEDICAL ASTROLOGY & CARTOMANCY */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-[#E8E2D8] shadow-2xs text-[11px] font-mono tracking-[0.24em] text-[#7A5B20] mb-6 backdrop-blur-xs transition-transform duration-300 hover:scale-105">
          <Sparkles className="w-3 h-3 text-[#C59B4B]" />
          <span>MEDICAL ASTROLOGY & CARTOMANCY</span>
        </div>

        {/* Brand Identity Wordmark */}
        <div className="mb-4">
          <span
            className="text-xs sm:text-sm font-mono tracking-[0.35em] uppercase text-[#A87F32] font-semibold block"
          >
            Observatory Folio
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.18em] text-[#0F172A] mt-1 font-serif"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            PURVAPHALGUNI
          </h2>
        </div>

        {/* 
          Main Headline — Mandated by Directive:
          "Where celestial patterns meet the language of health and human experience."
        */}
        <h1
          className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-[#0F172A] tracking-tight leading-[1.14] max-w-3xl mx-auto mt-6"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          Where celestial patterns meet the language of health and human experience.
        </h1>

        {/* 
          Supporting Copy — Explaining:
          - medical astrology
          - astronomical symbolism
          - cartomancy
          - structured interpretation
          - reflective insight
        */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-[#526071] max-w-2xl mx-auto font-sans leading-relaxed">
          PURVAPHALGUNI unites sidereal astronomical precision, classical medical astrology, and hermetic cartomancy into a structured interpretive framework. Through high-fidelity ephemeris calculations and symbolic archetype synthesis, we offer reflective insight into constitutional vitality, somatic pacing, and circadian rhythm.
        </p>

        {/* 
          Primary Call to Actions — Mandated by Directive:
          Primary: "Enter the Observatory"
          Secondary: "Explore the System"
          Engineered like precision observatory instrument components.
        */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            variant="primary"
            onClick={onBookClick}
            reducedMotion={reducedMotion}
            className="text-xs sm:text-sm py-3.5 px-6 shadow-sm hover:scale-105 active:scale-95 transition-transform border border-[#C59B4B]/40"
          >
            <Compass className="w-4 h-4 text-[#C59B4B]" />
            <span>Enter the Observatory</span>
            <ArrowRight className="w-4 h-4 text-[#C59B4B]" />
          </MagneticButton>

          <MagneticButton
            variant="secondary"
            onClick={onExploreServices}
            reducedMotion={reducedMotion}
            className="text-xs sm:text-sm py-3.5 px-6 hover:scale-105 active:scale-95 transition-transform border border-[#E8E2D8]"
          >
            <Orbit className="w-4 h-4 text-[#C59B4B]" />
            <span>Explore the System</span>
          </MagneticButton>
        </div>

        {/* 
          Medical Credibility & Ethical Boundary — Mandated by Section 12:
          Clear distinction between medical knowledge and astrological/cartomantic interpretation.
          Explicit non-diagnostic language.
        */}
        <div className="mt-14 p-5 sm:p-6 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8] shadow-xs text-left max-w-2xl mx-auto flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-[#FAF3E3] border border-[#EBDAB5] flex items-center justify-center shrink-0 text-[#C59B4B]">
            <ShieldAlert className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-mono text-[#A87F32] font-semibold block">
                Ethical & Clinical Distinction
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                Non-Diagnostic
              </span>
            </div>
            <p className="text-xs text-[#526071] mt-1.5 leading-relaxed font-sans">
              PURVAPHALGUNI provides symbolic, reflective, and educational interpretations rooted in classical astronomical traditions. Our observations are not clinical diagnoses, medical tests, or pharmaceutical recommendations, and never replace qualified medical care from licensed healthcare professionals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
