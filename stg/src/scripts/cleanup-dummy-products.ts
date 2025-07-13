import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"

export default async function cleanupDummyProducts({
  container,
}: ExecArgs) {
  const logger = container.resolve(
    ContainerRegistrationKeys.LOGGER
  )
  const query = container.resolve(
    ContainerRegistrationKeys.QUERY
  )
  const productModuleService = container.resolve(Modules.PRODUCT)
  const inventoryModuleService = container.resolve(Modules.INVENTORY)

  logger.info("Starting cleanup of dummy products...")

  // Get all products first
  const { data: allProducts } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle"],
  })

  // Filter products that match our dummy product pattern (title contains underscore)
  const dummyProducts = allProducts.filter(product =>
    product.title && product.title.includes("_")
  )

  if (dummyProducts.length === 0) {
    logger.info("No dummy products found to clean up.")
    return
  }

  logger.info(`Found ${dummyProducts.length} dummy products to remove.`)

  // Delete products using the module service (this will cascade delete variants and inventory items)
  for (const product of dummyProducts) {
    try {
      await productModuleService.deleteProducts([product.id])
      logger.info(`Deleted product: ${product.title}`)
    } catch (error) {
      logger.error(`Failed to delete product ${product.title}:`, error)
    }
  }

  logger.info("Cleanup completed successfully!")
} 