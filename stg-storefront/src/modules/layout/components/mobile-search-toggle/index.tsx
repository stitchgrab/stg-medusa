"use client"

import { useState } from "react"
import Search from "@modules/common/icons/search"
import SearchBar from "@modules/layout/components/search-bar"

const MobileSearchToggle = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  return (
    <>
      <button 
        onClick={toggleSearch}
        className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Toggle search"
      >
        <Search size="18" className="sm:w-5 sm:h-5 text-gray-600" />
      </button>
      
      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 px-3 sm:px-4 pb-4 bg-white border-b border-gray-200">
          <SearchBar />
        </div>
      )}
    </>
  )
}

export default MobileSearchToggle 