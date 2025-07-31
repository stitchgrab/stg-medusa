import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Get all vendors
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: ["id", "name", "handle"],
    })

    res.json({ vendors })
  } catch (error) {
    console.error("Error fetching vendors:", error)
    res.status(500).json({ message: "Internal server error" })
  }
} 