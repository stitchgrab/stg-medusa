const BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

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

  const fetchOptions: RequestInit = {
    ...options,
    credentials: options.withCredentials ? "include" : options.credentials,
    headers: {
      "Content-Type": "application/json",
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
  return fetchFromBackend<T>(path, { ...options, method: "GET" })
}

export async function postToBackend<T = any>(
  path: string,
  data: any,
  options: FetchOptions = {}
): Promise<T> {
  const url = getBackendUrl(path)
  console.log('🔍 Frontend - POST to:', url)
  console.log('🔍 Frontend - POST data:', data)

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
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
  console.log('🔍 Frontend - PUT to:', url)
  console.log('🔍 Frontend - PUT data:', data)

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
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
