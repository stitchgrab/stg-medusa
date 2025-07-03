"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"

interface ShippingDebugProps {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

const ShippingDebug = ({ cart, availableShippingMethods }: ShippingDebugProps) => {
  const [debugInfo, setDebugInfo] = useState<any>({})

  return (
    <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded text-sm">
      <h3 className="font-bold mb-2">🚨 SHIPPING DEBUG:</h3>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}

export default ShippingDebug 