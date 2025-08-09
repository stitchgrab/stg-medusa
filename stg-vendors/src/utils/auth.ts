import { getFromBackend, postToBackend } from './fetch'

// Token management utilities
const TOKEN_KEY = 'vendor_token'

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export const clearStoredToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

export interface VendorSession {
  authenticated: boolean
  vendor_admin?: {
    id: string
    email: string
    first_name: string
    last_name: string
    phone?: string
    created_at?: string
    updated_at?: string
  }
  vendor?: {
    id: string
    name: string
    handle: string
    logo?: string
    businessHours?: any
    specialHours?: any
    address?: any
    social_links?: any
    phone?: string
  }
}

export const checkVendorSession = async (): Promise<VendorSession> => {
  try {
    // Use Authorization header instead of cookies
    const session = await getFromBackend('/vendors/auth/session')
    return session
  } catch (error) {
    console.log('No active vendor session')
    // Clear invalid token
    clearStoredToken()
    return { authenticated: false }
  }
}

export const vendorLogin = async (email: string, password: string): Promise<VendorSession> => {
  try {
    const response = await postToBackend('/vendors/auth/login', { email, password })

    // Store the token from the response
    if (response.token) {
      setStoredToken(response.token)
    }

    return {
      authenticated: true,
      vendor_admin: response.vendor_admin,
      vendor: response.vendor
    }
  } catch (error) {
    throw error
  }
}

export const vendorSignup = async (formData: {
  email: string
  password: string
  first_name: string
  last_name: string
  vendor_name: string
  vendor_handle: string
  phone?: string
}): Promise<VendorSession> => {
  try {
    const response = await postToBackend('/vendors/auth/signup', formData)

    // Store the token from the response
    if (response.token) {
      setStoredToken(response.token)
    }

    return {
      authenticated: true,
      vendor_admin: response.vendor_admin,
      vendor: response.vendor
    }
  } catch (error) {
    throw error
  }
}

export const vendorLogout = async (): Promise<void> => {
  try {
    await postToBackend('/vendors/auth/logout', {})
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Always clear the token on logout
    clearStoredToken()
  }
} 