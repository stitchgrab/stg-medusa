import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import '@stripe/stripe-js'
import { RegionProvider } from "providers/region"
import { CartProvider } from "providers/cart"
import { LocationProvider } from "providers/location"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <LocationProvider>
          <RegionProvider>
            <CartProvider>
              <main className="relative">{props.children}</main>
            </CartProvider>
          </RegionProvider>
        </LocationProvider>
      </body>
    </html>
  )
}
