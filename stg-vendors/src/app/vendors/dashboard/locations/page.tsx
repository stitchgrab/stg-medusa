'use client'

import { useState, useEffect } from 'react'
import { Button, Text, Heading, Badge, Input, Container } from '@medusajs/ui'
import { MapPin, Plus, Trash, Check, Pencil } from '@medusajs/icons'
import { getFromBackend, postToBackend, putToBackend, deleteFromBackend } from '@/utils/fetch'
import { Spinner } from '@/components/Spinner'

interface VendorLocation {
  id: string
  name: string
  is_default: boolean
  stock_location_id: string
  stock_location: {
    address: {
      address_1: string
      address_2: string
      city: string
      country_code: string
      postal_code: string
      province: string
    }
  }
}

interface LocationFormData {
  name: string
  address_1: string
  address_2: string
  city: string
  country_code: string
  postal_code: string
  province: string
  is_default: boolean
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<VendorLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLocation, setEditingLocation] = useState<VendorLocation | null>(null)
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    address_1: '',
    address_2: '',
    city: '',
    country_code: '',
    postal_code: '',
    province: '',
    is_default: false,
  })

  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      const data = await getFromBackend('/vendors/locations', { withCredentials: true })
      setLocations(data.stock_locations || [])
    } catch (error) {
      console.error('Failed to load locations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const locationData = {
        name: formData.name,
        address: {
          address_1: formData.address_1,
          address_2: formData.address_2,
          city: formData.city,
          country_code: formData.country_code,
          postal_code: formData.postal_code,
          province: formData.province,
        },
        is_default: formData.is_default,
      }

      if (editingLocation) {
        await putToBackend(`/vendors/locations/${editingLocation.id}`, locationData, { withCredentials: true })
      } else {
        await postToBackend('/vendors/locations', locationData, { withCredentials: true })
      }

      setShowForm(false)
      setEditingLocation(null)
      resetForm()
      loadLocations()
    } catch (error) {
      console.error('Failed to save location:', error)
    }
  }

  const handleDelete = async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return

    try {
      await deleteFromBackend(`/vendors/locations/${locationId}`, { withCredentials: true })
      loadLocations()
    } catch (error) {
      console.error('Failed to delete location:', error)
    }
  }

  const handleAssociateProducts = async (locationId?: string) => {
    try {
      const response = await postToBackend('/vendors/associate-products-locations', {
        location_id: locationId
      }, { withCredentials: true })

      alert(`Successfully associated ${response.result.products_associated} products with location`)
    } catch (error) {
      console.error('Failed to associate products with location:', error)
      alert('Failed to associate products with location')
    }
  }

  const handleEdit = (location: VendorLocation) => {
    setEditingLocation(location)
    setFormData({
      name: location.name,
      address_1: location.stock_location?.address?.address_1 || '',
      address_2: location.stock_location?.address?.address_2 || '',
      city: location.stock_location?.address?.city || '',
      country_code: location.stock_location?.address?.country_code || '',
      postal_code: location.stock_location?.address?.postal_code || '',
      province: location.stock_location?.address?.province || '',
      is_default: location.is_default,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      address_1: '',
      address_2: '',
      city: '',
      country_code: '',
      postal_code: '',
      province: '',
      is_default: false,
    })
  }

  const formatAddress = (address?: any) => {
    if (!address) return 'No address'
    const parts = [
      address.address_1,
      address.address_2,
      address.city,
      address.province,
      address.postal_code,
      address.country_code,
    ].filter(Boolean)
    return parts.join(', ') || 'No address'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <Text>Loading locations...</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading level="h1">Locations</Heading>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => handleAssociateProducts()}
          >
            Associate Products
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Total Locations</Text>
          <Text className="text-2xl font-bold">{locations.length}</Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Default Location</Text>
          <Text className="text-2xl font-bold text-green-600">
            {locations?.filter(loc => loc.is_default).length}
          </Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Active Locations</Text>
          <Text className="text-2xl font-bold">{locations.length}</Text>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg border">
          <Heading level="h2" className="mb-4">
            {editingLocation ? 'Edit Location' : 'Add New Location'}
          </Heading>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="text-sm font-medium mb-2">Location Name *</Text>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Warehouse Name"
                  required
                />
              </div>
              <div>
                <Text className="text-sm font-medium mb-2">Country Code</Text>
                <Input
                  value={formData.country_code}
                  onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                  placeholder="US"
                />
              </div>
            </div>

            <div>
              <Text className="text-sm font-medium mb-2">Address Line 1</Text>
              <Input
                value={formData.address_1}
                onChange={(e) => setFormData({ ...formData, address_1: e.target.value })}
                placeholder="123 Main St"
              />
            </div>

            <div>
              <Text className="text-sm font-medium mb-2">Address Line 2</Text>
              <Input
                value={formData.address_2}
                onChange={(e) => setFormData({ ...formData, address_2: e.target.value })}
                placeholder="Suite 100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Text className="text-sm font-medium mb-2">City</Text>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="New York"
                />
              </div>
              <div>
                <Text className="text-sm font-medium mb-2">State/Province</Text>
                <Input
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  placeholder="NY"
                />
              </div>
              <div>
                <Text className="text-sm font-medium mb-2">Postal Code</Text>
                <Input
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  placeholder="10001"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              />
              <Text className="text-sm">Set as default location</Text>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingLocation ? 'Update Location' : 'Add Location'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false)
                  setEditingLocation(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Locations List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations.map((location) => (
                <tr key={location.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <Text className="font-medium">{location.name}</Text>
                        {location.is_default && (
                          <Badge color="green" className="mt-1">
                            <Check className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="text-sm text-gray-500">
                      {formatAddress(location?.stock_location?.address)}
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color="green">Active</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleAssociateProducts(location.id)}
                      >
                        Associate
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleEdit(location)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleDelete(location.id)}
                        disabled={locations.length === 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {locations.length === 0 && !showForm && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <Text className="text-gray-500">No locations found.</Text>
          <Text className="text-sm text-gray-400 mt-2">
            Add your first location to start managing inventory.
          </Text>
        </div>
      )}
    </div>
  )
} 