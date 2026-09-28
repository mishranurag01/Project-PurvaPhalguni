import { UserProfile, UserRole } from '../types/practice';
import { calculateVedicChart } from '../utils/vedicCalculations';
import { ChartCalculationResult } from '../types/astrology';
import { PracticeStore } from './store';

export interface ConstitutionalAnalysis {
  doshaDistribution: {
    pitta: number; // Fiery / metabolic (Sun, Mars, Ketu, Fire signs)
    vata: number;  // Airy / nervous system (Saturn, Rahu, Mercury, Air signs)
    kapha: number; // Watery / structural (Moon, Venus, Jupiter, Water/Earth signs)
  };
  dominantTemperament:
    | 'Choleric (Pitta)'
    | 'Melancholic/Nervous (Vata)'
    | 'Phlegmatic (Kapha)'
    | 'Dual Pitta-Vata'
    | 'Dual Vata-Kapha'
    | 'Tridoshic Balanced';
  sixthHouseTheme: string;
  eighthHouseTheme: string;
  vitalityPreservationNote: string;
  reflectiveKeywords: string[];
}

export interface ChartCalculationResponse {
  success: boolean;
  error?: string;
  provider: string;
  isExternalProviderConnected: boolean;
  providerNotice: string;
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

/**
 * Common Provider Interface
 * Allows swapping in a real external JHora API or microservice backend in the future
 * without rewriting portal components.
 */
export interface ChartCalculationProvider {
  readonly name: string;
  readonly providerType: 'local_prototype' | 'external_jhora_api';
  readonly isExternalConnected: boolean;
  calculateClientChart(
    targetClient: UserProfile,
    requestingUser: { id: string; name: string; role: UserRole }
  ): ChartCalculationResponse;
}

/**
 * Local Vedic Chart Engine (Prototype)
 * Performs local sidereal planetary calculations in-browser.
 * Clearly marked as a demonstration engine; no external server-side JHora API is connected.
 */
export class LocalVedicChartEngine implements ChartCalculationProvider {
  readonly name = 'Local Vedic Astronomical Engine (Prototype)';
  readonly providerType = 'local_prototype' as const;
  readonly isExternalConnected = false;
  readonly statusNotice = 'Demo chart engine — external provider not connected';

  calculateClientChart(
    targetClient: UserProfile,
    requestingUser: { id: string; name: string; role: UserRole }
  ): ChartCalculationResponse {
    // 1. Role-based access check
    if (requestingUser.role === 'client' && requestingUser.id !== targetClient.id) {
      PracticeStore.logAction(
        requestingUser.id,
        requestingUser.name,
        requestingUser.role,
        'VIEW_CLIENT_PROFILE',
        `Unauthorized chart calculation attempt for ${targetClient.name}`,
        true
      );
      return {
        success: false,
        error: 'Access Denied: You may only calculate charts for your own profile.',
        provider: this.name,
        isExternalProviderConnected: false,
        providerNotice: this.statusNotice
      };
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
        `Access denied: Affiliate ${requestingUser.name} attempted calculation for unassigned client ${targetClient.name}.`,
        true
      );
      return {
        success: false,
        error: 'Access Denied: You are not the assigned practitioner for this client.',
        provider: this.name,
        isExternalProviderConnected: false,
        providerNotice: this.statusNotice
      };
    }

    // 2. Consent verification
    if (!targetClient.consentGiven || targetClient.consentWithdrawn) {
      return {
        success: false,
        error: 'Consent Required: Client has not authorized chart calculation, or consent was withdrawn.',
        provider: this.name,
        isExternalProviderConnected: false,
        providerNotice: this.statusNotice
      };
    }

    // 3. Birth details validation
    if (!targetClient.birthDate || !targetClient.birthTime || !targetClient.birthCity) {
      return {
        success: false,
        error: 'Incomplete Birth Records: Date, time, and coordinates are required.',
        provider: this.name,
        isExternalProviderConnected: false,
        providerNotice: this.statusNotice
      };
    }

