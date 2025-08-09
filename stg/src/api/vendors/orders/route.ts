import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../utils/cors"
import { getCurrentVendorAdmin } from "../../../utils/vendor-auth"

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
  setVendorCorsHeaders(res)

  try {
    const vendorAdmin = await getCurrentVendorAdmin(req)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Get pagination parameters
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0

    // Step 1: Get all products that belong to this vendor
    // Since vendor_id might not be queryable directly, let's get all products and filter
    const { data: allProducts } = await query.graph({
      entity: "product_vendor",
      fields: ["id", "vendor_id"],
    })

    const vendorProducts = allProducts.filter(product =>
      (product as any).vendor_id === vendorAdmin.vendor.id
    )

    if (!vendorProducts.length) {
      return res.json({ orders: [] })
    }

    const productIds = vendorProducts.map(p => p.id)

    // Step 2: Find all orders that contain line items with products from this vendor
    const { data: ordersWithVendorProducts } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "status",
        "created_at",
        "updated_at",
        "total",
        "subtotal",
        "shipping_total",
        "tax_total",
        "metadata",
        "customer_id",
        "email",
        "items.id",
        "items.title",
        "items.quantity",
        "items.unit_price",
        "items.total",
        "items.variant_id",
        "items.product_id",
        "items.variant.title",
        "items.variant.product.id",
        "items.variant.product.title",
        "items.variant.product.vendor_id",
        "customer.id",
        "customer.email",
        "customer.first_name",
        "customer.last_name",
        "fulfillments.id",
        "fulfillments.shipped_at",
        "fulfillments.tracking_numbers",
        "payment_collections.status",
        "payment_collections.amount"
      ],
      // No filters initially - we'll filter after getting all orders
      filters: {},
    })

    // Step 3: Filter orders to only include those with vendor products and calculate totals
    const ordersWithVendorItems = ordersWithVendorProducts.filter(order => {
      const hasVendorItems = (order.items || []).some(item =>
        item && item.product_id && productIds.includes(item.product_id)
      )
      return hasVendorItems
    })

    const processedOrders = ordersWithVendorItems.map(order => {
      // Filter items to only include those from this vendor
      const vendorItems = (order.items || []).filter(item =>
        item && item.product_id && productIds.includes(item.product_id)
      )

      // Calculate vendor-specific totals
      const vendorSubtotal = vendorItems.reduce((sum, item) => sum + (item?.total || 0), 0)

      // Calculate proportional shipping and tax (based on vendor items vs total order)
      const orderSubtotal = order.subtotal || 1 // Avoid division by zero
      const vendorProportion = vendorSubtotal / orderSubtotal
      const vendorShipping = Math.round((order.shipping_total || 0) * vendorProportion)
      const vendorTax = Math.round((order.tax_total || 0) * vendorProportion)
      const vendorTotal = vendorSubtotal + vendorShipping + vendorTax

      return {
        id: order.id,
        display_id: (order as any).display_id,
        status: order.status,
        created_at: order.created_at,
        updated_at: order.updated_at,
        email: order.email,
        total: vendorTotal,
        subtotal: vendorSubtotal,
        shipping_total: vendorShipping,
        tax_total: vendorTax,
        metadata: order.metadata,
        customer: order.customer ? {
          id: order.customer.id,
          email: order.customer.email,
          first_name: order.customer.first_name,
          last_name: order.customer.last_name,
        } : null,
        items: vendorItems.map(item => ({
          id: item?.id || '',
          title: item?.title || '',
          quantity: item?.quantity || 0,
          unit_price: item?.unit_price || 0,
          total: item?.total || 0,
          variant_id: item?.variant_id || '',
          product_id: item?.product_id || '',
          variant: item?.variant ? {
            id: item.variant_id || '',
            title: item.variant.title || '',
            product: {
              id: item.variant.product?.id || '',
              title: item.variant.product?.title || '',
            }
          } : null
        })),
        fulfillments: order.fulfillments || [],
        payment_collections: order.payment_collections || [],
        // Additional vendor-specific fields
        vendor_item_count: vendorItems.length,
        total_item_count: order.items?.length || 0,
      }
    })

    // Sort by creation date (newest first)
    processedOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Apply pagination
    const totalOrders = processedOrders.length
    const paginatedOrders = processedOrders.slice(offset, offset + limit)

    res.json({
      orders: paginatedOrders,
      meta: {
        total_orders: totalOrders,
        vendor_id: vendorAdmin.vendor.id,
        vendor_name: vendorAdmin.vendor.name,
        limit,
        offset,
        has_more: offset + limit < totalOrders,
      }
    })
  } catch (error) {
    console.error("Vendor orders error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
}