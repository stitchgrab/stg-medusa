import { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http"
import { validateDriverSession } from "../../utils/driver-auth"

export async function driverAuthMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  try {
    // Skip authentication for login and signup routes
    if (req.url.includes("/auth/login") || req.url.includes("/auth/signup")) {
      return next()
    }

    const driverSession = await validateDriverSession(req)
    
    // Attach driver context to request
    req.driver_context = {
      driver_admin_id: driverSession.driver_admin_id,
      driver_id: driverSession.driver_id,
      email: driverSession.email,
    }

    next()
  } catch (error) {
    console.error("Driver auth middleware error:", error)
    res.status(401).json({
      message: "Authentication required",
    })
  }
}
