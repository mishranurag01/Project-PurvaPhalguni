/**
 * Prototype Chart Generation Service & Backend Contract Placeholder
 *
 * Status: NOT CONNECTED TO EXTERNAL JHORA API.
 * Uses local mathematical calculations in memory.
 * Defines the future backend API contract: POST /api/charts/generate.
 */

import { UserProfile, UserRole } from '../../types/practice';
import { ChartCalculationResult } from '../../types/astrology';
import { AstrologyCalculationProvider, ChartCalculationResponse, ConstitutionalAnalysis } from '../astrologyCalculationProvider';

/**
 * Backend API Contract for POST /api/charts/generate
 */
export interface GenerateChartRequest {
  clientId: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  latitude: number;
  longitude: number;
  timezone?: string;
  ayanamsa?: 'Lahiri' | 'Raman' | 'Krishnamurti';
}

export interface GenerateChartResponse {
  success: boolean;
  error?: string;
  engine: string;
  isExternalApiConnected: boolean;
  statusNotice: string;
  chart?: ChartCalculationResult;
  constitutional?: ConstitutionalAnalysis;
}

export const chartService = {
  status: 'Demo chart engine — external provider not connected',

  /**
   * Prototype execution of the POST /api/charts/generate contract
   */
  async generateChart(
    targetClient: UserProfile,
    requestingUser: { id: string; name: string; role: UserRole }
  ): Promise<ChartCalculationResponse> {
    return AstrologyCalculationProvider.calculateClientChart(targetClient, requestingUser);
  }
};
