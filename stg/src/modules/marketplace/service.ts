import { MedusaService } from "@medusajs/framework/utils"
import Vendor from "./models/vendor"
import VendorAdmin from "./models/vendor-admin"
import { ProductVendor } from "./models/product-vendor"
import Driver from "./models/driver"
import Delivery from "./models/delivery"

class MarketplaceModuleService extends MedusaService({
  Vendor,
  VendorAdmin,
  ProductVendor,
  Driver,
  Delivery,
}) { }

export default MarketplaceModuleService