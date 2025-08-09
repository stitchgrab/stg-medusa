import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import Stripe from "stripe"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../../utils/cors"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"
import { getCurrentVendorAdmin } from "../../../../utils/vendor-auth"

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  return setVendorCorsHeadersOptions(res)
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Set CORS headers
  setVendorCorsHeaders(res)

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const vendorAdmin = await getCurrentVendorAdmin(req)
    const vendorAdminId = vendorAdmin.id

    // Get vendor with Stripe information
    const { data: vendorAdmins } = await query.graph({
      entity: "vendor_admin",
      fields: [
        "vendor.id",
        "vendor.name",
        "vendor.stripe_connected",
        "vendor.stripe_account_id",
        "vendor.stripe_account_status",
      ],
      filters: {
        id: [vendorAdminId],
      },
    })

    if (!vendorAdmins.length) {
      return res.status(401).json({
        message: "Vendor admin not found",
        authenticated: false,
      })
    }

    const vendor = vendorAdmins[0].vendor

    res.json({
      stripe_account_id: vendor?.stripe_account_id || null,
      stripe_account_status: vendor?.stripe_account_status || null,
      is_connected: vendor?.stripe_connected || false,
    })
  } catch (error) {
    console.error("Vendor Stripe Connect error:", error)
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
  setVendorCorsHeaders(res)

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const vendorAdmin = await getCurrentVendorAdmin(req)
    const vendor = vendorAdmin.vendor

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_API_KEY!)

    if (!vendorAdmin.email) {
      return res.status(400).json({
        message: "Vendor email is required",
      })
    }

    console.log('url: ', `${process.env.NEXT_PUBLIC_FRONTEND_URL}/vendors/${vendor.id}`)

    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: "standard",
      country: "US", // You can make this dynamic based on vendor location
      email: vendorAdmin.email,
      business_type: "company",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/vendors/${vendor.id}`,
        product_description: `${vendor.name} - Vendor on your platform`,
      },
    })

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/vendors/settings/stripe/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/vendors/settings/stripe?complete=true&account_id=${account.id}`,
      type: "account_onboarding",
      collection_options: {
        fields: "eventually_due",
      },
    })

    // Store the account ID immediately so we can track it
    await req.scope.resolve(MARKETPLACE_MODULE).updateVendors([{
      id: vendor.id,
      stripe_account_id: account.id,
      stripe_account_status: "pending_onboarding",
    }])

    console.log(`Created Stripe account ${account.id} for vendor ${vendor.name} - pending onboarding completion`)

    res.json({
      account_id: account.id,
      account_link_url: accountLink.url,
      status: "pending_onboarding",
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