
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HistoryService } from '../services/history.service';
import { HistoryItem } from '../interfaces/seo-audit.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe]
})
export class HistoryComponent {
  historyService = inject(HistoryService);
  history = this.historyService.history;

  selectedItem = signal<HistoryItem | null>(null);
  openAccordions = signal<Set<string>>(new Set());

  selectItem(item: HistoryItem): void {
    if (this.selectedItem()?.id === item.id) {
        this.selectedItem.set(null); // Toggle off if already selected
    } else {
        this.selectedItem.set(item);
    }
    this.openAccordions.set(new Set()); // Reset accordions on new selection
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to delete all audit history? This action cannot be undone.')) {
        this.historyService.clearHistory();
        this.selectedItem.set(null);
    }
  }

  toggleAccordion(id: string): void {
    this.openAccordions.update(currentSet => {
        const newSet = new Set(currentSet);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
  }
}
