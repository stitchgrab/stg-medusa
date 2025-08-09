import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MARKETPLACE_MODULE } from "../../../modules/marketplace"
import MarketplaceModuleService from "../../../modules/marketplace/service"

type UpdateVendorStripeStatusInput = {
  vendorId: string
  stripeAccountStatus: string | null
  stripeAccountId?: string | null
}

export const updateVendorStripeStatusStep = createStep(
  "update-vendor-stripe-status",
  async (input: UpdateVendorStripeStatusInput, { container }) => {
    const marketplaceModuleService = container.resolve(MARKETPLACE_MODULE) as MarketplaceModuleService

    const updateData: any = {
      id: input.vendorId,
      stripe_account_status: input.stripeAccountStatus,
      stripe_connected: input.stripeAccountStatus === 'active', // Set connected flag based on active status
    }

    // Include stripe_account_id if provided (for deauthorization)
    if (input.stripeAccountId !== undefined) {
      updateData.stripe_account_id = input.stripeAccountId
    }

    await marketplaceModuleService.updateVendors([updateData])

    return new StepResponse({
      vendorId: input.vendorId,
      updated: true,
    })
  }
)
