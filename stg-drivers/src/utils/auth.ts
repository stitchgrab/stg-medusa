export interface DriverSession {
  authenticated: boolean
  driver_admin: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  driver: {
    id: string
    name: string
    handle: string
  }
}

export const checkDriverSession = async (): Promise<DriverSession> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/auth/session`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Session check failed')
  }

  return response.json()
}

export const driverLogin = async (email: string, password: string): Promise<DriverSession> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Login failed')
  }

  return response.json()
}

export const completeDriverSignup = async (token: string, password: string): Promise<DriverSession> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/typeform/complete-signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ token, password }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Signup failed')
  }

  return response.json()
}

export const driverLogout = async (): Promise<void> => {
  await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/drivers/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}
