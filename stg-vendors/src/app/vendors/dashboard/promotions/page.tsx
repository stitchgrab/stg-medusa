'use client'

import { useState, useEffect } from 'react'
import { Button, Text, Heading, Badge, Input } from '@medusajs/ui'
import { Tag, MagnifyingGlass, Funnel, Plus } from '@medusajs/icons'
import { getFromBackend } from '@/utils/fetch'
import { Spinner } from '@/components/Spinner'

interface Promotion {
  id: string
  name: string
  code: string
  type: string
  value: number
  usage_limit: number | null
  usage_count: number
  starts_at: string | null
  ends_at: string | null
  status: string
  vendor_product_count: number
  created_at: string
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge color="green">Active</Badge>
    case 'inactive':
      return <Badge color="grey">Inactive</Badge>
    case 'expired':
      return <Badge color="red">Expired</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'percentage':
      return 'Percentage'
    case 'fixed':
      return 'Fixed Amount'
    case 'free_shipping':
      return 'Free Shipping'
    default:
      return type
  }
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const data = await getFromBackend('/vendors/promotions', { withCredentials: true })
        setPromotions(data.promotions || [])
      } catch (error) {
        console.error('Failed to load promotions:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPromotions()
  }, [])

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Spinner size="lg" />
          <Text>Loading promotions...</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading level="h1">Promotions</Heading>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Promotion
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Total Promotions</Text>
          <Text className="text-2xl font-bold">{promotions.length}</Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Active Promotions</Text>
          <Text className="text-2xl font-bold text-green-600">
            {promotions.filter(promotion => promotion.status === 'active').length}
          </Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Total Usage</Text>
          <Text className="text-2xl font-bold text-blue-600">
            {promotions.reduce((sum, promotion) => sum + promotion.usage_count, 0)}
          </Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Products with Promotions</Text>
          <Text className="text-2xl font-bold text-purple-600">
            {promotions.reduce((sum, promotion) => sum + promotion.vendor_product_count, 0)}
          </Text>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search promotions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promotion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPromotions.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="font-medium">{promotion.name}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-500 font-mono">{promotion.code}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm">{getTypeLabel(promotion.type)}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="font-medium">
                      {promotion.type === 'percentage' ? `${promotion.value}%` : `$${promotion.value}`}
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm">
                      {promotion.usage_count}
                      {promotion.usage_limit && ` / ${promotion.usage_limit}`}
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm">{promotion.vendor_product_count}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(promotion.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-500">
                      {new Date(promotion.created_at).toLocaleDateString()}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPromotions.length === 0 && (
        <div className="text-center py-12">
          <Text className="text-gray-500">No promotions found.</Text>
        </div>
      )}
    </div>
  )
} 