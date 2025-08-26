'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button, Text, Heading, Badge, DropdownMenu, Spinner } from '@medusajs/ui'
import {
  User,
  CreditCard,
  Clock,
  Receipt,
  EllipsisHorizontal,
  ArrowRightOnRectangle,
  CogSixTooth,
} from '@medusajs/icons'

interface DriverSession {
  id: string
  first_name: string
  last_name: string
  handle: string
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

const settingsNavigation = [
  {
    title: 'Profile',
    href: '/drivers/settings/profile',
    icon: User,
  },
  {
    title: 'Stripe Connection',
    href: '/drivers/settings/stripe',
    icon: CreditCard,
  },
  {
    title: 'Availability',
    href: '/drivers/settings/availability',
    icon: Clock,
  },
  {
    title: 'Tax Information',
    href: '/drivers/settings/tax',
    icon: Receipt,
  },
]

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [driverData, setDriverData] = useState<DriverSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/auth/session`, {
        credentials: 'include',
      })

      if (!response.ok) {
        router.push('/drivers/login')
        return
      }

      const data = await response.json()
      if (!data.authenticated) {
        router.push('/drivers/login')
        return
      }

      setDriverData(data.driver)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/drivers/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/drivers/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Text>Error: {error}</Text>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Settings Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <Heading level="h1" className="text-xl font-semibold">
            Settings
          </Heading>
          <Text className="text-sm text-gray-500 mt-1">
            Manage your driver account
          </Text>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {settingsNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "transparent"}
                  className="w-full justify-start"
                  onClick={() => router.push(item.href)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.title}
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Back to Dashboard */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="transparent"
            className="w-full justify-start"
            onClick={() => router.push('/drivers/dashboard')}
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-gray-500">Driver</Text>
              <Text className="font-medium">
                {driverData?.first_name + ' ' + driverData?.last_name || 'Loading...'}
              </Text>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="transparent" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Text className="text-white text-sm font-medium">
                      {driverData?.first_name?.[0]}
                    </Text>
                  </div>
                  <Text className="hidden sm:block">
                    {driverData?.first_name + ' ' + driverData?.last_name}
                  </Text>
                  <EllipsisHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={handleLogout}>
                  <ArrowRightOnRectangle className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
