"use client"

import { useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

const PRODUCT_LIMIT = 12

type ProductGridClientProps = {
  page: number
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

export default function ProductGridClient({ page, products, region }: ProductGridClientProps) {
  const searchParams = useSearchParams()

  // Ensure products is always an array
  const safeProducts = products || []

  // Client-side pagination
  const startIdx = (page - 1) * PRODUCT_LIMIT
  const endIdx = startIdx + PRODUCT_LIMIT
  const paginatedProducts = safeProducts.slice(startIdx, endIdx)

  return (
    <ul
      className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
      data-testid="products-list"
    >
      {paginatedProducts.map((p) => {
        return (
          <li key={p.id}>
            <ProductPreview product={p} region={region} />
          </li>
        )
      })}
    </ul>
  )
} 