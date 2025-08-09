import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import handleStripeWebhookWorkflow from "../workflows/marketplace/handle-stripe-webhook"
import { sendVendorUpdate } from "../api/vendors/stripe/status-stream/route"

// Event data structure for Stripe webhooks
type StripeWebhookEventData = {
  type: string
  data: {
    object: any
  }
}

// Workflow result types
type WorkflowFailureResult = {
  vendorUpdated: false
  reason: string
  stripeAccountId: string
}

type WorkflowSuccessResult = {
  vendorUpdated: true
  vendorId: string
  vendorName: string
  stripeAccountId: string
  status: string
}

type WorkflowResult = WorkflowFailureResult | WorkflowSuccessResult

export default async function stripeWebhookHandler({
  event,
  container,
}: SubscriberArgs<StripeWebhookEventData>) {
  try {
    // Execute the workflow to handle the webhook
    const { result } = await handleStripeWebhookWorkflow(container).run({
      input: {
        type: event.data.type,
        data: event.data.data,
      },
    }) as { result: WorkflowResult }

    // Emit follow-up events based on the result
    if (result?.vendorUpdated) {
      // Type guard to ensure this is a success result
      if ('vendorId' in result && 'status' in result && 'vendorName' in result) {
        const eventName = getVendorEventName(event.data.type, result.status as string)
        if (eventName) {
          const eventBus = container.resolve("event_bus")
          await eventBus.emit({
            name: eventName,
            data: {
              vendor_id: result.vendorId as string,
              stripe_account_id: result.stripeAccountId,
              status: result.status as string,
              vendor_name: result.vendorName as string,
            },
          })
        }

        // Send real-time update to frontend via SSE
        sendVendorUpdate(result.vendorId as string, {
          stripeStatus: result.status as string,
          stripeAccountId: result.stripeAccountId,
          eventType: event.data.type,
          message: getStatusMessage(event.data.type, result.status as string, event.data.data?.object),
        })
      }
    }
  } catch (error) {
    console.error("Stripe webhook subscriber - Error processing webhook:", error)
    throw error
  }
}

// Helper function to determine which vendor event to emit
function getVendorEventName(webhookType: string, status: string): string | null {
  switch (webhookType) {
    case "account.updated":
      return "vendor.stripe.updated"
    case "account.application.authorized":
      return "vendor.stripe.authorized"
    case "account.application.deauthorized":
      return "vendor.stripe.deauthorized"
    default:
      return null
  }
}

function getStatusMessage(eventType: string, status: string, accountData?: any): string {
  switch (eventType) {
    case "account.updated":
      if (status === "active") {
        return "🎉 Your Stripe account is now active and ready to receive payments!"
      } else if (status === "incomplete") {
        // Check for specific errors
        if (accountData?.requirements?.errors?.length > 0) {
          const error = accountData.requirements.errors[0]
          switch (error.code) {
            case "verification_failed_keyed_identity":
              return "❌ Identity verification failed. Please update your information and upload a valid document."
            case "verification_failed_address":
              return "❌ Address verification failed. Please check and update your address information."
            case "verification_failed_tax_id":
              return "❌ Tax ID verification failed. Please check and update your tax information."
            default:
              return `❌ Account verification issue: ${error.reason || 'Please check your account information.'}`
          }
        }
        return "⏳ Your account information is being verified. This may take a few minutes."
      }
      return "📝 Your Stripe account status has been updated."

    case "account.application.authorized":
      return "✅ Your Stripe Connect application has been authorized!"

    case "account.application.deauthorized":
      return "⚠️ Your Stripe Connect application has been disconnected."

    default:
      return "📡 Stripe account update received."
  }
}

export const config: SubscriberConfig = {
  event: "stripe.webhook.received",
}