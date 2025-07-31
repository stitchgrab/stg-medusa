'use client'

import { useState } from 'react'
import { Button, Text, Heading, Input, Label, Badge } from '@medusajs/ui'
import { ShoppingBag, CheckCircle, XCircle, ArrowPath } from '@medusajs/icons'

export default function ShopifySettingsPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [shopifyUrl, setShopifyUrl] = useState('')
  const [accessToken, setAccessToken] = useState('')

  const handleConnect = async () => {
    if (!shopifyUrl || !accessToken) {
      alert('Please enter both Shopify URL and Access Token')
      return
    }

    setConnecting(true)
    try {
      // TODO: Implement Shopify connection API call
      console.log('Connecting to Shopify:', { shopifyUrl, accessToken })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsConnected(true)
    } catch (error) {
      console.error('Failed to connect Shopify:', error)
      alert('Failed to connect to Shopify. Please check your credentials.')
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    setDisconnecting(true)
    try {
      // TODO: Implement Shopify disconnection API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsConnected(false)
      setShopifyUrl('')
      setAccessToken('')
    } catch (error) {
      console.error('Failed to disconnect Shopify:', error)
    } finally {
      setDisconnecting(false)
    }
  }

  const handleSync = async () => {
    try {
      // TODO: Implement Shopify sync API call
      console.log('Syncing with Shopify')

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      alert('Sync completed successfully!')
    } catch (error) {
      console.error('Failed to sync with Shopify:', error)
      alert('Failed to sync with Shopify. Please try again.')
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Heading level="h1" className="text-2xl font-semibold mb-2">
          Shopify Connection
        </Heading>
        <Text className="text-gray-600">
          Connect your Shopify store to sync products and orders.
        </Text>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Heading level="h2" className="text-lg font-semibold">
              Store Integration
            </Heading>
            <Text className="text-sm text-gray-500 mt-1">
              Sync your Shopify store with StitchGrab
            </Text>
          </div>
          <Badge variant={isConnected ? "secondary" : "danger"}>
            {isConnected ? (
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </div>
            ) : (
              <div className="flex items-center">
                <XCircle className="h-3 w-3 mr-1" />
                Not Connected
              </div>
            )}
          </Badge>
        </div>

        {isConnected ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <Text className="text-green-800 font-medium">
                  Shopify store connected successfully
                </Text>
              </div>
              <Text className="text-green-700 text-sm mt-1">
                Your Shopify store is connected and ready for syncing.
              </Text>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Store URL</Label>
                <Text className="text-sm text-gray-600">{shopifyUrl}</Text>
              </div>
              <div>
                <Label>Last Sync</Label>
                <Text className="text-sm text-gray-600">2 hours ago</Text>
              </div>
              <div>
                <Label>Products Synced</Label>
                <Text className="text-sm text-gray-600">1,247 products</Text>
              </div>
              <div>
                <Label>Orders Synced</Label>
                <Text className="text-sm text-gray-600">156 orders</Text>
              </div>
            </div>

            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleSync}
                className="flex items-center"
              >
                <ArrowPath className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
              <Button
                variant="danger"
                onClick={handleDisconnect}
                disabled={disconnecting}
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect Shopify'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <Text className="text-yellow-800 font-medium">
                  Shopify store not connected
                </Text>
              </div>
              <Text className="text-yellow-700 text-sm mt-1">
                Connect your Shopify store to start syncing products and orders.
              </Text>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="shopifyUrl">Shopify Store URL</Label>
                <Text className="text-sm text-gray-500 mb-2">
                  Enter your Shopify store URL (e.g., mystore.myshopify.com)
                </Text>
                <Input
                  id="shopifyUrl"
                  value={shopifyUrl}
                  onChange={(e) => setShopifyUrl(e.target.value)}
                  placeholder="mystore.myshopify.com"
                />
              </div>

              <div>
                <Label htmlFor="accessToken">Access Token</Label>
                <Text className="text-sm text-gray-500 mb-2">
                  Enter your Shopify private app access token
                </Text>
                <Input
                  id="accessToken"
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Text className="text-blue-800 font-medium mb-2">
                  How to get your Access Token:
                </Text>
                <ol className="text-blue-700 text-sm space-y-1">
                  <li>1. Go to your Shopify admin panel</li>
                  <li>2. Navigate to Apps → Manage private apps</li>
                  <li>3. Create a new private app</li>
                  <li>4. Grant necessary permissions (read_products, read_orders)</li>
                  <li>5. Copy the access token and paste it above</li>
                </ol>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleConnect}
                  disabled={connecting || !shopifyUrl || !accessToken}
                >
                  {connecting ? 'Connecting...' : 'Connect Shopify Store'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <Heading level="h2" className="text-lg font-semibold mb-4">
          Sync Settings
        </Heading>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Text className="font-medium">Auto-sync Products</Text>
              <Text className="text-sm text-gray-500">Automatically sync new products from Shopify</Text>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Text className="font-medium">Auto-sync Orders</Text>
              <Text className="text-sm text-gray-500">Automatically sync new orders from Shopify</Text>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Text className="font-medium">Sync Inventory</Text>
              <Text className="text-sm text-gray-500">Keep inventory levels in sync</Text>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 