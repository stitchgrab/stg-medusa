'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Text, Container, Heading } from '@medusajs/ui'
import Image from 'next/image'
import { checkVendorSession, vendorSignup } from '@/utils/auth'
import Link from 'next/link'

interface ValidationErrors {
  email?: string
  password?: string
  first_name?: string
  last_name?: string
  vendor_name?: string
  vendor_handle?: string
}

export default function VendorSignup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    vendor_name: '',
    vendor_handle: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const router = useRouter()
  const [notLoggedIn, setNotLoggedIn] = useState(true)

  // Validation functions
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email is required'
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return null
  }

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters long'
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number'
    return null
  }

  const validateVendorHandle = (handle: string): string | null => {
    if (!handle) return 'Vendor handle is required'
    if (!/^[a-z0-9-]+$/.test(handle)) {
      return 'Handle must contain only lowercase letters, numbers, and hyphens'
    }
    return null
  }

  const validateRequired = (value: string, fieldName: string): string | null => {
    if (!value.trim()) return `${fieldName} is required`
    return null
  }

  const checkFormValidity = (): boolean => {
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    const firstNameError = validateRequired(formData.first_name, 'First name')
    const lastNameError = validateRequired(formData.last_name, 'Last name')
    const vendorNameError = validateRequired(formData.vendor_name, 'Vendor name')
    const vendorHandleError = validateVendorHandle(formData.vendor_handle)

    return !emailError && !passwordError && !firstNameError && !lastNameError && !vendorNameError && !vendorHandleError
  }

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}

    // Validate each field
    const emailError = validateEmail(formData.email)
    if (emailError) errors.email = emailError

    const passwordError = validatePassword(formData.password)
    if (passwordError) errors.password = passwordError

    const firstNameError = validateRequired(formData.first_name, 'First name')
    if (firstNameError) errors.first_name = firstNameError

    const lastNameError = validateRequired(formData.last_name, 'Last name')
    if (lastNameError) errors.last_name = lastNameError

    const vendorNameError = validateRequired(formData.vendor_name, 'Vendor name')
    if (vendorNameError) errors.vendor_name = vendorNameError

    const vendorHandleError = validateVendorHandle(formData.vendor_handle)
    if (vendorHandleError) errors.vendor_handle = vendorHandleError

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Mark field as touched
    setTouchedFields(prev => new Set([...prev, field]))

    // Clear validation error for this field when user starts typing
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const shouldShowError = (field: string): boolean => {
    return hasSubmitted || touchedFields.has(field)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setHasSubmitted(true)

    // Validate form
    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const session = await vendorSignup(formData)

      // If we get here, signup was successful
      console.log('Signup successful:', session)

      // Redirect to dashboard on successful signup
      router.push('/vendors/dashboard')
      setNotLoggedIn(false)
    } catch (err: any) {
      console.error('Failed to signup:', err)

      // Handle specific error messages from backend
      if (err.message?.includes('already exists')) {
        setError(err.message)
      } else {
        setError('Signup failed. Please check your information and try again.')
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await checkVendorSession()
        if (session.authenticated) {
          router.push('/vendors/dashboard')
          setNotLoggedIn(false)
        }
      } catch (error) {
        // Session check failed, user needs to login/signup
      }
    }
    if (notLoggedIn) {
      checkSession()
    }
  }, [notLoggedIn])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Container className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Heading level="h1" className="text-3xl font-bold text-blue-600">
              <div className="flex items-center justify-center flex-col">
                <Image src="/stitchgrab-logo-transparent.png" alt="StitchGrab" width={250} height={250} />
              </div>
            </Heading>
            <Text className="text-sm text-gray-600 mt-4">Vendor Portal</Text>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white p-4 w-full">
          <Heading level="h2" className="text-2xl font-bold mb-6 text-center text-blue-600">
            Create Account
          </Heading>

          {error && (
            <div className="mb-4 p-3 text-red-600 text-sm text-center bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={e => handleInputChange('first_name', e.target.value)}
                  required
                  disabled={loading}
                  className={validationErrors.first_name && shouldShowError('first_name') ? 'border-red-500' : ''}
                />
                {validationErrors.first_name && shouldShowError('first_name') && (
                  <Text className="text-red-500 text-xs mt-1">{validationErrors.first_name}</Text>
                )}
              </div>
              <div>
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={e => handleInputChange('last_name', e.target.value)}
                  required
                  disabled={loading}
                  className={validationErrors.last_name && shouldShowError('last_name') ? 'border-red-500' : ''}
                />
                {validationErrors.last_name && shouldShowError('last_name') && (
                  <Text className="text-red-500 text-xs mt-1">{validationErrors.last_name}</Text>
                )}
              </div>
            </div>

            <div>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                required
                disabled={loading}
                className={validationErrors.email && shouldShowError('email') ? 'border-red-500' : ''}
              />
              {validationErrors.email && shouldShowError('email') && (
                <Text className="text-red-500 text-xs mt-1">{validationErrors.email}</Text>
              )}
            </div>

            <div>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
                className={validationErrors.password && shouldShowError('password') ? 'border-red-500' : ''}
              />
              {validationErrors.password && shouldShowError('password') && (
                <Text className="text-red-500 text-xs mt-1">{validationErrors.password}</Text>
              )}
              <Text className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters with uppercase, lowercase, and number
              </Text>
            </div>

            {/* Vendor Information */}
            <div>
              <Input
                id="vendor_name"
                type="text"
                placeholder="Store name"
                value={formData.vendor_name}
                onChange={e => handleInputChange('vendor_name', e.target.value)}
                required
                disabled={loading}
                className={validationErrors.vendor_name && shouldShowError('vendor_name') ? 'border-red-500' : ''}
              />
              {validationErrors.vendor_name && shouldShowError('vendor_name') && (
                <Text className="text-red-500 text-xs mt-1">{validationErrors.vendor_name}</Text>
              )}
            </div>

            <div>
              <Input
                id="vendor_handle"
                type="text"
                placeholder="Store handle (e.g., my-store)"
                value={formData.vendor_handle}
                onChange={e => handleInputChange('vendor_handle', e.target.value)}
                required
                disabled={loading}
                className={validationErrors.vendor_handle && shouldShowError('vendor_handle') ? 'border-red-500' : ''}
              />
              {validationErrors.vendor_handle && shouldShowError('vendor_handle') && (
                <Text className="text-red-500 text-xs mt-1">{validationErrors.vendor_handle}</Text>
              )}
              <Text className="text-xs text-gray-500 mt-1">
                Use only lowercase letters, numbers, and hyphens
              </Text>
            </div>

            <div>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone number (optional)"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !checkFormValidity()}
              isLoading={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <Link href="/vendors/login">
              <Text className="text-sm text-gray-500">
                Already have an account? <span className="text-blue-600">Sign in</span>
              </Text>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Text className="text-sm text-gray-500">
            © 2025 StitchGrab. All rights reserved.
          </Text>
        </div>
      </Container>
    </div>
  )
} 