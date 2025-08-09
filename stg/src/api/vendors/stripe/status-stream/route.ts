import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { validateVendorSession } from "../../../../utils/vendor-auth"
import { setVendorCorsHeaders, setVendorCorsHeadersOptions } from "../../../../utils/cors"

// Store active SSE connections
const activeConnections = new Map<string, MedusaResponse>()

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Set comprehensive CORS headers for OPTIONS preflight
  res.setHeader('Access-Control-Allow-Origin', process.env.VENDORS_NGROK_URL || 'http://localhost:3001')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Cache-Control, Accept')
  res.setHeader('Access-Control-Max-Age', '86400') // 24 hours

  return res.status(200).end()
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Set CORS headers
  setVendorCorsHeaders(res)

  try {
    // Validate vendor session (will check both cookies and Authorization header)
    const payload = await validateVendorSession(req)
    const vendorId = payload.vendor_id

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': process.env.VENDORS_NGROK_URL || 'http://localhost:3001',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, Cache-Control, Accept',
    })

    // Store connection
    activeConnections.set(vendorId, res)

    // Send initial connection message
    res.write(`data: ${JSON.stringify({
      type: 'connected',
      message: 'Connected to status updates',
      timestamp: new Date().toISOString()
    })}\n\n`)

    // Handle client disconnect
    req.on('close', () => {
      activeConnections.delete(vendorId)
    })

    // Keep connection alive with periodic heartbeat
    const heartbeat = setInterval(() => {
      if (activeConnections.has(vendorId)) {
        res.write(`data: ${JSON.stringify({
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        })}\n\n`)
      } else {
        clearInterval(heartbeat)
      }
    }, 30000) // 30 seconds

  } catch (error) {
    console.error("SSE authentication failed:", error)
    res.status(401).json({ error: "Authentication required" })
  }
}

// Function to send updates to specific vendor
export const sendVendorUpdate = (vendorId: string, data: any) => {
  const connection = activeConnections.get(vendorId)
  if (connection) {
    try {
      const message = {
        type: 'stripe_status_update',
        ...data,
        timestamp: new Date().toISOString()
      }
      connection.write(`data: ${JSON.stringify(message)}\n\n`)
    } catch (error) {
      console.error(`SSE - Error writing to connection for vendor ${vendorId}:`, error)
      activeConnections.delete(vendorId)
    }
  }
}

// Function to send updates to all vendors
export const broadcastUpdate = (data: any) => {
  activeConnections.forEach((connection, vendorId) => {
    connection.write(`data: ${JSON.stringify({
      type: 'broadcast',
      ...data,
      timestamp: new Date().toISOString()
    })}\n\n`)
  })
}
