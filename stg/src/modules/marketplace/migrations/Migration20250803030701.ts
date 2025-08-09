import { Migration } from '@mikro-orm/migrations';

export class Migration20250803030701 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "vendor" add column if not exists "stripe_account_id" text null, add column if not exists "stripe_account_status" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "vendor" drop column if exists "stripe_account_id", drop column if exists "stripe_account_status";`);
  }

}
