export enum EventSource {
  USER = 'user',
  AGENT = 'agent',
}

export enum EntityType {
  LEAD = 'Lead',
  OPPORTUNITY = 'Opportunity',
  ACTIVITY = 'Activity',
}

export const CRM_EVENTS = {
  LEAD_CREATED: 'lead.created',
  LEAD_UPDATED: 'lead.updated',
  LEAD_DELETED: 'lead.deleted',
  OPPORTUNITY_CREATED: 'opportunity.created',
  OPPORTUNITY_UPDATED: 'opportunity.updated',
  OPPORTUNITY_STAGE_CHANGED: 'opportunity.stage.changed',
  OPPORTUNITY_DELETED: 'opportunity.deleted',
  ACTIVITY_CREATED: 'activity.created',
  ACTIVITY_DELETED: 'activity.deleted',
} as const;
