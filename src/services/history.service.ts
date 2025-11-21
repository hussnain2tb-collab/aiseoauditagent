
import { Injectable, signal } from '@angular/core';
import { HistoryItem, AuditResult, AuditType } from '../interfaces/seo-audit.interface';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly HISTORY_KEY = 'seo-audit-history';
  history = signal<HistoryItem[]>(this.getHistoryFromStorage());

  constructor() {
    // Listen to storage events to sync across tabs
    window.addEventListener('storage', (event) => {
      if (event.key === this.HISTORY_KEY) {
        this.history.set(this.getHistoryFromStorage());
      }
    });
  }

  private getHistoryFromStorage(): HistoryItem[] {
    try {
      const storedHistory = localStorage.getItem(this.HISTORY_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (e) {
      console.error('Error reading history from localStorage', e);
      return [];
    }
  }

  saveAudit(auditData: {
    url: string;
    auditType: AuditType;
    goal?: string;
    result: AuditResult;
  }): void {
    const newHistoryItem: HistoryItem = {
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString(),
      ...auditData,
    };

    this.history.update(currentHistory => {
        const updatedHistory = [newHistoryItem, ...currentHistory];
        try {
            localStorage.setItem(this.HISTORY_KEY, JSON.stringify(updatedHistory));
        } catch (e) {
            console.error('Error saving history to localStorage', e);
        }
        return updatedHistory;
    });
  }

  clearHistory(): void {
    try {
      localStorage.removeItem(this.HISTORY_KEY);
      this.history.set([]);
    } catch (e) {
      console.error('Error clearing history from localStorage', e);
    }
  }
}
