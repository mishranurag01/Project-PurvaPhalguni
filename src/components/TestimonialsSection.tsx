import React, { useState } from 'react';
import { Testimonial } from '../types/astrology';
import { Star, Quote, Sparkles } from 'lucide-react';

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    author: 'Aria Montcalm',
    role: 'Principal Architect & Spatial Theorist',
    location: 'Zurich',
    service: 'The Natal Blueprint',
    quote: 'PurvaPhalungi completely altered my perception of Jyotish. Instead of anxiety-inducing omens, I received an astonishingly precise architectural analysis of my creative rhythms. It felt like someone mapped my internal studio before I even built it.',
    date: 'August 2026',
    rating: 5
  },
  {
    id: 't-2',
    author: 'Kaelen Thorne',
    role: 'Managing Partner, Deep Tech Ventures',
    location: 'London / San Francisco',
    service: 'Chronos & Dasha Strategy',
    quote: 'The Dasha timing analysis warned me against forcing an aggressive capital raise during my Rahu-Moon transition and suggested a quiet synthesis period. Six months later, the market turned exactly as the rhythm suggested. This is strategic intelligence, not superstition.',
    date: 'July 2026',
    rating: 5
  },
  {
    id: 't-3',
    author: 'Dr. Soraya Mir',
    role: 'Comparative Literature Professor & Essayist',
    location: 'Boston',
    service: 'Union & Relational Resonance',
    quote: 'What struck me most was the quiet elegance of the language. The synthesis of Purva Phalguni and Venusian aesthetics was handled with the intellectual dignity of a high symposium. It is a rare sanctuary.',
    date: 'September 2026',
    rating: 5
  },
  {
    id: 't-4',
    author: 'Devendra Patel',
    role: 'Founder & Computational Biologist',
    location: 'Bangalore',
    service: 'Annual Solar Return & Muhurta',
    quote: 'The mathematical fidelity of the sidereal calculations combined with Parashari principles is impeccable. PurvaPhalungi honors the classical shastras while delivering an interface that feels like high Scandinavian design.',
    date: 'June 2026',
    rating: 5
  }
];

export const TestimonialsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = activeFilter === 'all'
    ? TESTIMONIALS
    : TESTIMONIALS.filter((t) => t.service.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
          Client Discernment
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#0F172A] mt-2">
          Reflections from the Sanctuary
        </h2>
        <p className="text-sm sm:text-base text-[#526071] mt-3">
          Insights from leaders, thinkers, and artists who seek quiet cosmic clarity without sensationalism.
        </p>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 p-1 bg-[#F5F2EB] rounded-lg max-w-fit mx-auto text-xs font-medium">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeFilter === 'all' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            All Reflections
          </button>
          <button
            onClick={() => setActiveFilter('Natal')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeFilter === 'Natal' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Natal Blueprint
          </button>
          <button
            onClick={() => setActiveFilter('Chronos')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeFilter === 'Chronos' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Dasha Strategy
          </button>
          <button
            onClick={() => setActiveFilter('Union')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeFilter === 'Union' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Relational
          </button>
        </div>
      </div>

      {/* Review Cards Grid with cursor-reactive highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-[#E8E2D8] hover:border-[#C59B4B]/60 p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between text-[#C59B4B] mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C59B4B] text-[#C59B4B]" />
                  ))}
                </div>
                <span className="text-xs text-[#78716C] font-mono">{item.date}</span>
              </div>

              <Quote className="w-8 h-8 text-[#C59B4B]/20 mb-2" />

              <p className="text-sm sm:text-base text-[#0F172A] font-serif leading-relaxed italic">
                "{item.quote}"
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E8E2D8]/60 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A]">{item.author}</h4>
                <p className="text-xs text-[#526071]">{item.role} · {item.location}</p>
              </div>

              <span className="text-[11px] text-[#A87F32] bg-[#FAF8F5] border border-[#E8E2D8] px-2.5 py-1 rounded-md font-medium">
                {item.service}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
