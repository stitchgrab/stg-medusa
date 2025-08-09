import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import createVendorStockLocationWorkflow from "../../../../../workflows/marketplace/create-vendor-stock-location"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id: vendor_id } = req.params
  const {
    name,
    address,
    phone,
    email,
    is_primary = false,
  } = req.body

  try {
    const { result } = await createVendorStockLocationWorkflow(req.scope).run({
      input: {
        vendor_id,
        name,
        address,
        phone,
        email,
        is_primary,
      },
    })

    res.status(201).json({
      stock_location: result.stock_location,
    })
  } catch (error) {
    res.status(400).json({
      message: "Failed to create vendor stock location",
      error: error.message,
    })
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id: vendor_id } = req.params
  const query = req.scope.resolve("query")

  try {
    const { data: stockLocations } = await query.graph({
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
        vendor: {
          id: vendor_id,
        },
      },
    })

    res.status(200).json({
      stock_locations: stockLocations,
    })
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch vendor stock locations",
      error: error.message,
    })
  }
} 