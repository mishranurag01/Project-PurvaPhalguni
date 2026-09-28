/**
 * Prototype Notes & Reading Summaries Service Placeholder
 *
 * Status: NOT CONNECTED TO LIVE BACKEND.
 * Manages practitioner private notes and client reading summaries in memory.
 */

import { PractitionerNote, ReadingSummary } from '../../types/practice';
import { PracticeStore } from '../store';

export const notesService = {
  status: 'Prototype notes store — in-memory only',

  async getPractitionerNotes(clientId: string): Promise<PractitionerNote[]> {
    return PracticeStore.getNotes().filter((n) => n.clientId === clientId);
  },

  async addPractitionerNote(note: PractitionerNote): Promise<PractitionerNote> {
    const all = PracticeStore.getNotes();
    PracticeStore.saveNotes([note, ...all]);
    return note;
  },

  async getReadingSummaries(clientId: string, onlyShared = false): Promise<ReadingSummary[]> {
    const all = PracticeStore.getSummaries();
    return all.filter((s) => s.clientId === clientId && (!onlyShared || s.isSharedWithClient));
  },

  async saveReadingSummary(summary: ReadingSummary): Promise<ReadingSummary> {
    const all = PracticeStore.getSummaries();
    const existingIndex = all.findIndex((s) => s.id === summary.id);
    let updated: ReadingSummary[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = summary;
    } else {
      updated = [summary, ...all];
    }
    PracticeStore.saveSummaries(updated);
    return summary;
  }
};
