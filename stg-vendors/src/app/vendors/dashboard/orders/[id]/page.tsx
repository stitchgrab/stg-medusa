'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Button,
  Text,
  Heading,
  Badge,
} from '@medusajs/ui'
import {
  ArrowLeft,
  ShoppingBag,
  CheckCircle,
  CreditCard,
  User,
  MapPin,
  Clock,
  Receipt,
  Eye,
} from '@medusajs/icons'
import { getFromBackend } from '@/utils/fetch'
import { Spinner } from '@/components/Spinner'

interface OrderItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  total: number
  variant_id: string
  product_id: string
  metadata?: any
  variant?: {
    id: string
    title: string
    sku: string
    barcode: string
    options: Array<{
      id: string
      value: string
      option: {
        id: string
        title: string
      }
    }>
    product: {
      id: string
      title: string
      description: string
    }
  } | null
}

interface Address {
  id: string
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  country_code: string
  province: string
  postal_code: string
  phone?: string
}

interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
}

interface Fulfillment {
  id: string
  shipped_at?: string
  created_at: string
  tracking_numbers: string[]
  provider_id: string
  data?: any
  items: Array<{
    id: string
    quantity: number
  }>
}

interface PaymentCollection {
  id: string
  status: string
  amount: number
  created_at: string
  payments: Array<{
    id: string
    amount: number
    currency_code: string
    provider_id: string
    data?: any
  }>
}

