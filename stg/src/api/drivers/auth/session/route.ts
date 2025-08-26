import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { setDriverCorsHeaders, setDriverCorsHeadersOptions } from "../../../../utils/cors"
import { verifyDriverToken } from "../../../../utils/jwt"

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
    const token = req.cookies.driver_session || req.cookies.driver_token

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        message: "No session token found",
      })
    }

    const decoded = verifyDriverToken(token)
    if (!decoded) {
      return res.status(401).json({
        authenticated: false,
        message: "Invalid session token",
      })
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Get driver details
    const { data: drivers } = await query.graph({
      entity: "driver",
      fields: ["id", "email", "first_name", "last_name", "name", "handle"],
      filters: {
        id: [decoded.driver_id],
      },
    })

    if (!drivers.length) {
      return res.status(401).json({
        authenticated: false,
        message: "Driver not found",
      })
    }

    const driver = drivers[0]

    res.json({
      authenticated: true,
      driver: {
        id: driver.id,
        email: driver.email,
        first_name: driver.first_name,
        last_name: driver.last_name,
        name: driver.name,
        handle: driver.handle,
      },
    })
  } catch (error) {
    console.error("Driver session check error:", error)
    res.status(401).json({
      authenticated: false,
      message: "Session validation failed",
    })
  }
}
