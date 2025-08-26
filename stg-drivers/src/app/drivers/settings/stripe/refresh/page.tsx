'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Text, Heading } from '@medusajs/ui'
import { CreditCard } from '@medusajs/icons'

export default function StripeRefreshPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get the account_id from session storage
    const accountId = sessionStorage.getItem('stripe_account_id')

    if (!accountId) {
      setError('No Stripe account ID found. Please try connecting again.')
      setLoading(false)
      return
    }

    // Redirect back to the main Stripe settings page with the account_id
    router.push(`/drivers/settings/stripe?complete=true&account_id=${accountId}`)
  }, [router])

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <CreditCard className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <Heading level="h1" className="text-xl font-semibold mb-2">
            Stripe Connection Error
          </Heading>
          <Text className="text-gray-600 mb-4">{error}</Text>
          <button
            onClick={() => router.push('/drivers/settings/stripe')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Stripe Settings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center">
        <CreditCard className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
        <Heading level="h1" className="text-xl font-semibold mb-2">
          Completing Stripe Setup
        </Heading>
        <Text className="text-gray-600">
          Please wait while we complete your Stripe account setup...
        </Text>
      </div>
    </div>
  )
}
