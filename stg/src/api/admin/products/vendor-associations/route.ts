import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")
  return res.status(200).end()
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Get all product-vendor links
    const { data: productVendorLinks } = await query.graph({
      entity: "product_vendor",
      fields: ["id", "vendor_id"],
    })

    // Convert to a map for easy lookup
    const vendorAssociations: Record<string, string> = {}
    productVendorLinks.forEach((link: any) => {
      vendorAssociations[link.id] = link.vendor_id
    })

    return res.json({
      associations: vendorAssociations
    })

  } catch (error) {
    console.error("Error getting vendor associations:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
} 