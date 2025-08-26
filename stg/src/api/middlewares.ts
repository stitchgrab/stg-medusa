import {
  defineMiddlewares,
  authenticate,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { PostVendorCreateSchema } from "./vendors/route"
import { AdminCreateProduct } from "@medusajs/medusa/api/admin/products/validators"


export default defineMiddlewares({
  routes: [
    {
      matcher: "/vendors",
      method: ["POST"],
      middlewares: [
        authenticate("vendor", ["session", "bearer"], {
          allowUnregistered: true,
        }),
        validateAndTransformBody(PostVendorCreateSchema),
      ],
    },
    {
      matcher: "/vendors/products",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(AdminCreateProduct),
      ],
    },
    {
      matcher: "/vendors/orders/*",
      method: ["GET", "POST", "PUT", "DELETE"],
    },
    {
      matcher: "/vendors/products/*",
      method: ["GET", "POST", "PUT", "DELETE"],
      middlewares: [
        authenticate("vendor", ["session", "bearer"]),
      ],
    },
    {
      matcher: "/vendors/stripe/webhook",
      method: ["POST"],
      bodyParser: {
        preserveRawBody: true,
      },
    },
    {
      matcher: "/drivers/stripe/webhook",
      method: ["POST"],
      bodyParser: {
        preserveRawBody: true,
      },
    },
  ],
})