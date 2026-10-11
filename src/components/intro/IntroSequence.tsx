import React, { useState, useEffect, useRef } from 'react';
import { soundSynth } from '../../utils/soundAmbience';

interface IntroSequenceProps {
  onComplete: () => void;
  reducedMotion?: boolean;
}

// Brand letters: "Purvaphalguni"
const NAME_LETTERS = ['P', 'u', 'r', 'v', 'a', 'p', 'h', 'a', 'l', 'g', 'u', 'n', 'i'];
const SUBTITLE_TEXT = 'medical astrology & cartomancy';

export const IntroSequence: React.FC<IntroSequenceProps> = ({
  onComplete,
  reducedMotion = false
}) => {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [isSubOn, setIsSubOn] = useState<boolean>(false);
  const [isOut, setIsOut] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // If user prefers reduced motion, bypass cinematic timings
  useEffect(() => {
    if (reducedMotion) {
      setActiveIndices(NAME_LETTERS.map((_, i) => i));
      setIsSubOn(true);
      const timer = setTimeout(() => {
        setIsOut(true);
        setTimeout(() => {
          setIsFinished(true);
          onComplete();
        }, 100);
      }, 300);
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
    if (isOut || isFinished) return;
    setIsOut(true);
    setTimeout(() => {
      setIsFinished(true);
      onComplete();
    }, 400);
  };

  // Main animation sequence timing
  useEffect(() => {
    if (reducedMotion) return;

    // Optional subtle celestial chime
    soundSynth.playCelestialChime();

    // 1. Reveal letters one by one with subtle stagger
    const timeouts: NodeJS.Timeout[] = [];
    const letterStaggerMs = 95;
    const initialDelay = 180;

    NAME_LETTERS.forEach((_, idx) => {
      const t = setTimeout(() => {
        setActiveIndices((prev) => [...prev, idx]);
      }, initialDelay + idx * letterStaggerMs);
      timeouts.push(t);
    });

    // 2. Reveal subtitle once wordmark is nearing completion
    const subDelay = initialDelay + NAME_LETTERS.length * letterStaggerMs + 200;
    const subTimeout = setTimeout(() => {
      setIsSubOn(true);
    }, subDelay);
    timeouts.push(subTimeout);

    // 3. Initiate fade out transition (#intro.out)
    const outDelay = subDelay + 2200;
    const outTimeout = setTimeout(() => {
      setIsOut(true);
    }, outDelay);
    timeouts.push(outTimeout);

    // 4. Complete after 2s fade out transition
    const finishDelay = outDelay + 2000;
    const finishTimeout = setTimeout(() => {
      setIsFinished(true);
      onComplete();
    }, finishDelay);
    timeouts.push(finishTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [reducedMotion, onComplete]);

  // Atmospheric Canvas: Starlight & Drifting Celestial Motes
  useEffect(() => {
    if (reducedMotion || isFinished) return;
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

    // Generate stars with diverse depths, speeds and celestial hues
    const starCount = 85;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.7 + 0.15,
      twinkleSpeed: 0.015 + Math.random() * 0.025,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.18,
      color: Math.random() > 0.4 ? 'rgba(233, 217, 176,' : 'rgba(170, 178, 214,'
    }));

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Deep celestial radial background gradient
      const centerX = width / 2;
      const centerY = height / 2;
      const radialGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(width, height) * 0.65
      );
      radialGrad.addColorStop(0, 'rgba(20, 25, 58, 0.4)');
      radialGrad.addColorStop(0.5, 'rgba(10, 13, 30, 0.8)');
      radialGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');

      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Render drifting stars
      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around viewport boundaries
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const currentAlpha = star.alpha * (0.65 + 0.35 * Math.sin(time * star.twinkleSpeed * 10 + star.phase));
        ctx.fillStyle = `${star.color} ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion, isFinished]);

  if (isFinished) {
    return null;
  }

  return (
    <div
      id="intro"
      className={isOut ? 'out' : ''}
      role="region"
      aria-label="Purvaphalguni Celestial Opening"
    >
      {/* Background Celestial Canvas */}
      <canvas ref={canvasRef} />

      {/* Discreet Skip Button */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-20">
        <button
          onClick={handleSkip}
          className="text-xs uppercase tracking-[0.2em] text-[#aab2d6]/50 hover:text-[#e9d9b0] transition-colors duration-300 py-1.5 px-3 rounded-full border border-white/5 hover:border-[#e9d9b0]/30 bg-black/40 backdrop-blur-xs flex items-center gap-1.5 cursor-pointer font-sans"
          title="Skip introductory animation (Press Esc)"
          aria-label="Skip introductory animation"
        >
          <span>Skip</span>
          <span className="text-[10px] opacity-60 font-mono">[Esc]</span>
        </button>
      </div>

      {/* Title Container matching exact user markup: .title, #name, #sub */}
      <div className="title">
        <div id="name" aria-label="Purvaphalguni">
          {NAME_LETTERS.map((char, index) => (
            <span
              key={`${char}-${index}`}
              className={activeIndices.includes(index) ? 'on' : ''}
            >
              {char}
            </span>
          ))}
        </div>

        <div id="sub" className={isSubOn ? 'on' : ''}>
          {SUBTITLE_TEXT}
        </div>
      </div>
    </div>
  );
};
