import { Migration } from '@mikro-orm/migrations';

export class Migration20250803224150 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "vendor_admin" add column if not exists "password_hash" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "vendor_admin" drop column if exists "password_hash";`);
  }

}
