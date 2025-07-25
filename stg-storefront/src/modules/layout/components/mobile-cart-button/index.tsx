import { retrieveCart } from "@lib/data/cart"
import MobileCartIcon from "../mobile-cart-icon"

export default async function MobileCartButton() {
  const cart = await retrieveCart().catch(() => null)

  return <MobileCartIcon cart={cart} />
} 