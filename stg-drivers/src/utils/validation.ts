export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Validation functions for individual fields
export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Please enter a valid email address'
  return null
}

export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'Phone number is required'
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '')
  if (digitsOnly.length < 10) return 'Please enter a valid phone number'
  return null
}

export const validateName = (name: string, fieldName: string): string | null => {
  if (!name) return `${fieldName} is required`
  if (name.length < 2) return `${fieldName} must be at least 2 characters`
  if (name.length > 50) return `${fieldName} must be less than 50 characters`
  return null
}

export const validateDOB = (day: number, month: number, year: number): string | null => {
  if (!day || !month || !year) return 'Date of birth is required'

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const minYear = currentYear - 100
  const maxYear = currentYear - 18 // Must be at least 18 years old

  if (year < minYear || year > maxYear) {
    return 'You must be at least 18 years old and not older than 100 years'
  }

  const dob = new Date(year, month - 1, day)
  if (dob.getFullYear() !== year || dob.getMonth() !== month - 1 || dob.getDate() !== day) {
    return 'Please enter a valid date of birth'
  }

  return null
}

export const validateAddress = (address: string, fieldName: string): string | null => {
  if (!address) return `${fieldName} is required`
  if (address.length < 5) return `${fieldName} must be at least 5 characters`
  if (address.length > 100) return `${fieldName} must be less than 100 characters`
  return null
}

export const validatePostalCode = (postalCode: string): string | null => {
  if (!postalCode) return 'Postal code is required'
  const postalRegex = /^\d{5}(-\d{4})?$/
  if (!postalRegex.test(postalCode)) return 'Please enter a valid US postal code'
  return null
}

export const validateSSN = (ssn: string): string | null => {
  if (!ssn) return 'Last 4 digits of SSN is required'
  const ssnRegex = /^\d{4}$/
  if (!ssnRegex.test(ssn)) return 'Please enter the last 4 digits of your SSN'
  return null
}

export const validateRoutingNumber = (routingNumber: string): string | null => {
  if (!routingNumber) return 'Routing number is required'
  const routingRegex = /^\d{9}$/
  if (!routingRegex.test(routingNumber)) return 'Please enter a valid 9-digit routing number'
  return null
}

export const validateAccountNumber = (accountNumber: string): string | null => {
  if (!accountNumber) return 'Account number is required'
  if (accountNumber.length < 4) return 'Account number must be at least 4 digits'
  if (accountNumber.length > 17) return 'Account number must be less than 17 digits'
  return null
}

// Main validation function for the entire form
export const validateOnboardingForm = (formData: any, requiredFields: string[]): ValidationResult => {
  const errors: ValidationError[] = []

  // Validate required fields based on Stripe requirements
  requiredFields.forEach(field => {
    const value = getNestedValue(formData, field)

    switch (field) {
      case 'individual.first_name':
        const firstNameError = validateName(value, 'First name')
        if (firstNameError) errors.push({ field, message: firstNameError })
        break

      case 'individual.last_name':
        const lastNameError = validateName(value, 'Last name')
        if (lastNameError) errors.push({ field, message: lastNameError })
        break

      case 'individual.email':
        const emailError = validateEmail(value)
        if (emailError) errors.push({ field, message: emailError })
        break

      case 'individual.phone':
        const phoneError = validatePhone(value)
        if (phoneError) errors.push({ field, message: phoneError })
        break

      case 'individual.dob':
        const dob = formData.individual?.dob
        if (dob) {
          const dobError = validateDOB(dob.day, dob.month, dob.year)
          if (dobError) errors.push({ field, message: dobError })
        } else {
          errors.push({ field, message: 'Date of birth is required' })
        }
        break

      case 'individual.address.line1':
        const addressError = validateAddress(value, 'Address')
        if (addressError) errors.push({ field, message: addressError })
        break

      case 'individual.address.city':
        const cityError = validateAddress(value, 'City')
        if (cityError) errors.push({ field, message: cityError })
        break

      case 'individual.address.state':
        if (!value) errors.push({ field, message: 'State is required' })
        break

      case 'individual.address.postal_code':
        const postalError = validatePostalCode(value)
        if (postalError) errors.push({ field, message: postalError })
        break

      case 'individual.ssn_last_4':
        const ssnError = validateSSN(value)
        if (ssnError) errors.push({ field, message: ssnError })
        break

      case 'individual.id_number':
        const driverLicenseError = validateDriverLicense(value)
        if (driverLicenseError) errors.push({ field, message: driverLicenseError })
        break

      case 'external_account.routing_number':
        const routingError = validateRoutingNumber(value)
        if (routingError) errors.push({ field, message: routingError })
        break

      case 'external_account.account_number':
        const accountError = validateAccountNumber(value)
        if (accountError) errors.push({ field, message: accountError })
        break

      case 'external_account.account_holder_name':
        const holderError = validateName(value, 'Account holder name')
        if (holderError) errors.push({ field, message: holderError })
        break

      default:
        // For any other required field, just check if it exists
        if (!value) {
          const fieldName = field.split('.').pop()?.replace('_', ' ') || field
          errors.push({ field, message: `${fieldName} is required` })
        }
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Helper function to get nested object values
export const getNestedValue = (obj: any, path: string): any => {
  const keys = path.split('.')
  let current = obj

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }

  return current
}

// Helper function to set nested object values
export const setNestedValue = (obj: any, path: string, value: any): any => {
  const keys = path.split('.')
  const newObj = { ...obj }
  let current = newObj

  for (let i = 0;i < keys.length - 1;i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {}
    }
    current = current[keys[i]]
  }

  current[keys[keys.length - 1]] = value
  return newObj
}

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, '')
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
  }
  return phone
}

// Format SSN for display (show only last 4 digits)
export const formatSSN = (ssn: string): string => {
  if (ssn.length === 4) {
    return `***-**-${ssn}`
  }
  return ssn
}

export const validateDriverLicense = (license: string): string | null => {
  if (!license) return 'Driver license number is required'
  if (license.length < 5) return 'Driver license number must be at least 5 characters'
  if (license.length > 20) return 'Driver license number must be less than 20 characters'
  // Basic format check - most US driver's licenses are alphanumeric
  if (!/^[A-Za-z0-9\s\-]+$/.test(license)) {
    return 'Driver license number contains invalid characters'
  }
  return null
}
