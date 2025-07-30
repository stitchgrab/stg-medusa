import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const corsMiddleware = (req: MedusaRequest, res: MedusaResponse, next: () => void) => {
  // Set CORS headers for all vendor routes
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  next()
} 