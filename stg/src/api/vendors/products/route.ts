import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../utils/cors"
import { getCurrentVendor, getCurrentVendorAdmin } from "../../../utils/vendor-auth"
import createVendorProductWorkflow from "../../../workflows/marketplace/create-vendor-product"

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  return setVendorCorsHeadersOptions(res)
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  setVendorCorsHeaders(res)

  try {
    // Parse session from cookie
    const vendor = await getCurrentVendor(req)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

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

    return res.json({
      products: vendorProducts,
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

    console.error("🔍 Products endpoint - Error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Create a new product for the authenticated vendor
 * 
 * Example usage:
 * 
 * Basic product:
 * POST /vendors/products
 * {
 *   "title": "My Product",
 *   "description": "Product description",
 *   "status": "draft"
 * }
 * 
 * Advanced product with variants:
 * POST /vendors/products
 * {
 *   "title": "T-Shirt",
 *   "handle": "t-shirt",
 *   "description": "Comfortable cotton t-shirt",
 *   "status": "published",
 *   "weight": 200,
 *   "thumbnail": "https://example.com/image.jpg",
 *   "options": [
 *     {
 *       "title": "Size",
 *       "values": ["S", "M", "L", "XL"]
 *     },
 *     {
 *       "title": "Color", 
 *       "values": ["Red", "Blue", "Green"]
 *     }
 *   ],
 *   "variants": [
 *     {
 *       "title": "S / Red",
 *       "sku": "TSHIRT-S-RED",
 *       "prices": [
 *         {
 *           "amount": 2500,
 *           "currency_code": "usd"
 *         }
 *       ],
 *       "options": {
 *         "Size": "S",
 *         "Color": "Red"
 *       }
 *     }
 *   ],
 *   "images": [
 *     {
 *       "url": "https://example.com/image1.jpg"
 *     }
 *   ],
 *   "category_ids": ["cat_123"],
 *   "tag_ids": ["tag_456"],
 *   "metadata": {
 *     "vendor_note": "Special product for summer"
 *   }
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  setVendorCorsHeaders(res)

  try {
    // Parse session from cookie
    const vendorAdmin = await getCurrentVendorAdmin(req)

    /**
     * Product creation fields based on createProductsWorkflow input
     * @see https://docs.medusajs.com/resources/references/medusa-workflows/createProductsWorkflow
     */
    const {
      // Required fields
      title,
      handle,

      // Basic product info
      description,
      subtitle,
      status = "draft",
      is_giftcard = false,
      thumbnail,

      // Physical properties
      width,
      weight,
      length,
      height,
      origin_country,
      hs_code,
      mid_code,
      material,

      // Categorization
      collection_id,
      type_id,
      tag_ids = [],
      category_ids = [],

      // Settings
      discountable = true,
      metadata = {},

      // Product structure
      variants = [],
      options = [],
      images = [],

      // External integration
      external_id,

      // Distribution
      sales_channels = [{ id: "default" }],
    } = req.body as any

    // Basic validation
    if (!title) {
      return res.status(400).json({
        error: "Title is required"
      })
    }

    // Validate status
    const validStatuses = ["draft", "proposed", "published", "rejected"]
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      })
    }

    // Get the container to run the workflow
    const container = req.scope

    // Create product using the vendor product workflow
    const { result } = await createVendorProductWorkflow(container).run({
      input: {
        vendor_admin_id: vendorAdmin.id,
        product: {
          title: title || "New Product",
          handle: handle || `new-product-${Date.now()}`,
          description: description || "",
          subtitle: subtitle,
          status: status,
          is_giftcard: is_giftcard,
          thumbnail: thumbnail,
          width: width,
          weight: weight,
          length: length,
          height: height,
          origin_country: origin_country,
          hs_code: hs_code,
          mid_code: mid_code,
          material: material,
          collection_id: collection_id,
          type_id: type_id,
          tag_ids: tag_ids,
          category_ids: category_ids,
          discountable: discountable,
          metadata: metadata,
          external_id: external_id,
          // Variants
          variants: variants.length > 0 ? variants : [
            {
              title: title || "Default Variant",
              sku: `SKU-${Date.now()}`,
              prices: [
                {
                  amount: 1000, // $10.00 in cents
                  currency_code: "usd",
                },
              ],
            },
          ],
          // Options
          options: options.length > 0 ? options : [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          // Images
          images: images,
          // Sales channels
          sales_channels: sales_channels,
        },
      },
    })

    console.log("🔍 Products POST - Created product:", {
      id: result.product.id,
      title: result.product.title,
      handle: result.product.handle,
      status: result.product.status,
      variants_count: result.product.variants?.length || 0,
      options_count: result.product.options?.length || 0,
    })

    return res.json({
      product: result.product,
      message: "Product created successfully",
      vendor_id: vendorAdmin.vendor?.id,
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

    console.error("🔍 Products POST - Error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}