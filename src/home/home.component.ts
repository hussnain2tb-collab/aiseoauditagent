import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../services/gemini.service';
import { AuditItem, AuditResult } from '../interfaces/seo-audit.interface';
import { HistoryService } from '../services/history.service';

type AdSenseCategory = 'contentQuality' | 'userExperience' | 'requiredPages' | 'policyCompliance';
type CategoryStatus = 'PASS' | 'REVIEW' | 'FAIL';

// FIX: Changed AdSenseAuditData from an interface to a mapped type.
// This provides a more robust type definition for objects indexed by AdSenseCategory,
// which resolves the TypeScript error by allowing the compiler to correctly infer the type during indexed access.
type AdSenseAuditData = {
  [key in AdSenseCategory]: { status: CategoryStatus; items: AuditItem[] };
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule]
})
export class HomeComponent {
  private geminiService = inject(GeminiService);
  private historyService = inject(HistoryService);

  // App state signals
  url = signal<string>('');
  goal = signal<string>('');
  auditType = signal<'seo' | 'adsense'>('seo');
  currentStep = signal<'url' | 'goal' | 'loading' | 'result' | 'error'>('url');
  auditResult = signal<AuditResult | null>(null);
  error = signal<string | null>(null);
  
  // State for accordions
  openAccordions = signal<Set<string>>(new Set());
  openDashboardSections = signal<Set<AdSenseCategory>>(new Set());

  readonly goals = [
    'Increase organic traffic',
    'Improve conversion rates',
    'Fix technical SEO errors',
    'Prepare for a website migration',
    'Boost local search visibility'
  ];

  // FIX: Refactored the adsenseAuditData computed signal.
  // The original implementation had a logic bug in its sorting algorithm that used reference equality on new objects, causing it to fail silently.
  // This new implementation correctly categorizes items, preserves their severity, sorts them correctly, and then determines the overall category status.
  // This fixes both the compiler error and the runtime logic bug.
  adsenseAuditData = computed<AdSenseAuditData | null>(() => {
    const result = this.auditResult();
    if (!result || this.auditType() !== 'adsense') return null;

    const categorizedItems: { [key in AdSenseCategory]: { item: AuditItem, severity: 'critical' | 'important' | 'recommended' }[] } = {
        contentQuality: [],
        userExperience: [],
        requiredPages: [],
        policyCompliance: [],
    };
    
    const categoryMap: { [key: string]: AdSenseCategory } = {
        '[Content Quality]': 'contentQuality',
        '[User Experience]': 'userExperience',
        '[Required Pages]': 'requiredPages',
        '[Policy Compliance]': 'policyCompliance',
    };

    const processList = (list: AuditItem[], severity: 'critical' | 'important' | 'recommended') => {
        list.forEach(item => {
            const categoryKey = Object.keys(categoryMap).find(key => item.title.startsWith(key));
            if (categoryKey) {
                const category = categoryMap[categoryKey];
                const cleanItem = { ...item, title: item.title.replace(categoryKey, '').trim() };
                categorizedItems[category].push({ item: cleanItem, severity });
            }
        });
    };

    processList(result.criticalIssues, 'critical');
    processList(result.importantOptimizations, 'important');
    processList(result.recommendedEnhancements, 'recommended');

    const data: AdSenseAuditData = {
        contentQuality: { status: 'PASS', items: [] },
        userExperience: { status: 'PASS', items: [] },
        requiredPages: { status: 'PASS', items: [] },
        policyCompliance: { status: 'PASS', items: [] },
    };

    const severityOrder = { 'critical': 2, 'important': 1, 'recommended': 0 };

    for (const cat of Object.keys(data) as AdSenseCategory[]) {
        const itemsWithSeverity = categorizedItems[cat];
        if (itemsWithSeverity.length === 0) continue;

        itemsWithSeverity.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
        data[cat].items = itemsWithSeverity.map(i => i.item);

        if (itemsWithSeverity.some(i => i.severity === 'critical')) {
            data[cat].status = 'FAIL';
        } else if (itemsWithSeverity.some(i => i.severity === 'important')) {
            data[cat].status = 'REVIEW';
        }
    }

    return data;
  });

  readinessScore = computed(() => {
    const data = this.adsenseAuditData();
    if (!data) return 0;
    
    let score = 0;
    const categories = Object.values(data);
    const pointsPerCategory = 100 / categories.length;

    for (const category of categories) {
        if (category.status === 'PASS') {
            score += pointsPerCategory;
        } else if (category.status === 'REVIEW') {
            score += pointsPerCategory / 2;
        }
    }
    return Math.round(score);
  });
  
  readinessStatusText = computed(() => {
    const score = this.readinessScore();
    if (score >= 90) return "Ready to Submit";
    if (score >= 60) return "Needs Improvement";
    return "Significant Work Required";
  });

  scoreColorClass = computed(() => {
    const score = this.readinessScore();
    if (score >= 90) return "text-green-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  });

  isUrlValid(): boolean {
    try {
      const newUrl = new URL(this.url());
      return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  submitUrl(): void {
    if (this.isUrlValid()) {
      this.auditResult.set(null);
      this.error.set(null);
      this.goal.set('');

      if (this.auditType() === 'seo') {
        this.currentStep.set('goal');
      } else {
        this.currentStep.set('loading');
        this.runAudit();
      }
    } else {
      alert('Please enter a valid URL (e.g., https://example.com)');
    }
  }

  selectGoal(selectedGoal: string): void {
    this.goal.set(selectedGoal);
    this.currentStep.set('loading');
    this.runAudit();
  }

  async runAudit(): Promise<void> {
    try {
      const result = this.auditType() === 'adsense'
        ? await this.geminiService.generateAdsenseAudit(this.url())
        : await this.geminiService.generateAudit(this.url(), this.goal());
      
      this.auditResult.set(result);
      this.historyService.saveAudit({
        url: this.url(),
        auditType: this.auditType() === 'seo' ? 'Technical SEO' : 'AdSense Approval',
        goal: this.goal(),
        result: result,
      });
      this.currentStep.set('result');
    } catch (e: any) {
      this.error.set(e.message || 'An unknown error occurred.');
      this.currentStep.set('error');
    }
  }
  
  startNewAudit(): void {
    this.url.set('');
    this.goal.set('');
    this.auditResult.set(null);
    this.error.set(null);
    this.currentStep.set('url');
    this.openAccordions.set(new Set());
    this.openDashboardSections.set(new Set());
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
  
  toggleDashboardSection(section: AdSenseCategory): void {
    this.openDashboardSections.update(currentSet => {
      const newSet = new Set(currentSet);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  }
}
