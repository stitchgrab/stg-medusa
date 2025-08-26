'use client'

import { useState, useEffect } from 'react'
import { Button, Text, Heading, Input, Label } from '@medusajs/ui'
import { User } from '@medusajs/icons'

interface Address {
  area: string
  city: string
  country: string
  postal_code: string
  state: string
  street: string
}

interface VehicleInfo {
  details: string
  make: string
  model: string
  plate: string
  type: string
  year: string
}

interface Driver {
  id: string
  address: Address
  application_date: string
  approved_by: string | null
  approved_date: string | null
  area: string
  available_weekends: boolean
  avatar: string
  can_lift_packages: boolean
  comfortable_with_gps: boolean
  created_at: string
  criminal_record: string
  current_work_status: string | null
  deleted_at: string | null
  email: string
  experience_years: string | null
  first_name: string
  full_name: string
  handle: string
  has_cell_phone: string
  has_reliable_vehicle: boolean
  last_name: string
  license_number: string
  onfleet_worker_id: string | null
  password_hash: string
  phone_number: string
  preferred_hours: string
  privacy_agreement: boolean
  profile_photo: string
  rating: number | null
  status: string
  stripe_account_id: string | null
  stripe_account_status: string | null
  stripe_connected: boolean
  total_deliveries: number
  updated_at: string
  vehicle_info: VehicleInfo
  vehicle_type: string
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = (e.target.attributes as any)['id'].value
    const { value } = e.target

    if (id === 'city' || id === 'state' || id === 'postal_code' || id === 'country' || id === 'street') {
      setDriver(prev => ({ ...prev, address: { ...prev.address, [id]: value } }))
      return
    }

    setDriver(prev => ({ ...prev, [id]: value }))
  }

  // Form state
  const [driver, setDriver] = useState({
    id: '',
    address: {
      area: '',
      city: '',
      country: '',
      postal_code: '',
      state: '',
      street: '',
    },
    application_date: '',
    approved_by: null,
    approved_date: null,
    area: '',
    available_weekends: false,
    avatar: '',
    can_lift_packages: false,
    comfortable_with_gps: false,
    created_at: '',
    criminal_record: '',
    current_work_status: null,
    deleted_at: null,
    email: '',
    experience_years: null,
    first_name: '',
    full_name: '',
    handle: '',
    has_cell_phone: '',
    has_reliable_vehicle: false,
    last_name: '',
    license_number: '',
    onfleet_worker_id: null,
    password_hash: '',
    phone_number: '',
    preferred_hours: '',
    privacy_agreement: false,
    profile_photo: '',
    rating: null,
    status: '',
    stripe_account_id: null,
    stripe_account_status: null,
    stripe_connected: false,
    total_deliveries: 0,
    updated_at: '',
    vehicle_info: {
      details: '',
      make: '',
      model: '',
      plate: '',
      type: '',
      year: '',
    },
    vehicle_type: '',
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
        setProfileData(data.driver)

        // Set form data
        setDriver(data.driver)

        // Mark as initialized after data is loaded
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to load profile:', error)
        setError('Failed to load profile information')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  useEffect(() => {
    if (profileData && driver && isInitialized) {
      const fieldChanges = Object.entries(driver).every(([key, value]) => {
        return profileData[key as keyof Driver] === value
      })
      setHasChanges(!fieldChanges)
    }
  }, [profileData, driver, isInitialized])

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
          ...driver,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const data = await response.json()
      setProfileData(data.driver)
      setDriver(data.driver)
      setHasChanges(false)
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                onChange={handleChange}
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={driver.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={driver.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="phone_number">Phone</Label>
              <Input
                id="phone_number"
                type="tel"
                value={driver.phone_number}
                onChange={handleChange}
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
              <Label htmlFor="handle">Driver Handle</Label>
              <Input
                id="handle"
                value={driver.handle}
                disabled
                placeholder="Driver handle (read-only)"
              />
            </div>

            <div>
              <Label htmlFor="license_number">Driver License Number</Label>
              <Input
                id="license_number"
                value={driver.license_number}
                onChange={handleChange}
                placeholder="Enter your driver license number"
              />
            </div>

            <div>
              <Label htmlFor="avatar">Driver Profile Picture</Label>
              <Input
                id="avatar"
                type="url"
                value={driver.avatar}
                onChange={handleChange}
                placeholder="Enter your profile picture URL"
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
                onChange={handleChange}
                placeholder="e.g., Toyota"
              />
            </div>

            <div>
              <Label htmlFor="vehicle_model">Vehicle Model</Label>
              <Input
                id="vehicle_model"
                value={driver.vehicle_info.model}
                onChange={handleChange}
                placeholder="e.g., Camry"
              />
            </div>

            <div>
              <Label htmlFor="vehicle_year">Vehicle Year</Label>
              <Input
                id="vehicle_year"
                value={driver.vehicle_info.year}
                onChange={handleChange}
                placeholder="e.g., 2020"
              />
            </div>

            <div>
              <Label htmlFor="vehicle_plate">License Plate</Label>
              <Input
                id="vehicle_plate"
                value={driver.vehicle_info.plate}
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Enter street address"
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={driver.address.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={driver.address.state}
                onChange={handleChange}
                placeholder="Enter state"
              />
            </div>

            <div>
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={driver.address.postal_code}
                onChange={handleChange}
                placeholder="Enter postal code"
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={driver.address.country}
                onChange={handleChange}
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving || !hasChanges}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
