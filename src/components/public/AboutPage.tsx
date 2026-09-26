import React from 'react';
import { WebsiteSettings } from '../../types/practice';
import { ShieldCheck, HeartPulse, Sparkles, Feather, Lock, EyeOff, Award, FileCheck } from 'lucide-react';

interface AboutPageProps {
  settings: WebsiteSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings }) => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
          Lineage & Ethics
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-light text-[#0F172A] mt-2">
          The Reflective Tradition of Medical Astrology
        </h1>
        <p className="text-sm sm:text-base text-[#526071] mt-4 leading-relaxed">
          Reclaiming the intellectual rigor, sacred geometry, and somatic pacing of ancient Iatromathematics in a modern, ethical, and private sanctuary.
        </p>
      </div>

      {/* Main Content Blocks */}
      <div className="space-y-12">
        {/* Founder Story */}
        <div className="bg-white rounded-3xl border border-[#E8E2D8] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C59B4B]" />
            <span className="text-xs uppercase tracking-wider text-[#A87F32] font-semibold">
              Our Founding Story
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#0F172A]">
            Bridging Astronomy, Soul & Somatics
          </h2>
          <div className="text-sm text-[#526071] leading-relaxed space-y-4">
            <p>{settings.aboutStory}</p>
            <p>
              In antiquity, Hippocrates famously observed that "a physician without a knowledge of astrology has no right to call himself a physician." While modern medicine rightfully excels in surgical intervention and biochemistry, the symbolic art of understanding our constitutional temperaments—how our nervous system experiences seasonal solstices, lunar cycles, and dasha transitions—was largely forgotten.
            </p>
            <p>
              Our sanctuary does not practice medicine; rather, we provide a quiet, intelligent harbor where clients discover the natural chronobiology of their vitality, avoiding chronic burnout and forced artificial pace.
            </p>
          </div>
        </div>

        {/* Philosophy & Approach Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#E8E2D8] p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-center text-[#C59B4B]">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              Our Philosophy
            </h3>
            <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
              {settings.aboutPhilosophy}
            </p>
          </div>

          <div className="bg-[#FAF8F5] rounded-3xl border border-[#E8E2D8] p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-center text-[#8E7CC3]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              Our Methodological Approach
            </h3>
            <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
              {settings.aboutApproach}
            </p>
          </div>
        </div>

        {/* Client Privacy & Ethical Oath */}
        <div className="bg-white rounded-3xl border border-[#E8E2D8] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#15803D]" />
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0F172A]">
              Client Privacy & Data Sovereignty
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
            {settings.privacyPolicyText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8E2D8]/60 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
              <div className="font-semibold text-[#0F172A] mb-1 flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-[#C59B4B]" />
                <span>Zero Tracking</span>
              </div>
              <p className="text-[#64748B]">No telemetry, commercial analytics, or third-party ad pixels.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
              <div className="font-semibold text-[#0F172A] mb-1 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#15803D]" />
                <span>Consent Withdrawal</span>
              </div>
              <p className="text-[#64748B]">Withdraw your consent or request full record purge anytime with one click.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
              <div className="font-semibold text-[#0F172A] mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8E7CC3]" />
                <span>Role Partitioning</span>
              </div>
              <p className="text-[#64748B]">Only your assigned practitioner can inspect your birth coordinates.</p>
            </div>
          </div>
        </div>

        {/* Clear Notice Banner */}
        <div className="p-6 rounded-2xl bg-[#FAF3E3] border border-[#EBDAB5] text-xs text-[#7A5B20] flex items-start gap-3">
          <HeartPulse className="w-5 h-5 text-[#C59B4B] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block text-[11px] mb-1">
              Reflective Spiritual Boundary
            </span>
            <p className="leading-relaxed">
              {settings.requiredDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
