import React, { useState, useEffect, useRef } from 'react';
import { soundSynth } from '../../utils/soundAmbience';

export type IntroState =
  | 'INITIAL_DARKNESS'
  | 'CENTRAL_SPARK'
  | 'CELESTIAL_EXPANSION'
  | 'LETTER_REVEAL'
  | 'BRAND_COMPLETE'
  | 'ASTRAL_MARK'
  | 'SUBTITLE_REVEAL'
  | 'INTERFACE_REVEAL'
  | 'LANDING_PAGE_ACTIVE';

interface IntroSequenceProps {
  onComplete: () => void;
  reducedMotion?: boolean;
}

// EXACT BRAND SPELLING MANDATED BY DIRECTIVE: P-U-R-V-A-P-H-A-L-G-U-N-I
const BRAND_LETTERS = ['P', 'U', 'R', 'V', 'A', 'P', 'H', 'A', 'L', 'G', 'U', 'N', 'I'] as const;
const SUBTITLE_TEXT = 'Medical Astrology & Cartomancy';

export const IntroSequence: React.FC<IntroSequenceProps> = ({
  onComplete,
  reducedMotion = false
}) => {
  const [introState, setIntroState] = useState<IntroState>('INITIAL_DARKNESS');
  const [visibleLettersCount, setVisibleLettersCount] = useState<number>(0);
  const [activeLetterStage, setActiveLetterStage] = useState<'trace' | 'materialise' | 'stabilised'>('trace');
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // If user prefers reduced motion, bypass cinematic expansion directly
  useEffect(() => {
    if (reducedMotion) {
      setIntroState('SUBTITLE_REVEAL');
      setVisibleLettersCount(BRAND_LETTERS.length);
      const timer = setTimeout(() => {
        setIntroState('INTERFACE_REVEAL');
        setTimeout(onComplete, 500);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [reducedMotion, onComplete]);

  // Keyboard shortcut: Escape skips intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSkip = () => {
    if (isSkipped) return;
    setIsSkipped(true);
    setIntroState('INTERFACE_REVEAL');
    setTimeout(() => {
      setIntroState('LANDING_PAGE_ACTIVE');
      onComplete();
    }, 450);
  };

  // State Machine Timers & Letter Revelation Progression
  useEffect(() => {
    if (reducedMotion || isSkipped) return;

    let sparkTimer: NodeJS.Timeout | undefined;
    let expansionTimer: NodeJS.Timeout | undefined;
    let letterStartTimer: NodeJS.Timeout | undefined;

    // Phase 1 -> Phase 2: Central Spark after ~750ms
    sparkTimer = setTimeout(() => {
      setIntroState('CENTRAL_SPARK');
      soundSynth.playCelestialChime();

      // Phase 2 -> Phase 3: Celestial Expansion after ~950ms
      expansionTimer = setTimeout(() => {
        setIntroState('CELESTIAL_EXPANSION');

        // Phase 3 -> Phase 4: Start Letter Revelation after ~1100ms
        letterStartTimer = setTimeout(() => {
          setIntroState('LETTER_REVEAL');
        }, 1100);
      }, 950);
    }, 750);

    return () => {
      if (sparkTimer) clearTimeout(sparkTimer);
      if (expansionTimer) clearTimeout(expansionTimer);
      if (letterStartTimer) clearTimeout(letterStartTimer);
    };
  }, [reducedMotion, isSkipped]);

  // Letter by Letter Reveal Loop
  useEffect(() => {
    if (introState !== 'LETTER_REVEAL' || isSkipped) return;

    if (visibleLettersCount < BRAND_LETTERS.length) {
      // Stage A: Astral Trace
      setActiveLetterStage('trace');

      const traceTimer = setTimeout(() => {
        // Stage B: Materialisation
        setActiveLetterStage('materialise');

        const materialiseTimer = setTimeout(() => {
          // Stage C: Stabilisation and advance to next letter
          setActiveLetterStage('stabilised');
          setVisibleLettersCount((prev) => prev + 1);
        }, 120);

        return () => clearTimeout(materialiseTimer);
      }, 110);

      return () => clearTimeout(traceTimer);
    } else {
      // All 13 letters revealed: Transition to BRAND_COMPLETE
      setIntroState('BRAND_COMPLETE');

      const markTimer = setTimeout(() => {
        setIntroState('ASTRAL_MARK');

        const subTimer = setTimeout(() => {
          setIntroState('SUBTITLE_REVEAL');

          const finalExpandTimer = setTimeout(() => {
            setIntroState('INTERFACE_REVEAL');

            const completeTimer = setTimeout(() => {
              setIntroState('LANDING_PAGE_ACTIVE');
              onComplete();
            }, 1000);

            return () => clearTimeout(completeTimer);
          }, 1400);

          return () => clearTimeout(finalExpandTimer);
        }, 600);

        return () => clearTimeout(subTimer);
      }, 500);

      return () => clearTimeout(markTimer);
    }
  }, [introState, visibleLettersCount, isSkipped, onComplete]);

  // Atmospheric Canvas: Stardust & Radial Waves Simulation
  useEffect(() => {
    if (reducedMotion || isSkipped) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle stellar particles
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }, () => ({
      x: width / 2 + (Math.random() - 0.5) * 40,
      y: height / 2 + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2
    }));

    let expansionRadius = 0;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw gentle radial ember aura when past INITIAL_DARKNESS
      if (introState !== 'INITIAL_DARKNESS') {
        const auraProgress =
          introState === 'CENTRAL_SPARK'
            ? 0.15
            : introState === 'CELESTIAL_EXPANSION'
            ? 0.45
            : introState === 'INTERFACE_REVEAL'
            ? 1.0
            : 0.7;

        expansionRadius += (auraProgress * 420 - expansionRadius) * 0.04;

        const radialGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          Math.max(expansionRadius, 20)
        );

        // Core warm amber to deep burgundy to transparency
        radialGrad.addColorStop(0, `rgba(229, 177, 85, ${0.28 * auraProgress})`);
        radialGrad.addColorStop(0.3, `rgba(138, 43, 62, ${0.16 * auraProgress})`);
        radialGrad.addColorStop(0.65, `rgba(45, 12, 22, ${0.08 * auraProgress})`);
        radialGrad.addColorStop(1, 'rgba(8, 3, 5, 0)');

        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(expansionRadius, 20), 0, Math.PI * 2);
        ctx.fill();

        // Subtle circular wave pulses
        if (introState !== 'CENTRAL_SPARK') {
          const waveCount = 2;
          for (let w = 0; w < waveCount; w++) {
            const waveRadius = (expansionRadius * 0.6 + ((time * 0.05 + w * 120) % 240)) * 0.9;
            const waveAlpha = Math.max(0, 0.18 - waveRadius / 400);

            ctx.strokeStyle = `rgba(197, 155, 75, ${waveAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // Draw delicate floating star embers
      if (introState !== 'INITIAL_DARKNESS') {
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += 0.02;

          const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));

          ctx.fillStyle = `rgba(244, 211, 138, ${currentAlpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [introState, reducedMotion, isSkipped]);

  if (introState === 'LANDING_PAGE_ACTIVE') {
    return null;
  }

  const isDarkness = introState === 'INITIAL_DARKNESS';
  const hasSpark = introState !== 'INITIAL_DARKNESS';
  const isDissolving = introState === 'INTERFACE_REVEAL';

  return (
    <div
      role="region"
      aria-label="Celestial Ignition Introduction"
      className={`fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden transition-all duration-1000 ${
        isDissolving ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        // Deep maroon / blackened burgundy / dark charcoal undertones
        backgroundColor: '#080305',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(55, 14, 28, 0.35) 0%, rgba(20, 6, 12, 0.6) 50%, #080305 100%)
        `
      }}
    >
      {/* Background Stardust & Celestial Light Waves Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full"
      />

      {/* Discreet Skip Intro Button */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30">
        <button
          onClick={handleSkip}
          className="text-[11px] uppercase tracking-widest text-[#94A3B8]/60 hover:text-[#FAF8F5] transition-colors duration-300 py-1.5 px-3 rounded-full border border-white/5 hover:border-white/20 bg-white/5 backdrop-blur-xs flex items-center gap-1.5 cursor-pointer"
          title="Skip introductory sequence (Press Esc)"
          aria-label="Skip introductory sequence"
        >
          <span>Skip intro</span>
          <span className="text-[9px] text-[#78716C] font-mono">[Esc]</span>
        </button>
      </div>

      {/* Central Celestial Spark & Star Point */}
      <div
        className={`absolute w-3 h-3 rounded-full transition-all duration-1000 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 ${
          hasSpark ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
        style={{
          boxShadow: `
            0 0 12px 3px rgba(244, 211, 138, 0.95),
            0 0 35px 12px rgba(229, 169, 60, 0.55),
            0 0 80px 30px rgba(138, 43, 62, 0.3)
          `
        }}
      >
        {/* Microscopic warm celestial ember point */}
        <div className="w-1.5 h-1.5 rounded-full bg-[#FFF7E8] mx-auto my-auto shadow-xs" />
      </div>

      {/* Main Core Brand Presentation Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
        {/* Astronomical Institutional Seal / Orbital Geometry (ASTRAL_MARK) */}
        <div
          className={`mb-6 sm:mb-8 transition-all duration-1000 transform ${
            introState === 'ASTRAL_MARK' ||
            introState === 'SUBTITLE_REVEAL' ||
            introState === 'INTERFACE_REVEAL'
              ? 'opacity-90 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-3 scale-95 pointer-events-none'
          }`}
        >
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
            {/* Outer coordinate ring */}
            <svg
              className="w-full h-full text-[#C59B4B] animate-celestial-spin"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="50" cy="50" r="46" strokeDasharray="3 3" opacity="0.4" />
              <circle cx="50" cy="50" r="38" opacity="0.6" />
              {/* Four quadrant observatory tick marks */}
              <line x1="50" y1="2" x2="50" y2="8" strokeWidth="1.5" />
              <line x1="50" y1="92" x2="50" y2="98" strokeWidth="1.5" />
              <line x1="2" y1="50" x2="8" y2="50" strokeWidth="1.5" />
              <line x1="92" y1="50" x2="98" y2="50" strokeWidth="1.5" />
            </svg>

            {/* Inner diamond / Venusian Bhaga symbol of Purva Phalguni */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[#EBDAB5]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <polygon points="12,2 22,12 12,22 2,12" stroke="#C59B4B" fill="rgba(197, 155, 75, 0.12)" />
                <circle cx="12" cy="12" r="2.5" fill="#FFF7E8" />
              </svg>
            </div>
          </div>

          {/* Coordinate subtitle tag */}
          <div className="text-[9px] font-mono tracking-[0.2em] text-[#C59B4B]/70 uppercase mt-1">
            SIDEREAL LAHIRI · RA 09h 45m
          </div>
        </div>

        {/* 
          BRAND NAME: PURVAPHALGUNI
          Exact Letter Sequence: P → U → R → V → A → P → H → A → L → G → U → N → I
          Three-Stage Letter Revelation:
          - Stage A: Astral Trace (Luminous trace)
          - Stage B: Materialisation (Gradual solidifying)
          - Stage C: Stabilisation (Refined high-contrast serif)
        */}
        <div
          className="flex items-center justify-center flex-nowrap font-serif tracking-[0.2em] sm:tracking-[0.28em] md:tracking-[0.35em] text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#FAF8F5] leading-none"
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif'
          }}
          aria-label="PURVAPHALGUNI"
        >
          {BRAND_LETTERS.map((char, index) => {
            const isVisible = index < visibleLettersCount;
            const isCurrent = index === visibleLettersCount && introState === 'LETTER_REVEAL';

            return (
              <span
                key={`${char}-${index}`}
                className="relative inline-block transition-all duration-300"
                style={{
                  minWidth: '0.65em',
                  textAlign: 'center'
                }}
              >
                {/* Luminous Astral Trace Glow effect */}
                {isCurrent && (
                  <span
                    className="absolute inset-0 flex items-center justify-center text-[#F4D38A] animate-pulse pointer-events-none"
                    style={{
                      textShadow: '0 0 22px #E5A93C, 0 0 45px #C59B4B',
                      opacity: activeLetterStage === 'trace' ? 0.9 : 0.4
                    }}
                    aria-hidden="true"
                  >
                    {char}
                  </span>
                )}

                {/* Visible Letter after revelation */}
                <span
                  className={`inline-block transition-all duration-300 ${
                    isVisible
                      ? 'opacity-100 scale-100 text-[#FAF8F5]'
                      : isCurrent
                      ? 'opacity-60 scale-105 text-[#F4D38A]'
                      : 'opacity-0 scale-90 pointer-events-none'
                  }`}
                  style={{
                    textShadow: isVisible
                      ? '0 0 18px rgba(197, 155, 75, 0.28)'
                      : 'none'
                  }}
                >
                  {char}
                </span>
              </span>
            );
          })}
        </div>

        {/* 
          SUBTITLE: Medical Astrology & Cartomancy
          Exact wording mandated. Restrained modern sans-serif widely tracked.
        */}
        <div
          className={`mt-6 sm:mt-8 transition-all duration-1000 transform ${
            introState === 'SUBTITLE_REVEAL' || introState === 'INTERFACE_REVEAL'
              ? 'opacity-90 translate-y-0'
              : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-[#C59B4B]/60" />
            <span
              className="text-xs sm:text-sm md:text-base uppercase tracking-[0.25em] sm:tracking-[0.32em] font-sans font-normal text-[#DFBF77]"
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              {SUBTITLE_TEXT}
            </span>
            <span className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-[#C59B4B]/60" />
          </div>

          <p className="mt-3 text-[11px] sm:text-xs text-[#94A3B8]/70 font-mono tracking-widest uppercase">
            Private Celestial Observatory & Somatic Folio
          </p>
        </div>
      </div>

      {/* Bottom atmospheric status ticker */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#64748B]/50">
          {introState === 'INITIAL_DARKNESS'
            ? 'ENTERING STELLAR VOID'
            : introState === 'CENTRAL_SPARK'
            ? 'CELESTIAL SPARK IGNITING'
            : introState === 'CELESTIAL_EXPANSION'
            ? 'EXPANDING ASTRAL HORIZON'
            : introState === 'LETTER_REVEAL'
            ? 'REVEALING IDENTITY'
            : introState === 'BRAND_COMPLETE'
            ? 'PURVAPHALGUNI STABILISED'
            : introState === 'SUBTITLE_REVEAL'
            ? 'SYSTEM INITIALISED'
            : 'AWAKENING OBSERVATORY'}
        </span>
      </div>
    </div>
  );
};
