'use client'

import { useEffect, useState } from 'react'
import { Badge, Text, Button } from '@medusajs/ui'
import { vendorSSE, type SSEMessage } from '@/utils/sse'

type StripeStatus = {
  status: string
  message: string
  timestamp: string
  accountId?: string
}

interface StripeStatusUpdatesProps {
  initialStatus?: string
  onStatusChange?: (status: StripeStatus) => void
}

export default function StripeStatusUpdates({
  initialStatus = 'unknown',
  onStatusChange
}: StripeStatusUpdatesProps) {
  const [status, setStatus] = useState<StripeStatus>({
    status: initialStatus,
    message: getInitialMessage(initialStatus),
    timestamp: new Date().toISOString()
  })
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  // Update status when initialStatus prop changes (e.g., after page refresh)
  useEffect(() => {
    setStatus({
      status: initialStatus,
      message: getInitialMessage(initialStatus),
      timestamp: new Date().toISOString()
    })
  }, [initialStatus])

  useEffect(() => {
    // Handle connection events
    const handleConnected = (data: SSEMessage) => {
      setIsConnected(true)
    }

    const handleError = (data: SSEMessage) => {
      setIsConnected(false)
    }

    // Handle Stripe status updates
    const handleStripeUpdate = (data: SSEMessage) => {
      if (data.stripeStatus && data.message) {

        const newStatus: StripeStatus = {
          status: data.stripeStatus,
          message: data.message,
          timestamp: data.timestamp,
          accountId: data.stripeAccountId
        }
        setStatus(newStatus)
        setLastUpdate(new Date().toLocaleTimeString())
        onStatusChange?.(newStatus)
      }
    }

    // Register event listeners
    vendorSSE.on('connected', handleConnected)
    vendorSSE.on('error', handleError)
    vendorSSE.on('stripe_status_update', handleStripeUpdate)
    vendorSSE.on('stripe.status.update', handleStripeUpdate) // Also listen for this format

    // Connect to SSE
    vendorSSE.connect()

    // Cleanup on unmount
    return () => {
      vendorSSE.off('connected', handleConnected)
      vendorSSE.off('error', handleError)
      vendorSSE.off('stripe_status_update', handleStripeUpdate)
      vendorSSE.disconnect()
    }
  }, [onStatusChange])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green'
      case 'incomplete': return 'orange'
      case 'pending_verification': return 'blue'
      case 'disconnected': return 'red'
      default: return 'grey'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'incomplete': return 'Incomplete'
      case 'pending_verification': return 'Pending'
      case 'disconnected': return 'Disconnected'
      default: return 'Unknown'
    }
  }

  const needsAction = status.message.includes('❌') || status.status === 'incomplete'

  function getInitialMessage(status: string): string {
    switch (status) {
      case 'active':
        return '🎉 Your Stripe account is active and ready to receive payments!'
      case 'incomplete':
        return '⏳ Your information is being verified. This may take a few minutes.'
      case 'pending_verification':
        return '⏳ Your information is being verified. This may take a few minutes.'
      case 'unknown':
        return '📋 Connect your Stripe account to start processing payments.'
      default:
        return '📋 Checking Stripe account status...'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Stripe Account Status</h3>
          <Badge color={getStatusColor(status.status)}>
            {getStatusLabel(status.status)}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <Text className="text-xs text-gray-500">
            {isConnected ? 'Live' : 'Disconnected'}
          </Text>
          {/* Debug button - remove in production */}
          <Button
            size="small"
            variant="secondary"
            onClick={() => {
              vendorSSE.disconnect()
              setTimeout(() => vendorSSE.connect(), 1000)
            }}
          >
            Reconnect
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-gray-50 rounded-md">
          <Text className="text-sm">{status.message}</Text>
        </div>

        {needsAction && (
          <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-md">
            <div className="text-orange-600">⚠️</div>
            <div className="flex-1">
              <Text className="text-sm text-orange-800 font-medium">
                Action Required
              </Text>
              <Text className="text-xs text-orange-700">
                Your account needs additional information or documents.
              </Text>
            </div>
            <Button
              size="small"
              variant="secondary"
              onClick={() => window.location.href = '/vendors/stripe/onboarding'}
            >
              Update Info
            </Button>
          </div>
        )}

        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {lastUpdate ? `Last updated: ${lastUpdate}` : 'Waiting for updates...'}
          </span>
          {status.accountId && (
            <span>Account: {status.accountId.slice(-6)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
