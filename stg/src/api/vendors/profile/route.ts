import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../modules/marketplace"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../utils/cors"
import { getCurrentVendor, getCurrentVendorAdmin } from "../../../utils/vendor-auth"

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
  setVendorCorsHeaders(res)

  try {
    // Get current vendor admin using JWT authentication
    const vendorAdmin = await getCurrentVendorAdmin(req)
    const vendor = await getCurrentVendor(req)

    res.json({
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
        id: vendor.id,
        name: vendor.name,
        handle: vendor.handle,
        logo: vendor.logo,
        businessHours: vendorAdmin.vendor.businessHours,
        specialHours: vendorAdmin.vendor.specialHours,
        address: vendorAdmin.vendor.address,
        social_links: vendorAdmin.vendor.social_links,
        phone: vendor.phone,
      },
    })
  } catch (error) {
    console.error("Vendor profile error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const PUT = async (
  req: MedusaRequest<{
    vendor_admin?: {
      first_name?: string
      last_name?: string
      email?: string
      phone?: string
    }
    vendor?: {
      name?: string
      handle?: string
      logo?: string
      phone?: string
      businessHours?: any
      specialHours?: any
      address?: any
      social_links?: any
    }
  }>,
  res: MedusaResponse
) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const marketplaceModuleService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)

  try {
    // Access cookies from the request
    const sessionVendor = await getCurrentVendorAdmin(req)
    const vendorAdminId = sessionVendor.id
    const { vendor_admin, vendor } = req.body

    console.log('Updating vendor profile:', { vendorAdminId, vendor_admin, vendor })

    // Get current vendor admin to find vendor ID
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: ["id", "vendor.id"],
      filters: {
        id: [vendorAdminId],
      },
    })

    if (!vendorAdmins.length) {
      return res.status(404).json({
        message: "Vendor admin not found",
      })
    }

    const vendorId = vendorAdmins[0].vendor.id

    // Update vendor admin if data provided
    if (vendor_admin) {
      console.log('Updating vendor admin with:', vendor_admin)
      try {
        await marketplaceModuleService.updateVendorAdmins([{
          id: vendorAdminId,
          ...vendor_admin,
        }])
        console.log('Vendor admin updated successfully')
      } catch (error) {
        console.error('Vendor admin update error:', error)
      }
    }

    // Update vendor if data provided
    if (vendor) {
      console.log('Updating vendor with:', vendor)
      try {
        await marketplaceModuleService.updateVendors([{
          id: vendorId,
          ...vendor,
        }])
        console.log('Vendor updated successfully')
      } catch (error) {
        console.error('Vendor update error:', error)
      }
    }

    // Get updated information
    const { data: updatedVendorAdmins } = await query.graph({
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
        id: [vendorAdminId],
      },
    })

    if (!updatedVendorAdmins.length) {
      return res.status(404).json({
        message: "Vendor admin not found",
      })
    }

    const updatedVendorAdmin = updatedVendorAdmins[0]

    res.json({
      vendor_admin: {
        id: updatedVendorAdmin.id,
        first_name: updatedVendorAdmin.first_name,
        last_name: updatedVendorAdmin.last_name,
        email: updatedVendorAdmin.email,
        phone: updatedVendorAdmin.phone,
        created_at: updatedVendorAdmin.created_at,
        updated_at: updatedVendorAdmin.updated_at,
      },
      vendor: {
        id: updatedVendorAdmin.vendor.id,
        name: updatedVendorAdmin.vendor.name,
        handle: updatedVendorAdmin.vendor.handle,
        logo: updatedVendorAdmin.vendor.logo,
        businessHours: updatedVendorAdmin.vendor.businessHours,
        specialHours: updatedVendorAdmin.vendor.specialHours,
        address: updatedVendorAdmin.vendor.address,
        social_links: updatedVendorAdmin.vendor.social_links,
        phone: updatedVendorAdmin.vendor.phone,
      },
    })
  } catch (error) {
    console.error("Vendor profile update error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
} 