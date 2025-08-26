import { MedusaService } from "@medusajs/framework/utils"
import TypeformSubmission from "./models/typeform-submission"

class TypeformModuleService extends MedusaService({
  TypeformSubmission,
}) {
  async createSubmission(data: {
    token: string
    form_data: any
    expires_at: Date
  }) {
    return await this.createTypeformSubmissions([data])
  }

  async getSubmissionByToken(token: string) {
    const [submission] = await this.listTypeformSubmissions({
      token: token
    })
    return submission
  }

  async markSubmissionAsUsed(id: string) {
    return await this.updateTypeformSubmissions([{
      id,
      used: true
    }])
  }
}

export default TypeformModuleService
