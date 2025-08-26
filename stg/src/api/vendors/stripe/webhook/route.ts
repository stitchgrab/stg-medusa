import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import Stripe from "stripe"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  return res.json({
    message: "Stripe webhook endpoint is accessible",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const stripe = new Stripe(process.env.NODE_ENV === "production" ? process.env.STRIPE_API_KEY! : process.env.STRIPE_CLI_SECRET_KEY!)
  const eventBus = req.scope.resolve("event_bus")

  const sig = req.headers["stripe-signature"] as string
  const endpointSecret = process.env.VENDORSSTRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.rawBody as Buffer, sig, endpointSecret)
  } catch (err: any) {
    console.error("Stripe webhook endpoint - Webhook signature verification failed:", err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    // Define the Stripe Connect events we care about
    const relevantEvents = [
      "account.updated",
      "account.application.authorized",
      "account.application.deauthorized",
      "capability.updated",
      "account.external_account.created",
      "account.external_account.updated"
    ]

    if (!relevantEvents.includes(event.type)) {
      return res.json({ received: true, ignored: true })
    }

    // Handle different types of events
    if (event.type.startsWith("account.")) {
      const account = event.data.object as Stripe.Account

      // Emit event for subscriber to handle
      await eventBus.emit({
        name: "stripe.webhook.received",
        data: {
          type: event.type,
          data: {
            object: account,
          },
        },
      })
    } else if (event.type === "capability.updated") {
      // This event fires when account capabilities change (useful for Standard accounts)
      const capability = event.data.object as Stripe.Capability

      // Only process when capabilities become active
      if (capability.status === "active") {
        // Fetch the full account to trigger an update
        const stripe = new Stripe(process.env.STRIPE_API_KEY!)
        const account = await stripe.accounts.retrieve(capability.account as string)

        // Emit account.updated event for subscriber to handle
        await eventBus.emit({
          name: "stripe.webhook.received",
          data: {
            type: "account.updated",
            data: {
              object: account,
            },
          },
        })
      }
    } else if (event.type === "account.external_account.created" || event.type === "account.external_account.updated") {
      // This fires when bank accounts are added/updated
      const externalAccount = event.data.object as any

      // Fetch the full account to trigger an update
      const stripe = new Stripe(process.env.STRIPE_API_KEY!)
      const account = await stripe.accounts.retrieve(externalAccount.account as string)

      // Emit account.updated event for subscriber to handle
      await eventBus.emit({
        name: "stripe.webhook.received",
        data: {
          type: "account.updated",
          data: {
            object: account,
          },
        },
      })
    }

    res.json({ received: true, processed: true })
  } catch (error: any) {
    console.error("Stripe webhook handler error:", error)
    res.status(500).json({ error: "Webhook handler failed", message: error.message })
  }
}
