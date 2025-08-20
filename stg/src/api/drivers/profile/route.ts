import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { setDriverCorsHeaders, setDriverCorsHeadersOptions } from "../../../utils/cors"
import { getCurrentDriver } from "../../../utils/driver-auth"

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
        "id",
        "name",
        "handle",
        "avatar",
        "vehicle_info",
        "license_number",
        "phone",
        "email",
        "address",
        "status",
        "rating",
        "total_deliveries",
        "stripe_account_id",
        "stripe_account_status",
        "stripe_connected",
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
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const {
      name,
      handle,
      avatar,
      vehicle_info,
      license_number,
      phone,
      email,
      address,
    } = req.body

    // Update driver profile
    const { data: updatedDriver } = await query.graph({
      entity: "driver",
      fields: [
        "id",
        "name",
        "handle",
        "avatar",
        "vehicle_info",
        "license_number",
        "phone",
        "email",
        "address",
        "status",
        "rating",
        "total_deliveries",
      ],
      filters: {
        id: [driver.id],
      },
    }).update({
      name: name || driver.name,
      handle: handle || driver.handle,
      avatar: avatar || driver.avatar,
      vehicle_info: vehicle_info || driver.vehicle_info,
      license_number: license_number || driver.license_number,
      phone: phone || driver.phone,
      email: email || driver.email,
      address: address || driver.address,
    })

    res.json({
      driver: updatedDriver[0],
    })
  } catch (error) {
    console.error("Error updating driver profile:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
}
