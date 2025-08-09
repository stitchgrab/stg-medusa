import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../modules/marketplace"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
import { createVendorAvailabilityChecker } from "../../../utils/vendor-availability"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../utils/cors"
import { getCurrentVendor, validateVendorSession } from "../../../utils/vendor-auth"

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
        id: [payload.vendor_admin_id],
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
  setVendorCorsHeaders(res)

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const marketplaceModuleService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)

  try {
    // Access cookies from the request
    const payload = await validateVendorSession(req)
    const { businessHours, specialHours } = req.body

    console.log('Updating vendor availability:', { vendorAdminId: payload.vendor_admin_id, businessHours, specialHours })
    const vendor = await getCurrentVendor(req)
    const vendorId = vendor.id
    const vendorAdminId = payload.vendor_admin_id

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

    // Helper function to get vendor products
    const getVendorProducts = async () => {
      const { data: productVendorLinks } = await query.graph({
        entity: "product_vendor",
        fields: ["id", "vendor_id"],
        filters: {
          vendor_id: [vendorId],
        },
      })

      if (!productVendorLinks.length) return []

      const productIds = productVendorLinks.map((link: any) => link.id)
      const { data: vendorProducts } = await query.graph({
        entity: "product",
        fields: ["id", "title", "handle", "status", "thumbnail", "created_at", "updated_at"],
        filters: {
          id: productIds,
        },
      })

      return vendorProducts
    }

    // Helper function to update products status
    const updateProductStatus = async (products: any[], newStatus: "draft" | "published", action: string) => {
      if (products.length === 0) return

      const updateProducts = await updateProductsWorkflow(req.scope)
      await updateProducts.run({
        input: {
          products: products.map((product) => ({
            id: product.id,
            status: newStatus,
          })),
        },
      })
      console.log(`✅ ${action} ${products.length} products for vendor ${updatedVendor.name}`)
    }

    // Get vendor products
    const vendorProducts = await getVendorProducts()
    if (vendorProducts.length === 0) return

    // Create availability checker
    const availabilityChecker = createVendorAvailabilityChecker(
      updatedVendor.businessHours || {},
      updatedVendor.specialHours || {}
    )

    const shouldHideProducts = availabilityChecker.shouldHideProducts()
    const activeEvent = availabilityChecker.getActiveSpecialEvent(new Date())

    try {
      // Determine products to hide or resume
      let productsToHide: any[] = []
      let productsToResume: any[] = []

      if (shouldHideProducts) {
        // Hide all products when special events require it
        productsToHide = vendorProducts
      } else {
        // Resume products if:
        // 1. Auto-resume is enabled for active event, OR
        // 2. No active special event exists
        if (activeEvent && activeEvent.autoResume) {
          productsToResume = vendorProducts.filter((p: any) => p.status === "draft")
        } else if (!activeEvent) {
          productsToResume = vendorProducts.filter((p: any) => p.status === "draft")
        }
      }

      // Update products
      await updateProductStatus(productsToHide, "draft", "Hidden")
      await updateProductStatus(productsToResume, "published", "Resumed")

    } catch (error) {
      console.error("Failed to update products", error)
      return res.status(500).json({
        message: "Failed to update products",
      })
    }

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

    console.error("Vendor availability update error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
} 