import React, { useState } from 'react';
import { ChartCalculationResult, PlanetName } from '../types/astrology';
import { Clock, Orbit, ChevronRight, Info } from 'lucide-react';

interface DashaTransitTimelineProps {
  data: ChartCalculationResult;
  reducedMotion?: boolean;
}

export const DashaTransitTimeline: React.FC<DashaTransitTimelineProps> = ({
  data,
  reducedMotion = false
}) => {
  const [activeTab, setActiveTab] = useState<'dasha' | 'transits'>('dasha');
  const [selectedLord, setSelectedLord] = useState<PlanetName | null>(data.currentDasha.mahadasha);

  const { mahadasha, antardasha, pratyantardasha, progressPercentage, timeline } = data.currentDasha;

  const dashaDescriptions: { [key in PlanetName]?: string } = {
    Sun: 'Period of self-realization, fatherly influences, vocational dignity, and creative sovereignty.',
    Moon: 'Period of emotional maturation, maternal connection, mind refinement, and intuitive receptivity.',
    Mars: 'Period of courageous enterprise, physical discipline, property acquisition, and bold initiative.',
    Rahu: 'Period of accelerated worldly ambitions, unconventional expansion, foreign connections, and sudden ascents.',
    Jupiter: 'Period of elevated wisdom, dharmic teachers, spiritual clarity, family expansion, and auspicious grace.',
    Saturn: 'Period of sober structure, karmic reckonings, enduring patience, structural mastery, and selfless service.',
    Mercury: 'Period of intellectual agility, communication, commercial endeavors, learning, and literary expression.',
    Ketu: 'Period of spiritual introspection, ego detachment, esoteric insights, and shedding outworn attachments.',
    Venus: 'Period of artistic flourish, relational devotion, beauty, refined luxury, and aesthetic fulfillment.'
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] p-5 sm:p-7 shadow-sm transition-all duration-300">
      {/* Header with Tab switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]/60">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C59B4B] font-semibold">
            Vedic Chronos & Planetary Weather
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#0F172A] mt-0.5">
            {activeTab === 'dasha' ? 'Vimshottari Dasha Progression (120-Yr Cycle)' : 'Gochara Transits & Cosmic Aspects'}
          </h3>
        </div>

        <div className="inline-flex p-1 bg-[#F5F2EB] rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('dasha')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'dasha'
                ? 'bg-white text-[#0F172A] shadow-sm font-semibold'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#C59B4B]" />
            Dasha Cycles
          </button>
          <button
            onClick={() => setActiveTab('transits')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'transits'
                ? 'bg-white text-[#0F172A] shadow-sm font-semibold'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Orbit className="w-3.5 h-3.5 text-[#8E7CC3]" />
            Live Transits
          </button>
        </div>
      </div>

      {activeTab === 'dasha' ? (
        <div className="mt-6 space-y-6">
          {/* Active Period Highlight Banner */}
          <div className="bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs uppercase tracking-wider text-[#15803D] font-semibold">
                  Active Timeline Node (2026)
                </span>
              </div>
              <h4 className="text-xl font-serif font-bold text-[#0F172A] mt-1">
                {mahadasha} Mahadasha · {antardasha} Antardasha
              </h4>
              <p className="text-xs text-[#526071] mt-1">
                Sub-influence: <span className="font-medium text-[#0F172A]">{pratyantardasha} Pratyantardasha</span>.
                {' '}{dashaDescriptions[mahadasha]}
              </p>
            </div>

            {/* Cycle Completion Gauge */}
            <div className="min-w-[180px] bg-white p-3 rounded-lg border border-[#E8E2D8]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#64748B]">Cycle Trajectory</span>
                <span className="font-semibold text-[#0F172A] font-mono">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-[#F1EDE4] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#C59B4B] h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-[10px] text-[#94A3B8] block text-right mt-1">
                Harmonic integration phase
              </span>
            </div>
          </div>

          {/* Dasha Periods Chronological Flow */}
          <div>
            <h5 className="text-xs uppercase tracking-wider text-[#78716C] font-semibold mb-3">
              Full 120-Year Mahadasha Sequence
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
              {timeline.map((period) => {
                const isSelected = selectedLord === period.lord;
                return (
                  <button
                    key={period.lord}
                    onClick={() => setSelectedLord(period.lord)}
                    className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                      period.isCurrent
                        ? 'bg-[#FCFBF9] border-[#C59B4B] ring-1 ring-[#C59B4B]'
                        : isSelected
                        ? 'bg-white border-[#8E7CC3] shadow-xs'
                        : 'bg-[#FCFBF9] border-[#E8E2D8] hover:border-[#C59B4B]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-[#0F172A]">{period.lord}</span>
                      {period.isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <div className="text-[11px] text-[#78716C] font-mono mt-1">
                      {period.durationYears} yrs
                    </div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">
                      {period.startDate.slice(0, 4)}–{period.endDate.slice(0, 4)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Lord Deep-Dive */}
          {selectedLord && (
            <div className="bg-[#FCFBF9] rounded-xl border border-[#E8E2D8] p-4 text-xs">
              <div className="flex items-center gap-2 text-[#0F172A] font-serif text-base font-semibold">
                <Info className="w-4 h-4 text-[#C59B4B]" />
                <span>Signification of {selectedLord} Dasha Archetype</span>
              </div>
              <p className="mt-2 text-[#526071] leading-relaxed">
                {dashaDescriptions[selectedLord] || 'A sacred cycle for integrating internal spiritual momentum with external vocational manifestation.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Transits (Gochara) View */
        <div className="mt-6 space-y-4">
          <div className="bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] p-4 text-xs text-[#526071]">
            <p>
              <strong className="text-[#0F172A]">Gochara (Planetary Transits):</strong> In Parashari astrology, major slower-moving planets (Guru, Shani, Rahu, and Ketu) shape the atmospheric context in which your current Dasha unfolds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.transits.map((tr) => (
              <div
                key={tr.planet}
                className="bg-[#FCFBF9] hover:bg-white rounded-xl border border-[#E8E2D8] hover:border-[#8E7CC3]/60 p-4 transition-all duration-300 hover:shadow-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]/60">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-[#0F172A]">{tr.planet}</span>
                    <span className="text-xs text-[#64748B]">transiting {tr.currentSign}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#8E7CC3] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    House {tr.transitHouse}
                  </span>
                </div>

                <div className="mt-3 text-xs space-y-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#78716C] uppercase text-[10px] font-semibold">Aspects:</span>
                    <span className="text-[#0F172A] font-medium">{tr.aspectsNatal}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#78716C] uppercase text-[10px] font-semibold">Atmosphere:</span>
                    <span className="text-[#526071]">{tr.theme}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
