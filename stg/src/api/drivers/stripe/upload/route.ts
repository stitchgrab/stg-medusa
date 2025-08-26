import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import Stripe from "stripe"
import { setDriverCorsHeaders } from "../../../../utils/cors"
import multer from "multer"
import { promisify } from "util"

// Extend the request type to include file property
interface FileUploadRequest extends MedusaRequest {
  file?: Express.Multer.File
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'))
    }
  }
})

const uploadMiddleware = promisify(upload.single('file'))

export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  setDriverCorsHeaders(res)
  res.status(200).end()
}

export const POST = async (
  req: FileUploadRequest,
  res: MedusaResponse
) => {
  setDriverCorsHeaders(res)

  try {

    // Parse multipart form data
    await uploadMiddleware(req, res)

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "No file provided",
      })
    }

    const file = req.file

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_API_KEY!)

    // Create a file upload to Stripe
    const fileUpload = await stripe.files.create({
      file: {
        data: file.buffer,
        name: file.originalname,
        type: file.mimetype,
      },
      purpose: 'identity_document'
    })

    res.json({
      file_id: fileUpload.id,
      file_url: fileUpload.url,
      filename: file.originalname,
    })
  } catch (error) {
    console.error("File upload error:", error)

    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({
        message: error.message,
        code: error.code,
        param: error.param,
      })
    }

    res.status(500).json({
      message: "Failed to upload file",
      error: error.message,
    })
  }
}
