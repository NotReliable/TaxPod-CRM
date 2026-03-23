export type LeadStatus = 'Lead' | 'Prospect' | 'Customer';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  opportunities?: Opportunity[];
  activities?: ActivityLog[];
}

export type OpportunityStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export interface Opportunity {
  id: string;
  title: string;
  value: number;
  stage: OpportunityStage;
  leadId: string;
  lead?: Lead;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'Note';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  description: string;
  date: string;
  leadId: string | null;
  opportunityId: string | null;
  lead?: Lead | null;
  opportunity?: Opportunity | null;
  createdAt: string;
}

export interface EventLogEntry {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
  source: 'user' | 'agent';
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalContacts: number;
  openOpportunities: number;
  totalOpportunitiesValue: number;
  recentActivity: EventLogEntry[];
}
