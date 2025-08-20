import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import createDriverWorkflow, {
  CreateDriverWorkflowInput,
} from "../../workflows/marketplace/create-driver"

export const PostDriverCreateSchema = z.object({
  name: z.string(),
  handle: z.string().optional(),
  avatar: z.string().optional(),
  vehicle_info: z.any().optional(),
  license_number: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.any().optional(),
  admin: z.object({
    email: z.string(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone: z.string().optional(),
  }).strict(),
}).strict()

type RequestBody = z.infer<typeof PostDriverCreateSchema> 

export const POST = async (
  req: AuthenticatedMedusaRequest<RequestBody>,
  res: MedusaResponse
) => {
  // If `actor_id` is present, the request carries 
  // authentication for an existing driver admin
  if (req.auth_context?.actor_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Request already authenticated as a driver."
    )
  }

  const driverData = req.validatedBody

  // create driver admin
  const { result } = await createDriverWorkflow(req.scope)
    .run({
      input: {
        ...driverData,
        authIdentityId: req.auth_context.auth_identity_id,
      } as CreateDriverWorkflowInput,
    })

  res.json({
    driver: result.driver,
  })
}
