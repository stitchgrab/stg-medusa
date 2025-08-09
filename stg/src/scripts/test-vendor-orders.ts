/**
 * Test script to verify vendor orders functionality
 * Run with: npx medusa exec ./src/scripts/test-vendor-orders.ts
 */

import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function testVendorOrders({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    console.log("🔍 Testing vendor orders functionality...")

    // 1. Get all vendors
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: ["id", "name"],
    })

    console.log(`📋 Found ${vendors.length} vendors:`)
    vendors.forEach(vendor => {
      console.log(`  - ${vendor.name} (${vendor.id})`)
    })

    if (vendors.length === 0) {
      console.log("❌ No vendors found. Create some vendors first.")
      return
    }

    // 2. Get all products
    const { data: allProducts } = await query.graph({
      entity: "product",
      fields: ["id", "title", "vendor_id"],
    })

    console.log(`\n📦 Found ${allProducts.length} products:`)
    allProducts.forEach(product => {
      console.log(`  - ${product.title} (${product.id}) - Vendor: ${(product as any).vendor_id || 'No vendor'}`)
    })

    // 3. Check products for each vendor
    for (const vendor of vendors) {
      const vendorProducts = allProducts.filter(product =>
        (product as any).vendor_id === vendor.id
      )

      console.log(`\n🏪 Vendor "${vendor.name}" has ${vendorProducts.length} products:`)
      vendorProducts.forEach(product => {
        console.log(`  - ${product.title} (${product.id})`)
      })

      if (vendorProducts.length > 0) {
        const productIds = vendorProducts.map(p => p.id)

        // 4. Find orders with vendor products
        const { data: allOrders } = await query.graph({
          entity: "order",
          fields: [
            "id",
            "display_id",
            "status",
            "total",
            "items.id",
            "items.product_id",
            "items.title",
            "items.quantity"
          ],
          filters: {},
        })

        const ordersWithVendorItems = allOrders.filter(order => {
          const hasVendorItems = (order.items || []).some(item =>
            item && item.product_id && productIds.includes(item.product_id)
          )
          return hasVendorItems
        })

        console.log(`📝 Found ${ordersWithVendorItems.length} orders with vendor "${vendor.name}" products:`)
        ordersWithVendorItems.forEach(order => {
          const vendorItems = (order.items || []).filter(item =>
            item && item.product_id && productIds.includes(item.product_id)
          )
          console.log(`  - Order ${(order as any).display_id || order.id.slice(-8)} (${vendorItems.length} vendor items)`)
        })
      }
    }

    console.log("\n✅ Vendor orders test completed!")

  } catch (error) {
    console.error("❌ Error testing vendor orders:", error)
  }
}
