import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { updateDriverStep, UpdateDriverStepInput } from "./steps/update-driver"

export const updateDriverWorkflow = createWorkflow(
  "update-driver",
  (input: UpdateDriverStepInput) => {
    const driver = updateDriverStep(input)

    return new WorkflowResponse(driver)
  }
)

export default updateDriverWorkflow
