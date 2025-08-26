'use client'

import { useRouter } from 'next/navigation'
import { Button, Text, Heading } from '@medusajs/ui'
import { User } from '@medusajs/icons'

export default function SettingsPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-gray-600" />
        <Heading level="h1">Settings</Heading>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <Text className="text-gray-600">
          Welcome to your driver settings. Use the sidebar to navigate between different settings sections.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <Heading level="h2" className="text-lg font-semibold mb-4">
            Quick Actions
          </Heading>
          <div className="space-y-3">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => router.push('/drivers/settings/profile')}
            >
              <User className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <Heading level="h2" className="text-lg font-semibold mb-4">
            Account Status
          </Heading>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Text className="text-gray-600">Account Type</Text>
              <Text className="font-medium">Driver</Text>
            </div>
            <div className="flex justify-between">
              <Text className="text-gray-600">Status</Text>
              <Text className="font-medium text-green-600">Active</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
