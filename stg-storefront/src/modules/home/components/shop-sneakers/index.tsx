import { Button } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"

export default async function ShopSneakers({
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
    <section className="py-8 lg:py-12 bg-white">
      <div className="content-container">
        {/* Section Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-1">Get It Within Hours</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-wide mb-4">
            SHOP ALL SNEAKERS
          </h2>
          <LocalizedClientLink href="/categories/sneakers">
            <Button
              variant="secondary"
              className="border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-full px-6 py-2 text-sm font-medium"
            >
              SHOP NOW →
            </Button>
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left side - Hero Image */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden">
            <Image
              src="/images/sneakers/sneaker.png" // ✅ Available asset
              alt="Shop All Sneakers"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Right side - Product Grid (Maximum 2 products) */}
          <div className="space-y-4">
            {/* Desktop Grid - 2 products max */}
            <div className="hidden lg:grid lg:grid-cols-1 gap-4">
              {products.slice(0, 2).map((product) => {
                const { cheapestPrice } = getProductPrice({
                  product,
                })

                return (
                  <LocalizedClientLink
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="flex">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={product.thumbnail || "/images/products/placeholder.jpg"}
                          alt={product.title || "Product"}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 p-4">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                          {product.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base font-bold text-gray-900">
                            {cheapestPrice?.calculated_price}
                          </span>
                          {cheapestPrice?.price_type === "sale" && (
                            <span className="text-xs text-gray-500 line-through">
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

            {/* Mobile/Tablet - Show products in simple grid */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.slice(0, 2).map((product) => {
                const { cheapestPrice } = getProductPrice({
                  product,
                })

                return (
                  <LocalizedClientLink
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="aspect-square relative mb-3">
                      <Image
                        src={product.thumbnail || "/images/products/placeholder.jpg"}
                        alt={product.title || "Product"}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base font-bold text-gray-900">
                          {cheapestPrice?.calculated_price}
                        </span>
                        {cheapestPrice?.price_type === "sale" && (
                          <span className="text-xs text-gray-500 line-through">
                            {cheapestPrice?.original_price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Available</span>
                      </div>
                    </div>
                  </LocalizedClientLink>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 