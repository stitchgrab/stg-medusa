import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import MarkplaceService from '../../../../../modules/marketplace/service'
import { MARKETPLACE_MODULE } from "../../../../../modules/marketplace"

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")
  return res.status(200).end()
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Get the product
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "handle"],
      filters: {
        id: [id],
      },
    })

    if (!products.length) {
      return res.status(404).json({ error: "Product not found" })
    }

    const product = products[0]

    // Get all vendors
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: ["id", "name", "handle"],
    })

    const currentVendor = product.product_vendor?.vendor
    console.log("🔍 Current vendor:", currentVendor)

    return res.json({
      product_id: id,
      current_vendor: currentVendor ? {
        id: currentVendor.id,
        name: currentVendor.name,
        handle: currentVendor.handle
      } : null,
      available_vendors: vendors
    })

  } catch (error) {
    console.error("Error getting product vendor:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params
    const { vendor_id } = req.body as { vendor_id: string }

    if (!vendor_id) {
      return res.status(400).json({ error: "Vendor ID is required" })
    }

    const marketplaceService = req.scope.resolve(MARKETPLACE_MODULE) as MarkplaceService

    try {
      await marketplaceService.retrieveProductVendor(id)
      await marketplaceService.updateProductVendors([{
        id: id,
        vendor: vendor_id
      }])
    } catch (error) {
      await marketplaceService.createProductVendors({
        vendor: vendor_id,
        id: id
      })
    }

    console.log(`Successfully updated product ${id} vendor_id to ${vendor_id}`)

    return res.json({
      success: true,
      message: `Product vendor association ${vendor_id ? 'updated' : 'removed'} successfully`,
      product_id: id,
      vendor_id: vendor_id
    })

  } catch (error) {
    console.error("Error updating product vendor:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
} 