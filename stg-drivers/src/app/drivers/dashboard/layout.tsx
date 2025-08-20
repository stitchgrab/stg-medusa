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
  MapPin,
  Star,
  BellAlert,
  Eye,
  User,
  Clock,
} from '@medusajs/icons'

interface DriverSession {
  authenticated: boolean
  driver: {
    id: string
    first_name: string
    last_name: string
    email: string
    handle: string
  }
}

interface DeliveryDetails {
  id: string
  order_id: string
  status: string
  created_at: string
  pickup_address: any
  delivery_address: any
  delivery_fee: number
  tip_amount: number
}

interface NavigationItem {
  title: string
  href: string
  icon: any
  badge?: string
}

const navigationItems: NavigationItem[] = [
  {
    title: 'Deliveries',
    href: '/drivers/dashboard/deliveries',
    icon: MapPin,
  },
  {
    title: 'Earnings',
    href: '/drivers/dashboard/earnings',
    icon: Star,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [driverData, setDriverData] = useState<DriverSession | null>(null)
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | null>(null)
  const [deliveryLoading, setDeliveryLoading] = useState(false)
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

      setDriverData(data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load driver data:', err)
      setError('Failed to load driver data')
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Check if we're on a delivery details page and fetch delivery info
  useEffect(() => {
    const isDeliveryDetailsPage = pathname.match(/\/drivers\/dashboard\/deliveries\/([^\/]+)$/)

    if (isDeliveryDetailsPage) {
      const deliveryId = isDeliveryDetailsPage[1]
      fetchDeliveryDetails(deliveryId)
    } else {
      setDeliveryDetails(null)
    }
  }, [pathname])

  const fetchDeliveryDetails = async (deliveryId: string) => {
    setDeliveryLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/deliveries/${deliveryId}`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setDeliveryDetails(data.delivery)
      }
    } catch (error) {
      console.error('Failed to fetch delivery details:', error)
      setDeliveryDetails(null)
    } finally {
      setDeliveryLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/drivers/login')
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
          <Button onClick={() => router.push('/drivers/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  console.log(driverData)

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
                const isActive = pathname === item.href || (item.href === '/drivers/dashboard/deliveries' && pathname.startsWith('/drivers/dashboard/deliveries/'))

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

        {/* Delivery Details Sidebar */}
        {(deliveryDetails || deliveryLoading) && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-4 w-4 text-blue-600" />
              <Text className="font-medium text-sm text-gray-900">Delivery Details</Text>
            </div>

            {deliveryLoading ? (
              <div className="space-y-3">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : deliveryDetails ? (

              <div className="space-y-3">
                {/* Order ID and Status */}
                <div>
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Order #{deliveryDetails.order_id}
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      color={
                        deliveryDetails.status === 'pending' ? 'orange' :
                          deliveryDetails.status === 'assigned' ? 'blue' :
                            deliveryDetails.status === 'picked_up' ? 'green' :
                              deliveryDetails.status === 'delivered' ? 'green' :
                                deliveryDetails.status === 'cancelled' ? 'red' : 'grey'
                      }
                      className="text-xs"
                    >
                      {deliveryDetails.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Pickup Address */}
                <div>
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Pickup
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <Text className="text-sm text-gray-900">
                      {deliveryDetails.pickup_address?.street || 'Address not available'}
                    </Text>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Delivery
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <Text className="text-sm text-gray-900">
                      {deliveryDetails.delivery_address?.street || 'Address not available'}
                    </Text>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <Text className="text-sm text-gray-900">
                      {new Date(deliveryDetails.created_at).toLocaleDateString()}
                    </Text>
                  </div>
                </div>

                {/* Earnings */}
                <div>
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Earnings
                  </Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    ${((deliveryDetails.delivery_fee + (deliveryDetails.tip_amount || 0)) / 100).toFixed(2)}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Fee: ${(deliveryDetails.delivery_fee / 100).toFixed(2)}
                    {deliveryDetails.tip_amount > 0 && ` + Tip: $${(deliveryDetails.tip_amount / 100).toFixed(2)}`}
                  </Text>
                </div>

                {/* Back to Deliveries */}
                <Button
                  variant="transparent"
                  size="small"
                  className="w-full mt-4"
                  onClick={() => router.push('/drivers/dashboard/deliveries')}
                >
                  <ArrowRightOnRectangle className="h-3 w-3 mr-1" />
                  Back to Deliveries
                </Button>
              </div>
            ) : null}
          </div>
        )}

        {/* Settings */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <Button
            variant="transparent"
            className="w-full justify-start"
            onClick={() => router.push('/drivers/settings')}
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
                    {driverData?.driver?.first_name?.[0] || 'D'}
                  </Text>
                </div>
                <div className="ml-3 flex-1">
                  <Text className="text-sm font-medium">
                    {driverData?.driver?.first_name} {driverData?.driver?.last_name}
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
                <span>Drivers</span>
                <span>→</span>
                <span className="text-gray-900">
                  {driverData?.driver?.email}
                </span>
                {deliveryDetails && (
                  <>
                    <span>→</span>
                    <span className="text-gray-900">Deliveries</span>
                    <span>→</span>
                    <span className="text-gray-900">
                      #{deliveryDetails.order_id}
                    </span>
                  </>
                )}
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
