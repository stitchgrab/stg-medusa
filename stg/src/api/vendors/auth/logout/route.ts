import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  return res.status(200).end()
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  try {
    // Clear the vendor session cookie
    res.cookie("vendor_session", "", {
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