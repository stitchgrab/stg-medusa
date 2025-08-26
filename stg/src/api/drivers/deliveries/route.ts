import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { setDriverCorsHeaders, setDriverCorsHeadersOptions } from "../../../utils/cors"
import { getCurrentDriver } from "../../../utils/driver-auth"

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  return setDriverCorsHeadersOptions(res)
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  setDriverCorsHeaders(res)

  try {
    const driver = await getCurrentDriver(req)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Get pagination parameters
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0
    const status = req.query.status as string

    // Build filters
    const filters: any = {
      driver_id: [driver.id],
    }

    if (status) {
      filters.status = [status]
    }

    // Get deliveries for this driver
    const { data: deliveries } = await query.graph({
      entity: "delivery",
      fields: [
        "id",
        "order_id",
        "status",
        "created_at",
        "updated_at",
        "pickup_address",
        "delivery_address",
        "pickup_time",
        "delivery_time",
        "estimated_delivery_time",
        "actual_delivery_time",
        "customer_rating",
        "customer_feedback",
        "delivery_fee",
        "tip_amount",
        "notes",
        "tracking_number",
      ],
      filters,
      limit,
      offset,
      order: "-created_at",
    })

    res.json({
      deliveries,
      pagination: {
        limit,
        offset,
        count: deliveries.length,
      },
    })
  } catch (error) {
    console.error("Error fetching driver deliveries:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  setDriverCorsHeaders(res)

  try {
    const driver = await getCurrentDriver(req)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const {
      order_id,
      pickup_address,
      delivery_address,
      estimated_delivery_time,
      delivery_fee,
      notes,
    } = req.body

    // Create new delivery
    const { data: delivery } = await query.graph({
      entity: "delivery",
      fields: [
        "id",
        "order_id",
        "driver_id",
        "status",
        "created_at",
        "pickup_address",
        "delivery_address",
        "estimated_delivery_time",
        "delivery_fee",
        "notes",
      ],
      filters: {},
    }).create({
      order_id,
      driver_id: driver.id,
      status: "pending",
      pickup_address,
      delivery_address,
      estimated_delivery_time,
      delivery_fee,
      notes,
    })

    res.json({
      delivery,
    })
  } catch (error) {
    console.error("Error creating delivery:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
}
