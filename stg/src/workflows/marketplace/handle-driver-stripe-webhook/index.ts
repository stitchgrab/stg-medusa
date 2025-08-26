import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import Stripe from "stripe"
import { updateDriverStripeStatusStep } from "./steps/update-driver-stripe-status"

type StripeWebhookInput = {
  type: string
  data: {
    object: Stripe.Account
  }
}

const handleDriverStripeWebhookWorkflow = createWorkflow(
  "handle-driver-stripe-webhook",
  (input: StripeWebhookInput) => {
    const account = input.data.object
    console.log('Driver webhook workflow started:', { eventType: input.type, accountId: account.id })

    // Find driver by Stripe account ID
    const { data: drivers } = useQueryGraphStep({
      entity: "driver",
      fields: ["id", "full_name", "stripe_account_id", "stripe_account_status"],
      filters: {
        stripe_account_id: [account.id],
      },
    }).config({ name: "find-driver-by-stripe-account" })

    console.log('Found drivers:', drivers)

    // Process the webhook data and determine what needs to be updated
    const result = transform({
      drivers,
      account,
      eventType: input.type,
    }, ({ drivers, account, eventType }) => {
      console.log('Processing webhook data:', { drivers, eventType })

      if (!drivers.length) {
        console.log('No driver found for account:', account.id)
        return {
          driverUpdated: false,
          reason: "driver_not_found",
          stripeAccountId: account.id,
        }
      }

      const driver = drivers[0]
      let newStatus: string | null = null
      let clearAccountId = false

      // Determine new status based on event type
      switch (eventType) {
        case "account.updated":
          const isAccountReady = account.charges_enabled && account.payouts_enabled
          newStatus = isAccountReady ? "active" : "incomplete"
          console.log('Account updated:', { isAccountReady, newStatus })
          break
        case "account.application.authorized":
          newStatus = "active"
          console.log('Account authorized:', newStatus)
          break
        case "account.application.deauthorized":
          newStatus = null
          clearAccountId = true
          console.log('Account deauthorized:', { newStatus, clearAccountId })
          break
        default:
          console.log('Unhandled event type:', eventType)
          return {
            driverUpdated: false,
            reason: "unhandled_event_type",
            stripeAccountId: account.id,
          }
      }

      const workflowResult = {
        driverUpdated: true,
        driverId: driver.id,
        driverName: driver.full_name,
        stripeAccountId: account.id,
        status: newStatus || "disconnected",
        newStripeStatus: newStatus,
        clearAccountId,
      }

      console.log('Workflow result:', workflowResult)
      return workflowResult
    })

    // Call the update step directly if driver was found and needs updating
    const updateInput = transform(result, (data: any) => {
      console.log('Checking if update is needed:', {
        driverUpdated: data.driverUpdated,
        driverId: 'driverId' in data ? data.driverId : undefined,
        data: data
      })
      if (data.driverUpdated && 'driverId' in data) {
        return {
          driverId: data.driverId,
          stripeAccountStatus: data.newStripeStatus,
          stripeAccountId: data.clearAccountId ? null : undefined,
        }
      }
      return null
    })

    // Call the step directly in the workflow definition (not inside transform)
    const stepResult = updateDriverStripeStatusStep(updateInput)

    return new WorkflowResponse(stepResult)
  }
)

export default handleDriverStripeWebhookWorkflow
