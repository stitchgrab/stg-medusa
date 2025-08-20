import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { TYPEFORM_MODULE } from "../../../../../modules/typeform"
import TypeformModuleService from "../../../../../modules/typeform/service"
import { setDriverCorsHeaders } from "../../../../../utils/cors"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  setDriverCorsHeaders(res)
  try {
    const { token } = req.params

    if (!token) {
      return res.status(400).json({
        message: "Token is required"
      })
    }

    // Get data from database using the service
    const typeformService = req.scope.resolve(TYPEFORM_MODULE) as TypeformModuleService

    const submission = await typeformService.getSubmissionByToken(token)

    if (!submission) {
      return res.status(404).json({
        message: "Token not found or expired"
      })
    }

    // Check if token has expired
    if (new Date() > new Date(submission.expires_at)) {
      return res.status(410).json({
        message: "Token has expired"
      })
    }

    // Check if token has already been used
    if (submission.used) {
      return res.status(409).json({
        message: "Token has already been used"
      })
    }

    res.status(200).json({
      formData: submission.form_data,
      token: submission.token,
      expires_at: submission.expires_at
    })
  } catch (error) {
    console.error("Error fetching Typeform data:", error)
    res.status(500).json({
      message: "Error fetching Typeform data",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
