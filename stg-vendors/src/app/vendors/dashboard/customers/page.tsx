'use client'

import { useState, useEffect } from 'react'
import { Button, Text, Heading, Badge, Input } from '@medusajs/ui'
import { Users, MagnifyingGlass, Funnel, Plus } from '@medusajs/icons'
import { getFromBackend } from '@/utils/fetch'
import { Spinner } from '@/components/Spinner'

interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  total_orders: number
  total_spent: number
  last_order_date: string | null
  status: 'active' | 'inactive'
  created_at: string
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge color="green">Active</Badge>
    case 'inactive':
      return <Badge color="grey">Inactive</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getFromBackend('/vendors/customers', { withCredentials: true })
        setCustomers(data.customers || [])
      } catch (error) {
        console.error('Failed to load customers:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCustomers()
  }, [])

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Spinner size="lg" />
          <Text>Loading customers...</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading level="h1">Customers</Heading>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Total Customers</Text>
          <Text className="text-2xl font-bold">{customers.length}</Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Active Customers</Text>
          <Text className="text-2xl font-bold text-green-600">
            {customers.filter(customer => customer.status === 'active').length}
          </Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Total Orders</Text>
          <Text className="text-2xl font-bold text-blue-600">
            {customers.reduce((sum, customer) => sum + customer.total_orders, 0)}
          </Text>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <Text className="text-sm text-gray-600">Total Revenue</Text>
          <Text className="text-2xl font-bold text-green-600">
            ${customers.reduce((sum, customer) => sum + customer.total_spent, 0).toFixed(2)}
          </Text>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
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
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="font-medium">
                      {customer.first_name} {customer.last_name}
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-500">{customer.email}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-500">{customer.phone || '-'}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text>{customer.total_orders}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="font-medium">${customer.total_spent.toFixed(2)}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-500">
                      {customer.last_order_date
                        ? new Date(customer.last_order_date).toLocaleDateString()
                        : 'Never'
                      }
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(customer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="text-sm text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Text className="text-gray-500">No customers found.</Text>
        </div>
      )}
    </div>
  )
} 