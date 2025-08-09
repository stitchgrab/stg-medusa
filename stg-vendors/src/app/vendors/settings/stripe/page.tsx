'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Text, Heading, Input, Label, Badge } from '@medusajs/ui'
import { CheckCircle, XCircle } from '@medusajs/icons'
import { getFromBackend, postToBackend } from '@/utils/fetch'
import StripeStatusUpdates from '@/components/StripeStatusUpdates'

interface StripeAccount {
  stripe_account_id: string
  stripe_account_status: string
  is_connected: boolean
}

export default function StripeSettingsPage() {
  const searchParams = useSearchParams()
  const [stripeAccount, setStripeAccount] = useState<StripeAccount | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realtimeStatus, setRealtimeStatus] = useState<string | null>(null)

  useEffect(() => {
    loadStripeStatus()
  }, [])

  useEffect(() => {
    // Check for return from Stripe onboarding
    const accountId = searchParams.get('account_id')
    const errorParam = searchParams.get('error')
    const isComplete = searchParams.get('complete')

    if (accountId) {
      // Check if this is a fresh onboarding or returning from Stripe
      const isReturningFromStripe = sessionStorage.getItem('stripe_onboarding_started') === accountId

      if (isReturningFromStripe) {
        // Complete the onboarding process
        completeOnboarding(accountId)
        // Clear the session storage
        sessionStorage.removeItem('stripe_onboarding_started')
      } else {
        // This might be a fresh page load with account_id, just load status
        loadStripeStatus()
      }
    }

    // Handle complete parameter in URL
    if (isComplete === 'true' || isComplete === '1') {
      const storedAccountId = sessionStorage.getItem('stripe_account_id') || searchParams.get('account_id')
      if (storedAccountId) {
        completeOnboarding(storedAccountId)
        // Clear the session storage
        sessionStorage.removeItem('stripe_onboarding_started')
        sessionStorage.removeItem('stripe_account_id')
      } else {
        setError('No Stripe account ID found. Please try connecting again.')
      }
    }

    if (errorParam) {
      setError(`Stripe connection error: ${errorParam}`)
    }
  }, [searchParams])

  const loadStripeStatus = async () => {
    try {
      const response = await getFromBackend('/vendors/stripe/connect')
      setStripeAccount(response)
    } catch (error) {
      console.error('Failed to load Stripe status:', error)
      setError('Failed to load Stripe connection status')
    } finally {
      setLoading(false)
    }
  }

  const handleRealtimeStatusUpdate = (statusUpdate: any) => {
    console.log('Real-time status update received:', statusUpdate)
    setRealtimeStatus(statusUpdate.status)

    // Update the stripe account status when we get real-time updates
    if (stripeAccount) {
      setStripeAccount({
        ...stripeAccount,
        stripe_account_status: statusUpdate.status
      })
    }

    // If status becomes active, reload full account info
    if (statusUpdate.status === 'active') {
      loadStripeStatus()
    }
  }

  const completeOnboarding = async (accountId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await postToBackend('/vendors/stripe/complete', { account_id: accountId })

      console.log('Onboarding completed:', response)

      if (response.account_status === 'incomplete') {
        setError('Stripe onboarding incomplete. Please complete all required fields in the Stripe form.')
        // Clear the session storage so they can retry
        sessionStorage.removeItem('stripe_onboarding_started')
        sessionStorage.removeItem('stripe_account_id')
      } else if (response.account_status === 'active') {
        // Success - reload the Stripe status
        await loadStripeStatus()
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
      setError('Failed to complete Stripe onboarding')
      // Clear the session storage so they can retry
      sessionStorage.removeItem('stripe_onboarding_started')
      sessionStorage.removeItem('stripe_account_id')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    setConnecting(true)
    setError(null)

    try {
      const response = await postToBackend('/vendors/stripe/connect', {})

      if (response.account_link_url) {
        // Store the account_id and mark onboarding as started
        if (response.account_id) {
          sessionStorage.setItem('stripe_account_id', response.account_id)
          sessionStorage.setItem('stripe_onboarding_started', response.account_id)
        }

        // Redirect to Stripe onboarding
        window.location.href = response.account_link_url
      } else {
        setError('Failed to create Stripe account link')
      }
    } catch (error) {
      console.error('Failed to connect Stripe:', error)
      setError('Failed to initiate Stripe connection')
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    setDisconnecting(true)
    try {
      // TODO: Implement Stripe disconnection
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStripeAccount(null)
    } catch (error) {
      console.error('Failed to disconnect Stripe:', error)
      setError('Failed to disconnect Stripe')
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Heading level="h1" className="text-2xl font-semibold mb-2">
          Stripe Connection
        </Heading>
        <Text className="text-gray-600">
          Connect your Stripe account to process payments for your orders.
        </Text>
      </div>

      {/* Real-time Status Updates - Always show */}
      <div className="mb-6">
        <StripeStatusUpdates
          initialStatus={stripeAccount?.stripe_account_status || 'unknown'}
          onStatusChange={handleRealtimeStatusUpdate}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Heading level="h2" className="text-lg font-semibold">
              Payment Processing
            </Heading>
            <Text className="text-sm text-gray-500 mt-1">
              Secure payment processing with Stripe
            </Text>
          </div>
          <Badge color={stripeAccount?.is_connected ? "green" : (stripeAccount?.stripe_account_id ? "orange" : "red")}>
            {stripeAccount?.is_connected ? (
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </div>
            ) : stripeAccount?.stripe_account_id ? (
              <div className="flex items-center">
                <div className="h-3 w-3 mr-1 rounded-full bg-yellow-500" />
                Verifying
              </div>
            ) : (
              <div className="flex items-center">
                <XCircle className="h-3 w-3 mr-1" />
                Not Connected
              </div>
            )}
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <Text>Loading Stripe connection status...</Text>
          </div>
        ) : stripeAccount?.stripe_account_id ? (
          <div className="space-y-4">
            {stripeAccount?.is_connected ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <Text className="text-green-800 font-medium">
                    Stripe account connected and active
                  </Text>
                </div>
                <Text className="text-green-700 text-sm mt-1">
                  Your Stripe account is active and ready to process payments.
                </Text>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-yellow-500 mr-2" />
                  <Text className="text-yellow-800 font-medium">
                    Stripe account being verified
                  </Text>
                </div>
                <Text className="text-yellow-700 text-sm mt-1">
                  Your account is connected but requires verification before processing payments.
                </Text>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label>Account ID</Label>
                <Text className="text-sm text-gray-600">{stripeAccount?.stripe_account_id || 'N/A'}</Text>
              </div>
              <div>
                <Label>Account Status</Label>
                <Text className="text-sm text-gray-600">{stripeAccount?.stripe_account_status || 'N/A'}</Text>
              </div>
              <div>
                <Label>Account Type</Label>
                <Text className="text-sm text-gray-600">Standard</Text>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="danger"
                onClick={handleDisconnect}
                disabled={disconnecting}
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect Stripe'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <Text className="text-red-800">{error}</Text>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <Text className="text-yellow-800 font-medium">
                  Stripe account not connected
                </Text>
              </div>
              <Text className="text-yellow-700 text-sm mt-1">
                Connect your Stripe account to start accepting payments.
              </Text>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Benefits of connecting Stripe:</Label>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Secure payment processing</li>
                  <li>• Automatic payouts to your bank account</li>
                  <li>• Detailed transaction reports</li>
                  <li>• Fraud protection and dispute handling</li>
                </ul>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleConnect}
                  disabled={connecting}
                >
                  {connecting ? 'Connecting...' : 'Connect Stripe Account'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 