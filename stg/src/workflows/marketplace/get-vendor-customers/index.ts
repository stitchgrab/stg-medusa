import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"

type WorkflowInput = {
  vendor_admin_id: string
}

type WorkflowOutput = {
  customers: Array<{
    id: string
    email: string
    first_name: string
    last_name: string
    phone: string
    total_orders: number
    total_spent: number
    last_order_date: string | null
    status: 'active' | 'inactive'
    created_at: string
  }>
}

const getVendorCustomersWorkflow = createWorkflow(
  "get-vendor-customers",
  (input: WorkflowInput) => {
    // Step 1: Get vendor admin and their products
    const { data: vendorAdmins } = useQueryGraphStep({
      entity: "vendor_admin",
      fields: ["id", "email", "first_name", "last_name", "vendor.id", "vendor.name", "vendor.handle", "vendor.products.*"],
      filters: {
        id: [input.vendor_admin_id],
      },
    }).config({ name: "retrieve-vendor-admins" })

    // Step 2: Get all orders with their items and customer information
    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "total",
        "created_at",
        "customer_id",
        "items.*",
        "items.variant.product.id",
      ],
    }).config({ name: "retrieve-orders" })

    // Step 3: Get all customers
    const { data: customers } = useQueryGraphStep({
      entity: "customer",
      fields: [
        "id",
        "email",
        "first_name",
        "last_name",
        "phone",
        "created_at",
      ],
    }).config({ name: "retrieve-customers" })

    // Step 4: Process the data to find vendor customers
    const processedData = transform({
      vendorAdmins,
      orders,
      customers,
    }, (data) => {
      if (!data.vendorAdmins.length) {
        throw new Error("Vendor admin not found")
      }

      const vendorAdmin = data.vendorAdmins[0]
      const vendorProductIds = vendorAdmin.vendor.products?.map((product) => product?.id).filter(Boolean) || []

      if (vendorProductIds.length === 0) {
        return { customers: [] }
      }

      // Filter orders to only include those with vendor products
      const customerOrderMap = new Map<string, Array<{
        id: string
        total: number
        created_at: string
      }>>()

      data.orders.forEach((order) => {
        const hasVendorProduct = order.items?.some((item) =>
          item && item.variant?.product?.id && vendorProductIds.includes(item.variant.product.id)
        )

        if (hasVendorProduct && order.customer_id) {
          if (!customerOrderMap.has(order.customer_id)) {
            customerOrderMap.set(order.customer_id, [])
          }

          customerOrderMap.get(order.customer_id)!.push({
            id: order.id,
            total: order.total || 0,
            created_at: order.created_at.toString(),
          })
        }
      })

      // Process customer data with order statistics
      const customerStats = data.customers
        .filter((customer) => customerOrderMap.has(customer.id))
        .map((customer) => {
          const customerOrders = customerOrderMap.get(customer.id) || []
          const totalOrders = customerOrders.length
          const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0)
          const lastOrderDate = customerOrders.length > 0
            ? customerOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
            : null

          return {
            id: customer.id,
            email: customer.email,
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone: customer.phone,
            total_orders: totalOrders,
            total_spent: totalSpent,
            last_order_date: lastOrderDate,
            status: totalOrders > 0 ? 'active' : 'inactive',
            created_at: customer.created_at,
          }
        })

      return { customers: customerStats }
    })

    return new WorkflowResponse({
      customers: processedData.customers,
    })
  }
)

export default getVendorCustomersWorkflow 