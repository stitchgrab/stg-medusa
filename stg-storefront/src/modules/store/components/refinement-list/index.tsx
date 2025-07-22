"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import FilterCategories from "./filter/filter-categories"
import { HttpTypes } from "@medusajs/types"
import FilterPrice from "./filter/filter-price"
import FilterProductOptions from "./filter/filter-options"
import Accordion from "@modules/products/components/product-tabs/accordion"

type RefinementListProps = {
  category?: HttpTypes.StoreProductCategory
  products: HttpTypes.StoreProduct[]
}

const RefinementList = ({ category, products = [] }: RefinementListProps) => {
  const allCategories = JSON.parse(localStorage.getItem('allCategories') || '[]')
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )


  useEffect(() => {
    if (category?.category_children && category?.category_children?.length > 0) {
      localStorage.setItem('allCategories', JSON.stringify(category?.category_children))
    }
  }, [category])

  useEffect(() => {
    if (pathname.search(/categories\/[a-z0-9-]+/)) {
      setIsOpen(true)
    }
  }, [pathname])

  // --- Price Aggregation ---
  let allPrices: { id: string; price: number }[] = []
  products.forEach((product) => {
    if (product.variants) {
      (product.variants as any[]).forEach((variant) => {
        if (variant.calculated_price) {
          allPrices.push({ id: variant.id, price: variant.calculated_price.calculated_amount })
        }
      })
    }
  })

  // --- Option Aggregation ---
  // Deduplicate by option title, aggregate all values for each title
  let optionMap: Record<string, { id: string; title: string; values: Set<string> }> = {}
  products.forEach((product) => {
    if (product.options) {
      product.options.forEach((option) => {
        // Use option.title as the deduplication key
        if (!optionMap[option.title]) {
          optionMap[option.title] = {
            id: option.id, // Use the first encountered id for this title
            title: option.title,
            values: new Set<string>(),
          }
        }
        if (product.variants) {
          (product.variants as any[]).forEach((variant) => {
            if (variant.options) {
              const match = variant.options.find((vo: any) => vo.option_id === option.id)
              if (match && match.value) {
                optionMap[option.title].values.add(match.value)
              }
            }
          })
        }
      })
    }
  })
  const allOptions = Object.values(optionMap).map((o) => ({
    id: o.id,
    title: o.title,
    values: Array.from(o.values),
  }))

  const retrieveDefaultValues = () => {
    const params = new URLSearchParams(searchParams)
    const categories = pathname.includes('categories') ? "categories" : null
    const price = params.get('minPrice') || params.get('maxPrice') ? "price" : null

    const defaultValues = [categories, price]
    return defaultValues.filter(value => value !== null)
  }

  const retrieveOptionDefaultValues = () => {
    const params = new URLSearchParams(searchParams)

    // Find option IDs for Color and Size based on their titles
    const colorOption = allOptions.find(opt => opt.title === 'Color')
    const sizeOption = allOptions.find(opt => opt.title === 'Size')
    const color = params.get('opt_Color') && colorOption ? colorOption.id : null
    const size = params.get('opt_Size') && sizeOption ? sizeOption.id : null

    const defaultValues = [color, size]
    return defaultValues.filter(value => value !== null)
  }

  return (
    <div className="flex small:flex-col gap-12 py-4 small:px-0 pl-6 small:min-w-[250px]">
      <Accordion type="multiple" defaultValue={retrieveDefaultValues()}>
        {category && (
          <Accordion.Item value="categories" title="Categories">
            <FilterCategories category={category} currentPathname={pathname} allCategories={allCategories} />
          </Accordion.Item>
        )}
        <Accordion.Item value="price" title="Price">
          <FilterPrice products={allPrices} />
        </Accordion.Item>
        <FilterProductOptions options={allOptions} defaultOpenOptions={retrieveOptionDefaultValues()} />
      </Accordion>
    </div>
  )
}

export default RefinementList
