import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../../utils/cors"

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  return setVendorCorsHeadersOptions(res)
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Set CORS headers for all requests
  setVendorCorsHeaders(res)

  try {
    // Clear the vendor session cookie
    res.cookie("vendor_session", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 0, // Expire immediately
      path: "/",
    })

    res.json({
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Vendor logout error:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
} 