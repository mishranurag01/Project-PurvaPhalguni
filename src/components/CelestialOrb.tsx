import React from 'react';

interface CelestialOrbsProps {
  reducedMotion?: boolean;
}

export const CelestialBackdrop: React.FC<CelestialOrbsProps> = ({ reducedMotion = false }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Soft warm ivory / celestial gradients in corners */}
      <div 
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #F2E7D5 0%, rgba(250, 248, 245, 0) 70%)' }}
      />
      <div 
        className="absolute top-1/3 -left-40 w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #EAE5F5 0%, rgba(250, 248, 245, 0) 70%)' }}
      />
      <div 
        className="absolute bottom-10 right-10 w-80 h-80 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #F8EFE4 0%, rgba(250, 248, 245, 0) 70%)' }}
      />

      {/* Delicate fine orbit rings and constellation star line vector */}
      <svg 
        className={`absolute top-12 right-6 md:right-24 w-[360px] md:w-[480px] h-[360px] md:h-[480px] opacity-25 ${reducedMotion ? '' : 'animate-celestial-spin'}`}
        viewBox="0 0 500 500" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Orbital rings */}
        <circle cx="250" cy="250" r="230" stroke="#C59B4B" strokeWidth="0.75" strokeDasharray="3 6" opacity="0.6" />
        <circle cx="250" cy="250" r="180" stroke="#8E7CC3" strokeWidth="0.5" opacity="0.5" />
        <circle cx="250" cy="250" r="120" stroke="#C59B4B" strokeWidth="0.75" opacity="0.4" />
        <circle cx="250" cy="250" r="60" stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" />
        <circle cx="250" cy="250" r="2" fill="#C59B4B" opacity="0.9" />

        {/* Orbiting celestial nodes */}
        <circle cx="480" cy="250" r="3.5" fill="#C59B4B" opacity="0.7" />
        <circle cx="250" cy="70" r="2.5" fill="#8E7CC3" opacity="0.6" />
        <circle cx="130" cy="250" r="2" fill="#D97706" opacity="0.6" />
        <circle cx="335" cy="165" r="2.5" fill="#64748B" opacity="0.6" />

        {/* Fine crosshairs */}
        <line x1="250" y1="15" x2="250" y2="485" stroke="#C59B4B" strokeWidth="0.5" strokeDasharray="1 8" opacity="0.3" />
        <line x1="15" y1="250" x2="485" y2="250" stroke="#C59B4B" strokeWidth="0.5" strokeDasharray="1 8" opacity="0.3" />
      </svg>

      {/* Gentle left side celestial geometry */}
      <svg 
        className={`absolute bottom-20 -left-16 w-80 h-80 opacity-20 ${reducedMotion ? '' : 'animate-celestial-spin-reverse'}`}
        viewBox="0 0 300 300" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="150" cy="150" r="140" stroke="#C59B4B" strokeWidth="0.5" strokeDasharray="4 8" />
        <circle cx="150" cy="150" r="100" stroke="#8E7CC3" strokeWidth="0.5" />
        <polygon points="150,20 262.5,215 37.5,215" stroke="#C59B4B" strokeWidth="0.5" opacity="0.35" />
        <polygon points="150,280 37.5,85 262.5,85" stroke="#8E7CC3" strokeWidth="0.5" opacity="0.35" />
        <circle cx="150" cy="150" r="3" fill="#C59B4B" opacity="0.8" />
      </svg>
    </div>
  );
};
