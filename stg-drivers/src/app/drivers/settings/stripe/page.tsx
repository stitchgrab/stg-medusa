'use client'

import { Button, Text, Heading } from '@medusajs/ui'
import { CreditCard } from '@medusajs/icons'

export default function StripePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-gray-600" />
        <Heading level="h1">Stripe Connection</Heading>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <Text className="text-gray-600">
          Connect your Stripe account to receive payments for your deliveries.
        </Text>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <Heading level="h2" className="text-lg font-semibold mb-4">
          Payment Setup
        </Heading>
        <Text className="text-gray-600 mb-4">
          To receive payments for your deliveries, you need to connect your Stripe account.
        </Text>
        <Button variant="secondary">
          Connect Stripe Account
        </Button>
      </div>
    </div>
  )
}
