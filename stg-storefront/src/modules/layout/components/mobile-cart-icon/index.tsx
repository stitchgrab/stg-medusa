"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Cart from "@modules/common/icons/cart"

interface MobileCartIconProps {
  cart?: HttpTypes.StoreCart | null
}

const MobileCartIcon = ({ cart }: MobileCartIconProps) => {
  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <LocalizedClientLink
      href="/cart"
      className="lg:hidden relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
      data-testid="nav-cart-link"
    >
      <Cart size="18" className="sm:w-5 sm:h-5 text-gray-600" />
      {totalItems > 0 && (
        <span 
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </LocalizedClientLink>
  )
}

export default MobileCartIcon 