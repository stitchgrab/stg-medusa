'use client'

import { useState, useEffect } from 'react'
import { Button, Text, Heading, Input, Label } from '@medusajs/ui'
import { User } from '@medusajs/icons'
import { getFromBackend, postToBackend, putToBackend } from '@/utils/fetch'

interface VendorAdmin {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  created_at: string
  updated_at: string
}

interface Vendor {
  id: string
  name: string
  handle: string
  logo?: string
  businessHours?: any
  specialHours?: any
  address?: any
  social_links?: any
  phone?: string
}

interface ProfileData {
  vendor_admin: VendorAdmin
  vendor: Vendor
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [vendorAdmin, setVendorAdmin] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  })

  const [vendor, setVendor] = useState({
    name: '',
    handle: '',
    logo: '',
    phone: '',
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getFromBackend('/vendors/profile', { withCredentials: true })
        setProfileData(data)

        // Set form data
        setVendorAdmin({
          first_name: data.vendor_admin?.first_name || '',
          last_name: data.vendor_admin?.last_name || '',
          email: data.vendor_admin?.email || '',
          phone: data.vendor_admin?.phone || '',
        })

        setVendor({
          name: data.vendor?.name || '',
          handle: data.vendor?.handle || '',
          logo: data.vendor?.logo || '',
          phone: data.vendor?.phone || '',
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
      const response = await putToBackend('/vendors/profile', {
        vendor_admin: vendorAdmin,
        vendor: vendor,
      }, { withCredentials: true })

      setProfileData(response)
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
                value={vendorAdmin.first_name}
                onChange={(e) => setVendorAdmin(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={vendorAdmin.last_name}
                onChange={(e) => setVendorAdmin(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={vendorAdmin.email}
                onChange={(e) => setVendorAdmin(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={vendorAdmin.phone}
                onChange={(e) => setVendorAdmin(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-lg border p-6">
          <Heading level="h2" className="text-lg font-semibold mb-4">
            Business Information
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={vendor.name}
                onChange={(e) => setVendor(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <Label htmlFor="handle">Business Handle</Label>
              <Input
                id="handle"
                value={vendor.handle}
                onChange={(e) => setVendor(prev => ({ ...prev, handle: e.target.value }))}
                placeholder="Enter your business handle"
              />
            </div>

            <div>
              <Label htmlFor="business_phone">Business Phone</Label>
              <Input
                id="business_phone"
                type="tel"
                value={vendor.phone}
                onChange={(e) => setVendor(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your business phone"
              />
            </div>

            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                type="url"
                value={vendor.logo}
                onChange={(e) => setVendor(prev => ({ ...prev, logo: e.target.value }))}
                placeholder="Enter your logo URL"
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