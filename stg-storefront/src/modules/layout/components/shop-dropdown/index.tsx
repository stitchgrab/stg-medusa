"use client"

import { useState } from "react"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import { HttpTypes } from "@medusajs/types"

interface ShopDropdownProps {
  categories?: HttpTypes.StoreProductCategory[]
}

const ShopDropdown = ({ categories }: ShopDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
        SHOP
        <ChevronDown size="16" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="space-y-2">
              <LocalizedClientLink
                href="/store"
                className="block py-2 px-3 text-sm hover:bg-gray-100 rounded"
              >
                All Products
              </LocalizedClientLink>
              
              {categories?.slice(0, 8).map((category) => (
                <LocalizedClientLink
                  key={category.id}
                  href={`/categories/${category.handle}`}
                  className="block py-2 px-3 text-sm hover:bg-gray-100 rounded"
                >
                  {category.name}
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopDropdown 