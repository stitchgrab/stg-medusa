import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { getPromotionsListWorkflow } from "@medusajs/medusa/core-flows"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../utils/cors"

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  return setVendorCorsHeadersOptions(res)
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Set CORS headers
  setVendorCorsHeaders(res)

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Access cookies from the request
    const sessionToken = req.cookies?.vendor_session

    if (!sessionToken) {
      return res.status(401).json({
        message: "No session found",
        authenticated: false,
      })
    }

    // Parse the session token to get vendor admin ID
    const tokenParts = sessionToken.split("_")
    if (tokenParts.length < 3 || tokenParts[0] !== "vendor") {
      return res.status(401).json({
        message: "Invalid session token",
        authenticated: false,
      })
    }

    const vendorAdminId = tokenParts[1]

    // Find vendor admin by ID
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: ["id", "email", "first_name", "last_name", "vendor.id", "vendor.name", "vendor.handle", "vendor.products.*"],
      filters: {
        id: [vendorAdminId],
      },
    })

    if (!vendorAdmins.length) {
      return res.status(401).json({
        message: "Vendor admin not found",
        authenticated: false,
      })
    }

    const vendorAdmin = vendorAdmins[0]

    // Get vendor product IDs
    const vendorProductIds = vendorAdmin.vendor.products?.map((product) => product?.id).filter(Boolean) || []

    if (vendorProductIds.length === 0) {
      return res.json({
        promotions: [],
      })
    }

    // Get promotions that apply to this vendor's products
    const { result: promotions } = await getPromotionsListWorkflow(req.scope)
      .run({
        input: {
          fields: [
            "id",
            "code",
            "type",
            "value",
            "usage_limit",
            "usage_count",
            "starts_at",
            "ends_at",
            "status",
            "created_at",
            "updated_at",
            "products.*",
          ],
          variables: {
            filters: {
              products: {
                id: vendorProductIds,
              },
            },
          },
        },
      })

    // Process promotion data to include vendor-specific information
    const vendorPromotions = promotions.map((promotion) => {
      const vendorProductCount = promotion.products?.filter(product =>
        vendorProductIds.includes(product.id)
      ).length || 0

      return {
        id: promotion.id,
        name: promotion.code, // Using code as name for now
        code: promotion.code,
        type: promotion.type,
        value: promotion.value,
        usage_limit: promotion.usage_limit,
        usage_count: promotion.usage_count,
        starts_at: promotion.starts_at,
        ends_at: promotion.ends_at,
        status: promotion.status,
        vendor_product_count: vendorProductCount,
        created_at: promotion.created_at,
      }
    })

    res.json({
      promotions: vendorPromotions,
    })
  } catch (error) {
    console.error("Vendor promotions error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
} 