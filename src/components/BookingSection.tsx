import React, { useState } from 'react';
import { ConsultationService } from '../types/astrology';
import { MagneticButton } from './MagneticButton';
import { Calendar, Clock, CheckCircle2, Star, Sparkles, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { soundSynth } from '../utils/soundAmbience';

export const CONSULTATION_SERVICES: ConsultationService[] = [
  {
    id: 'natal-blueprint',
    title: 'The Natal Blueprint',
    duration: '75 Minutes',
    price: '$380',
    description: 'An architectural examination of your Sidereal Lagna, D1 Rasi root foundations, and D9 Navamsa soul trajectory. Designed for leaders and creators at major inflection points.',
    focusAreas: ['Ascendant & Core Temperament', 'D9 Navamsa Spiritual Trajectory', 'Karmic Nodes (Rahu-Ketu)', 'Dormant Creative Potentials'],
    deliverables: ['75-min Private Audio/Video Session', 'Detailed High-Res Kundali Folio', 'Personal Contemplative Mantras & Upayas', 'Permanent Private Portal Archive'],
    recommendedFor: 'Founders, artists, and individuals seeking deep existential orientation.'
  },
  {
    id: 'chronos-dasha',
    title: 'Chronos & Dasha Strategy',
    duration: '60 Minutes',
    price: '$320',
    description: 'Vedic timing is not fate; it is weather. Navigate your 120-year Vimshottari Dasha sequence, Sade Sati phases, and upcoming Jupiter/Saturn transit gates with grounded foresight.',
    focusAreas: ['Active Mahadasha-Antardasha Focus', 'Career & Capital Pivot Windows', 'Sade Sati & Saturnian Disciplines', 'Optimal Launch Windows'],
    deliverables: ['60-min Deep Timing Consultation', 'Chronological 3-Year Forecast Map', 'Strategic Transit Timetable', 'Session Audio Recording'],
    recommendedFor: 'Executives, investors, and practitioners planning strategic shifts or sabbaticals.'
  },
  {
    id: 'union-synastry',
    title: 'Union & Relational Resonance',
    duration: '90 Minutes',
    price: '$450',
    description: 'A delicate, dignified comparison of two natal charts using classical Ashta-Kuta principles, 7th Bhava dynamics, and Rahu-Ketu nodal cords. Free of fatalistic predictions.',
    focusAreas: ['Emotional Attunement (Nadi & Gana)', 'Shared Dharmic Objectives', 'Communication Friction Dissolution', 'Synastry Transits & Evolution'],
    deliverables: ['90-min Joint or Solo Consultation', 'Dual Kundali Synergy Blueprint', 'Relational Harmony Recommendations', 'Written Synthesis Guide'],
    recommendedFor: 'Couples, prospective partners, and creative co-founders.'
  },
  {
    id: 'varshaphala-muhurta',
    title: 'Annual Solar Return & Muhurta',
    duration: '60 Minutes',
    price: '$340',
    description: 'Tajika Varshaphala solar return map for your coming birthday year, combined with rigorous electional Muhurta timing for marriages, major acquisitions, or creative premieres.',
    focusAreas: ['Muntha & Yearly Lord Analysis', 'Quarterly Energetic Peaks', 'High-Auspiciousness Muhurta Windows', 'Personal Birthday Solar Ritual'],
    deliverables: ['Annual Theme Roadmap', 'Calendar of Auspicious Dates', '60-min Private Consultation', 'Printable Celestial Planner'],
    recommendedFor: 'Annual birthday reviews and high-stakes milestones.'
  }
];

interface BookingSectionProps {
  reducedMotion?: boolean;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ reducedMotion = false }) => {
  const [selectedService, setSelectedService] = useState<ConsultationService | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<'form' | 'confirmed'>('form');

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [birthDetails, setBirthDetails] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-10-14');
  const [preferredTime, setPreferredTime] = useState('14:00 GMT');
  const [primaryFocus, setPrimaryFocus] = useState('');

  const handleOpenBooking = (service: ConsultationService) => {
    setSelectedService(service);
    setBookingStep('form');
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    soundSynth.playCelestialChime();
    setBookingStep('confirmed');
  };

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
          Curated Consultations
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#0F172A] mt-2">
          Private Consultations in Quiet Light
        </h2>
        <p className="text-sm sm:text-base text-[#526071] mt-3 leading-relaxed">
          Purva Phalguni readings are calm, confidential, and intellectually rigorous. We dispense with ominous fortune-telling to focus on self-knowledge, dignity, and conscious timing.
        </p>
      </div>

      {/* Services Grid with cursor hover enhancements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CONSULTATION_SERVICES.map((service) => (
          <div
            key={service.id}
            className="group bg-white rounded-2xl border border-[#E8E2D8] hover:border-[#C59B4B]/60 p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#F5EEDC]/40 to-transparent rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-[#0F172A] group-hover:text-[#A87F32] transition-colors">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#78716C]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C59B4B]" />
                      {service.duration}
                    </span>
                    <span>·</span>
                    <span>Private Video Sanctuary</span>
                  </div>
                </div>
                <span className="text-2xl font-serif font-bold text-[#0F172A]">
                  {service.price}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#526071] mt-4 leading-relaxed">
                {service.description}
              </p>

              {/* Focus Pillars */}
              <div className="mt-6 pt-5 border-t border-[#E8E2D8]/60">
                <span className="text-[11px] uppercase tracking-wider text-[#A87F32] font-semibold">
                  Curated Inquiry Domains
                </span>
                <ul className="mt-2.5 space-y-1.5 text-xs text-[#526071]">
                  {service.focusAreas.map((area, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C59B4B]" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#E8E2D8]/60 flex items-center justify-between">
              <span className="text-[11px] text-[#78716C] italic max-w-[210px] hidden sm:inline-block">
                {service.recommendedFor}
              </span>

              {/* Magnetic CTA for Booking */}
              <MagneticButton
                variant="primary"
                onClick={() => handleOpenBooking(service)}
                reducedMotion={reducedMotion}
                className="w-full sm:w-auto"
              >
                <span>Book a Reading</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C59B4B]" />
              </MagneticButton>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Drawer / Modal */}
      {isBookingOpen && selectedService && (
        <div
          className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsBookingOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-[#E8E2D8] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {bookingStep === 'form' ? (
              <form onSubmit={handleConfirmBooking}>
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#C59B4B] font-semibold">
                      Private Reservation
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0F172A] mt-0.5">
                      {selectedService.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(false)}
                    className="text-[#94A3B8] hover:text-[#0F172A] text-lg font-mono p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-5 space-y-4 text-xs">
                  <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E2D8] flex items-center justify-between">
                    <div>
                      <span className="text-[#64748B]">Duration & Fee:</span>
                      <div className="font-semibold text-[#0F172A] text-sm">
                        {selectedService.duration} · {selectedService.price} USD
                      </div>
                    </div>
                    <ShieldCheck className="w-6 h-6 text-[#C59B4B]" />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Demo Client"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E2D8] focus:border-[#C59B4B] focus:outline-none bg-[#FCFBF9]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                      Confidential Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. demo.client@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E2D8] focus:border-[#C59B4B] focus:outline-none bg-[#FCFBF9]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-[#E8E2D8] focus:border-[#C59B4B] focus:outline-none bg-[#FCFBF9]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                        Sanctuary Window
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-[#E8E2D8] focus:border-[#C59B4B] focus:outline-none bg-[#FCFBF9]"
                      >
                        <option value="10:00 GMT">10:00 GMT (Morning Calm)</option>
                        <option value="14:00 GMT">14:00 GMT (Solar Midday)</option>
                        <option value="17:30 GMT">17:30 GMT (Twilight Dusk)</option>
                        <option value="20:00 GMT">20:00 GMT (Night Sanctuary)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                      Birth Date, Exact Time & City of Birth
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 14 Nov 1989, 07:18 AM, Geneva, Switzerland"
                      value={birthDetails}
                      onChange={(e) => setBirthDetails(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E2D8] focus:border-[#C59B4B] focus:outline-none bg-[#FCFBF9]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                      Primary Contemplation or Question (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Describe any strategic decisions, creative hurdles, or timing concerns..."
                      value={primaryFocus}
                      onChange={(e) => setPrimaryFocus(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-[#E8E2D8] focus:border-[#C59B4B] focus:outline-none bg-[#FCFBF9]"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8E2D8] flex items-center justify-between">
                  <span className="text-[11px] text-[#78716C]">
                    Zero-superstition guarantee.
                  </span>
                  <MagneticButton
                    type="submit"
                    variant="primary"
                    reducedMotion={reducedMotion}
                  >
                    Confirm & Reserve
                  </MagneticButton>
                </div>
              </form>
            ) : (
              /* Confirmation Voucher */
              <div className="text-center py-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF3E3] border border-[#C59B4B] flex items-center justify-center text-[#C59B4B] mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
                  Reservation Accepted
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                  Your Sanctuary Is Prepared
                </h3>
                <p className="text-xs text-[#526071] mt-2 max-w-sm mx-auto leading-relaxed">
                  A private calendar invitation and birth-coordinate verification have been dispatched for <strong>{clientName || 'Client'}</strong>.
                </p>

                <div className="mt-5 p-4 rounded-xl bg-[#FCFBF9] border border-[#E8E2D8] text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Consultation:</span>
                    <span className="font-semibold text-[#0F172A]">{selectedService.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Scheduled Window:</span>
                    <span className="font-semibold text-[#0F172A]">{preferredDate} at {preferredTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Delivery:</span>
                    <span className="text-[#A87F32] font-medium">Private Video Sanctuary (Prototype Session)</span>
                  </div>
                </div>

                <div className="mt-6">
                  <MagneticButton
                    variant="primary"
                    onClick={() => setIsBookingOpen(false)}
                    reducedMotion={reducedMotion}
                    className="w-full"
                  >
                    Return to Sanctuary
                  </MagneticButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
