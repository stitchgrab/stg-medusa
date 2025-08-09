import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import getVendorCustomersWorkflow from "../../../workflows/marketplace/get-vendor-customers"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../utils/cors"
import { validateVendorSession } from "../../../utils/vendor-auth"

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
  // Set CORS headers
  setVendorCorsHeaders(res)

  try {
    const payload = await validateVendorSession(req)
    const vendorAdminId = payload.vendor_admin_id

    // Use the workflow to get vendor customers
    const { result } = await getVendorCustomersWorkflow(req.scope).run({
      input: {
        vendor_admin_id: vendorAdminId,
      },
    })

    res.json({
      customers: result.customers,
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

    console.error("Vendor customers error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
} 