"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button, Heading, Text } from "@medusajs/ui"
import { MapPin } from "@medusajs/icons"
import Modal from "@modules/common/components/modal"
import { useLocation } from "@hooks/use-location"
import { isZipcodeInLaunchArea } from "@lib/constants/zipcodes"

// Custom icons for navigation and search (using simple SVGs)
const NavigationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSet?: (location: any) => void
}

interface AddressSuggestion {
  display_name: string
  address: {
    house_number?: string
    road?: string
    city?: string
    state?: string
    postcode?: string
  }
  lat: string
  lon: string
}

const LocationModal = ({ isOpen, onClose, onLocationSet }: LocationModalProps) => {
  const [step, setStep] = useState<'choice' | 'manual' | 'confirm'>('choice')
  const [addressInput, setAddressInput] = useState('')
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [confirmedAddress, setConfirmedAddress] = useState<any>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const router = useRouter()
  
  const { 
    requestLocation, 
    setManualAddress, 
    loading, 
    error, 
    clearLocation,
    zipcode,
    city,
    state,
    address,
    isInLaunchArea
  } = useLocation()

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setStep('choice')
      setAddressInput('')
      setSuggestions([])
      setSelectedAddress(null)
      setConfirmedAddress(null)
    }
  }, [isOpen])

  // Handle location received from geolocation
  useEffect(() => {
    if (zipcode && step === 'choice') {
      const locationData = { zipcode, city, state, address, isInLaunchArea }
      if (isInLaunchArea) {
        onLocationSet?.(locationData)
        onClose()
      } else {
        // Redirect to coming soon page
        router.push('/coming-soon')
      }
    }
  }, [zipcode, isInLaunchArea, step, onLocationSet, onClose, router, city, state, address])

  // Debounced address search
  useEffect(() => {
    if (addressInput.length > 2 && step === 'manual') {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      
      debounceRef.current = setTimeout(() => {
        searchAddresses(addressInput)
      }, 300)
    } else {
      setSuggestions([])
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [addressInput, step])

  const searchAddresses = async (query: string) => {
    setLoadingSuggestions(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&addressdetails=1&limit=5`
      )
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error('Error searching addresses:', error)
      setSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleUseCurrentLocation = () => {
    requestLocation()
  }

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    setSelectedAddress(suggestion)
    setAddressInput(suggestion.display_name)
    setSuggestions([])
    
    // Extract address components
    const addressParts = {
      address: `${suggestion.address.house_number || ''} ${suggestion.address.road || ''}`.trim(),
      city: suggestion.address.city || '',
      state: suggestion.address.state || '',
      zipcode: suggestion.address.postcode || ''
    }
    
    setConfirmedAddress(addressParts)
    setStep('confirm')
  }

  const handleConfirmAddress = async () => {
    if (!confirmedAddress || !confirmedAddress.zipcode) {
      return
    }

    // Check if zipcode is in launch area
    const inLaunchArea = isZipcodeInLaunchArea(confirmedAddress.zipcode)
    
    if (inLaunchArea) {
      // Set the manual address
      await setManualAddress(confirmedAddress)
      onLocationSet?.(confirmedAddress)
      onClose()
    } else {
      // Redirect to coming soon page
      router.push('/coming-soon')
    }
  }

  const handleEditAddress = () => {
    setStep('manual')
    setConfirmedAddress(null)
  }

  const renderChoiceStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-orange-600" />
        </div>
        <Heading level="h2" className="text-xl font-semibold mb-2">
          Enable Location for Better Shopping
        </Heading>
        <Text className="text-gray-600 text-sm">
          We need your location to show you products from nearby vendors and calculate delivery times.
        </Text>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleUseCurrentLocation}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3"
        >
          <NavigationIcon className="w-4 h-4" />
          {loading ? 'Getting Location...' : 'Use Current Location'}
        </Button>

        <Button
          onClick={() => setStep('manual')}
          variant="secondary"
          className="w-full py-3"
        >
          Enter Address Manually
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )

  const renderManualStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button 
          onClick={() => setStep('choice')}
          className="text-gray-400 hover:text-gray-600"
        >
          ←
        </button>
        <Heading level="h2" className="text-xl font-semibold">
          Enter Your Address
        </Heading>
      </div>

      <div className="relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Enter street address, city, state, zip..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            autoFocus
          />
        </div>

        {/* Address Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleAddressSelect(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-sm">{suggestion.display_name}</div>
              </button>
            ))}
          </div>
        )}

        {loadingSuggestions && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-4 z-50">
            <div className="text-center text-gray-500 text-sm">Searching addresses...</div>
          </div>
        )}
      </div>

      <Text className="text-gray-500 text-xs">
        Start typing your address to see suggestions
      </Text>
    </div>
  )

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <button 
          onClick={handleEditAddress}
          className="text-gray-400 hover:text-gray-600"
        >
          ←
        </button>
        <Heading level="h2" className="text-xl font-semibold">
          Confirm Your Address
        </Heading>
      </div>

      {confirmedAddress && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-sm">
                {confirmedAddress.address}
              </div>
              <div className="text-gray-600 text-sm">
                {confirmedAddress.city}, {confirmedAddress.state} {confirmedAddress.zipcode}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleEditAddress}
          variant="secondary"
          className="flex-1"
        >
          Edit Address
        </Button>
        <Button
          onClick={handleConfirmAddress}
          disabled={loading}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
        >
          {loading ? 'Confirming...' : 'Confirm Address'}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )

  return (
    <Modal isOpen={isOpen} close={onClose} size="small">
      <Modal.Body>
        {step === 'choice' && renderChoiceStep()}
        {step === 'manual' && renderManualStep()}
        {step === 'confirm' && renderConfirmStep()}
      </Modal.Body>
    </Modal>
  )
}

export default LocationModal 