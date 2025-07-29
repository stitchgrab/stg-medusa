import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"

export const PostVendorLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
}).strict()

type RequestBody = z.infer<typeof PostVendorLoginSchema>

export const POST = async (
  req: MedusaRequest<RequestBody>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { email, password } = req.validatedBody

  console.log("Login attempt for email:", email)

  try {
    // Find vendor admin by email
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: ["id", "email", "first_name", "last_name", "vendor.id", "vendor.name", "vendor.handle"],
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

    // In a real implementation, you would verify the password here
    // For now, we'll accept any password for demonstration
    // TODO: Implement proper password verification

    // Create a session token (in a real implementation, use JWT)
    const sessionToken = `vendor_${vendorAdmin.id}_${Date.now()}`

    // Set session cookie
    res.cookie("vendor_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })

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
      message: "Login successful",
    })
  } catch (error) {
    console.error("Vendor login error:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
} 