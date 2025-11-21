
export interface AuditItem {
  title: string;
  issue: string;
  fix: string;
  outcome: string;
  validation: string;
}

export interface AuditResult {
  criticalIssues: AuditItem[];
  importantOptimizations: AuditItem[];
  recommendedEnhancements: AuditItem[];
}

export type AuditType = 'Technical SEO' | 'AdSense Approval';

export interface HistoryItem {
  id: string;
  url: string;
  auditType: AuditType;
  goal?: string;
  date: string;
  result: AuditResult;
}