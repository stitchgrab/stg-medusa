import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

export interface VendorJwtPayload {
  vendor_admin_id: string
  vendor_id: string
  email: string
  type: 'vendor'
  iat?: number
  exp?: number
}

export interface DriverJwtPayload {
  driver_admin_id: string
  driver_id: string
  email: string
  type: 'driver'
  iat?: number
  exp?: number
}

export const signVendorToken = (payload: Omit<VendorJwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h', // 24 hours
    issuer: 'medusa-vendor-auth',
    audience: 'vendor-dashboard',
  })
}

export const signDriverToken = (payload: Omit<DriverJwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h', // 24 hours
    issuer: 'medusa-driver-auth',
    audience: 'driver-dashboard',
  })
}

export const verifyVendorToken = (token: string): VendorJwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'medusa-vendor-auth',
      audience: 'vendor-dashboard',
    }) as VendorJwtPayload

    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export const verifyDriverToken = (token: string): DriverJwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'medusa-driver-auth',
      audience: 'driver-dashboard',
    }) as DriverJwtPayload

    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export const extractVendorToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null
  }

  return authorizationHeader.substring(7) // Remove 'Bearer ' prefix
}

export const extractDriverToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null
  }

  return authorizationHeader.substring(7) // Remove 'Bearer ' prefix
} 