import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import Stripe from "stripe"
import { getCurrentVendorAdmin } from "../../../../utils/vendor-auth"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const vendorAdmin = await getCurrentVendorAdmin(req)
    const vendor = vendorAdmin.vendor

    const vendorAdminId = vendorAdmin.id

    // Get vendor with Stripe account ID
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: ["vendor.id", "vendor.stripe_account_id"],
      filters: {
        id: [vendorAdminId],
      },
    })

    if (!vendorAdmins.length) {
      return res.redirect("/vendors/settings/stripe")
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_API_KEY!)

    // For now, we'll need to get the stripe_account_id from a different source
    // This is a placeholder - you'll need to implement proper storage/retrieval
    const stripeAccountId = vendor?.stripe_account_id

    if (!stripeAccountId) {
      return res.redirect("/vendors/settings/stripe")
    }

    // Create new account link
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/vendors/settings/stripe/refresh?account_id=${stripeAccountId}`,
      return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/vendors/settings/stripe/complete?account_id=${stripeAccountId}`,
      type: "account_onboarding",
      collection_options: {
        fields: "eventually_due",
      },
    })

    // Redirect to the new account link
    res.redirect(accountLink.url)
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

    console.error("Stripe refresh error:", error)
    res.redirect("/vendors/settings/stripe?error=refresh_failed")
  }
} 