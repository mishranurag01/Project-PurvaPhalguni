import React, { useState } from 'react';
import { PlanetPosition } from '../types/astrology';
import { Compass, Sparkles, Shield, Gem } from 'lucide-react';

interface PlanetaryMatrixProps {
  planets: PlanetPosition[];
  ascendant: PlanetPosition;
  reducedMotion?: boolean;
}

export const PlanetaryMatrix: React.FC<PlanetaryMatrixProps> = ({
  planets,
  ascendant,
  reducedMotion = false
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);

  const allItems = [ascendant, ...planets];

  const getDignityBadge = (dignity: PlanetPosition['dignity']) => {
    switch (dignity) {
      case 'Exalted':
        return 'text-[#B45309] bg-[#FEF3C7] border-[#FDE68A]';
      case 'Own Sign':
        return 'text-[#15803D] bg-[#DCFCE7] border-[#BBF7D0]';
      case 'Great Friend':
        return 'text-[#1E40AF] bg-[#DBEAFE] border-[#BFDBFE]';
      case 'Debilitated':
        return 'text-[#991B1B] bg-[#FEE2E2] border-[#FECACA]';
      default:
        return 'text-[#475569] bg-[#F1F5F9] border-[#E2E8F0]';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] p-5 sm:p-7 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]/60">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C59B4B] font-semibold">
            Sidereal Planetary Ephemeris
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#0F172A] mt-0.5">
            Graha Positions, Nakshatras & Dignities
          </h3>
        </div>

        {/* View Switcher */}
        <div className="inline-flex p-1 bg-[#F5F2EB] rounded-lg text-xs font-medium">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              viewMode === 'cards' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Grid Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              viewMode === 'table' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Detailed Table
          </button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        /* Cards Grid with cursor-reactive highlight and smooth staggered look */
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {allItems.map((p, idx) => (
            <div
              key={p.name}
              onClick={() => setSelectedPlanet(p)}
              style={{
                transitionDelay: reducedMotion ? '0ms' : `${idx * 25}ms`
              }}
              className="group relative bg-[#FCFBF9] hover:bg-white rounded-xl border border-[#E8E2D8] hover:border-[#C59B4B]/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-serif font-semibold text-[#0F172A] group-hover:text-[#C59B4B] transition-colors">
                      {p.name}
                    </span>
                    {p.isRetrograde && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1 rounded">
                        ℞
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-serif text-[#78716C] italic">{p.sanskrit}</span>
                </div>

                <div className="mt-2 flex items-baseline justify-between text-xs">
                  <span className="text-[#0F172A] font-semibold">{p.sign}</span>
                  <span className="text-[#64748B] font-mono text-[11px]">
                    {p.degreesInSign.toFixed(1)}°
                  </span>
                </div>

                <div className="mt-1 text-[11px] text-[#526071] flex items-center justify-between">
                  <span>House {p.house}</span>
                  <span className="text-[#A87F32] font-medium">{p.nakshatra} (P{p.pada})</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#E8E2D8]/60 flex items-center justify-between text-[10px]">
                <span className={`px-2 py-0.5 rounded border font-medium ${getDignityBadge(p.dignity)}`}>
                  {p.dignity}
                </span>
                <span className="text-[#78716C] font-mono">{p.nakshatraLord} Lord</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D8] text-[#78716C] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Graha</th>
                <th className="py-3 px-3">Sanskrit</th>
                <th className="py-3 px-3">Sign (Rasi)</th>
                <th className="py-3 px-3">Degrees</th>
                <th className="py-3 px-3">Bhava (House)</th>
                <th className="py-3 px-3">Nakshatra & Pada</th>
                <th className="py-3 px-3">Nakshatra Lord</th>
                <th className="py-3 px-3">Dignity</th>
                <th className="py-3 px-3">Karaka (Signification)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]/60">
              {allItems.map((p) => (
                <tr
                  key={p.name}
                  onClick={() => setSelectedPlanet(p)}
                  className="hover:bg-[#FDFBF7] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-semibold text-[#0F172A] flex items-center gap-1.5">
                    {p.name}
                    {p.isRetrograde && <span className="text-red-600 font-bold">℞</span>}
                  </td>
                  <td className="py-3 px-3 font-serif text-[#78716C]">{p.sanskrit}</td>
                  <td className="py-3 px-3 text-[#0F172A] font-medium">{p.sign}</td>
                  <td className="py-3 px-3 font-mono text-[#64748B]">{p.degreesInSign.toFixed(2)}°</td>
                  <td className="py-3 px-3 text-[#0F172A] font-medium">House {p.house}</td>
                  <td className="py-3 px-3 text-[#A87F32] font-medium">{p.nakshatra} · Pada {p.pada}</td>
                  <td className="py-3 px-3 text-[#64748B]">{p.nakshatraLord}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-medium ${getDignityBadge(p.dignity)}`}>
                      {p.dignity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#64748B]">{p.karaka}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Planet Modal / Quick Drawer */}
      {selectedPlanet && (
        <div 
          className="fixed inset-0 z-50 bg-[#0F172A]/30 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPlanet(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-[#E8E2D8] max-w-md w-full p-6 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C59B4B]" />
                <h4 className="text-xl font-serif font-bold text-[#0F172A]">
                  {selectedPlanet.name} ({selectedPlanet.sanskrit})
                </h4>
              </div>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="text-[#94A3B8] hover:text-[#0F172A] text-lg font-mono p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-[#FCFBF9] p-3 rounded-lg border border-[#E8E2D8]">
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase">Placement</span>
                  <span className="font-semibold text-[#0F172A]">{selectedPlanet.sign} · House {selectedPlanet.house}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase">Exact Degrees</span>
                  <span className="font-semibold text-[#0F172A] font-mono">{selectedPlanet.degreesInSign.toFixed(2)}°</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase">Nakshatra</span>
                  <span className="font-semibold text-[#A87F32]">{selectedPlanet.nakshatra} (Pada {selectedPlanet.pada})</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase">Dignity</span>
                  <span className="font-semibold text-[#0F172A]">{selectedPlanet.dignity}</span>
                </div>
              </div>

              <div className="bg-[#FDFBF7] p-3 rounded-lg border border-[#E8E2D8] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#0F172A] font-medium">
                  <Shield className="w-4 h-4 text-[#C59B4B]" />
                  <span>Karaka (Natural Signification):</span>
                </div>
                <p className="text-[#526071]">{selectedPlanet.karaka}</p>

                <div className="flex items-center gap-1.5 text-[#0F172A] font-medium pt-2">
                  <Gem className="w-4 h-4 text-[#8E7CC3]" />
                  <span>Classical Harmonic Resonance:</span>
                </div>
                <p className="text-[#526071]">{selectedPlanet.gemstone} · Harmonic tuning</p>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setSelectedPlanet(null)}
                className="px-4 py-2 bg-[#0F172A] text-white rounded-lg text-xs font-medium hover:bg-[#1E293B] transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
