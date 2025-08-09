import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../../utils/cors"
import createVendorWorkflow from "../../../../workflows/marketplace/create-vendor"
import { signVendorToken } from "../../../../utils/jwt"
import { validatePassword } from "../../../../utils/password"

export const PostVendorSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).refine(validatePassword, {
    message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
  }),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  vendor_name: z.string().min(1),
  vendor_handle: z.string().min(1).regex(/^[a-z0-9-]+$/, "Handle must contain only lowercase letters, numbers, and hyphens"),
  phone: z.string().optional(),
}).strict()

type RequestBody = z.infer<typeof PostVendorSignupSchema>

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
    const {
      email,
      password,
      first_name,
      last_name,
      vendor_name,
      vendor_handle,
      phone
    } = req.body as RequestBody

    console.log("Signup attempt for email:", email)

    if (!email || !password || !first_name || !last_name || !vendor_name || !vendor_handle) {
      return res.status(400).json({
        message: "All required fields must be provided",
      })
    }

    // Check if vendor admin already exists with this email
    const { data: existingVendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: ["id", "email"],
      filters: {
        email: [email],
      },
    })

    if (existingVendorAdmins.length > 0) {
      console.log("Vendor admin already exists for email:", email)
      return res.status(409).json({
        message: "A vendor account with this email already exists",
      })
    }

    // Check if vendor handle already exists
    const { data: existingVendors } = await query.graph({
      entity: "vendor",
      fields: ["id", "handle"],
      filters: {
        handle: [vendor_handle],
      },
    })

    if (existingVendors.length > 0) {
      console.log("Vendor handle already exists:", vendor_handle)
      return res.status(409).json({
        message: "A vendor with this handle already exists",
      })
    }

    // Use the create vendor workflow
    const { result } = await createVendorWorkflow(req.scope).run({
      input: {
        name: vendor_name,
        handle: vendor_handle,
        admin: {
          email,
          password,
          first_name,
          last_name,
          phone,
        },
      },
    })

    const vendor = result.vendor
    const vendorAdmin = vendor.admins?.[0]

    if (!vendorAdmin) {
      console.log("Failed to create vendor admin")
      return res.status(500).json({
        message: "Failed to create vendor admin",
      })
    }

    // Generate JWT token for vendor authentication
    const jwtToken = signVendorToken({
      vendor_admin_id: vendorAdmin.id,
      vendor_id: vendor.id,
      email: vendorAdmin.email,
      type: 'vendor',
    })

    // Set session cookie with JWT token
    res.cookie("vendor_session", jwtToken, {
      httpOnly: true, // Secure - prevent XSS attacks
      secure: true, // Required for HTTPS (ngrok)
      sameSite: "none", // Allow cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/", // Set for all paths
    })

    res.status(201).json({
      vendor_admin: {
        id: vendorAdmin.id,
        email: vendorAdmin.email,
        first_name: vendorAdmin.first_name,
        last_name: vendorAdmin.last_name,
      },
      vendor: {
        id: vendor.id,
        name: vendor.name,
        handle: vendor.handle,
      },
      message: "Vendor account created successfully",
    })
  } catch (error) {
    console.error("Vendor signup error:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
} 