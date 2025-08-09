import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { verifyVendorToken, extractVendorToken } from "../../utils/jwt"

export const vendorAuthMiddleware = async (
  req: MedusaRequest,
  res: MedusaResponse,
  next: () => void
) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.vendor_session || extractVendorToken(req.headers.authorization)

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      })
    }

    // Verify JWT token
    const payload = verifyVendorToken(token)
    if (!payload) {
      return res.status(401).json({
        message: "Invalid or expired token",
      })
    }

    // Add vendor context to request
    req.vendor_context = {
      vendor_admin_id: payload.vendor_admin_id,
      vendor_id: payload.vendor_id,
      email: payload.email,
    }

    next()
  } catch (error) {
    console.error("Vendor auth middleware error:", error)
    return res.status(401).json({
      message: "Authentication failed",
    })
  }
}

// Extend MedusaRequest type to include vendor context
declare module "@medusajs/framework/http" {
  interface MedusaRequest {
    vendor_context?: {
      vendor_admin_id: string
      vendor_id: string
      email: string
    }
  }
} 