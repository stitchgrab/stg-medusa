// Server-Sent Events utility for real-time vendor updates
import { getStoredToken } from './auth'

export type SSEMessage = {
  type: 'connected' | 'heartbeat' | 'stripe_status_update' | 'broadcast'
  message?: string
  stripeStatus?: string
  stripeAccountId?: string
  eventType?: string
  timestamp: string
}

export type SSEEventHandler = (message: SSEMessage) => void

class VendorSSEClient {
  private eventSource: EventSource | null = null
  private handlers: Map<string, SSEEventHandler[]> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(): void {
    if (this.eventSource) {
      return
    }

    const token = getStoredToken()
    if (!token) {
      console.error('SSE - No token available, cannot connect')
      return
    }

    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
    if (!baseUrl) {
      console.error('SSE - Backend URL not configured')
      return
    }

    const url = `${baseUrl}/vendors/stripe/status-stream`

    // Use fetch with Authorization header instead of EventSource
    this.connectWithFetch(url, token)
  }

  private async connectWithFetch(url: string, token: string): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('SSE - HTTP Error:', response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      if (!response.body) {
        throw new Error('Response body is null')
      }

      this.reconnectAttempts = 0
      this.emit('connected', { type: 'connected', message: 'Connected to real-time updates.', timestamp: new Date().toISOString() })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6) // Remove 'data: ' prefix
            if (data.trim()) {
              try {
                const parsed: SSEMessage = JSON.parse(data)
                this.emit(parsed.type, parsed)
              } catch (error) {
                console.error('SSE - Failed to parse message:', error, 'Raw data:', data)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('SSE - Connection error:', error)

      // Attempt to reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++
        setTimeout(() => this.connect(), this.reconnectDelay)
        this.reconnectDelay *= 2 // Exponential backoff
      } else {
        console.error('SSE - Max reconnection attempts reached')
        this.emit('error', { type: 'broadcast', message: 'Connection lost', timestamp: new Date().toISOString() })
      }
    }
  }

  disconnect(): void {
    // Note: We can't really disconnect from fetch streams easily,
    // but we can stop reconnection attempts
    this.reconnectAttempts = this.maxReconnectAttempts
  }

  on(eventType: string, handler: SSEEventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }
    this.handlers.get(eventType)!.push(handler)
  }

  off(eventType: string, handler: SSEEventHandler): void {
    const handlers = this.handlers.get(eventType)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private emit(eventType: string, data: SSEMessage): void {
    const handlers = this.handlers.get(eventType)
    if (handlers) {
      handlers.forEach(handler => handler(data))
    }
  }
}

// Singleton instance
export const vendorSSE = new VendorSSEClient()

// Helper hooks for React components
export const useVendorSSE = () => {
  return {
    connect: () => vendorSSE.connect(),
    disconnect: () => vendorSSE.disconnect(),
    on: (eventType: string, handler: SSEEventHandler) => vendorSSE.on(eventType, handler),
    off: (eventType: string, handler: SSEEventHandler) => vendorSSE.off(eventType, handler),
  }
}
