import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import Stripe from "stripe"
import { setDriverCorsHeaders } from "../../../../utils/cors"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"
import { getCurrentDriver } from "../../../../utils/driver-auth"

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  setDriverCorsHeaders(res)
  res.status(200).end()
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Set CORS headers
  setDriverCorsHeaders(res)

  try {
    console.log('Driver Stripe update request received')

    const driver = await getCurrentDriver(req)
    console.log('Driver authenticated:', driver.id)

    const { account_id, update_data } = req.body as {
      account_id: string
      update_data: any
    }

    console.log('Request data:', { account_id, update_data })

    if (!account_id) {
      console.log('Missing account_id')
      return res.status(400).json({
        message: "Account ID is required",
      })
    }

    if (!update_data) {
      console.log('Missing update_data')
      return res.status(400).json({
        message: "Update data is required",
      })
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_API_KEY!)
    console.log('Updating Stripe account:', account_id)

    // Update the Stripe account with the provided data
    const updatedAccount = await stripe.accounts.update(account_id, update_data)
    console.log('Stripe account updated successfully')

    // Get the updated requirements
    const requirements = updatedAccount.requirements
    console.log('Updated requirements:', requirements)

    // Check if the account is now complete
    const isComplete = !requirements?.currently_due || requirements.currently_due.length === 0
    const isActive = updatedAccount.charges_enabled && updatedAccount.payouts_enabled

    console.log('Account status:', { isComplete, isActive, charges_enabled: updatedAccount.charges_enabled, payouts_enabled: updatedAccount.payouts_enabled })

    // Update the driver's Stripe status in our database
    let stripeStatus = "pending_onboarding"
    if (isActive) {
      stripeStatus = "active"
    } else if (isComplete) {
      stripeStatus = "pending_verification"
    }

    console.log('Updating driver status to:', stripeStatus)

    await req.scope.resolve(MARKETPLACE_MODULE).updateDrivers([{
      id: driver.id,
      stripe_account_status: stripeStatus,
      stripe_connected: isActive,
    }])

    console.log('Driver status updated successfully')

    const response = {
      account: updatedAccount,
      requirements: requirements,
      is_complete: isComplete,
      is_active: isActive,
      status: stripeStatus,
    }

    console.log('Sending response:', response)
    res.json(response)
  } catch (error) {
    console.error("Stripe account update error:", error)

    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      console.log('Stripe error:', error.message, error.code, error.param)
      return res.status(400).json({
        message: error.message,
        code: error.code,
        param: error.param,
      })
    }

    res.status(500).json({
      message: "Failed to update Stripe account",
      error: error.message,
    })
  }
}
