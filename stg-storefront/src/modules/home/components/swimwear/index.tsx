import { Button } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"

export default async function Swimwear({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  // Fetch only 2 products as specified
  const { response: { products } } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 2, // ✅ LIMITED TO 2 PRODUCTS ONLY
      fields: "*variants.calculated_price",
    },
  })

  return (
    <section className="py-8 lg:py-12 bg-gray-50">
      <div className="content-container">
        {/* Section Header & Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Content Area */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Shop All Swim & Resort Wear And Have It Delivered Today
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                LET'S GET WAVY
              </h2>
              <LocalizedClientLink href="/categories/swimwear">
                <Button
                  size="large"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-base font-semibold rounded-lg"
                >
                  SHOP NOW →
                </Button>
              </LocalizedClientLink>
            </div>

            {/* Desktop Product Grid - 2 products */}
            <div className="hidden lg:grid lg:grid-cols-1 gap-6 pt-8">
              {products.slice(0, 2).map((product) => {
                const { cheapestPrice } = getProductPrice({
                  product,
                })

                return (
                  <LocalizedClientLink
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex">
                      {/* Product Image */}
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <Image
                          src={product.thumbnail || "/images/products/placeholder.jpg"}
                          alt={product.title || "Product"}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-gray-900">
                              {cheapestPrice?.calculated_price}
                            </span>
                            {cheapestPrice?.price_type === "sale" && (
                              <span className="text-sm text-gray-500 line-through">
                                {cheapestPrice?.original_price}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Available for delivery</span>
                        </div>
                      </div>
                    </div>
                  </LocalizedClientLink>
                )
              })}
            </div>
          </div>

          {/* Right Lifestyle Image */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="/images/lifestyle/swim_main.png" // ✅ Available asset
              alt="Let's Get Wavy Lifestyle"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Mobile Product Grid - Horizontal Scroll */}
        <div className="lg:hidden mt-8">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
            {products.slice(0, 2).map((product) => {
              const { cheapestPrice } = getProductPrice({
                product,
              })

              return (
                <LocalizedClientLink
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex-none w-80 snap-start"
                >
                  <div className="p-4">
                    {/* Product Image */}
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                      <Image
                        src={product.thumbnail || "/images/products/placeholder.jpg"}
                        alt={product.title || "Product"}
                        fill
                        sizes="288px"
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {cheapestPrice?.calculated_price}
                        </span>
                        {cheapestPrice?.price_type === "sale" && (
                          <span className="text-sm text-gray-500 line-through">
                            {cheapestPrice?.original_price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Available for delivery</span>
                      </div>
                    </div>
                  </div>
                </LocalizedClientLink>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
} 