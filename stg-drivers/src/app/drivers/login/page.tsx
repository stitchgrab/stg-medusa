'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Text, Container, Heading } from '@medusajs/ui'
import Image from 'next/image'
import { checkDriverSession, driverLogin } from '@/utils/auth'
import Link from 'next/link'

export default function DriverLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({})
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
    return null
  }

  const checkFormValidity = (): boolean => {
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    return !emailError && !passwordError
  }

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}

    const emailError = validateEmail(email)
    if (emailError) errors.email = emailError

    const passwordError = validatePassword(password)
    if (passwordError) errors.password = passwordError

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)

    // Mark field as touched
    setTouchedFields(prev => new Set([...prev, field]))

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
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
      const session = await driverLogin(email, password)

      // If we get here, login was successful
      console.log('Login successful:', session)

      // Redirect to dashboard on successful login
      router.push('/drivers/dashboard')
      setNotLoggedIn(false)
    } catch (err: any) {
      console.error('Failed to login:', err)

      // Handle specific error messages from backend
      if (err.message?.includes('Invalid credentials')) {
        setError('Invalid email or password. Please try again.')
      } else {
        setError('Login failed. Please check your credentials.')
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await checkDriverSession()
        if (session.authenticated) {
          router.push('/drivers/dashboard')
          setNotLoggedIn(false)
        }
      } catch (error) {
        // Session check failed, user needs to login
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
            <Text className="text-sm text-gray-600 mt-4">Driver Portal</Text>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white p-4 w-full">
          <Heading level="h2" className="text-2xl font-bold mb-6 text-center text-blue-600">
            Sign In
          </Heading>

          {error && (
            <div className="mb-4 p-3 text-red-600 text-sm text-center bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
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
                value={password}
                onChange={e => handleInputChange('password', e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                placeholder="Enter your password"
                className={`w-full ${validationErrors.password && shouldShowError('password') ? 'border-red-500' : ''}`}
              />
              {validationErrors.password && shouldShowError('password') && (
                <Text className="text-red-500 text-xs mt-1">{validationErrors.password}</Text>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !checkFormValidity()}
              isLoading={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <Link href="/drivers/signup">
              <Text className="text-sm text-gray-500">
                Don't have an account? <span className="text-blue-600">Sign up</span>
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
