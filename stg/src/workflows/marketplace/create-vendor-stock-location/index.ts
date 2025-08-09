import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import createStockLocationStep from "./steps/create-stock-location"
import linkVendorStockLocationStep from "./steps/link-vendor-stock-location"

export type CreateVendorStockLocationWorkflowInput = {
  vendor_id: string
  name: string
  address?: {
    address_1?: string
    address_2?: string
    city?: string
    postal_code?: string
    province?: string
  }
  phone?: string
  email?: string
  is_primary?: boolean
}

const createVendorStockLocationWorkflow = createWorkflow(
  "create-vendor-stock-location",
  function (input: CreateVendorStockLocationWorkflowInput) {
    // Create the stock location with the address
    const stockLocation = createStockLocationStep({
      name: input.name,
      address: input.address,
    })

    // Link the stock location to the vendor
    const linkData = transform({
      input,
      stockLocation,
    }, async (data) => {
      return {
        vendor_id: data.input.vendor_id,
        stock_location_id: data.stockLocation.id,
      }
    })

    linkVendorStockLocationStep(linkData)

    // Query the created stock location with vendor link
    const { data: stockLocationWithVendor } = useQueryGraphStep({
      entity: "stock_location",
      fields: [
        "id",
        "name",
        "address",
        "created_at",
        "updated_at",
        "vendor.*",
      ],
      filters: {
        id: stockLocation.id,
      },
    })

    return new WorkflowResponse({
      stock_location: stockLocationWithVendor[0],
    })
  }
)

export default createVendorStockLocationWorkflow 