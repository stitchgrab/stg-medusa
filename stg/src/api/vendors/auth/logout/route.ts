import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Clear the vendor session cookie
    res.cookies.set("vendor_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
    })

    res.json({
      message: "Logout successful",
    })
  } catch (error) {
    console.error("Vendor logout error:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
} 