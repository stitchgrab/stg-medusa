"use client"

import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx, Button } from "@medusajs/ui"
import React, { useState, useEffect } from "react"
import { CreditCard, LockClosedSolid } from "@medusajs/icons"
import Radio from "@modules/common/components/radio"
import { isStripe } from "@lib/constants"
import { loadStripe } from "@stripe/stripe-js"
import { ExpressCheckoutElement, PaymentElement, useCheckout } from "@stripe/react-stripe-js"
import Checkout from "app/[countryCode]/(checkout)/checkout/page"


type StripeCheckoutContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: React.JSX.Element }>
  cart: any
  onPaymentSuccess?: () => void
  onPaymentError?: (error: string) => void
}

const StripeCheckoutContent = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  cart,
  onPaymentSuccess,
  onPaymentError,
}: StripeCheckoutContainerProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "flex flex-col gap-y-4 text-small-regular cursor-pointer py-6 border rounded-lg px-6 mb-4 hover:shadow-lg transition-all duration-200",
        {
          "border-ui-border-interactive bg-ui-bg-interactive/5":
            selectedPaymentOptionId === paymentProviderId,
          "border-ui-border-base hover:border-ui-border-interactive":
            selectedPaymentOptionId !== paymentProviderId,
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Radio checked={selectedPaymentOptionId === paymentProviderId} />
          <div className="flex flex-col">
            <Text className="text-base-regular font-medium">
              {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
            </Text>
            <Text className="text-small-regular text-ui-fg-subtle">
              Secure payment powered by Stripe
            </Text>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="justify-self-end text-ui-fg-base">
            {paymentInfoMap[paymentProviderId]?.icon}
          </span>
          <LockClosedSolid className="w-4 h-4 text-green-600" />
        </div>
      </div>

      {selectedPaymentOptionId === paymentProviderId && (
        <div className="mt-4 p-4 bg-ui-bg-subtle rounded-lg border border-ui-border-base">
          <div className="flex items-center justify-between mb-4">
            <Text className="text-base-regular font-medium text-ui-fg-base">
              Secure Checkout
            </Text>
            <div className="flex items-center gap-x-2">
              <CreditCard className="w-5 h-5 text-ui-fg-subtle" />
              <Text className="text-small-regular text-ui-fg-subtle">
                All major cards accepted
              </Text>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-x-2 text-small-regular text-ui-fg-subtle">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center gap-x-2 text-small-regular text-ui-fg-subtle">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>PCI DSS compliant</span>
            </div>
            <div className="flex items-center gap-x-2 text-small-regular text-ui-fg-subtle">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No card data stored on our servers</span>
            </div>
          </div>

          <EmbeddedCheckoutForm
            sessionId={sessionId!}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
          />
        </div>
      )}
    </RadioGroupOption>
  )
}

const EmbeddedCheckoutForm = ({
  sessionId,
  onPaymentSuccess,
  onPaymentError
}: {
  sessionId: string | null
  onPaymentSuccess?: () => void
  onPaymentError?: (error: string) => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const checkout = useCheckout()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // await stripeCheckout.confirm()

    // if (stripeCheckout.error) {
    //   onPaymentError?.(stripeCheckout.error.message)
    // } else {
    //   onPaymentSuccess?.()
    // }
  }

  const handleConfirm = (event: any) => {
    checkout.confirm({ expressCheckoutConfirmEvent: event })
  }

  return (
    <form onSubmit={handleSubmit}>
      <ExpressCheckoutElement onConfirm={handleConfirm} />
      <Button type="submit" isLoading={isLoading}>Pay</Button>
    </form>
  )
}

export const StripeCheckoutContainer = (props: StripeCheckoutContainerProps) => {
  return <StripeCheckoutContent {...props} />
} 