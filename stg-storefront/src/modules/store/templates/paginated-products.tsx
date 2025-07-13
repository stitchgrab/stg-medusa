import { Pagination } from "@modules/store/components/pagination"
import { HttpTypes } from "@medusajs/types"
import ProductGridClient from "./product-grid-client"

const PRODUCT_LIMIT = 12

export default function PaginatedProducts({
  page,
  products,
  region,
}: {
  page: number
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}) {
  // Ensure products is always an array
  const safeProducts = products || []
  const totalPages = Math.ceil(safeProducts.length / PRODUCT_LIMIT)

  return (
    <>
      <ProductGridClient
        page={page}
        products={safeProducts}
        region={region}
      />
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
