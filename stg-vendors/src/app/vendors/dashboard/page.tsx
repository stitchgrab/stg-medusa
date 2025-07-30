'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Text,
  Container,
  Heading,
  Badge
} from '@medusajs/ui'

interface VendorSession {
  authenticated: boolean
  vendor_admin: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  vendor: {
    id: string
    name: string
    handle: string
  }
}

export default function VendorDashboard() {
  const [vendorData, setVendorData] = useState<VendorSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:9000/vendors/auth/session', {
        credentials: 'include',
      })

      if (!res.ok) {
        // Redirect to login if not authenticated
        router.push('/vendors/login')
        return
      }

      const data = await res.json()
      setVendorData(data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load vendor data:', err)
      setError('Failed to load vendor data')
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:9000/vendors/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/vendors/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Container className="text-center">
          <div className="mb-4 p-3 text-red-600 text-sm text-center bg-red-50 rounded border border-red-200">
            {error}
          </div>
          <Button onClick={() => router.push('/vendors/login')}>
            Go to Login
          </Button>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heading level="h1" className="text-2xl font-bold text-blue-600">
                StitchGrab Vendor Dashboard
              </Heading>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <Heading level="h2" className="text-xl font-semibold mb-4 text-blue-600">
              Welcome back!
            </Heading>
            <Text className="text-gray-600">
              {vendorData?.vendor?.name || 'Vendor'}
            </Text>
            <Text className="text-sm text-gray-500 mt-2">
              {vendorData?.vendor_admin?.email}
            </Text>
          </div>

          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <Heading level="h3" className="text-lg font-semibold mb-4 text-blue-600">
              Orders
            </Heading>
            <Text className="text-3xl font-bold text-gray-800">
              {/* {vendorData?.vendor?.orders?.length || 0} */}
            </Text>
            <Text className="text-sm text-gray-500">Total orders</Text>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <Heading level="h3" className="text-lg font-semibold mb-4 text-blue-600">
              Products
            </Heading>
            <Text className="text-3xl font-bold text-gray-800">
              {/* {vendorData?.vendor?.products?.length || 0} */}
            </Text>
            <Text className="text-sm text-gray-500">Active products</Text>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Quick Actions */}
        <div className="mt-8">
          <Heading level="h2" className="text-xl font-semibold mb-4 text-blue-600">
            Quick Actions
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer">
              <Heading level="h3" className="font-semibold mb-2">View Orders</Heading>
              <Text className="text-sm text-gray-600">Check your recent orders</Text>
            </div>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer">
              <Heading level="h3" className="font-semibold mb-2">Manage Products</Heading>
              <Text className="text-sm text-gray-600">Add or edit your products</Text>
            </div>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer">
              <Heading level="h3" className="font-semibold mb-2">Analytics</Heading>
              <Text className="text-sm text-gray-600">View your performance</Text>
            </div>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer">
              <Heading level="h3" className="font-semibold mb-2">Settings</Heading>
              <Text className="text-sm text-gray-600">Update your profile</Text>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Heading level="h2" className="text-xl font-semibold mb-4 text-blue-600">
            Recent Activity
          </Heading>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="font-medium">New order received</Text>
                  <Text className="text-sm text-gray-500">Order #12345</Text>
                </div>
                <Badge>New</Badge>
              </div>
              <hr className="border-gray-200" />
              <div className="flex items-center justify-between">
                <div>
                  <Text className="font-medium">Product updated</Text>
                  <Text className="text-sm text-gray-500">Blue T-Shirt</Text>
                </div>
                <Badge>Updated</Badge>
              </div>
              <hr className="border-gray-200" />
              <div className="flex items-center justify-between">
                <div>
                  <Text className="font-medium">Payment received</Text>
                  <Text className="text-sm text-gray-500">Order #12344</Text>
                </div>
                <Badge>Paid</Badge>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
} 