import { ExecArgs } from "@medusajs/framework/types"
import createVendorStockLocationWorkflow from "../workflows/marketplace/create-vendor-stock-location"

export default async function createVendorStockLocation({
  container,
}: ExecArgs) {
  const logger = container.resolve("logger")

  try {
    // Example: Create a stock location for a vendor
    const { result } = await createVendorStockLocationWorkflow(container).run({
      input: {
        vendor_id: "vendor_123", // Replace with actual vendor ID
        name: "Main Warehouse",
        address: {
          address_1: "123 Warehouse St",
          city: "Copenhagen",
          country_code: "DK",
          postal_code: "2100",
        },
        phone: "+45 12 34 56 78",
        email: "warehouse@vendor.com",
        is_primary: true,
      },
    })

    logger.info("Successfully created vendor stock location:", result.stock_location)
    return result
  } catch (error) {
    logger.error("Error creating vendor stock location:", error)
    throw error
  }
} 