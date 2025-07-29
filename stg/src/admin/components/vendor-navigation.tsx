import {
  Container,
  Button,
  Text,
  useToggleState
} from "@medusajs/ui"
import {
  Plus,
  ShoppingCart,
  Users,
  User,
  XMark
} from "@medusajs/icons"
import { useState } from "react"

const VendorNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      label: "Dashboard",
      href: "/vendor/dashboard",
      icon: Plus,
      description: "Overview and analytics"
    },
    {
      label: "Products",
      href: "/vendor/products",
      icon: Plus,
      description: "Manage your catalog"
    },
    {
      label: "Orders",
      href: "/vendor/orders",
      icon: ShoppingCart,
      description: "View and fulfill orders"
    },
    {
      label: "Analytics",
      href: "/vendor/analytics",
      icon: Users,
      description: "Performance insights"
    },
    {
      label: "Settings",
      href: "/vendor/settings",
      icon: User,
      description: "Business configuration"
    }
  ]

  const handleNavigation = (href: string) => {
    // In a real implementation, this would navigate to the appropriate page
    console.log(`Navigate to: ${href}`)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <Container className="px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Text className="text-white font-bold text-sm">SG</Text>
              </div>
              <div>
                <Text className="font-semibold text-gray-900">StitchGrab Vendor</Text>
                <Text className="text-xs text-gray-600">Marketplace Dashboard</Text>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.label}
                    variant="secondary"
                    size="small"
                    className="flex items-center gap-2 px-3 py-2"
                    onClick={() => handleNavigation(item.href)}
                  >
                    <Icon className="w-4 h-4" />
                    <Text className="text-sm">{item.label}</Text>
                  </Button>
                )
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="small">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <Container className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Text className="text-white font-bold text-sm">SG</Text>
              </div>
              <div>
                <Text className="font-semibold text-gray-900">Vendor Dashboard</Text>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="secondary"
              size="small"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMark className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="py-4 border-t border-gray-200">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.label}
                      variant="secondary"
                      className="w-full justify-start"
                      onClick={() => {
                        handleNavigation(item.href)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <Text className="font-medium">{item.label}</Text>
                        <Text className="text-xs text-gray-600">{item.description}</Text>
                      </div>
                    </Button>
                  )
                })}
              </nav>
            </div>
          )}
        </Container>
      </div>
    </>
  )
}

export default VendorNavigation 