'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Text, Heading, Label, Badge } from '@medusajs/ui'
import { CheckCircle, XCircle, CreditCard } from '@medusajs/icons'
import { getFromBackend, postToBackend } from '../../../../utils/fetch'
import StripeStatusUpdates from '../../../../components/StripeStatusUpdates'
import DriverOnboardingForm from '../../../../components/DriverOnboardingForm'

interface StripeAccount {
  stripe_account_id: string
  stripe_account_status: string
  is_connected: boolean
  requirements?: any
}

export default function StripeSettingsPage() {
  const searchParams = useSearchParams()
  const [stripeAccount, setStripeAccount] = useState<StripeAccount | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realtimeStatus, setRealtimeStatus] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingData, setOnboardingData] = useState<any>(null)

  useEffect(() => {
    loadStripeStatus()
  }, [])

  useEffect(() => {
    // Check for return from Stripe onboarding
    const accountId = searchParams.get('account_id')
    const errorParam = searchParams.get('error')
    const isComplete = searchParams.get('complete')
    const isRetry = searchParams.get('retry')

    if (accountId) {
      // Check if this is a fresh onboarding or returning from Stripe
      const isReturningFromStripe = sessionStorage.getItem('stripe_onboarding_started') === accountId

      if (isReturningFromStripe) {
        // Complete the onboarding process
        completeOnboarding(accountId)
        // Clear the session storage
        sessionStorage.removeItem('stripe_onboarding_started')
      } else if (isRetry) {
        // This is a retry - create a new account link for the existing account
        handleRetry(accountId)
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
      const response = await getFromBackend('/drivers/stripe/connect')
      setStripeAccount(response)

      // If account exists but is incomplete, show onboarding
      if (response.stripe_account_id && response.stripe_account_status === 'pending_onboarding') {
        setShowOnboarding(true)
        setOnboardingData({
          accountId: response.stripe_account_id,
          requirements: response.requirements
        })
      }
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

  const handleRetry = async (accountId: string) => {
    setConnecting(true)
    setError(null)

    try {
      // Create a new account link for the existing account
      const response = await postToBackend('/drivers/stripe/connect', { account_id: accountId })

      if (response.account_id) {
        setShowOnboarding(true)
        setOnboardingData({
          accountId: response.account_id,
          requirements: response.requirements
        })
      } else {
        setError('Failed to create Stripe account link for retry')
      }
    } catch (error) {
      console.error('Failed to retry Stripe connection:', error)
      setError('Failed to retry Stripe connection')
    } finally {
      setConnecting(false)
    }
  }

  const completeOnboarding = async (accountId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await postToBackend('/drivers/stripe/complete', { account_id: accountId })

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
      const response = await postToBackend('/drivers/stripe/connect', {})

      if (response.account_id) {
        // Store the account_id
        sessionStorage.setItem('stripe_account_id', response.account_id)

        // Show the onboarding form
        setShowOnboarding(true)
        setOnboardingData({
          accountId: response.account_id,
          requirements: response.requirements
        })
      } else {
        setError('Failed to create Stripe account')
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

  const handleOnboardingComplete = async (status: string) => {
    console.log('Onboarding completed with status:', status)

    if (status === 'active') {
      // Account is fully active
      setShowOnboarding(false)
      await loadStripeStatus()
    } else if (status === 'pending_verification') {
      // Account is complete but pending verification
      setShowOnboarding(false)
      await loadStripeStatus()
    } else {
      // Still incomplete
      setError('Please complete all required fields to continue.')
    }
  }

  const handleOnboardingError = (error: string) => {
    setError(error)
  }

  // If showing onboarding form, render it
  if (showOnboarding && onboardingData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-6 w-6 text-gray-600" />
            <Heading level="h1" className="text-2xl font-semibold">
              Complete Your Stripe Onboarding
            </Heading>
          </div>
          <Text className="text-gray-600">
            Please provide the required information to complete your Stripe account setup.
          </Text>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <Text className="text-red-800">{error}</Text>
          </div>
        )}

        <DriverOnboardingForm
          accountId={onboardingData.accountId}
          requirements={onboardingData.requirements}
          onComplete={handleOnboardingComplete}
          onError={handleOnboardingError}
        />

        <div className="mt-6 text-center">
          <Button
            variant="secondary"
            onClick={() => {
              // Clear saved data when canceling
              if (onboardingData?.accountId) {
                localStorage.removeItem(`driver_onboarding_${onboardingData.accountId}`)
                localStorage.removeItem(`driver_onboarding_${onboardingData.accountId}_step`)
              }
              setShowOnboarding(false)
              setOnboardingData(null)
            }}
          >
            Cancel Onboarding
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="h-6 w-6 text-gray-600" />
          <Heading level="h1" className="text-2xl font-semibold">
            Stripe Connection
          </Heading>
        </div>
        <Text className="text-gray-600">
          Connect your Stripe account to receive payments for your deliveries.
        </Text>
      </div>

      {/* Real-time Status Updates - Always show */}
      <div className="mb-6">
        <StripeStatusUpdates
          initialStatus={stripeAccount?.stripe_account_status || 'unknown'}
          onStatusChange={handleRealtimeStatusUpdate}
          onStartOnboarding={() => {
            if (stripeAccount?.stripe_account_id) {
              setShowOnboarding(true)
              setOnboardingData({
                accountId: stripeAccount.stripe_account_id,
                requirements: stripeAccount.requirements
              })
            } else {
              handleConnect()
            }
          }}
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
                  Your Stripe account is active and ready to receive payments for deliveries.
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
                  Your account is connected but requires verification before receiving payments.
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
                <Text className="text-sm text-gray-600">Individual</Text>
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
                Connect your Stripe account to start receiving payments for deliveries.
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
