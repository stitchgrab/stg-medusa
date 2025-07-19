import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import '@stripe/stripe-js'
import { RegionProvider } from "providers/region"
import { CartProvider } from "providers/cart"
import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body>
        <RegionProvider>
          <CartProvider>
            <main className="relative">{props.children}</main>
          </CartProvider>
        </RegionProvider>
      </body>
    </html>
  )
}
