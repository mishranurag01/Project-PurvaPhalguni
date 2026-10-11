/**
 * Application Constants
 * 
 * Central repository for all static branding, navigation routes, 
 * astronomical configuration, and timing constants.
 */

export const APP_METADATA = {
  BRAND_NAME: 'Purva Phalguni',
  WORDMARK: 'PURVAPHALGUNI',
  SUBTITLE: 'Medical Astrology & Cartomancy',
  TAGLINE: 'Where celestial patterns meet the language of health and human experience.',
  DESCRIPTION:
    'A sophisticated private observatory uniting classical sidereal astronomical mechanics (Parashari Jyotish, Lahiri Ayanamsha) with Hermetic symbolic cartomancy.',
  VERSION: '2.4.0',
  CANONICAL_URL: 'https://purvaphalguni.com'
} as const;

export const ASTRONOMY_CONFIG = {
  AYANAMSHA: 'Lahiri (Chitra Paksha)',
  DEFAULT_LOCATION: {
    CITY: 'Ujjain, India (Prime Meridian of Classical Jyotish)',
    LATITUDE: 23.1765,
    LONGITUDE: 75.7885
  },
  EPHEMERIS: 'Vedic Sidereal High-Precision Orbitals'
} as const;

export const NAVIGATION_SECTIONS = [
  { id: 'observatory', label: 'Observatory' },
  { id: 'medical-astrology', label: 'Medical Astrology' },
  { id: 'cartomancy', label: 'Cartomancy' },
  { id: 'insights', label: 'Insights' },
  { id: 'about-section', label: 'About' }
] as const;

export const UI_TIMINGS = {
  NOTIFICATION_AUTO_DISMISS_MS: 3500,
  MODAL_TRANSITION_MS: 300,
  SPARK_DELAY_MS: 750,
  EXPANSION_DELAY_MS: 950,
  LETTER_CADENCE_MS: 120
} as const;
