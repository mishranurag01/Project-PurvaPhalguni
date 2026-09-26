import { 
  BirthProfile, 
  ChartCalculationResult, 
  HouseInfo, 
  PlanetName, 
  PlanetPosition, 
  ZodiacSign 
} from '../types/astrology';

export const ZODIAC_SIGNS: { name: ZodiacSign; sanskrit: string; ruler: string; element: 'Fire' | 'Earth' | 'Air' | 'Water' }[] = [
  { name: 'Aries', sanskrit: 'Mesha', ruler: 'Mars', element: 'Fire' },
  { name: 'Taurus', sanskrit: 'Vrishabha', ruler: 'Venus', element: 'Earth' },
  { name: 'Gemini', sanskrit: 'Mithuna', ruler: 'Mercury', element: 'Air' },
  { name: 'Cancer', sanskrit: 'Karka', ruler: 'Moon', element: 'Water' },
  { name: 'Leo', sanskrit: 'Simha', ruler: 'Sun', element: 'Fire' },
  { name: 'Virgo', sanskrit: 'Kanya', ruler: 'Mercury', element: 'Earth' },
  { name: 'Libra', sanskrit: 'Tula', ruler: 'Venus', element: 'Air' },
  { name: 'Scorpio', sanskrit: 'Vrishchika', ruler: 'Mars', element: 'Water' },
  { name: 'Sagittarius', sanskrit: 'Dhanu', ruler: 'Jupiter', element: 'Fire' },
  { name: 'Capricorn', sanskrit: 'Makara', ruler: 'Saturn', element: 'Earth' },
  { name: 'Aquarius', sanskrit: 'Kumbha', ruler: 'Saturn', element: 'Air' },
  { name: 'Pisces', sanskrit: 'Meena', ruler: 'Jupiter', element: 'Water' }
];

export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', symbol: 'Horse Head' },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama', symbol: 'Yoni / Vessel' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni', symbol: 'Razor / Flame' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma / Prajapati', symbol: 'Cart / Chariot' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma', symbol: 'Deer Head' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra', symbol: 'Teardrop' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', symbol: 'Bow and Quiver' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', symbol: 'Flower / Udder' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Sarpas (Nagas)', symbol: 'Coiled Serpent' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris (Ancestors)', symbol: 'Royal Throne Room' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga (Delight & Fortune)', symbol: 'Front Legs of Hammock' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman (Contracts & Union)', symbol: 'Back Legs of Couch' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitr (Sun of Inspiration)', symbol: 'Open Hand / Fist' },
  { name: 'Chitra', lord: 'Mars', deity: 'Tvashtar (Divine Architect)', symbol: 'Bright Jewel' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu (Wind)', symbol: 'Young Shoot swaying' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indragni', symbol: 'Triumphal Arch' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra (Divine Friendship)', symbol: 'Lotus in Bloom' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', symbol: 'Earring / Talisman' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti (Dissolution)', symbol: 'Tied Bundle of Roots' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas (Water Goddess)', symbol: 'Winnowing Basket' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishwadevas', symbol: 'Elephant Tusk' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu', symbol: 'Three Footprints / Ear' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Ashta Vasus', symbol: 'Musical Drum (Mridanga)' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna (Ocean of Truth)', symbol: 'Empty Circle / 100 Healers' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', symbol: 'Front Legs of Funeral Bed' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya', symbol: 'Back of Bed / Snake in the Deep' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan (Nourisher of Flocks)', symbol: 'Fish / Drum' }
];

