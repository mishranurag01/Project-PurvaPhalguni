import { UserProfile, UserRole } from '../types/practice';
import { calculateVedicChart } from '../utils/vedicCalculations';
import { ChartCalculationResult, PlanetPosition } from '../types/astrology';
import { PracticeStore } from './store';

export interface ConstitutionalAnalysis {
  doshaDistribution: {
    pitta: number; // Fiery / metabolic (Sun, Mars, Ketu, Fire signs)
    vata: number;  // Airy / nervous system (Saturn, Rahu, Mercury, Air signs)
    kapha: number; // Watery / structural (Moon, Venus, Jupiter, Water/Earth signs)
  };
  dominantTemperament: 'Choleric (Pitta)' | 'Melancholic/Nervous (Vata)' | 'Phlegmatic (Kapha)' | 'Dual Pitta-Vata' | 'Dual Vata-Kapha' | 'Tridoshic Balanced';
  sixthHouseTheme: string;
  eighthHouseTheme: string;
  vitalityPreservationNote: string;
  reflectiveKeywords: string[];
}

export interface JHoraServiceResponse {
  success: boolean;
  error?: string;
  chart?: ChartCalculationResult;
  constitutional?: ConstitutionalAnalysis;
  clientRef?: {
    id: string;
    name: string;
    birthCity: string;
    birthDate: string;
    birthTime: string;
    consentVerified: boolean;
  };
  accessLogId?: string;
}

export class JHoraService {
  /**
   * Secure calculation invocation with RBAC and Consent Verification
   */
  static calculateClientChart(
    targetClient: UserProfile,
    requestingUser: { id: string; name: string; role: UserRole }
  ): JHoraServiceResponse {
    // 1. RBAC check
    if (requestingUser.role === 'client' && requestingUser.id !== targetClient.id) {
      PracticeStore.logAction(
        requestingUser.id,
        requestingUser.name,
        requestingUser.role,
        'VIEW_CLIENT_PROFILE',
        `Unauthorized chart calculation attempt for ${targetClient.name}`,
        true
      );
      return { success: false, error: 'Access Denied: You may only calculate charts for your own profile.' };
    }

    if (
      requestingUser.role === 'affiliate' &&
      targetClient.assignedAffiliateId !== requestingUser.id
    ) {
      PracticeStore.logAction(
        requestingUser.id,
        requestingUser.name,
        requestingUser.role,
        'VIEW_CLIENT_PROFILE',
        `Access blocked: Client ${targetClient.name} is not assigned to Affiliate ${requestingUser.name}`,
        true
      );
      return { success: false, error: 'Access Denied: This client is not assigned to your practitioner roster.' };
    }

    // 2. Consent check
    if (!targetClient.consentGiven || targetClient.consentWithdrawn) {
      return {
        success: false,
        error: 'Consent Error: Client has not authorized chart generation, or consent has been withdrawn under privacy regulations.'
      };
    }

    // 3. Birth details validation
    if (!targetClient.birthDate || !targetClient.birthTime) {
      return {
        success: false,
        error: 'Incomplete Coordinates: Exact birth date and minute are required for Sidereal Lahiri calculation.'
      };
    }

    // 4. Calculate Parashari chart via local secure engine
    const profile = {
      id: targetClient.id,
      name: targetClient.name,
      title: 'Client Intake',
      birthDate: targetClient.birthDate,
      birthTime: targetClient.birthTime,
      birthPlace: targetClient.birthCity || 'San Francisco, CA',
      latitude: targetClient.latitude || 37.7749,
      longitude: targetClient.longitude || -122.4194,
      timezone: targetClient.timezone || 'Auto',
      summaryQuote: targetClient.primaryIntention || 'Reflective constitutional inquiry.'
    };

    const chart = calculateVedicChart(profile);

    // 5. Evaluate Constitutional Temperament (Iatromathematical Humors)
    const constitutional = this.evaluateConstitution(chart.planets, chart.ascendant);

    // 6. Security Audit Log
    PracticeStore.logAction(
      requestingUser.id,
      requestingUser.name,
      requestingUser.role,
      'GENERATE_JHORA_CHART',
      `Generated JHora Sidereal chart for client ${targetClient.name} (${targetClient.id}).`,
      true
    );

    return {
      success: true,
      chart,
      constitutional,
      clientRef: {
        id: targetClient.id,
        name: targetClient.name,
        birthCity: targetClient.birthCity || 'Unknown',
        birthDate: targetClient.birthDate,
        birthTime: targetClient.birthTime,
        consentVerified: true
      }
    };
  }

