import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"

type WorkflowInput = {
  vendor_admin_id: string
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
}

type WorkflowOutput = {
  vendor_admin: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    created_at: string
    updated_at: string
  }
  vendor: {
    id: string
    name: string
    handle: string
    logo?: string
    businessHours?: any
    specialHours?: any
    address?: any
    social_links?: any
    phone?: string
  }
}

const updateVendorProfileWorkflow = createWorkflow(
  "update-vendor-profile",
  (input: WorkflowInput) => {
    // Get current vendor admin and vendor data
    const { data: vendorAdmins } = useQueryGraphStep({
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
        id: [input.vendor_admin_id],
      },
    }).config({ name: "retrieve-vendor-admin" })

    if (!vendorAdmins.length) {
      throw new Error("Vendor admin not found")
    }

    const vendorAdmin = vendorAdmins[0]

    // Update vendor admin if data provided
    if (input.vendor_admin) {
      const updatedVendorAdmin = transform({
        vendorAdmin,
        updates: input.vendor_admin,
      }, (data) => ({
        id: data.vendorAdmin.id,
        first_name: data.updates.first_name ?? data.vendorAdmin.first_name,
        last_name: data.updates.last_name ?? data.vendorAdmin.last_name,
        email: data.updates.email ?? data.vendorAdmin.email,
        phone: data.updates.phone ?? data.vendorAdmin.phone,
      }))

      // Use the selector pattern for update
      useQueryGraphStep({
        entity: "vendor_admin",
        selector: { id: vendorAdmin.id },
        update: updatedVendorAdmin,
      }).config({ name: "update-vendor-admin" })
    }

    // Update vendor if data provided
    if (input.vendor) {
      const updatedVendor = transform({
        vendor: vendorAdmin.vendor,
        updates: input.vendor,
      }, (data) => ({
        id: data.vendor.id,
        name: data.updates.name ?? data.vendor.name,
        handle: data.updates.handle ?? data.vendor.handle,
        logo: data.updates.logo ?? data.vendor.logo,
        phone: data.updates.phone ?? data.vendor.phone,
        businessHours: data.updates.businessHours ?? data.vendor.businessHours,
        specialHours: data.updates.specialHours ?? data.vendor.specialHours,
        address: data.updates.address ?? data.vendor.address,
        social_links: data.updates.social_links ?? data.vendor.social_links,
      }))

      // Use the selector pattern for update
      useQueryGraphStep({
        entity: "vendor",
        selector: { id: vendorAdmin.vendor.id },
        update: updatedVendor,
      }).config({ name: "update-vendor" })
    }

    // Get updated data
    const { data: updatedVendorAdmins } = useQueryGraphStep({
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
        id: [input.vendor_admin_id],
      },
    }).config({ name: "retrieve-updated-vendor-admin" })

    const updatedVendorAdmin = updatedVendorAdmins[0]

    return new WorkflowResponse({
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
  }
)

export default updateVendorProfileWorkflow 