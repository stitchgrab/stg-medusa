import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import createVendorWorkflow, {
  CreateVendorWorkflowInput,
} from "../workflows/marketplace/create-vendor"

export default async function seedVendor({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  // Get environment variables for customization
  const email = process.env.VENDOR_EMAIL || "vendor@stitchgrab.com"
  const firstName = process.env.VENDOR_FIRST_NAME || "Demo"
  const lastName = process.env.VENDOR_LAST_NAME || "Vendor"
  const vendorName = process.env.VENDOR_NAME || "StitchGrab Demo Vendor"
  const handle = process.env.VENDOR_HANDLE || `demo-vendor-${Date.now()}`

  logger.info("Seeding demo vendor account...")
  logger.info(`Email: ${email}`)
  logger.info(`Name: ${firstName} ${lastName}`)
  logger.info(`Vendor: ${vendorName}`)

  try {
    // Create a demo vendor without requiring an auth identity
    const { result } = await createVendorWorkflow(container).run({
      input: {
        name: vendorName,
        handle: handle,
        logo: "https://via.placeholder.com/150",
        admin: {
          email: email,
          first_name: firstName,
          last_name: lastName,
        },
      } as CreateVendorWorkflowInput,
    })

    logger.info("Demo vendor created successfully!")
    logger.info(`Vendor ID: ${result.vendor.id}`)
    logger.info("Login credentials:")
    logger.info(`Email: ${email}`)
    logger.info("Password: any password (for demo)")

  } catch (error) {
    logger.error("Error creating demo vendor:", error)
    throw error
  }
} 