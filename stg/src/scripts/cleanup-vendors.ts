import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function cleanupVendors({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Cleaning up existing vendors...")

  try {
    // Find all vendor admins
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: ["id", "email", "vendor.id", "vendor.name"],
    })

    if (vendorAdmins.length === 0) {
      logger.info("No existing vendors found.")
      return
    }

    logger.info(`Found ${vendorAdmins.length} existing vendor(s):`)
    vendorAdmins.forEach(admin => {
      logger.info(`- ${admin.email} (${admin.vendor.name})`)
    })

    // Delete vendor admins (this will cascade to vendors)
    for (const admin of vendorAdmins) {
      await query.graph({
        entity: "vendor_admin",
        action: "delete",
        filters: {
          id: [admin.id],
        },
      })
      logger.info(`Deleted vendor admin: ${admin.email}`)
    }

    logger.info("Vendor cleanup completed successfully!")

  } catch (error) {
    logger.error("Error cleaning up vendors:", error)
    throw error
  }
} 