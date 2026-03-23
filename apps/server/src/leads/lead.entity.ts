import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { LeadStatus } from './lead-status.enum';
import { Opportunity } from '../opportunities/opportunity.entity';
import { ActivityLog } from '../activities/activity-log.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string | null;

  @Column({ length: 255, nullable: true })
  company: string | null;

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.LEAD })
  status: LeadStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Opportunity, (opp) => opp.lead)
  opportunities: Opportunity[];

  @OneToMany(() => ActivityLog, (activity) => activity.lead)
  activities: ActivityLog[];
}
