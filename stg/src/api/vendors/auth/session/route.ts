import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const sessionToken = req.cookies.get("vendor_session")?.value

    if (!sessionToken) {
      return res.status(401).json({
        message: "No session found",
        authenticated: false,
      })
    }

    // Parse the session token to get vendor admin ID
    // In a real implementation, you would verify a proper JWT token
    const tokenParts = sessionToken.split("_")
    if (tokenParts.length < 3 || tokenParts[0] !== "vendor") {
      return res.status(401).json({
        message: "Invalid session token",
        authenticated: false,
      })
    }

    const vendorAdminId = tokenParts[1]

    // Find vendor admin by ID
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: ["id", "email", "first_name", "last_name", "vendor.id", "vendor.name", "vendor.handle"],
      filters: {
        id: [vendorAdminId],
      },
    })

    if (!vendorAdmins.length) {
      return res.status(401).json({
        message: "Vendor admin not found",
        authenticated: false,
      })
    }

    const vendorAdmin = vendorAdmins[0]

    res.json({
      authenticated: true,
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
    })
  } catch (error) {
    console.error("Vendor session verification error:", error)
    res.status(500).json({
      message: "Internal server error",
      authenticated: false,
    })
  }
} 