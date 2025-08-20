import { model } from "@medusajs/framework/utils"

const Driver = model.define("driver", {
  id: model.id().primaryKey(),
  handle: model.text().unique(),
  avatar: model.text().nullable(),

  // Authentication fields (moved from DriverAdmin)
  email: model.text().unique(),
  password_hash: model.text().nullable(),
  first_name: model.text().nullable(),
  last_name: model.text().nullable(),

  // Personal Information
  full_name: model.text().nullable(),
  phone_number: model.text().nullable(),
  area: model.text().nullable(),
  has_cell_phone: model.text().nullable(), // Yes/No answer

  // Driver Information
  license_number: model.text().nullable(),
  profile_photo: model.text().nullable(), // File URL
  comfortable_with_gps: model.boolean().nullable(),

  // Vehicle Information
  vehicle_info: model.json().nullable(), // Vehicle details like make, model, year, plate
  vehicle_type: model.text().nullable(), // Car, Motorcycle, etc.

  // Work Information
  current_work_status: model.text().nullable(), // Current delivery work hours
  preferred_hours: model.text().nullable(), // Preferred hours for StitchGrab
  has_reliable_vehicle: model.boolean().nullable(),
  available_weekends: model.boolean().nullable(),
  experience_years: model.text().nullable(),
  can_lift_packages: model.boolean().nullable(),

  // Background Check
  criminal_record: model.text().nullable(),
  privacy_agreement: model.boolean().nullable(),

  address: model.json().nullable(),
  status: model.text().default("pending"), // pending, active, inactive, suspended, rejected
  rating: model.number().nullable(),
  total_deliveries: model.number().default(0),
  stripe_account_id: model.text().nullable(),
  stripe_account_status: model.text().nullable(),
  stripe_connected: model.boolean().default(false),
  onfleet_worker_id: model.text().nullable(),

  // Application tracking
  application_date: model.dateTime().nullable(),
  approved_date: model.dateTime().nullable(),
  approved_by: model.text().nullable(),
})

export default Driver
