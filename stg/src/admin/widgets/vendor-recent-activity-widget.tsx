import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  Card,
  Text,
  Badge
} from "@medusajs/ui"
import {
  ShoppingCart,
  Package,
  User,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle
} from "@medusajs/icons"

const VendorRecentActivityWidget = () => {
  // Mock activity data
  const activities = [
    {
      id: 1,
      type: "order",
      title: "New order received",
      description: "Order #ORD-001 from John Doe",
      amount: 299.99,
      time: "2 minutes ago",
      status: "pending",
      icon: ShoppingCart
    },
    {
      id: 2,
      type: "product",
      title: "Product updated",
      description: "Nike Air Max 270 inventory updated",
      time: "15 minutes ago",
      status: "completed",
      icon: Package
    },
    {
      id: 3,
      type: "customer",
      title: "New customer registered",
      description: "Jane Smith joined your store",
      time: "1 hour ago",
      status: "completed",
      icon: User
    },
    {
      id: 4,
      type: "payment",
      title: "Payment received",
      description: "Payment for order #ORD-002",
      amount: 149.50,
      time: "2 hours ago",
      status: "completed",
      icon: DollarSign
    },
    {
      id: 5,
      type: "order",
      title: "Order fulfilled",
      description: "Order #ORD-003 marked as fulfilled",
      time: "3 hours ago",
      status: "completed",
      icon: CheckCircle
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "green"
      case "pending":
        return "orange"
      case "failed":
        return "red"
      default:
        return "gray"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-orange-600" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <Text className="text-lg font-semibold">Recent Activity</Text>
        <Text className="text-sm text-gray-600">Latest updates and activities</Text>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <Text className="font-medium text-sm">{activity.title}</Text>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(activity.status)}
                    <Badge color={getStatusColor(activity.status)} size="small">
                      {activity.status}
                    </Badge>
                  </div>
                </div>

                <Text className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </Text>

                <div className="flex items-center justify-between mt-2">
                  <Text className="text-xs text-gray-500">{activity.time}</Text>
                  {activity.amount && (
                    <Text className="text-sm font-medium text-green-600">
                      {formatCurrency(activity.amount)}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Activity
        </button>
      </div>
    </Card>
  )
}

export const config = defineWidgetConfig({
  zone: "vendor.dashboard.after",
})

export default VendorRecentActivityWidget 