import { Migration } from '@mikro-orm/migrations';

export class Migration20250820030204 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "typeform_submission" drop constraint if exists "typeform_submission_token_unique";`);
    this.addSql(`create table if not exists "typeform_submission" ("id" text not null, "token" text not null, "form_data" jsonb not null, "expires_at" timestamptz not null, "used" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "typeform_submission_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_typeform_submission_token_unique" ON "typeform_submission" (token) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_typeform_submission_deleted_at" ON "typeform_submission" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "typeform_submission" cascade;`);
  }

}
