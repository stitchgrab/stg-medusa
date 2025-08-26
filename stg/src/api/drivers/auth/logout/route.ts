import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { setDriverCorsHeaders, setDriverCorsHeadersOptions } from "../../../../utils/cors"

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  return setDriverCorsHeadersOptions(res)
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  setDriverCorsHeaders(res)

  // Clear the session cookies
  res.clearCookie("driver_session", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  })

  res.clearCookie("driver_token", {
    httpOnly: false,
    secure: true,
    sameSite: "none",
    path: "/",
  })

  res.json({
    message: "Logout successful",
  })
}
