import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../../utils/cors"
import { getCurrentVendorAdmin } from "../../../../utils/vendor-auth"
import { z } from "zod"
import MarketplaceModuleService from "../../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"
import Stripe from "stripe"

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  return setVendorCorsHeadersOptions(res)
}

const completeOnboardingSchema = z.object({
  account_id: z.string().min(1, "Account ID is required"),
})

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  setVendorCorsHeaders(res)

  try {
    const vendorAdmin = await getCurrentVendorAdmin(req)
    const { account_id } = completeOnboardingSchema.parse(req.body)

    console.log("🔍 Stripe complete - Vendor admin:", vendorAdmin.id, "Account ID:", account_id)

    // Initialize Stripe to check account status
    const stripe = new Stripe(process.env.STRIPE_API_KEY!)

    try {
      // Retrieve the account from Stripe to check its status
      const account = await stripe.accounts.retrieve(account_id)

      console.log("🔍 Stripe complete - Account status:", {
        id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
      })

      // Determine account status based on Stripe's response
      let accountStatus = "incomplete"
      let message = "Stripe onboarding incomplete. Please complete all required fields."

      if (account.charges_enabled && account.payouts_enabled) {
        accountStatus = "active"
        message = "Stripe onboarding completed successfully"
      } else if (account.details_submitted) {
        accountStatus = "pending_verification"
        message = "Stripe account created but pending verification"
      }

      // Update vendor with Stripe account information
      const marketplaceModuleService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)

      await marketplaceModuleService.updateVendors([{
        id: vendorAdmin.vendor.id,
        stripe_account_id: account_id,
        stripe_account_status: accountStatus,
        stripe_connected: accountStatus === "active" ? true : false,
      }])

      console.log("🔍 Stripe complete - Updated vendor with account:", account_id, "Status:", accountStatus)

      return res.json({
        success: true,
        account_id: account_id,
        account_status: accountStatus,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        message: message,
      })

    } catch (stripeError) {
      console.error("🔍 Stripe complete - Stripe API error:", stripeError)

      // If we can't retrieve the account, it might not exist or be accessible
      return res.status(400).json({
        success: false,
        message: "Invalid Stripe account ID or account not accessible",
        error: stripeError.message,
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

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: error.errors,
      })
    }

    console.error("🔍 Stripe complete - Error:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
} 