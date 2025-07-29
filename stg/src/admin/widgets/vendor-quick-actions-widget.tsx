import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  Card,
  Text,
  Button
} from "@medusajs/ui"
import {
  Plus,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Truck,
  Users
} from "@medusajs/icons"

const VendorQuickActionsWidget = () => {
  const quickActions = [
    {
      title: "Add Product",
      description: "Create a new product listing",
      icon: Plus,
      color: "bg-blue-500",
      href: "/vendor/products"
    },
    {
      title: "View Orders",
      description: "Check recent orders",
      icon: ShoppingCart,
      color: "bg-green-500",
      href: "/vendor/orders"
    },
    {
      title: "Analytics",
      description: "View performance metrics",
      icon: BarChart3,
      color: "bg-purple-500",
      href: "/vendor/analytics"
    },
    {
      title: "Inventory",
      description: "Manage stock levels",
      icon: Package,
      color: "bg-orange-500",
      href: "/vendor/products"
    },
    {
      title: "Shipping",
      description: "Configure delivery options",
      icon: Truck,
      color: "bg-indigo-500",
      href: "/vendor/settings"
    },
    {
      title: "Customers",
      description: "View customer data",
      icon: Users,
      color: "bg-pink-500",
      href: "/vendor/customers"
    }
  ]

  return (
    <Card className="p-6">
      <div className="mb-4">
        <Text className="text-lg font-semibold">Quick Actions</Text>
        <Text className="text-sm text-gray-600">Access common tasks quickly</Text>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <Button
              key={index}
              variant="secondary"
              className="flex flex-col items-center justify-center p-4 h-24 text-center"
              onClick={() => {
                // In a real implementation, this would navigate to the appropriate page
                console.log(`Navigate to: ${action.href}`)
              }}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${action.color}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <Text className="text-xs font-medium">{action.title}</Text>
            </Button>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            // In a real implementation, this would navigate to settings
            console.log("Navigate to settings")
          }}
        >
          <Settings className="w-4 h-4 mr-2" />
          Manage Settings
        </Button>
      </div>
    </Card>
  )
}

export const config = defineWidgetConfig({
  zone: "vendor.dashboard.after",
})

export default VendorQuickActionsWidget 