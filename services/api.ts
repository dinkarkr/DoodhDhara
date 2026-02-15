
import { MilkEntry } from '../types';

// In a real environment, this would be your Spring Boot server URL
const API_BASE = '/api/milk';

export const api = {
  async fetchEntries(): Promise<MilkEntry[]> {
    try {
      const response = await fetch(`${API_BASE}/entries`);
      if (!response.ok) throw new Error('Backend unavailable');
      return await response.json();
    } catch (e) {
      console.warn('Backend not detected, falling back to local storage');
      return JSON.parse(localStorage.getItem('dd_entries') || '[]');
    }
  },

  async saveEntry(entry: MilkEntry): Promise<MilkEntry> {
    try {
      const response = await fetch(`${API_BASE}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      return await response.json();
    } catch (e) {
      const entries = JSON.parse(localStorage.getItem('dd_entries') || '[]');
      const updated = [entry, ...entries];
      localStorage.setItem('dd_entries', JSON.stringify(updated));
      return entry;
    }
  },

  async deleteEntry(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/entries/${id}`, { method: 'DELETE' });
    } catch (e) {
      const entries = JSON.parse(localStorage.getItem('dd_entries') || '[]');
      localStorage.setItem('dd_entries', JSON.stringify(entries.filter((e: any) => e.id !== id)));
    }
  }
};
