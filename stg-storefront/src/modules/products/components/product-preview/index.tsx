"use client"

import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { useSearchParams } from "next/navigation"

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const searchParams = useSearchParams()

  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Build URL with current query params
  const buildProductUrl = () => {
    const baseUrl = `/products/${product.handle}`
    const params = new URLSearchParams()

    // Preserve filter parameters (opt_* and price filters)
    searchParams.forEach((value, key) => {
      if (key.startsWith('opt_') || key === 'minPrice' || key === 'maxPrice') {
        params.append(key, value)
      }
    })

    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }

  return (
    <LocalizedClientLink href={buildProductUrl()} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
