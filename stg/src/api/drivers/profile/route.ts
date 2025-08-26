import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { setDriverCorsHeaders, setDriverCorsHeadersOptions } from "../../../utils/cors"
import { getCurrentDriver } from "../../../utils/driver-auth"
import { updateDriverWorkflow } from "../../../workflows/marketplace/update-driver"
import { UpdateDriverStepInput } from "../../../workflows/marketplace/update-driver/steps/update-driver"

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  return setDriverCorsHeadersOptions(res)
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  setDriverCorsHeaders(res)

  try {
    const driver = await getCurrentDriver(req)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Get driver details with all fields
    const { data: drivers } = await query.graph({
      entity: "driver",
      fields: [
        "*"
      ],
      filters: {
        id: [driver.id],
      },
    })

    if (!drivers.length) {
      return res.status(404).json({
        message: "Driver not found",
      })
    }

    res.json({
      driver: drivers[0],
    })
  } catch (error) {
    console.error("Error fetching driver profile:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
}

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  setDriverCorsHeaders(res)

  try {
    const driver = await getCurrentDriver(req)

    const {
      name,
      handle,
      avatar,
      vehicle_info,
      license_number,
      phone,
      email,
      first_name,
      last_name,
      address,
      status,
    } = req.body as UpdateDriverStepInput

    // Use update driver workflow
    const { result: updatedDriver } = await updateDriverWorkflow(req.scope).run({
      input: {
        id: driver.id,
        name,
        handle,
        avatar,
        vehicle_info,
        license_number,
        phone,
        email,
        first_name,
        last_name,
        address,
        status,
      },
    })

    res.json({ driver: { ...updatedDriver[0] } })
  } catch (error) {
    console.error("Error updating driver profile:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
}
