import { model } from "@medusajs/framework/utils"
import Vendor from "./vendor"

export const ProductVendor = model.define("product_vendor", {
  id: model.id().primaryKey(),
  vendor: model.belongsTo(() => Vendor, {
    mappedBy: "vendor_id",
  }),
}) 