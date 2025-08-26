'use client'

import { useState, useEffect } from 'react'
import { Button, Text, Heading, Label, Input, Select, Textarea, Badge, DatePicker } from '@medusajs/ui'
import { CheckCircle, XCircle, CreditCard, User, Buildings, CurrencyDollar } from '@medusajs/icons'
import { postToBackend, uploadFileToBackend } from '../utils/fetch'
import { validateOnboardingForm, ValidationError, getNestedValue, setNestedValue, validateDOB } from '../utils/validation'
import { fetchDriverProfile, mergeStripeDataWithProfile, DriverProfile } from '../utils/driver-data'

interface OnboardingFormProps {
  accountId: string
  requirements: any
  onComplete: (status: string) => void
  onError: (error: string) => void
}

interface FormData {
  // Personal Information
  individual?: {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
    dob?: {
      day?: number
      month?: number
      year?: number
    }
    address?: {
      line1?: string
      line2?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
    ssn_last_4?: string
    id_number?: string
    verification?: {
      document?: {
        front?: string
        back?: string
      }
    }
  }
  // Business Profile
  business_profile?: {
    url?: string
    mcc?: string
    product_description?: string
    support_phone?: string
  }
  business_type?: 'individual' | 'company' | 'government_entity' | 'non_profit'
  // External Account (Bank)
  external_account?: {
    object: 'bank_account'
    country: string
    currency: string
    account_holder_name: string
    account_holder_type: 'individual'
    routing_number: string
    account_number: string
  }
  // Additional Verification
  verification?: {
    document?: {
      front?: string
      back?: string
    }
  }
}

const getStorageKey = (accountId: string) => `driver_onboarding_${accountId}`

export default function DriverOnboardingForm({
  accountId,
  requirements,
  onComplete,
  onError
}: OnboardingFormProps) {
  const [formData, setFormData] = useState<FormData>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})

  // Load driver profile and initialize form data
  useEffect(() => {
    const initializeForm = async () => {
      try {
        // Fetch driver profile
        const profile = await fetchDriverProfile()
        setDriverProfile(profile)

        // Load saved form data
        const savedData = localStorage.getItem(getStorageKey(accountId))
        let savedFormData: FormData = {}

        if (savedData) {
          try {
            savedFormData = JSON.parse(savedData)
          } catch (error) {
            console.error('Failed to parse saved form data:', error)
          }
        }

        // Merge profile data with saved data
        let initialData: FormData = {}
        if (profile) {
          initialData = mergeStripeDataWithProfile(savedFormData, profile)
        } else {
          initialData = savedFormData
        }

        // Set default values for required fields if not already set
        if (!initialData.external_account) {
          initialData.external_account = {
            object: 'bank_account',
            country: 'US',
            currency: 'USD',
            account_holder_name: '',
            account_holder_type: 'individual',
            routing_number: '',
            account_number: ''
          }
        } else {
          // Ensure required fields have defaults
          if (!initialData.external_account.country) {
            initialData.external_account.country = 'US'
          }
          if (!initialData.external_account.currency) {
            initialData.external_account.currency = 'USD'
          }
          if (!initialData.external_account.account_holder_type) {
            initialData.external_account.account_holder_type = 'individual'
          }
        }

        setFormData(initialData)

        // Restore current step
        const savedStep = localStorage.getItem(`${getStorageKey(accountId)}_step`)
        if (savedStep) {
          setCurrentStep(parseInt(savedStep, 10))
        }

        setInitialized(true)
      } catch (error) {
        console.error('Failed to initialize form:', error)
        setInitialized(true)
      }
    }

    initializeForm()
  }, [accountId])

  // Save form data whenever it changes
  useEffect(() => {
    if (initialized && Object.keys(formData).length > 0) {
      localStorage.setItem(getStorageKey(accountId), JSON.stringify(formData))
    }
  }, [formData, accountId, initialized])

  // Save current step whenever it changes
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(`${getStorageKey(accountId)}_step`, currentStep.toString())
    }
  }, [currentStep, accountId, initialized])

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: User,
      fields: ['individual.first_name', 'individual.last_name', 'individual.email', 'individual.phone', 'individual.dob']
    },
    {
      id: 'address',
      title: 'Address Information',
      icon: Buildings,
      fields: ['individual.address.line1', 'individual.address.city', 'individual.address.state', 'individual.address.postal_code']
    },
    {
      id: 'banking',
      title: 'Bank Account',
      icon: CurrencyDollar,
      fields: ['external_account.routing_number', 'external_account.account_number', 'external_account.account_holder_name', 'external_account.country', 'external_account.currency']
    },
    {
      id: 'verification',
      title: 'Identity Verification',
      icon: CreditCard,
      fields: ['individual.id_number', 'individual.ssn_last_4', 'individual.verification.document.front', 'individual.verification.document.back']
    }
  ]

  const getRequiredFields = () => {
    if (!requirements) return []

    const required = requirements.currently_due || requirements.eventually_due || []
    return required
  }

  const isFieldRequired = (fieldPath: string) => {
    const requiredFields = getRequiredFields()
    return requiredFields.includes(fieldPath)
  }

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => setNestedValue(prev, path, value))
  }

  const getFieldValue = (path: string) => {
    return getNestedValue(formData, path) || ''
  }

  const validateStep = (stepIndex: number) => {
    const step = steps[stepIndex]
    const requiredFields = getRequiredFields()
    const stepRequiredFields = step.fields.filter(field => requiredFields.includes(field))

    const validation = validateOnboardingForm(formData, stepRequiredFields)
    const newErrors: Record<string, string> = {}

    validation.errors.forEach(error => {
      newErrors[error.field] = error.message
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    const requiredFields = getRequiredFields()

    if (!formData.individual?.dob) {
      setErrors({
        'individual.dob': 'Date of birth is required'
      })
      return
    }

    // Add MCC to the form data
    formData.business_type = 'individual'
    formData.business_profile = {
      mcc: '4215'
    }

    // Update dob field to be month, day, year
    formData.individual.dob = {
      month: new Date(formData.individual?.dob as string).getMonth() + 1,
      day: new Date(formData.individual?.dob as string).getDate(),
      year: new Date(formData.individual?.dob as string).getFullYear()
    }

    if (formData.external_account) {
      formData.external_account.object = 'bank_account'
    }

    const validation = validateOnboardingForm(formData, requiredFields)

    if (!validation.isValid) {
      const newErrors: Record<string, string> = {}
      validation.errors.forEach(error => {
        newErrors[error.field] = error.message
      })
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const response = await postToBackend('/drivers/stripe/update', {
        account_id: accountId,
        update_data: formData
      })

      if (response.is_active) {
        // Clear saved data on successful completion
        localStorage.removeItem(getStorageKey(accountId))
        localStorage.removeItem(`${getStorageKey(accountId)}_step`)
        onComplete('active')
      } else if (response.is_complete) {
        // Clear saved data on successful completion
        localStorage.removeItem(getStorageKey(accountId))
        localStorage.removeItem(`${getStorageKey(accountId)}_step`)
        onComplete('pending_verification')
      } else {
        // Still has required fields - keep data saved
        onComplete('incomplete')
      }
    } catch (error: any) {
      console.error('Onboarding submission error:', error)
      onError(error.message || 'Failed to submit onboarding information')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Clear saved data when canceling
    localStorage.removeItem(getStorageKey(accountId))
    localStorage.removeItem(`${getStorageKey(accountId)}_step`)
    // You might want to call a cancel handler here
  }

  const renderField = (fieldPath: string) => {
    const value = getFieldValue(fieldPath)
    const required = isFieldRequired(fieldPath)
    const error = errors[fieldPath]

    console.log(`Rendering field ${fieldPath}:`, { value, required, error, formData })

    if (fieldPath.includes('dob')) {
      let date = new Date()
      if (value.day && value.month && value.year) {
        date = new Date(value.year, value.month - 1, value.day)
      }
      return (
        <div key={fieldPath} className="space-y-2">
          <Text className={required ? 'text-red-600' : ''}>
            Date of Birth {required && '*'}
          </Text>
          <DatePicker
            name="dob"
            value={date}
            onChange={(e) => updateFormData(fieldPath, e)}
            validate={(value) => validateDOB(value.day, value.month, value.year)}
            isRequired={required}
            className={error ? 'border-red-500' : ''}
          />
        </div>
      )
    }

    if (fieldPath.includes('address')) {
      const addressField = fieldPath.split('.').pop()
      return (
        <div key={fieldPath} className="space-y-2">
          <Label className={required ? 'text-red-600' : ''}>
            {addressField?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} {required && '*'}
          </Label>
          <Input
            value={value}
            onChange={(e) => updateFormData(fieldPath, e.target.value)}
            placeholder={`Enter ${addressField?.replace('_', ' ')}`}
            className={error ? 'border-red-500' : ''}
          />
          {error && <Text className="text-red-600 text-sm">{error}</Text>}
        </div>
      )
    }

    if (fieldPath.includes('verification.document')) {
      const documentType = fieldPath.includes('front') ? 'front' : 'back'
      return (
        <div key={fieldPath} className="space-y-2">
          <Label className={required ? 'text-red-600' : ''}>
            {documentType === 'front' ? 'Front of ID Document' : 'Back of ID Document'} {required && '*'}
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) {
                  try {
                    // Set loading state for this specific file
                    setUploadingFiles(prev => ({ ...prev, [fieldPath]: true }))

                    // Create FormData for file upload
                    const formData = new FormData()
                    formData.append('file', file)

                    // Upload file to our backend
                    const uploadResult = await uploadFileToBackend('/drivers/stripe/upload', formData)

                    // Store the Stripe file ID in the form data
                    updateFormData(fieldPath, uploadResult.file_id)

                    console.log('File uploaded successfully:', uploadResult)
                  } catch (error: any) {
                    console.error('File upload error:', error)
                    alert(`Upload failed: ${error.message}`)
                  } finally {
                    // Clear loading state
                    setUploadingFiles(prev => ({ ...prev, [fieldPath]: false }))
                  }
                }
              }}
              className="hidden"
              id={`file-${fieldPath}`}
            />
            <label htmlFor={`file-${fieldPath}`} className="cursor-pointer">
              <div className="space-y-2">
                <div className="text-gray-600">
                  {uploadingFiles[fieldPath] ? (
                    <div>
                      <Text className="text-sm">Uploading file...</Text>
                      <Text className="text-xs text-gray-500">Please wait</Text>
                    </div>
                  ) : value ? (
                    <div>
                      <Text className="text-sm">File uploaded successfully ✓</Text>
                      <Text className="text-xs text-gray-500">File ID: {value}</Text>
                      <Button
                        variant="secondary"
                        size="base"
                        onClick={(e) => {
                          e.preventDefault()
                          updateFormData(fieldPath, '')
                          const input = document.getElementById(`file-${fieldPath}`) as HTMLInputElement
                          if (input) input.value = ''
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Text className="text-sm">Click to upload or drag and drop</Text>
                      <Text className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</Text>
                    </div>
                  )}
                </div>
              </div>
            </label>
          </div>
          <Text className="text-xs text-gray-600">
            Upload a clear photo of the {documentType} of your government-issued ID (driver's license, passport, or state ID)
          </Text>
          {error && <Text className="text-red-600 text-sm">{error}</Text>}
        </div>
      )
    }

    if (fieldPath.includes('external_account')) {
      if (fieldPath.includes('currency')) {
        return (
          <div key={fieldPath} className="space-y-2">
            <Label className={required ? 'text-red-600' : ''}>
              Currency {required && '*'}
            </Label>
            <Select
              value={value || "USD"}
              onValueChange={(newValue) => updateFormData(fieldPath, newValue)}
            >
              <option value="USD">USD - US Dollar</option>
            </Select>
            {error && <Text className="text-red-600 text-sm">{error}</Text>}
          </div>
        )
      }

      if (fieldPath.includes('country')) {
        return (
          <div key={fieldPath} className="space-y-2">
            <Label className={required ? 'text-red-600' : ''}>
              Country {required && '*'}
            </Label>
            <Select
              value={value || "US"}
              onValueChange={(newValue) => updateFormData(fieldPath, newValue)}
            >
              <option value="US">United States</option>
            </Select>
            {error && <Text className="text-red-600 text-sm">{error}</Text>}
          </div>
        )
      }

      const bankField = fieldPath.split('.').pop()
      return (
        <div key={fieldPath} className="space-y-2">
          <Label className={required ? 'text-red-600' : ''}>
            {bankField?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} {required && '*'}
          </Label>
          <Input
            value={value}
            onChange={(e) => updateFormData(fieldPath, e.target.value)}
            placeholder={`Enter ${bankField?.replace('_', ' ')}`}
            className={error ? 'border-red-500' : ''}
            type={bankField === 'account_number' ? 'password' : 'text'}
          />
          {error && <Text className="text-red-600 text-sm">{error}</Text>}
        </div>
      )
    }

    // Default text input
    return (
      <div key={fieldPath} className="space-y-2">
        <Label className={required ? 'text-red-600' : ''}>
          {fieldPath.split('.').pop()?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} {required && '*'}
        </Label>
        <Input
          value={value}
          onChange={(e) => updateFormData(fieldPath, e.target.value)}
          placeholder={`Enter ${fieldPath.split('.').pop()?.replace('_', ' ')}`}
          className={error ? 'border-red-500' : ''}
          type={fieldPath.includes('id_number') ? 'password' : 'text'}
        />
        {error && <Text className="text-red-600 text-sm">{error}</Text>}
      </div>
    )
  }

  if (!initialized) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <Text>Loading your information...</Text>
      </div>
    )
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Error Message */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <Text className="text-red-700">
            There are errors in the form. Please fix them before submitting.
            <ul className="list-disc list-inside mt-2 pl-4">
              {Object.keys(errors).map(key => (
                <li key={key}>{errors[key]}</li>
              ))}
            </ul>
          </Text>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
              )}
            </div>
          ))}
        </div>
        <Text className="text-center text-gray-600">
          Step {currentStep + 1} of {steps.length}: {currentStepData.title}
        </Text>
      </div>

      {/* Current Step Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <currentStepData.icon className="h-6 w-6 text-blue-600" />
          <Heading level="h2" className="text-lg font-semibold">
            {currentStepData.title}
          </Heading>
        </div>

        <div className="space-y-4">
          {currentStepData.fields.map(field => renderField(field))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Complete Onboarding'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </div>
      </div>

      {/* Requirements Info */}
      {requirements && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <Text className="text-sm text-blue-800">
            <strong>Required Fields:</strong> {getRequiredFields().join(', ')}
          </Text>
        </div>
      )}

      {/* Auto-save indicator */}
      <div className="mt-4 text-center">
        <Text className="text-xs text-gray-500">
          💾 Your progress is automatically saved
        </Text>
      </div>
    </div>
  )
}
