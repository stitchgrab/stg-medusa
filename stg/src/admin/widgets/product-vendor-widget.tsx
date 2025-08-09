import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Text, Heading, Select, Badge, Container, Input, Checkbox } from '@medusajs/ui'
import { useState, useEffect } from 'react'
import { MagnifyingGlass, Plus, Trash } from '@medusajs/icons'

interface Vendor {
  id: string
  name: string
  handle: string
}

interface Product {
  id: string
  title: string
  handle: string
  status: string
  vendor_id?: string | null
}

// Custom Spinner Component
const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
  )
}

// The widget
const ProductVendorWidget = () => {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.handle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const loadData = async () => {
    try {
      setLoading(true)

      // Fetch all vendors
      const vendorsResponse = await fetch('/admin/vendors', {
        credentials: 'include',
      })

      if (vendorsResponse.ok) {
        const vendorsData = await vendorsResponse.json()
        setVendors(vendorsData.vendors || [])
      }

      // Fetch all products
      const productsResponse = await fetch('/admin/products?limit=1000', {
        credentials: 'include',
      })

      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        const products = productsData.products || []

        // Fetch vendor associations
        const associationsResponse = await fetch('/admin/products/vendor-associations', {
          credentials: 'include',
        })

        let vendorAssociations: Record<string, string> = {}
        if (associationsResponse.ok) {
          const associationsData = await associationsResponse.json()
          vendorAssociations = associationsData.associations || {}
        }

        // Combine products with their vendor associations
        const productsWithVendorId = products.map((product: any) => ({
          ...product,
          vendor_id: vendorAssociations[product.id] || null
        }))

        setProducts(productsWithVendorId)
        setFilteredProducts(productsWithVendorId)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleProductSelect = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId])
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId))
    }
  }

  const handleSelectAll = () => {
    setSelectedProducts(filteredProducts.map(product => product.id))
  }

  const handleDeselectAll = () => {
    setSelectedProducts([])
  }

  const handleBulkAssociate = async () => {
    if (!selectedVendorId || selectedProducts.length === 0) {
      setError('Please select a vendor and at least one product')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      // Associate each selected product with the vendor
      const promises = selectedProducts.map(productId =>
        fetch(`/admin/products/${productId}/vendor`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ vendor_id: selectedVendorId }),
        })
      )

      const results = await Promise.all(promises)
      const failedCount = results.filter(result => !result.ok).length

      if (failedCount === 0) {
        setSuccess(`Successfully associated ${selectedProducts.length} product(s) with vendor`)
        setSelectedProducts([])
        setSelectedVendorId(null)
        // Reload data to show updated associations
        await loadData()
      } else {
        setError(`Failed to associate ${failedCount} product(s)`)
      }
    } catch (error) {
      console.error('Error associating products:', error)
      setError('Failed to associate products')
    } finally {
      setSaving(false)
    }
  }

  const handleAssociateAll = async () => {
    if (!selectedVendorId) {
      setError('Please select a vendor')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      // Associate all products with the vendor
      const promises = products.map(product =>
        fetch(`/admin/products/${product.id}/vendor`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ vendor_id: selectedVendorId }),
        })
      )

      const results = await Promise.all(promises)
      const failedCount = results.filter(result => !result.ok).length

      if (failedCount === 0) {
        setSuccess(`Successfully associated all ${products.length} products with vendor`)
        setSelectedVendorId(null)
        // Reload data to show updated associations
        await loadData()
      } else {
        setError(`Failed to associate ${failedCount} product(s)`)
      }
    } catch (error) {
      console.error('Error associating all products:', error)
      setError('Failed to associate all products')
    } finally {
      setSaving(false)
    }
  }

  const getCurrentVendor = (product: Product) => {
    if (!product.vendor_id) return null
    return vendors.find(vendor => vendor.id === product.vendor_id)
  }

  if (loading) {
    return (
      <Container className="p-4">
        <div className="flex items-center justify-center py-8">
          <Spinner size="lg" />
        </div>
      </Container>
    )
  }

  return (
    <Container className="p-4">
      <div className="space-y-6">
        <div>
          <Heading level="h3" className="mb-2">Bulk Vendor Association</Heading>
          <Text className="text-gray-600 mb-4">
            Associate multiple products with a vendor. Search for products and select them, or associate all products at once.
          </Text>
        </div>

        <div className="space-y-4">
          {/* Vendor Selection */}
          <div>
            <Text className="font-medium mb-2">Select Vendor</Text>
            <Select
              value={selectedVendorId || 'none'}
              onValueChange={(value) => setSelectedVendorId(value === 'none' ? null : value)}
              disabled={saving}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select a vendor..." />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="none">No vendor</Select.Item>
                {vendors.map((vendor) => (
                  <Select.Item key={vendor.id} value={vendor.id}>
                    {vendor.name} ({vendor.handle})
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          {/* Product Search */}
          <div>
            <Text className="font-medium mb-2">Search Products</Text>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products by title or handle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Product Selection Controls */}
          <div className="flex items-center justify-between">
            <Text className="font-medium">
              Products ({filteredProducts.length} found, {selectedProducts.length} selected)
            </Text>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="small"
                onClick={handleSelectAll}
                disabled={saving}
              >
                Select All
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={handleDeselectAll}
                disabled={saving}
              >
                Deselect All
              </Button>
            </div>
          </div>

          {/* Product List */}
          <div className="max-h-64 overflow-y-auto border rounded-lg p-4">
            {filteredProducts.length === 0 ? (
              <Text className="text-gray-500 text-center py-4">No products found</Text>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((product) => {
                  const currentVendor = getCurrentVendor(product)
                  return (
                    <div key={product.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleProductSelect(product.id, checked as boolean)}
                        disabled={saving}
                      />
                      <div className="flex-1">
                        <Text className="font-medium">{product.title}</Text>
                        <Text className="text-sm text-gray-500">{product.handle}</Text>
                        {currentVendor && (
                          <Text className="text-xs text-blue-600">
                            Currently associated with: {currentVendor.name}
                          </Text>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge>
                          {product.status}
                        </Badge>
                        {currentVendor && (
                          <Badge>
                            {currentVendor.handle}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handleBulkAssociate}
              disabled={saving || !selectedVendorId || selectedProducts.length === 0}
            >
              {saving ? (
                <Spinner size="sm" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Associate Selected ({selectedProducts.length})
            </Button>
            <Button
              variant="secondary"
              onClick={handleAssociateAll}
              disabled={saving || !selectedVendorId || products.length === 0}
            >
              {saving ? (
                <Spinner size="sm" />
              ) : null}
              Associate All Products ({products.length})
            </Button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <Text className="text-red-800">{error}</Text>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <Text className="text-green-800">{success}</Text>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default ProductVendorWidget 