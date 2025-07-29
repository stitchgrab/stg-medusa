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
  Plus,
  Eye,
  Pencil,
  Trash,
  Search as SearchIcon,
  Filter,
  SortAscending,
  MoreHorizontal
} from "@medusajs/icons"
import { useState } from "react"

// Mock data for products
const mockProducts = [
  {
    id: "prod_001",
    title: "Nike Air Max 270",
    handle: "nike-air-max-270",
    status: "published",
    price: 129.99,
    inventory: 45,
    category: "Sneakers",
    created_at: "2024-01-10",
    thumbnail: "https://via.placeholder.com/60"
  },
  {
    id: "prod_002",
    title: "Adidas Ultraboost 22",
    handle: "adidas-ultraboost-22",
    status: "draft",
    price: 189.99,
    inventory: 23,
    category: "Running",
    created_at: "2024-01-08",
    thumbnail: "https://via.placeholder.com/60"
  },
  {
    id: "prod_003",
    title: "Jordan Retro 1",
    handle: "jordan-retro-1",
    status: "published",
    price: 169.99,
    inventory: 12,
    category: "Basketball",
    created_at: "2024-01-05",
    thumbnail: "https://via.placeholder.com/60"
  },
  {
    id: "prod_004",
    title: "Converse Chuck Taylor",
    handle: "converse-chuck-taylor",
    status: "published",
    price: 59.99,
    inventory: 67,
    category: "Casual",
    created_at: "2024-01-03",
    thumbnail: "https://via.placeholder.com/60"
  }
]

const VendorProducts = () => {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const [newProduct, setNewProduct] = useState({
    title: "",
    handle: "",
    price: "",
    inventory: "",
    category: "",
    description: "",
    status: "draft"
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "green"
      case "draft":
        return "gray"
      case "archived":
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.handle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAddProduct = () => {
    const product = {
      id: `prod_${Date.now()}`,
      ...newProduct,
      price: parseFloat(newProduct.price),
      inventory: parseInt(newProduct.inventory),
      created_at: new Date().toISOString().split('T')[0],
      thumbnail: "https://via.placeholder.com/60"
    }
    setProducts(prev => [product, ...prev])
    setNewProduct({
      title: "",
      handle: "",
      price: "",
      inventory: "",
      category: "",
      description: "",
      status: "draft"
    })
    setIsAddModalOpen(false)
  }

  const handleEditProduct = () => {
    if (!selectedProduct) return

    setProducts(prev => prev.map(product =>
      product.id === selectedProduct.id
        ? { ...product, ...selectedProduct }
        : product
    ))
    setIsEditModalOpen(false)
    setSelectedProduct(null)
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId))
  }

  const openEditModal = (product: any) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  return (
    <Container className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Heading level="h1" className="text-3xl font-bold text-gray-900">
            Products
          </Heading>
          <Text className="text-gray-600 mt-2">
            Manage your product catalog and inventory
          </Text>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Search
              placeholder="Search products..."
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
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </Select>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="p-6">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Inventory</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginatedProducts.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>
                  <div className="flex items-center">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-12 h-12 rounded-lg mr-3"
                    />
                    <div>
                      <Text className="font-medium">{product.title}</Text>
                      <Text className="text-sm text-gray-600">{product.handle}</Text>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell>{formatCurrency(product.price)}</Table.Cell>
                <Table.Cell>
                  <Badge color={product.inventory > 10 ? "green" : "orange"}>
                    {product.inventory} in stock
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{product.created_at}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <IconButton size="small">
                      <Eye className="w-4 h-4" />
                    </IconButton>
                    <IconButton size="small" onClick={() => openEditModal(product)}>
                      <Pencil className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </IconButton>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Pagination */}
        {filteredProducts.length > itemsPerPage && (
          <div className="mt-6 flex justify-center">
            <Pagination
              pageCount={Math.ceil(filteredProducts.length / itemsPerPage)}
              pageIndex={currentPage - 1}
              onPageChange={(page) => setCurrentPage(page + 1)}
            />
          </div>
        )}
      </Card>

      {/* Add Product Modal */}
      <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add New Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Text className="text-sm font-medium mb-2">Product Title</Text>
                <Input
                  value={newProduct.title}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter product title"
                />
              </div>
              <div>
                <Text className="text-sm font-medium mb-2">Handle</Text>
                <Input
                  value={newProduct.handle}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, handle: e.target.value }))}
                  placeholder="Enter product handle"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm font-medium mb-2">Price</Text>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium mb-2">Inventory</Text>
                  <Input
                    type="number"
                    value={newProduct.inventory}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, inventory: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <Text className="text-sm font-medium mb-2">Category</Text>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                >
                  <option value="">Select category</option>
                  <option value="Sneakers">Sneakers</option>
                  <option value="Running">Running</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Casual">Casual</option>
                </Select>
              </div>
              <div>
                <Text className="text-sm font-medium mb-2">Description</Text>
                <Textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
              <div>
                <Text className="text-sm font-medium mb-2">Status</Text>
                <Select
                  value={newProduct.status}
                  onValueChange={(value) => setNewProduct(prev => ({ ...prev, status: value }))}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>
              Add Product
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Edit Product Modal */}
      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProduct && (
              <div className="space-y-4">
                <div>
                  <Text className="text-sm font-medium mb-2">Product Title</Text>
                  <Input
                    value={selectedProduct.title}
                    onChange={(e) => setSelectedProduct(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter product title"
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium mb-2">Handle</Text>
                  <Input
                    value={selectedProduct.handle}
                    onChange={(e) => setSelectedProduct(prev => ({ ...prev, handle: e.target.value }))}
                    placeholder="Enter product handle"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium mb-2">Price</Text>
                    <Input
                      type="number"
                      value={selectedProduct.price}
                      onChange={(e) => setSelectedProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Text className="text-sm font-medium mb-2">Inventory</Text>
                    <Input
                      type="number"
                      value={selectedProduct.inventory}
                      onChange={(e) => setSelectedProduct(prev => ({ ...prev, inventory: parseInt(e.target.value) }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <Text className="text-sm font-medium mb-2">Category</Text>
                  <Select
                    value={selectedProduct.category}
                    onValueChange={(value) => setSelectedProduct(prev => ({ ...prev, category: value }))}
                  >
                    <option value="Sneakers">Sneakers</option>
                    <option value="Running">Running</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Casual">Casual</option>
                  </Select>
                </div>
                <div>
                  <Text className="text-sm font-medium mb-2">Status</Text>
                  <Select
                    value={selectedProduct.status}
                    onValueChange={(value) => setSelectedProduct(prev => ({ ...prev, status: value }))}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Select>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Container>
  )
}

export const config = definePageConfig({
  zone: "vendor.products",
})

export default VendorProducts 