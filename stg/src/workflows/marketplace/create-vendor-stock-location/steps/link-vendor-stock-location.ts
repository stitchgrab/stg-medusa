import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import MarketplaceModule from "../../../../modules/marketplace"

type LinkVendorStockLocationStepInput = {
  vendor_id: string
  stock_location_id: string
}

const linkVendorStockLocationStep = createStep(
  "link-vendor-stock-location",
  async (linkData: LinkVendorStockLocationStepInput, { container }) => {
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    // Create link using module names as keys, following Medusa documentation
    await link.create({
      "marketplace": {
        vendor_id: linkData.vendor_id,
      },
      [Modules.STOCK_LOCATION]: {
        stock_location_id: linkData.stock_location_id,
      },
    })

    return new StepResponse(linkData, linkData.stock_location_id)
  },
  async (stockLocationId, { container }) => {
    if (!stockLocationId) {
      return
    }

    const link = container.resolve(ContainerRegistrationKeys.LINK)

    // Note: Link deletion would need to be implemented
    // using the appropriate module keys
    try {
      await link.delete({
        [Modules.STOCK_LOCATION]: {
          stock_location_id: stockLocationId,
        },
      })
    } catch (error) {
      // Log error but don't throw to avoid breaking rollback
      console.error("Error deleting vendor-stock-location link:", error)
    }
  }
)

export default linkVendorStockLocationStep 