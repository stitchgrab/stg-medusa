import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import '@stripe/stripe-js'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RegionProvider } from "providers/region"
import { CartProvider } from "providers/cart"
import { LocationProvider } from "providers/location"
import  AuthSessionProvider from "providers/session-provider";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <AuthSessionProvider>
          <LocationProvider>
            <RegionProvider>
              <CartProvider>
                <main className="relative">{props.children}</main>
              </CartProvider>
            </RegionProvider>
          </LocationProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
