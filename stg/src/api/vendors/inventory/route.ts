import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../utils/cors"
import { validateVendorSession } from "../../../utils/vendor-auth"

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

  try {
    const payload = await validateVendorSession(req)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const vendorId = payload.vendor_id

    // Get vendor's products
    const { data: vendorProductLinks } = await query.graph({
      entity: "product_vendor",
      fields: ["id", "vendor_id"],
      filters: {
        vendor_id: [vendorId],
      },
    })
    const { data: vendorProducts } = await query.graph({
      entity: "product",
      fields: ["id", "title", "handle", "status", "thumbnail", "images.*"],
      filters: {
        id: vendorProductLinks.map((link: any) => link.id),
      },
    })

    // Filter products by vendor manually since the filter syntax is complex
    const vendorProductsFiltered = vendorProducts.filter((product: any) => vendorProductLinks.some((link: any) => link.id === product.id))

    if (!vendorProductsFiltered.length) {
      return res.status(200).json({
        inventory: [],
        message: "No products found for this vendor",
      })
    }

    const productIds = vendorProductsFiltered.map((product: any) => product.id)

    // Get product variants for vendor's products
    const { data: productVariants } = await query.graph({
      entity: "product_variant",
      fields: [
        "id",
        "title",
        "sku",
        "barcode",
        "ean",
        "upc",
        "product.id",
        "product.title",
        "product.handle",
        "product.status",
        "product.thumbnail",
        "product.images.*"
      ],
    })

    // Filter variants by vendor's products
    const vendorVariants = productVariants.filter((variant: any) =>
      productIds.includes(variant.product?.id)
    )

    // Get inventory items linked to these variants
    const variantIds = vendorVariants.map((variant: any) => variant.id)

    const { data: variantInventoryLinks } = await query.graph({
      entity: "product_variant_inventory_item",
      fields: [
        "id",
        "variant_id",
        "inventory_item_id",
        "required_quantity"
      ],
    })

    // Filter links by vendor's variants
    const vendorInventoryLinks = variantInventoryLinks.filter((link: any) =>
      variantIds.includes(link.variant_id)
    )

    // Get inventory items
    const inventoryItemIds = vendorInventoryLinks.map((link: any) => link.inventory_item_id)

    const { data: inventoryItems } = await query.graph({
      entity: "inventory_item",
      fields: [
        "id",
        "sku",
        "created_at",
        "updated_at"
      ],
    })

    // Filter inventory items by vendor's inventory items
    const vendorInventoryItems = inventoryItems.filter((item: any) =>
      inventoryItemIds.includes(item.id)
    )

    // Get inventory levels for these items
    const { data: inventoryLevels } = await query.graph({
      entity: "inventory_level",
      fields: [
        "id",
        "inventory_item_id",
        "location_id",
        "stocked_quantity",
        "reserved_quantity",
        "available_quantity",
      ],
    })

    // Filter inventory levels by vendor's inventory items
    const vendorInventoryLevels = inventoryLevels.filter((level: any) =>
      inventoryItemIds.includes(level.inventory_item_id)
    )

    // Combine everything into a comprehensive inventory view
    const inventoryWithLevels = vendorVariants.map((variant: any) => {
      // Find inventory links for this variant
      const variantLinks = vendorInventoryLinks.filter((link: any) => link.variant_id === variant.id)

      // Get inventory items for this variant
      const variantInventoryItems = variantLinks.map((link: any) => {
        const inventoryItem = vendorInventoryItems.find((item: any) => item.id === link.inventory_item_id)
        const levels = vendorInventoryLevels.filter((level: any) => level.inventory_item_id === link.inventory_item_id)

        return {
          ...inventoryItem,
          required_quantity: link.required_quantity,
          inventory_levels: levels,
          total_stocked: levels.reduce((sum: number, level: any) => sum + level.stocked_quantity, 0),
          total_reserved: levels.reduce((sum: number, level: any) => sum + level.reserved_quantity, 0),
          total_available: levels.reduce((sum: number, level: any) => sum + level.available_quantity, 0),
        }
      })

      return {
        ...variant,
        inventory_items: variantInventoryItems,
        total_stocked: variantInventoryItems.reduce((sum: number, item: any) => sum + item.total_stocked, 0),
        total_reserved: variantInventoryItems.reduce((sum: number, item: any) => sum + item.total_reserved, 0),
        total_available: variantInventoryItems.reduce((sum: number, item: any) => sum + item.total_available, 0),
      }
    })

    res.json({
      inventory: inventoryWithLevels,
      total_variants: inventoryWithLevels.length,
      total_products: vendorProducts.length,
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

    console.error("Vendor inventory error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
} 