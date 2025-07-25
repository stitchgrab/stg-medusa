"use client"

import { useState, useEffect } from "react"
import MapPin from "@modules/common/icons/map-pin"
import { useLocation } from "@hooks/use-location"
import LocationModal from "@modules/layout/components/location-modal"

const LocationToggle = () => {
  const [showAlert, setShowAlert] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const { zipcode, city, state, loading, error, requestLocation, hasLocation, needsLocation } = useLocation()

  // Show location modal automatically if user doesn't have location set
  useEffect(() => {
    if (needsLocation && !loading) {
      setShowLocationModal(true)
    }
  }, [needsLocation, loading])

  // Show alert when user clicks location without permission
  const handleLocationClick = () => {
    if (!hasLocation && !loading) {
      setShowLocationModal(true)
    } else {
      // Open location modal for changing location
      setShowLocationModal(true)
    }
  }

  // Display text based on location data
  const getLocationText = () => {
    if (loading) return "Getting location..."
    if (error) return "Enable location"
    if (zipcode) return zipcode
    if (city && state) return `${city}, ${state}`
    if (city) return city
    return "Enable location"
  }

  const handleLocationSet = (locationData: any) => {
    // Location has been set, modal will close automatically
    console.log('Location set:', locationData)
  }

  return (
    <>
      {/* Desktop Location */}
      <div className="hidden lg:flex items-center relative">
        <button
          onClick={handleLocationClick}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition-colors"
          disabled={loading}
        >
          <MapPin size="16" className={loading ? "animate-pulse" : ""} />
          <span>{getLocationText()}</span>
        </button>
        
        {/* Location Permission Alert */}
        {showAlert && (
          <div className="absolute top-full left-0 mt-2 bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
            <div className="absolute -top-1 left-4 w-2 h-2 bg-red-500 transform rotate-45"></div>
            Please enable location access to see your area
          </div>
        )}
      </div>

      {/* Mobile Location */}
      <button 
        onClick={handleLocationClick}
        className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
        aria-label="Location"
        disabled={loading}
      >
        <MapPin size="18" className={`sm:w-5 sm:h-5 text-gray-600 ${loading ? "animate-pulse" : ""}`} />
        
        {/* Mobile Location Permission Alert */}
        {showAlert && (
          <div className="absolute top-full right-0 mt-2 bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
            <div className="absolute -top-1 right-4 w-2 h-2 bg-red-500 transform rotate-45"></div>
            Enable location access
          </div>
        )}
      </button>

      {/* Enhanced Location Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSet={handleLocationSet}
      />
    </>
  )
}

export default LocationToggle 