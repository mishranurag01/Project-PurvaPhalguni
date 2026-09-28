/**
 * Prototype Research Workspace Service Placeholder
 *
 * Status: NOT CONNECTED TO CLINICAL TRIAL DATABASE OR REGISTRY.
 * Admin-only research workspace for symbolic astrological exploratory inquiry.
 * Label: Research use only. This workspace does not provide medical diagnosis, treatment recommendations, or clinical decision support.
 */

import { ResearchStudy, ResearchParticipant } from '../../types/practice';
import { PracticeStore } from '../store';

export const researchService = {
  status: 'Prototype research store — in-memory only',

  async getStudy(): Promise<ResearchStudy> {
    return PracticeStore.getResearchStudy();
  },

  async getParticipants(): Promise<ResearchParticipant[]> {
    return PracticeStore.getResearchParticipants();
  },

  async withdrawParticipant(participantId: string): Promise<void> {
    const participants = PracticeStore.getResearchParticipants();
    const updated = participants.map((p) =>
      p.id === participantId ? { ...p, withdrawn: true, consentActive: false } : p
    );
    PracticeStore.saveResearchParticipants(updated);
  }
};
