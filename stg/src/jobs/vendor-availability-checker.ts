import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
import { createVendorAvailabilityChecker } from "../utils/vendor-availability"

export default async function vendorAvailabilityJob(container: MedusaContainer) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve("logger")

  try {
    logger.info("🔄 Starting vendor availability check job")

    // Get all vendors with their availability settings
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: [
        "id",
        "name",
        "businessHours",
        "specialHours"
      ]
    })

    let processedVendors = 0
    let productsResumed = 0

    for (const vendor of vendors) {
      try {
        const availabilityChecker = createVendorAvailabilityChecker(
          vendor.businessHours || {},
          vendor.specialHours || {}
        )

        // Check if products should be hidden
        const shouldHideProducts = availabilityChecker.shouldHideProducts()

        // Get vendor's products
        const { data: productVendors } = await query.graph({
          entity: "product_vendor",
          fields: ["product.id", "product.status"],
          filters: {
            vendor_id: [vendor.id]
          }
        })

        if (!productVendors.length) {
          continue
        }

        const products = productVendors.map(pv => pv.product).filter(Boolean)
        const hiddenProducts = products.filter(p => p?.status === "draft")
        const visibleProducts = products.filter(p => p?.status === "published")

        // Logic for auto-resume and holiday expiration
        let shouldResumeProducts = false
        let shouldHideProductsNow = false

        // Check if we need to resume products (autoResume or holiday ended)
        if (hiddenProducts.length > 0) {
          const currentStatus = availabilityChecker.checkCurrentStatus()

          // Resume if autoResume is true and we're in a vacation/temporary closure
          if (currentStatus.productsHidden) {
            const activeEvent = availabilityChecker.getActiveSpecialEvent(new Date())
            if (activeEvent && activeEvent.autoResume) {
              shouldResumeProducts = true
            }
          } else {
            // No active special event - resume products
            shouldResumeProducts = true
          }
        }

        // Check if we need to hide products
        if (visibleProducts.length > 0 && shouldHideProducts) {
          shouldHideProductsNow = true
        }

        // Update products if needed
        if (shouldResumeProducts || shouldHideProductsNow) {
          const updateWorkflow = updateProductsWorkflow(container)

          const productsToUpdate = shouldResumeProducts
            ? hiddenProducts
            : visibleProducts

          const newStatus = shouldResumeProducts ? "published" : "draft"

          await updateWorkflow.run({
            input: {
              products: productsToUpdate.map(product => ({
                id: product?.id || "",
                status: newStatus
              }))
            }
          })

          productsResumed += shouldResumeProducts ? productsToUpdate.length : 0

          logger.info(`✅ Vendor ${vendor.name}: ${shouldResumeProducts ? 'Resumed' : 'Hidden'} ${productsToUpdate.length} products`)
        }

        processedVendors++
      } catch (error) {
        logger.error(`❌ Error processing vendor ${vendor.name}:`, error)
      }
    }

    logger.info(`✅ Vendor availability check completed: ${processedVendors} vendors processed, ${productsResumed} products resumed`)
  } catch (error) {
    logger.error("❌ Vendor availability check job failed:", error)
    throw error
  }
}

export const config = {
  name: "vendor-availability-checker",
  schedule: "0 */6 * * *",
} 