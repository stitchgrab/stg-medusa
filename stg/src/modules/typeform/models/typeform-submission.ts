import { model } from "@medusajs/framework/utils"

const TypeformSubmission = model.define("typeform_submission", {
  id: model.id().primaryKey(),
  token: model.text().unique(),
  form_data: model.json(),
  expires_at: model.dateTime(),
  used: model.boolean().default(false),
})

export default TypeformSubmission
