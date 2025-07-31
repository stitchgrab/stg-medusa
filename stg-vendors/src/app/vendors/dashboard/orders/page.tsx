'use client'

import { useState, useEffect } from 'react'
import {
  Button,
  Text,
  Heading,
  Badge,
  Input,
} from '@medusajs/ui'
import {
  ShoppingCart,
  MagnifyingGlass,
  Funnel,
  CheckCircle,
  XCircle,
  ArrowPath,
} from '@medusajs/icons'
import { getFromBackend } from '@/utils/fetch'
import { Spinner } from '@/components/Spinner'

interface Order {
  id: string
  status: string
  total: number
  subtotal: number
  shipping_total: number
  tax_total: number
  created_at: string
  updated_at: string
  customer: {
    id: string
    email: string
  }
  items: Array<{
    id: string
    title: string
    quantity: number
    unit_price: number
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        console.log('🔍 Frontend - Loading orders...')
        console.log('🔍 Frontend - Environment URL:', process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL)

        const orders = await getFromBackend('/vendors/orders', { withCredentials: true })
        console.log('🔍 Frontend - Orders response:', orders)

        setOrders(orders.orders)
      } catch (error) {
        console.error('❌ Frontend - Failed to load orders:', error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'orange', icon: '⏳' },
      'confirmed': { color: 'blue', icon: '✅' },
      'processing': { color: 'yellow', icon: '⚙️' },
      'shipped': { color: 'green', icon: '📦' },
      'delivered': { color: 'green', icon: '🎉' },
      'cancelled': { color: 'red', icon: '❌' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'gray', icon: '❓' }
    return (
      <Badge className={`bg-${config.color}-100 text-${config.color}-800`}>
        {config.icon} {status}
      </Badge>
    )
  }

  const getStatusStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    }
    return stats
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <Text>Loading orders...</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h1" className="text-2xl font-semibold mb-2">
            Orders
          </Heading>
          <Text className="text-gray-600">
            Manage and track your orders
          </Text>
        </div>
        <Button>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-3">
              <Text className="text-sm font-medium text-gray-500">Total Orders</Text>
              <Text className="text-lg font-semibold">{stats.total}</Text>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ArrowPath className="h-4 w-4 text-orange-600" />
            </div>
            <div className="ml-3">
              <Text className="text-sm font-medium text-gray-500">Pending</Text>
              <Text className="text-lg font-semibold">{stats.pending}</Text>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ArrowPath className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="ml-3">
              <Text className="text-sm font-medium text-gray-500">Processing</Text>
              <Text className="text-lg font-semibold">{stats.processing}</Text>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-3">
              <Text className="text-sm font-medium text-gray-500">Shipped</Text>
              <Text className="text-lg font-semibold">{stats.shipped}</Text>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-3">
              <Text className="text-sm font-medium text-gray-500">Delivered</Text>
              <Text className="text-lg font-semibold">{stats.delivered}</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders by ID or customer email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Funnel className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {orders.length === 0 ? 'No orders found' : 'No orders match your filters'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="transparent" size="small">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 