    // 4. Calculate Parashari chart via local mathematical algorithms
    const lat = targetClient.latitude ?? 37.7749;
    const lng = targetClient.longitude ?? -122.4194;

    const chartResult = calculateVedicChart(
      targetClient.birthDate,
      targetClient.birthTime,
      lat,
      lng
    );

    // 5. Derive symbolic constitutional temperaments (Non-diagnostic spiritual reflection)
    const constitutional = this.deriveConstitutionalArchetypes(chartResult);

    // 6. Log activity
    PracticeStore.logAction(
      requestingUser.id,
      requestingUser.name,
      requestingUser.role,
      'GENERATE_JHORA_CHART',
      `Calculated local sidereal chart for ${targetClient.name} (${targetClient.id}) via local prototype engine.`,
      true
    );

    return {
      success: true,
      provider: this.name,
      isExternalProviderConnected: false,
      providerNotice: this.statusNotice,
      chart: chartResult,
      constitutional,
      clientRef: {
        id: targetClient.id,
        name: targetClient.name,
        birthCity: targetClient.birthCity,
        birthDate: targetClient.birthDate,
        birthTime: targetClient.birthTime,
        consentVerified: true
      },
      accessLogId: `calc-${Date.now().toString(36)}`
    };
  }

  private deriveConstitutionalArchetypes(chart: ChartCalculationResult): ConstitutionalAnalysis {
    let pittaScore = 2;
    let vataScore = 2;
    let kaphaScore = 2;

    chart.planets.forEach((p) => {
      if (['Sun', 'Mars'].includes(p.name)) pittaScore += 3;
      if (['Saturn', 'Mercury'].includes(p.name)) vataScore += 3;
      if (['Moon', 'Venus', 'Jupiter'].includes(p.name)) kaphaScore += 3;

      if (['Aries', 'Leo', 'Sagittarius'].includes(p.sign)) pittaScore += 1.5;
      if (['Gemini', 'Libra', 'Aquarius'].includes(p.sign)) vataScore += 1.5;
      if (['Cancer', 'Scorpio', 'Pisces', 'Taurus', 'Virgo', 'Capricorn'].includes(p.sign)) kaphaScore += 1;
    });

    const total = pittaScore + vataScore + kaphaScore;
    const pitta = Math.round((pittaScore / total) * 100);
    const vata = Math.round((vataScore / total) * 100);
    const kapha = 100 - (pitta + vata);

    let dominant: ConstitutionalAnalysis['dominantTemperament'] = 'Tridoshic Balanced';
    if (pitta >= 42 && vata >= 32) dominant = 'Dual Pitta-Vata';
    else if (vata >= 42 && kapha >= 32) dominant = 'Dual Vata-Kapha';
    else if (pitta > vata && pitta > kapha) dominant = 'Choleric (Pitta)';
    else if (vata > pitta && vata > kapha) dominant = 'Melancholic/Nervous (Vata)';
    else if (kapha > pitta && kapha > vata) dominant = 'Phlegmatic (Kapha)';

    return {
      doshaDistribution: { pitta, vata, kapha },
      dominantTemperament: dominant,
      sixthHouseTheme: 'Rhythmic daily pacing and digestion of intellectual and creative stimuli.',
      eighthHouseTheme: 'Deep somatic renewal, restorative pauses, and releasing emotional holdings.',
      vitalityPreservationNote:
        dominant.includes('Pitta')
          ? 'Notice midday energy peaks; balance high intensity with cooling pauses, breath awareness, and evening unwinding.'
          : dominant.includes('Vata')
          ? 'Support nervous system tranquility with regular sleep hours, warm nourishing soups, and reduced screen exposure.'
          : 'Support physical morning circulation through mindful morning light, brisk walking, and purposeful movement.',
      reflectiveKeywords: [
        'Vitality Chronobiology',
        'Somatic Equilibrium',
        'Transits & Pacing',
        'Non-Diagnostic Symbolism'
      ]
    };
  }
}

// Default export instance of the calculation provider
export const AstrologyCalculationProvider: ChartCalculationProvider = new LocalVedicChartEngine();
