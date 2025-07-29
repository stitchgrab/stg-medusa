import { definePageConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  Text,
  Button,
  Card,
  Badge,
  Table,
  IconButton,
  useToggleState,
  Modal,
  Input,
  Textarea,
  Select,
  ProgressBar
} from "@medusajs/ui"
import {
  Plus,
  Eye,
  Pencil,
  Trash,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Star
} from "@medusajs/icons"
import { useState, useEffect } from "react"

// Mock data - in real implementation, this would come from API calls
const mockVendorData = {
  id: "vendor_123",
  name: "StitchGrab Vendor",
  handle: "stitchgrab-vendor",
  logo: "https://via.placeholder.com/150",
  stats: {
    totalOrders: 156,
    totalRevenue: 45230.50,
    totalProducts: 89,
    totalCustomers: 234,
    monthlyGrowth: 12.5,
    averageRating: 4.8
  },
  recentOrders: [
    {
      id: "order_001",
      customer: "John Doe",
      amount: 299.99,
      status: "fulfilled",
      date: "2024-01-15"
    },
    {
      id: "order_002",
      customer: "Jane Smith",
      amount: 149.50,
      status: "processing",
      date: "2024-01-14"
    },
    {
      id: "order_003",
      customer: "Mike Johnson",
      amount: 89.99,
      status: "pending",
      date: "2024-01-13"
    }
  ],
  topProducts: [
    {
      id: "prod_001",
      name: "Nike Air Max",
      sales: 45,
      revenue: 6750.00
    },
    {
      id: "prod_002",
      name: "Adidas Ultraboost",
      sales: 32,
      revenue: 4800.00
    },
    {
      id: "prod_003",
      name: "Jordan Retro",
      sales: 28,
      revenue: 4200.00
    }
  ]
}

const VendorDashboard = () => {
  const [vendorData, setVendorData] = useState(mockVendorData)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: vendorData.name,
    handle: vendorData.handle,
    logo: vendorData.logo
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fulfilled":
        return "green"
      case "processing":
        return "blue"
      case "pending":
        return "orange"
      default:
        return "gray"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handleEditSubmit = () => {
    setVendorData(prev => ({
      ...prev,
      ...editForm
    }))
    setIsEditModalOpen(false)
  }

  return (
    <Container className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Heading level="h1" className="text-3xl font-bold text-gray-900">
            Vendor Dashboard
          </Heading>
          <Text className="text-gray-600 mt-2">
            Manage your products, orders, and business performance
          </Text>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Total Orders</Text>
              <Text className="text-2xl font-bold text-gray-900">{vendorData.stats.totalOrders}</Text>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <Text className="text-sm text-green-600">+{vendorData.stats.monthlyGrowth}%</Text>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Total Revenue</Text>
              <Text className="text-2xl font-bold text-gray-900">{formatCurrency(vendorData.stats.totalRevenue)}</Text>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <Text className="text-sm text-green-600">+8.2%</Text>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Total Products</Text>
              <Text className="text-2xl font-bold text-gray-900">{vendorData.stats.totalProducts}</Text>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <Text className="text-sm text-green-600">+3.1%</Text>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Average Rating</Text>
              <div className="flex items-center">
                <Text className="text-2xl font-bold text-gray-900">{vendorData.stats.averageRating}</Text>
                <Star className="w-5 h-5 text-yellow-500 ml-1" />
              </div>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
          <div className="mt-4">
            <Text className="text-sm text-gray-600">{vendorData.stats.totalCustomers} customers</Text>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level="h2" className="text-xl font-semibold">
              Recent Orders
            </Heading>
            <Button variant="secondary" size="small">
              View All
            </Button>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order ID</Table.HeaderCell>
                <Table.HeaderCell>Customer</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {vendorData.recentOrders.map((order) => (
                <Table.Row key={order.id}>
                  <Table.Cell>
                    <Text className="font-medium">{order.id}</Text>
                  </Table.Cell>
                  <Table.Cell>{order.customer}</Table.Cell>
                  <Table.Cell>{formatCurrency(order.amount)}</Table.Cell>
                  <Table.Cell>
                    <Badge color={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{order.date}</Table.Cell>
                  <Table.Cell>
                    <IconButton size="small">
                      <Eye className="w-4 h-4" />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level="h2" className="text-xl font-semibold">
              Top Products
            </Heading>
            <Button variant="secondary" size="small">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {vendorData.topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                  <div>
                    <Text className="font-medium">{product.name}</Text>
                    <Text className="text-sm text-gray-600">{product.sales} sales</Text>
                  </div>
                </div>
                <div className="text-right">
                  <Text className="font-medium">{formatCurrency(product.revenue)}</Text>
                  <Text className="text-sm text-gray-600">Revenue</Text>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card className="p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <Heading level="h2" className="text-xl font-semibold">
            Performance Overview
          </Heading>
          <Select>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </Select>
        </div>

        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <Text className="text-gray-500">Chart placeholder - Revenue and Orders over time</Text>
        </div>
      </Card>

      {/* Edit Profile Modal */}
      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Edit Vendor Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Text className="text-sm font-medium mb-2">Vendor Name</Text>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter vendor name"
                />
              </div>
              <div>
                <Text className="text-sm font-medium mb-2">Handle</Text>
                <Input
                  value={editForm.handle}
                  onChange={(e) => setEditForm(prev => ({ ...prev, handle: e.target.value }))}
                  placeholder="Enter handle"
                />
              </div>
              <div>
                <Text className="text-sm font-medium mb-2">Logo URL</Text>
                <Input
                  value={editForm.logo}
                  onChange={(e) => setEditForm(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="Enter logo URL"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Container>
  )
}

export const config = definePageConfig({
  zone: "vendor.dashboard",
})

export default VendorDashboard 