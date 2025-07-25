"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const styles = [
  {
    name: "Hats",
    description: "Trendy headwear",
    image: "/images/styles/hats.png", // ✅ Available asset
    href: "/store?categories=hats"
  },
  {
    name: "Dresses",
    description: "Elegant dresses",
    image: "/images/styles/dresses.png", // ✅ Available asset
    href: "/store?categories=dresses"
  },
  {
    name: "Hoodies",
    description: "Comfortable hoodies",
    image: "/images/styles/hoodies.png", // ✅ Available asset
    href: "/store?categories=hoodies"
  },
  {
    name: "Sportswear",
    description: "Athletic wear",
    image: "/images/styles/sportswear.png", // ✅ Available asset
    href: "/store?categories=sportswear"
  }
]

const PopularStyles = () => {
  return (
    <section className="py-8 lg:py-12 bg-white">
      <div className="content-container">
        {/* Section Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-1">Fan-favorite styles: shop popular looks delivered today</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-wide">
            POPULAR STYLES
          </h2>
        </div>

        {/* Desktop Grid - 4 columns */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {styles.map((style, index) => (
            <LocalizedClientLink
              key={style.name}
              href={style.href}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  sizes="25vw"
                  className="object-cover"
                  priority={index < 2}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Style Label */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
                  {style.name}
                </h3>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </LocalizedClientLink>
          ))}
        </div>

        {/* Tablet Grid - 2x2 */}
        <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-6">
          {styles.map((style, index) => (
            <LocalizedClientLink
              key={style.name}
              href={style.href}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  sizes="50vw"
                  className="object-cover"
                  priority={index < 2}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Style Label */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
                  {style.name}
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
            {styles.map((style, index) => (
              <LocalizedClientLink
                key={style.name}
                href={style.href}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] flex-none w-64 snap-start hover:scale-[1.02] transition-transform duration-300"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={style.image}
                    alt={style.name}
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Style Label */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
                    {style.name}
                  </h3>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PopularStyles 