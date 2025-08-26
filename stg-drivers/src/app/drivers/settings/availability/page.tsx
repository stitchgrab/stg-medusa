'use client'

import { Button, Text, Heading } from '@medusajs/ui'
import { Clock } from '@medusajs/icons'

export default function AvailabilityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6 text-gray-600" />
        <Heading level="h1">Availability</Heading>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <Text className="text-gray-600">
          Set your availability schedule for accepting delivery assignments.
        </Text>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <Heading level="h2" className="text-lg font-semibold mb-4">
          Working Hours
        </Heading>
        <Text className="text-gray-600 mb-4">
          Configure when you're available to accept delivery assignments.
        </Text>
        <Button variant="secondary">
          Set Availability
        </Button>
      </div>
    </div>
  )
}
