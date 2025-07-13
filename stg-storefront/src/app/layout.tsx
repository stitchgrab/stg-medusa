import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import '@stripe/stripe-js'
import { RegionProvider } from "providers/region"
import { CartProvider } from "providers/cart"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
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
