import React from 'react';
import { ServicePlan } from '../../types/practice';
import { MagneticButton } from '../MagneticButton';
import { Clock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface ServicesSectionProps {
  services: ServicePlan[];
  onBookService: (service: ServicePlan) => void;
  reducedMotion?: boolean;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onBookService,
  reducedMotion = false
}) => {
  return (
    <section id="services-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E2D8]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
          Spiritual Consultations
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#0F172A] mt-2">
          Services and Plans
        </h2>
        <p className="text-sm sm:text-base text-[#526071] mt-3">
          Reflective inquiry into constitutional vitality, planetary pacing, and intuitive archetypes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.filter(s => s.isActive).map((service) => (
          <div
            key={service.id}
            className={`group bg-white rounded-3xl border p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden ${
              service.isPopular ? 'border-[#C59B4B] ring-1 ring-[#C59B4B]' : 'border-[#E8E2D8] hover:border-[#C59B4B]/60'
            }`}
          >
            {service.isPopular && (
              <div className="absolute top-0 right-0 bg-[#C59B4B] text-[#0F172A] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-xl shadow-xs">
                Most Comprehensive
              </div>
            )}

            <div>
              {/* Header */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#A87F32] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{service.code}</span>
              </div>

              <h3 className="text-2xl font-serif font-semibold text-[#0F172A] mt-1 group-hover:text-[#A87F32] transition-colors leading-snug">
                {service.name}
              </h3>

              {/* Price & Duration */}
              <div className="mt-4 flex items-baseline justify-between pb-4 border-b border-[#E8E2D8]/60">
                <div className="text-3xl font-serif font-bold text-[#0F172A]">
                  ${service.price}
                  <span className="text-xs font-sans text-[#78716C] font-normal ml-1">USD</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#526071] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E8E2D8]">
                  <Clock className="w-3.5 h-3.5 text-[#C59B4B]" />
                  <span>{service.duration}</span>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#526071] mt-4 leading-relaxed">
                {service.shortDesc}
              </p>

              {/* Key Features */}
              <div className="mt-6 pt-5 border-t border-[#E8E2D8]/60">
                <span className="text-[10px] uppercase tracking-wider text-[#A87F32] font-semibold block mb-2">
                  Session Curriculum Includes:
                </span>
                <ul className="space-y-2 text-xs text-[#526071]">
                  {service.includes.slice(0, 4).map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B4B] shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Book Button */}
            <div className="mt-8 pt-5 border-t border-[#E8E2D8]/60">
              <MagneticButton
                variant={service.isPopular ? 'gold' : 'primary'}
                onClick={() => onBookService(service)}
                reducedMotion={reducedMotion}
                className="w-full text-xs py-3"
              >
                <span>Book this reading</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
