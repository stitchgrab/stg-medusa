import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"
import { setDriverCorsHeaders, setDriverCorsHeadersOptions } from "../../../../utils/cors"
import { signDriverToken } from "../../../../utils/jwt"
import { verifyPassword } from "../../../../utils/password"

export const PostDriverLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
}).strict()

type RequestBody = z.infer<typeof PostDriverLoginSchema>

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  return setDriverCorsHeadersOptions(res)
}

export const POST = async (
  req: MedusaRequest<RequestBody>,
  res: MedusaResponse
) => {
  // Set CORS headers for all requests
  setDriverCorsHeaders(res)

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Access the request body from the validated body
    const { email, password } = req.body as RequestBody

    console.log("Driver login attempt for email:", email)

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      })
    }

    // Find driver by email
    const { data: drivers } = await query.graph({
      entity: "driver",
      fields: ["id", "email", "first_name", "last_name", "password_hash", "name", "handle"],
      filters: {
        email: [email],
      },
    })

    console.log("Found drivers:", drivers.length)

    if (!drivers.length) {
      console.log("No driver found for email:", email)
      return res.status(401).json({
        message: "Invalid credentials",
      })
    }

    const driver = drivers[0]

    // Verify password
    if (!driver.password_hash) {
      console.log("No password hash found for driver:", driver.id)
      return res.status(401).json({
        message: "Invalid credentials",
      })
    }

    const isPasswordValid = await verifyPassword(password, driver.password_hash)
    if (!isPasswordValid) {
      console.log("Invalid password for driver:", driver.id)
      return res.status(401).json({
        message: "Invalid credentials",
      })
    }

    // Generate JWT token for driver authentication
    const jwtToken = signDriverToken({
      driver_id: driver.id,
      email: driver.email,
      type: 'driver',
    })

    // Set session cookie with JWT token (httpOnly for security)
    res.cookie("driver_session", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
    })

    // Also set a non-httpOnly token for JavaScript access (fallback)
    res.cookie("driver_token", jwtToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
    })

    console.log("🔍 Set both driver_session (httpOnly) and driver_token (JS accessible) cookies")

    res.json({
      driver: {
        id: driver.id,
        email: driver.email,
        first_name: driver.first_name,
        last_name: driver.last_name,
        name: driver.name,
        handle: driver.handle,
      },
      token: jwtToken,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Driver login error:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
}
