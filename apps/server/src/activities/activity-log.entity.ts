import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ActivityType } from './activity-type.enum';
import { Lead } from '../leads/lead.entity';
import { Opportunity } from '../opportunities/opportunity.entity';

@Entity('activity_log')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'uuid', nullable: true })
  leadId: string | null;

  @ManyToOne(() => Lead, (lead) => lead.activities, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'leadId' })
  lead: Lead | null;

  @Column({ type: 'uuid', nullable: true })
  opportunityId: string | null;

  @ManyToOne(() => Opportunity, (opp) => opp.activities, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'opportunityId' })
  opportunity: Opportunity | null;

  @CreateDateColumn()
  createdAt: Date;
}
