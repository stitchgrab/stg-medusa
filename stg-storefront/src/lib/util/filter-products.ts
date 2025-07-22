import { HttpTypes } from "@medusajs/types"

export interface PriceFilter {
  minPrice?: number
  maxPrice?: number
}

export interface OptionFilter {
  [optionTitle: string]: string[]
}

export interface SubcategoryFilter {
  subcategories: string[]
}

/**
 * Filter products by subcategory IDs
 * @param products - Array of products to filter
 * @param subcategoryFilter - Object containing array of subcategory IDs
 * @returns Filtered products that belong to the selected subcategories
 */
export function filterProductsBySubcategories(
  products: HttpTypes.StoreProduct[],
  subcategoryFilter: SubcategoryFilter
): HttpTypes.StoreProduct[] {
  const { subcategories } = subcategoryFilter

  if (!subcategories || subcategories.length === 0) {
    return products
  }

  return products.filter((product) =>
    product.categories?.some((category: any) => {
      // Check if the product's category ID matches any of the selected subcategory IDs
      return subcategories.includes(category.id)
    })
  )
}

/**
 * Filter products by price range
 * @param products - Array of products to filter
 * @param priceFilter - Object containing minPrice and/or maxPrice
 * @returns Filtered products that have variants within the price range
 */
export function filterProductsByPrice(
  products: HttpTypes.StoreProduct[],
  priceFilter: PriceFilter
): HttpTypes.StoreProduct[] {
  const { minPrice, maxPrice } = priceFilter

  if (minPrice === undefined && maxPrice === undefined) {
    return products
  }

  return products.filter((product) =>
    product.variants?.some((variant: any) => {
      if (variant.calculated_price) {
        const priceValue = variant.calculated_price.calculated_amount

        if (minPrice !== undefined && priceValue < minPrice) {
          return false
        }
        if (maxPrice !== undefined && priceValue > maxPrice) {
          return false
        }
        return true
      }
      return false
    })
  )
}

/**
 * Filter products by product options
 * @param products - Array of products to filter
 * @param optionFilter - Object where keys are option titles and values are arrays of acceptable values
 * @returns Filtered products that have variants with the selected options
 */
export function filterProductsByOptions(
  products: HttpTypes.StoreProduct[],
  optionFilter: OptionFilter
): HttpTypes.StoreProduct[] {
  if (!optionFilter || Object.keys(optionFilter).length === 0) {
    return products
  }

  return products.filter((product) =>
    product.variants?.some((variant: any) =>
      variant.options?.every((opt: any) => {
        const optionTitle = opt.option.title
        const optionValue = opt.value

        // If this option is not in our filter, it's acceptable
        if (!optionFilter[optionTitle]) {
          return true
        }

        // Check if the variant's option value is in our acceptable values
        return optionFilter[optionTitle].includes(optionValue)
      })
    )
  )
}

/**
 * Filter products by subcategories, price and options
 * @param products - Array of products to filter
 * @param subcategoryFilter - Object containing array of subcategory IDs
 * @param priceFilter - Object containing minPrice and/or maxPrice
 * @param optionFilter - Object where keys are option titles and values are arrays of acceptable values
 * @returns Filtered products that meet all criteria
 */
export function filterProducts(
  products: HttpTypes.StoreProduct[],
  priceFilter?: PriceFilter,
  optionFilter?: OptionFilter
): HttpTypes.StoreProduct[] {
  let filteredProducts = products

  if (priceFilter) {
    filteredProducts = filterProductsByPrice(filteredProducts, priceFilter)
  }

  if (optionFilter) {
    filteredProducts = filterProductsByOptions(filteredProducts, optionFilter)
  }

  return filteredProducts
}

/**
 * Parse search parameters into filter objects
 * @param searchParams - URL search parameters
 * @returns Object containing priceFilter and optionFilter
 */
export function parseSearchParamsToFilters(searchParams: { [key: string]: string | string[] | undefined }): {
  priceFilter: PriceFilter
  optionFilter: OptionFilter
} {
  const priceFilter: PriceFilter = {}
  const optionFilter: OptionFilter = {}

  // Parse price filters
  if (searchParams.minPrice) {
    const minPrice = Number(searchParams.minPrice)
    if (!isNaN(minPrice)) {
      priceFilter.minPrice = minPrice
    }
  }

  if (searchParams.maxPrice) {
    const maxPrice = Number(searchParams.maxPrice)
    if (!isNaN(maxPrice)) {
      priceFilter.maxPrice = maxPrice
    }
  }

  // Parse option filters
  Object.entries(searchParams).forEach(([key, value]) => {
    if (key.startsWith('opt_')) {
      const optionTitle = key.replace('opt_', '')
      if (!optionFilter[optionTitle]) {
        optionFilter[optionTitle] = []
      }

      // Handle both single values and arrays
      if (Array.isArray(value)) {
        optionFilter[optionTitle].push(...value)
      } else if (typeof value === 'string') {
        optionFilter[optionTitle].push(value)
      }
    }
  })

  return { priceFilter, optionFilter }
} 