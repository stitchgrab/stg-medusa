'use client'

import { useState, useEffect } from 'react'
import {
  Text,
  Badge,
  Button,
} from '@medusajs/ui'
import {
  MapPin,
  Clock,
} from '@medusajs/icons'

interface Delivery {
  id: string
  order_id: string
  status: string
  created_at: string
  updated_at: string
  pickup_address: any
  delivery_address: any
  pickup_time: string | null
  delivery_time: string | null
  estimated_delivery_time: string | null
  actual_delivery_time: string | null
  customer_rating: number | null
  customer_feedback: string | null
  delivery_fee: number
  tip_amount: number
  notes: string | null
  tracking_number: string | null
}

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchDeliveries()
  }, [])

  useEffect(() => {
    filterDeliveries()
  }, [deliveries, searchTerm, statusFilter])

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

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(delivery =>
        delivery.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === statusFilter)
    }

    setFilteredDeliveries(filtered)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'picked_up':
        return 'bg-orange-100 text-orange-800'
      case 'assigned':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatAddress = (address: any) => {
    if (!address) return 'N/A'
    if (typeof address === 'string') return address
    return `${address.street || ''} ${address.city || ''} ${address.state || ''}`.trim() || 'N/A'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
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
          Deliveries
        </Text>
        <Text className="text-gray-600">
          Manage and track your delivery assignments.
        </Text>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by order ID or tracking number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="picked_up">Picked Up</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="font-medium text-gray-900">
                      #{delivery.order_id}
                    </Text>
                    {delivery.tracking_number && (
                      <Text className="text-sm text-gray-500">
                        Track: {delivery.tracking_number}
                      </Text>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-900">
                      {formatAddress(delivery.pickup_address)}
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-900">
                      {formatAddress(delivery.delivery_address)}
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-900">
                      {formatDate(delivery.created_at)}
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="font-medium text-gray-900">
                      ${(delivery.delivery_fee + (delivery.tip_amount || 0)).toFixed(2)}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      Fee: ${delivery.delivery_fee.toFixed(2)}
                      {delivery.tip_amount > 0 && ` + Tip: $${delivery.tip_amount.toFixed(2)}`}
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {delivery.customer_rating ? (
                      <div className="flex items-center">
                        <Text className="text-sm font-medium text-gray-900">
                          {delivery.customer_rating.toFixed(1)}
                        </Text>
                        <Text className="text-sm text-gray-500 ml-1">/5</Text>
                      </div>
                    ) : (
                      <Text className="text-sm text-gray-500">N/A</Text>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDeliveries.length === 0 && (
            <div className="text-center py-12">
              <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <Text className="text-gray-500 mb-2">No deliveries found</Text>
              <Text className="text-sm text-gray-400">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'You don\'t have any deliveries yet'
                }
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600">Total Deliveries</Text>
              <Text className="text-2xl font-bold text-gray-900">{deliveries.length}</Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600">Completed</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {deliveries.filter(d => d.status === 'delivered').length}
              </Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <Text className="text-sm font-medium text-gray-600">Total Earnings</Text>
              <Text className="text-2xl font-bold text-gray-900">
                ${deliveries.reduce((sum, d) => sum + d.delivery_fee + (d.tip_amount || 0), 0).toFixed(2)}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
