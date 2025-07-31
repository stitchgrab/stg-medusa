'use client'

import { useState } from 'react'
import { Button, Text, Heading, Input, Label, Badge } from '@medusajs/ui'
import { Receipt, Buildings } from '@medusajs/icons'

interface TaxInformation {
  businessName: string
  taxId: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  taxRates: {
    state: string
    rate: number
  }[]
}

export default function TaxSettingsPage() {
  const [taxInfo, setTaxInfo] = useState<TaxInformation>({
    businessName: '',
    taxId: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
    taxRates: [
      { state: 'California', rate: 7.25 },
      { state: 'New York', rate: 8.875 },
    ],
  })
  const [saving, setSaving] = useState(false)

  const handleAddressChange = (field: keyof typeof taxInfo.address, value: string) => {
    setTaxInfo({
      ...taxInfo,
      address: {
        ...taxInfo.address,
        [field]: value,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // TODO: Implement tax information update API call
      console.log('Updating tax information:', taxInfo)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Show success message
      alert('Tax information updated successfully!')
    } catch (error) {
      console.error('Failed to update tax information:', error)
      alert('Failed to update tax information. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Heading level="h1" className="text-2xl font-semibold mb-2">
          Tax Information
        </Heading>
        <Text className="text-gray-600">
          Configure your tax settings and business information for compliance.
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Buildings className="h-5 w-5 text-gray-600 mr-2" />
            <Heading level="h2" className="text-lg font-semibold">
              Business Information
            </Heading>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Legal Business Name</Label>
              <Input
                id="businessName"
                value={taxInfo.businessName}
                onChange={(e) => setTaxInfo({ ...taxInfo, businessName: e.target.value })}
                placeholder="Enter your legal business name"
              />
            </div>

            <div>
              <Label htmlFor="taxId">Tax ID / EIN</Label>
              <Input
                id="taxId"
                value={taxInfo.taxId}
                onChange={(e) => setTaxInfo({ ...taxInfo, taxId: e.target.value })}
                placeholder="Enter your Tax ID or EIN"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Receipt className="h-5 w-5 text-gray-600 mr-2" />
            <Heading level="h2" className="text-lg font-semibold">
              Business Address
            </Heading>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={taxInfo.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="Enter your street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={taxInfo.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={taxInfo.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  placeholder="State"
                />
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={taxInfo.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  placeholder="ZIP Code"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                value={taxInfo.address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Heading level="h2" className="text-lg font-semibold mb-4">
            Tax Rates
          </Heading>

          <Text className="text-gray-600 mb-4">
            Configure tax rates for different states or regions where you operate.
          </Text>

          <div className="space-y-4">
            {taxInfo.taxRates.map((rate, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <Label>State</Label>
                    <Input
                      value={rate.state}
                      onChange={(e) => {
                        const newRates = [...taxInfo.taxRates]
                        newRates[index].state = e.target.value
                        setTaxInfo({ ...taxInfo, taxRates: newRates })
                      }}
                      className="w-32"
                    />
                  </div>
                  <div>
                    <Label>Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={rate.rate}
                      onChange={(e) => {
                        const newRates = [...taxInfo.taxRates]
                        newRates[index].rate = parseFloat(e.target.value) || 0
                        setTaxInfo({ ...taxInfo, taxRates: newRates })
                      }}
                      className="w-24"
                    />
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => {
                    const newRates = taxInfo.taxRates.filter((_, i) => i !== index)
                    setTaxInfo({ ...taxInfo, taxRates: newRates })
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button
              variant="secondary"
              onClick={() => {
                setTaxInfo({
                  ...taxInfo,
                  taxRates: [...taxInfo.taxRates, { state: '', rate: 0 }],
                })
              }}
            >
              Add Tax Rate
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Receipt className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <Text className="text-yellow-800 font-medium">
                Tax Compliance Notice
              </Text>
              <Text className="text-yellow-700 text-sm mt-1">
                Please ensure your tax information is accurate and up-to-date.
                You are responsible for complying with all applicable tax laws
                in your jurisdiction.
              </Text>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Tax Information'}
          </Button>
        </div>
      </form>
    </div>
  )
} 