/**
 * Prototype Knowledge & Study Materials Service Placeholder
 *
 * Status: NOT CONNECTED TO LIVE CLOUD STORAGE.
 * Manages study notes, documents, and reference manuals in memory.
 */

import { KnowledgeNote, KnowledgeDocument } from '../../types/practice';
import { PracticeStore } from '../store';

export const studyMaterialService = {
  status: 'Prototype study materials store — in-memory only',

  async getNotes(): Promise<KnowledgeNote[]> {
    return PracticeStore.getKnowledgeNotes();
  },

  async getDocuments(): Promise<KnowledgeDocument[]> {
    return PracticeStore.getDocuments();
  },

  async saveNote(note: KnowledgeNote): Promise<KnowledgeNote> {
    const all = PracticeStore.getKnowledgeNotes();
    const existingIndex = all.findIndex((n) => n.id === note.id);
    let updated: KnowledgeNote[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = note;
    } else {
      updated = [note, ...all];
    }
    PracticeStore.saveKnowledgeNotes(updated);
    return note;
  }
};
