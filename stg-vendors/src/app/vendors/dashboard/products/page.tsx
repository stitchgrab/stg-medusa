'use client'

import { useState, useEffect } from 'react'
import { Button, Text, Heading, Badge, Input } from '@medusajs/ui'
import { ShoppingBag, MagnifyingGlass, Funnel, Plus } from '@medusajs/icons'
import { getFromBackend } from '@/utils/fetch'
import { Spinner } from '@/components/Spinner'
import ProductCreationModal from '@/components/ProductCreationModal'

interface Product {
  id: string
  title: string
  handle: string
  status: string
  created_at: string
  updated_at: string
  variants: any[]
}

interface ProductsResponse {
  products: Product[]
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'published':
      return <Badge color="green">Published</Badge>
    case 'draft':
      return <Badge color="grey">Draft</Badge>
    case 'archived':
      return <Badge color="red">Archived</Badge>
    default:
      return <Badge color="grey">{status}</Badge>
  }
}

export default function ProductsPage() {
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getFromBackend('/vendors/products', { withCredentials: true })
        setProductsData(data)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filteredProducts = productsData?.products?.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.handle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const handleProductCreated = () => {
    // Reload products after creation
    const loadProducts = async () => {
      try {
        const data = await getFromBackend('/vendors/products', { withCredentials: true })
        setProductsData(data)
      } catch (error) {
        console.error('Failed to load products:', error)
      }
    }
    loadProducts()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-6 w-6 text-gray-600" />
          <Heading level="h1">Products</Heading>
        </div>
        <div className="text-center py-8">
          <div className="flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <Text>Loading products...</Text>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingBag className="h-6 w-6 text-gray-600" />
        <Heading level="h1">Products</Heading>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <Text className="text-sm font-medium text-gray-500">Total Products</Text>
          <Text className="text-2xl font-bold text-gray-900">{filteredProducts.length}</Text>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <Text className="text-sm font-medium text-gray-500">Published</Text>
          <Text className="text-2xl font-bold text-green-600">
            {filteredProducts.filter(p => p.status === 'published').length}
          </Text>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <Text className="text-sm font-medium text-gray-500">Draft</Text>
          <Text className="text-2xl font-bold text-yellow-600">
            {filteredProducts.filter(p => p.status === 'draft').length}
          </Text>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <Text className="text-sm font-medium text-gray-500">Archived</Text>
          <Text className="text-2xl font-bold text-red-600">
            {filteredProducts.filter(p => p.status === 'archived').length}
          </Text>
        </div>
      </div>


      <>
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      {searchTerm || statusFilter !== 'all'
                        ? 'No products match your filters'
                        : 'No products found'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <Text className="font-medium text-gray-900">{product.title}</Text>
                          <Text className="text-sm text-gray-500">{product.handle}</Text>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="transparent" size="small">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>

      {/* Product Creation Modal */}
      <ProductCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProductCreated={handleProductCreated}
      />
    </div>
  )
} 