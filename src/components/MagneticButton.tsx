import React, { useRef, useState } from 'react';
import { soundSynth } from '../utils/soundAmbience';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'gold' | 'secondary' | 'ghost' | 'navy';
  className?: string;
  reducedMotion?: boolean;
  magneticStrength?: number; // max px offset
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  reducedMotion = false,
  magneticStrength = 5,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    // Limit movement to magneticStrength (approx 4-6px)
    setOffset({
      x: deltaX * magneticStrength,
      y: deltaY * magneticStrength
    });

    // Record percentage for light-pass glow effect
    setCursorPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundSynth.playSoftTap();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundSynth.playSoftTap();
    if (onClick) onClick(e);
  };

  // Base styling per variant
  let variantStyles = '';
  switch (variant) {
    case 'primary':
    case 'navy':
      variantStyles = 'bg-[#0F172A] text-[#FAF8F5] border border-[#C59B4B]/30 hover:border-[#C59B4B]/80 hover:shadow-lg hover:shadow-[#0F172A]/10 active:scale-[0.98]';
      break;
    case 'gold':
      variantStyles = 'bg-[#C59B4B] text-[#0F172A] font-medium border border-[#A87F32]/40 hover:bg-[#D4AF37] hover:shadow-md hover:shadow-[#C59B4B]/20 active:scale-[0.98]';
      break;
    case 'secondary':
      variantStyles = 'bg-white text-[#0F172A] border border-[#E8E2D8] hover:border-[#C59B4B]/60 hover:bg-[#FDFBF7] hover:shadow-sm active:scale-[0.98]';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent text-[#0F172A] hover:bg-[#F3EFE6]/60 border border-transparent hover:border-[#E8E2D8] active:scale-[0.98]';
      break;
  }

  const transformStyle = reducedMotion
    ? undefined
    : {
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${isHovered ? 1.025 : 1})`,
        transition: isHovered ? 'transform 0.12s cubic-bezier(0.2, 0, 0.2, 1)' : 'transform 0.35s cubic-bezier(0.2, 0, 0.2, 1)'
      };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={transformStyle}
      className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide overflow-hidden cursor-pointer select-none transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B4B] ${variantStyles} ${className}`}
      {...props}
    >
      {/* Light-pass shimmer overlay */}
      {!reducedMotion && isHovered && (
        <span
          className="pointer-events-none absolute inset-0 opacity-25 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${cursorPos.x}% ${cursorPos.y}%, rgba(255, 248, 220, 0.6) 0%, rgba(255, 255, 255, 0) 60%)`
          }}
          aria-hidden="true"
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};
