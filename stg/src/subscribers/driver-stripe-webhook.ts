import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import handleDriverStripeWebhookWorkflow from "../workflows/marketplace/handle-driver-stripe-webhook"

// Event data structure for Stripe webhooks
type StripeWebhookEventData = {
  type: string
  data: {
    object: any
  }
}

// Workflow result types
type WorkflowFailureResult = {
  driverUpdated: false
  reason: string
  stripeAccountId: string
}

type WorkflowSuccessResult = {
  driverUpdated: true
  driverId: string
  driverName: string
  stripeAccountId: string
  status: string
}

type WorkflowResult = WorkflowFailureResult | WorkflowSuccessResult

export default async function driverStripeWebhookHandler({
  event,
  container,
}: SubscriberArgs<StripeWebhookEventData>) {
  try {

    // Execute the workflow to handle the webhook
    const { result } = await handleDriverStripeWebhookWorkflow(container).run({
      input: {
        type: event.data.type,
        data: event.data.data,
      },
    }) as unknown as { result: WorkflowResult }

    // Emit follow-up events based on the result
    if (result?.driverUpdated) {
      // Type guard to ensure this is a success result
      if ('driverId' in result && 'status' in result && 'driverName' in result) {
        const eventName = getDriverEventName(event.data.type, result.status as string)
        if (eventName) {
          const eventBus = container.resolve("event_bus")
          await eventBus.emit({
            name: eventName,
            data: {
              driver_id: result.driverId as string,
              stripe_account_id: result.stripeAccountId,
              status: result.status as string,
              driver_name: result.driverName as string,
            },
          })
        }

        console.log(`Driver ${result.driverName} (${result.driverId}) Stripe status updated to: ${result.status}`)
      }
    } else {
      console.log('Driver not updated:', result)
    }
  } catch (error) {
    console.error("Driver Stripe webhook subscriber - Error processing webhook:", error)
    throw error
  }
}

// Helper function to determine which driver event to emit
function getDriverEventName(webhookType: string, status: string): string | null {
  switch (webhookType) {
    case "account.updated":
      return "driver.stripe.updated"
    case "account.application.authorized":
      return "driver.stripe.authorized"
    case "account.application.deauthorized":
      return "driver.stripe.deauthorized"
    default:
      return null
  }
}

export const config: SubscriberConfig = {
  event: "stripe.webhook.received",
}
