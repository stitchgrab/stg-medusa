"use client"

import React, { useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

interface PriceData {
  id: string
  price: number
}

interface PriceRange {
  label: string
  min: number | null
  max: number | null
}

interface FilterPriceProps {
  products: PriceData[]
}

const getPriceRanges = (min: number, max: number): PriceRange[] => {
  // Create 6 ranges between min and max
  const steps = [
    { label: `Under $${Math.round(min + (max - min) * 0.15)}`, min: null, max: Math.round(min + (max - min) * 0.15) },
    { label: `$${Math.round(min + (max - min) * 0.15)} to $${Math.round(min + (max - min) * 0.3)}`, min: Math.round(min + (max - min) * 0.15), max: Math.round(min + (max - min) * 0.3) },
    { label: `$${Math.round(min + (max - min) * 0.3)} to $${Math.round(min + (max - min) * 0.5)}`, min: Math.round(min + (max - min) * 0.3), max: Math.round(min + (max - min) * 0.5) },
    { label: `$${Math.round(min + (max - min) * 0.5)} to $${Math.round(min + (max - min) * 0.7)}`, min: Math.round(min + (max - min) * 0.5), max: Math.round(min + (max - min) * 0.7) },
    { label: `$${Math.round(min + (max - min) * 0.7)} to $${Math.round(min + (max - min) * 0.9)}`, min: Math.round(min + (max - min) * 0.7), max: Math.round(min + (max - min) * 0.9) },
    { label: `Over $${Math.round(min + (max - min) * 0.9)}`, min: Math.round(min + (max - min) * 0.9), max: null },
  ]
  return steps
}

const FilterPrice: React.FC<FilterPriceProps> = ({ products }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const prices = useMemo(() => products.map(p => p.price).sort((a, b) => a - b), [products])
  const min = prices[0] || 0
  const max = prices[prices.length - 1] || 1000

  // Only create ranges if we have actual price data
  const ranges = useMemo(() => {
    if (prices.length === 0 || min === max) {
      return []
    }
    return getPriceRanges(min, max)
  }, [min, max, prices.length])

  // Get current selected ranges from URL params
  const getSelectedRanges = () => {
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    if (!minPrice && !maxPrice) return []

    const selectedRanges: number[] = []
    const currentMin = minPrice ? Number(minPrice) : 0
    const currentMax = maxPrice ? Number(maxPrice) : Infinity

    ranges.forEach((range, idx) => {
      const rangeMin = range.min || 0
      const rangeMax = range.max || Infinity

      // Check if this range overlaps with the current price selection
      let isSelected = false

      if (minPrice && maxPrice) {
        // Both min and max are set - check if this range contributes to the selection
        // A range is selected if it's within or overlaps with the current selection
        if (rangeMin <= currentMin && rangeMax >= currentMax) {
          isSelected = true
        } else if (rangeMin >= currentMin && rangeMin <= currentMax) {
          isSelected = true
        } else if (rangeMax >= currentMin && rangeMax <= currentMax) {
          isSelected = true
        }
      } else if (minPrice) {
        // Only min is set - check if this range starts at or after the min price
        if (rangeMin >= currentMin) {
          isSelected = true
        }
      } else if (maxPrice) {
        // Only max is set - check if this range ends at or before the max price
        if (rangeMax <= currentMax) {
          isSelected = true
        }
      }

      if (isSelected) {
        selectedRanges.push(idx)
      }
    })

    return selectedRanges
  }

  const handleChange = (idx: number) => {
    const currentSelected = getSelectedRanges()
    let newSelected: number[]

    if (currentSelected.includes(idx)) {
      newSelected = currentSelected.filter(i => i !== idx)
    } else {
      newSelected = [...currentSelected, idx]
    }

    // Update URL directly
    const params = new URLSearchParams(searchParams)

    // Clear existing price params
    params.delete('minPrice')
    params.delete('maxPrice')

    // Add new price params based on selected ranges
    if (newSelected.length > 0) {
      const selectedRanges = newSelected.map(i => ranges[i])
      const minPrice = Math.min(...selectedRanges.map(r => r.min || 0))
      const maxPrice = Math.max(...selectedRanges.map(r => r.max || Infinity))



      if (minPrice > 0) params.set('minPrice', minPrice.toString())
      if (maxPrice < Infinity) params.set('maxPrice', maxPrice.toString())
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-2">
      {ranges.length === 0 ? (
        <div className="text-sm text-gray-500">No price data available</div>
      ) : (
        ranges.map((range, idx) => {
          const currentSelected = getSelectedRanges()
          const isChecked = currentSelected.includes(idx)



          return (
            <label key={idx} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleChange(idx)}
                className="accent-stitchgrab-accent"
              />
              {range.label}
            </label>
          )
        })
      )}
    </div>
  )
}

export default FilterPrice