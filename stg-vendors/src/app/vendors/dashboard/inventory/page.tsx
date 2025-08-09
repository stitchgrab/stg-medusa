'use client'

import { useState, useEffect } from 'react'
import { Button, Text, Heading, Badge, Input } from '@medusajs/ui'
import { ShoppingCart, MagnifyingGlass, Funnel, Plus } from '@medusajs/icons'
import { getFromBackend } from '@/utils/fetch'
import { Spinner } from '@/components/Spinner'

interface InventoryVariant {
  id: string
  title: string
  sku: string
  barcode?: string
  ean?: string
  upc?: string
  product: {
    id: string
    title: string
    handle: string
    status: string
    thumbnail?: string
    images?: any[]
  }
  inventory_items: InventoryItem[]
  total_stocked: number
  total_reserved: number
  total_available: number
}

interface InventoryItem {
  id: string
  sku: string
  created_at: string
  updated_at: string
  required_quantity: number
  inventory_levels: InventoryLevel[]
  total_stocked: number
  total_reserved: number
  total_available: number
}

interface InventoryLevel {
  id: string
  inventory_item_id: string
  location_id: string
  stocked_quantity: number
  reserved_quantity: number
  available_quantity: number
  location: {
    name: string
    address: any
  }
}

const getStatusBadge = (available: number) => {
  if (available > 10) {
    return <Badge color="green">In Stock</Badge>
  } else if (available > 0) {
    return <Badge color="orange">Low Stock</Badge>
  } else {
    return <Badge color="red">Out of Stock</Badge>
  }
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryVariant[]>([])
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

  const filteredInventory = inventory.filter(variant => {
    const matchesSearch = variant.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.sku.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesStatus = true
    if (statusFilter === 'in_stock') {
      matchesStatus = variant.total_available > 10
    } else if (statusFilter === 'low_stock') {
      matchesStatus = variant.total_available > 0 && variant.total_available <= 10
    } else if (statusFilter === 'out_of_stock') {
      matchesStatus = variant.total_available === 0
    }

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
          <Text className="text-sm text-gray-600">Total Variants</Text>
          <Text className="text-2xl font-bold">{inventory.length}</Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">In Stock</Text>
          <Text className="text-2xl font-bold text-green-600">
            {inventory.filter(variant => variant.total_available > 10).length}
          </Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Low Stock</Text>
          <Text className="text-2xl font-bold text-orange-600">
            {inventory.filter(variant => variant.total_available > 0 && variant.total_available <= 10).length}
          </Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Out of Stock</Text>
          <Text className="text-2xl font-bold text-red-600">
            {inventory.filter(variant => variant.total_available === 0).length}
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
              {filteredInventory.map((variant) => (
                <tr key={variant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <Text className="font-medium">{variant.product.title}</Text>
                      <Text className="text-sm text-gray-500">{variant.title}</Text>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-500">{variant.sku}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text>{variant.total_stocked}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text>{variant.total_available}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-500">
                      {variant.inventory_items.length > 0
                        ? variant.inventory_items[0].inventory_levels[0]?.location?.name || 'N/A'
                        : 'N/A'
                      }
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(variant.total_available)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-500">
                      {new Date(variant.inventory_items[0]?.updated_at || Date.now()).toLocaleDateString()}
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