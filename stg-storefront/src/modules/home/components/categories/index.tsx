"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categories = [
  {
    name: "For Men",
    handle: "men",
    image: "/images/categories/men.png", // ✅ Available asset
    href: "/categories/men"
  },
  {
    name: "For Women",
    handle: "women",
    image: "/images/categories/women.png", // ✅ Available asset
    href: "/categories/women"
  },
  {
    name: "Vintage",
    handle: "vintage",
    image: "/images/categories/vintage.png", // ✅ Available asset
    href: "/categories/women-vintage"
  },
  {
    name: "Streetwear",
    handle: "streetwear",
    image: "/images/categories/streetwear.png", // ✅ Available asset
    href: "/categories/men-streetwear"
  },
  {
    name: "Accessories",
    handle: "accessories",
    image: "/images/categories/accessories.png", // ✅ Available asset
    href: "/categories/women-accessories"
  },
  {
    name: "Denim",
    handle: "denim",
    image: "/images/categories/denim.png", // ✅ Available asset
    href: "/categories/women-denim"
  }
]

const Categories = () => {
  return (
    <section className="py-8 lg:py-12 bg-white">
      <div className="content-container">
        {/* Section Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-1">Shop by category: find your style delivered fast</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-wide">
            SHOP BY CATEGORIES
          </h2>
        </div>

        {/* Desktop Grid - 3x2 */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <LocalizedClientLink
              key={category.handle}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="33vw"
                  className="object-cover"
                  priority={index < 3}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Category Label */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg lg:text-xl tracking-wide drop-shadow-lg">
                  {category.name}
                </h3>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </LocalizedClientLink>
          ))}
        </div>

        {/* Tablet Grid - 2x3 */}
        <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <LocalizedClientLink
              key={category.handle}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="50vw"
                  className="object-cover"
                  priority={index < 2}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Category Label */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
                  {category.name}
                </h3>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </LocalizedClientLink>
          ))}
        </div>

        {/* Mobile Grid - 2x3 */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <LocalizedClientLink
              key={category.handle}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Category Label */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-base tracking-wide drop-shadow-lg">
                  {category.name}
                </h3>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories 