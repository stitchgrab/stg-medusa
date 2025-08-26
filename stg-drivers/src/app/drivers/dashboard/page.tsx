'use client'

import { useState, useEffect } from 'react'
import {
  Text,
  Badge,
  Button,
  Heading,
} from '@medusajs/ui'
import {
  MapPin,
  Star,
  Clock,
  CurrencyDollar,
} from '@medusajs/icons'

interface DashboardStats {
  totalDeliveries: number
  completedDeliveries: number
  pendingDeliveries: number
  totalEarnings: number
  averageRating: number
}

interface RecentDelivery {
  id: string
  order_id: string
  status: string
  created_at: string
  pickup_address: any
  delivery_address: any
  delivery_fee: number
  tip_amount: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDeliveries: 0,
    completedDeliveries: 0,
    pendingDeliveries: 0,
    totalEarnings: 0,
    averageRating: 0,
  })
  const [recentDeliveries, setRecentDeliveries] = useState<RecentDelivery[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch deliveries
      const deliveriesResponse = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/deliveries`, {
        credentials: 'include',
      })

      if (deliveriesResponse.ok) {
        const deliveriesData = await deliveriesResponse.json()
        const deliveries = deliveriesData.deliveries || []

        // Calculate stats
        const totalDeliveries = deliveries.length
        const completedDeliveries = deliveries.filter((d: any) => d.status === 'delivered').length
        const pendingDeliveries = deliveries.filter((d: any) => d.status === 'pending' || d.status === 'assigned').length
        const totalEarnings = deliveries.reduce((sum: number, d: any) => {
          return sum + (d.delivery_fee || 0) + (d.tip_amount || 0)
        }, 0)
        const averageRating = deliveries.length > 0
          ? deliveries.reduce((sum: number, d: any) => sum + (d.customer_rating || 0), 0) / deliveries.length
          : 0

        setStats({
          totalDeliveries,
          completedDeliveries,
          pendingDeliveries,
          totalEarnings,
          averageRating,
        })

        // Set recent deliveries (last 5)
        setRecentDeliveries(deliveries.slice(0, 5))
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'green'
      case 'picked_up':
        return 'orange'
      case 'assigned':
        return 'blue'
      default:
        return 'grey'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading level="h1" className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard
        </Heading>
        <Text className="text-gray-600">
          Welcome back! Here's what's happening with your deliveries.
        </Text>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600">Total Deliveries</Text>
              <Text className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600">Completed</Text>
              <Text className="text-2xl font-bold text-gray-900">{stats.completedDeliveries}</Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600">Pending</Text>
              <Text className="text-2xl font-bold text-gray-900">{stats.pendingDeliveries}</Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyDollar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600">Total Earnings</Text>
              <Text className="text-2xl font-bold text-gray-900">${(stats.totalEarnings / 100).toFixed(2)}</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Card */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-yellow-500 mr-2" />
            <Text className="text-lg font-semibold text-gray-900">Average Rating</Text>
          </div>
          <div className="text-right">
            <Text className="text-3xl font-bold text-gray-900">
              {stats.averageRating.toFixed(1)}
            </Text>
            <Text className="text-sm text-gray-600">out of 5</Text>
          </div>
        </div>
      </div>

      {/* Recent Deliveries */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <Heading level="h2" className="text-lg font-semibold text-gray-900">Recent Deliveries</Heading>
          <Button variant="secondary" size="small">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {recentDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <Text className="font-medium text-gray-900">
                    Order #{delivery.order_id}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {new Date(delivery.created_at).toLocaleDateString()}
                  </Text>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge color={getStatusBadgeVariant(delivery.status)}>
                  {delivery.status}
                </Badge>
                <Text className="font-medium text-gray-900">
                  ${((delivery.delivery_fee + (delivery.tip_amount || 0)) / 100).toFixed(2)}
                </Text>
              </div>
            </div>
          ))}
          {recentDeliveries.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <Text className="text-gray-500">No deliveries yet</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
