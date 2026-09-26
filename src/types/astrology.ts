export type ZodiacSign = 
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' 
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' 
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface SignData {
  number: number; // 1 to 12
  name: ZodiacSign;
  sanskrit: string;
  ruler: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  quality: 'Chara (Movable)' | 'Sthira (Fixed)' | 'Dvisvabhava (Dual)';
}

export type PlanetName = 
  | 'Sun' | 'Moon' | 'Mars' | 'Mercury' 
  | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu' | 'Ascendant';

export interface PlanetPosition {
  name: PlanetName;
  sanskrit: string;
  symbol: string;
  shortCode: string;
  longitude: number; // 0 to 360
  sign: ZodiacSign;
  signNumber: number; // 1 to 12
  degreesInSign: number; // 0 to 30
  house: number; // 1 to 12
  nakshatra: string;
  nakshatraLord: string;
  pada: number; // 1 to 4
  isRetrograde: boolean;
  dignity: 'Exalted' | 'Moolatrikona' | 'Own Sign' | 'Great Friend' | 'Neutral' | 'Enemy' | 'Debilitated';
  karaka: string;
  gemstone: string;
  color: string;
}

export interface HouseInfo {
  houseNumber: number;
  sign: ZodiacSign;
  signNumber: number;
  sanskritName: string;
  theme: string;
  significance: string[];
  planets: PlanetPosition[];
}

export interface DashaPeriod {
  lord: PlanetName;
  startDate: string;
  endDate: string;
  durationYears: number;
  isCurrent?: boolean;
  subPeriods?: {
    lord: PlanetName;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
  }[];
}

export interface BirthProfile {
  id: string;
  name: string;
  title: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  summaryQuote: string;
}

export interface ChartCalculationResult {
  profile: BirthProfile;
  ascendant: PlanetPosition;
  planets: PlanetPosition[];
  houses: HouseInfo[];
  navamsaPlanets: PlanetPosition[];
  currentDasha: {
    mahadasha: PlanetName;
    antardasha: PlanetName;
    pratyantardasha: PlanetName;
    progressPercentage: number;
    timeline: DashaPeriod[];
  };
  transits: {
    planet: PlanetName;
    currentSign: ZodiacSign;
    transitHouse: number;
    aspectsNatal: string;
    theme: string;
  }[];
  elementalBalance: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  dominantGraha: string;
  creativeGift: string;
}

export interface ConsultationService {
  id: string;
  title: string;
  duration: string;
  price: string;
  description: string;
  focusAreas: string[];
  deliverables: string[];
  recommendedFor: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  location: string;
  service: string;
  quote: string;
  date: string;
  rating: number;
}

export interface StudyArticle {
  id: string;
  title: string;
  subtitle: string;
  category: 'Nakshatra Wisdom' | 'Parashari Foundations' | 'Planetary Archetypes' | 'Timing & Dasha';
  readTime: string;
  excerpt: string;
  content: string[];
  keyTakeaway: string;
}
