import React, { useState } from 'react';
import { PRESET_PROFILES, calculateVedicChart } from '../../utils/vedicCalculations';
import { InteractiveKundali } from '../InteractiveKundali';
import { DashaTransitTimeline } from '../DashaTransitTimeline';
import { MagneticButton } from '../MagneticButton';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Activity,
  Orbit,
  BookOpen,
  ArrowRight,
  Flame,
  Wind,
  Droplets,
  Layers,
  HeartPulse,
  Eye,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface ObservatorySystemSectionProps {
  onEnterObservatory: () => void;
  reducedMotion?: boolean;
}

export const ObservatorySystemSection: React.FC<ObservatorySystemSectionProps> = ({
  onEnterObservatory,
  reducedMotion = false
}) => {
  // Observatory Calculation State
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(0);
  const currentProfile = PRESET_PROFILES[selectedProfileIndex];
  const chartData = calculateVedicChart(currentProfile);

  // Medical Astrology Active Humor
  const [activeHumor, setActiveHumor] = useState<'pitta' | 'vata' | 'kapha'>('pitta');

  // Cartomancy Active Decanate Card
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  const cartomancyDeck = [
    {
      card: 'Six of Wands (Bhaga Ascendant)',
      degreeSpan: 'Leo 13°20′ – 23°20′ (Purvaphalguni 2nd Pada)',
      planetLord: 'Venus · Jupiterian Aspect',
      humorVector: 'Pitta-Vata Dynamic',
      symbolicArchetype: 'The Sovereign Victor Resting in Ease',
      reflection:
        'Indicates a critical transition from ambitious creative striving to protected physical restoration. The body requires celebration and unhurried hospitality rather than perpetual urgency.',
      remedy: 'Schedule unnegotiable twilight stillness; cease analytical work after sunset.'
    },
    {
      card: 'Four of Swords (The Sanctuary Bed)',
      degreeSpan: 'Libra 10°00′ – 20°00′ (Swati Nakshatra)',
      planetLord: 'Rahu / Saturn Aspect',
      humorVector: 'Vata Excess / Nervous Depletion',
      symbolicArchetype: 'The Knight in Voluntary Recumbency',
      reflection:
        'Reflects subtle mental agitation and electromagnetic overstimulation. When Mars transits this degree, somatic restlessness mimics true vitality, masking cellular fatigue.',
      remedy: 'Somatic grounding with warm sesame oil; reduction of sensory input before sleep.'
    },
    {
      card: 'Queen of Cups (The Lunar Rejuvenator)',
      degreeSpan: 'Cancer 20°00′ – 30°00′ (Ashlesha Nakshatra)',
      planetLord: 'Mercury / Moon Sanctuary',
      humorVector: 'Kapha-Pitta Modulation',
      symbolicArchetype: 'The Alchemical Vessel of Lymphatic Calm',
      reflection:
        'Highlights deep emotional assimilation and fluid equilibrium. Emotional retention directly mirrors digestive tempo and lymphatic circulation.',
      remedy: 'Gentle hydration with warm ginger-coriander infusions; intentional solitude.'
    }
  ];

  return (
    <div className="space-y-24 py-12">
      {/* 
        SECTION 1: THE OBSERVATORY INSTRUMENT (#observatory)
      */}
      <section id="observatory" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF3E3] border border-[#EBDAB5] text-xs font-mono text-[#7A5B20] mb-4">
            <Orbit className="w-3.5 h-3.5 text-[#C59B4B]" />
            <span>SIDEREAL OBSERVATORY INSTRUMENTS</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#0F172A] tracking-tight"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            The Celestial Observatory
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#526071] leading-relaxed">
            High-precision sidereal calculations grounded in Parashari Jyotish and the Lahiri Ephemeris. Explore real-time planetary coordinates, rising signs (Lagna), and chronobiological timing cycles.
          </p>

          {/* Profile Switcher Square Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {PRESET_PROFILES.map((prof, idx) => (
              <button
                key={prof.id}
                onClick={() => setSelectedProfileIndex(idx)}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 transform cursor-pointer active:scale-95 ${
                  selectedProfileIndex === idx
                    ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-105 shadow-md border border-[#C59B4B] ring-2 ring-[#C59B4B]/30'
                    : 'bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#FCFBF9] hover:scale-102 border border-[#E8E2D8]'
                }`}
              >
                <span>{prof.title.replace('(Demo)', '').trim()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Embedded Interactive Kundali & Dasha Transits */}
        <div className="space-y-8">
          <InteractiveKundali data={chartData} reducedMotion={reducedMotion} />
          <DashaTransitTimeline data={chartData} reducedMotion={reducedMotion} />
        </div>
      </section>

      {/* 
        SECTION 2: MEDICAL ASTROLOGY & IATROMATHEMATICS (#medical-astrology)
      */}
      <section
        id="medical-astrology"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E8E2D8] pt-20"
      >
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF3E3] border border-[#EBDAB5] text-xs font-mono text-[#7A5B20] mb-4">
            <HeartPulse className="w-3.5 h-3.5 text-[#C59B4B]" />
            <span>CLASSICAL IATROMATHEMATICAL ARCHITECTURE</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#0F172A] tracking-tight"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            Medical Astrology & Humoral Rhythm
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#526071] leading-relaxed">
            In classical astronomical philosophy, the micro-cosmos of human vitality responds to planetary weather. We examine constitutional predispositions, circadian metabolism, and somatic equilibrium through a strictly symbolic and non-diagnostic lens.
          </p>
        </div>

        {/* Humoral Triad Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Pitta (Fire & Transformation) */}
          <div
            onClick={() => setActiveHumor('pitta')}
            className={`p-7 rounded-3xl border transition-all duration-300 transform cursor-pointer active:scale-95 ${
              activeHumor === 'pitta'
                ? 'bg-[#FAF3E3] border-[#C59B4B] ring-2 ring-[#C59B4B]/30 scale-[1.02] shadow-md'
                : 'bg-white border-[#E8E2D8] hover:border-[#C59B4B]/50 hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-widest text-[#B45309] font-semibold">
                Element: Fire · Sun & Mars
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#B45309] flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-[#0F172A] mt-3">
              Pitta Constitution
            </h3>
            <p className="text-xs text-[#526071] mt-2 leading-relaxed">
              Governs metabolic heat, enzyme conversion, sharp intellectual discernment, and liver vitality. High solar and martial aspects amplify internal fire, necessitating cooling routines and release of perfectionism.
            </p>
            <div className="mt-4 pt-3 border-t border-[#E8E2D8]/60 text-[11px] text-[#A87F32] font-medium flex items-center gap-1.5">
              <span>Circadian Zenith: 10:00 – 14:00 (Solar Peak)</span>
            </div>
          </div>

          {/* Vata (Air & Nervous Transmission) */}
          <div
            onClick={() => setActiveHumor('vata')}
            className={`p-7 rounded-3xl border transition-all duration-300 transform cursor-pointer active:scale-95 ${
              activeHumor === 'vata'
                ? 'bg-[#FAF3E3] border-[#C59B4B] ring-2 ring-[#C59B4B]/30 scale-[1.02] shadow-md'
                : 'bg-white border-[#E8E2D8] hover:border-[#C59B4B]/50 hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-widest text-[#8E7CC3] font-semibold">
                Element: Air · Mercury & Saturn
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#8E7CC3] flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-[#0F172A] mt-3">
              Vata Constitution
            </h3>
            <p className="text-xs text-[#526071] mt-2 leading-relaxed">
              Governs sensory communication, rapid nervous firing, respiration, and cellular movement. Variable planetary transits induce dry fatigue and restless sleep, resolved through rhythmic warmth and oiling.
            </p>
            <div className="mt-4 pt-3 border-t border-[#E8E2D8]/60 text-[11px] text-[#8E7CC3] font-medium flex items-center gap-1.5">
              <span>Circadian Vulnerability: 02:00 – 06:00 (Nocturnal Shift)</span>
            </div>
          </div>

          {/* Kapha (Water & Physical Stability) */}
          <div
            onClick={() => setActiveHumor('kapha')}
            className={`p-7 rounded-3xl border transition-all duration-300 transform cursor-pointer active:scale-95 ${
              activeHumor === 'kapha'
                ? 'bg-[#FAF3E3] border-[#C59B4B] ring-2 ring-[#C59B4B]/30 scale-[1.02] shadow-md'
                : 'bg-white border-[#E8E2D8] hover:border-[#C59B4B]/50 hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-widest text-[#15803D] font-semibold">
                Element: Water · Moon & Venus
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#15803D] flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-[#0F172A] mt-3">
              Kapha Constitution
            </h3>
            <p className="text-xs text-[#526071] mt-2 leading-relaxed">
              Governs structural lubrication, immune resilience, somatic groundedness, and fluid balance. Lunar tides and seasonal stagnancy call for invigorating movement, bitter aromatics, and morning sunlight.
            </p>
            <div className="mt-4 pt-3 border-t border-[#E8E2D8]/60 text-[11px] text-[#15803D] font-medium flex items-center gap-1.5">
              <span>Circadian Haven: 06:00 – 10:00 (Awakening Surge)</span>
            </div>
          </div>
        </div>

        {/* The 12 Bhavas of Vitality Overview */}
        <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-10 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8]/60">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#C59B4B] font-semibold">
                Iatromathematical Houses of the Body
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                The 4 Vitality Gateways
              </h3>
            </div>
            <span className="text-xs text-[#78716C] font-mono">Parashari Shastra Canonical Model</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="p-4 bg-[#FCFBF9] rounded-2xl border border-[#E8E2D8]">
              <span className="font-mono text-xs text-[#C59B4B] font-bold">1st Bhava (Lagna)</span>
              <h4 className="text-base font-serif font-semibold text-[#0F172A] mt-1">Vital Constitution</h4>
              <p className="text-xs text-[#526071] mt-1.5 leading-relaxed">
                The physical vessel, congenital vitality, primal temperament, and neurological orientation to external stimuli.
              </p>
            </div>

            <div className="p-4 bg-[#FCFBF9] rounded-2xl border border-[#E8E2D8]">
              <span className="font-mono text-xs text-[#C59B4B] font-bold">6th Bhava (Roga)</span>
              <h4 className="text-base font-serif font-semibold text-[#0F172A] mt-1">Daily Disciplines</h4>
              <p className="text-xs text-[#526071] mt-1.5 leading-relaxed">
                Digestive rhythms, cellular immunity, friction with routine, and the management of acute physiological stress.
              </p>
            </div>

            <div className="p-4 bg-[#FCFBF9] rounded-2xl border border-[#E8E2D8]">
              <span className="font-mono text-xs text-[#C59B4B] font-bold">8th Bhava (Ayur)</span>
              <h4 className="text-base font-serif font-semibold text-[#0F172A] mt-1">Somatic Regeneration</h4>
              <p className="text-xs text-[#526071] mt-1.5 leading-relaxed">
                Endocrine longevity, deep cellular repair, psychological thresholds, and the transmutative release of deep exhaustion.
              </p>
            </div>

            <div className="p-4 bg-[#FCFBF9] rounded-2xl border border-[#E8E2D8]">
              <span className="font-mono text-xs text-[#C59B4B] font-bold">12th Bhava (Moksha)</span>
              <h4 className="text-base font-serif font-semibold text-[#0F172A] mt-1">Restorative Haven</h4>
              <p className="text-xs text-[#526071] mt-1.5 leading-relaxed">
                Sleep architecture, involuntary nervous restoration, solitary retreat, and subconscious decompression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        SECTION 3: HERMETIC CARTOMANCY & DECANATE SYNTHESIS (#cartomancy)
      */}
      <section
        id="cartomancy"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E8E2D8] pt-20"
      >
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF3E3] border border-[#EBDAB5] text-xs font-mono text-[#7A5B20] mb-4">
            <Layers className="w-3.5 h-3.5 text-[#C59B4B]" />
            <span>HERMETIC DECANATE ARCANA</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#0F172A] tracking-tight"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            Cartomancy for Somatic Reflection
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#526071] leading-relaxed">
            Each 10° decanate of the zodiac carries an archetypal tarot mirror. Where astrology calculates the mechanical clock of the sky, cartomancy provides the intuitive portrait of internal tension.
          </p>
        </div>

        {/* Interactive Cartomancy Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Card Selection Deck */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[11px] uppercase tracking-wider font-mono text-[#78716C] block mb-2">
              Select Somatic Spread Archetype:
            </span>
            {cartomancyDeck.map((c, i) => (
              <div
                key={c.card}
                onClick={() => setActiveCardIndex(i)}
                className={`p-4.5 rounded-2xl border transition-all duration-300 transform cursor-pointer active:scale-95 ${
                  activeCardIndex === i
                    ? 'bg-[#FAF3E3] border-[#C59B4B] ring-2 ring-[#C59B4B]/40 scale-105 shadow-md -translate-y-0.5'
                    : 'bg-white border-[#E8E2D8] hover:border-[#C59B4B]/40 hover:bg-[#FCFBF9] hover:scale-102'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A87F32]">
                  <span>Vector 0{i + 1}</span>
                  <span>{c.planetLord}</span>
                </div>
                <h4 className="text-base font-serif font-bold text-[#0F172A] mt-1">{c.card}</h4>
                <p className="text-xs text-[#64748B] mt-1">{c.symbolicArchetype}</p>
              </div>
            ))}
          </div>

          {/* Right: Active Card Architectural Deep Dive */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-10 shadow-xs space-y-6">
            {(() => {
              const card = cartomancyDeck[activeCardIndex];
              return (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8E2D8]/60">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#C59B4B] font-semibold">
                        {card.degreeSpan}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] mt-1">
                        {card.card}
                      </h3>
                    </div>
                    <span className="text-xs font-mono bg-[#FAF8F5] border border-[#E8E2D8] px-3 py-1.5 rounded-lg text-[#7A5B20]">
                      {card.humorVector}
                    </span>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm text-[#526071] leading-relaxed">
                    <div>
                      <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#A87F32] font-semibold">
                        Symbolic Archetype & Reflection:
                      </h5>
                      <p className="mt-1 text-[#0F172A] font-serif text-base italic">
                        "{card.symbolicArchetype}"
                      </p>
                      <p className="mt-2 text-xs sm:text-sm">{card.reflection}</p>
                    </div>

                    <div className="p-4 bg-[#FAF3E3] rounded-2xl border border-[#EBDAB5] text-[#7A5B20]">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />
                        <span>Contemplative Pacing Directive:</span>
                      </div>
                      <p className="text-xs mt-1.5 leading-relaxed">{card.remedy}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </section>

      {/* 
        SECTION 4: OBSERVATORY INSIGHTS & ESSAYS (#insights)
      */}
      <section
        id="insights"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E8E2D8] pt-20"
      >
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF3E3] border border-[#EBDAB5] text-xs font-mono text-[#7A5B20] mb-4">
            <BookOpen className="w-3.5 h-3.5 text-[#C59B4B]" />
            <span>OBSERVATORY FOLIO MONOGRAPHS</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#0F172A] tracking-tight"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            Insights & Philosophical Lore
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#526071] leading-relaxed">
            Carefully researched treatises on sidereal chronobiology, the mythic geometry of Purvaphalguni, and ethical practice models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-white rounded-3xl border border-[#E8E2D8] hover:border-[#C59B4B] p-7 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#78716C] mb-3">
                <span>MONOGRAPH 01</span>
                <span>8 MIN READ</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0F172A] leading-snug">
                The Architecture of Purvaphalguni: Rest as a Sovereign Discipline
              </h3>
              <p className="text-xs text-[#526071] mt-3 leading-relaxed">
                In classical Vedic iconography, Purvaphalguni is symbolized by the front legs of a ceremonial hammock. Rather than idle inertia, it denotes the deep somatic stillness from which generative cultural breakthroughs emerge.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E8E2D8]/60 flex items-center justify-between text-xs text-[#C59B4B] font-medium">
              <span>Read Monograph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </article>

          <article className="bg-white rounded-3xl border border-[#E8E2D8] hover:border-[#C59B4B] p-7 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#78716C] mb-3">
                <span>MONOGRAPH 02</span>
                <span>12 MIN READ</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0F172A] leading-snug">
                Vimshottari Dasha Pacing: Mapping Long-Wave Somatic Transitions
              </h3>
              <p className="text-xs text-[#526071] mt-3 leading-relaxed">
                How 120-year planetary periods delineate shifts in humoral balance. Understanding the transition between Saturn (Vata contraction) and Mercury (analytical communication) prevents systemic burnout.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E8E2D8]/60 flex items-center justify-between text-xs text-[#C59B4B] font-medium">
              <span>Read Monograph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </article>

          <article className="bg-white rounded-3xl border border-[#E8E2D8] hover:border-[#C59B4B] p-7 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#78716C] mb-3">
                <span>MONOGRAPH 03</span>
                <span>6 MIN READ</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0F172A] leading-snug">
                Hermetic Cartomancy: Visual Archetypes as Non-Diagnostic Mirrors
              </h3>
              <p className="text-xs text-[#526071] mt-3 leading-relaxed">
                Why cartomancy operates as an invaluable cognitive instrument. Grounding symbolic imagery protects clients from fatalistic fortune-telling while illuminating psychological pacing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E8E2D8]/60 flex items-center justify-between text-xs text-[#C59B4B] font-medium">
              <span>Read Monograph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </article>
        </div>
      </section>

      {/* 
        SECTION 5: ABOUT PURVAPHALGUNI & ETHICAL MANDATE (#about-section)
      */}
      <section
        id="about-section"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E8E2D8] pt-20"
      >
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#E8E2D8] p-8 sm:p-14 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C59B4B] font-semibold block mb-2">
              Observatory Ethics & Lineage
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#0F172A] tracking-tight"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
            >
              About PURVAPHALGUNI
            </h2>

            <div className="mt-6 space-y-4 text-xs sm:text-sm text-[#526071] leading-relaxed">
              <p>
                Founded as an intellectual junction where ancient Indian astronomical mechanics meet modern contemplative cartomancy. We reject fatalistic omens, fear-driven superstition, and pseudo-medical diagnoses.
              </p>
              <p>
                Our visual and technical identity honors the astronomical tradition of the <strong className="text-[#0F172A]">Parashari Shastras</strong> and the fixed sidereal zodiac. Purvaphalguni, governed by Bhaga (the deity of delight, dignity, and restorative fortune), serves as our emblem: true sovereignty begins with mindful stillness.
              </p>
            </div>

            {/* Core Tenets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#E8E2D8]">
              <div className="flex items-start gap-2.5 text-xs text-[#0F172A]">
                <CheckCircle2 className="w-4 h-4 text-[#C59B4B] shrink-0 mt-0.5" />
                <span>Strict Non-Diagnostic Ethical Pledge</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#0F172A]">
                <CheckCircle2 className="w-4 h-4 text-[#C59B4B] shrink-0 mt-0.5" />
                <span>Lahiri Sidereal Precision Calculations</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#0F172A]">
                <CheckCircle2 className="w-4 h-4 text-[#C59B4B] shrink-0 mt-0.5" />
                <span>Confidential Private Video Sanctuaries</span>
              </div>
            </div>

            <div className="mt-10">
              <MagneticButton
                variant="primary"
                onClick={onEnterObservatory}
                reducedMotion={reducedMotion}
                className="text-xs py-3 px-6 shadow-xs"
              >
                <Compass className="w-4 h-4 text-[#C59B4B]" />
                <span>Enter the Observatory</span>
                <ArrowRight className="w-4 h-4 text-[#C59B4B]" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
