import { Migration } from '@mikro-orm/migrations';

export class Migration20250804031045 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop table if exists "vendor_location" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table if not exists "vendor_location" ("id" text not null, "stock_location_id" text not null, "name" text not null, "address" jsonb null, "is_default" boolean not null default false, "business_hours" jsonb null, "special_hours" jsonb null, "vendor_id" text not null, "extra_details" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vendor_location_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_location_vendor_id" ON "vendor_location" (vendor_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_location_deleted_at" ON "vendor_location" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "vendor_location" add constraint "vendor_location_vendor_id_foreign" foreign key ("vendor_id") references "vendor" ("id") on update cascade;`);
  }

}
