import { MedusaService } from "@medusajs/framework/utils"
import Vendor from "./models/vendor"
import VendorAdmin from "./models/vendor-admin"
import { ProductVendor } from "./models/product-vendor"

class MarketplaceModuleService extends MedusaService({
  Vendor,
  VendorAdmin,
  ProductVendor,
}) { }

export default MarketplaceModuleService