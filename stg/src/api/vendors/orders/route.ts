import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { getOrdersListWorkflow } from "@medusajs/medusa/core-flows"

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")
  return res.status(200).end()
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Debug logging
    console.log("🔍 Orders endpoint - Request headers:", req.headers)
    console.log("🔍 Orders endpoint - All cookies:", req.cookies)
    console.log("🔍 Orders endpoint - Cookie header:", req.headers.cookie)

    // Access cookies from the request
    const sessionToken = req.cookies?.vendor_session

    console.log("🔍 Orders endpoint - Session token:", sessionToken)

    if (!sessionToken) {
      console.log("❌ No session token found")
      return res.status(401).json({
        message: "No session found",
        authenticated: false,
      })
    }

    // Parse the session token to get vendor admin ID
    const tokenParts = sessionToken.split("_")
    if (tokenParts.length < 3 || tokenParts[0] !== "vendor") {
      console.log("❌ Invalid session token format:", sessionToken)
      return res.status(401).json({
        message: "Invalid session token",
        authenticated: false,
      })
    }

    const vendorAdminId = tokenParts[1]
    console.log("🔍 Orders endpoint - Vendor admin ID:", vendorAdminId)

    // Find vendor admin by ID
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: ["id", "email", "first_name", "last_name", "vendor.id", "vendor.name", "vendor.handle", "vendor.orders.*"],
      filters: {
        id: [vendorAdminId],
      },
    })

    console.log("🔍 Orders endpoint - Found vendor admins:", vendorAdmins.length)

    if (!vendorAdmins.length) {
      console.log("❌ No vendor admin found for ID:", vendorAdminId)
      return res.status(401).json({
        message: "Vendor admin not found",
        authenticated: false,
      })
    }

    const vendorAdmin = vendorAdmins[0]
    console.log("🔍 Orders endpoint - Vendor admin:", vendorAdmin.id, vendorAdmin.email)

    // Get orders for this vendor
    const { result: orders } = await getOrdersListWorkflow(req.scope)
      .run({
        input: {
          fields: [
            "metadata",
            "total",
            "subtotal",
            "shipping_total",
            "tax_total",
            "items.*",
            "items.tax_lines",
            "items.adjustments",
            "items.variant",
            "items.variant.product",
            "items.detail",
            "shipping_methods",
            "payment_collections",
            "fulfillments",
          ],
          variables: {
            filters: {
              id: vendorAdmin.vendor.orders?.map((order) => order?.id).filter(Boolean) || [],
            },
          },
        },
      })

    const ordersResult = orders as any
    console.log("🔍 Orders endpoint - Found orders:", ordersResult.rows?.length || ordersResult.length || 0)

    res.json({
      orders: ordersResult.rows || ordersResult,
    })
  } catch (error) {
    console.error("❌ Vendor orders error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
}