import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  setAuthAppMetadataStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import createVendorAdminStep from "./steps/create-vendor-admin"
import createVendorStep from "./steps/create-vendor"
import { hashPassword } from "../../../utils/password"

export type CreateVendorWorkflowInput = {
  name: string
  handle?: string
  logo?: string
  admin: {
    email: string
    password: string
    first_name?: string
    last_name?: string
    phone?: string
  }
  authIdentityId?: string
}

const createVendorWorkflow = createWorkflow(
  "create-vendor",
  function (input: CreateVendorWorkflowInput) {
    const vendor = createVendorStep({
      name: input.name,
      handle: input.handle,
      logo: input.logo,
    })

    const vendorAdminData = transform({
      input,
      vendor,
    }, async (data) => {
      const passwordHash = await hashPassword(data.input.admin.password)

      return {
        email: data.input.admin.email,
        first_name: data.input.admin.first_name,
        last_name: data.input.admin.last_name,
        password_hash: passwordHash,
        vendor_id: data.vendor.id,
        phone: data.input.admin.phone,
      }
    })

    const vendorAdmin = createVendorAdminStep(
      vendorAdminData
    )

    // Only set auth app metadata if authIdentityId is provided and not empty
    if (input.authIdentityId && typeof input.authIdentityId === "string" && input.authIdentityId.trim() !== "") {
      setAuthAppMetadataStep({
        authIdentityId: input.authIdentityId,
        actorType: "vendor",
        value: vendorAdmin.id,
      })
    }
    // @ts-ignore
    const { data: vendorWithAdmin } = useQueryGraphStep({
      entity: "vendor",
      fields: ["id", "name", "handle", "logo", "admins.*"],
      filters: {
        id: vendor.id,
      },
    })

    return new WorkflowResponse({
      vendor: vendorWithAdmin[0],
    })
  }
)

export default createVendorWorkflow