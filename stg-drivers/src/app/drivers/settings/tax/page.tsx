'use client'

import { Button, Text, Heading } from '@medusajs/ui'
import { Receipt } from '@medusajs/icons'

export default function TaxPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Receipt className="h-6 w-6 text-gray-600" />
        <Heading level="h1">Tax Information</Heading>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <Text className="text-gray-600">
          Manage your tax information for delivery earnings.
        </Text>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <Heading level="h2" className="text-lg font-semibold mb-4">
          Tax Details
        </Heading>
        <Text className="text-gray-600 mb-4">
          Update your tax information for proper reporting of your delivery earnings.
        </Text>
        <Button variant="secondary">
          Update Tax Information
        </Button>
      </div>
    </div>
  )
}
