"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const brands = [
  {
    id: "legends-miami",
    name: "Legends of Miami",
    logo: "/images/brands/legends_of_miami.png", // ✅ Available asset
    href: "/brands/legends-miami"
  },
  {
    id: "kasiopya",
    name: "KASIOPYA",
    logo: "/images/brands/kasiopya.png", // ✅ Available asset
    href: "/brands/kasiopya"
  },
  {
    id: "mabel-love",
    name: "Mabel Love",
    logo: "/images/brands/mabel_love.png", // ✅ Available asset
    href: "/brands/mabel-love"
  },
  {
    id: "sweet-penelope",
    name: "Sweet Penelope",
    logo: "/images/brands/sweet_penelope.png", // ✅ Available asset
    href: "/brands/sweet-penelope"
  },
  {
    id: "sb",
    name: "SB",
    logo: "/images/brands/sb.png", // ✅ Available asset
    href: "/brands/sb"
  },
  {
    id: "trth-brand",
    name: "Trth Brand",
    logo: "/images/brands/trth_brand.png", // ✅ Available asset
    href: "/brands/trth"
  },
  {
    id: "maly",
    name: "MALY",
    logo: "/images/brands/maly.png", // ✅ Available asset
    href: "/brands/maly"
  },
  {
    id: "mita",
    name: "MITA",
    logo: "/images/brands/mita.png", // ✅ Available asset
    href: "/brands/mita"
  },
  {
    id: "hot-box",
    name: "Hot Box",
    logo: "/images/brands/hot_box.png", // ✅ Available asset
    href: "/brands/hot-box"
  },
  {
    id: "lnf",
    name: "LNF",
    logo: "/images/brands/lnf.png", // ✅ Available asset
    href: "/brands/lnf"
  }
]

const BrandCircle = ({ brand }: { brand: typeof brands[0] }) => {
  return (
    <LocalizedClientLink
      href={brand.href}
      className="group flex-shrink-0"
    >
      <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center p-3">
        <Image
          src={brand.logo}
          alt={brand.name}
          width={64}
          height={64}
          className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
        />
      </div>
    </LocalizedClientLink>
  )
}

const PopularBrands = () => {
  return (
    <section className="py-8 lg:py-12 bg-white">
      <div className="content-container">
        {/* Section Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-1">Popular Brands</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-wide">
            BRANDS
          </h2>
        </div>

        {/* Desktop Grid - 2 rows of 5 brands */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-5 gap-8 justify-items-center">
            {/* First row - 5 brands */}
            {brands.slice(0, 5).map((brand) => (
              <BrandCircle key={brand.id} brand={brand} />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-8 justify-items-center mt-8">
            {/* Second row - 5 brands */}
            {brands.slice(5, 10).map((brand) => (
              <BrandCircle key={brand.id} brand={brand} />
            ))}
          </div>
        </div>

        {/* Tablet Grid - 2 rows */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-5 gap-6 justify-items-center">
            {/* First row - 5 brands */}
            {brands.slice(0, 5).map((brand) => (
              <BrandCircle key={brand.id} brand={brand} />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-6 justify-items-center mt-6">
            {/* Second row - 5 brands */}
            {brands.slice(5, 10).map((brand) => (
              <BrandCircle key={brand.id} brand={brand} />
            ))}
          </div>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
            {brands.map((brand) => (
              <div key={brand.id} className="snap-start">
                <BrandCircle brand={brand} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Brands Button */}
        <div className="text-center mt-12">
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

export default PopularBrands 