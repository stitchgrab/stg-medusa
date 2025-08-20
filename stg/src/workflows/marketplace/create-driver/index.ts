import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  setAuthAppMetadataStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import createDriverStep from "./steps/create-driver"
import { hashPassword } from "../../../utils/password"

export type CreateDriverWorkflowInput = {
  name: string
  avatar?: string
  vehicle_info?: any
  license_number?: string
  handle?: string
  phone?: string
  email: string
  password: string
  first_name?: string
  last_name?: string
  address?: any
  authIdentityId?: string
}

const createDriverWorkflow = createWorkflow(
  "create-driver",
  function (input: CreateDriverWorkflowInput) {
    const processedDriverData = transform({
      input,
    }, async (data) => {
      const passwordHash = await hashPassword(data.input.password)

      return {
        name: data.input.name,
        avatar: data.input.avatar,
        vehicle_info: data.input.vehicle_info,
        license_number: data.input.license_number,
        handle: data.input.handle,
        phone: data.input.phone,
        email: data.input.email,
        password_hash: passwordHash,
        first_name: data.input.first_name,
        last_name: data.input.last_name,
        address: data.input.address,
        status: "pending",
      }
    })

    const driver = createDriverStep(processedDriverData)

    // Only set auth app metadata if authIdentityId is provided and not empty
    if (input.authIdentityId && typeof input.authIdentityId === "string" && input.authIdentityId.trim() !== "") {
      setAuthAppMetadataStep({
        authIdentityId: input.authIdentityId,
        actorType: "driver",
        value: driver.id,
      })
    }

    // Get the complete driver data
    const { data: driverWithDetails } = useQueryGraphStep({
      entity: "driver",
      fields: ["id", "name", "handle", "vehicle_info", "license_number", "phone", "email", "first_name", "last_name", "address", "status"],
      filters: {
        id: driver.id,
      },
    })

    return new WorkflowResponse({
      driver: driverWithDetails[0],
    })
  }
)

export default createDriverWorkflow
