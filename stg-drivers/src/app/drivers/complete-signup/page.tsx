'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input, Text, Container, Heading } from '@medusajs/ui'
import Image from 'next/image'
import { checkDriverSession } from '@/utils/auth'
import Link from 'next/link'

interface FormData {
  full_name: string
  email: string
  phone: string
  driver_name: string
  driver_handle: string
  license_number: string
  vehicle_make: string
  vehicle_model: string
  vehicle_year: string
  vehicle_plate: string
  address_street: string
  address_city: string
  address_state: string
  address_postal_code: string
  address_country: string
}

export default function CompleteSignup() {
  const [formData, setFormData] = useState<FormData | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [notLoggedIn, setNotLoggedIn] = useState(true)

  const token = searchParams.get('token')

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await checkDriverSession()
        if (session.authenticated) {
          // If user is already logged in and has a valid session, redirect to dashboard
          router.push('/drivers/dashboard')
          setNotLoggedIn(false)
        } else {
          // User is not logged in, which is expected for complete-signup flow
          setNotLoggedIn(false)
        }
      } catch (error) {
        // Session check failed, user needs to complete signup
        setNotLoggedIn(false)
      }
    }

    // Only check session if we haven't determined the login state yet
    if (notLoggedIn) {
      checkSession()
    }
  }, [notLoggedIn, router])

  useEffect(() => {
    const fetchFormData = async () => {
      if (!token) {
        setError('Invalid signup token')
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/typeform/temp-data/${token}`)
        if (!response.ok) {
          throw new Error('Failed to fetch form data')
        }
        const data = await response.json()
        setFormData(data.formData)
      } catch (error) {
        console.error('Error fetching form data:', error)
        setError('Failed to load your application data. Please try again.')
      }
    }

    fetchFormData()
  }, [token])

  // Validation functions
  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters long'
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number'
    return null
  }

  const validateConfirmPassword = (confirmPassword: string): string | null => {
    if (!confirmPassword) return 'Please confirm your password'
    if (confirmPassword !== password) return 'Passwords do not match'
    return null
  }

  const checkFormValidity = (): boolean => {
    const passwordError = validatePassword(password)
    const confirmPasswordError = validateConfirmPassword(confirmPassword)
    return !passwordError && !confirmPasswordError
  }

  const validateForm = (): boolean => {
    const errors: { password?: string; confirmPassword?: string } = {}

    const passwordError = validatePassword(password)
    if (passwordError) errors.password = passwordError

    const confirmPasswordError = validateConfirmPassword(confirmPassword)
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: 'password' | 'confirmPassword', value: string) => {
    if (field === 'password') setPassword(value)
    if (field === 'confirmPassword') setConfirmPassword(value)

    // Mark field as touched
    setTouchedFields(prev => new Set([...prev, field]))

    // Real-time validation
    let error: string | null = null

    if (field === 'password') {
      error = validatePassword(value)
    } else if (field === 'confirmPassword') {
      error = validateConfirmPassword(value)
    }

    // Update validation errors in real-time
    setValidationErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }))
  }

  const shouldShowError = (field: string): boolean => {
    // Show errors if field is touched or if form has been submitted
    return touchedFields.has(field) || hasSubmitted
  }

  const getPasswordStrength = (password: string): { strength: 'weak' | 'medium' | 'strong'; color: string } => {
    if (!password) return { strength: 'weak', color: 'text-gray-400' }

    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { strength: 'weak', color: 'text-red-500' }
    if (score <= 3) return { strength: 'medium', color: 'text-yellow-500' }
    return { strength: 'strong', color: 'text-green-500' }
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

    // Additional validation
    if (!token) {
      setError('Invalid signup token. Please check your signup link.')
      setLoading(false)
      return
    }

    try {
      // Clear any previous errors
      setError(null)

      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/typeform/complete-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token,
          password
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || errorData.error || 'Failed to complete signup')
      }

      const data = await response.json()
      console.log('Signup completed successfully:', data)

      // After successful signup, the user should be automatically logged in
      // The backend should set the session cookie, so we can redirect to dashboard
      router.push('/drivers/dashboard')
    } catch (err: any) {
      console.error('Failed to complete signup:', err)
      setError(err.message || 'Failed to complete signup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Text className="text-red-600 mb-4">Invalid signup link</Text>
          <Link href="/drivers/signup">
            <Button>Go to Signup</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text>Loading your application data...</Text>
        </div>
      </div>
    )
  }

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
            <Text className="text-sm text-gray-600 mt-4">Driver Portal</Text>
          </div>
        </div>

        {/* Complete Signup Form */}
        <div className="bg-white p-6 w-full">
          <Heading level="h2" className="text-2xl font-bold mb-6 text-center text-blue-600">
            Complete Your Account
          </Heading>

          {error && (
            <div className="mb-4 p-3 text-red-600 text-sm text-center bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}

          <div className="mb-6">
            <Text className="text-gray-600 mb-4">
              Welcome, {formData.full_name}! Your application has been received.
              Please create a password to complete your account setup.
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={e => handleInputChange('password', e.target.value)}
                required
                disabled={loading}
                className={`${validationErrors.password && shouldShowError('password')
                  ? 'border-red-500'
                  : password && !validationErrors.password
                    ? 'border-green-500'
                    : ''
                  }`}
              />
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getPasswordStrength(password).strength === 'weak' ? 'bg-red-500' :
                      getPasswordStrength(password).strength === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                    <Text className={`text-xs ${getPasswordStrength(password).color}`}>
                      Password strength: {getPasswordStrength(password).strength}
                    </Text>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className={`${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                      ✓ At least 8 characters
                    </div>
                    <div className={`${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                      ✓ Lowercase letter
                    </div>
                    <div className={`${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                      ✓ Uppercase letter
                    </div>
                    <div className={`${/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                      ✓ Number
                    </div>
                  </div>
                </div>
              )}
              {validationErrors.password && shouldShowError('password') && (
                <Text className="text-red-500 text-xs mt-1">{validationErrors.password}</Text>
              )}
            </div>

            <div>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={e => handleInputChange('confirmPassword', e.target.value)}
                required
                disabled={loading}
                className={`${validationErrors.confirmPassword && shouldShowError('confirmPassword')
                  ? 'border-red-500'
                  : confirmPassword && !validationErrors.confirmPassword
                    ? 'border-green-500'
                    : ''
                  }`}
              />
              {confirmPassword && (
                <div className="mt-1">
                  <Text className={`text-xs ${confirmPassword === password ? 'text-green-600' : 'text-red-500'}`}>
                    {confirmPassword === password ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </Text>
                </div>
              )}
              {validationErrors.confirmPassword && shouldShowError('confirmPassword') && (
                <Text className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</Text>
              )}
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

          <div className="text-center mt-6">
            <Link href="/drivers/login">
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
