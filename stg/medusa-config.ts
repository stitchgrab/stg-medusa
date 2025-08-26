import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'
import { MARKETPLACE_MODULE } from './src/modules/marketplace'
import { TYPEFORM_MODULE } from './src/modules/typeform'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            }
          }
        ]
      }
    },
    {
      resolve: "./src/modules/marketplace",
    },
    {
      resolve: "./src/modules/typeform",
    }
  ],
})
