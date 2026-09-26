import React from 'react';
import { ServicePlan, WebsiteSettings } from '../../types/practice';
import { MagneticButton } from '../MagneticButton';
import { Clock, CheckCircle2, ShieldAlert, Sparkles, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

interface ServicesPageProps {
  services: ServicePlan[];
  settings: WebsiteSettings;
  onBookService: (service: ServicePlan) => void;
  reducedMotion?: boolean;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  settings,
  onBookService,
  reducedMotion = false
}) => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
          Curated Offerings
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-light text-[#0F172A] mt-2">
          Consultation Modalities & Pricing Plans
        </h1>
        <p className="text-sm sm:text-base text-[#526071] mt-4 leading-relaxed">
          Ground your creative, intellectual, and somatic rhythm through classical Parashari Jyotish and Hermetic Cartomancy. Every session is confidential, strictly non-diagnostic, and delivered with unhurried care.
        </p>

        {/* Prominent Disclaimer */}
        <div className="mt-8 p-4 rounded-2xl bg-white border border-[#E8E2D8] flex items-start gap-3 text-left">
          <ShieldAlert className="w-5 h-5 text-[#C59B4B] shrink-0 mt-0.5" />
          <p className="text-xs text-[#526071] leading-relaxed">
            <strong className="text-[#0F172A]">Practice Policy:</strong> {settings.requiredDisclaimer}
          </p>
        </div>
      </div>

      {/* Deep-Dive Service Cards */}
      <div className="space-y-12">
        {services.filter(s => s.isActive).map((service, idx) => (
          <div
            key={service.id}
            className={`bg-white rounded-3xl border p-8 sm:p-12 shadow-sm relative transition-all duration-300 hover:shadow-md ${
              service.isPopular ? 'border-[#C59B4B] ring-1 ring-[#C59B4B]' : 'border-[#E8E2D8]'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Info & Description */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-[#C59B4B] font-mono font-bold bg-[#FAF8F5] border border-[#E8E2D8] px-2.5 py-1 rounded-md">
                    Modality {service.code}
                  </span>
                  {service.isPopular && (
                    <span className="text-xs uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold">
                      Client Favorite
                    </span>
                  )}
                </div>

                <h2 className="text-3xl font-serif font-semibold text-[#0F172A]">
                  {service.name}
                </h2>

                <p className="text-sm text-[#526071] leading-relaxed">
                  {service.fullDesc}
                </p>

                {/* Inclusions */}
                <div className="pt-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A87F32] mb-3">
                    What This Reading Includes:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#526071]">
                    {service.includes.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B4B] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preparation Instructions */}
                <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8] text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#0F172A] mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#C59B4B]" />
                    <span>Session Preparation:</span>
                  </div>
                  <p className="text-[#64748B] leading-relaxed">
                    {service.preparationInstructions}
                  </p>
                </div>
              </div>

              {/* Right Column: Pricing & Booking Action */}
              <div className="lg:col-span-5 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">
                    Consultation Investment
                  </span>
                  <div className="text-4xl font-serif font-bold text-[#0F172A] mt-1">
                    ${service.price}
                    <span className="text-sm font-sans font-normal text-[#64748B] ml-1.5">
                      {service.currency}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-[#526071] pb-4 border-b border-[#E8E2D8]">
                    <Clock className="w-4 h-4 text-[#C59B4B]" />
                    <span>Session Duration: <strong>{service.duration}</strong></span>
                  </div>

                  <div className="mt-4 space-y-2 text-[11px] text-[#64748B]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Encrypted Video Sanctuary & Recording</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Permanent Reading Summary in Client Portal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>48-hour free rescheduling guarantee</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E8E2D8]">
                  <MagneticButton
                    variant="primary"
                    onClick={() => onBookService(service)}
                    reducedMotion={reducedMotion}
                    className="w-full py-3 text-xs"
                  >
                    <span>Book {service.code} Now</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C59B4B]" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
