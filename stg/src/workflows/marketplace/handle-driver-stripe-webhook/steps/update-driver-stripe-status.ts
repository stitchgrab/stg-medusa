import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"

type UpdateDriverStripeStatusInput = {
  driverId: string
  stripeAccountStatus?: string | null
  stripeAccountId?: string | null
}

export const updateDriverStripeStatusStep = createStep(
  "update-driver-stripe-status",
  async (input: UpdateDriverStripeStatusInput, { container }) => {

    const marketplaceModuleService = container.resolve(MARKETPLACE_MODULE)

    const updateData: any = {
      id: input.driverId,
    }

    if (input.stripeAccountStatus !== undefined) {
      updateData.stripe_account_status = input.stripeAccountStatus
      updateData.stripe_connected = input.stripeAccountStatus === "active"
    }

    // Only update stripe_account_id if it's explicitly provided (not undefined)
    if (input.stripeAccountId !== undefined) {
      // Only update if it's null (to clear) or a valid string (to set)
      if (input.stripeAccountId === null || typeof input.stripeAccountId === 'string') {
        updateData.stripe_account_id = input.stripeAccountId
      }
    }

    try {
      const driver = await marketplaceModuleService.updateDrivers([updateData])

      return new StepResponse({
        driverId: input.driverId,
        stripeAccountStatus: input.stripeAccountStatus,
        stripeAccountId: input.stripeAccountId,
        updated: true,
      })
    } catch (error) {
      console.error('Error updating driver:', error)
      throw error
    }
  }
)
export default updateDriverStripeStatusStep

