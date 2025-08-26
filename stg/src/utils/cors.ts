import { MedusaResponse } from "@medusajs/framework/http"

export function setVendorCorsHeaders(res: MedusaResponse) {
  const isDev = process.env.NODE_ENV === "development"
  const useNgrok = process.env.USE_NGROK === "true"

  // Use ngrok URL in dev, localhost in local dev
  const allowedOrigin = isDev && useNgrok ? process.env.VENDORS_NGROK_URL! : isDev ? "http://localhost:3001" : process.env.VENDORS_PROD_URL!
  console.log("Allowed origin:", allowedOrigin)

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")
}

export function setVendorCorsHeadersOptions(res: MedusaResponse) {
  const isDev = process.env.NODE_ENV === "development"
  const useNgrok = process.env.USE_NGROK === "true"

  // Use ngrok url if in dev and ngrok is enabled, otherwise use localhost or prod url
  const allowedOrigin = isDev && useNgrok ? process.env.VENDORS_NGROK_URL! : isDev ? "http://localhost:3001" : process.env.VENDORS_PROD_URL!
  console.log("Allowed origin:", allowedOrigin)

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")
  return res.status(200).end()
}

export function setDriverCorsHeaders(res: MedusaResponse) {
  const isDev = process.env.NODE_ENV === "development"
  const useNgrok = process.env.USE_NGROK === "true"

  // Use ngrok URL in dev, localhost in local dev
  const allowedOrigin = isDev && useNgrok ? process.env.DRIVERS_NGROK_URL! : isDev ? "http://localhost:3002" : process.env.DRIVERS_PROD_URL!
  console.log("Driver allowed origin:", allowedOrigin)

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")
}

export function setDriverCorsHeadersOptions(res: MedusaResponse) {
  const isDev = process.env.NODE_ENV === "development"
  const useNgrok = process.env.USE_NGROK === "true"

  // Use ngrok url if in dev and ngrok is enabled, otherwise use localhost or prod url
  const allowedOrigin = isDev && useNgrok ? process.env.DRIVERS_NGROK_URL! : isDev ? "http://localhost:3002" : process.env.DRIVERS_PROD_URL!
  console.log("Driver allowed origin:", allowedOrigin)

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")
  return res.status(200).end()
} 