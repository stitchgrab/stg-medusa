import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../../utils/cors"
import { signVendorToken } from "../../../../utils/jwt"
import { verifyPassword } from "../../../../utils/password"

export const PostVendorLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
}).strict()

type RequestBody = z.infer<typeof PostVendorLoginSchema>

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  return setVendorCorsHeadersOptions(res)
}

export const POST = async (
  req: MedusaRequest<RequestBody>,
  res: MedusaResponse
) => {
  // Set CORS headers for all requests
  setVendorCorsHeaders(res)

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Access the request body from the validated body
    const { email, password } = req.body as RequestBody

    console.log("Login attempt for email:", email)

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      })
    }

    // Find vendor admin by email
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: ["id", "email", "first_name", "last_name", "password_hash", "vendor.id", "vendor.name", "vendor.handle"],
      filters: {
        email: [email],
      },
    })

    console.log("Found vendor admins:", vendorAdmins.length)
    console.log("Vendor admins:", vendorAdmins)

    if (!vendorAdmins.length) {
      console.log("No vendor admin found for email:", email)
      return res.status(401).json({
        message: "Invalid credentials",
      })
    }

    const vendorAdmin = vendorAdmins[0]

    // Verify password
    if (!vendorAdmin.password_hash) {
      console.log("No password hash found for vendor admin:", vendorAdmin.id)
      return res.status(401).json({
        message: "Invalid credentials",
      })
    }

    const isPasswordValid = await verifyPassword(password, vendorAdmin.password_hash)
    if (!isPasswordValid) {
      console.log("Invalid password for vendor admin:", vendorAdmin.id)
      return res.status(401).json({
        message: "Invalid credentials",
      })
    }

    // Generate JWT token for vendor authentication
    const jwtToken = signVendorToken({
      vendor_admin_id: vendorAdmin.id,
      vendor_id: vendorAdmin.vendor.id,
      email: vendorAdmin.email,
      type: 'vendor',
    })

    // Set session cookie with JWT token (httpOnly for security)
    res.cookie("vendor_session", jwtToken, {
      httpOnly: true, // Secure - prevent XSS attacks
      secure: true, // Required for HTTPS (ngrok)
      sameSite: "none", // Back to none for cross-origin
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/", // Set for all paths
    })

    // Also set a non-httpOnly token for JavaScript access (fallback)
    res.cookie("vendor_token", jwtToken, {
      httpOnly: false, // Allow JavaScript access
      secure: true, // Required for HTTPS (ngrok)
      sameSite: "none", // Allow cross-origin
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/", // Set for all paths
    })

    console.log("🔍 Set both vendor_session (httpOnly) and vendor_token (JS accessible) cookies")

    res.json({
      vendor_admin: {
        id: vendorAdmin.id,
        email: vendorAdmin.email,
        first_name: vendorAdmin.first_name,
        last_name: vendorAdmin.last_name,
      },
      vendor: {
        id: vendorAdmin.vendor.id,
        name: vendorAdmin.vendor.name,
        handle: vendorAdmin.vendor.handle,
      },
      token: jwtToken, // Include token for Authorization header fallback
      message: "Login successful",
    })
  } catch (error) {
    console.error("Vendor login error:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
} 