'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button, Text, Heading, Badge, DropdownMenu } from '@medusajs/ui'
import {
  User,
  CreditCard,
  Clock,
  Receipt,
  ShoppingBag,
  EllipsisHorizontal,
  ArrowRightOnRectangle,
  CogSixTooth,
} from '@medusajs/icons'
import { getFromBackend, postToBackend } from '@/utils/fetch'

interface VendorSession {
  id: string
  name: string
  handle: string
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

const settingsNavigation = [
  {
    title: 'Profile',
    href: '/vendors/settings/profile',
    icon: User,
  },
  {
    title: 'Stripe Connection',
    href: '/vendors/settings/stripe',
    icon: CreditCard,
  },
  {
    title: 'Availability',
    href: '/vendors/settings/availability',
    icon: Clock,
  },
  {
    title: 'Tax Information',
    href: '/vendors/settings/tax',
    icon: Receipt,
  },
  {
    title: 'Shopify Connection',
    href: '/vendors/settings/shopify',
    icon: ShoppingBag,
  },
]

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [vendorData, setVendorData] = useState<VendorSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = async () => {
    try {
      const response = await getFromBackend('/vendors/auth/session', { withCredentials: true })

      if (!response.authenticated) {
        router.push('/vendors/login')
        return
      }

      setVendorData(response.vendor)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/vendors/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await postToBackend('/vendors/auth/logout', { withCredentials: true })
      router.push('/vendors/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Text>Loading...</Text>
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
            Manage your vendor account
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
            onClick={() => router.push('/vendors/dashboard')}
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
              <Text className="text-sm text-gray-500">Vendor</Text>
              <Text className="font-medium">
                {vendorData?.name || 'Loading...'}
              </Text>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="transparent" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Text className="text-white text-sm font-medium">
                      {vendorData?.name?.[0]}
                    </Text>
                  </div>
                  <Text className="hidden sm:block">
                    {vendorData?.name}
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