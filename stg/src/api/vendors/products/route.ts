import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createVendorAvailabilityChecker } from "../../../utils/vendor-availability"

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")
  return res.status(200).end()
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  try {
    // Parse session from cookie
    const cookies = req.headers.cookie
    if (!cookies) {
      return res.status(401).json({ error: "No session cookie found" })
    }

    const cookiePairs = cookies.split(';').map(pair => pair.trim().split('='))
    const cookieMap = Object.fromEntries(cookiePairs)
    const sessionToken = cookieMap.vendor_session

    if (!sessionToken) {
      return res.status(401).json({ error: "No vendor session found" })
    }

    // Extract vendor admin ID from session token
    const vendorAdminId = sessionToken.split('_')[1]
    console.log("🔍 Products endpoint - Vendor admin ID:", vendorAdminId)

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Get vendor admin
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: [
        "id",
        "email",
        "vendor.id",
        "vendor.name",
        "vendor.handle",
        "vendor.businessHours",
        "vendor.specialHours",
      ],
      filters: {
        id: [vendorAdminId],
      },
    })

    if (!vendorAdmins.length) {
      return res.status(401).json({ error: "Vendor admin not found" })
    }

    const vendorAdmin = vendorAdmins[0]
    const vendor = vendorAdmin.vendor
    console.log("🔍 Products endpoint - Vendor:", vendor.id, vendor.name)

    // Get vendor's business hours and special hours for availability checking
    const businessHours = vendor.businessHours || {}
    const specialHours = vendor.specialHours || {}

    const availabilityChecker = createVendorAvailabilityChecker(businessHours, specialHours)

    const shouldHideProducts = availabilityChecker.shouldHideProducts()
    const bannerInfo = availabilityChecker.getBannerInfo()
    const statusMessage = availabilityChecker.getStatusMessage()

    // Get products associated with this vendor using the link system
    // First get all product-vendor links for this vendor
    const { data: productVendorLinks } = await query.graph({
      entity: "product_vendor",
      fields: ["id", "vendor_id"],
      filters: {
        vendor_id: [vendor.id],
      },
    })

    // Get the product IDs from the links
    const productIds = productVendorLinks.map((link: any) => link.id)

    // Get the products
    const { data: vendorProducts } = await query.graph({
      entity: "product",
      fields: ["id", "title", "handle", "status", "thumbnail", "created_at", "updated_at"],
      filters: {
        id: productIds,
      },
    })

    console.log("🔍 Products endpoint - Found products:", vendorProducts.length)

    // Filter products based on availability settings
    const filteredProducts = shouldHideProducts ? [] : vendorProducts

    return res.json({
      products: filteredProducts,
      vendor_status: {
        should_hide_products: shouldHideProducts,
        banner_info: bannerInfo,
        status_message: statusMessage
      }
    })

  } catch (error) {
    console.error("🔍 Products endpoint - Error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  try {
    // Parse session from cookie
    const cookies = req.headers.cookie
    if (!cookies) {
      return res.status(401).json({ error: "No session cookie found" })
    }

    const cookiePairs = cookies.split(';').map(pair => pair.trim().split('='))
    const cookieMap = Object.fromEntries(cookiePairs)
    const sessionToken = cookieMap.vendor_session

    if (!sessionToken) {
      return res.status(401).json({ error: "No vendor session found" })
    }

    // Extract vendor admin ID from session token
    const vendorAdminId = sessionToken.split('_')[1]
    console.log("🔍 Products POST - Vendor admin ID:", vendorAdminId)

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Get vendor admin
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: [
        "id",
        "email",
        "vendor.id",
        "vendor.name",
      ],
      filters: {
        id: [vendorAdminId],
      },
    })

    if (!vendorAdmins.length) {
      return res.status(401).json({ error: "Vendor admin not found" })
    }

    const vendor = vendorAdmins[0].vendor
    const { title, handle, description } = req.body as any

    // Create new product (simplified for now)
    const newProduct = {
      id: `prod_${Date.now()}`,
      title: title || "New Product",
      handle: handle || `new-product-${Date.now()}`,
      description: description || "",
      status: "draft",
      vendor_id: vendor.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return res.json({ product: newProduct })

  } catch (error) {
    console.error("🔍 Products POST - Error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}