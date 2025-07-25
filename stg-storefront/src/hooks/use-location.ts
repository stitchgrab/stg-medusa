"use client"

import { useState, useEffect } from "react"
import { isZipcodeInLaunchArea } from "@lib/constants/zipcodes"

interface LocationData {
  zipcode: string | null
  city: string | null
  state: string | null
  address: string | null
  coordinates: { lat: number; lng: number } | null
  loading: boolean
  error: string | null
  isInLaunchArea: boolean | null
}

interface ManualAddress {
  address: string
  city: string
  state: string
  zipcode: string
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData>({
    zipcode: null,
    city: null,
    state: null,
    address: null,
    coordinates: null,
    loading: false,
    error: null,
    isInLaunchArea: null,
  })

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation')
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation)
        setLocation(prev => ({
          ...prev,
          ...parsed,
          isInLaunchArea: parsed.zipcode ? isZipcodeInLaunchArea(parsed.zipcode) : null
        }))
      } catch (error) {
        console.error('Error parsing saved location:', error)
        localStorage.removeItem('userLocation')
      }
    }
  }, [])

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (location.zipcode || location.city) {
      const locationToSave = {
        zipcode: location.zipcode,
        city: location.city,
        state: location.state,
        address: location.address,
        coordinates: location.coordinates,
      }
      localStorage.setItem('userLocation', JSON.stringify(locationToSave))
    }
  }, [location.zipcode, location.city, location.state, location.address, location.coordinates])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: "Geolocation is not supported by this browser.",
      }))
      return
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Use a geocoding service
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          
          if (!response.ok) {
            throw new Error("Failed to fetch location data")
          }
          
          const data = await response.json()
          const zipcode = data.postcode || null
          const city = data.city || data.locality || null
          const state = data.principalSubdivision || null
          const fullAddress = data.formattedAddress || `${city}, ${state} ${zipcode}`
          
          setLocation({
            zipcode,
            city,
            state,
            address: fullAddress,
            coordinates: { lat: latitude, lng: longitude },
            loading: false,
            error: null,
            isInLaunchArea: zipcode ? isZipcodeInLaunchArea(zipcode) : null,
          })
        } catch (error) {
          console.error("Error fetching location:", error)
          setLocation(prev => ({
            ...prev,
            loading: false,
            error: "Failed to fetch location details",
          }))
        }
      },
      (error) => {
        let errorMessage = "Failed to get location"
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }
        
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
      }
    )
  }

  const setManualAddress = async (addressData: ManualAddress) => {
    setLocation(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Geocode the manual address to get coordinates
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          `${addressData.address}, ${addressData.city}, ${addressData.state} ${addressData.zipcode}`
        )}&countrycodes=us&limit=1`
      )

      if (!geocodeResponse.ok) {
        throw new Error("Failed to geocode address")
      }

      const geocodeData = await geocodeResponse.json()
      let coordinates = null

      if (geocodeData.length > 0) {
        coordinates = {
          lat: parseFloat(geocodeData[0].lat),
          lng: parseFloat(geocodeData[0].lon)
        }
      }

      const fullAddress = `${addressData.address}, ${addressData.city}, ${addressData.state} ${addressData.zipcode}`

      setLocation({
        zipcode: addressData.zipcode,
        city: addressData.city,
        state: addressData.state,
        address: fullAddress,
        coordinates,
        loading: false,
        error: null,
        isInLaunchArea: isZipcodeInLaunchArea(addressData.zipcode),
      })
    } catch (error) {
      console.error("Error setting manual address:", error)
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: "Failed to process address",
      }))
    }
  }

  const clearLocation = () => {
    setLocation({
      zipcode: null,
      city: null,
      state: null,
      address: null,
      coordinates: null,
      loading: false,
      error: null,
      isInLaunchArea: null,
    })
    localStorage.removeItem('userLocation')
  }

  const updateLocation = (newLocation: Partial<LocationData>) => {
    setLocation(prev => ({
      ...prev,
      ...newLocation,
      isInLaunchArea: newLocation.zipcode ? isZipcodeInLaunchArea(newLocation.zipcode) : prev.isInLaunchArea
    }))
  }

  return {
    ...location,
    requestLocation,
    setManualAddress,
    clearLocation,
    updateLocation,
    hasLocation: !!(location.zipcode || location.city),
    needsLocation: !location.zipcode && !location.city,
  }
} 