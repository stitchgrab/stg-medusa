import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import Stripe from "stripe"
import { setDriverCorsHeaders } from "../../../../utils/cors"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"
import { getCurrentDriver } from "../../../../utils/driver-auth"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Set CORS headers
  setDriverCorsHeaders(res)

  try {
    const driver = await getCurrentDriver(req)
    const { account_id } = req.body

    if (!account_id) {
      return res.status(400).json({
        message: "Account ID is required",
      })
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_API_KEY!)

    // Retrieve the account to check its status
    const account = await stripe.accounts.retrieve(account_id)

    if (!account) {
      return res.status(404).json({
        message: "Stripe account not found",
      })
    }

    // Check if the account is complete
    if (account.charges_enabled && account.payouts_enabled) {
      // Account is fully active
      await req.scope.resolve(MARKETPLACE_MODULE).updateDrivers([{
        id: driver.id,
        stripe_account_status: "active",
        stripe_connected: true,
      }])

      console.log(`Driver ${driver.id} Stripe account ${account_id} is now active`)

      res.json({
        account_status: "active",
        account_id: account_id,
        message: "Stripe account successfully connected and active",
      })
    } else if (account.requirements?.currently_due?.length > 0 || account.requirements?.eventually_due?.length > 0) {
      // Account is incomplete
      await req.scope.resolve(MARKETPLACE_MODULE).updateDrivers([{
        id: driver.id,
        stripe_account_status: "incomplete",
        stripe_connected: false,
      }])

      console.log(`Driver ${driver.id} Stripe account ${account_id} is incomplete`)

      res.json({
        account_status: "incomplete",
        account_id: account_id,
        message: "Stripe account setup incomplete",
        requirements: {
          currently_due: account.requirements?.currently_due || [],
          eventually_due: account.requirements?.eventually_due || [],
        },
      })
    } else {
      // Account is pending
      await req.scope.resolve(MARKETPLACE_MODULE).updateDrivers([{
        id: driver.id,
        stripe_account_status: "pending",
        stripe_connected: false,
      }])

      console.log(`Driver ${driver.id} Stripe account ${account_id} is pending`)

      res.json({
        account_status: "pending",
        account_id: account_id,
        message: "Stripe account is pending verification",
      })
    }
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

    console.error("Stripe completion error:", error)
    res.status(500).json({
      message: "Failed to complete Stripe onboarding",
      error: error.message,
    })
  }
}
