import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000001 implements MigrationInterface {
  name = 'InitialSchema1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enums
    await queryRunner.query(
      `CREATE TYPE "lead_status_enum" AS ENUM ('Lead', 'Prospect', 'Customer')`,
    );
    await queryRunner.query(
      `CREATE TYPE "opportunity_stage_enum" AS ENUM ('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost')`,
    );
    await queryRunner.query(
      `CREATE TYPE "activity_type_enum" AS ENUM ('Call', 'Email', 'Meeting', 'Note')`,
    );
    await queryRunner.query(
      `CREATE TYPE "agent_message_role_enum" AS ENUM ('user', 'assistant', 'tool')`,
    );
    await queryRunner.query(
      `CREATE TYPE "event_source_enum" AS ENUM ('user', 'agent')`,
    );

    // 1. leads table
    await queryRunner.query(`
      CREATE TABLE "leads" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "phone" character varying(50),
        "company" character varying(255),
        "status" "lead_status_enum" NOT NULL DEFAULT 'Lead',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_leads" PRIMARY KEY ("id")
      )
    `);

    // 2. opportunities table
    await queryRunner.query(`
      CREATE TABLE "opportunities" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying(255) NOT NULL,
        "value" numeric(12,2) NOT NULL,
        "stage" "opportunity_stage_enum" NOT NULL DEFAULT 'New',
        "leadId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_opportunities" PRIMARY KEY ("id"),
        CONSTRAINT "FK_opportunities_lead" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_opportunities_leadId" ON "opportunities" ("leadId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_opportunities_stage" ON "opportunities" ("stage")`,
    );

    // 3. activity_log table
    await queryRunner.query(`
      CREATE TABLE "activity_log" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "type" "activity_type_enum" NOT NULL,
        "description" text NOT NULL,
        "date" TIMESTAMP NOT NULL,
        "leadId" uuid,
        "opportunityId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_activity_log" PRIMARY KEY ("id"),
        CONSTRAINT "FK_activity_log_lead" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_activity_log_opportunity" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_activity_log_leadId" ON "activity_log" ("leadId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_activity_log_opportunityId" ON "activity_log" ("opportunityId")`,
    );

    // 4. agent_conversations table
    await queryRunner.query(`
      CREATE TABLE "agent_conversations" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying(255),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_agent_conversations" PRIMARY KEY ("id")
      )
    `);

    // 5. agent_messages table
    await queryRunner.query(`
      CREATE TABLE "agent_messages" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "conversationId" uuid NOT NULL,
        "role" "agent_message_role_enum" NOT NULL,
        "content" text,
        "toolCalls" jsonb,
        "toolResults" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_agent_messages" PRIMARY KEY ("id"),
        CONSTRAINT "FK_agent_messages_conversation" FOREIGN KEY ("conversationId") REFERENCES "agent_conversations"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_agent_messages_conversationId" ON "agent_messages" ("conversationId")`,
    );

    // 6. event_log table
    await queryRunner.query(`
      CREATE TABLE "event_log" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "eventType" character varying(100) NOT NULL,
        "payload" jsonb NOT NULL,
        "source" "event_source_enum" NOT NULL,
        "entityType" character varying(50),
        "entityId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_event_log" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_event_log_eventType" ON "event_log" ("eventType")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_event_log_createdAt" ON "event_log" ("createdAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "event_log"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "agent_messages"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "agent_conversations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "activity_log"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "opportunities"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "leads"`);

    await queryRunner.query(`DROP TYPE IF EXISTS "event_source_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "agent_message_role_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "activity_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "opportunity_stage_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "lead_status_enum"`);
  }
}