  private static evaluateConstitution(
    planets: PlanetPosition[],
    ascendant: PlanetPosition
  ): ConstitutionalAnalysis {
    let pittaScore = 0;
    let vataScore = 0;
    let kaphaScore = 0;

    // Weight Lagna sign
    if (['Aries', 'Leo', 'Sagittarius'].includes(ascendant.sign)) pittaScore += 3;
    if (['Gemini', 'Libra', 'Aquarius'].includes(ascendant.sign)) vataScore += 3;
    if (['Taurus', 'Virgo', 'Capricorn'].includes(ascendant.sign)) kaphaScore += 2;
    if (['Cancer', 'Scorpio', 'Pisces'].includes(ascendant.sign)) kaphaScore += 3;

    // Weight Planets
    planets.forEach((p) => {
      if (['Sun', 'Mars', 'Ketu'].includes(p.name)) pittaScore += 2;
      if (['Saturn', 'Rahu', 'Mercury'].includes(p.name)) vataScore += 2;
      if (['Moon', 'Venus', 'Jupiter'].includes(p.name)) kaphaScore += 2;

      // Add elemental sign modifier
      if (['Aries', 'Leo', 'Sagittarius'].includes(p.sign)) pittaScore += 1;
      if (['Gemini', 'Libra', 'Aquarius'].includes(p.sign)) vataScore += 1;
      if (['Taurus', 'Virgo', 'Capricorn', 'Cancer', 'Scorpio', 'Pisces'].includes(p.sign)) kaphaScore += 1;
    });

    const total = pittaScore + vataScore + kaphaScore || 1;
    const pitta = Math.round((pittaScore / total) * 100);
    const vata = Math.round((vataScore / total) * 100);
    const kapha = Math.round((kaphaScore / total) * 100);

    let dominant: ConstitutionalAnalysis['dominantTemperament'] = 'Tridoshic Balanced';
    if (pitta > 45) dominant = 'Choleric (Pitta)';
    else if (vata > 45) dominant = 'Melancholic/Nervous (Vata)';
    else if (kapha > 45) dominant = 'Phlegmatic (Kapha)';
    else if (pitta > 35 && vata > 35) dominant = 'Dual Pitta-Vata';
    else if (vata > 35 && kapha > 35) dominant = 'Dual Vata-Kapha';

    // 6th house (daily routine / stress adaptation)
    const sixthHouseSign = ['Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo'][(ascendant.signNumber + 4) % 12];
    // 8th house (deep regeneration / cyclical stamina)
    const eighthHouseSign = ['Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra'][(ascendant.signNumber + 6) % 12];

    return {
      doshaDistribution: { pitta, vata, kapha },
      dominantTemperament: dominant,
      sixthHouseTheme: `House 6 in ${sixthHouseSign}: Pacing daily output and metabolic digestion through regular intervals rather than burst exertion.`,
      eighthHouseTheme: `House 8 in ${eighthHouseSign}: Cyclic recovery requirements; deep quiet retreats needed during seasonal solstices and lunar eclipses.`,
      vitalityPreservationNote:
        dominant.includes('Pitta')
          ? 'Requires cooling contemplative practices, avoidance of midday work spikes, and unhurried hydration.'
          : dominant.includes('Vata')
          ? 'Requires rhythmic daily grounding, warm nourishing infusions, digital curfews, and predictable sleep hours.'
          : 'Requires gentle physical morning circulation, stimulating herbs (ginger, cardamom), and invigorating walking.',
      reflectiveKeywords: ['Somatic Rhythm', 'Digestive Ease', 'Nervous Stillness', 'Seasonal Alignment', 'Non-Allopathic Reflection']
    };
  }
}
