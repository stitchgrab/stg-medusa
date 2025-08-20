'use client'

import { useState, useEffect } from 'react'
import {
  Text,
  Container,
  Badge,
  Table,
  Select,
} from '@medusajs/ui'
import {
  CurrencyDollar,
  ArrowLongUp,
  Calendar,
  Star,
} from '@medusajs/icons'

interface Delivery {
  id: string
  order_id: string
  status: string
  created_at: string
  delivery_fee: number
  tip_amount: number
  customer_rating: number | null
}

interface EarningsStats {
  totalEarnings: number
  totalDeliveries: number
  averagePerDelivery: number
  totalTips: number
  averageRating: number
  completedDeliveries: number
}

export default function Earnings() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([])
  const [stats, setStats] = useState<EarningsStats>({
    totalEarnings: 0,
    totalDeliveries: 0,
    averagePerDelivery: 0,
    totalTips: 0,
    averageRating: 0,
    completedDeliveries: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('all')

  useEffect(() => {
    fetchDeliveries()
  }, [])

  useEffect(() => {
    filterDeliveries()
  }, [deliveries, timeFilter])

  const fetchDeliveries = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/deliveries`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setDeliveries(data.deliveries || [])
      }
    } catch (error) {
      console.error('Failed to fetch deliveries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterDeliveries = () => {
    let filtered = deliveries

    // Filter by time period
    const now = new Date()
    switch (timeFilter) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(d => new Date(d.created_at) >= weekAgo)
        break
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(d => new Date(d.created_at) >= monthAgo)
        break
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(d => new Date(d.created_at) >= yearAgo)
        break
    }

    setFilteredDeliveries(filtered)

    // Calculate stats for filtered data
    const completedDeliveries = filtered.filter(d => d.status === 'delivered')
    const totalEarnings = completedDeliveries.reduce((sum, d) => sum + d.delivery_fee + (d.tip_amount || 0), 0)
    const totalTips = completedDeliveries.reduce((sum, d) => sum + (d.tip_amount || 0), 0)
    const averagePerDelivery = completedDeliveries.length > 0 ? totalEarnings / completedDeliveries.length : 0
    const averageRating = completedDeliveries.length > 0
      ? completedDeliveries.reduce((sum, d) => sum + (d.customer_rating || 0), 0) / completedDeliveries.length
      : 0

    setStats({
      totalEarnings,
      totalDeliveries: completedDeliveries.length,
      averagePerDelivery,
      totalTips,
      averageRating,
      completedDeliveries: completedDeliveries.length,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
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
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Earnings
        </Text>
        <Text className="text-gray-600">
          Track your earnings and financial performance.
        </Text>
      </div>

      {/* Time Filter */}
      <Container className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <Text className="text-sm font-medium text-gray-700">Time Period</Text>
          </div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <Select.Trigger className="w-48">
              <Select.Value placeholder="Select time period" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All Time</Select.Item>
              <Select.Item value="week">Last 7 Days</Select.Item>
              <Select.Item value="month">Last 30 Days</Select.Item>
              <Select.Item value="year">Last Year</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </Container>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Container className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600">Total Earnings</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalEarnings)}
              </Text>
            </div>
          </div>
        </Container>

        <Container className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowLongUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600">Completed Deliveries</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {stats.completedDeliveries}
              </Text>
            </div>
          </div>
        </Container>

        <Container className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyDollar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600">Average per Delivery</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.averagePerDelivery)}
              </Text>
            </div>
          </div>
        </Container>

        <Container className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600">Average Rating</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </Text>
            </div>
          </div>
        </Container>
      </div>

      {/* Tips Breakdown */}
      <Container className="p-6">
        <Text className="text-lg font-semibold text-gray-900 mb-4">Tips Breakdown</Text>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Text className="text-3xl font-bold text-green-600">
              {formatCurrency(stats.totalTips)}
            </Text>
            <Text className="text-sm text-gray-600">Total Tips Earned</Text>
          </div>
          <div className="text-center">
            <Text className="text-3xl font-bold text-blue-600">
              {stats.completedDeliveries > 0
                ? formatCurrency(stats.totalTips / stats.completedDeliveries)
                : '$0.00'
              }
            </Text>
            <Text className="text-sm text-gray-600">Average Tip per Delivery</Text>
          </div>
          <div className="text-center">
            <Text className="text-3xl font-bold text-purple-600">
              {stats.totalEarnings > 0
                ? `${((stats.totalTips / stats.totalEarnings) * 100).toFixed(1)}%`
                : '0%'
              }
            </Text>
            <Text className="text-sm text-gray-600">Tips as % of Total Earnings</Text>
          </div>
        </div>
      </Container>

      {/* Earnings Table */}
      <Container className="p-6">
        <Text className="text-lg font-semibold text-gray-900 mb-4">Recent Earnings</Text>
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order ID</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Delivery Fee</Table.HeaderCell>
                <Table.HeaderCell>Tip</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell>Rating</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredDeliveries
                .filter(d => d.status === 'delivered')
                .slice(0, 10)
                .map((delivery) => (
                  <Table.Row key={delivery.id}>
                    <Table.Cell>
                      <Text className="font-medium text-gray-900">
                        #{delivery.order_id}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-sm text-gray-900">
                        {formatDate(delivery.created_at)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="font-medium text-gray-900">
                        {formatCurrency(delivery.delivery_fee)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="font-medium text-green-600">
                        {formatCurrency(delivery.tip_amount || 0)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="font-bold text-gray-900">
                        {formatCurrency(delivery.delivery_fee + (delivery.tip_amount || 0))}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      {delivery.customer_rating ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <Text className="text-sm font-medium text-gray-900">
                            {delivery.customer_rating.toFixed(1)}
                          </Text>
                        </div>
                      ) : (
                        <Text className="text-sm text-gray-500">N/A</Text>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>

          {filteredDeliveries.filter(d => d.status === 'delivered').length === 0 && (
            <div className="text-center py-12">
              <CurrencyDollar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <Text className="text-gray-500 mb-2">No completed deliveries found</Text>
              <Text className="text-sm text-gray-400">
                {timeFilter !== 'all'
                  ? 'Try adjusting your time filter'
                  : 'Complete some deliveries to see your earnings'
                }
              </Text>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
