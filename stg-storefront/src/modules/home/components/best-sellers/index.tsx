"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const brands = [
  {
    id: "new-balance",
    name: "New Balance",
    image: "/images/best-sellers/newbalance.png", // ✅ Available asset
    href: "/brands/new-balance"
  },
  {
    id: "na-lei",
    name: "Na Lei Boho Clothier", 
    image: "/images/best-sellers/nalei.png", // ✅ Available asset
    href: "/brands/na-lei"
  },
  {
    id: "trth-brand",
    name: "Trth Brand",
    image: "/images/best-sellers/trth.png", // ✅ Available asset
    href: "/brands/trth"
  },
  {
    id: "soleman",
    name: "Soleman",
    image: "/images/best-sellers/soleman.png", // ✅ Available asset
    href: "/brands/soleman"
  }
]

const BestSellers = () => {
  return (
    <section className="py-8 lg:py-12 bg-white">
      <div className="content-container">
        {/* Section Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-1">Top trends, no wait: best sellers delivered today</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-wide">
            BEST SELLERS
          </h2>
        </div>

        {/* Desktop Grid - 4 columns on large, 2 on medium */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <LocalizedClientLink
              key={brand.id}
              href={brand.href}
              className="group relative overflow-hidden rounded-2xl aspect-square hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Brand Image */}
              <div className="absolute inset-0">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="25vw"
                  className="object-cover"
                  priority={index < 2}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Brand Label */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
                  {brand.name}
                </h3>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </LocalizedClientLink>
          ))}
        </div>

        {/* Tablet Grid - 2x2 */}
        <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-6">
          {brands.map((brand, index) => (
            <LocalizedClientLink
              key={brand.id}
              href={brand.href}
              className="group relative overflow-hidden rounded-2xl aspect-square hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Brand Image */}
              <div className="absolute inset-0">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="50vw"
                  className="object-cover"
                  priority={index < 2}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Brand Label */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
                  {brand.name}
                </h3>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </LocalizedClientLink>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
            {brands.map((brand, index) => (
              <LocalizedClientLink
                key={brand.id}
                href={brand.href}
                className="group relative overflow-hidden rounded-2xl aspect-square flex-none w-64 snap-start hover:scale-[1.02] transition-transform duration-300"
              >
                {/* Brand Image */}
                <div className="absolute inset-0">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Brand Label */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
                    {brand.name}
                  </h3>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </LocalizedClientLink>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <LocalizedClientLink href="/brands">
            <button className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              View All Brands →
            </button>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default BestSellers 