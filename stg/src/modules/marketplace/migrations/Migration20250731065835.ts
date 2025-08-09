import { Migration } from '@mikro-orm/migrations';

export class Migration20250731065835 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "product_vendor" add constraint "product_vendor_vendor_id_foreign" foreign key ("vendor_id") references "vendor" ("id") on update cascade;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_vendor_vendor_id" ON "product_vendor" (vendor_id) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "product_vendor" drop constraint if exists "product_vendor_vendor_id_foreign";`);

    this.addSql(`drop index if exists "IDX_product_vendor_vendor_id";`);
  }

}
