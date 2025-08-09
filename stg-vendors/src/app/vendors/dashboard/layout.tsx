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
  MapPin,
  ReceiptPercent,
  Eye,
  User,
  Clock,
} from '@medusajs/icons'
import { getFromBackend, postToBackend } from '@/utils/fetch'

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

interface OrderDetails {
  id: string
  display_id?: number
  status: string
  created_at: string
  total: number
  currency_code: string
  customer?: {
    email: string
    first_name: string
    last_name: string
  } | null
  vendor_item_count: number
  total_item_count: number
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
    icon: Tag,
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
    title: 'Locations',
    href: '/vendors/dashboard/locations',
    icon: MapPin,
  },
  {
    title: 'Promotions',
    href: '/vendors/dashboard/promotions',
    icon: ReceiptPercent,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [vendorData, setVendorData] = useState<VendorSession | null>(null)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [orderLoading, setOrderLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = async () => {
    try {
      const res = await getFromBackend('/vendors/auth/session', { withCredentials: true })

      if (!res.authenticated) {
        router.push('/vendors/login')
        return
      }

      setVendorData(res)
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

  // Check if we're on an order details page and fetch order info
  useEffect(() => {
    const isOrderDetailsPage = pathname.match(/\/vendors\/dashboard\/orders\/([^\/]+)$/)

    if (isOrderDetailsPage) {
      const orderId = isOrderDetailsPage[1]
      fetchOrderDetails(orderId)
    } else {
      setOrderDetails(null)
    }
  }, [pathname])

  const fetchOrderDetails = async (orderId: string) => {
    setOrderLoading(true)
    try {
      const response = await getFromBackend(`/vendors/orders/${orderId}`)
      setOrderDetails(response.order)
    } catch (error) {
      console.error('Failed to fetch order details:', error)
      setOrderDetails(null)
    } finally {
      setOrderLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await postToBackend('/vendors/auth/logout', {}, { withCredentials: true })
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
                const isActive = pathname === item.href || (item.href === '/vendors/dashboard/orders' && pathname.startsWith('/vendors/dashboard/orders/'))

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

        {/* Order Details Sidebar */}
        {(orderDetails || orderLoading) && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-4 w-4 text-blue-600" />
              <Text className="font-medium text-sm text-gray-900">Order Details</Text>
            </div>

            {orderLoading ? (
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
            ) : orderDetails ? (

              <div className="space-y-3">
                {/* Order ID and Status */}
                <div>
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Order #{orderDetails.display_id || orderDetails.id.slice(-8)}
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      color={
                        orderDetails.status === 'pending' ? 'orange' :
                          orderDetails.status === 'confirmed' ? 'blue' :
                            orderDetails.status === 'shipped' ? 'green' :
                              orderDetails.status === 'delivered' ? 'green' :
                                orderDetails.status === 'cancelled' ? 'red' : 'grey'
                      }
                      className="text-xs"
                    >
                      {orderDetails.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Customer */}
                {orderDetails.customer && (
                  <div>
                    <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Customer
                    </Text>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-3 w-3 text-gray-400" />
                      <Text className="text-sm text-gray-900">
                        {orderDetails.customer.first_name} {orderDetails.customer.last_name}
                      </Text>
                    </div>
                    <Text className="text-xs text-gray-600 ml-5">
                      {orderDetails.customer.email}
                    </Text>
                  </div>
                )}

                {/* Date */}
                <div>
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <Text className="text-sm text-gray-900">
                      {new Date(orderDetails.created_at).toLocaleDateString()}
                    </Text>
                  </div>
                </div>

                {/* Total */}
                <div>
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Total (Your Portion)
                  </Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: orderDetails.currency_code,
                    }).format(orderDetails.total / 100)}
                  </Text>
                  {orderDetails.vendor_item_count < orderDetails.total_item_count && (
                    <Text className="text-xs text-gray-500">
                      {orderDetails.vendor_item_count} of {orderDetails.total_item_count} items
                    </Text>
                  )}
                </div>

                {/* Back to Orders */}
                <Button
                  variant="transparent"
                  size="small"
                  className="w-full mt-4"
                  onClick={() => router.push('/vendors/dashboard/orders')}
                >
                  <ArrowRightOnRectangle className="h-3 w-3 mr-1" />
                  Back to Orders
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
                {orderDetails && (
                  <>
                    <span>→</span>
                    <span className="text-gray-900">Orders</span>
                    <span>→</span>
                    <span className="text-gray-900">
                      #{orderDetails.display_id || orderDetails.id.slice(-8)}
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