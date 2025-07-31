'use client'

import { useState } from 'react'
import { Button, Text, Heading, Input, Label, Badge } from '@medusajs/ui'
import { CheckCircle, XCircle } from '@medusajs/icons'

export default function StripeSettingsPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)

  const handleConnect = async () => {
    setConnecting(true)
    try {
      // TODO: Implement Stripe OAuth connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsConnected(true)
    } catch (error) {
      console.error('Failed to connect Stripe:', error)
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    setDisconnecting(true)
    try {
      // TODO: Implement Stripe disconnection
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsConnected(false)
    } catch (error) {
      console.error('Failed to disconnect Stripe:', error)
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
          <Badge variant={isConnected ? "secondary" : "danger"}>
            {isConnected ? (
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </div>
            ) : (
              <div className="flex items-center">
                <XCircle className="h-3 w-3 mr-1" />
                Not Connected
              </div>
            )}
          </Badge>
        </div>

        {isConnected ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <Text className="text-green-800 font-medium">
                  Stripe account connected successfully
                </Text>
              </div>
              <Text className="text-green-700 text-sm mt-1">
                Your Stripe account is connected and ready to process payments.
              </Text>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Account ID</Label>
                <Text className="text-sm text-gray-600">acct_1234567890</Text>
              </div>
              <div>
                <Label>Account Type</Label>
                <Text className="text-sm text-gray-600">Standard</Text>
              </div>
              <div>
                <Label>Connected Date</Label>
                <Text className="text-sm text-gray-600">January 15, 2024</Text>
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