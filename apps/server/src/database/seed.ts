import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../../../../.env') });
import { DataSource } from 'typeorm';
import { Lead } from '../leads/lead.entity';
import { Opportunity } from '../opportunities/opportunity.entity';
import { ActivityLog } from '../activities/activity-log.entity';
import { LeadStatus } from '../leads/lead-status.enum';
import { OpportunityStage } from '../opportunities/opportunity-stage.enum';
import { ActivityType } from '../activities/activity-type.enum';
import { EventLog } from '../events/event-log.entity';
import { AgentConversation } from '../agent/entities/agent-conversation.entity';
import { AgentMessage } from '../agent/entities/agent-message.entity';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Lead, Opportunity, ActivityLog, EventLog, AgentConversation, AgentMessage],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const leadRepo = dataSource.getRepository(Lead);
  const existingCount = await leadRepo.count();
  if (existingCount > 0) {
    console.log('Database already seeded. Skipping.');
    await dataSource.destroy();
    return;
  }

  // Create 10 sample leads
  const leads = await leadRepo.save([
    { name: 'Ahmad bin Ismail', email: 'ahmad@acmecorp.my', phone: '+60123456789', company: 'Acme Corp Sdn Bhd', status: LeadStatus.CUSTOMER },
    { name: 'Siti Nurhaliza', email: 'siti@globaltech.my', phone: '+60198765432', company: 'GlobalTech Solutions', status: LeadStatus.PROSPECT },
    { name: 'Raj Kumar', email: 'raj@techstart.my', phone: '+60112345678', company: 'TechStart Ventures', status: LeadStatus.LEAD },
    { name: 'Mei Ling Tan', email: 'meiling@finserv.my', phone: '+60145678901', company: 'FinServ Advisory', status: LeadStatus.CUSTOMER },
    { name: 'David Wong', email: 'david@buildpro.my', phone: '+60167890123', company: 'BuildPro Engineering', status: LeadStatus.PROSPECT },
    { name: 'Nurul Aina', email: 'nurul@mediahub.my', phone: '+60134567890', company: 'MediaHub Creative', status: LeadStatus.LEAD },
    { name: 'James Ong', email: 'james@logismart.my', phone: '+60178901234', company: 'LogiSmart Sdn Bhd', status: LeadStatus.PROSPECT },
    { name: 'Priya Devi', email: 'priya@healthplus.my', phone: '+60156789012', company: 'HealthPlus Clinics', status: LeadStatus.LEAD },
    { name: 'Muhammad Ali', email: 'mali@propertyking.my', phone: '+60189012345', company: 'PropertyKing Realty', status: LeadStatus.CUSTOMER },
    { name: 'Chen Wei', email: 'chenwei@smartedu.my', phone: '+60121234567', company: 'SmartEdu Platform', status: LeadStatus.PROSPECT },
  ]);

  // Create opportunities for some leads
  const oppRepo = dataSource.getRepository(Opportunity);
  await oppRepo.save([
    { title: 'Acme Corp Annual Tax Filing', value: 25000, stage: OpportunityStage.WON, leadId: leads[0].id },
    { title: 'GlobalTech SST Compliance', value: 15000, stage: OpportunityStage.PROPOSAL, leadId: leads[1].id },
    { title: 'TechStart E-Invoicing Setup', value: 8000, stage: OpportunityStage.NEW, leadId: leads[2].id },
    { title: 'FinServ Tax Advisory Package', value: 50000, stage: OpportunityStage.QUALIFIED, leadId: leads[3].id },
    { title: 'BuildPro Construction Tax Audit', value: 35000, stage: OpportunityStage.CONTACTED, leadId: leads[4].id },
    { title: 'LogiSmart Import Duty Review', value: 12000, stage: OpportunityStage.PROPOSAL, leadId: leads[6].id },
    { title: 'PropertyKing Stamp Duty Consult', value: 20000, stage: OpportunityStage.WON, leadId: leads[8].id },
    { title: 'SmartEdu Tax Exemption Filing', value: 10000, stage: OpportunityStage.NEW, leadId: leads[9].id },
  ]);

  // Create sample activities
  const actRepo = dataSource.getRepository(ActivityLog);
  const now = new Date();
  await actRepo.save([
    { type: ActivityType.CALL, description: 'Initial discovery call with Ahmad regarding tax filing needs', date: new Date(now.getTime() - 7 * 86400000), leadId: leads[0].id },
    { type: ActivityType.EMAIL, description: 'Sent SST compliance proposal to Siti', date: new Date(now.getTime() - 5 * 86400000), leadId: leads[1].id },
    { type: ActivityType.MEETING, description: 'On-site meeting with FinServ team to discuss tax advisory scope', date: new Date(now.getTime() - 3 * 86400000), leadId: leads[3].id },
    { type: ActivityType.NOTE, description: 'Raj mentioned interest in e-invoicing — follow up next week', date: new Date(now.getTime() - 2 * 86400000), leadId: leads[2].id },
    { type: ActivityType.CALL, description: 'Follow-up call with David on construction tax audit timeline', date: new Date(now.getTime() - 1 * 86400000), leadId: leads[4].id },
    { type: ActivityType.EMAIL, description: 'Sent updated proposal with revised pricing to GlobalTech', date: new Date(now.getTime() - 4 * 86400000), leadId: leads[1].id },
  ]);

  console.log('Seed complete: 10 leads, 8 opportunities, 6 activities');
  await dataSource.destroy();
}

seed().catch(console.error);
