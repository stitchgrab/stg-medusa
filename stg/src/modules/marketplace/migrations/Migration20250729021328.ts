import { Migration } from '@mikro-orm/migrations';

export class Migration20250729021328 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "vendor_admin" drop constraint if exists "vendor_admin_email_unique";`);
    this.addSql(`alter table if exists "vendor" drop constraint if exists "vendor_handle_unique";`);
    this.addSql(`create table if not exists "vendor" ("id" text not null, "handle" text not null, "name" text not null, "logo" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vendor_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_vendor_handle_unique" ON "vendor" (handle) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_deleted_at" ON "vendor" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "vendor_admin" ("id" text not null, "first_name" text null, "last_name" text null, "email" text not null, "vendor_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vendor_admin_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_vendor_admin_email_unique" ON "vendor_admin" (email) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_admin_vendor_id" ON "vendor_admin" (vendor_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_admin_deleted_at" ON "vendor_admin" (deleted_at) WHERE deleted_at IS NULL;`);

    // Try to add the foreign key constraint, but don't fail if it already exists
    this.addSql(`DO $$ BEGIN ALTER TABLE "vendor_admin" ADD CONSTRAINT "vendor_admin_vendor_id_foreign" FOREIGN KEY ("vendor_id") REFERENCES "vendor" ("id") ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN null; END $$;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "vendor_admin" drop constraint if exists "vendor_admin_vendor_id_foreign";`);

    this.addSql(`drop table if exists "vendor" cascade;`);

    this.addSql(`drop table if exists "vendor_admin" cascade;`);
  }

}
