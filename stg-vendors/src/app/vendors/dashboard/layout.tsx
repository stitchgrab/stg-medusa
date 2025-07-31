'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Button,
  Text,
  Badge,
  DropdownMenu,
} from '@medusajs/ui'
import {
  EllipsisHorizontal,
  ArrowRightOnRectangle,
  CogSixTooth,
  ShoppingCart,
  Buildings,
  Users,
  Tag,
  BellAlert,
} from '@medusajs/icons'

interface VendorSession {
  authenticated: boolean
  vendor_admin: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  vendor: {
    id: string
    name: string
    handle: string
  }
}

interface NavigationItem {
  title: string
  href: string
  icon: any
  badge?: string
}

const navigationItems: NavigationItem[] = [
  {
    title: 'Orders',
    href: '/vendors/dashboard/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Products',
    href: '/vendors/dashboard/products',
    icon: ShoppingCart,
  },
  {
    title: 'Inventory',
    href: '/vendors/dashboard/inventory',
    icon: Buildings,
  },
  {
    title: 'Customers',
    href: '/vendors/dashboard/customers',
    icon: Users,
  },
  {
    title: 'Promotions',
    href: '/vendors/dashboard/promotions',
    icon: Tag,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [vendorData, setVendorData] = useState<VendorSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:9000/vendors/auth/session', {
        credentials: 'include',
      })

      if (!res.ok) {
        router.push('/vendors/login')
        return
      }

      const data = await res.json()
      setVendorData(data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load vendor data:', err)
      setError('Failed to load vendor data')
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:9000/vendors/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/vendors/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 p-3 text-red-600 text-sm text-center bg-red-50 rounded border border-red-200">
            {error}
          </div>
          <Button onClick={() => router.push('/vendors/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Text className="text-white font-bold text-sm">S</Text>
            </div>
            <Text className="ml-2 font-semibold text-gray-900">StitchGrab</Text>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Button
                    key={item.href}
                    variant="transparent"
                    className={`w-full justify-start flex items-center gap-3 ${isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : ''
                      }`}
                    onClick={() => router.push(item.href)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                    {item.badge && (
                      <Badge className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Settings */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <Button
            variant="transparent"
            className="w-full justify-start"
            onClick={() => router.push('/vendors/settings')}
          >
            <CogSixTooth className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <div className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 -m-1">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Text className="text-white font-bold text-sm">
                    {vendorData?.vendor_admin?.first_name?.[0] || 'V'}
                  </Text>
                </div>
                <div className="ml-3 flex-1">
                  <Text className="text-sm font-medium">
                    {vendorData?.vendor_admin?.first_name} {vendorData?.vendor_admin?.last_name}
                  </Text>
                </div>
                <div className="text-gray-400">
                  <EllipsisHorizontal />
                </div>
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item className="gap-x-2" onClick={handleLogout}>
                <ArrowRightOnRectangle className="text-ui-fg-subtle" />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Vendors</span>
                <span>→</span>
                <span className="text-gray-900">
                  {vendorData?.vendor_admin?.email}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="transparent" size="small">
                <BellAlert />
              </Button>
            </div>
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