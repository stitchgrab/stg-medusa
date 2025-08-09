import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import { updateVendorStripeStatusStep } from "./steps/update-vendor-stripe-status"
import Stripe from "stripe"

type StripeWebhookInput = {
  type: string
  data: {
    object: Stripe.Account
  }
}

const handleStripeWebhookWorkflow = createWorkflow(
  "handle-stripe-webhook",
  (input: StripeWebhookInput) => {
    const account = input.data.object

    // Find vendor by Stripe account ID
    const { data: vendors } = useQueryGraphStep({
      entity: "vendor",
      fields: ["id", "name", "stripe_account_id", "stripe_account_status"],
      filters: {
        stripe_account_id: [account.id],
      },
    }).config({ name: "find-vendor-by-stripe-account" })

    // Process the webhook data and update vendor if found
    const result = transform({
      vendors,
      account,
      eventType: input.type,
    }, ({ vendors, account, eventType }) => {
      if (!vendors.length) {
        return {
          vendorUpdated: false,
          reason: "vendor_not_found",
          stripeAccountId: account.id,
        }
      }

      const vendor = vendors[0]
      let newStatus: string | null = null
      let clearAccountId = false

      // Determine new status based on event type
      switch (eventType) {
        case "account.updated":
          const isAccountReady = account.charges_enabled && account.payouts_enabled
          newStatus = isAccountReady ? "active" : "incomplete"
          break
        case "account.application.authorized":
          newStatus = "active"
          break
        case "account.application.deauthorized":
          newStatus = null
          clearAccountId = true
          break
        default:
          return {
            vendorUpdated: false,
            reason: "unhandled_event_type",
            stripeAccountId: account.id,
          }
      }

      return {
        vendorUpdated: true,
        vendorId: vendor.id,
        vendorName: vendor.name,
        stripeAccountId: account.id,
        status: newStatus || "disconnected",
        newStripeStatus: newStatus,
        clearAccountId,
      }
    })

    // Only update if vendor was found and updated
    const updateResult = transform(result, (data) => {
      if (data.vendorUpdated && data.vendorId) {
        const updateInput = {
          vendorId: data.vendorId,
          stripeAccountStatus: data.newStripeStatus,
          stripeAccountId: data.clearAccountId ? null : undefined,
        }

        // Call the step and return the result
        return updateVendorStripeStatusStep(updateInput)
      }
      return null
    })

    return new WorkflowResponse(result)
  }
)

export default handleStripeWebhookWorkflow