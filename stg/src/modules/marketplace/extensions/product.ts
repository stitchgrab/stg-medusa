import { model } from "@medusajs/framework/utils"

const ProductExtension = model.define("product", {
  vendor_id: model.text().nullable(),
})

export default ProductExtension 