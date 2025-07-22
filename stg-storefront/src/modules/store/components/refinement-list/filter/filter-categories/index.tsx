import { HttpTypes } from "@medusajs/types"
import InteractiveLink from "@modules/common/components/interactive-link"
import { clx } from "@medusajs/ui"
import Link from "next/link"

const FilterCategories: React.FC<{
  category: HttpTypes.StoreProductCategory
  currentPathname: string
  allCategories: HttpTypes.StoreProductCategory[]
}> = ({ category, currentPathname, allCategories }) => {
  // Get the categories to display - either children or siblings
  const categoriesToShow = allCategories

  if (categoriesToShow.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {categoriesToShow.map((subcategory) => {
        const isActive = currentPathname.includes(`/categories/${subcategory.handle}`)

        return (
          <div key={subcategory.id} className="flex items-center">
            <div className={clx(
              "text-sm transition-colors flex items-center gap-2",
              isActive
                ? "color-1 font-medium"
                : "text-gray-700 hover:color-1"
            )}>
              <Link href={`/categories/${subcategory.handle}`}>
                <span className={clx(
                  "w-2 h-2 rounded-full",
                  isActive
                    ? "bg-color-1"
                    : "bg-gray-700"
                )}></span>
                {subcategory.name}
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FilterCategories