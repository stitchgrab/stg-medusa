import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../utils/cors"
import { getCurrentVendor } from "../../../utils/vendor-auth"
import createVendorStockLocationWorkflow from "../../../workflows/marketplace/create-vendor-stock-location"

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  setVendorCorsHeadersOptions(res)
  return res.status(200).end()
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  setVendorCorsHeaders(res)

  try {
    // Get current vendor using JWT authentication
    const vendor = await getCurrentVendor(req)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data: vendorStockLocations } = await query.graph({
      entity: "vendor_stock_location",
      fields: [
        "stock_location_id",
        "stock_location.name",
        "stock_location.address.address_1",
        "stock_location.address.address_2",
        "stock_location.address.city",
        "stock_location.address.postal_code",
        "stock_location.address.province",
        "stock_location.phone",
        "stock_location.email",
      ],
      filters: {
        vendor_id: [vendor.id],
      },
    })

    res.json({
      stock_locations: vendorStockLocations,
      vendor: {
        id: vendor.id,
        name: vendor.name,
        handle: vendor.handle,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === "No session found") {
      return res.status(401).json({
        message: "No session found",
        authenticated: false,
      })
    }

    if (error instanceof Error && error.message === "Invalid or expired session") {
      return res.status(401).json({
        message: "Invalid or expired session",
        authenticated: false,
      })
    }

    console.error("Vendor stock locations error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const POST = async (
  req: MedusaRequest<{
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
  }>,
  res: MedusaResponse
) => {
  setVendorCorsHeaders(res)

  try {
    // Get current vendor using JWT authentication
    const vendor = await getCurrentVendor(req)
    const { name, address, phone, email, is_primary } = req.body

    // Create stock location for this vendor
    const { result } = await createVendorStockLocationWorkflow(req.scope).run({
      input: {
        vendor_id: vendor.id,
        name,
        address,
        phone,
        email,
        is_primary,
      },
    })

    res.status(201).json({
      stock_location: result.stock_location,
      vendor: {
        id: vendor.id,
        name: vendor.name,
        handle: vendor.handle,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === "No session found") {
      return res.status(401).json({
        message: "No session found",
        authenticated: false,
      })
    }

    if (error instanceof Error && error.message === "Invalid or expired session") {
      return res.status(401).json({
        message: "Invalid or expired session",
        authenticated: false,
      })
    }

    console.error("Create vendor stock location error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
}