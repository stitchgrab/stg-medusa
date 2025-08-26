import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import Stripe from "stripe"
import { setDriverCorsHeaders, setDriverCorsHeadersOptions } from "../../../../utils/cors"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"
import { getCurrentDriver } from "../../../../utils/driver-auth"

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
  // Set CORS headers
  setDriverCorsHeaders(res)

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const driver = await getCurrentDriver(req)
    const driverId = driver.id

    // Get driver with Stripe information
    const { data: drivers } = await query.graph({
      entity: "driver",
      fields: [
        "id",
        "name",
        "stripe_connected",
        "stripe_account_id",
        "stripe_account_status",
      ],
      filters: {
        id: [driverId],
      },
    })

    if (!drivers.length) {
      return res.status(401).json({
        message: "Driver not found",
        authenticated: false,
      })
    }

    const driverData = drivers[0]

    // If driver has a Stripe account, get the requirements
    let requirements: Stripe.Account.Requirements | null = null
    if (driverData?.stripe_account_id) {
      try {
        const stripe = new Stripe(process.env.STRIPE_API_KEY!)
        const account = await stripe.accounts.retrieve(driverData.stripe_account_id)
        requirements = account.requirements || null
      } catch (error) {
        console.error("Failed to retrieve Stripe account requirements:", error)
      }
    }

    res.json({
      stripe_account_id: driverData?.stripe_account_id || null,
      stripe_account_status: driverData?.stripe_account_status || null,
      is_connected: driverData?.stripe_connected || false,
      requirements: requirements,
    })
  } catch (error) {
    console.error("Driver Stripe Connect error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Set CORS headers
  setDriverCorsHeaders(res)

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const driver = await getCurrentDriver(req)
    const { account_id } = req.body as { account_id?: string } || {}

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_API_KEY!)

    if (!driver.email) {
      return res.status(400).json({
        message: "Driver email is required",
      })
    }

    let accountId = account_id

    // If no account_id provided, create a new account
    if (!accountId) {
      console.log('url: ', `${process.env.NEXT_PUBLIC_FRONTEND_URL}/drivers/${driver.id}`)

      // Create Stripe Connect account for API-based onboarding
      const account = await stripe.accounts.create({
        type: "custom", // Use custom type for API-based onboarding
        country: "US", // You can make this dynamic based on driver location
        email: driver.email,
        business_type: "individual", // Drivers are typically individuals
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/drivers/${driver.id}`,
          product_description: `Driver - Delivery driver on your platform`,
        },
        // Set up terms of service acceptance
        tos_acceptance: {
          date: Math.floor(Date.now() / 1000),
          ip: req.ip || req.connection.remoteAddress || "127.0.0.1",
        },
        metadata: {
          stitchgrab_role: "driver",
          driver_id: driver.id,
        },
      })

      accountId = account.id

      // Store the account ID immediately so we can track it
      await req.scope.resolve(MARKETPLACE_MODULE).updateDrivers([{
        id: driver.id,
        stripe_account_id: accountId,
        stripe_account_status: "pending_onboarding",
      }])

      console.log(`Created Stripe account ${accountId} for driver ${driver.id} - pending onboarding completion`)
    } else {
      console.log(`Using existing Stripe account ${accountId} for driver ${driver.id}`)
    }

    // Get the account requirements for API-based onboarding
    const account = await stripe.accounts.retrieve(accountId)
    const requirements = account.requirements

    res.json({
      account_id: accountId,
      requirements: requirements,
      status: "pending_onboarding",
      account: account,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "No session found") {
      return res.status(401).json({
        message: "No session found",
        authenticated: false,
      })
    }

    if (error instanceof Error && error.message === "Invalid or expired session") {
      return res.status(401).json({
        message: "Invalid or expired session",
        authenticated: false,
      })
    }

    console.error("Stripe Connect creation error:", error)
    res.status(500).json({
      message: "Failed to create Stripe Connect account",
      error: error.message,
    })
  }
}
