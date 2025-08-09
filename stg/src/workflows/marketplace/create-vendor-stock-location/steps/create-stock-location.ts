import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { createStockLocationsWorkflow, deleteStockLocationsWorkflow } from "@medusajs/medusa/core-flows"

type CreateStockLocationStepInput = {
  name: string
  address?: {
    address_1?: string
    address_2?: string
    city?: string
    postal_code?: string
    province?: string
  }
}

const createStockLocationStep = createStep(
  "create-stock-location",
  async (stockLocationData: CreateStockLocationStepInput, { container }) => {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: stockLocationData.name,
            address: stockLocationData.address && stockLocationData.address.address_1 ? {
              address_1: stockLocationData.address.address_1,
              address_2: stockLocationData.address.address_2,
              city: stockLocationData.address.city,
              country_code: "US",
              postal_code: stockLocationData.address.postal_code,
            } : undefined,
          },
        ],
      },
    })

    return new StepResponse(stockLocationResult[0], stockLocationResult[0].id)
  },
  async (stockLocationId, { container }) => {
    if (!stockLocationId) {
      return
    }

    await deleteStockLocationsWorkflow(container).run({
      input: {
        ids: [stockLocationId],
      },
    })
  }
)

export default createStockLocationStep 