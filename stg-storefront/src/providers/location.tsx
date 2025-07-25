"use client"

import React, { createContext, useContext, ReactNode } from "react"
import { useLocation } from "@hooks/use-location"

interface LocationContextType {
  zipcode: string | null
  city: string | null
  state: string | null
  address: string | null
  coordinates: { lat: number; lng: number } | null
  loading: boolean
  error: string | null
  isInLaunchArea: boolean | null
  hasLocation: boolean
  needsLocation: boolean
  requestLocation: () => void
  setManualAddress: (address: any) => Promise<void>
  clearLocation: () => void
  updateLocation: (location: any) => void
}

const LocationContext = createContext<LocationContextType | null>(null)

export const useLocationContext = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error("useLocationContext must be used within a LocationProvider")
  }
  return context
}

interface LocationProviderProps {
  children: ReactNode
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const locationHook = useLocation()

  return (
    <LocationContext.Provider value={locationHook}>
      {children}
    </LocationContext.Provider>
  )
} 