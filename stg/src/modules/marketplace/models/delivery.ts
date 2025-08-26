import { model } from "@medusajs/framework/utils"

const Delivery = model.define("delivery", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  driver_id: model.text(),
  status: model.text().default("pending"), // pending, assigned, picked_up, delivered, cancelled
  pickup_address: model.json().nullable(),
  delivery_address: model.json().nullable(),
  pickup_time: model.dateTime().nullable(),
  delivery_time: model.dateTime().nullable(),
  estimated_delivery_time: model.dateTime().nullable(),
  actual_delivery_time: model.dateTime().nullable(),
  customer_rating: model.number().nullable(),
  customer_feedback: model.text().nullable(),
  delivery_fee: model.number().nullable(),
  tip_amount: model.number().nullable(),
  notes: model.text().nullable(),
  tracking_number: model.text().nullable(),
})

export default Delivery
