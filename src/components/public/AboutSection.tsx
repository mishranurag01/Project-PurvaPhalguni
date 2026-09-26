import React from 'react';
import { WebsiteSettings } from '../../types/practice';
import { ArrowRight, ShieldCheck, Feather, HeartPulse, User } from 'lucide-react';

interface AboutSectionProps {
  settings: WebsiteSettings;
  onReadMore: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onReadMore }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E2D8]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Practice Philosophy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C59B4B]" />
            <span className="text-xs uppercase tracking-wider text-[#A87F32] font-semibold">
              The Reflective Art of Iatromathematics
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#0F172A] leading-tight">
            Medical Astrology & Cartomancy as Reflective Spiritual Practices
          </h2>

          <p className="text-sm sm:text-base text-[#526071] leading-relaxed">
            {settings.aboutPhilosophy}
          </p>

          <p className="text-sm sm:text-base text-[#526071] leading-relaxed">
            Through the careful mapping of the 6th Bhava (routine adaptation, stress load) and the 8th Bhava (deep regeneration, cyclical resilience), we discover how our somatic reserves respond to macro-astronomical weather. Paired with symbolic cartomancy, cards act as intuitive mirrors to release subconscious friction.
          </p>

          <div className="pt-2">
            <button
              onClick={onReadMore}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F172A] hover:text-[#C59B4B] transition-colors border-b border-[#0F172A] pb-1 hover:border-[#C59B4B]"
            >
              <span>Explore Our Full Philosophy & Ethics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Practitioner Card & Credentials */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-[#E8E2D8] p-7 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4 pb-5 border-b border-[#E8E2D8]/80">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center text-[#C59B4B]">
                <User className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#A87F32] font-semibold">
                  Lead Practitioner & Founder
                </span>
                <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                  Eleanor Vance, M.A.
                </h3>
                <span className="text-xs text-[#78716C]">
                  Parashari Jyotish Scholar & Bioethicist
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-xs text-[#526071] leading-relaxed">
              <p>
                "Our sanctuary was created to restore intellectual dignity, non-judgmental quiet, and sacred rhythm to individuals navigating demanding modern vocations."
              </p>
              
              <div className="pt-3 border-t border-[#E8E2D8]/60 space-y-2">
                <div className="flex items-center gap-2 text-[#0F172A] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                  <span>Licensed Bioethics & Non-Diagnostic Oath</span>
                </div>
                <div className="flex items-center gap-2 text-[#0F172A] font-medium">
                  <Feather className="w-4 h-4 text-[#C59B4B]" />
                  <span>Sidereal Lahiri Mathematical Calculation</span>
                </div>
                <div className="flex items-center gap-2 text-[#0F172A] font-medium">
                  <HeartPulse className="w-4 h-4 text-[#8E7CC3]" />
                  <span>Reflective Vitality & Rest Scheduling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
