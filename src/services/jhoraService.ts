/**
 * Compatibility adapter for the chart calculation provider.
 * 
 * Note: The previous "JHoraService" label was a local prototype calculation.
 * It is now backed by LocalVedicChartEngine / AstrologyCalculationProvider.
 * External JHora server API is not connected.
 */

import { UserProfile, UserRole } from '../types/practice';
import {
  AstrologyCalculationProvider,
  ChartCalculationResponse,
  ConstitutionalAnalysis
} from './astrologyCalculationProvider';

export type JHoraServiceResponse = ChartCalculationResponse;
export type { ConstitutionalAnalysis };

export class JHoraService {
  /**
   * Calls the Local Vedic Chart Engine prototype.
   * Clearly marked as local prototype calculation; external JHora API is not connected.
   */
  static calculateClientChart(
    targetClient: UserProfile,
    requestingUser: { id: string; name: string; role: UserRole }
  ): ChartCalculationResponse {
    return AstrologyCalculationProvider.calculateClientChart(targetClient, requestingUser);
  }
}
