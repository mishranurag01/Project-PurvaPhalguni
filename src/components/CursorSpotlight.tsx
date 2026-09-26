import React, { useEffect, useRef, useState } from 'react';

interface CursorSpotlightProps {
  reducedMotion?: boolean;
}

export const CursorSpotlight: React.FC<CursorSpotlightProps> = ({ reducedMotion = false }) => {
  const [position, setPosition] = useState({ x: -500, y: -500 });
  const [opacity, setOpacity] = useState(0);
  const targetPos = useRef({ x: -500, y: -500 });
  const currentPos = useRef({ x: -500, y: -500 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    // Detect touch-only devices to avoid unnecessary CPU
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Smooth spring/lerp following effect
    const animate = () => {
      const ease = 0.08;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;
      setPosition({ x: currentPos.current.x, y: currentPos.current.y });
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-700 overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      <div
        className="absolute rounded-full"
        style={{
          width: '560px',
          height: '560px',
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(226, 185, 111, 0.07) 0%, rgba(142, 124, 195, 0.04) 40%, rgba(250, 248, 245, 0) 70%)',
          filter: 'blur(32px)',
          mixBlendMode: 'multiply'
        }}
      />
    </div>
  );
};
