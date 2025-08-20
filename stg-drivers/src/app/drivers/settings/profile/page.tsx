'use client'

import { useState, useEffect } from 'react'
import { Button, Text, Heading, Input, Label } from '@medusajs/ui'
import { User } from '@medusajs/icons'

interface Driver {
  id: string
  name: string
  handle: string
  avatar?: string
  vehicle_info?: any
  license_number?: string
  phone?: string
  email?: string
  first_name?: string
  last_name?: string
  address?: any
  status: string
  rating?: number
  total_deliveries: number
}

interface ProfileData {
  driver: Driver
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [driver, setDriver] = useState({
    name: '',
    handle: '',
    avatar: '',
    phone: '',
    email: '',
    first_name: '',
    last_name: '',
    license_number: '',
    vehicle_info: {
      make: '',
      model: '',
      year: '',
      plate: '',
    },
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/profile`, {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to load profile')
        }

        const data = await response.json()
        setProfileData(data)

        // Set form data
        setDriver({
          name: data.driver?.name || '',
          handle: data.driver?.handle || '',
          avatar: data.driver?.avatar || '',
          phone: data.driver?.phone || '',
          email: data.driver?.email || '',
          first_name: data.driver?.first_name || '',
          last_name: data.driver?.last_name || '',
          license_number: data.driver?.license_number || '',
          vehicle_info: {
            make: data.driver?.vehicle_info?.make || '',
            model: data.driver?.vehicle_info?.model || '',
            year: data.driver?.vehicle_info?.year || '',
            plate: data.driver?.vehicle_info?.plate || '',
          },
          address: {
            street: data.driver?.address?.street || '',
            city: data.driver?.address?.city || '',
            state: data.driver?.address?.state || '',
            postal_code: data.driver?.address?.postal_code || '',
            country: data.driver?.address?.country || '',
          },
        })
      } catch (error) {
        console.error('Failed to load profile:', error)
        setError('Failed to load profile information')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          driver: driver,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const data = await response.json()
      setProfileData(data)
      setSuccess('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Text>Loading profile...</Text>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-gray-600" />
        <Heading level="h1">Profile Settings</Heading>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <Text className="text-red-800">{error}</Text>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <Text className="text-green-800">{success}</Text>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white rounded-lg border p-6">
          <Heading level="h2" className="text-lg font-semibold mb-4">
            Personal Information
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={driver.first_name}
                onChange={(e) => setDriver(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={driver.last_name}
                onChange={(e) => setDriver(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={driver.email}
                onChange={(e) => setDriver(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={driver.phone}
                onChange={(e) => setDriver(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>

        {/* Driver Information */}
        <div className="bg-white rounded-lg border p-6">
          <Heading level="h2" className="text-lg font-semibold mb-4">
            Driver Information
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="driver_name">Driver Name</Label>
              <Input
                id="driver_name"
                value={driver.name}
                onChange={(e) => setDriver(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your driver name"
              />
            </div>

            <div>
              <Label htmlFor="handle">Driver Handle</Label>
              <Input
                id="handle"
                value={driver.handle}
                onChange={(e) => setDriver(prev => ({ ...prev, handle: e.target.value }))}
                placeholder="Enter your driver handle"
              />
            </div>

            <div>
              <Label htmlFor="driver_phone">Driver Phone</Label>
              <Input
                id="driver_phone"
                type="tel"
                value={driver.phone}
                onChange={(e) => setDriver(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your driver phone"
              />
            </div>

            <div>
              <Label htmlFor="driver_email">Driver Email</Label>
              <Input
                id="driver_email"
                type="email"
                value={driver.email}
                onChange={(e) => setDriver(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your driver email"
              />
            </div>

            <div>
              <Label htmlFor="license_number">Driver License Number</Label>
              <Input
                id="license_number"
                value={driver.license_number}
                onChange={(e) => setDriver(prev => ({ ...prev, license_number: e.target.value }))}
                placeholder="Enter your driver license number"
              />
            </div>

            <div>
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                type="url"
                value={driver.avatar}
                onChange={(e) => setDriver(prev => ({ ...prev, avatar: e.target.value }))}
                placeholder="Enter your avatar URL"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-white rounded-lg border p-6">
          <Heading level="h2" className="text-lg font-semibold mb-4">
            Vehicle Information
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle_make">Vehicle Make</Label>
              <Input
                id="vehicle_make"
                value={driver.vehicle_info.make}
                onChange={(e) => setDriver(prev => ({
                  ...prev,
                  vehicle_info: { ...prev.vehicle_info, make: e.target.value }
                }))}
                placeholder="e.g., Toyota"
              />
            </div>

            <div>
              <Label htmlFor="vehicle_model">Vehicle Model</Label>
              <Input
                id="vehicle_model"
                value={driver.vehicle_info.model}
                onChange={(e) => setDriver(prev => ({
                  ...prev,
                  vehicle_info: { ...prev.vehicle_info, model: e.target.value }
                }))}
                placeholder="e.g., Camry"
              />
            </div>

            <div>
              <Label htmlFor="vehicle_year">Vehicle Year</Label>
              <Input
                id="vehicle_year"
                value={driver.vehicle_info.year}
                onChange={(e) => setDriver(prev => ({
                  ...prev,
                  vehicle_info: { ...prev.vehicle_info, year: e.target.value }
                }))}
                placeholder="e.g., 2020"
              />
            </div>

            <div>
              <Label htmlFor="vehicle_plate">License Plate</Label>
              <Input
                id="vehicle_plate"
                value={driver.vehicle_info.plate}
                onChange={(e) => setDriver(prev => ({
                  ...prev,
                  vehicle_info: { ...prev.vehicle_info, plate: e.target.value }
                }))}
                placeholder="Enter license plate"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg border p-6">
          <Heading level="h2" className="text-lg font-semibold mb-4">
            Address
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={driver.address.street}
                onChange={(e) => setDriver(prev => ({
                  ...prev,
                  address: { ...prev.address, street: e.target.value }
                }))}
                placeholder="Enter street address"
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={driver.address.city}
                onChange={(e) => setDriver(prev => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value }
                }))}
                placeholder="Enter city"
              />
            </div>

            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={driver.address.state}
                onChange={(e) => setDriver(prev => ({
                  ...prev,
                  address: { ...prev.address, state: e.target.value }
                }))}
                placeholder="Enter state"
              />
            </div>

            <div>
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={driver.address.postal_code}
                onChange={(e) => setDriver(prev => ({
                  ...prev,
                  address: { ...prev.address, postal_code: e.target.value }
                }))}
                placeholder="Enter postal code"
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={driver.address.country}
                onChange={(e) => setDriver(prev => ({
                  ...prev,
                  address: { ...prev.address, country: e.target.value }
                }))}
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
