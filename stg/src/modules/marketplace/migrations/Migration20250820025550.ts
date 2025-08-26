import { Migration } from '@mikro-orm/migrations';

export class Migration20250820025550 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "driver" drop constraint if exists "driver_email_unique";`);
    this.addSql(`alter table if exists "driver" drop constraint if exists "driver_handle_unique";`);
    this.addSql(`create table if not exists "delivery" ("id" text not null, "order_id" text not null, "driver_id" text not null, "status" text not null default 'pending', "pickup_address" jsonb null, "delivery_address" jsonb null, "pickup_time" timestamptz null, "delivery_time" timestamptz null, "estimated_delivery_time" timestamptz null, "actual_delivery_time" timestamptz null, "customer_rating" integer null, "customer_feedback" text null, "delivery_fee" integer null, "tip_amount" integer null, "notes" text null, "tracking_number" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "delivery_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_delivery_deleted_at" ON "delivery" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "driver" ("id" text not null, "handle" text not null, "avatar" text null, "email" text not null, "password_hash" text null, "first_name" text null, "last_name" text null, "full_name" text null, "phone_number" text null, "area" text null, "has_cell_phone" text null, "license_number" text null, "profile_photo" text null, "comfortable_with_gps" boolean null, "vehicle_info" jsonb null, "vehicle_type" text null, "current_work_status" text null, "preferred_hours" text null, "has_reliable_vehicle" boolean null, "available_weekends" boolean null, "experience_years" text null, "can_lift_packages" boolean null, "criminal_record" text null, "privacy_agreement" boolean null, "address" jsonb null, "status" text not null default 'pending', "rating" integer null, "total_deliveries" integer not null default 0, "stripe_account_id" text null, "stripe_account_status" text null, "stripe_connected" boolean not null default false, "onfleet_worker_id" text null, "application_date" timestamptz null, "approved_date" timestamptz null, "approved_by" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "driver_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_driver_handle_unique" ON "driver" (handle) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_driver_email_unique" ON "driver" (email) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_driver_deleted_at" ON "driver" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "delivery" cascade;`);

    this.addSql(`drop table if exists "driver" cascade;`);
  }

}
