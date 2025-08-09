import { model } from "@medusajs/framework/utils"
import VendorAdmin from "./vendor-admin"

const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  handle: model.text().unique(),
  name: model.text(),
  logo: model.text().nullable(),
  admins: model.hasMany(() => VendorAdmin, {
    mappedBy: "vendor",
  }),
  businessHours: model.json().nullable(),
  specialHours: model.json().nullable(), // For holidays, vacations, special events
  address: model.json().nullable(),
  social_links: model.json().nullable(),
  phone: model.text().nullable(),
  stripe_account_id: model.text().nullable(),
  stripe_account_status: model.text().nullable(),
  stripe_connected: model.boolean().default(false),
})

export default Vendor