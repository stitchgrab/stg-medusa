import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../../utils/cors"
import { validateVendorSession } from "../../../../utils/vendor-auth"

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

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const payload = await validateVendorSession(req)

    // Get vendor admin with vendor information
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: [
        "id",
        "first_name",
        "last_name",
        "email",
        "phone",
        "created_at",
        "updated_at",
        "vendor.id",
        "vendor.name",
        "vendor.handle",
        "vendor.logo",
        "vendor.businessHours",
        "vendor.specialHours",
        "vendor.address",
        "vendor.social_links",
        "vendor.phone",
      ],
      filters: {
        id: [payload.vendor_admin_id],
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
        first_name: vendorAdmin.first_name,
        last_name: vendorAdmin.last_name,
        email: vendorAdmin.email,
        phone: vendorAdmin.phone,
        created_at: vendorAdmin.created_at,
        updated_at: vendorAdmin.updated_at,
      },
      vendor: {
        id: vendorAdmin.vendor.id,
        name: vendorAdmin.vendor.name,
        handle: vendorAdmin.vendor.handle,
        logo: vendorAdmin.vendor.logo,
        businessHours: vendorAdmin.vendor.businessHours,
        specialHours: vendorAdmin.vendor.specialHours,
        address: vendorAdmin.vendor.address,
        social_links: vendorAdmin.vendor.social_links,
        phone: vendorAdmin.vendor.phone,
      },
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

    console.error("Vendor session verification error:", error)
    return res.status(401).json({
      message: "Session verification failed",
      authenticated: false,
    }) 
  }
} 