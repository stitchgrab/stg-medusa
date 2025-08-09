import { MedusaRequest } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { extractVendorToken, verifyVendorToken } from "./jwt"

export const getVendorContext = (req: MedusaRequest) => {
  return req.vendor_context
}

export const requireVendorAuth = async (req: MedusaRequest) => {
  // Validate the vendor session if available
  const vendorSession = await validateVendorSession(req)

  if (vendorSession) {
    return {
      vendor_admin_id: vendorSession.vendor_admin_id,
      vendor_id: vendorSession.vendor_id,
      email: vendorSession.email,
    }
  }

  const context = getVendorContext(req)
  if (!context) {
    throw new Error("Vendor authentication required")
  }
  return context
}

export const getCurrentVendorAdmin = async (req: MedusaRequest) => {
  const context = await requireVendorAuth(req)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: vendorAdmins } = await query.graph({
    entity: "vendor_admin",
    fields: ["id", "email", "first_name", "last_name", "vendor.id", "vendor.name", "vendor.handle"],
    filters: {
      id: [context.vendor_admin_id],
    },
  })

  if (!vendorAdmins.length) {
    throw new Error("Vendor admin not found")
  }

  return vendorAdmins[0]
}

export const getCurrentVendor = async (req: MedusaRequest) => {
  const context = await requireVendorAuth(req)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: vendors } = await query.graph({
    entity: "vendor",
    fields: ["id", "name", "handle", "logo", "phone"],
    filters: {
      id: [context.vendor_id],
    },
  })

  if (!vendors.length) {
    throw new Error("Vendor not found")
  }

  return vendors[0]
}

export const validateVendorSession = async (req: MedusaRequest) => {
  // Get token from cookie or Authorization header (try multiple cookie names)
  const token = req.cookies?.vendor_session || req.cookies?.vendor_token || extractVendorToken(req.headers.authorization)

  if (!token) {
    console.log("🔍 No token found in cookies or Authorization header")
    throw new Error("No session found")
  }

  // Verify JWT token
  const payload = verifyVendorToken(token)
  if (!payload) {
    throw new Error("Invalid or expired session")
  }
  return payload
}