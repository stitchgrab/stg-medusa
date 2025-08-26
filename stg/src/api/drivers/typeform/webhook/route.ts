import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { randomUUID } from "crypto"
import { TYPEFORM_MODULE } from "../../../../modules/typeform"
import TypeformModuleService from "../../../../modules/typeform/service"

interface TypeformResponse {
  form_response: {
    definition: {
      fields: Array<{
        title: string
        ref: string
      }>
    }
    answers: Array<{
      field: {
        id: string
        type: string
        ref: string
      }
      type: string
      text?: string
      phone_number?: string
      file_url?: string
      boolean?: boolean
      email?: string
      number?: number
      url?: string
      date?: string
      choice?: {
        label: string
      }
      choices?: {
        labels: string[]
      }
    }>
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const body = req.body as TypeformResponse

    console.log("Typeform webhook received:", JSON.stringify(body, null, 2))

    // Extract answers from Typeform response
    const questionsRefs = body.form_response.definition.fields.map((field: any) => ({ title: field.title, ref: field.ref }))
    const answers = body.form_response.answers
    const formData: any = {}

    console.log("Available question refs:", questionsRefs.map(q => ({ ref: q.ref, title: q.title })))

    // Build mapping dynamically based on available question refs
    const questionRefMapping: { [key: string]: string } = {}

    questionsRefs.forEach(question => {
      // Map the actual ref to a form field name based on the question title or ref
      const ref = question.ref
      const title = question.title?.toLowerCase() || ""

      // Map based on common patterns in the title or ref
      if (title.includes("full name") || title.includes("name")) {
        questionRefMapping[ref] = "full_name"
      } else if (title.includes("email")) {
        questionRefMapping[ref] = "email"
      } else if (title.includes("phone") && !title.includes("cell phone") && !title.includes("data")) {
        questionRefMapping[ref] = "phone_number"
      } else if (title.includes("cell phone") || title.includes("data")) {
        questionRefMapping[ref] = "has_cell_phone"
      } else if (title.includes("area") || title.includes("live")) {
        questionRefMapping[ref] = "area"
      } else if (title.includes("driver's license") || title.includes("license")) {
        questionRefMapping[ref] = "license_number"
      } else if (title.includes("profile photo")) {
        questionRefMapping[ref] = "profile_photo"
      } else if (title.includes("gps") || title.includes("navigation")) {
        questionRefMapping[ref] = "comfortable_with_gps"
      } else if (title.includes("vehicle") || title.includes("car") || title.includes("make") || title.includes("model")) {
        questionRefMapping[ref] = "vehicle_info"
      } else if (title.includes("currently work") || title.includes("delivery driver")) {
        questionRefMapping[ref] = "current_work_status"
      } else if (title.includes("hours per week") || title.includes("prefer to work")) {
        questionRefMapping[ref] = "preferred_hours"
      } else if (title.includes("reliable vehicle")) {
        questionRefMapping[ref] = "has_reliable_vehicle"
      } else if (title.includes("weekends")) {
        questionRefMapping[ref] = "available_weekends"
      } else if (title.includes("experience") || title.includes("years")) {
        questionRefMapping[ref] = "experience_years"
      } else if (title.includes("lift") || title.includes("25 pounds")) {
        questionRefMapping[ref] = "can_lift_packages"
      } else if (title.includes("convicted") || title.includes("crime")) {
        questionRefMapping[ref] = "criminal_record"
      } else if (title.includes("privacy")) {
        questionRefMapping[ref] = "privacy_agreement"
      } else {
        // For unmapped fields, create a readable field name from the title
        const readableFieldName = title
          .replace(/[^a-z0-9\s]/gi, '')
          .replace(/\s+/g, '_')
          .toLowerCase()
          .trim()

        questionRefMapping[ref] = readableFieldName || ref
        console.log(`Mapped field: ${ref} (${title}) -> ${questionRefMapping[ref]}`)
      }
    })

    console.log("Generated mapping:", questionRefMapping)

    // Map answers using the questionRef mapping
    answers.forEach(answer => {
      console.log("Processing answer:", answer)
      const questionRef = answer.field.ref
      const formField = questionRefMapping[questionRef]

      if (formField) {
        // Extract the value based on answer type
        let value = ""

        switch (answer.type) {
          case "text":
            value = answer.text || ""
            break
          case "choice":
            value = answer.choice?.label || ""
            break
          case "choices":
            value = answer.choices?.labels?.join(", ") || ""
            break
          case "phone_number":
            value = answer.phone_number || ""
            break
          case "email":
            value = answer.email || ""
            break
          case "boolean":
            value = answer.boolean?.toString() || ""
            break
          case "file_url":
            value = answer.file_url || ""
            break
          case "number":
            value = answer.number?.toString() || ""
            break
          case "url":
            value = answer.url || ""
            break
          case "date":
            value = answer.date || ""
            break
          default:
            // For unknown types, try to extract any available value
            const answerValue = answer[answer.type as keyof typeof answer]
            value = answerValue ? String(answerValue) : ""
            console.log(`Unknown answer type: ${answer.type}, value: ${value}`)
        }

        formData[formField] = value
        console.log(`Mapped ${questionRef} to ${formField}: ${value}`)
      } else {
        console.log(`No mapping found for question ref: ${questionRef}`)
      }
    })

    console.log("Final form data:", formData)

    // Generate a unique token
    const token = randomUUID()

    // Save to database using the service
    const typeformService = req.scope.resolve(TYPEFORM_MODULE) as TypeformModuleService

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // Expire in 24 hours

    await typeformService.createSubmission({
      token,
      form_data: formData,
      expires_at: expiresAt,
    })

    console.log("Typeform submission received:", {
      formData,
      token
    })

    res.status(200).json({
      message: "Typeform submission received successfully",
      token
    })
  } catch (error) {
    console.error("Error processing Typeform webhook:", error)
    res.status(500).json({
      message: "Error processing Typeform submission",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
