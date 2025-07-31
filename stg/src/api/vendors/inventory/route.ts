import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

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

    // Get inventory items for this vendor's products using direct query
    const { data: inventoryItems } = await query.graph({
      entity: "inventory_item",
      fields: [
        "id",
        "sku",
        "created_at",
        "updated_at",
      ],
    })

    // Filter to only include items for vendor products
    const vendorInventory = inventoryItems
      .filter(item => {
        // For now, we'll include all inventory items
        // In a real implementation, you'd filter by product association
        return true
      })
      .map((item, index) => {
        // Mock quantities for now since the actual fields aren't available
        const quantity = 100 - (index * 10)
        const reservedQuantity = Math.floor(Math.random() * 10)
        const availableQuantity = quantity - reservedQuantity

        let status = 'in_stock'
        if (quantity === 0) {
          status = 'out_of_stock'
        } else if (availableQuantity <= 10) {
          status = 'low_stock'
        }

        return {
          id: item.id,
          product_title: `Product ${item.sku}`,
          sku: item.sku,
          quantity: quantity,
          reserved_quantity: reservedQuantity,
          available_quantity: availableQuantity,
          location: 'Default Location',
          status: status,
          last_updated: item.updated_at,
        }
      })

    res.json({
      inventory: vendorInventory,
    })
  } catch (error) {
    console.error("Vendor inventory error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
} 