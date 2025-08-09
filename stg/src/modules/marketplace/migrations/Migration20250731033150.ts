import { Migration } from '@mikro-orm/migrations';

export class Migration20250731033150 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "vendor" add column if not exists "businessHours" jsonb null, add column if not exists "specialHours" jsonb null, add column if not exists "address" jsonb null, add column if not exists "social_links" jsonb null, add column if not exists "phone" text null;`);

    this.addSql(`alter table if exists "vendor_admin" add column if not exists "phone" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "vendor" drop column if exists "businessHours", drop column if exists "specialHours", drop column if exists "address", drop column if exists "social_links", drop column if exists "phone";`);

    this.addSql(`alter table if exists "vendor_admin" drop column if exists "phone";`);
  }

}
