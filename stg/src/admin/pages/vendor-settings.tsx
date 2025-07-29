import { definePageConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  Text,
  Button,
  Card,
  Badge,
  Input,
  Textarea,
  Select,
  Switch,
  Divider,
  useToggleState
} from "@medusajs/ui"
import {
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Bell,
  CreditCard,
  Truck,
  Settings
} from "@medusajs/icons"
import { useState } from "react"

const VendorSettings = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [settings, setSettings] = useState({
    profile: {
      name: "StitchGrab Vendor",
      handle: "stitchgrab-vendor",
      email: "vendor@stitchgrab.com",
      phone: "+1 (305) 555-0123",
      logo: "https://via.placeholder.com/150",
      description: "Premium fashion retailer specializing in same-day delivery across South Florida."
    },
    business: {
      address: {
        address_1: "123 Fashion Ave",
        address_2: "Suite 100",
        city: "Miami",
        state: "FL",
        postal_code: "33101",
        country: "US"
      },
      tax_id: "12-3456789",
      business_type: "LLC",
      established_date: "2020-01-15"
    },
    preferences: {
      auto_fulfill: true,
      email_notifications: true,
      sms_notifications: false,
      order_updates: true,
      inventory_alerts: true,
      low_stock_threshold: 10
    },
    shipping: {
      free_shipping_threshold: 50,
      handling_time: 1,
      return_policy_days: 30,
      shipping_zones: ["local", "regional"]
    },
    payment: {
      payout_schedule: "weekly",
      minimum_payout: 100,
      bank_account: {
        account_number: "****1234",
        routing_number: "****5678",
        bank_name: "Chase Bank"
      }
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(settings.profile)

  const handleSaveProfile = () => {
    setSettings(prev => ({
      ...prev,
      profile: editForm
    }))
    setIsEditing(false)
  }

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const updateAddress = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      business: {
        ...prev.business,
        address: {
          ...prev.business.address,
          [key]: value
        }
      }
    }))
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "business", label: "Business", icon: Building },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard }
  ]

  return (
    <Container className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Heading level="h1" className="text-3xl font-bold text-gray-900">
            Settings
          </Heading>
          <Text className="text-gray-600 mt-2">
            Manage your vendor profile and business settings
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <Text className="font-medium">{tab.label}</Text>
                  </button>
                )
              })}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Heading level="h2" className="text-xl font-semibold">
                  Profile Information
                </Heading>
                <Button
                  variant={isEditing ? "secondary" : "primary"}
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <Text className="text-sm font-medium text-gray-600">Logo</Text>
                    <Input
                      value={editForm.logo}
                      onChange={(e) => setEditForm(prev => ({ ...prev, logo: e.target.value }))}
                      placeholder="Logo URL"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-gray-600 mb-2">Vendor Name</Text>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter vendor name"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-600 mb-2">Handle</Text>
                    <Input
                      value={editForm.handle}
                      onChange={(e) => setEditForm(prev => ({ ...prev, handle: e.target.value }))}
                      placeholder="Enter handle"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-600 mb-2">Email</Text>
                    <Input
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-600 mb-2">Phone</Text>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Text className="text-sm font-medium text-gray-600 mb-2">Description</Text>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter vendor description"
                    rows={4}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Business Tab */}
          {activeTab === "business" && (
            <Card className="p-6">
              <Heading level="h2" className="text-xl font-semibold mb-6">
                Business Information
              </Heading>

              <div className="space-y-6">
                <div>
                  <Text className="text-sm font-medium text-gray-600 mb-4">Business Address</Text>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Text className="text-sm font-medium text-gray-600 mb-2">Address Line 1</Text>
                      <Input
                        value={settings.business.address.address_1}
                        onChange={(e) => updateAddress("address_1", e.target.value)}
                        placeholder="Enter address"
                      />
                    </div>
                    <div>
                      <Text className="text-sm font-medium text-gray-600 mb-2">Address Line 2</Text>
                      <Input
                        value={settings.business.address.address_2}
                        onChange={(e) => updateAddress("address_2", e.target.value)}
                        placeholder="Suite, Apt, etc."
                      />
                    </div>
                    <div>
                      <Text className="text-sm font-medium text-gray-600 mb-2">City</Text>
                      <Input
                        value={settings.business.address.city}
                        onChange={(e) => updateAddress("city", e.target.value)}
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <Text className="text-sm font-medium text-gray-600 mb-2">State</Text>
                      <Input
                        value={settings.business.address.state}
                        onChange={(e) => updateAddress("state", e.target.value)}
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Text className="text-sm font-medium text-gray-600 mb-2">Postal Code</Text>
                      <Input
                        value={settings.business.address.postal_code}
                        onChange={(e) => updateAddress("postal_code", e.target.value)}
                        placeholder="Enter postal code"
                      />
                    </div>
                    <div>
                      <Text className="text-sm font-medium text-gray-600 mb-2">Country</Text>
                      <Select
                        value={settings.business.address.country}
                        onValueChange={(value) => updateAddress("country", value)}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="MX">Mexico</option>
                      </Select>
                    </div>
                  </div>
                </div>

                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-gray-600 mb-2">Tax ID</Text>
                    <Input
                      value={settings.business.tax_id}
                      onChange={(e) => updateSetting("business", "tax_id", e.target.value)}
                      placeholder="Enter tax ID"
                    />
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-600 mb-2">Business Type</Text>
                    <Select
                      value={settings.business.business_type}
                      onValueChange={(value) => updateSetting("business", "business_type", value)}
                    >
                      <option value="LLC">LLC</option>
                      <option value="Corporation">Corporation</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                    </Select>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-600 mb-2">Established Date</Text>
                    <Input
                      type="date"
                      value={settings.business.established_date}
                      onChange={(e) => updateSetting("business", "established_date", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <Card className="p-6">
              <Heading level="h2" className="text-xl font-semibold mb-6">
                Notification Preferences
              </Heading>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="font-medium">Email Notifications</Text>
                      <Text className="text-sm text-gray-600">Receive order updates via email</Text>
                    </div>
                    <Switch
                      checked={settings.preferences.email_notifications}
                      onCheckedChange={(checked) => updateSetting("preferences", "email_notifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="font-medium">SMS Notifications</Text>
                      <Text className="text-sm text-gray-600">Receive order updates via SMS</Text>
                    </div>
                    <Switch
                      checked={settings.preferences.sms_notifications}
                      onCheckedChange={(checked) => updateSetting("preferences", "sms_notifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="font-medium">Order Updates</Text>
                      <Text className="text-sm text-gray-600">Get notified when order status changes</Text>
                    </div>
                    <Switch
                      checked={settings.preferences.order_updates}
                      onCheckedChange={(checked) => updateSetting("preferences", "order_updates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="font-medium">Inventory Alerts</Text>
                      <Text className="text-sm text-gray-600">Get notified when inventory is low</Text>
                    </div>
                    <Switch
                      checked={settings.preferences.inventory_alerts}
                      onCheckedChange={(checked) => updateSetting("preferences", "inventory_alerts", checked)}
                    />
                  </div>
                </div>

                <Divider />

                <div>
                  <Text className="text-sm font-medium text-gray-600 mb-2">Low Stock Threshold</Text>
                  <Input
                    type="number"
                    value={settings.preferences.low_stock_threshold}
                    onChange={(e) => updateSetting("preferences", "low_stock_threshold", parseInt(e.target.value))}
                    placeholder="10"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Shipping Tab */}
          {activeTab === "shipping" && (
            <Card className="p-6">
              <Heading level="h2" className="text-xl font-semibold mb-6">
                Shipping Settings
              </Heading>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-gray-600 mb-2">Free Shipping Threshold</Text>
                    <Input
                      type="number"
                      value={settings.shipping.free_shipping_threshold}
                      onChange={(e) => updateSetting("shipping", "free_shipping_threshold", parseFloat(e.target.value))}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-600 mb-2">Handling Time (days)</Text>
                    <Input
                      type="number"
                      value={settings.shipping.handling_time}
                      onChange={(e) => updateSetting("shipping", "handling_time", parseInt(e.target.value))}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-600 mb-2">Return Policy (days)</Text>
                    <Input
                      type="number"
                      value={settings.shipping.return_policy_days}
                      onChange={(e) => updateSetting("shipping", "return_policy_days", parseInt(e.target.value))}
                      placeholder="30"
                    />
                  </div>
                </div>

                <div>
                  <Text className="text-sm font-medium text-gray-600 mb-2">Shipping Zones</Text>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.shipping.shipping_zones.includes("local")}
                        onChange={(e) => {
                          const zones = e.target.checked
                            ? [...settings.shipping.shipping_zones, "local"]
                            : settings.shipping.shipping_zones.filter(z => z !== "local")
                          updateSetting("shipping", "shipping_zones", zones)
                        }}
                        className="mr-2"
                      />
                      <Text>Local (Same-day delivery)</Text>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.shipping.shipping_zones.includes("regional")}
                        onChange={(e) => {
                          const zones = e.target.checked
                            ? [...settings.shipping.shipping_zones, "regional"]
                            : settings.shipping.shipping_zones.filter(z => z !== "regional")
                          updateSetting("shipping", "shipping_zones", zones)
                        }}
                        className="mr-2"
                      />
                      <Text>Regional (Next-day delivery)</Text>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <Card className="p-6">
              <Heading level="h2" className="text-xl font-semibold mb-6">
                Payment Settings
              </Heading>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-gray-600 mb-2">Payout Schedule</Text>
                    <Select
                      value={settings.payment.payout_schedule}
                      onValueChange={(value) => updateSetting("payment", "payout_schedule", value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </Select>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-600 mb-2">Minimum Payout</Text>
                    <Input
                      type="number"
                      value={settings.payment.minimum_payout}
                      onChange={(e) => updateSetting("payment", "minimum_payout", parseFloat(e.target.value))}
                      placeholder="100"
                    />
                  </div>
                </div>

                <Divider />

                <div>
                  <Text className="text-sm font-medium text-gray-600 mb-4">Bank Account Information</Text>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Text className="text-sm font-medium text-gray-600 mb-2">Bank Name</Text>
                      <Input
                        value={settings.payment.bank_account.bank_name}
                        onChange={(e) => updateSetting("payment", "bank_account", {
                          ...settings.payment.bank_account,
                          bank_name: e.target.value
                        })}
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div>
                      <Text className="text-sm font-medium text-gray-600 mb-2">Account Number</Text>
                      <Input
                        value={settings.payment.bank_account.account_number}
                        onChange={(e) => updateSetting("payment", "bank_account", {
                          ...settings.payment.bank_account,
                          account_number: e.target.value
                        })}
                        placeholder="****1234"
                      />
                    </div>
                    <div>
                      <Text className="text-sm font-medium text-gray-600 mb-2">Routing Number</Text>
                      <Input
                        value={settings.payment.bank_account.routing_number}
                        onChange={(e) => updateSetting("payment", "bank_account", {
                          ...settings.payment.bank_account,
                          routing_number: e.target.value
                        })}
                        placeholder="****5678"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Container>
  )
}

export const config = definePageConfig({
  zone: "vendor.settings",
})

export default VendorSettings 