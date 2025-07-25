"use client"

import { useState } from "react"
import { Button, Heading, Text, Input } from "@medusajs/ui"
import { MapPin, ArrowLeft } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import LocationModal from "@modules/layout/components/location-modal"
import { useRouter } from "next/navigation"

// Custom Mail icon component
const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const ComingSoonTemplate = () => {
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    try {
      // Here you would typically send the email to your backend/newsletter service
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting email:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLocationSet = (locationData: any) => {
    // If new location is in launch area, redirect to home
    if (locationData.isInLaunchArea) {
      router.push('/')
    }
    // If still outside launch area, modal will show the zipcode validation error
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Back Link */}
        <div className="mb-8">
          <LocalizedClientLink 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </LocalizedClientLink>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-white" />
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <Heading level="h1" className="text-4xl md:text-5xl font-bold text-gray-900">
              Coming Soon to Your Area!
            </Heading>
            <Text className="text-xl text-gray-600 max-w-lg mx-auto">
              StitchGrab is expanding! We're working hard to bring same-day fashion delivery to your location.
            </Text>
          </div>

          {/* Current Launch Area */}
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Currently Available In
            </Text>
            <Text className="text-lg font-semibold text-gray-900">
              South Miami Area
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Selected zip codes in Miami-Dade County
            </Text>
          </div>

          {/* Email Signup */}
          {!isSubmitted ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <MailIcon className="w-5 h-5 text-orange-500" />
                <Text className="font-semibold text-gray-900">Get Notified</Text>
              </div>
              <Text className="text-gray-600 mb-6 text-sm">
                Be the first to know when StitchGrab launches in your area
              </Text>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Notify Me'}
                </Button>
              </form>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-green-800">
                <Text className="font-semibold mb-2">Thanks for signing up!</Text>
                <Text className="text-sm">
                  We'll email you as soon as StitchGrab is available in your area.
                </Text>
              </div>
            </div>
          )}

          {/* Change Location */}
          <div className="pt-6">
            <Text className="text-gray-500 text-sm mb-4">
              Want to shop for a different location?
            </Text>
            <Button
              onClick={() => setShowLocationModal(true)}
              variant="secondary"
              className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Change Location
            </Button>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSet={handleLocationSet}
      />
    </div>
  )
}

export default ComingSoonTemplate 