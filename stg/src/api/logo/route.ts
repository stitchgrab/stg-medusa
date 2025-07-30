import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { readFileSync } from "fs"
import { join } from "path"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const logoPath = join(process.cwd(), "public", "stitchgrab-logo.png")
    const logoBuffer = readFileSync(logoPath)

    res.setHeader("Content-Type", "image/png")
    res.setHeader("Cache-Control", "public, max-age=31536000") // Cache for 1 year
    res.status(200).send(logoBuffer)
  } catch (error) {
    console.error("Error serving logo:", error)
    res.status(404).send("Logo not found")
  }
} 