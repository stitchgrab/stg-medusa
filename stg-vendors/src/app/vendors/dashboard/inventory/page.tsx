'use client'

import { useState, useEffect } from 'react'
import { Button, Text, Heading, Badge, Input } from '@medusajs/ui'
import { ShoppingCart, MagnifyingGlass, Funnel, Plus } from '@medusajs/icons'
import { getFromBackend } from '@/utils/fetch'
import { Spinner } from '@/components/Spinner'

interface InventoryItem {
  id: string
  product_title: string
  sku: string
  quantity: number
  reserved_quantity: number
  available_quantity: number
  location: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  last_updated: string
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'in_stock':
      return <Badge color="green">In Stock</Badge>
    case 'low_stock':
      return <Badge color="orange">Low Stock</Badge>
    case 'out_of_stock':
      return <Badge color="red">Out of Stock</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await getFromBackend('/vendors/inventory', { withCredentials: true })
        setInventory(data.inventory || [])
      } catch (error) {
        console.error('Failed to load inventory:', error)
      } finally {
        setLoading(false)
      }
    }
    loadInventory()
  }, [])

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <Text>Loading inventory...</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading level="h1">Inventory</Heading>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Total Items</Text>
          <Text className="text-2xl font-bold">{inventory.length}</Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">In Stock</Text>
          <Text className="text-2xl font-bold text-green-600">
            {inventory.filter(item => item.status === 'in_stock').length}
          </Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Low Stock</Text>
          <Text className="text-2xl font-bold text-orange-600">
            {inventory.filter(item => item.status === 'low_stock').length}
          </Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Out of Stock</Text>
          <Text className="text-2xl font-bold text-red-600">
            {inventory.filter(item => item.status === 'out_of_stock').length}
          </Text>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search inventory..."
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
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="font-medium">{item.product_title}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-500">{item.sku}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text>{item.quantity}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text>{item.available_quantity}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-500">{item.location}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-500">
                      {new Date(item.last_updated).toLocaleDateString()}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Text className="text-gray-500">No inventory items found.</Text>
        </div>
      )}
    </div>
  )
} 