const BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

// Import token function (avoiding circular dependency)
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('vendor_token')
}

type FetchOptions = RequestInit & {
  headers?: Record<string, string>
  withCredentials?: boolean
}

function getBackendUrl(path: string) {

  if (!BASE_URL) {
    console.error('❌ NEXT_PUBLIC_MEDUSA_BACKEND_URL is not set in environment variables')
    console.log('📋 Available env vars:', Object.keys(process.env))
    throw new Error("NEXT_PUBLIC_MEDUSA_BACKEND_URL is not set in environment variables")
  }

  // Remove trailing slash from BASE_URL and leading slash from path
  return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

export async function fetchFromBackend<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = getBackendUrl(path)

  // Get auth token and add to headers if available
  const token = getAuthToken()
  const authHeaders = { Authorization: `Bearer ${token}` }

  const fetchOptions: RequestInit = {
    ...options,
    credentials: options.withCredentials ? "include" : options.credentials,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(options.headers || {}),
    },
  }

  const res = await fetch(url, fetchOptions)
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(
      `Request failed: ${res.status} ${res.statusText} - ${errorBody}`
    )
  }
  // Try to parse as JSON, fallback to text
  const contentType = res.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return res.json()
  }
  // @ts-ignore
  return res.text()
}

export async function getFromBackend<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { withCredentials, ...rest } = options
  return fetchFromBackend<T>(path, { method: "GET", ...rest, credentials: withCredentials ? "include" : "omit" })
}

export async function postToBackend<T = any>(
  path: string,
  data: any,
  options: FetchOptions = {}
): Promise<T> {
  const url = getBackendUrl(path)

  // Get auth token and add to headers if available
  const token = getAuthToken()
  const authHeaders = { Authorization: `Bearer ${token}` }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    body: JSON.stringify(data),
    credentials: options.withCredentials ? 'include' : 'omit',
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ Frontend - POST failed:', response.status, errorText)
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }

  const result = await response.json()
  console.log('✅ Frontend - POST success:', result)
  return result
}

export async function putToBackend<T = any>(
  path: string,
  data: any,
  options: FetchOptions = {}
): Promise<T> {
  const url = getBackendUrl(path)

  // Get auth token and add to headers if available
  const token = getAuthToken()
  const authHeaders = { Authorization: `Bearer ${token}` }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    body: JSON.stringify(data),
    credentials: options.withCredentials ? 'include' : 'omit',
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ Frontend - PUT failed:', response.status, errorText)
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }

  const result = await response.json()
  console.log('✅ Frontend - PUT success:', result)
  return result
}

export async function deleteFromBackend<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  return fetchFromBackend<T>(path, { ...options, method: "DELETE" })
}
