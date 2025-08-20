import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"
import MarketplaceModuleService from "../../../../modules/marketplace/service"

export type CreateDriverStepInput = {
  name: string
  handle?: string
  avatar?: string
  vehicle_info?: any
  license_number?: string
  phone?: string
  email: string
  password_hash: string
  first_name?: string
  last_name?: string
  address?: any
  status?: string
}

export const createDriverStep = createStep(
  "create-driver",
  async (driverData: CreateDriverStepInput, { container }) => {
    const marketplaceModuleService: MarketplaceModuleService =
      container.resolve(MARKETPLACE_MODULE)

    const driver = await marketplaceModuleService.createDrivers(driverData)

    return new StepResponse(driver, driver.id)
  },
  async (driverId, { container }) => {
    if (!driverId) {
      return
    }

    const marketplaceModuleService: MarketplaceModuleService =
      container.resolve(MARKETPLACE_MODULE)

    marketplaceModuleService.deleteDrivers(driverId)
  }
)

export default createDriverStep
