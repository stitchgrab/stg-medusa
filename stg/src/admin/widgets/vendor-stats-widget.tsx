import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  Card,
  Text,
  Badge,
  ProgressBar
} from "@medusajs/ui"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package
} from "@medusajs/icons"

const VendorStatsWidget = () => {
  // Mock data - in real implementation, this would come from API calls
  const stats = {
    totalRevenue: 45230.50,
    totalOrders: 156,
    totalCustomers: 234,
    averageOrderValue: 289.94,
    revenueGrowth: 12.5,
    ordersGrowth: 8.2,
    customersGrowth: 15.3,
    aovGrowth: 4.1
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getGrowthColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600"
  }

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <Text className="text-lg font-semibold">Performance Overview</Text>
        <Text className="text-sm text-gray-600">Key metrics for your business</Text>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <Text className="text-sm font-medium">Revenue</Text>
            </div>
            <div className="flex items-center gap-1">
              {getGrowthIcon(stats.revenueGrowth)}
              <Text className={`text-xs ${getGrowthColor(stats.revenueGrowth)}`}>
                +{stats.revenueGrowth}%
              </Text>
            </div>
          </div>
          <Text className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</Text>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <Text className="text-sm font-medium">Orders</Text>
            </div>
            <div className="flex items-center gap-1">
              {getGrowthIcon(stats.ordersGrowth)}
              <Text className={`text-xs ${getGrowthColor(stats.ordersGrowth)}`}>
                +{stats.ordersGrowth}%
              </Text>
            </div>
          </div>
          <Text className="text-xl font-bold">{stats.totalOrders}</Text>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-600" />
              <Text className="text-sm font-medium">Customers</Text>
            </div>
            <div className="flex items-center gap-1">
              {getGrowthIcon(stats.customersGrowth)}
              <Text className={`text-xs ${getGrowthColor(stats.customersGrowth)}`}>
                +{stats.customersGrowth}%
              </Text>
            </div>
          </div>
          <Text className="text-xl font-bold">{stats.totalCustomers}</Text>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-600" />
              <Text className="text-sm font-medium">Avg Order</Text>
            </div>
            <div className="flex items-center gap-1">
              {getGrowthIcon(stats.aovGrowth)}
              <Text className={`text-xs ${getGrowthColor(stats.aovGrowth)}`}>
                +{stats.aovGrowth}%
              </Text>
            </div>
          </div>
          <Text className="text-xl font-bold">{formatCurrency(stats.averageOrderValue)}</Text>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <Text className="text-sm font-medium">Monthly Goal Progress</Text>
          <Text className="text-sm text-gray-600">75%</Text>
        </div>
        <ProgressBar value={75} className="mb-2" color="blue" />
        <Text className="text-xs text-gray-600">Revenue target: $60,000</Text>
      </div>
    </Card>
  )
}

export const config = defineWidgetConfig({
  zone: "vendor.dashboard.after",
})

export default VendorStatsWidget 