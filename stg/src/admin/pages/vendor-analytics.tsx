import { definePageConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  Text,
  Button,
  Card,
  Badge,
  Select,
  ProgressBar
} from "@medusajs/ui"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "@medusajs/icons"
import { useState } from "react"

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalRevenue: 45230.50,
    totalOrders: 156,
    totalCustomers: 234,
    averageOrderValue: 289.94,
    conversionRate: 3.2,
    customerRetentionRate: 68.5
  },
  trends: {
    revenue: [
      { month: "Jan", value: 12500 },
      { month: "Feb", value: 15800 },
      { month: "Mar", value: 14200 },
      { month: "Apr", value: 18900 },
      { month: "May", value: 22100 },
      { month: "Jun", value: 45230 }
    ],
    orders: [
      { month: "Jan", value: 45 },
      { month: "Feb", value: 52 },
      { month: "Mar", value: 48 },
      { month: "Apr", value: 67 },
      { month: "May", value: 78 },
      { month: "Jun", value: 156 }
    ]
  },
  topProducts: [
    {
      name: "Nike Air Max 270",
      revenue: 6750.00,
      sales: 45,
      percentage: 14.9
    },
    {
      name: "Adidas Ultraboost 22",
      revenue: 4800.00,
      sales: 32,
      percentage: 10.6
    },
    {
      name: "Jordan Retro 1",
      revenue: 4200.00,
      sales: 28,
      percentage: 9.3
    },
    {
      name: "Converse Chuck Taylor",
      revenue: 3600.00,
      sales: 60,
      percentage: 8.0
    }
  ],
  customerSegments: [
    { segment: "New Customers", count: 89, percentage: 38 },
    { segment: "Returning Customers", count: 145, percentage: 62 }
  ],
  orderStatus: [
    { status: "Fulfilled", count: 98, percentage: 62.8 },
    { status: "Processing", count: 34, percentage: 21.8 },
    { status: "Pending", count: 24, percentage: 15.4 }
  ]
}

const VendorAnalytics = () => {
  const [timeRange, setTimeRange] = useState("6months")
  const [analyticsData] = useState(mockAnalyticsData)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getGrowthColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600"
  }

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  return (
    <Container className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Heading level="h1" className="text-3xl font-bold text-gray-900">
            Analytics
          </Heading>
          <Text className="text-gray-600 mt-2">
            Track your business performance and customer insights
          </Text>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="1year">Last year</option>
          </Select>
          <Button variant="secondary">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Total Revenue</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.overview.totalRevenue)}
              </Text>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              {getGrowthIcon(12.5)}
              <Text className={`text-sm ml-1 ${getGrowthColor(12.5)}`}>+12.5%</Text>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Total Orders</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.totalOrders}
              </Text>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              {getGrowthIcon(8.2)}
              <Text className={`text-sm ml-1 ${getGrowthColor(8.2)}`}>+8.2%</Text>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Average Order Value</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.overview.averageOrderValue)}
              </Text>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              {getGrowthIcon(4.1)}
              <Text className={`text-sm ml-1 ${getGrowthColor(4.1)}`}>+4.1%</Text>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm font-medium text-gray-600">Conversion Rate</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {formatPercentage(analyticsData.overview.conversionRate)}
              </Text>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              {getGrowthIcon(2.3)}
              <Text className={`text-sm ml-1 ${getGrowthColor(2.3)}`}>+2.3%</Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level="h2" className="text-xl font-semibold">
              Revenue Trend
            </Heading>
            <Badge color="green">+12.5%</Badge>
          </div>

          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <Text className="text-gray-500">Revenue chart placeholder</Text>
              <Text className="text-sm text-gray-400">Monthly revenue over time</Text>
            </div>
          </div>
        </Card>

        {/* Orders Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level="h2" className="text-xl font-semibold">
              Orders Trend
            </Heading>
            <Badge color="blue">+8.2%</Badge>
          </div>

          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <Text className="text-gray-500">Orders chart placeholder</Text>
              <Text className="text-sm text-gray-400">Monthly orders over time</Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Products */}
        <Card className="p-6">
          <Heading level="h2" className="text-xl font-semibold mb-6">
            Top Products
          </Heading>

          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <Text className="font-medium">{product.name}</Text>
                    <Text className="text-sm font-medium">{formatCurrency(product.revenue)}</Text>
                  </div>
                  <div className="flex items-center justify-between">
                    <Text className="text-sm text-gray-600">{product.sales} sales</Text>
                    <Text className="text-sm text-gray-600">{formatPercentage(product.percentage)}</Text>
                  </div>
                  <ProgressBar
                    value={product.percentage}
                    className="mt-2"
                    color="blue"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Customer Segments */}
        <Card className="p-6">
          <Heading level="h2" className="text-xl font-semibold mb-6">
            Customer Segments
          </Heading>

          <div className="space-y-4">
            {analyticsData.customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <Text className="font-medium">{segment.segment}</Text>
                    <Text className="text-sm font-medium">{segment.count}</Text>
                  </div>
                  <ProgressBar
                    value={segment.percentage}
                    className="mt-2"
                    color={index === 0 ? "green" : "blue"}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Status */}
        <Card className="p-6">
          <Heading level="h2" className="text-xl font-semibold mb-6">
            Order Status
          </Heading>

          <div className="space-y-4">
            {analyticsData.orderStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <Text className="font-medium">{status.status}</Text>
                    <Text className="text-sm font-medium">{status.count}</Text>
                  </div>
                  <ProgressBar
                    value={status.percentage}
                    className="mt-2"
                    color={index === 0 ? "green" : index === 1 ? "blue" : "orange"}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Customer Retention */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Heading level="h2" className="text-xl font-semibold">
              Customer Retention
            </Heading>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>

          <div className="text-center">
            <Text className="text-4xl font-bold text-gray-900">
              {formatPercentage(analyticsData.overview.customerRetentionRate)}
            </Text>
            <Text className="text-gray-600 mt-2">
              of customers return for repeat purchases
            </Text>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-center">
              {getGrowthIcon(5.2)}
              <Text className={`text-sm ml-1 ${getGrowthColor(5.2)}`}>
                +5.2% from last period
              </Text>
            </div>
          </div>
        </Card>

        {/* Geographic Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Heading level="h2" className="text-xl font-semibold">
              Top Locations
            </Heading>
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Text className="font-medium">Miami, FL</Text>
              <Text className="text-sm text-gray-600">45%</Text>
            </div>
            <ProgressBar value={45} className="mb-2" color="blue" />

            <div className="flex items-center justify-between">
              <Text className="font-medium">Fort Lauderdale, FL</Text>
              <Text className="text-sm text-gray-600">28%</Text>
            </div>
            <ProgressBar value={28} className="mb-2" color="green" />

            <div className="flex items-center justify-between">
              <Text className="font-medium">West Palm Beach, FL</Text>
              <Text className="text-sm text-gray-600">18%</Text>
            </div>
            <ProgressBar value={18} className="mb-2" color="orange" />

            <div className="flex items-center justify-between">
              <Text className="font-medium">Other</Text>
              <Text className="text-sm text-gray-600">9%</Text>
            </div>
            <ProgressBar value={9} className="mb-2" color="gray" />
          </div>
        </Card>
      </div>
    </Container>
  )
}

export const config = definePageConfig({
  zone: "vendor.analytics",
})

export default VendorAnalytics 