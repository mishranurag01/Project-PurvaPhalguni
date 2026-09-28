import React, { useState } from 'react';
import { BirthProfile, ChartCalculationResult } from '../types/astrology';
import { calculateVedicChart, PRESET_PROFILES } from '../utils/vedicCalculations';
import { InteractiveKundali } from './InteractiveKundali';
import { PlanetaryMatrix } from './PlanetaryMatrix';
import { DashaTransitTimeline } from './DashaTransitTimeline';
import { ChartNotesSummary } from './ChartNotesSummary';
import { MagneticButton } from './MagneticButton';
import { Sparkles, Calendar, Clock, MapPin, RefreshCw, User, Sliders } from 'lucide-react';
import { soundSynth } from '../utils/soundAmbience';

interface AstrologyWorkspaceProps {
  reducedMotion?: boolean;
}

export const AstrologyWorkspace: React.FC<AstrologyWorkspaceProps> = ({ reducedMotion = false }) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('demo-client-1');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Custom Form State (Demo Placeholders)
  const [customName, setCustomName] = useState('Demo Subject');
  const [customTitle, setCustomTitle] = useState('Reflective Inquiry Profile (Demo)');
  const [customDate, setCustomDate] = useState('2000-01-01');
  const [customTime, setCustomTime] = useState('12:00');
  const [customCity, setCustomCity] = useState('Example City');
  const [customLat, setCustomLat] = useState('37.7749');
  const [customLon, setCustomLon] = useState('-122.4194');

  // Currently active calculated chart data
  const [chartData, setChartData] = useState<ChartCalculationResult>(() => {
    const initialProfile = PRESET_PROFILES.find((p) => p.id === 'demo-client-1') || PRESET_PROFILES[0];
    return calculateVedicChart(initialProfile);
  });

  const handleSelectPreset = (profile: BirthProfile) => {
    setSelectedProfileId(profile.id);
    setIsCustomMode(false);
    triggerRecalculation(profile);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: BirthProfile = {
      id: `custom-${Date.now()}`,
      name: customName,
      title: customTitle,
      birthDate: customDate,
      birthTime: customTime,
      birthPlace: customCity,
      latitude: parseFloat(customLat) || 0,
      longitude: parseFloat(customLon) || 0,
      timezone: 'Auto',
      summaryQuote: `Custom natal chart calculated for ${customName} (${customCity}).`
    };
    setSelectedProfileId(newProfile.id);
    triggerRecalculation(newProfile);
  };

  const triggerRecalculation = (profile: BirthProfile) => {
    setIsCalculating(true);
    soundSynth.playCelestialChime();
    setTimeout(() => {
      const calculated = calculateVedicChart(profile);
      setChartData(calculated);
      setIsCalculating(false);
    }, 450);
  };

  return (
    <section id="workspace" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-mono text-amber-800 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Demo chart engine — external provider not connected</span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
            Local Vedic Astronomical Engine
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#0F172A] mt-2">
          The Sidereal Astrology Workspace
        </h2>
        <p className="text-sm sm:text-base text-[#526071] mt-3 leading-relaxed">
          Interactive Vedic kundali calculations utilizing Sidereal Lahiri Ayanamsa, 12 Bhava divisions, full 27 Nakshatra padas, and the 120-year Vimshottari Dasha sequence. Calculated locally via AstrologyCalculationProvider.
        </p>
      </div>

      {/* Profile Selector & Birth Coordinates Panel */}
      <div className="bg-white rounded-2xl border border-[#E8E2D8] p-5 sm:p-7 shadow-sm mb-8 transition-all hover:border-[#C59B4B]/40">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]/60">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#A87F32] font-semibold">
              Subject Coordinates
            </span>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0F172A] mt-0.5">
              Select Curated Folio or Input Birth Data
            </h3>
          </div>

          <div className="inline-flex p-1 bg-[#F5F2EB] rounded-lg text-xs font-medium">
            <button
              onClick={() => setIsCustomMode(false)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                !isCustomMode ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Curated Profiles
            </button>
            <button
              onClick={() => setIsCustomMode(true)}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-all ${
                isCustomMode ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Sliders className="w-3 h-3 text-[#C59B4B]" />
              Custom Coordinates
            </button>
          </div>
        </div>

        {!isCustomMode ? (
          /* Preset Folios */
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_PROFILES.map((p) => {
              const isSelected = selectedProfileId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FCFBF9] border-[#C59B4B] ring-1 ring-[#C59B4B] shadow-xs'
                      : 'bg-[#FCFBF9] border-[#E8E2D8] hover:border-[#C59B4B]/50 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#0F172A]">{p.name}</span>
                      {isSelected && <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />}
                    </div>
                    <p className="text-[11px] text-[#78716C] mt-0.5 line-clamp-1">{p.title}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#E8E2D8]/60 text-[10px] text-[#94A3B8] flex items-center justify-between">
                    <span>{p.birthPlace}</span>
                    <span className="font-mono">{p.birthDate.slice(0, 4)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Custom Birth Data Input Form */
          <form onSubmit={handleCustomSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                  Subject Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                  Vocation / Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                  Birth Date
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                  Exact Local Time
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="time"
                    required
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                  City / Location
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] uppercase tracking-wider text-[10px] mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  value={customLon}
                  onChange={(e) => setCustomLon(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                />
              </div>
            </div>

            {/* Magnetic CTA for Generate Chart */}
            <div className="pt-2 flex justify-end">
              <MagneticButton
                type="submit"
                variant="primary"
                reducedMotion={reducedMotion}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />
                Generate Chart
              </MagneticButton>
            </div>
          </form>
        )}
      </div>

      {/* Main Chart Section */}
      <div className="space-y-8">
        {/* Interactive North & South Indian Kundali Visualizer */}
        <InteractiveKundali
          data={chartData}
          isCalculating={isCalculating}
          reducedMotion={reducedMotion}
        />

        {/* Sidereal Planetary Matrix */}
        <PlanetaryMatrix
          planets={chartData.planets}
          ascendant={chartData.ascendant}
          reducedMotion={reducedMotion}
        />

        {/* Dasha Progression & Transits */}
        <DashaTransitTimeline
          data={chartData}
          reducedMotion={reducedMotion}
        />

        {/* Practitioner Notes & Summary Exporter */}
        <ChartNotesSummary
          data={chartData}
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  );
};
