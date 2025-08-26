import { MedusaRequest } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { extractDriverToken, verifyDriverToken } from "./jwt"

export const getDriverContext = (req: MedusaRequest) => {
  return (req as any).driver_context
}

export const requireDriverAuth = async (req: MedusaRequest) => {
  // Validate the driver session if available
  const driverSession = await validateDriverSession(req)

  if (driverSession) {
    return {
      driver_admin_id: driverSession.driver_admin_id,
      driver_id: driverSession.driver_id,
      email: driverSession.email,
    }
  }

  const context = getDriverContext(req)
  if (!context) {
    throw new Error("Driver authentication required")
  }
  return context
}

export const getCurrentDriver = async (req: MedusaRequest) => {
  const context = await requireDriverAuth(req)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: drivers } = await query.graph({
    entity: "driver",
    fields: ["id", "name", "handle", "avatar", "phone", "email", "first_name", "last_name", "status"],
    filters: {
      id: [context.driver_id],
    },
  })

  if (!drivers.length) {
    throw new Error("Driver not found")
  }

  return drivers[0]
}

export const getCurrentDriverLegacy = async (req: MedusaRequest) => {
  const context = await requireDriverAuth(req)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: drivers } = await query.graph({
    entity: "driver",
    fields: ["id", "name", "handle", "avatar", "phone", "email", "status"],
    filters: {
      id: [context.driver_id],
    },
  })

  if (!drivers.length) {
    throw new Error("Driver not found")
  }

  return drivers[0]
}

export const validateDriverSession = async (req: MedusaRequest) => {
  // Get token from cookie or Authorization header (try multiple cookie names)
  const token = req.cookies?.driver_session || req.cookies?.driver_token || extractDriverToken(req.headers.authorization)

  if (!token) {
    console.log("🔍 No driver token found in cookies or Authorization header")
    throw new Error("No session found")
  }

  // Verify JWT token
  const payload = verifyDriverToken(token)
  if (!payload) {
    throw new Error("Invalid or expired session")
  }
  return payload
}