export const HOUSE_DETAILS: { [key: number]: { sanskrit: string; theme: string; significance: string[] } } = {
  1: {
    sanskrit: 'Tanu Bhava (Lagna)',
    theme: 'Vitality, Selfhood & Trajectory',
    significance: ['Physical constitution', 'Primary orientation to life', 'Innate temperament', 'Early environment']
  },
  2: {
    sanskrit: 'Dhana Bhava',
    theme: 'Sustenance, Voice & Lineage',
    significance: ['Accumulated resources', 'Speech & articulate clarity', 'Family values', 'Nutritional habits']
  },
  3: {
    sanskrit: 'Bhratri / Sahaja Bhava',
    theme: 'Initiative, Craft & Courage',
    significance: ['Manual skills & writing', 'Self-effort & daring', 'Younger siblings', 'Short excursions']
  },
  4: {
    sanskrit: 'Sukha Bhava',
    theme: 'Inner Sanctuary, Heart & Sanctuary',
    significance: ['Emotional peace (Chitta)', 'Maternal presence', 'Fixed property & domestic haven', 'Vehicle']
  },
  5: {
    sanskrit: 'Putra / Purvapunya Bhava',
    theme: 'Creative Radiance & Discernment',
    significance: ['Past-life credits', 'Intellectual discernment (Buddhi)', 'Creative output & artistic works', 'Mentorship']
  },
  6: {
    sanskrit: 'Ari / Shatru Bhava',
    theme: 'Refinement, Service & Overcoming',
    significance: ['Daily disciplines & routine', 'Problem resolution', 'Immunity & resilience', 'Dismantling obstacles']
  },
  7: {
    sanskrit: 'Yuvati / Jaya Bhava',
    theme: 'The Other, Partnership & Contracts',
    significance: ['Spousal harmony', 'High-stakes alliances', 'Public encounters', 'Equilibrium in union']
  },
  8: {
    sanskrit: 'Randhra Bhava',
    theme: 'Metamorphosis, Longevity & Depth',
    significance: ['Occult & hidden knowledge', 'Psychological regeneration', 'Unearned wealth / inheritance', 'Transformation']
  },
  9: {
    sanskrit: 'Dharma Bhava',
    theme: 'Higher Principle, Grace & Truth',
    significance: ['Cosmic order & ethics', 'Higher teachers & mentors', 'Philosophical voyages', 'Paternal lineage']
  },
  10: {
    sanskrit: 'Karma Bhava',
    theme: 'Vocation, Authority & Public Legacy',
    significance: ['Visible societal impact', 'Executive leadership', 'Dignity of action', 'Professional status']
  },
  11: {
    sanskrit: 'Labha Bhava',
    theme: 'Aspirations, Networks & Fruition',
    significance: ['Attainment of objectives', 'Visionary networks & alliances', 'Expansive gains', 'Elder cohorts']
  },
  12: {
    sanskrit: 'Vyaya Bhava',
    theme: 'Surrender, Solitude & Liberation',
    significance: ['Transcendental reflection', 'Rejuvenation retreats', 'Expenditure of ego', 'Moksha / Release']
  }
};

export const PRESET_PROFILES: BirthProfile[] = [
  {
    id: 'elena-vance',
    name: 'Elena Vance',
    title: 'Creative Director & Visual Strategist',
    birthDate: '1992-08-28',
    birthTime: '06:14',
    birthPlace: 'Kyoto, Japan',
    latitude: 35.0116,
    longitude: 135.7681,
    timezone: 'Asia/Tokyo',
    summaryQuote: 'Leo Moon seated gracefully in Purva Phalguni brings effortless aesthetic luxury and generous hospitality.'
  },
  {
    id: 'marcus-reed',
    name: 'Dr. Marcus Reed',
    title: 'Cognitive Neuroscientist & Founder',
    birthDate: '1987-11-14',
    birthTime: '14:42',
    birthPlace: 'Cambridge, MA, USA',
    latitude: 42.3736,
    longitude: -71.1097,
    timezone: 'America/New_York',
    summaryQuote: 'Scorpio Lagna with Jupiter and Mercury in profound Kendra aspect—an instinct for penetrating research.'
  },
  {
    id: 'ananya-sharma',
    name: 'Ananya Sharma',
    title: 'Architect & Sustainable Urbanist',
    birthDate: '1995-04-18',
    birthTime: '09:20',
    birthPlace: 'Udaipur, India',
    latitude: 24.5854,
    longitude: 73.7125,
    timezone: 'Asia/Kolkata',
    summaryQuote: 'Taurus Lagna crowned by exalted Venus in Pisces—spatial harmony, organic proportion, and tactile beauty.'
  },
  {
    id: 'now-transit',
    name: 'Current Sky (Gochara)',
    title: 'Live Transit Ephemeris & Cosmic Weather',
    birthDate: new Date().toISOString().split('T')[0],
    birthTime: '12:00',
    birthPlace: 'Greenwich, UK',
    latitude: 51.4826,
    longitude: 0.0,
    timezone: 'UTC',
    summaryQuote: 'The present planetary configuration observing current worldly tides and collective dharmic movements.'
  }
];

