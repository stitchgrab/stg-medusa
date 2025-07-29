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
  Modal,
  Input,
  Textarea,
  Select,
  Search,
  Pagination,
  useToggleState
} from "@medusajs/ui"
import {
  Eye,
  Pencil,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Search as SearchIcon,
  Filter,
  Download
} from "@medusajs/icons"
import { useState } from "react"

// Mock data for orders
const mockOrders = [
  {
    id: "order_001",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com"
    },
    total: 299.99,
    status: "fulfilled",
    payment_status: "paid",
    fulfillment_status: "fulfilled",
    created_at: "2024-01-15",
    items: [
      { title: "Nike Air Max 270", quantity: 1, price: 129.99 },
      { title: "Adidas Ultraboost 22", quantity: 1, price: 169.99 }
    ],
    shipping_address: {
      address_1: "123 Main St",
      city: "Miami",
      country_code: "US",
      postal_code: "33101"
    }
  },
  {
    id: "order_002",
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com"
    },
    total: 149.50,
    status: "processing",
    payment_status: "paid",
    fulfillment_status: "not_fulfilled",
    created_at: "2024-01-14",
    items: [
      { title: "Jordan Retro 1", quantity: 1, price: 149.50 }
    ],
    shipping_address: {
      address_1: "456 Oak Ave",
      city: "Fort Lauderdale",
      country_code: "US",
      postal_code: "33301"
    }
  },
  {
    id: "order_003",
    customer: {
      name: "Mike Johnson",
      email: "mike.johnson@example.com"
    },
    total: 89.99,
    status: "pending",
    payment_status: "pending",
    fulfillment_status: "not_fulfilled",
    created_at: "2024-01-13",
    items: [
      { title: "Converse Chuck Taylor", quantity: 1, price: 59.99 },
      { title: "Nike Socks", quantity: 2, price: 15.00 }
    ],
    shipping_address: {
      address_1: "789 Pine St",
      city: "West Palm Beach",
      country_code: "US",
      postal_code: "33401"
    }
  },
  {
    id: "order_004",
    customer: {
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com"
    },
    total: 189.99,
    status: "fulfilled",
    payment_status: "paid",
    fulfillment_status: "fulfilled",
    created_at: "2024-01-12",
    items: [
      { title: "Adidas Ultraboost 22", quantity: 1, price: 189.99 }
    ],
    shipping_address: {
      address_1: "321 Elm St",
      city: "Boca Raton",
      country_code: "US",
      postal_code: "33431"
    }
  }
]

const VendorOrders = () => {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fulfilled":
        return "green"
      case "processing":
        return "blue"
      case "pending":
        return "orange"
      case "cancelled":
        return "red"
      default:
        return "gray"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "green"
      case "pending":
        return "orange"
      case "failed":
        return "red"
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const openViewModal = (order: any) => {
    setSelectedOrder(order)
    setIsViewModalOpen(true)
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    ))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "fulfilled":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "processing":
        return <Truck className="w-4 h-4 text-blue-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-orange-600" />
      case "cancelled":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <Container className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Heading level="h1" className="text-3xl font-bold text-gray-900">
            Orders
          </Heading>
          <Text className="text-gray-600 mt-2">
            Manage customer orders and fulfillment
          </Text>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Search
              placeholder="Search orders by ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-3">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-40"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="p-6">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Order</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Payment</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginatedOrders.map((order) => (
              <Table.Row key={order.id}>
                <Table.Cell>
                  <div>
                    <Text className="font-medium">{order.id}</Text>
                    <Text className="text-sm text-gray-600">{order.items.length} items</Text>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div>
                    <Text className="font-medium">{order.customer.name}</Text>
                    <Text className="text-sm text-gray-600">{order.customer.email}</Text>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Text className="font-medium">{formatCurrency(order.total)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <Badge color={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={getPaymentStatusColor(order.payment_status)}>
                    {order.payment_status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text className="text-sm">{order.created_at}</Text>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <IconButton size="small" onClick={() => openViewModal(order)}>
                      <Eye className="w-4 h-4" />
                    </IconButton>
                    {order.status === "pending" && (
                      <IconButton
                        size="small"
                        onClick={() => updateOrderStatus(order.id, "processing")}
                      >
                        <Truck className="w-4 h-4" />
                      </IconButton>
                    )}
                    {order.status === "processing" && (
                      <IconButton
                        size="small"
                        onClick={() => updateOrderStatus(order.id, "fulfilled")}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </IconButton>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Pagination */}
        {filteredOrders.length > itemsPerPage && (
          <div className="mt-6 flex justify-center">
            <Pagination
              pageCount={Math.ceil(filteredOrders.length / itemsPerPage)}
              pageIndex={currentPage - 1}
              onPageChange={(page) => setCurrentPage(page + 1)}
            />
          </div>
        )}
      </Card>

      {/* Order Details Modal */}
      <Modal open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Order Details - {selectedOrder?.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div>
                  <Heading level="h3" className="text-lg font-semibold mb-4">
                    Order Information
                  </Heading>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Text className="text-sm font-medium text-gray-600">Order ID</Text>
                      <Text className="font-medium">{selectedOrder.id}</Text>
                    </div>
                    <div>
                      <Text className="text-sm font-medium text-gray-600">Date</Text>
                      <Text>{selectedOrder.created_at}</Text>
                    </div>
                    <div>
                      <Text className="text-sm font-medium text-gray-600">Status</Text>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedOrder.status)}
                        <Badge color={getStatusColor(selectedOrder.status)}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Text className="text-sm font-medium text-gray-600">Payment</Text>
                      <Badge color={getPaymentStatusColor(selectedOrder.payment_status)}>
                        {selectedOrder.payment_status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <Heading level="h3" className="text-lg font-semibold mb-4">
                    Customer Information
                  </Heading>
                  <div className="space-y-2">
                    <div>
                      <Text className="text-sm font-medium text-gray-600">Name</Text>
                      <Text>{selectedOrder.customer.name}</Text>
                    </div>
                    <div>
                      <Text className="text-sm font-medium text-gray-600">Email</Text>
                      <Text>{selectedOrder.customer.email}</Text>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <Heading level="h3" className="text-lg font-semibold mb-4">
                    Shipping Address
                  </Heading>
                  <div className="space-y-1">
                    <Text>{selectedOrder.shipping_address.address_1}</Text>
                    <Text>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.country_code} {selectedOrder.shipping_address.postal_code}</Text>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <Heading level="h3" className="text-lg font-semibold mb-4">
                    Order Items
                  </Heading>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <Text className="font-medium">{item.title}</Text>
                          <Text className="text-sm text-gray-600">Qty: {item.quantity}</Text>
                        </div>
                        <Text className="font-medium">{formatCurrency(item.price)}</Text>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <Text className="text-lg font-semibold">Total</Text>
                      <Text className="text-lg font-semibold">{formatCurrency(selectedOrder.total)}</Text>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <Heading level="h3" className="text-lg font-semibold mb-4">
                    Update Status
                  </Heading>
                  <div className="flex gap-2">
                    {selectedOrder.status === "pending" && (
                      <Button
                        variant="secondary"
                        onClick={() => updateOrderStatus(selectedOrder.id, "processing")}
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Mark as Processing
                      </Button>
                    )}
                    {selectedOrder.status === "processing" && (
                      <Button
                        variant="secondary"
                        onClick={() => updateOrderStatus(selectedOrder.id, "fulfilled")}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Fulfilled
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Container>
  )
}

export const config = definePageConfig({
  zone: "vendor.orders",
})

export default VendorOrders 