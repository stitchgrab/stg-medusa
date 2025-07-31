import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../modules/marketplace"

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")
  return res.status(200).end()
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Access cookies from the request
    const sessionToken = req.cookies?.vendor_session

    if (!sessionToken) {
      return res.status(401).json({
        message: "No session found",
        authenticated: false,
      })
    }

    // Parse the session token to get vendor admin ID
    const tokenParts = sessionToken.split("_")
    if (tokenParts.length < 3 || tokenParts[0] !== "vendor") {
      return res.status(401).json({
        message: "Invalid session token",
        authenticated: false,
      })
    }

    const vendorAdminId = tokenParts[1]

    // Get vendor with availability information
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: [
        "vendor.id",
        "vendor.name",
        "vendor.businessHours",
        "vendor.specialHours",
      ],
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

    const vendor = vendorAdmins[0].vendor

    res.json({
      businessHours: vendor.businessHours || {
        monday: { open: "09:00", close: "17:00", closed: false },
        tuesday: { open: "09:00", close: "17:00", closed: false },
        wednesday: { open: "09:00", close: "17:00", closed: false },
        thursday: { open: "09:00", close: "17:00", closed: false },
        friday: { open: "09:00", close: "17:00", closed: false },
        saturday: { open: "10:00", close: "15:00", closed: false },
        sunday: { open: "", close: "", closed: true },
      },
      specialHours: vendor.specialHours || {
        holidays: [],
        vacations: [],
        specialEvents: [],
        temporaryClosures: [],
      },
    })
  } catch (error) {
    console.error("Vendor availability error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const PUT = async (
  req: MedusaRequest<{
    businessHours?: {
      monday?: { open: string; close: string; closed: boolean }
      tuesday?: { open: string; close: string; closed: boolean }
      wednesday?: { open: string; close: string; closed: boolean }
      thursday?: { open: string; close: string; closed: boolean }
      friday?: { open: string; close: string; closed: boolean }
      saturday?: { open: string; close: string; closed: boolean }
      sunday?: { open: string; close: string; closed: boolean }
    }
    specialHours?: {
      holidays?: Array<{
        id: string
        name: string
        date: string
        message?: string
        productsHidden: boolean
      }>
      vacations?: Array<{
        id: string
        name: string
        startDate: string
        endDate: string
        message?: string
        productsHidden: boolean
        autoResume: boolean
      }>
      specialEvents?: Array<{
        id: string
        name: string
        startDate: string
        endDate: string
        message?: string
        productsHidden: boolean
        showBanner: boolean
      }>
      temporaryClosures?: Array<{
        id: string
        reason: string
        startDate: string
        endDate: string
        message?: string
        productsHidden: boolean
        autoResume: boolean
        type: 'closed'
        hours?: {
          monday?: { open: string; close: string; closed: boolean }
          tuesday?: { open: string; close: string; closed: boolean }
          wednesday?: { open: string; close: string; closed: boolean }
          thursday?: { open: string; close: string; closed: boolean }
          friday?: { open: string; close: string; closed: boolean }
          saturday?: { open: string; close: string; closed: boolean }
          sunday?: { open: string; close: string; closed: boolean }
        }
      }>
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
    const sessionToken = req.cookies?.vendor_session

    if (!sessionToken) {
      return res.status(401).json({
        message: "No session found",
        authenticated: false,
      })
    }

    // Parse the session token to get vendor admin ID
    const tokenParts = sessionToken.split("_")
    if (tokenParts.length < 3 || tokenParts[0] !== "vendor") {
      return res.status(401).json({
        message: "Invalid session token",
        authenticated: false,
      })
    }

    const vendorAdminId = tokenParts[1]
    const { businessHours, specialHours } = req.body

    console.log('Updating vendor availability:', { vendorAdminId, businessHours, specialHours })

    // Get current vendor to find vendor ID
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: ["vendor.id"],
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

    // Prepare update data
    const updateData: any = {}

    if (businessHours !== undefined) {
      updateData.businessHours = businessHours
    }

    if (specialHours !== undefined) {
      updateData.specialHours = specialHours
    }

    // Update vendor availability
    if (Object.keys(updateData).length > 0) {
      console.log('Updating vendor availability with:', updateData)
      try {
        await marketplaceModuleService.updateVendors([{
          id: vendorId,
          ...updateData,
        }])
        console.log('Vendor availability updated successfully')
      } catch (error) {
        console.error('Vendor availability update error:', error)
        return res.status(500).json({
          message: "Failed to update availability",
          error: error.message,
        })
      }
    }

    // Get updated information
    const { data: updatedVendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: [
        "vendor.id",
        "vendor.name",
        "vendor.businessHours",
        "vendor.specialHours",
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

    const updatedVendor = updatedVendorAdmins[0].vendor

    res.json({
      businessHours: updatedVendor.businessHours || {
        monday: { open: "09:00", close: "17:00", closed: false },
        tuesday: { open: "09:00", close: "17:00", closed: false },
        wednesday: { open: "09:00", close: "17:00", closed: false },
        thursday: { open: "09:00", close: "17:00", closed: false },
        friday: { open: "09:00", close: "17:00", closed: false },
        saturday: { open: "10:00", close: "15:00", closed: false },
        sunday: { open: "", close: "", closed: true },
      },
      specialHours: updatedVendor.specialHours || {
        holidays: [],
        vacations: [],
        specialEvents: [],
        temporaryClosures: [],
      },
    })
  } catch (error) {
    console.error("Vendor availability update error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
} 