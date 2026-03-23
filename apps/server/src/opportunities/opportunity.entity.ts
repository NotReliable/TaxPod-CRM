import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { OpportunityStage } from './opportunity-stage.enum';
import { Lead } from '../leads/lead.entity';
import { ActivityLog } from '../activities/activity-log.entity';

@Entity('opportunities')
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  value: number;

  @Column({ type: 'enum', enum: OpportunityStage, default: OpportunityStage.NEW })
  stage: OpportunityStage;

  @Column({ type: 'uuid' })
  leadId: string;

  @ManyToOne(() => Lead, (lead) => lead.opportunities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ActivityLog, (activity) => activity.opportunity)
  activities: ActivityLog[];
}
