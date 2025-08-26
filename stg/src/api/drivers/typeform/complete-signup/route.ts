import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import createDriverWorkflow from "../../../../workflows/marketplace/create-driver"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"
import MarketplaceModuleService from "../../../../modules/marketplace/service"
import TypeformModuleService from "../../../../modules/typeform/service"
import { TYPEFORM_MODULE } from "../../../../modules/typeform"
import { setDriverCorsHeaders } from "../../../../utils/cors"

type FormData = {
  full_name: string
  email: string
  phone_number: string
  area: string
  has_cell_phone: string
  vehicle_type: string
  vehicle_info: string
  license_number: string
  profile_photo: string
  comfortable_with_gps: string
  current_work_status: string
  preferred_hours: string
  has_reliable_vehicle: string
  available_weekends: string
  experience_years: string
  can_lift_packages: string
  criminal_record: string
  privacy_agreement: string
}

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  setDriverCorsHeaders(res)
  res.status(200).json({
    message: "OK"
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  setDriverCorsHeaders(res)
  try {
    const { token, password } = req.body as { token: string; password: string }

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and password are required"
      })
    }

    // Get Typeform data from database
    const typeformService = req.scope.resolve(TYPEFORM_MODULE) as TypeformModuleService
    const marketplaceService = req.scope.resolve(MARKETPLACE_MODULE) as MarketplaceModuleService

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

    const formData = submission.form_data as FormData

    // Prepare vehicle info
    const vehicleInfo = {
      type: formData.vehicle_type || formData['dd71cde8-908f-4f27-ba4e-dc4b6bd8bf12'] || 'Car',
      details: formData.vehicle_info || '',
      make: '',
      model: '',
      year: '',
      plate: ''
    }

    // Extract vehicle details if available
    if (formData.vehicle_info) {
      const vehicleMatch = formData.vehicle_info.match(/(\w+)\s+(\w+)\s+(\d{4})/i)
      if (vehicleMatch) {
        vehicleInfo.make = vehicleMatch[1]
        vehicleInfo.model = vehicleMatch[2]
        vehicleInfo.year = vehicleMatch[3]
      }
    }

    // Driver handle
    const driverHandle = formData.full_name
      ?.toLowerCase()
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, '-')
      .trim() || `driver-${Date.now()}`

    // Create driver using workflow
    const { result } = await createDriverWorkflow(req.scope).run({
      input: {
        name: formData.full_name as string,
        license_number: formData.license_number || '',
        vehicle_info: vehicleInfo,
        address: {
          area: formData.area || '',
          street: '',
          city: '',
          state: '',
          postal_code: '',
          country: ''
        },
        email: formData.email || '',
        password: password,
        first_name: formData.full_name?.split(' ')[0] || '',
        last_name: formData.full_name?.split(' ').slice(1).join(' ') || '',
        phone: formData.phone_number || '',
        handle: driverHandle
      }
    })

    // Update driver with additional Typeform data
    await marketplaceService.updateDrivers({
      id: (result as any).driver.id,
      // Personal Information
      full_name: formData.full_name as string,
      email: formData.email,
      phone_number: formData.phone_number,
      area: formData.area,
      has_cell_phone: formData.has_cell_phone,

      // Driver Information
      license_number: formData.license_number,
      profile_photo: formData.profile_photo,
      comfortable_with_gps: formData.comfortable_with_gps === 'true',

      // Vehicle Information
      vehicle_type: formData.vehicle_type || formData['dd71cde8-908f-4f27-ba4e-dc4b6bd8bf12'],

      // Work Information
      current_work_status: formData.current_work_status,
      preferred_hours: formData.preferred_hours,
      has_reliable_vehicle: formData.has_reliable_vehicle === 'true',
      available_weekends: formData.available_weekends === 'true',
      experience_years: formData.experience_years,
      can_lift_packages: formData.can_lift_packages === 'true',

      // Background Check
      criminal_record: formData.criminal_record,
      privacy_agreement: formData.privacy_agreement === 'true',

      // Application tracking
      application_date: new Date(),
      status: 'pending'
    })

    // Mark token as used
    await typeformService.markSubmissionAsUsed(submission.id)

    res.status(200).json({
      message: "Driver account created successfully",
      driver: (result as any).driver
    })
  } catch (error) {
    console.error("Error completing driver signup:", error)
    res.status(500).json({
      message: "Error completing driver signup",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
