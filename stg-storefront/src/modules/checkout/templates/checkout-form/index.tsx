import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import ShippingDebug from "@modules/checkout/components/shipping-debug"


export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {

  if (!cart) {
    console.log("❌ No cart found")
    return null
  }

  console.log("🛒 Cart found:", cart.id)

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  console.log("💳 Payment methods:", paymentMethods?.length || 0)
  console.log("💳 Payment methods:", paymentMethods)


  if (!shippingMethods || !paymentMethods) {
    console.log("❌ Missing shipping or payment methods")
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <ShippingDebug cart={cart} availableShippingMethods={shippingMethods} />

      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} />

      <Payment cart={cart} availablePaymentMethods={paymentMethods} />

      <Review cart={cart} />
    </div>
  )
}
