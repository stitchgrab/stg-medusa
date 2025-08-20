'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Text, Container, Heading } from '@medusajs/ui'
import Image from 'next/image'
import { checkDriverSession } from '@/utils/auth'
import Link from 'next/link'
import { Widget } from '@typeform/embed-react'

export default function DriverSignup() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTypeform, setShowTypeform] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [notLoggedIn, setNotLoggedIn] = useState(true)

  // Check if user is completing signup after Typeform
  const token = searchParams.get('token')
  const isCompletingSignup = !!token

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await checkDriverSession()
        if (session.authenticated) {
          router.push('/drivers/dashboard')
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

  const handleStartApplication = () => {
    setShowTypeform(true)
  }

  const handleTypeformSubmit = (event: any) => {
    console.log('Typeform submitted:', event)
    // The webhook will handle the form submission
    // User will be redirected to complete-signup page by Typeform
  }

  const handleTypeformClose = () => {
    setShowTypeform(false)
  }

  if (isCompletingSignup) {
    // Redirect to complete signup page
    router.push(`/drivers/complete-signup?token=${token}`)
    return null
  }

  if (showTypeform) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Text className="text-white font-bold text-sm">S</Text>
              </div>
              <Text className="ml-2 font-semibold text-gray-900">StitchGrab</Text>
            </div>
            <Button
              variant="transparent"
              size="small"
              onClick={handleTypeformClose}
            >
              Close Application
            </Button>
          </div>
        </div>

        {/* Typeform Embed */}
        <div className="h-[calc(100vh-80px)]">
          <Widget
            id={process.env.NEXT_PUBLIC_TYPEFORM_ID || "YOUR_FORM_ID"}
            style={{ width: '100%', height: '100%' }}
            className="w-full h-full"
            onSubmit={handleTypeformSubmit}
            onClose={handleTypeformClose}
            enableSandbox={process.env.NODE_ENV === 'development'}
            hidden={{
              // You can add hidden fields here if needed
            }}
          />
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

        {/* Signup Form */}
        <div className="bg-white p-6 w-full">
          <Heading level="h2" className="text-2xl font-bold mb-6 text-center text-blue-600">
            Join Our Driver Network
          </Heading>

          {error && (
            <div className="mb-4 p-3 text-red-600 text-sm text-center bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="text-center">
              <Text className="text-gray-600 mb-4">
                Complete our driver application form to get started. You'll need to provide:
              </Text>
              <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
                <li>• Personal information (name, email, phone)</li>
                <li>• Driver license and vehicle details</li>
                <li>• Address and contact information</li>
                <li>• Vehicle make, model, and license plate</li>
              </ul>
            </div>

            <Button
              onClick={handleStartApplication}
              className="w-full"
              disabled={loading}
              isLoading={loading}
            >
              {loading ? "Loading..." : "Start Application"}
            </Button>

            <div className="text-center">
              <Text className="text-xs text-gray-500">
                By clicking "Start Application", you'll complete our secure application form.
              </Text>
            </div>
          </div>

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
