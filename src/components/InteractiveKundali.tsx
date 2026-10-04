import React, { useState } from 'react';
import { ChartCalculationResult, PlanetPosition } from '../types/astrology';
import { Sparkles, Maximize2, RefreshCw } from 'lucide-react';

interface InteractiveKundaliProps {
  data: ChartCalculationResult;
  isCalculating?: boolean;
  reducedMotion?: boolean;
}

export const InteractiveKundali: React.FC<InteractiveKundaliProps> = ({
  data,
  isCalculating = false,
  reducedMotion = false
}) => {
  const [chartType, setChartType] = useState<'north' | 'south'>('north');
  const [division, setDivision] = useState<'d1' | 'd9'>('d1');
  const [selectedHouse, setSelectedHouse] = useState<number | null>(1);

  const activePlanets = division === 'd1' ? data.planets : data.navamsaPlanets;
  const ascendant = data.ascendant;

  // Sign indices (1-12) for each house (1-12)
  // House 1 has sign ascendant.signNumber
  const getHouseSignNumber = (houseNum: number) => {
    return ((ascendant.signNumber - 1 + (houseNum - 1)) % 12) + 1;
  };

  // Planets located in a given house
  const getHousePlanets = (houseNum: number): PlanetPosition[] => {
    const list = activePlanets.filter((p) => p.house === houseNum);
    if (houseNum === 1 && division === 'd1') {
      return [ascendant, ...list];
    }
    return list;
  };

  const selectedHouseData = data.houses.find((h) => h.houseNumber === selectedHouse) || data.houses[0];

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] p-5 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#C59B4B]/40">
      {/* Chart Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E8E2D8]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#C59B4B] font-semibold">
              {division === 'd1' ? 'Rasi Kundali (D1)' : 'Navamsa Kundali (D9)'}
            </span>
            <span className="text-xs text-[#94A3B8]">·</span>
            <span className="text-xs text-[#64748B]">Parashari Sidereal (Lahiri)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#0F172A] mt-0.5">
            {chartType === 'north' ? 'North Indian Diamond Chart' : 'South Indian Square Chart'}
          </h3>
        </div>

        {/* Segmented Controls for Chart Style and Division */}
        <div className="flex items-center gap-2">
          {/* Division Selector */}
          <div className="inline-flex p-1 bg-[#F5F2EB] rounded-xl text-xs font-medium border border-[#E8E2D8]/60">
            <button
              onClick={() => setDivision('d1')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 transform active:scale-95 cursor-pointer ${
                division === 'd1'
                  ? 'bg-white text-[#0F172A] shadow-md font-semibold scale-105 ring-1 ring-[#C59B4B]/40'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:scale-105'
              }`}
            >
              D1 Rasi
            </button>
            <button
              onClick={() => setDivision('d9')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 transform active:scale-95 cursor-pointer ${
                division === 'd9'
                  ? 'bg-white text-[#0F172A] shadow-md font-semibold scale-105 ring-1 ring-[#C59B4B]/40'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:scale-105'
              }`}
            >
              D9 Navamsa
            </button>
          </div>

          {/* Style Selector */}
          <div className="inline-flex p-1 bg-[#F5F2EB] rounded-xl text-xs font-medium border border-[#E8E2D8]/60">
            <button
              onClick={() => setChartType('north')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 transform active:scale-95 cursor-pointer ${
                chartType === 'north'
                  ? 'bg-white text-[#0F172A] shadow-md font-semibold scale-105 ring-1 ring-[#C59B4B]/40'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:scale-105'
              }`}
            >
              North Diamond
            </button>
            <button
              onClick={() => setChartType('south')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 transform active:scale-95 cursor-pointer ${
                chartType === 'south'
                  ? 'bg-white text-[#0F172A] shadow-md font-semibold scale-105 ring-1 ring-[#C59B4B]/40'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:scale-105'
              }`}
            >
              South Square
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas with subtle drawing animation */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Chart Graphic */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center relative">
          {isCalculating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-20 flex flex-col items-center justify-center rounded-xl">
              <RefreshCw className="w-8 h-8 text-[#C59B4B] animate-spin mb-2" />
              <p className="text-sm font-serif text-[#0F172A]">Harmonizing sidereal coordinates...</p>
            </div>
          )}

          <div className="w-full max-w-[440px] aspect-square relative select-none">
            {chartType === 'north' ? (
              /* North Indian Diamond Kundali */
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full drop-shadow-xs"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#C59B4B" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Outer Bound Square */}
                <rect
                  x="5"
                  y="5"
                  width="390"
                  height="390"
                  fill="#FCFBF9"
                  stroke="#C59B4B"
                  strokeWidth="1.5"
                  className={reducedMotion ? '' : 'transition-all duration-700'}
                />

                {/* Diagonal lines crossing corners */}
                <line x1="5" y1="5" x2="395" y2="395" stroke="#C59B4B" strokeWidth="1.25" opacity="0.8" />
                <line x1="395" y1="5" x2="5" y2="395" stroke="#C59B4B" strokeWidth="1.25" opacity="0.8" />

                {/* Inner Diamond (Kendra diamond) */}
                <polygon
                  points="200,5 395,200 200,395 5,200"
                  fill="none"
                  stroke="#C59B4B"
                  strokeWidth="1.25"
                  opacity="0.85"
                />

                {/* House Polygons & Clickable Regions (1 to 12) */}
                {/* House 1: Top Diamond */}
                <polygon
                  points="200,5 297.5,102.5 200,200 102.5,102.5"
                  fill={selectedHouse === 1 ? '#FAF3E3' : 'transparent'}
                  className="cursor-pointer hover:fill-[#FBF7EE] transition-colors"
                  onClick={() => setSelectedHouse(1)}
                />
                {/* House 2: Top-Left Upper Triangle */}
                <polygon
                  points="5,5 200,5 102.5,102.5"
                  fill={selectedHouse === 2 ? '#FAF3E3' : 'transparent'}
                  className="cursor-pointer hover:fill-[#FBF7EE] transition-colors"
                  onClick={() => setSelectedHouse(2)}
                />
                {/* House 3: Top-Left Lower Triangle */}
                <polygon
                  points="5,5 102.5,102.5 5,200"
                  fill={selectedHouse === 3 ? '#FAF3E3' : 'transparent'}
                  className="cursor-pointer hover:fill-[#FBF7EE] transition-colors"
                  onClick={() => setSelectedHouse(3)}
                />
                {/* House 4: Left Diamond */}
                <polygon
                  points="5,200 102.5,102.5 200,200 102.5,297.5"
                  fill={selectedHouse === 4 ? '#FAF3E3' : 'transparent'}
                  className="cursor-pointer hover:fill-[#FBF7EE] transition-colors"
                  onClick={() => setSelectedHouse(4)}
                />
                {/* House 5: Bottom-Left Upper Triangle */}
                <polygon
                  points="5,200 102.5,297.5 5,395"
                  fill={selectedHouse === 5 ? '#FAF3E3' : 'transparent'}
                  className="cursor-pointer hover:fill-[#FBF7EE] transition-colors"
                  onClick={() => setSelectedHouse(5)}
                />
                {/* House 6: Bottom-Left Lower Triangle */}
                <polygon
                  points="5,395 102.5,297.5 200,395"
                  fill={selectedHouse === 6 ? '#FAF3E3' : 'transparent'}
                  className="cursor-pointer hover:fill-[#FBF7EE] transition-colors"
                  onClick={() => setSelectedHouse(6)}
                />
                {/* House 7: Bottom Diamond */}
                <polygon
                  points="200,200 102.5,297.5 200,395 297.5,297.5"
                  fill={selectedHouse === 7 ? '#FAF3E3' : 'transparent'}
                  className="cursor-pointer hover:fill-[#FBF7EE] transition-colors"
                  onClick={() => setSelectedHouse(7)}
                />
                {/* House 8: Bottom-Right Lower Triangle */}
                <polygon
                  points="200,395 297.5,297.5 395,395"
                  fill={selectedHouse === 8 ? '#FAF3E3' : 'transparent'}
                  className="cursor-pointer hover:fill-[#FBF7EE] transition-colors"
                  onClick={() => setSelectedHouse(8)}
                />
                {/* House 9: Bottom-Right Upper Triangle */}
                <polygon
                  points="297.5,297.5 395,200 395,395"
                  fill={selectedHouse === 9 ? '#FAF3E3' : 'transparent'}
                  className="cursor-pointer hover:fill-[#FBF7EE] transition-colors"
                  onClick={() => setSelectedHouse(9)}
                />
                {/* House 10: Right Diamond */}
                <polygon
                  points="200,200 297.5,102.5 395,200 297.5,297.5"
                  fill={selectedHouse === 10 ? '#FAF3E3' : 'transparent'}
                  className="cursor-pointer hover:fill-[#FBF7EE] transition-colors"
                  onClick={() => setSelectedHouse(10)}
                />
                {/* House 11: Top-Right Lower Triangle */}
                <polygon
                  points="297.5,102.5 395,5 395,200"
                  fill={selectedHouse === 11 ? '#FAF3E3' : 'transparent'}
                  className="cursor-pointer hover:fill-[#FBF7EE] transition-colors"
                  onClick={() => setSelectedHouse(11)}
                />
                {/* House 12: Top-Right Upper Triangle */}
                <polygon
                  points="200,5 395,5 297.5,102.5"
                  fill={selectedHouse === 12 ? '#FAF3E3' : 'transparent'}
                  className="cursor-pointer hover:fill-[#FBF7EE] transition-colors"
                  onClick={() => setSelectedHouse(12)}
                />

                {/* Sign Numbers (Rasi Numbers) placed in standard North Indian locations */}
                {[
                  { h: 1, x: 200, y: 110 },
                  { h: 2, x: 100, y: 65 },
                  { h: 3, x: 65, y: 100 },
                  { h: 4, x: 110, y: 200 },
                  { h: 5, x: 65, y: 300 },
                  { h: 6, x: 100, y: 345 },
                  { h: 7, x: 200, y: 300 },
                  { h: 8, x: 300, y: 345 },
                  { h: 9, x: 345, y: 300 },
                  { h: 10, x: 295, y: 200 },
                  { h: 11, x: 345, y: 100 },
                  { h: 12, x: 300, y: 65 }
                ].map((item) => (
                  <text
                    key={`sign-${item.h}`}
                    x={item.x}
                    y={item.y}
                    fontSize="10"
                    fontFamily="serif"
                    fill="#A87F32"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="select-none pointer-events-none opacity-85 font-medium"
                  >
                    {getHouseSignNumber(item.h)}
                  </text>
                ))}

                {/* Render Planets in Houses */}
                {[
                  { h: 1, cx: 200, cy: 145 },
                  { h: 2, cx: 125, cy: 40 },
                  { h: 3, cx: 40, cy: 125 },
                  { h: 4, cx: 145, cy: 200 },
                  { h: 5, cx: 40, cy: 265 },
                  { h: 6, cx: 125, cy: 360 },
                  { h: 7, cx: 200, cy: 255 },
                  { h: 8, cx: 265, cy: 360 },
                  { h: 9, cx: 360, cy: 265 },
                  { h: 10, cx: 255, cy: 200 },
                  { h: 11, cx: 360, cy: 125 },
                  { h: 12, cx: 265, cy: 40 }
                ].map((pos) => {
                  const pList = getHousePlanets(pos.h);
                  const isCurHouseSelected = selectedHouse === pos.h;
                  return (
                    <g key={`house-planets-${pos.h}`} className="cursor-pointer" onClick={() => setSelectedHouse(pos.h)}>
                      {pList.map((p, pIdx) => {
                        const colOffset = (pIdx % 3) * 22 - (Math.min(pList.length, 3) - 1) * 11;
                        const rowOffset = Math.floor(pIdx / 3) * 16 - 8;
                        const x = pos.cx + colOffset;
                        const y = pos.cy + rowOffset;
                        const isExalted = p.dignity === 'Exalted';
                        const isOwn = p.dignity === 'Own Sign';

                        return (
                          <g key={`${p.name}-${pos.h}`}>
                            {/* Tiny highlight dot behind exalted or lagna */}
                            {(isExalted || p.name === 'Ascendant') && (
                              <circle cx={x} cy={y} r="10" fill={isExalted ? '#FEF3C7' : '#F1F5F9'} opacity="0.7" />
                            )}
                            <text
                              x={x}
                              y={y}
                              fontSize="11"
                              fontWeight={isCurHouseSelected ? '700' : '600'}
                              fontFamily="sans-serif"
                              fill={isExalted ? '#B45309' : isOwn ? '#15803D' : '#0F172A'}
                              textAnchor="middle"
                              dominantBaseline="central"
                            >
                              {p.shortCode}
                              {p.isRetrograde && <tspan fontSize="8" fill="#B91C1C">℞</tspan>}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
            ) : (
              /* South Indian Fixed Zodiac Kundali (Aries at Row 0 Col 1, Pisces at Row 0 Col 0, etc.) */
              <div className="w-full h-full border border-[#C59B4B] grid grid-cols-4 grid-rows-4 bg-[#FCFBF9] text-xs">
                {/* 12 Outer boxes */}
                {[
                  { rasi: 'Pisces', r: 0, c: 0, signNum: 12 },
                  { rasi: 'Aries', r: 0, c: 1, signNum: 1 },
                  { rasi: 'Taurus', r: 0, c: 2, signNum: 2 },
                  { rasi: 'Gemini', r: 0, c: 3, signNum: 3 },
                  { rasi: 'Cancer', r: 1, c: 3, signNum: 4 },
                  { rasi: 'Leo', r: 2, c: 3, signNum: 5 },
                  { rasi: 'Virgo', r: 3, c: 3, signNum: 6 },
                  { rasi: 'Libra', r: 3, c: 2, signNum: 7 },
                  { rasi: 'Scorpio', r: 3, c: 1, signNum: 8 },
                  { rasi: 'Sagittarius', r: 3, c: 0, signNum: 9 },
                  { rasi: 'Capricorn', r: 2, c: 0, signNum: 10 },
                  { rasi: 'Aquarius', r: 1, c: 0, signNum: 11 }
                ].map((box) => {
                  const houseNum = ((box.signNum - ascendant.signNumber + 12) % 12) + 1;
                  const planetsInSign = activePlanets.filter((p) => p.signNumber === box.signNum);
                  const isLagna = ascendant.signNumber === box.signNum;
                  const isSelected = selectedHouse === houseNum;

                  return (
                    <div
                      key={box.rasi}
                      onClick={() => setSelectedHouse(houseNum)}
                      style={{ gridRow: box.r + 1, gridColumn: box.c + 1 }}
                      className={`border p-1.5 flex flex-col justify-between cursor-pointer transition-all duration-300 transform relative ${
                        isSelected
                          ? 'bg-[#FAF3E3] border-[#C59B4B] scale-110 z-20 shadow-md ring-2 ring-[#C59B4B]/80 font-bold'
                          : 'border-[#C59B4B]/35 hover:bg-[#FDFBF7] hover:scale-105 hover:z-10 hover:shadow-xs active:scale-95'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] text-[#A87F32]">
                        <span className="font-serif">{box.rasi.slice(0, 3)}</span>
                        <span className="font-sans text-[9px] text-[#94A3B8]">H{houseNum}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 items-center mt-1">
                        {isLagna && division === 'd1' && (
                          <span className="font-bold text-[#C59B4B] text-[10px]">ASC</span>
                        )}
                        {planetsInSign.map((p) => (
                          <span
                            key={p.name}
                            className={`text-[10px] font-semibold ${
                              p.dignity === 'Exalted'
                                ? 'text-[#B45309]'
                                : p.dignity === 'Own Sign'
                                ? 'text-[#15803D]'
                                : 'text-[#0F172A]'
                            }`}
                          >
                            {p.shortCode}
                            {p.isRetrograde ? '℞' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Central 2x2 void */}
                <div
                  style={{ gridRow: '2 / 4', gridColumn: '2 / 4' }}
                  className="bg-white/80 border border-[#C59B4B]/20 flex flex-col items-center justify-center p-3 text-center"
                >
                  <Sparkles className="w-5 h-5 text-[#C59B4B] mb-1" />
                  <span className="font-serif text-sm font-medium text-[#0F172A]">Purva Phalguni</span>
                  <span className="text-[10px] text-[#64748B]">South Indian Format</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" /> Exalted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" /> Own Sign
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#B91C1C] font-bold">℞</span> Retrograde
            </span>
          </div>
        </div>

        {/* Selected House Deep-Dive Card */}
        <div className="lg:col-span-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D8] p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]/60">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#C59B4B]">
                House Inspection
              </span>
              <h4 className="text-lg font-serif font-semibold text-[#0F172A]">
                House {selectedHouseData.houseNumber} · {selectedHouseData.sign}
              </h4>
            </div>
            <span className="text-xs font-serif italic text-[#78716C] bg-white px-2 py-0.5 rounded border border-[#E8E2D8]">
              {selectedHouseData.sanskritName}
            </span>
          </div>

          <p className="text-xs font-medium text-[#0F172A] mt-3">
            {selectedHouseData.theme}
          </p>

          {/* Significance points */}
          <div className="mt-3">
            <span className="text-[11px] uppercase tracking-wider text-[#78716C] font-medium">Domain & Portals</span>
            <ul className="mt-1 space-y-1 text-xs text-[#526071]">
              {selectedHouseData.significance.map((sig, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#C59B4B]" />
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Occupying Grahas */}
          <div className="mt-4 pt-3 border-t border-[#E8E2D8]/60">
            <span className="text-[11px] uppercase tracking-wider text-[#78716C] font-medium">
              Occupying Grahas ({getHousePlanets(selectedHouseData.houseNumber).length})
            </span>
            {getHousePlanets(selectedHouseData.houseNumber).length === 0 ? (
              <p className="text-xs text-[#94A3B8] italic mt-1">No planets placed here (influenced by house lord & aspects).</p>
            ) : (
              <div className="mt-2 space-y-2">
                {getHousePlanets(selectedHouseData.houseNumber).map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-[#E8E2D8]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-[#0F172A]">{p.name}</span>
                      <span className="text-[#64748B]">({p.sanskrit})</span>
                      {p.isRetrograde && <span className="text-red-600 font-bold text-[10px]">℞</span>}
                    </div>
                    <div className="text-right">
                      <span className="text-[#C59B4B] font-medium">{p.dignity}</span>
                      <div className="text-[10px] text-[#94A3B8]">{p.degreesInSign.toFixed(1)}° · {p.nakshatra} P{p.pada}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
