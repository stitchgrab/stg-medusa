import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"
import { HttpTypes } from "@medusajs/types"

const StoreTemplate = ({
  sortBy,
  page,
  products,
  region,
}: {
  sortBy?: SortOptions
  page?: string
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container gap-12"
      data-testid="category-container"
    >
      <RefinementList products={products} />
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">All products</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            page={pageNumber}
            region={region}
            products={products}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
