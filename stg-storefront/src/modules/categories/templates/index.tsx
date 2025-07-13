import React, { Suspense } from "react"
import { notFound } from "next/navigation"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  searchParams,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  // Fetch all categories for the refinement list
  const allCategories = await listCategories()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  // Check if this is a main category (no parent)
  const isMainCategory = !category.parent_category
  const hasSubcategories = category.category_children && category.category_children.length > 0

  // Get all category IDs for product filtering
  const getAllCategoryIds = () => {
    const categoryIds = [category.id]

    // If it's a main category, include all subcategory IDs
    if (isMainCategory && hasSubcategories) {
      category.category_children?.forEach(subcategory => {
        categoryIds.push(subcategory.id)
      })
    }

    return categoryIds
  }

  const categoryIds = getAllCategoryIds()

  // Fetch all products for this category and its subcategories (limit 100)
  let allProducts: HttpTypes.StoreProduct[] = []
  let count = 0

  try {
    const response = await listProductsWithSort({
      page: 1,
      queryParams: {
        category_id: categoryIds,
        limit: 100,
      } as any,
      sortBy: sort,
      countryCode,
    })

    allProducts = response.response.products || []
    count = response.response.count || 0
  } catch (error) {
    console.error('Error fetching products:', error)
    allProducts = []
    count = 0
  }

  // Fetch region once
  const region = await getRegion(countryCode)
  if (!region) notFound()

  // Filter products based on query params
  let filteredProducts = allProducts
  const params = await searchParams

  if (params) {
    // Filter by price
    const minPrice = params.minPrice ? Number(params.minPrice) : undefined
    const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined

    if (minPrice !== undefined || maxPrice !== undefined) {
      console.log('Filtering by price:', { minPrice, maxPrice })
      console.log('Total products before filtering:', filteredProducts.length)

      filteredProducts = filteredProducts.filter((product: any) =>
        product.variants?.some((variant: any) => {
          // Use the new price structure with calculated_price
          if (variant.calculated_price) {
            const priceValue = variant.calculated_price.calculated_amount / 100
            console.log(`Product ${product.title}, Variant ${variant.id}: $${priceValue}`)

            if (minPrice !== undefined && priceValue < minPrice) {
              console.log(`  - Excluded: price $${priceValue} < min $${minPrice}`)
              return false
            }
            if (maxPrice !== undefined && priceValue > maxPrice) {
              console.log(`  - Excluded: price $${priceValue} > max $${maxPrice}`)
              return false
            }
            console.log(`  - Included: price $${priceValue} within range`)
            return true
          }
          return false
        })
      )

      console.log('Total products after filtering:', filteredProducts.length)
    }

    // Filter by options - only show products that have variants with the selected options
    const options: Record<string, string[]> = {}
    Object.entries(params).forEach(([key, value]) => {
      if (key.startsWith('opt_')) {
        const optionTitle = key.replace('opt_', '')
        if (!options[optionTitle]) {
          options[optionTitle] = []
        }
        // Handle both single values and arrays
        if (Array.isArray(value)) {
          options[optionTitle].push(...value)
        } else if (typeof value === 'string') {
          options[optionTitle].push(value)
        }
      }
    })

    Object.entries(options).forEach(([optionTitle, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        filteredProducts = filteredProducts.filter((product: any) =>
          product.variants?.some((variant: any) =>
            variant.options?.some((opt: any) =>
              opt.option_title === optionTitle && values.includes(opt.value)
            )
          )
        )
      }
    })
  }

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container gap-6"
      data-testid="category-container"
    >
      <RefinementList
        category={category}
        products={allProducts}
        data-testid="sort-by-container"
      />
      <div className="w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-row mb-4 text-2xl-semi gap-4">
          {parents &&
            parents.map((parent: any) => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>

        {/* Category Description */}
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}

        {/* Products Section */}
        <PaginatedProducts
          page={pageNumber}
          products={filteredProducts}
          region={region}
        />
      </div>
    </div>
  )
}
