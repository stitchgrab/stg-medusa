"use client"

import React from "react"
import Accordion from "@modules/products/components/product-tabs/accordion"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

interface ProductOption {
  id: string
  title: string
  values: string[]
}

interface FilterProductOptionsProps {
  options: ProductOption[]
}

const FilterProductOptions: React.FC<FilterProductOptionsProps> = ({ options }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Get current selected options from URL params
  const getSelectedOptions = () => {
    const selected: Record<string, string[]> = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith('opt_')) {
        const optionTitle = key.replace('opt_', '')
        if (!selected[optionTitle]) {
          selected[optionTitle] = []
        }
        selected[optionTitle].push(value)
      }
    })
    return selected
  }

  const handleChange = (optionTitle: string, value: string) => {
    const currentSelected = getSelectedOptions()
    const currentValues = currentSelected[optionTitle] || []

    let newValues: string[]
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value)
    } else {
      newValues = [...currentValues, value]
    }

    // Update URL directly
    const params = new URLSearchParams(searchParams)

    // Remove existing values for this option
    searchParams.forEach((val, key) => {
      if (key === `opt_${optionTitle}`) {
        params.delete(key)
      }
    })

    // Add new values
    newValues.forEach(val => {
      params.append(`opt_${optionTitle}`, val)
    })

    router.push(`${pathname}?${params.toString()}`)
  }

  if (!options || options.length === 0) return null

  return (
    <Accordion type="multiple">
      {options.map(option => (
        <Accordion.Item key={option.id} value={option.id} title={option.title}>
          <div className="flex flex-col gap-2">
            {option.values.map(value => {
              const currentSelected = getSelectedOptions()
              const isChecked = currentSelected[option.title]?.includes(value) || false

              return (
                <label key={value} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleChange(option.title, value)}
                    className="accent-stitchgrab-accent"
                  />
                  {value}
                </label>
              )
            })}
          </div>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}

export default FilterProductOptions