interface OrderDetails {
  id: string
  display_id?: number
  status: string
  created_at: string
  updated_at: string
  email?: string
  currency_code: string
  total: number
  subtotal: number
  shipping_total: number
  tax_total: number
  metadata?: any
  customer?: Customer | null
  billing_address?: Address
  shipping_address?: Address
  items: OrderItem[]
  shipping_methods: Array<{
    id: string
    name: string
    amount: number
    data?: any
  }>
  fulfillments: Fulfillment[]
  payment_collections: PaymentCollection[]
  vendor_item_count: number
  total_item_count: number
  vendor_proportion: number
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const response = await getFromBackend(`/vendors/orders/${orderId}`)
        setOrder(response.order)
      } catch (error: any) {
        console.error('Failed to load order details:', error)
        setError(error.message || 'Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      loadOrderDetails()
    }
  }, [orderId])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'orange' as const, icon: '⏳' },
      'confirmed': { color: 'blue' as const, icon: '✅' },
      'processing': { color: 'orange' as const, icon: '⚙️' },
      'shipped': { color: 'green' as const, icon: '📦' },
      'delivered': { color: 'green' as const, icon: '🎉' },
      'cancelled': { color: 'red' as const, icon: '❌' },
      'requires_action': { color: 'orange' as const, icon: '⚠️' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'grey' as const, icon: '❓' }
    return (
      <Badge color={config.color}>
        {config.icon} {status.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100)
  }

  const getPaymentStatus = (status: string): "orange" | "blue" | "green" | "red" | "grey" | "purple" => {
    const statusColors: Record<string, "orange" | "blue" | "green" | "red" | "grey" | "purple"> = {
      'captured': 'green',
      'authorized': 'blue',
      'pending': 'orange',
      'canceled': 'red',
      'requires_action': 'orange',
    }
    return statusColors[status] || 'grey'
  }

  const formatAddress = (address: Address) => {
    return `${address.address_1}${address.address_2 ? `, ${address.address_2}` : ''}, ${address.city}, ${address.province} ${address.postal_code}, ${address.country_code.toUpperCase()}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <Text>Loading order details...</Text>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Text className="text-red-600 mb-4">{error || 'Order not found'}</Text>
          <Button
            variant="secondary"
            onClick={() => router.push('/vendors/dashboard/orders')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="transparent"
            onClick={() => router.push('/vendors/dashboard/orders')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <Heading level="h1" className="text-2xl font-semibold mb-2">
              Order #{order.display_id || order.id.slice(-8)}
            </Heading>
            <div className="flex items-center gap-4">
              {getStatusBadge(order.status)}
              <Text className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </Text>
              {order.vendor_item_count < order.total_item_count && (
                <Badge color="blue">
                  {order.vendor_item_count} of {order.total_item_count} items
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <ShoppingBag className="h-5 w-5 text-gray-600 mr-2" />
              <Heading level="h3" className="text-lg font-semibold">
                Items ({order.vendor_item_count})
              </Heading>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex-1">
                    <Text className="font-medium">{item.title}</Text>
                    {item.variant?.title && (
                      <Text className="text-sm text-gray-600 mt-1">
                        Variant: {item.variant.title}
                      </Text>
                    )}
                    {item.variant?.sku && (
                      <Text className="text-sm text-gray-500">
                        SKU: {item.variant.sku}
                      </Text>
                    )}
                    {item.variant?.options && item.variant.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.variant.options.map((option) => (
                          <Badge key={option.id} color="grey" className="text-xs">
                            {option.option.title}: {option.value}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <Text className="font-medium">
                      {formatCurrency(item.unit_price, order.currency_code)} × {item.quantity}
                    </Text>
                    <Text className="text-lg font-semibold">
                      {formatCurrency(item.total, order.currency_code)}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fulfillment Status */}
          {order.fulfillments.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-gray-600 mr-2" />
                <Heading level="h3" className="text-lg font-semibold">
                  Fulfillment
                </Heading>
              </div>

              <div className="space-y-4">
                {order.fulfillments.map((fulfillment) => (
                  <div key={fulfillment.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Text className="font-medium">
                        Fulfillment #{fulfillment.id.slice(-8)}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {fulfillment.shipped_at ?
                          `Shipped on ${new Date(fulfillment.shipped_at).toLocaleDateString()}` :
                          `Created on ${new Date(fulfillment.created_at).toLocaleDateString()}`
                        }
                      </Text>
                    </div>

                    {fulfillment.tracking_numbers.length > 0 && (
                      <div className="mb-3">
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                          Tracking Numbers:
                        </Text>
                        {fulfillment.tracking_numbers.map((trackingNumber, index) => (
                          <Badge key={index} color="blue" className="mr-2">
                            {trackingNumber}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Text className="text-sm text-gray-600">
                      Items: {fulfillment.items.reduce((sum, item) => sum + item.quantity, 0)} of {order.vendor_item_count}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Information */}
          {order.payment_collections.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                <Heading level="h3" className="text-lg font-semibold">
                  Payment
                </Heading>
              </div>

              <div className="space-y-4">
                {order.payment_collections.map((collection) => (
                  <div key={collection.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge color={getPaymentStatus(collection.status)}>
                          {collection.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <Text className="font-semibold">
                        {formatCurrency(collection.amount, order.currency_code)}
                      </Text>
                    </div>

                    {collection.payments.map((payment) => (
                      <div key={payment.id} className="text-sm text-gray-600 mt-2 pl-4 border-l-2 border-gray-200">
                        <Text>Provider: {payment.provider_id}</Text>
                        <Text>Amount: {formatCurrency(payment.amount, payment.currency_code)}</Text>
                        <Text className="text-xs text-gray-500">
                          Payment ID: {payment.id.slice(-8)}
                        </Text>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Receipt className="h-5 w-5 text-gray-600 mr-2" />
              <Heading level="h3" className="text-lg font-semibold">
                Order Summary
              </Heading>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Text>Subtotal:</Text>
                <Text>{formatCurrency(order.subtotal, order.currency_code)}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Shipping:</Text>
                <Text>{formatCurrency(order.shipping_total, order.currency_code)}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Tax:</Text>
                <Text>{formatCurrency(order.tax_total, order.currency_code)}</Text>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <Text>Total (Your Portion):</Text>
                  <Text>{formatCurrency(order.total, order.currency_code)}</Text>
                </div>
                <Text className="text-sm text-gray-500 mt-1">
                  {Math.round(order.vendor_proportion * 100)}% of order total
                </Text>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-gray-600 mr-2" />
              <Heading level="h3" className="text-lg font-semibold">
                Customer
              </Heading>
            </div>

            {order.customer ? (
              <div className="space-y-2">
                <Text className="font-medium">
                  {order.customer.first_name} {order.customer.last_name}
                </Text>
                <Text className="text-gray-600">{order.customer.email}</Text>
                {order.customer.phone && (
                  <Text className="text-gray-600">{order.customer.phone}</Text>
                )}
              </div>
            ) : (
              <Text className="text-gray-600">{order.email || 'Guest customer'}</Text>
            )}
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                <Heading level="h3" className="text-lg font-semibold">
                  Shipping Address
                </Heading>
              </div>

              <div className="space-y-1">
                <Text className="font-medium">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </Text>
                <Text className="text-gray-600">
                  {formatAddress(order.shipping_address)}
                </Text>
                {order.shipping_address.phone && (
                  <Text className="text-gray-600">{order.shipping_address.phone}</Text>
                )}
              </div>
            </div>
          )}

          {/* Billing Address (if different) */}
          {order.billing_address &&
            order.billing_address.id !== order.shipping_address?.id && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <Receipt className="h-5 w-5 text-gray-600 mr-2" />
                  <Heading level="h3" className="text-lg font-semibold">
                    Billing Address
                  </Heading>
                </div>

                <div className="space-y-1">
                  <Text className="font-medium">
                    {order.billing_address.first_name} {order.billing_address.last_name}
                  </Text>
                  <Text className="text-gray-600">
                    {formatAddress(order.billing_address)}
                  </Text>
                  {order.billing_address.phone && (
                    <Text className="text-gray-600">{order.billing_address.phone}</Text>
                  )}
                </div>
              </div>
            )}

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-gray-600 mr-2" />
              <Heading level="h3" className="text-lg font-semibold">
                Timeline
              </Heading>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <Text className="font-medium">Order placed</Text>
                  <Text className="text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </Text>
                </div>
              </div>

              {order.updated_at !== order.created_at && (
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <Text className="font-medium">Last updated</Text>
                    <Text className="text-gray-500">
                      {new Date(order.updated_at).toLocaleString()}
                    </Text>
                  </div>
                </div>
              )}

              {order.fulfillments.map((fulfillment) => (
                <div key={fulfillment.id} className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <div>
                    <Text className="font-medium">
                      {fulfillment.shipped_at ? 'Shipped' : 'Fulfillment created'}
                    </Text>
                    <Text className="text-gray-500">
                      {new Date(fulfillment.shipped_at || fulfillment.created_at).toLocaleString()}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
