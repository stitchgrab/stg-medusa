import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"
import MarketplaceModuleService from "../../../../modules/marketplace/service"

export type UpdateDriverStepInput = {
  id: string
  name?: string
  handle?: string
  avatar?: string
  vehicle_info?: any
  license_number?: string
  phone?: string
  email?: string
  first_name?: string
  last_name?: string
  address?: any
  status?: string
}

export const updateDriverStep = createStep(
  "update-driver",
  async (driverData: UpdateDriverStepInput, { container }) => {
    const marketplaceModuleService: MarketplaceModuleService =
      container.resolve(MARKETPLACE_MODULE)

    const { id, ...updateData } = driverData

    const driver = await marketplaceModuleService.updateDrivers({ id, ...updateData })

    return new StepResponse(driver, { id, originalData: updateData })
  },
  async (compensationData, { container }) => {
    if (!compensationData?.id) {
      return
    }

    const marketplaceModuleService: MarketplaceModuleService =
      container.resolve(MARKETPLACE_MODULE)

    // Note: In a real scenario, you'd want to store the original data before update
    // and restore it here. For now, this is a placeholder for compensation logic.
    console.log("Compensating update for driver:", compensationData.id)
  }
)

export default updateDriverStep
