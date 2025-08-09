import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function debugVendors({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Checking existing vendor admins...")

  try {
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: ["id", "email", "first_name", "last_name", "vendor.id", "vendor.name"],
    })

    if (vendorAdmins.length === 0) {
      logger.info("No vendor admins found in database.")
      return
    }

    logger.info(`Found ${vendorAdmins.length} vendor admin(s):`)
    vendorAdmins.forEach((admin, index) => {
      logger.info(`${index + 1}. Email: ${admin.email}`)
      logger.info(`   Name: ${admin.first_name} ${admin.last_name}`)
      logger.info(`   Vendor: ${admin.vendor.name} (ID: ${admin.vendor.id})`)
      logger.info(`   Admin ID: ${admin.id}`)
      logger.info("")
    })

  } catch (error) {
    logger.error("Error checking vendor admins:", error)
    throw error
  }
} 