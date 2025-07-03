"use client"

import { CheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createContext, useContext, ReactNode } from "react"

type StripeProviderContextType = {
  stripePromise: Promise<any> | null
  fetchClientSecret: () => Promise<string>
}

const StripeContext = createContext<StripeProviderContextType | null>(null)

export const useStripeProvider = () => {
  const context = useContext(StripeContext)
  if (!context) {
    throw new Error("useStripeProvider must be used within a StripeProvider")
  }
  return context
}

type StripeProviderProps = {
  children: ReactNode,
  cartId: string
}

export const StripeProvider = ({ children, cartId }: StripeProviderProps) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

  const fetchClientSecret = async () => {
    const response = await fetch(`/api/create-checkout-session`, {
      method: "POST",
      body: JSON.stringify({
        cartId: cartId,
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${process.env.NEXT_PUBLIC_DEFAULT_REGION}/checkout/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${process.env.NEXT_PUBLIC_DEFAULT_REGION}/checkout`,
      }),
    })
    const data = await response.json()
    return data.clientSecret
  }

  return (
    <StripeContext.Provider value={{ stripePromise, fetchClientSecret }}>
      <CheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        {children}
      </CheckoutProvider>
    </StripeContext.Provider>
  )
} 