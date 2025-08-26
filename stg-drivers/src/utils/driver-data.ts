import { getFromBackend } from './fetch'

export interface DriverProfile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
  date_of_birth?: {
    day?: number
    month?: number
    year?: number
  }
}

export const fetchDriverProfile = async (): Promise<DriverProfile | null> => {
  try {
    const response = await getFromBackend('/drivers/profile')
    console.log('Driver profile response:', response)

    // The response is wrapped in a 'driver' object
    if (response && response.driver) {
      const driver = response.driver

      // Map the driver data to our expected format
      const profile: DriverProfile = {
        id: driver.id,
        email: driver.email,
        first_name: driver.first_name,
        last_name: driver.last_name,
        phone: driver.phone_number,
        address: driver.address,
        date_of_birth: driver.date_of_birth
      }

      console.log('Mapped driver profile:', profile)
      return profile
    }

    console.log('No driver data found in response')
    return null
  } catch (error) {
    console.error('Failed to fetch driver profile:', error)
    return null
  }
}

export const formatDriverDataForStripe = (driverProfile: DriverProfile) => {
  const stripeData: any = {
    individual: {}
  }

  // Map driver profile to Stripe format
  if (driverProfile.first_name) {
    stripeData.individual.first_name = driverProfile.first_name
  }

  if (driverProfile.last_name) {
    stripeData.individual.last_name = driverProfile.last_name
  }

  if (driverProfile.email) {
    stripeData.individual.email = driverProfile.email
  }

  if (driverProfile.phone) {
    stripeData.individual.phone = driverProfile.phone
  }

  if (driverProfile.date_of_birth) {
    stripeData.individual.dob = driverProfile.date_of_birth
  }

  if (driverProfile.address) {
    stripeData.individual.address = {
      line1: driverProfile.address.line1,
      line2: driverProfile.address.line2,
      city: driverProfile.address.city,
      state: driverProfile.address.state,
      postal_code: driverProfile.address.postal_code,
      country: driverProfile.address.country || 'US'
    }
  }

  return stripeData
}

export const mergeStripeDataWithProfile = (stripeData: any, driverProfile: DriverProfile) => {
  const merged = formatDriverDataForStripe(driverProfile)

  // Merge with existing Stripe data, keeping Stripe data as priority
  if (stripeData.individual) {
    merged.individual = {
      ...merged.individual,
      ...stripeData.individual
    }
  }

  // Add any additional Stripe fields that aren't in profile
  if (stripeData.external_account) {
    merged.external_account = stripeData.external_account
  }

  if (stripeData.verification) {
    merged.verification = stripeData.verification
  }

  return merged
}
