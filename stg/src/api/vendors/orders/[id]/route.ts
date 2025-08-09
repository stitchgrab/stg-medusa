import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../../utils/cors"
import { getCurrentVendorAdmin } from "../../../../utils/vendor-auth"

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
    const { id: orderId } = req.params

    // Step 1: Get all products that belong to this vendor
    const { data: allProducts } = await query.graph({
      entity: "product_vendor",
      fields: ["id", "vendor_id"],
    })

    const vendorProducts = allProducts.filter(product =>
      (product as any).vendor_id === vendorAdmin.vendor.id
    )

    if (!vendorProducts.length) {
      return res.status(404).json({
        error: "No products found for this vendor",
        message: "This vendor has no products associated with any orders."
      })
    }

    const productIds = vendorProducts.map(p => p.id)

    // Step 2: Get the specific order with comprehensive details
    const { data: orders } = await query.graph({
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
        "currency_code",
        "region_id",
        "sales_channel_id",
        "items.id",
        "items.title",
        "items.quantity",
        "items.unit_price",
        "items.total",
        "items.variant_id",
        "items.product_id",
        "items.metadata",
        "items.variant.id",
        "items.variant.title",
        "items.variant.sku",
        "items.variant.barcode",
        "items.variant.options.id",
        "items.variant.options.value",
        "items.variant.options.option.id",
        "items.variant.options.option.title",
        "items.variant.product.id",
        "items.variant.product.title",
        "items.variant.product.description",
        "items.variant.product.vendor_id",
        "customer.id",
        "customer.email",
        "customer.first_name",
        "customer.last_name",
        "customer.phone",
        "billing_address.id",
        "billing_address.first_name",
        "billing_address.last_name",
        "billing_address.address_1",
        "billing_address.address_2",
        "billing_address.city",
        "billing_address.country_code",
        "billing_address.province",
        "billing_address.postal_code",
        "billing_address.phone",
        "shipping_address.id",
        "shipping_address.first_name",
        "shipping_address.last_name",
        "shipping_address.address_1",
        "shipping_address.address_2",
        "shipping_address.city",
        "shipping_address.country_code",
        "shipping_address.province",
        "shipping_address.postal_code",
        "shipping_address.phone",
        "shipping_methods.id",
        "shipping_methods.name",
        "shipping_methods.amount",
        "shipping_methods.data",
        "fulfillments.id",
        "fulfillments.shipped_at",
        "fulfillments.created_at",
        "fulfillments.tracking_numbers",
        "fulfillments.data",
        "fulfillments.provider_id",
        "fulfillments.items.id",
        "fulfillments.items.quantity",
        "payment_collections.id",
        "payment_collections.status",
        "payment_collections.amount",
        "payment_collections.created_at",
        "payment_collections.payments.id",
        "payment_collections.payments.amount",
        "payment_collections.payments.currency_code",
        "payment_collections.payments.provider_id",
        "payment_collections.payments.data"
      ],
      filters: {
        id: [orderId]
      },
    })

    if (!orders.length) {
      return res.status(404).json({
        error: "Order not found",
        message: `Order with ID ${orderId} was not found.`
      })
    }

    const order = orders[0]

    // Step 3: Check if this order contains vendor products
    const vendorItems = (order.items || []).filter(item =>
      item && item.product_id && productIds.includes(item.product_id)
    )

    if (!vendorItems.length) {
      return res.status(403).json({
        error: "Access denied",
        message: "This order does not contain any products from your store."
      })
    }

    // Step 4: Calculate vendor-specific totals
    const vendorSubtotal = vendorItems.reduce((sum, item) => sum + (item?.total || 0), 0)
    const orderSubtotal = order.subtotal || 1
    const vendorProportion = vendorSubtotal / orderSubtotal
    const vendorShipping = Math.round((order.shipping_total || 0) * vendorProportion)
    const vendorTax = Math.round((order.tax_total || 0) * vendorProportion)
    const vendorTotal = vendorSubtotal + vendorShipping + vendorTax

    // Step 5: Filter fulfillments to only include vendor items
    const vendorFulfillments = (order.fulfillments || []).map(fulfillment => {
      if (!fulfillment) return null

      const vendorFulfillmentItems = (fulfillment.items || []).filter(fulfillmentItem => {
        if (!fulfillmentItem) return false
        // Find the corresponding order item
        const orderItem = vendorItems.find(item => item?.id === fulfillmentItem.id)
        return !!orderItem
      })

      return vendorFulfillmentItems.length > 0 ? {
        ...fulfillment,
        items: vendorFulfillmentItems
      } : null
    }).filter(Boolean)

    // Step 6: Process and return the detailed order
    const detailedOrder = {
      id: order.id,
      display_id: (order as any).display_id,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      email: order.email,
      currency_code: order.currency_code,
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
        phone: order.customer.phone,
      } : null,
      billing_address: order.billing_address,
      shipping_address: order.shipping_address,
      items: vendorItems.map(item => ({
        id: item?.id || '',
        title: item?.title || '',
        quantity: item?.quantity || 0,
        unit_price: item?.unit_price || 0,
        total: item?.total || 0,
        variant_id: item?.variant_id || '',
        product_id: item?.product_id || '',
        metadata: item?.metadata,
        variant: item?.variant ? {
          id: item.variant.id || '',
          title: item.variant.title || '',
          sku: item.variant.sku || '',
          barcode: item.variant.barcode || '',
          options: (item.variant.options || []).map(option => ({
            id: option.id,
            value: option.value,
            option: {
              id: option.option?.id,
              title: option.option?.title
            }
          })),
          product: {
            id: item.variant.product?.id || '',
            title: item.variant.product?.title || '',
            description: item.variant.product?.description || '',
          }
        } : null
      })),
      shipping_methods: order.shipping_methods || [],
      fulfillments: vendorFulfillments,
      payment_collections: order.payment_collections || [],
      // Additional vendor-specific fields
      vendor_item_count: vendorItems.length,
      total_item_count: order.items?.length || 0,
      vendor_proportion: vendorProportion,
    }

    res.json({
      order: detailedOrder,
      meta: {
        vendor_id: vendorAdmin.vendor.id,
        vendor_name: vendorAdmin.vendor.name,
      }
    })
  } catch (error) {
    console.error("Vendor order details error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
}
