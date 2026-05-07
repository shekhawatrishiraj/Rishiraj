export interface DateRange {
  start: string;
  end: string;
}

export interface KPITrend {
  value: number;
  target: number;
  trend: number;
  sparkline?: number[];
}

export interface ComplianceBreakdown {
  AHT: number;
  Greeting: number;
  Protocol: number;
  Closing: number;
}

export interface KPIs {
  teamScore: KPITrend;
  callsReviewed: {
    value: number;
    flagged: number;
    compliant: number;
  };
  complianceRate: {
    value: number;
    byCategory: ComplianceBreakdown;
  };
  avgHandleTime: {
    value: string;
    target: string;
    compliant: boolean;
    topAgents: Array<{ name: string; aht: string }>;
  };
}

export type CoachingStatus = 'None' | 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';

export interface Agent {
  id: number;
  name: string;
  score: number;
  callsReviewed: number;
  flagged: number;
  compliance: number;
  aht: string;
  csat: number;
  coachingStatus: CoachingStatus;
  coachingProgress?: string;
  lastReview: string;
  underperformer?: boolean;
}

export type IssueSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type IssueCategory = 'Compliance' | 'AHT' | 'Protocol Breach' | 'CSAT Issue' | 'Knowledge Gap';

export interface FlaggedIssue {
  id: number;
  agentId: number;
  agentName: string;
  timestamp: string;
  callId: number;
  duration: string;
  queue: string;
  categories: IssueCategory[];
  severity: IssueSeverity;
  summary: string;
}

export interface Call {
  id: number;
  agentId: number;
  date: string;
  duration: string;
  team: string;
  outcome: 'Resolved' | 'Escalated' | 'Callback' | 'Incomplete';
  qualityScore: number;
  flagged: boolean;
  transcriptAvailable: boolean;
}

export type CoachingType = 'Call Review' | 'Knowledge Gap' | 'Soft Skills' | 'Compliance';

export interface CoachingAssignment {
  id: number;
  agentId: number;
  agentName: string;
  type: CoachingType;
  topics: string[];
  dueDate: string;
  assignedTo: string;
  materials?: string[];
  status: CoachingStatus;
  createdAt: string;
}

export interface DashboardData {
  team: string;
  dateRange: DateRange;
  kpis: KPIs;
  agents: Agent[];
  flaggedIssues: FlaggedIssue[];
  calls: Call[];
  coachingAssignments: CoachingAssignment[];
}

export interface DashboardFilters {
  team: string;
  dateRange: DateRange;
  complianceStatus?: string[];
  agentTier?: string[];
  callType?: string[];
}

export type DashboardView = 'overview' | 'leaderboard' | 'compliance' | 'coaching' | 'recordings';