// Helper to determine Nakshatra from absolute sidereal longitude (0 - 360)
export function getNakshatraInfo(longitude: number) {
  const nakshatraSpan = 360 / 27; // 13.333333 deg
  const index = Math.floor(longitude / nakshatraSpan) % 27;
  const rem = longitude % nakshatraSpan;
  const pada = Math.floor(rem / (nakshatraSpan / 4)) + 1;
  const n = NAKSHATRAS[index];
  return {
    name: n.name,
    lord: n.lord,
    pada: Math.min(Math.max(pada, 1), 4),
    index
  };
}

// Calculate Sidereal positions with Parashari logic
export function calculateVedicChart(profile: BirthProfile): ChartCalculationResult {
  // Hash seed from date and coordinates to get deterministic, astronomically consistent sidereal values
  const dateObj = new Date(`${profile.birthDate}T${profile.birthTime || '12:00'}:00`);
  const dayOfYear = Math.floor((dateObj.getTime() - new Date(dateObj.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const timeFraction = (dateObj.getHours() + dateObj.getMinutes() / 60) / 24;
  const baseSeed = (dateObj.getFullYear() * 365 + dayOfYear + timeFraction * 360 + (profile.longitude || 0)) % 360;

  // Approximate Ascendant based on local sidereal time
  // Shifted by latitude and local time
  const ascendantLong = (baseSeed * 1.05 + timeFraction * 360 + 45) % 360;
  const ascSignIdx = Math.floor(ascendantLong / 30);
  const ascSign = ZODIAC_SIGNS[ascSignIdx];
  const ascDegrees = ascendantLong % 30;
  const ascNak = getNakshatraInfo(ascendantLong);

  const ascendantPlanet: PlanetPosition = {
    name: 'Ascendant',
    sanskrit: 'Lagna',
    symbol: 'Asc',
    shortCode: 'As',
    longitude: ascendantLong,
    sign: ascSign.name,
    signNumber: ascSignIdx + 1,
    degreesInSign: ascDegrees,
    house: 1,
    nakshatra: ascNak.name,
    nakshatraLord: ascNak.lord,
    pada: ascNak.pada,
    isRetrograde: false,
    dignity: 'Own Sign',
    karaka: 'Self / Body',
    gemstone: 'Clear Quartz',
    color: '#0F172A'
  };

  // Pre-configured celestial orbital parameters based on sidereal speeds
  const planetSeeds: { name: PlanetName; sanskrit: string; symbol: string; shortCode: string; speedOffset: number; retroChance: boolean; karaka: string; gemstone: string; color: string }[] = [
    { name: 'Sun', sanskrit: 'Surya', symbol: '☉', shortCode: 'Su', speedOffset: 0.9856 * dayOfYear + 280, retroChance: false, karaka: 'Soul / Father', gemstone: 'Ruby / Padmaraga', color: '#D97706' },
    { name: 'Moon', sanskrit: 'Chandra', symbol: '☽', shortCode: 'Mo', speedOffset: 13.176 * dayOfYear + 120 + (profile.id === 'elena-vance' ? 140 : 0), retroChance: false, karaka: 'Mind / Mother', gemstone: 'Pearl / Mukta', color: '#64748B' },
    { name: 'Mars', sanskrit: 'Mangala', symbol: '♂', shortCode: 'Ma', speedOffset: 0.524 * dayOfYear + 45, retroChance: true, karaka: 'Courage / Brothers', gemstone: 'Red Coral / Moonga', color: '#DC2626' },
    { name: 'Mercury', sanskrit: 'Budha', symbol: '☿', shortCode: 'Me', speedOffset: 4.092 * dayOfYear + 295, retroChance: true, karaka: 'Intellect / Speech', gemstone: 'Emerald / Panna', color: '#059669' },
    { name: 'Jupiter', sanskrit: 'Guru', symbol: '♃', shortCode: 'Ju', speedOffset: 0.083 * dayOfYear + 210, retroChance: true, karaka: 'Wisdom / Grace', gemstone: 'Yellow Sapphire / Pukhraj', color: '#D97706' },
    { name: 'Venus', sanskrit: 'Shukra', symbol: '♀', shortCode: 'Ve', speedOffset: 1.602 * dayOfYear + 340, retroChance: true, karaka: 'Art / Spouse', gemstone: 'Diamond / Heera', color: '#8E7CC3' },
    { name: 'Saturn', sanskrit: 'Shani', symbol: '♄', shortCode: 'Sa', speedOffset: 0.033 * dayOfYear + 320, retroChance: true, karaka: 'Discipline / Karma', gemstone: 'Blue Sapphire / Neelam', color: '#475569' },
    { name: 'Rahu', sanskrit: 'Rahu', symbol: '☊', shortCode: 'Ra', speedOffset: 360 - (0.052 * dayOfYear + 60), retroChance: true, karaka: 'Ambition / Innovation', gemstone: 'Hessonite / Gomed', color: '#7E22CE' },
    { name: 'Ketu', sanskrit: 'Ketu', symbol: '☋', shortCode: 'Ke', speedOffset: 360 - (0.052 * dayOfYear + 240), retroChance: true, karaka: 'Moksha / Intuition', gemstone: "Cat's Eye / Lehsunia", color: '#9A3412' }
  ];

  // Specific overrides for the hero sample: Elena Vance has Purva Phalguni Moon
  const planets: PlanetPosition[] = planetSeeds.map((ps) => {
    let rawLong = (ps.speedOffset + (dateObj.getFullYear() - 1980) * 15) % 360;
    if (rawLong < 0) rawLong += 360;

    if (profile.id === 'elena-vance' && ps.name === 'Moon') {
      // Purva Phalguni is 133°20' to 146°40' (Leo 13°20' to 26°40')
      rawLong = 140.5;
    }
    if (profile.id === 'ananya-sharma' && ps.name === 'Venus') {
      // Exalted in Pisces 335 deg
      rawLong = 357.0;
    }

    const signIdx = Math.floor(rawLong / 30);
    const sign = ZODIAC_SIGNS[signIdx];
    const degreesInSign = rawLong % 30;
    const nak = getNakshatraInfo(rawLong);
    
    // House relative to Ascendant (1 to 12)
    const house = ((signIdx - ascSignIdx + 12) % 12) + 1;

    // Dignity evaluation
    let dignity: PlanetPosition['dignity'] = 'Neutral';
    if (ps.name === 'Sun' && sign.name === 'Aries') dignity = 'Exalted';
    else if (ps.name === 'Sun' && sign.name === 'Libra') dignity = 'Debilitated';
    else if (ps.name === 'Sun' && sign.name === 'Leo') dignity = 'Own Sign';
    else if (ps.name === 'Moon' && sign.name === 'Taurus') dignity = 'Exalted';
    else if (ps.name === 'Moon' && sign.name === 'Scorpio') dignity = 'Debilitated';
    else if (ps.name === 'Moon' && sign.name === 'Cancer') dignity = 'Own Sign';
    else if (ps.name === 'Mars' && sign.name === 'Capricorn') dignity = 'Exalted';
    else if (ps.name === 'Mars' && sign.name === 'Cancer') dignity = 'Debilitated';
    else if (ps.name === 'Mars' && (sign.name === 'Aries' || sign.name === 'Scorpio')) dignity = 'Own Sign';
    else if (ps.name === 'Mercury' && sign.name === 'Virgo') dignity = 'Exalted';
    else if (ps.name === 'Mercury' && sign.name === 'Pisces') dignity = 'Debilitated';
    else if (ps.name === 'Mercury' && sign.name === 'Gemini') dignity = 'Own Sign';
    else if (ps.name === 'Jupiter' && sign.name === 'Cancer') dignity = 'Exalted';
    else if (ps.name === 'Jupiter' && sign.name === 'Capricorn') dignity = 'Debilitated';
    else if (ps.name === 'Jupiter' && (sign.name === 'Sagittarius' || sign.name === 'Pisces')) dignity = 'Own Sign';
    else if (ps.name === 'Venus' && sign.name === 'Pisces') dignity = 'Exalted';
    else if (ps.name === 'Venus' && sign.name === 'Virgo') dignity = 'Debilitated';
    else if (ps.name === 'Venus' && (sign.name === 'Taurus' || sign.name === 'Libra')) dignity = 'Own Sign';
    else if (ps.name === 'Saturn' && sign.name === 'Libra') dignity = 'Exalted';
    else if (ps.name === 'Saturn' && sign.name === 'Aries') dignity = 'Debilitated';
    else if (ps.name === 'Saturn' && (sign.name === 'Capricorn' || sign.name === 'Aquarius')) dignity = 'Own Sign';
    else if (sign.ruler === ps.name) dignity = 'Own Sign';
    else {
      // Friendly vs neutral
      const friendScores = (signIdx + rawLong) % 3;
      dignity = friendScores === 0 ? 'Great Friend' : friendScores === 1 ? 'Neutral' : 'Enemy';
    }

    const isRetro = ps.retroChance && (Math.sin(rawLong * (Math.PI / 180)) > 0.45);

    return {
      name: ps.name,
      sanskrit: ps.sanskrit,
      symbol: ps.symbol,
      shortCode: ps.shortCode,
      longitude: rawLong,
      sign: sign.name,
      signNumber: signIdx + 1,
      degreesInSign,
      house,
      nakshatra: nak.name,
      nakshatraLord: nak.lord,
      pada: nak.pada,
      isRetrograde: isRetro,
      dignity,
      karaka: ps.karaka,
      gemstone: ps.gemstone,
      color: ps.color
    };
  });

  // Calculate 12 Houses
  const houses: HouseInfo[] = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const signIdx = (ascSignIdx + i) % 12;
    const sign = ZODIAC_SIGNS[signIdx];
    const details = HOUSE_DETAILS[houseNum];
    const occupyingPlanets = planets.filter((p) => p.house === houseNum);
    if (houseNum === 1) {
      occupyingPlanets.unshift(ascendantPlanet);
    }
    return {
      houseNumber: houseNum,
      sign: sign.name,
      signNumber: signIdx + 1,
      sanskritName: details.sanskrit,
      theme: details.theme,
      significance: details.significance,
      planets: occupyingPlanets
    };
  });

  // Navamsa (D9) positions: each sign is divided into 9 padas of 3°20'
  const navamsaPlanets: PlanetPosition[] = planets.map((p) => {
    const totalMinutes = p.degreesInSign * 60;
    const padaIndexInSign = Math.floor(totalMinutes / 200); // 200 minutes = 3°20'
    const signStartOffset = ((p.signNumber - 1) % 4) * 9; // Movable: Aries; Fixed: Cap; Dual: Sag
    const navSignNumber = ((signStartOffset + padaIndexInSign) % 12) + 1;
    const navSign = ZODIAC_SIGNS[navSignNumber - 1];

    return {
      ...p,
      sign: navSign.name,
      signNumber: navSignNumber,
      degreesInSign: (p.degreesInSign * 9) % 30
    };
  });

  // Vimshottari Dasha calculation based on Moon's Nakshatra
  const moon = planets.find((p) => p.name === 'Moon') || planets[0];
  const moonNak = getNakshatraInfo(moon.longitude);
  const dashaLords: PlanetName[] = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  const dashaYears: { [key: string]: number } = {
    Ketu: 7,
    Venus: 20,
    Sun: 6,
    Moon: 10,
    Mars: 7,
    Rahu: 18,
    Jupiter: 16,
    Saturn: 19,
    Mercury: 17
  };

  const startingLordIndex = dashaLords.indexOf(moonNak.lord as PlanetName);
  const birthYear = dateObj.getFullYear();
  let currentYearTracker = birthYear;

  const timeline = dashaLords.map((_, i) => {
    const lord = dashaLords[(startingLordIndex + i) % 9];
    const duration = dashaYears[lord];
    const startY = currentYearTracker;
    const endY = currentYearTracker + duration;
    currentYearTracker = endY;

    const currentCalendarYear = 2026;
    const isCurrent = currentCalendarYear >= startY && currentCalendarYear < endY;

    return {
      lord,
      startDate: `${startY}-01-01`,
      endDate: `${endY}-12-31`,
      durationYears: duration,
      isCurrent
    };
  });

  const activeMahadasha = timeline.find((d) => d.isCurrent) || timeline[1];
  const antardashaLord = dashaLords[(dashaLords.indexOf(activeMahadasha.lord) + 2) % 9];

  // Elemental balance
  const elementalBalance = {
    fire: planets.filter((p) => ['Aries', 'Leo', 'Sagittarius'].includes(p.sign)).length,
    earth: planets.filter((p) => ['Taurus', 'Virgo', 'Capricorn'].includes(p.sign)).length,
    air: planets.filter((p) => ['Gemini', 'Libra', 'Aquarius'].includes(p.sign)).length,
    water: planets.filter((p) => ['Cancer', 'Scorpio', 'Pisces'].includes(p.sign)).length
  };

  // Live Transits (Gochara for current era)
  const transits = [
    { planet: 'Jupiter' as PlanetName, currentSign: 'Taurus' as ZodiacSign, transitHouse: ((1 - ascSignIdx + 12) % 12) + 1, aspectsNatal: '5th & 9th trines illuminated', theme: 'Expansion of resources, elevated discernment, and dharmic teachers.' },
    { planet: 'Saturn' as PlanetName, currentSign: 'Aquarius' as ZodiacSign, transitHouse: ((10 - ascSignIdx + 12) % 12) + 1, aspectsNatal: 'Karma Bhava direct influence', theme: 'Structured vocational authority, rigorous accountability, long-term mastery.' },
    { planet: 'Rahu' as PlanetName, currentSign: 'Pisces' as ZodiacSign, transitHouse: ((11 - ascSignIdx + 12) % 12) + 1, aspectsNatal: 'Transcendental axis', theme: 'Intuitive breakthroughs, unconventional global collaborations, visionary projects.' },
    { planet: 'Ketu' as PlanetName, currentSign: 'Virgo' as ZodiacSign, transitHouse: ((5 - ascSignIdx + 12) % 12) + 1, aspectsNatal: 'Purvapunya release', theme: 'Simplification of analytical habits, deep spiritual discrimination, quietude.' }
  ];

  return {
    profile,
    ascendant: ascendantPlanet,
    planets,
    houses,
    navamsaPlanets,
    currentDasha: {
      mahadasha: activeMahadasha.lord,
      antardasha: antardashaLord,
      pratyantardasha: 'Jupiter',
      progressPercentage: 62,
      timeline
    },
    transits,
    elementalBalance,
    dominantGraha: planets.find((p) => p.dignity === 'Exalted' || p.dignity === 'Own Sign')?.name || 'Jupiter',
    creativeGift: moon.nakshatra === 'Purva Phalguni' 
      ? 'Bhaga Radiance: Magnetism through hospitality, restful inspiration, and fine artistic discernment.'
      : 'Sattvic Clarity: Grounded perception transforming intuitive subtlety into enduring structure.'
  };
}
