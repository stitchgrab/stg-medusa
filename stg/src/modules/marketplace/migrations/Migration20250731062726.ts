import { Migration } from '@mikro-orm/migrations';

export class Migration20250731062726 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_vendor" ("id" text not null, "vendor_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_vendor_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_vendor_deleted_at" ON "product_vendor" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_vendor" cascade;`);
  }

}
